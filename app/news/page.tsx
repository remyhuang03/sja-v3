import Path from 'path';

import readFile from '../util/readFile';
import Markdown from '../components/layout/Markdown';
import NotFound from '../not-found';

export default function Page({ searchParams }) {
    const articleName = searchParams['a'];
    const validPattern = /^[a-zA-Z0-9-]+$/;

    if (!validPattern.test(articleName) || !articleName)
        return (<NotFound />);

    const MarkdownFile = readFile(Path.join("data/news/md-articles", articleName + '.md'))

    if (!MarkdownFile)
        return (<NotFound />);

    return (
        <div className='mb-10 mx-4 sm:mx-6'>
            <Markdown mdText={MarkdownFile} />
        </div>
    );
}