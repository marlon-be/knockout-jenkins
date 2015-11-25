<?php
$jobName = isset($_GET['job']) ? $_GET['job'] : '';
if ($jobName) {
    header('Content-Type: application/json');
    echo file_get_contents('https://godfather:godfather@jenkins.marlon.be/job/' . $jobName . '/lastBuild/api/xml?depth=1&xpath=*/executor/progress/text()');
}