<?php

namespace App\Http\Controllers;

use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class UserController extends Controller
{
    public function profileUpdate(Request $request)
    {
        //validation rules
        $request->validate([
            'name' => 'required|min:4|string|max:255',
            'email' => 'required|email|string|max:255'
        ]);
        $user = $request->user();
        $user->name = $request['name'];
        $user->email = $request['email'];
        $user->save();
        return response()->json($user);
    }

    public function displayCurrentUser(Request $request): JsonResponse
    {
        $user = $request->user();
        $user->makeVisible('email');
        return response()->json($user);
    }

}
