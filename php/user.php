<?php

echo json_encode([
    'isSuccess' => true,
    'message' => [
        'user' => [
            'id' => 1234,
            'email' => 'shane.jeffery@compli.com',
            'password' => 'boohoo123',
            'firstName' => 'Shane',
            'lastName' => 'Jeffery'
        ]
    ],
]);

