<?php
$jobName = isset($_GET['job']) ? $_GET['job'] : '';
if ($jobName) {
    header('Content-Type: application/json');
    echo file_get_contents('http://192.168.0.102:8080/job/' . $jobName . '/lastBuild/api/xml?depth=1&xpath=*/executor/progress/text()');
}