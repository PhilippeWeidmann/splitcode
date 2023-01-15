<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

class SandboxFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array
     */
    public function definition()
    {
        return [
            "content" => $this->faker->paragraphs($this->faker->numberBetween(3, 15), true),
        ];
    }
}
