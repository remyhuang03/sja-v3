import Link from "next/link";

export default function NavListItem({ name, href }) {
    return (
        <li className="rounded-md  hover:bg-white hover:text-violet-700 px-2 py-1">
            <Link href={href}> {name} </Link>
        </li>
    );
}