<?php
header('Content-Type: application/json');
echo file_get_contents('http://192.168.0.102:8080/api/json?pretty=true&depth=1');
