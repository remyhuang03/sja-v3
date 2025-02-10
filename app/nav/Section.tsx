import NavItem from "./NavItem"
import getNavItemById from "../util/db/getNavItemById";

export default function Section({ cate, items }) {
    // no item for this cate, return empty
    if (!items) {
        return <></>
    }
    // at least one item for this cate
    else {
        let navItems = getNavItemById(items);
        if (!Array.isArray(navItems)) { navItems = [navItems] }

        return <section className="cate-section">
            <h2 className="ml-3 text-lg my-3">{cate}</h2>
            <ul className='mx-4 flex gap-3 flex-wrap justify-start'>
                {navItems.map((item) => {
                    return (<NavItem key={item[0]} title={item[0]} href={item[1]} icon={item[2]} />);
                })}
            </ul>
        </section>
    }


}