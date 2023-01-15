<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Log;

class ScalaCompilerController extends Controller
{
    public function compile(Request $request)
    {
        $validate = $request->validate([
            'code' => ['required', 'string'],
            'fast' => ['boolean']
        ]);

        $code = $validate['code'];
        $fast = $validate['fast'] ?? false;

        $usedCompiler = rand(1, 4);

        //Add js requirements
        $code = $this->prepareForBrowserExecution($code);

        $filename = base64_encode(md5($code)) . '.scala';
        $inputPath = base_path() . "/scalacompiler_$usedCompiler/input/" . $filename;
        $outputPath = base_path() . "/scalacompiler_$usedCompiler/js/" . $filename . '.js';
        $scalaPath = base_path() . "/scalacompiler_$usedCompiler/src/main/scala/main.scala";

        file_put_contents($inputPath, $code);

        $lock = Cache::lock("compiler_lock_$usedCompiler", 15);
        try {
            // Lock acquired after waiting a maximum of 20 seconds...
            $lock->block(20);
            copy($inputPath, $scalaPath);
            Log::info("Compiler $usedCompiler: Compiling $filename");
            $result = $this->compileLocally($fast, $usedCompiler);
        } catch (LockTimeoutException $e) {
            return response()->json(['message' => 'compilation.error', 'errors' => ['details' => ['Compiler busy, please try again']]], 422);
        } finally {
            optional($lock)->release();
        }

        if (strpos($result, "success") !== false) {
            if ($fast) {
                $compilePath = base_path() . "/scalacompiler_$usedCompiler/target/scala-2.13/crosscompiler-fastopt/main.js";
            } else {
                $compilePath = base_path() . "/scalacompiler_$usedCompiler/target/scala-2.13/crosscompiler-opt/main.js";
            }
            rename($compilePath, $outputPath);

            return response()->file($outputPath);
        } else {
            return response()->json(['message' => 'compilation.error', 'errors' => ['details' => [$result]]], 422);
        }
    }

    private function prepareForBrowserExecution($code)
    {
        $code = "import scala.scalajs.js\n" . $code;
        $code = str_replace("readLine()", "js.eval(\"prompt()\")", $code);
        $code = str_replace("readInt()", "js.eval(\"prompt()\").toString.toInt", $code);
        $code = str_replace("readFloat()", "js.eval(\"prompt()\").toString.toFloat", $code);
        $code = str_replace("readDouble()", "js.eval(\"prompt()\").toString.toDouble", $code);
        $code = str_replace("readBoolean()", "js.eval(\"prompt()\").toString.toBoolean", $code);

        return $code;
    }

    public function compileLocally($fast, $compilerNumber)
    {
        $output = null;
        if ($fast) {
            exec(base_path() . "/scalacompiler_$compilerNumber/compile.sh fast", $output);
        } else {
            exec(base_path() . "/scalacompiler_$compilerNumber/compile.sh", $output);
        }

        $outputString = "";
        foreach ($output as $line) {
            $line = str_replace("[0J", "", $line);
            $line = str_replace("[31m", "", $line);
            $line = str_replace("[32m", "", $line);
            $line = str_replace("[0m", "", $line);
            if (strpos($line, "success") !== false || strpos($line, "error") !== false) {
                $outputString = $outputString . $line . "\n";
            }
        }

        return preg_replace("(\/Users(.*)scalacompiler_$compilerNumber)", "", $outputString);
    }
}
