<?php

namespace App\Http\Controllers;

use App\Models\ChatMessage;
use App\Models\GroupAttempt;
use Illuminate\Http\Request;

class ChatMessageController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(GroupAttempt $groupAttempt)
    {
        $chatMessages = $groupAttempt->chatMessages()->get();
        return response()->json($chatMessages);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param \Illuminate\Http\Request $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request, GroupAttempt $groupAttempt)
    {
        $validated = $request->validate([
            'message' => ['required', 'string'],
            'userId' => ['required', 'integer', 'exists:users,id'],
        ]);

        $chatMessage = new ChatMessage();
        $chatMessage->content = $validated['message'];
        $chatMessage->user_id = $validated['userId'];
        $chatMessage->group_attempt_id = $groupAttempt->id;
        $chatMessage->save();

        return response()->json($chatMessage);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param \Illuminate\Http\Request $request
     * @param \App\Models\ChatMessage $chatMessage
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, ChatMessage $chatMessage)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param \App\Models\ChatMessage $chatMessage
     * @return \Illuminate\Http\Response
     */
    public function destroy(ChatMessage $chatMessage)
    {
        //
    }
}
