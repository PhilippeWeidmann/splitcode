<?php

namespace App\Http\Controllers;

use App\Models\GroupAttempt;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Crypt;
use Illuminate\Support\Facades\Validator;

class WebSocketController extends Controller
{
    // TODO: there is certainly a better way to do this
    public function token(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'group_attempt_id' => ['required', 'exists:group_attempts,id'],
        ])->validated();
        $groupAttemptId = $validator['group_attempt_id'];
        $userId = $request->user()->id;
        $groupAttempt = GroupAttempt::whereId($groupAttemptId)->get()->first();
        if ($groupAttempt && ($groupAttempt->first_user_id == $userId || $groupAttempt->second_user_id == $userId)) {
            $token = json_encode(['userId' => $userId, 'groupAttemptId' => $groupAttemptId]);
            return response()->json(['token' => Crypt::encryptString($token)]);
        }
        abort(403);
    }

    // TODO: Only allow request from websocket server
    public function decryptToken(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'encryptedToken' => ['required'],
        ])->validated();

        try {
            $decryptedToken = Crypt::decryptString($validator['encryptedToken']);
            $token = json_decode($decryptedToken);
            $groupAttempt = GroupAttempt::whereId($token->groupAttemptId)->get()->first();
            $token->groupAttempt = $groupAttempt;
            return response()->json($token);
        } catch (DecryptException $e) {
        }
        abort(403);
    }
}
