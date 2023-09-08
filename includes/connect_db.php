<?php
/**
 * 连接到SJA数据库
 * @param string $dbname 数据库名
 * @return mysqli 数据库连接对象
 */
function connect_db($dbname) {
  $servername = "sjaplus.top";
  $username = "sja";
  $pwd_path = $_SERVER['DOCUMENT_ROOT'] . "/build/db_pwd.txt";
  $pwd = file_get_contents($pwd_path);
  $conn = new mysqli($servername, $username, $pwd, $dbname);
  return $conn;
}

