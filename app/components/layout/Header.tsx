import Image from "next/image";
import Link from "next/link";
import style from "./Header.module.css";
import NavListItem from "./Header/NavListItem";
import { logoFont } from "@/app/fonts/logoFont";

export default function Header() {
    const navLinks = [
        {
            name: '作品分析器',
            href: '/analyze',
        },
        {
            name: '航站楼',
            href: '/nav',
        },
        // {
        //     name: '抄袭对比器',
        //     href: '/compare/index.php
        // },
    ];

    return (
        <header className={`${style.header} z-100 sticky top-0 flex justify-start items-center px-3 py-3`}>
            {/* Logo */}
            <h1 className={`${logoFont.style} mr-7`}>
                <Link href="/">
                    <Image width={98} height={19} src='/meta/white-banner-title.svg' alt='SJA Plus' />
                </Link>
            </h1>

            {/* Nav Links */}
            <nav>
                <ul className="flex justify-center items-center space-x-5">
                    {
                        navLinks.map((navLink) => {
                            return (
                                <NavListItem key={navLink.name} name={navLink.name} href={navLink.href} />
                            );
                        })
                    }
                </ul>
            </nav>

        </header>
    );
}