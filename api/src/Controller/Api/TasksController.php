<?php
namespace App\Controller\Api;

use App\Controller\Api\AppController;

/**
 * Tasks Controller
 *
 * @property \App\Model\Table\TasksTable $Tasks
 */
class TasksController extends AppController
{

    public $paginate = [
        'page' => 1,
        'limit' => 9999,
        'maxLimit' => 9999
    ];

    public function _beforeFind(\Cake\Event\Event $event) {
        isset($this->request->query['project_id']) ? $event->subject->query->where(['project_id' =>$this->request->query['project_id']]) : null;
        isset($this->request->query['status']) ? $event->subject->query->where(['status' =>$this->request->query['status']]) : null;
        $event->subject->query->where(['user_id' => $this->Auth->user('id')]);
    }

    public function _beforeSave(\Cake\Event\Event $event) {
        $event->subject->entity->set('user_id',$this->Auth->user('id'));
        $event->subject->entity->set('day',$this->request->data['day']);
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
