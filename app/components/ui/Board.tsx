export default function Board({ children }) {
return (<div className="bg-secondary-bg rounded-lg shadow-lg m-3 sm:m-6 px-4 py-3">
        {children}
    </div>);
}