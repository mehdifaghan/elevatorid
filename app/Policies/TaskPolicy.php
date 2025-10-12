<?php

namespace App\Policies;

use App\Domain\Tasks\Task;
use App\Domain\Users\User;

class TaskPolicy
{
    public function view(User $user, Task $task): bool
    {
        return $user->tenant_id === $task->tenant_id;
    }
}
