<?php
namespace App\Model\Entity;

use Cake\ORM\Entity;

/**
 * Task Entity.
 */
class Task extends Entity
{

    /**
     * Fields that can be mass assigned using newEntity() or patchEntity().
     *
     * @var array
     */
    protected $_accessible = [
        'user_id' => true,
        'name' => true,
        'task_when' => true,
        'task_where' => true,
        'task_who' => true,
        'project_id' => true,
        'user' => true,
        'project' => true,
        'day' => true,
        'status' => true,
        'meta_hours' => true
    ];
}
