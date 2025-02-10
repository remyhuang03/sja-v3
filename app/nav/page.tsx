//TODO: change page title to SJA航站楼
import Head from "next/head"
import Button from "../components/ui/Button";
import Section from "./Section";
import Image from "next/image";
import fs from "fs"
import Path from "path";

export default function Page() {
    // get cates file
    const cateFilePath = Path.join(process.cwd(), 'data/nav/cates.json');
    const cates = JSON.parse(fs.readFileSync(cateFilePath, 'utf-8'));

    return (<div>
        <Head>
            <title>SJA航站楼</title>
        </Head>

        {/* btn - sumbit more websites */}
        <div className="flex justify-end my-5 mx-3 sm:mx-5">
            <Button className="flex gap-2">
                <Image src="/ui/upload.svg" alt="" width={24} height={24} className="w-[1em]" />
                <a href="https://www.wenjuan.com/s/UZBZJvXfgl/" target="_blank">提交更多网站</a>
            </Button>
        </div>

        {/* render each cate */}
        {Object.keys(cates).map((cate) => {
            return (<Section key={cate} cate={cate} items={cates[cate].show} />);
        })}

    </div>);
}