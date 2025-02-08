import { getProjectDisplay } from "@/app/util/db/getProjectDisplay";
import ProjectItem from "./ProjectItem";

export default async function ProjectList() {
    const projects = await getProjectDisplay();

    if(!projects)

    return (<ul className="py-2 flex gap-3 text-left justify-between overflow-x-auto flex-nowrap">
        {projects.map((project) => {
            return (
                <ProjectItem
                    key={project.id}
                    id={project.id}
                    project_name={project.name}
                    author={project.author}
                    author_link={project.author_link}
                    project_link={project.project_link}
                    brief={project.brief}
                />
            );
        })}
    </ul>);
}