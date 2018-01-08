<?php

include_once('user.class.php');

$bodyJson = file_get_contents('php://input');
$parsedBody = json_decode($bodyJson, true);

$methodName = $_GET['methodName'];

$userObject = new User();
echo $userObject->$methodName($parsedBody);
