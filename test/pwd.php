$pwd_path = $_SERVER['DOCUMENT_ROOT'] . "/build/alpha_pwd.txt";
$pwd = file_get_contents($pwd_path);
if ((array_key_exists('pwd', $_GET) && $_GET['pwd'] == $pwd) ||
                    ($_SERVER["REQUEST_METHOD"] == "POST")
                ) {
                    echo '