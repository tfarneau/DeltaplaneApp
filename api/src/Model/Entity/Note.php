<?php
namespace App\Model\Entity;

use Cake\ORM\Entity;

/**
 * Note Entity.
 */
class Note extends Entity
{

    /**
     * Fields that can be mass assigned using newEntity() or patchEntity().
     *
     * @var array
     */
    protected $_accessible = [
        'user_id' => true,
        'project_id' => true,
        'name' => true,
        'content' => true,
        'user' => true,
        'project' => true,
    ];
}
