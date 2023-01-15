<?php

namespace Database\Factories;

use App\Models\Course;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class CourseFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array
     */
    public function definition()
    {
        return [
            'name' => $this->faker->sentence,
            'description' => $this->faker->paragraph,
            "teacher_id" => User::factory()->teacher(),
            "semester_id" => $this->faker->numberBetween(1, 2),
            "ects" => $this->faker->numberBetween(1, 12),
        ];
    }
    /**
     * The name of the factory's corresponding model.
     *
     * @var string
     */
    protected $model = Course::class;
}
