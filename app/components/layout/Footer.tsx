import ProjectDisplay from "./Footer/ProjectDisplay";
import SiteInfoFooter from "./Footer/SiteInfoFooter";

export default function Footer() {
    return (<>
        <div className="my-6">
            <ProjectDisplay /></div>
        <div className="my-6">
            <SiteInfoFooter />
        </div>
    </>);
}