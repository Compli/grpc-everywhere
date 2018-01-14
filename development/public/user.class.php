<?php

class User {

    public function __construct()
    {

    }

    public function getUser($parsedBody)
    {
        $userId = $parsedBody['id'];

        return json_encode([
            'isSuccess' => true,
            'message' => [
                'user' => [
                    'id' => $userId,
                    'email' => 'shane.jeffery@compli.com',
                    'password' => 'boohoo123',
                    'firstName' => 'Shane',
                    'lastName' => 'Jeffery'
                ]
            ],
        ]);
    }

    public function getAllUsers()
    {

    }

    public function createUser()
    {

    }

    public function updateUser()
    {

    }

    public function deleteUser()
    {

    }

}