<?php
namespace App\Controller\Api;

use App\Controller\Api\AppController;

/**
 * Projects Controller
 *
 * @property \App\Model\Table\ProjectsTable $Projects
 */
class ProjectsController extends AppController
{

    public $paginate = [
        'page' => 1,
        'limit' => 5,
        'maxLimit' => 1
    ];

    public function _beforeFind(\Cake\Event\Event $event) {
        $event->subject->query->where(['user_id' => $this->Auth->user('id')]);
    }

    public function _beforeSave(\Cake\Event\Event $event) {
        $event->subject->entity->set('user_id',$this->Auth->user('id'));
        $event->subject->entity->set('status',1);
    }

    public function _beforeDelete(\Cake\Event\Event $event) {
        if($event->subject->entity->user_id !== $this->Auth->user('id')) {
            $event->stopPropagation();
        }
    }

    public function add(){
        $this->Crud->on('beforeSave', [$this, '_beforeSave']);
        return $this->Crud->execute();
    }

    public function index(){
        $this->Crud->on('beforePaginate', [$this, '_beforeFind']);
        return $this->Crud->execute();
    }

    public function view($id){
        $this->Crud->on('beforeFind', [$this, '_beforeFind']);
        return $this->Crud->execute();
    }

    public function delete(){
        $this->Crud->on('beforeDelete', [$this, '_beforeDelete']);
        return $this->Crud->execute();
    }

}
