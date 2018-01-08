<?php
// GENERATED CODE -- DO NOT EDIT!

namespace User;

/**
 */
class UserServiceClient extends \Grpc\BaseStub {

    /**
     * @param string $hostname hostname
     * @param array $opts channel options
     * @param \Grpc\Channel $channel (optional) re-use channel object
     */
    public function __construct($hostname, $opts, $channel = null) {
        parent::__construct($hostname, $opts, $channel);
    }

    /**
     * @param \User\GetUserRequest $argument input argument
     * @param array $metadata metadata
     * @param array $options call options
     */
    public function getUser(\User\GetUserRequest $argument,
      $metadata = [], $options = []) {
        return $this->_simpleRequest('/user.UserService/getUser',
        $argument,
        ['\User\GetUserResponse', 'decode'],
        $metadata, $options);
    }

    /**
     * @param \User\GetAllUsersRequest $argument input argument
     * @param array $metadata metadata
     * @param array $options call options
     */
    public function getAllUsers(\User\GetAllUsersRequest $argument,
      $metadata = [], $options = []) {
        return $this->_simpleRequest('/user.UserService/getAllUsers',
        $argument,
        ['\User\GetAllUsersResponse', 'decode'],
        $metadata, $options);
    }

    /**
     * @param \User\CreateUserRequest $argument input argument
     * @param array $metadata metadata
     * @param array $options call options
     */
    public function createUser(\User\CreateUserRequest $argument,
      $metadata = [], $options = []) {
        return $this->_simpleRequest('/user.UserService/createUser',
        $argument,
        ['\User\CreateUserResponse', 'decode'],
        $metadata, $options);
    }

    /**
     * @param \User\UpdateUserRequest $argument input argument
     * @param array $metadata metadata
     * @param array $options call options
     */
    public function updateUser(\User\UpdateUserRequest $argument,
      $metadata = [], $options = []) {
        return $this->_simpleRequest('/user.UserService/updateUser',
        $argument,
        ['\User\UpdateUserResponse', 'decode'],
        $metadata, $options);
    }

    /**
     * @param \User\DeleteUserRequest $argument input argument
     * @param array $metadata metadata
     * @param array $options call options
     */
    public function deleteUser(\User\DeleteUserRequest $argument,
      $metadata = [], $options = []) {
        return $this->_simpleRequest('/user.UserService/deleteUser',
        $argument,
        ['\User\DeleteUserResponse', 'decode'],
        $metadata, $options);
    }

}
