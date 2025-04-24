import Image from "next/image";

export default function Page() {
    return (
        <div className="h-full flex">
            <nav className="h-[calc(100vh-56px)] w-64 bg-[#222] shadow-md rounded-r-3xl p-3">
                <a href="/compare">
                    <Image src='/homepage/cmpr-block-logo.svg' width={140} height={76} alt="抄袭对比器" className="w-full" />
                </a>
                <p className="mt-3">抄袭对比功能暂未开放，预计 2025 年 12 月开放公测，敬请期待。</p>
            </nav>
        </div>
    );
}