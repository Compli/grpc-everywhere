"use strict";

const grpc = require('grpc');

const user = grpc.load('./user.proto').user;
const client = new user.userService('localhost:50051', grpc.credentials.createInsecure());

client.createUser({name: 'Hello world', gender: 'FEMALE'}, function(error, response) {
    if (error) {
        console.log(error.metadata.get('error'));
        console.log(error.metadata.get('code'));
        console.error('Error: ' + error);
    } else {
        console.log('Response:', response.message);
    }
});