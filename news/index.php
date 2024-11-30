<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, user-scalable=0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <link rel="stylesheet" href="style.css">
    <link rel="stylesheet" href="https://lf6-cdn-tos.bytecdntp.com/cdn/expire-1-M/github-markdown-css/5.1.0/github-markdown-dark.min.css" />
    <script>
        let article_md = <?php
                            $name = (isset($_GET['a']) ? htmlspecialchars($_GET['a']) : "") . ".md";
                            // if file not found, render error article
                            if (!file_exists($_SERVER["DOCUMENT_ROOT"] . "/news/md-articles/" . $name)) {
                                $name = "err-not-found.md";
                            }
                            echo json_encode(file_get_contents($_SERVER["DOCUMENT_ROOT"] . "/news/md-articles/" . $name));
                            ?>;
    </script>
    <script src="https://lf9-cdn-tos.bytecdntp.com/cdn/expire-1-M/showdown/2.0.0/showdown.min.js"></script>
    <script src="script.js" defer></script>
</head>

<body>
    <?php include $_SERVER["DOCUMENT_ROOT"] . "/includes/header.php"; ?>
    <main id="article" class="markdown-body">
    </main>
    <?php include $_SERVER["DOCUMENT_ROOT"] . "/includes/footer.php"; ?>
</body>

</html>