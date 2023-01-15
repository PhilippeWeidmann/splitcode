<?php

namespace Database\Seeders;

use App\Models\Attempt;
use App\Models\Course;
use App\Models\Exercise;
use App\Models\GroupAttempt;
use App\Models\User;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     *
     * @return void
     */
    public function run()
    {
        Course::factory()->count(1)->has(
            Exercise::factory()
                ->has(Attempt::factory()->count(100))
                ->has(GroupAttempt::factory()->count(50))
                ->count(3)
        )->create();
        User::factory()->student()->create();
    }
}
