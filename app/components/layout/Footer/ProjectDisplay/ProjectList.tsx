"use client";

import React, { useEffect, useState } from "react";
import ProjectItem from "./ProjectItem";
import NetworkError from "@/app/components/ui/NetworkError";
import Loading from "@/app/components/ui/Loading";

export default function ProjectList() {
    const [projects, setProjects] = useState(null);
    const [error, setError] = useState(false);

    // Fetch projects when loading
    useEffect(() => {
        async function fetchProjects() {
            try {
                const response = await fetch(`api/v2/projects-display?n=5`, {
                    cache: "no-store",
                });
                if (response.ok) {
                    const data = await response.json();
                    setProjects(data);
                } else {
                    setError(true);
                }
            } catch (err) {
                setError(true);
            }
        }

        fetchProjects();
    }, []);

    // when loading projects data
    if (!projects) {
        return <div className="py-6">
            <Loading />
        </div>;
    }

    // on network error, show error message
    if (error) {
        return (
            <div className="py-6">
                <NetworkError />
            </div>
        );
    }

    // on success, show projects
    return (
        <ul className="py-2 flex gap-3 text-left justify-between overflow-x-auto flex-nowrap">
            {projects.map((project) => (
                <ProjectItem
                    key={project.id}
                    id={project.id}
                    project_name={project.name}
                    author={project.author}
                    author_link={project.author_link}
                    project_link={project.project_link}
                    brief={project.brief}
                />
            ))}
        </ul>
    );
}