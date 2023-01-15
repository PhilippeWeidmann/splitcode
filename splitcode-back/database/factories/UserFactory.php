<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

class UserFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array
     */
    public function definition()
    {
        return [
            'name' => $this->faker->name(),
            'email' => $this->faker->unique()->safeEmail(),
            'email_verified_at' => now(),
            'role' => 'student',
            'password' => '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', // password
            'remember_token' => Str::random(10),
        ];
    }

    /**
     * Indicate that the model's role is teacher.
     *
     * @return Factory
     */
    public function teacher()
    {
        return $this->state(function (array $attributes) {
            return [
                'email' => "teacher@mail.com",
                'role' => 'teacher',
            ];
        });
    }

    /**
     * Indicate that the model's role is teacher.
     *
     * @return Factory
     */
    public function student()
    {
        return $this->state(function (array $attributes) {
            return [
                'email' => "student@mail.com",
                'role' => 'student',
            ];
        });
    }
}
