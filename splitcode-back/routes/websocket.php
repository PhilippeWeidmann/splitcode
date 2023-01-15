<?php

use App\Http\Controllers\ChatMessageController;
use App\Http\Controllers\WebSocketController;
use Illuminate\Support\Facades\Route;

Route::get("websocket/token/decrypt", [WebSocketController::class, 'decryptToken']);
Route::put("websocket/groupattempts/{groupAttempt}/messages", [ChatMessageController::class, 'store']);
