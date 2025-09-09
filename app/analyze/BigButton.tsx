import Image from "next/image";

interface BigButtonProps {
    icon: string;
    text: string;
    className?: string;
    onClick?: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
}

export default function BigButton({ icon, text, className, onClick }: BigButtonProps) {
    return (
        <button 
            className={`px-3 cursor-pointer bg-[#333] hover:bg-[#373737] rounded-lg text-xl font-bold flex gap-2 justify-center items-center py-3 mt-2 transition-colors duration-200 ${className}`} 
            onClick={onClick}
        >
            <Image src={icon} height={38} width={28} alt="" className="h-[1em]" />
            <span>{text}</span>
        </button>
    );
}