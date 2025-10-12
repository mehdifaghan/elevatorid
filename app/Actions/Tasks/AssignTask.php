<?php

namespace App\Actions\Tasks;

use App\Domain\Tasks\Task;
use App\Domain\Users\User;

class AssignTask
{
    public function execute(Task $task, User $technician): Task
    {
        $task->assigned_to_id = $technician->id;
        return $task;
    }
}
