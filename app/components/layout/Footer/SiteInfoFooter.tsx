import Image from "next/image"
import Link from "next/link"

export default function SiteInfoFooter() {
    return (<div className="text-sm text-gray-300 my-3">
        <div className="my-2">
            <ul className="flex justify-center gap-8">
                <li><Link href="/legal/contract" className="sm-link-text">用户协议</Link></li>
                <li><Link href="/legal/privacy" className="sm-link-text">隐私政策</Link></li>
            </ul>
        </div>
        <div className="text-center my-2">
            Copyright &copy; 孤言（Remy Huang）. All rights reserved.
        </div>

        <div className="flex justify-center gap-8 my-2">
            <a target="_blank" href="http://www.beian.gov.cn/portal/registerSystemInfo?recordcode=32050502001212" className="flex justify-center gap-2">
                <Image width={20} height={20} src="/footer/beian_ico.png" alt="" />
                <span className="sm-link-text">苏公网安备 32050502001212号</span>
            </a>

            <a href="https://beian.miit.gov.cn/" target="_blank">
                <span className="sm-link-text">苏ICP备2023024793号-1</span>
            </a>
        </div>
    </div>);
}