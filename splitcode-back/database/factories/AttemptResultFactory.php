<?php

namespace Database\Factories;

use App\Models\Attempt;
use Illuminate\Database\Eloquent\Factories\Factory;

class AttemptResultFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array
     */
    public function definition()
    {
        return [
            "type" => $this->faker->numberBetween(0,2),
            "result" => $this->faker->numberBetween(0,6),
        ];
    }
}
