<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateQuestionAttempt extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('question_attempt', function (Blueprint $table) {
            $table->id();
            $table->timestamps();
            $table->foreignId('question_id')
                ->constrained()
                ->onUpdate('cascade')
                ->onDelete('cascade');
            $table->foreignId('attempt_id')
                ->constrained('group_attempts')
                ->onUpdate('cascade')
                ->onDelete('cascade');
            $table->foreignId('user_id')
                ->constrained()
                ->onUpdate('cascade')
                ->onDelete('cascade');
            $table->foreignId('exercise_id')
                ->constrained()
                ->onUpdate('cascade')
                ->onDelete('cascade');
            $table->integer("answer");
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('question_attempt');
    }
}
