import Link from "next/link"

export default function NewsItem({ article, title, description,thumbnail }) {
    return (
        <li key={article}>
            <Link href={`/news?a=${article}`}>
                <article className="p-3 my-1 rounded-lg transition-all duration-200 hover:bg-[#373737]">
                    <h2 className="text-lg mb-1"> {title} </h2>
                    <p className="text-gray-300 text-sm line-clamp-2"> {description} </p>
                </article>
            </Link>
        </li >

    );
}