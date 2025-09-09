import dynamic from "next/dynamic";
import Board from "../../ui/Board";
import Link from "next/link";

const ProjectList = dynamic(() => import("./ProjectDisplay/ProjectList"));

export default function ProjectDisplay() {
    return (<section>
        <Board>
            {/* Header */}
            <div className="flex justify-between">
                <h2>🐱 作品展位</h2>
                <div className="flex gap-3">
                    <Link href="/project-display-apply" className="sm-link-text">
                        申请展位
                    </Link>
                    <Link href="/project-display-review" className="sm-link-text">
                        审核管理
                    </Link>
                </div>
            </div>

            {/* Projects */}
            <ProjectList />

        </Board>
    </section >);
} 