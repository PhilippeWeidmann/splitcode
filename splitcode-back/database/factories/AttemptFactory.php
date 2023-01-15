<?php

namespace Database\Factories;

use App\Models\AttemptResult;
use App\Models\Exercise;
use App\Models\Sandbox;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class AttemptFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array
     */
    public function definition()
    {
        return [
            "user_id" => User::factory(),
            "exercise_id" => Exercise::factory(),
            "attempt_result_id" => AttemptResult::factory(),
            "sandbox_id" => Sandbox::factory(),
            "time_spent_in_seconds" => $this->faker->numberBetween(60, 1000),
        ];
    }
}
