<?php

namespace Database\Factories;

use App\Models\AttemptResult;
use App\Models\Exercise;
use App\Models\Sandbox;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class GroupAttemptFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array
     */
    public function definition()
    {
        return [
            "first_user_id" => User::factory(),
            "second_user_id" => User::factory(),
            "exercise_id" => Exercise::factory(),
            "first_user_sandbox_id" => Sandbox::factory(),
            "second_user_sandbox_id" => Sandbox::factory(),
            "shared_sandbox_id" => Sandbox::factory(),
            "attempt_result_id" => AttemptResult::factory(),
            "time_spent_in_seconds_first_user"=> $this->faker->numberBetween(60, 1000),
            "time_spent_in_seconds_second_user"=> $this->faker->numberBetween(60, 1000)
        ];
    }
}
