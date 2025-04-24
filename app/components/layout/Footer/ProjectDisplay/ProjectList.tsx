import ProjectItem from "./ProjectItem";
import NetworkError from "@/app/components/ui/NetworkError";

export default async function ProjectList() {
    let projects;

    // Fetch the projects to be displayed
    try {
        const response = await fetch(`${process.env["SITE_URL"]}/api/v2/projects-display?n=5`);
        if (response.ok) {
            projects = await response.json();
        } else {
            projects = undefined;
        }
    } catch (error) {
        console.error("Network error:", error);
        projects = undefined;
    }

    // Projects not available -> network error message
    if (!projects)
        return (<div className="py-6">
            <NetworkError />
        </div>)

    // Projects available -> display them
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