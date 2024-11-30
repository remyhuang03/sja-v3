<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>SJA Plus 分析器</title>
    <link rel="stylesheet" href="/assets/css/update-log.css">

</head>

<body>
    <?php include $_SERVER["DOCUMENT_ROOT"] . "/includes/header.php"; ?>

    <main>
        <?php
        $is_first = true;
        $log_file_path = $_SERVER["DOCUMENT_ROOT"] . "/update-log/log.json";
        $log = json_decode(file_get_contents($log_file_path));
        foreach ($log as $section) {
            $version = $section->version;
            $date = $section->date;
            $update = $section->update;
            if ($is_first) {
                $is_first = false;
            } else {
                echo "<hr>";
            }
            echo "
            <section class='version'>
            <div class='version-title'>
                <h2 class='square ver'>$version</h2>
                <span class='date'>$date<span>
            </div>
            <ul>
            ";
            foreach ($update as $item) {
                $cate = strtolower($item[0]);
                $cate_upper = strtoupper($cate);
                $content = $item[1];
                echo "
                <li>
                    <span class='square $cate'>$cate_upper</span>
                    <span>$content</span>
                </li>
                ";
            }
            echo "</section>";
        }
        ?>
    </main>

    <?php include $_SERVER["DOCUMENT_ROOT"] . "/includes/footer.php"; ?>
</body>

</html>