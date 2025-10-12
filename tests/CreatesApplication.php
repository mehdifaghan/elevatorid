<?php

namespace Tests;

use Illuminate\Contracts\Console\Kernel;

trait CreatesApplication
{
    public function createApplication()
    {
        return require __DIR__.'/../bootstrap/app.php';
    }
}
