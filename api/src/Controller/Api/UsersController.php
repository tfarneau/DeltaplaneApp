<?php
namespace App\Controller\Api;

use App\Controller\Api\AppController;
use Cake\Event\Event;
use Cake\Network\Exception\UnauthorizedException;
use Cake\Utility\Security;

class UsersController extends AppController
{
    public function beforeFilter(Event $event)
    {
        parent::beforeFilter($event);
        $this->Auth->allow(['add', 'token', 'testAuth']);
    }

    public function add()
    {
        $this->Crud->on('afterSave', function(\Cake\Event\Event $event) {
            if ($event->subject->created) {
                $this->set('data', [
                    'id' => $event->subject->entity->id,
                    'token' => $token = \JWT::encode(
                        [
                            'id' => $event->subject->entity->id,
                            'exp' =>  time() + 604800
                        ],
                    Security::salt())
                ]);
                $this->Crud->action()->config('serialize.data', 'data');
            }
        });
        return $this->Crud->execute();
    }

    public function testAuth(){

        if($this->Auth->user('id') == null){
            throw new UnauthorizedException('Invalid username or password');
        }else{
            $this->set([
                'success' => true,
                'data' => $this->Auth->user,
                '_serialize' => ['success','data']
            ]);
        }
    }

    public function token()
    {
        $user = $this->Auth->identify();
        if (!$user) {
            throw new UnauthorizedException('Invalid username or password');
        }

        $this->set([
            'success' => true,
            'data' => [
                'token' => $token = \JWT::encode([
                    'id' => $user['id'],
                    'exp' =>  time() + 604800
                ],
                Security::salt())
            ],
            '_serialize' => ['success', 'data']
        ]);
    }

}