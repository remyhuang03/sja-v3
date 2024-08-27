<?php
/*
@brief
    Randomly select projects from the database for display.

@parameters
    $_GET['n'] the number of projects to select.
*/

header('Content-Type: application/json');

# check the parameter `n`
$project_num = filter_var($_GET['n'], FILTER_VALIDATE_INT);
if ($project_num === false) {
    echo json_encode(array('status' => 'error', 'message' => 'Invalid parameter `n`.'));
    exit();
}

# query the database for projects
require_once $_SERVER['DOCUMENT_ROOT'] . '/includes/connect_db.php';
$conn = connect_db('sja');
$result = $conn->query('SELECT * 
FROM project_display
ORDER BY RAND() 
LIMIT $project_num');


$projects = array();
while ($row = $result->fetch_assoc()) {
    $project = array(
        'id' => $row['id'],
        'project_name' => $row['name'],
        'author' => $row['author'],
        'author_link' => $row['author_link'],
        'project_link' => $row['project_link'],
        'project_brief' => $row['brief'],
    );
    array_push($projects, $project);
}
echo json_encode(array('status' => 'ok', 'projects' => $projects));
