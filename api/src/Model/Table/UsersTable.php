<?php
namespace App\Model\Table;

use App\Model\Entity\User;
use Cake\ORM\Query;
use Cake\ORM\RulesChecker;
use Cake\ORM\Table;
use Cake\Validation\Validator;
use SoftDelete\Model\Table\SoftDeleteTrait;

/**
 * Users Model
 */
class UsersTable extends Table
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
        $this->table('users');
        $this->displayField('id');
        $this->primaryKey('id');
        $this->addBehavior('Timestamp');
        $this->hasMany('Notes', [
            'foreignKey' => 'user_id',
            'dependent' => true
        ]);
        $this->hasMany('Projects', [
            'foreignKey' => 'user_id',
            'dependent' => true
        ]);
        $this->hasMany('Tasks', [
            'foreignKey' => 'user_id',
            'dependent' => true
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
            ->requirePresence('username', 'create')
            ->add('username', [
                'length' => [
                    'rule' => ['minLength', 3],
                    'message' => 'Username need to be at least 10 characters long',
                ]
            ])
            ->notEmpty('username')
            ->requirePresence('password', 'create')
            ->add('password', [
                'length' => [
                    'rule' => ['minLength', 6],
                    'message' => 'Password need to be at least 10 characters long',
                ]
            ])
            ->notEmpty('password')
            ->add('active', 'valid', ['rule' => 'boolean'])
            ->allowEmpty('active');

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
        $rules->add($rules->isUnique(['username']));
        return $rules;
    }
}
