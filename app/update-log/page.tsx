//TODO: set title to '更新日志'
import Head from "next/head";

export default function Page(){
    return <div>
        <Head>
            <title>更新日志</title>
        </Head>
        <h1>更新日志</h1>
        <ul>
            <li>2021-08-23: 作品分析器上线</li>
            <li>2021-08-24: 作品分析器支持cc3文件</li>
            <li>2021-08-25: 作品分析器支持json文件</li>
            <li>2021-08-26: 作品分析器支持sb3文件</li>
            <li>2021-08-27: 作品分析器支持作品统计图</li>
            <li>2021-08-28: 作品分析器支持作品统计图下载</li>
        </ul>
    </div>
}