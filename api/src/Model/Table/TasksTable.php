<?php
namespace App\Model\Table;

use App\Model\Entity\Task;
use Cake\ORM\TableRegistry;
use Cake\ORM\Query;
use Cake\ORM\RulesChecker;
use Cake\ORM\Table;
use Cake\Validation\Validator;
use SoftDelete\Model\Table\SoftDeleteTrait;

/**
 * Tasks Model
 */
class TasksTable extends Table
{

    use SoftDeleteTrait;
    protected $softDeleteField = 'deleted_date';

    /**
     * Initialize method
     *
     * @param array $config The configuration for the Table.
     * @return void
     */
    public function initialize(array $config)
    {
        $this->table('tasks');
        $this->displayField('name');
        $this->primaryKey('id');
        $this->addBehavior('Timestamp');
        $this->belongsTo('Users', [
            'foreignKey' => 'user_id'
        ]);
        $this->belongsTo('Projects', [
            'foreignKey' => 'project_id'
        ]);

        $this->addBehavior('CounterCache', [
            'Projects' => [
                'meta_hours_done' => function ($event, $entity, $table) {

                    $tasks = TableRegistry::get('Tasks');
                    $query = $tasks->find('all', [
                        'conditions' => [
                            'Tasks.status' => 1,
                            'Tasks.project_id' => $entity->project_id,
                            'Tasks.user_id' => $entity->user_id
                        ],
                        'fields' => [
                            'Tasks.meta_hours'
                        ],
                        'contain' => [
                        ]
                    ]);

                    $value = 0;
                    foreach($query->toArray() as $k => $v){
                        $value += $v->meta_hours;
                    }

                    return $value;

                },
                'meta_hours_left' => function ($event, $entity, $table) {
                    
                    $tasks = TableRegistry::get('Tasks');
                    $query = $tasks->find('all', [
                        'conditions' => [
                            'Tasks.status' => 0,
                            'Tasks.project_id' => $entity->project_id,
                            'Tasks.user_id' => $entity->user_id
                        ],
                        'fields' => [
                            'Tasks.meta_hours'
                        ],
                        'contain' => [
                        ]
                    ]);

                    $value = 0;
                    foreach($query->toArray() as $k => $v){
                        $value += $v->meta_hours;
                    }

                    return $value;
                    
                }
            ]
        ]);
    }

    /**
     * Default validation rules.
     *
     * @param \Cake\Validation\Validator $validator Validator instance.
     * @return \Cake\Validation\Validator
     */
    public function validationDefault(Validator $validator)
    {
        $validator
            ->add('id', 'valid', ['rule' => 'numeric'])
            ->allowEmpty('id', 'create')
            ->requirePresence('name', 'create')
            ->notEmpty('name')
            ->add('task_when', 'valid', ['rule' => 'datetime'])
            ->requirePresence('user_id', 'create')
            ->notEmpty('user_id')
            ->requirePresence('day', 'create')
            ->notEmpty('day')
            /*->requirePresence('when', 'create')
            ->notEmpty('when')
            ->requirePresence('where', 'create')
            ->notEmpty('where')
            ->requirePresence('who', 'create')
            ->notEmpty('who')*/;

        return $validator;
    }

    /**
     * Returns a rules checker object that will be used for validating
     * application integrity.
     *
     * @param \Cake\ORM\RulesChecker $rules The rules object to be modified.
     * @return \Cake\ORM\RulesChecker
     */
    public function buildRules(RulesChecker $rules)
    {
        $rules->add($rules->existsIn(['user_id'], 'Users'));
        $rules->add($rules->existsIn(['project_id'], 'Projects'));
        return $rules;
    }
}
