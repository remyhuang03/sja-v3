import { type NextRequest } from "next/server";
import fs from "fs";
import path from "path";

export async function GET(req: NextRequest) {
  const stamp = req.nextUrl.searchParams.get("stamp");
  const stampRegex = /^[0-9]+_[0-9]+\.svg$/;

  if (!stampRegex.test(stamp) || !stamp) {
    return new Response("400 Bad Request", { status: 400 });
  }

  // check if local file exists
  const localReportPath = path.join(
    process.cwd(),
    "data/var/reports/analyze",
    stamp,
  );

  if (fs.existsSync(localReportPath)) {
    
    const svgContent = fs.readFileSync(localReportPath, "utf8");

    return new Response(svgContent, {
      status: 200,
      headers: {
        "Content-Type": "image/svg+xml",
        "Content-Length": svgContent.length.toString(),
      },
    });
  } else {
    return new Response("400 Bad Request!", { status: 400 });
  }

  /* 此操作有引起图片访问变慢的风险，予以下架
    # 获取来源网址
    $referer = $_SERVER['HTTP_REFERER'];
    # 换算来源平台
    function is_referer_of($referer, $domain)
    {
        $host = parse_url($referer)['host'];
        $domain_ref = preg_replace('/^www\./', '', $host);
        if ($domain_ref == $domain)
            return true;
        return false;
    }

    $platform = '';
    if (
        is_referer_of($referer, 'gitblock.cn') ||
        is_referer_of($referer, 'aerfaying.com')
    ) {
        $platform = 'a';
    } elseif (is_referer_of($referer, 'codingclip.com')) {
        $platform = 'cc';
    } elseif (is_referer_of($referer, 'ccw.site')) {
        $platform = 'ccw';
    } elseif (is_referer_of($referer, 'sjaplus.top')) {
        $platform = 'sja';
    } elseif (is_referer_of($referer, 'localhost:3000')) {
        $platform = 'local';
    } elseif (is_referer_of($referer, '40code.com')) {
        $platform = 'fz';
    } elseif (is_referer_of($referer, 'bcdou.cn')) {
        $platform = 'bcd';
    } else {
        $platform = $referer;
    }

    $is_record_to_db = true;
    // 没有来源或者来自SJA平台的不记录
    if ($platform == 'sja' || strlen($platform) == 0 || $platform == 'local') {
        $is_record_to_db = false;
    }
    // 5分钟内同一会话的重复访问不记录
    if (isset($_SESSION[$stamp]) && time() - $_SESSION[$stamp] < 5 * 60) {
        $is_record_to_db = false;
    }
    try {
        #链接数据库并记录访问
        if ($is_record_to_db) {
            $_SESSION[$stamp] = time();
            include $_SERVER['DOCUMENT_ROOT'] . "/includes/connect_db.php";
            $conn = connect_db('sja');
            $date = date('Y-m-d');
            if (!$conn->connect_error) {
                $sql = "INSERT INTO `project_stat`(`file`, `visit_date`, `origin`, `visit_cnt`) 
                        VALUES ('$stamp','$date', '$platform',1)
                        ON DUPLICATE KEY UPDATE `visit_cnt`=`visit_cnt`+1";
                $conn->query($sql);
                $conn->close();
            }
        }
    } catch (Exception $e) {
        // do nothing
    }*/
}
