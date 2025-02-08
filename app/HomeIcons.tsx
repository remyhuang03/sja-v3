// TODO: replace the module CSS with tailwind CSS
// TODO: split icons into components
import styles from './homepage.module.css'
import Link from 'next/link';

export default function HomeIcons() {
    return (
        <div>
            <Link href="/analyze" className={`${styles.toolBtn} ${styles.analyzeBtn}`}>
                <div>作品分析器</div>
            </Link>
            <Link href="/nav" className={`${styles.toolBtn} ${styles.navBtn}`} >
                <div>航站楼</div>
            </Link>
            {/* <!-- <a href="stat/index.php" class="toolBtn" id="statBtn">
        <div>数据看板(内测)</div>
      </a> --> */}
            <Link href="/cmpr" className={`${styles.toolBtn} ${styles.cmprBtn}`}>
                <div><del>抄袭对比器（开发中）</del></div>
            </Link>
            <Link href="/update-log" className={`${styles.updateLogBtn} ${styles.toolBtn}`}>
                <div>更新日志</div>
            </Link>
            <Link href="https://note.youdao.com/s/80ZZTzYW" target="_blank" id='' className={`${styles.toolBtn} ${styles.faqBtn}`}>
                <div>常见问题</div>
            </Link>
        </div >
    );
}