<?php
header('Content-Type: application/json');
echo file_get_contents('https://godfather:godfather@jenkins.marlon.be/api/json?pretty=true&depth=1');
