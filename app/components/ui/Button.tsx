export default function Button({ children, className }) {
    return (
        <div className={`px-3 py-2 text-[#eee] rounded-md shadow-md bg-[#272727] hover:bg-[#333] transition-all ${className}`}>
            {children}
        </div>
    );
}