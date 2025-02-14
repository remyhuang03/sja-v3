import Image from "next/image";

export default function ProjectItem({ author, author_link, project_link, id, project_name, brief }) {
    return (
        <li key={id} className="rounded-md border-2 border-violet-300 bg-violet-200 shadow-md min-w-44">
            <div className="flex text-ellipsis whitespace-nowrap">
                <a href={author_link} className="flex-1 m-2 mr-1 pt-0.5">
                    <Image width={256} height={256} src={`/project-display/avatar/${id}.png`} className="rounded-[50%] border-2 border-violet-300" alt={author} />
                </a>
                <div className="m-2 ml-1 flex-[3] overflow-hidden">
                    <a href={project_link} className="text-[15px]">
                        <h3 className="text-violet-400 hover:text-violet-600 line-clamp-1">{project_name}</h3>
                    </a>
                    <a href={author_link} className="text-sm text-ellipsis text-violet-400 hover:text-violet-600">{author}</a>
                </div>
            </div>

            <a href={project_link}>
                <Image width={720} height={540} className="project-poster" src={`/project-display/poster/${id}.png`} alt={project_name} />
            </a>

            <p className="text-violet-400 text-sm p-2 overflow-hidden text-ellipsis whitespace-nowrap">{brief}</p>
        </li>
    );
}