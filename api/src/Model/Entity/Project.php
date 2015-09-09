<?php
namespace App\Model\Entity;

use Cake\ORM\Entity;

/**
 * Project Entity.
 */
class Project extends Entity
{

    /**
     * Fields that can be mass assigned using newEntity() or patchEntity().
     *
     * @var array
     */
    protected $_accessible = [
        'user_id' => true,
        'status' => true,
        'name' => true,
        'color' => true,
        'description' => true,
        'user' => true,
        'notes' => true,
        'tasks' => true,
        'budget' => true,
        'meta_hours_done' => true,
        'meta_hours_left' => true
    ];
}
