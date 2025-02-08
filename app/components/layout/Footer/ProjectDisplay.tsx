import Board from "../../ui/Board";
import Link from "next/link";

import ProjectList from "./ProjectDisplay/ProjectList";

export default async function ProjectDisplay() {
    return (<section>
        <Board>
            {/* Header */}
            <div className="flex justify-between">
                <h2>🐱 作品展位</h2>
                <div className="flex gap-3">
                    <Link href="https://www.wenjuan.com/s/UZBZJvZihe/" className="sm-link-text" target="_blank">
                        资格申请
                    </Link>
                    <Link href="/news?a=display-review" className="sm-link-text" target="_blank">
                        申请进度
                    </Link>
                </div>
            </div>

            {/* Projects */}
            <ProjectList />
           
        </Board>
    </section >);
} 