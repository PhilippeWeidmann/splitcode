<?php

namespace Database\Factories;

use App\Models\Course;
use App\Models\Exercise;
use Illuminate\Database\Eloquent\Factories\Factory;

class ExerciseFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array
     */
    public function definition()
    {
        $soloEndTime = $this->faker->dateTimeBetween('now', '+1 week');
        $endTime = $this->faker->dateTimeBetween($soloEndTime, '+1 week');
        return [
            "title" => $this->faker->sentence,
            "description" => $this->faker->paragraph,
            "start_time" => $this->faker->dateTimeBetween('-1 week'),
            "end_time" => $endTime,
            "course_id" => Course::factory(),
            "notation" => $this->faker->numberBetween(0, 2),
        ];
    }

    /**
     * The name of the factory's corresponding model.
     *
     * @var string
     */
    protected $model = Exercise::class;
}
