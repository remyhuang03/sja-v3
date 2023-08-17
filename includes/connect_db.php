<?php
function connect_db($dbname) {
  $servername = "sjaplus.top";
  $username = "sja";
  $pwd_path = $_SERVER['DOCUMENT_ROOT'] . "/build/db_pwd.txt";
  $pwd = file_get_contents($pwd_path);
  $conn = new mysqli($servername, $username, $pwd, $dbname);
  return $conn;
}

