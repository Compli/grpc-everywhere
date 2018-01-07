"use strict";

const grpc = require('grpc');

const test = grpc.load('./test.proto').test;
const client = new test.greeter.Greeter('localhost:50051', grpc.credentials.createInsecure());

client.sayHello({name: 'Hello world', gender: 'FEMALE'}, function(error, response) {
    if (error) {
        console.log(error.metadata.get('error'));
        console.log(error.metadata.get('code'));
        console.error('Error: ' + error);
    } else {
        console.log('Response:', response.message);
    }
});