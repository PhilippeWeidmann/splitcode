<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateExerciseConceptsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('exercise_concepts', function (Blueprint $table) {
            $table->id();
            $table->timestamps();
            $table->string("concept");
            $table->foreignId("exercise_id")
                ->constrained()
                ->onUpdate("cascade")
                ->onDelete("cascade");
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('exercise_concepts');
    }
}
