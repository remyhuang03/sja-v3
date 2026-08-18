import MarkdownIt from 'markdown-it'
import styles from './Markdown.module.css'
import { mainFont } from '@/app/fonts/mainFont';

const markdown = new MarkdownIt({
    html: false,
    linkify: false,
    typographer: false,
});

export default function Markdown({ mdText }) {
    const html = markdown.render(mdText ?? '');

    return (<>
        <div className={`${styles.md} ${mainFont.className}`}>
            <div dangerouslySetInnerHTML={{ __html: html }} />
        </div >
    </>);
}
