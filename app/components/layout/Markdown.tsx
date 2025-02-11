import Showdown from 'showdown'
import styles from './Markdown.module.css'
import { mainFont } from '@/app/fonts/mainFont';


export default function Markdown({ mdText }) {
    const converter = new Showdown.Converter({ tables: true });
    const html = converter.makeHtml(mdText);

    return (<>
        <div className={`${styles.md} ${mainFont.className}`}>
            <div dangerouslySetInnerHTML={{ __html: html }} />
        </div >
    </>);
}