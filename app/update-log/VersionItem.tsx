import styles from './update-log.module.css'

export default function VersionItem({ version, date, update, isFirst }) {
    function UpdateItem(item) {
        const cate = (item[0]).toLowerCase();
        const cate_upper = cate.toUpperCase();
        const content = item[1];
        return (<li key={content}>
            <span className={`${styles.square} ${styles[cate]}`}>{cate_upper}</span>
            <span>{content}</span>
        </li>);
    }

    return (<div>
        {!isFirst && <hr className={styles.hr} />}
        <li className={styles.version}>
            <div className={styles.versionTitle}>
                <h2 className={`${styles.square} ${styles.ver}`}>{version}</h2>
                <span className={styles.date}>{date}</span>
            </div>
            <ul>
                {
                    update.map(updateItem => {
                        return UpdateItem(updateItem);
                    })
                }
            </ul>
        </li>
    </div>);
}

