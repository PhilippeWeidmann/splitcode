<?php

namespace App\Jobs;

use App\Models\Attempt;
use App\Models\AttemptResult;
use App\Models\Exercise;
use App\Models\GroupAttempt;
use App\Models\Sandbox;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldBeUnique;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Carbon;

class GradeExercisesJob implements ShouldQueue, ShouldBeUnique
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    /**
     * Create a new job instance.
     *
     * @return void
     */
    public function __construct()
    {
        //
    }

    /**
     * Execute the job.
     *
     * @return void
     */
    public function handle()
    {
        //TODO: only grade exercises that are not graded yet
        foreach (Exercise::all() as $exercise) {
            if ($exercise->solo_end_time < now()) {
                foreach ($exercise->attempts as $attempt) {
                    if ($attempt->completed_at == null) {
                        $this->finishAttempt($attempt);
                    }
                    if ($attempt->attemptResult == null) {
                        $attemptCode = $attempt->sandbox->content;
                        $result = $this->gradeAttemptCode($attemptCode);
                        $attemptResult = new AttemptResult();
                        $attemptResult->type = 2;
                        $attemptResult->result = $result;
                        $attemptResult->save();
                        $attempt->attempt_result_id = $attemptResult->id;
                        $attempt->save();
                    }
                }
            }
            if ($exercise->end_time < now()) {
                foreach ($exercise->groupAttempts as $attempt) {
                    if ($attempt->completed_at == null) {
                        $attempt->completed_at = now();
                        $attempt->save();
                    }
                    if ($attempt->attemptResult == null) {
                        $attemptCode = $attempt->sharedSandbox->content;
                        $result = $this->gradeAttemptCode($attemptCode);
                        $attemptResult = new AttemptResult();
                        $attemptResult->type = 2;
                        $attemptResult->result = $result;
                        $attemptResult->save();
                        $attempt->attempt_result_id = $attemptResult->id;
                        $attempt->save();
                    }
                }
            }
        }
    }

    function finishAttempt(Attempt $attempt)
    {
        $userId = $attempt->user_id;

        $exercise = $attempt->exercise;
        $attempt->completed_at = Carbon::now()->toDateTimeString();
        $attempt->save();

        $groupAttempt = GroupAttempt::where("exercise_id", "=", $exercise->id)
            ->whereNull("second_user_id")
            ->where("first_user_id", "<>", $userId)
            ->first();

        $sandbox = new Sandbox();
        $sandbox->content = $attempt->sandbox->content;
        $sandbox->save();

        if ($groupAttempt) {
            $groupAttempt->second_user_id = $userId;
            $groupAttempt->second_user_sandbox_id = $sandbox->id;
        } else {
            $sharedSandbox = new Sandbox();
            $sharedSandbox->save();

            $groupAttempt = new GroupAttempt();
            $groupAttempt->exercise_id = $exercise->id;
            $groupAttempt->first_user_id = $userId;
            $groupAttempt->first_user_sandbox_id = $sandbox->id;
            $groupAttempt->shared_sandbox_id = $sharedSandbox->id;
        }
        $groupAttempt->save();
    }

    function gradeAttemptCode(string $code): int
    {
        $grade = 1;
        $gradingDirectory = base_path() . "/grading";

        $inputPath = "$gradingDirectory/tmp/out.scala";

        // Simulate input
        $code = str_replace("readDouble()", "12.toDouble", $code);

        file_put_contents($inputPath, $code);

        $output = null;
        $resultCode = null;
        exec("$gradingDirectory/compile.sh", $output, $resultCode);

        // Compilation is successful proceed with grading
        if ($resultCode == 0) {
            $grade = 2;

            $programClass = array_filter(scandir("$gradingDirectory/tmp"), function ($filename) {
                return strpos($filename, ".class") && strpos($filename, "$") === false;
            });
            // Get first element of array
            $programClass = reset($programClass);
            $programClass = str_replace(".class", "", $programClass);

            if ($programClass) {
                $output = null;
                $resultCode = null;
                exec("scala $programClass", $output, $resultCode);

                // Code ran without errors (for now this seems to always result 0 ?)
                if ($resultCode == 0) {
                    $grade = 3;
                    $outputString = implode("\n", $output);
                    // Code correctly calculated the result
                    \Log::info($output);
                    if (strpos($outputString, "28") !== false) {
                        $grade = 6;
                    }
                }
            }
        }

        // Cleanup
        array_map('unlink', glob("$gradingDirectory/tmp/*.*"));
        return $grade;
    }
}
