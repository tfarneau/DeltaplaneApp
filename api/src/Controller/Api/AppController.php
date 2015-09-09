<?php
namespace App\Controller\Api;

use Cake\Controller\Controller;
use Cake\Event\Event;

class AppController extends Controller
{

	use \Crud\Controller\ControllerTrait;

	public $components = [
        'RequestHandler',
        'Crud.Crud' => [
            'actions' => [
                'Crud.Index',
                'Crud.View',
                'Crud.Add',
                'Crud.Edit',
                'Crud.Delete'
            ],
            'listeners' => [
                'Crud.Api',
                'Crud.ApiPagination',
                'Crud.ApiQueryLog'
            ]
        ]
    ];

    public function initialize()
    {
        $this->loadComponent('Auth', [
            'authenticate' => [
                'Form',
                'ADmad/JwtAuth.Jwt' => [
                    'parameter' => '_token',
                    'userModel' => 'Users',
                    'scope' => ['Users.active' => 1],
                    'fields' => [
                        'id' => 'id'
                    ]
                ]
            ]
        ]);
    }

    /*public function beforeFilter(\Cake\Event\Event $event) {
        $this->Crud->mapAction('index', [
            'className' => 'Crud.Index',
            'view' => 'my_index'
        ]);
    }*/

}