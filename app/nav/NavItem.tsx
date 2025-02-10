import Link from "next/link";
import Button from "../components/ui/Button";

export default function NavItem({ key, icon, title, href }) {
    return (<li key={key} className="flex-1 min-w-28 max-w-48">
        <Button className="hover:shadow-slate-800">
            <Link href={href} target="_blank" className="flex gap-2 justify-start items-center">
                <img src={icon} alt="" className="w-[1em] h-[1em]" />
                <span> {title} </span>
            </Link>
        </Button>
    </li>);
}


