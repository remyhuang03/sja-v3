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

    </div>);
}