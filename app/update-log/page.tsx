//TODO: set title to '更新日志'
import Head from "next/head";
import path from "path";
import fs from "fs";
import VersionItem from "./VersionItem";

export default function Page() {
    // get update-log
    const logPath = path.join(
        process.cwd(),
        "data/update-log/log.json",
    );

    const log = JSON.parse(fs.readFileSync(logPath, "utf8"));

    // is the first version to be displayed
    let is_first_item = true;


    return (
        <main className="mb-16">
            <ul>
                {
                    log.map((version) => {
                        const ret =
                            <VersionItem version={version.version} date={version.date} update={version.update} key={version.version} isFirst={is_first_item} />;
                        if (is_first_item) {
                            is_first_item = false;
                        }
                        return ret;
                    })

                }
            </ul>
        </main>);
}