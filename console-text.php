<?php
$jobName = isset($_GET['job']) ? $_GET['job'] : '';
if ($jobName) {
    echo file_get_contents('http://192.168.0.102:8080/job/' . $jobName . '/lastBuild/consoleText/');
}
