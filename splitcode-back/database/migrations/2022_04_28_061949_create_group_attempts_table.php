<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateGroupAttemptsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('group_attempts', function (Blueprint $table) {
            $table->id();
            $table->timestamps();
            $table->integer('time_spent_in_seconds_first_user')->default(0);
            $table->timestamp('last_check_in_first_user')->default(DB::raw('0'));
            $table->integer('time_spent_in_seconds_second_user')->default(0);
            $table->timestamp('last_check_in_second_User')->default(DB::raw('0'));
            $table->timestamp('completed_at')->nullable();

            $table->foreignId('first_user_id')
                ->constrained('users')
                ->onDelete('cascade')
                ->onUpdate('cascade');
            $table->foreignId('second_user_id')
                ->nullable()
                ->constrained('users')
                ->onDelete('cascade')
                ->onUpdate('cascade');
            $table->foreignId('exercise_id')
                ->constrained()
                ->onDelete('cascade')
                ->onUpdate('cascade');
            $table->foreignId('first_user_sandbox_id')
                ->nullable()
                ->constrained('sandboxes')
                ->onDelete('cascade')
                ->onUpdate('cascade');
            $table->foreignId('second_user_sandbox_id')
                ->nullable()
                ->constrained('sandboxes')
                ->onDelete('cascade')
                ->onUpdate('cascade');
            $table->foreignId('shared_sandbox_id')
                ->nullable()
                ->constrained('sandboxes')
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
        Schema::dropIfExists('group_attempts');
    }
}
