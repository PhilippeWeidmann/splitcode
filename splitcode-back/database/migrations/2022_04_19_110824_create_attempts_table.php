<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateAttemptsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('attempts', function (Blueprint $table) {
            $table->id();
            $table->timestamps();
            $table->timestamp('last_check_in')->default(DB::raw('0'));
            $table->integer('time_spent_in_seconds')->default(0);
            $table->timestamp('completed_at')->nullable();

            $table->foreignId('user_id')
                ->constrained()
                ->onDelete('cascade')
                ->onUpdate('cascade');
            $table->foreignId('exercise_id')
                ->constrained()
                ->onDelete('cascade')
                ->onUpdate('cascade');
            $table->foreignId('sandbox_id')
                ->nullable()
                ->constrained()
                ->onDelete('cascade')
                ->onUpdate('cascade');
            $table->foreignId('attempt_result_id')
                ->nullable()
                ->constrained('attempt_results')
                ->onDelete('cascade')
                ->onUpdate('cascade');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('attempts');
    }
}
