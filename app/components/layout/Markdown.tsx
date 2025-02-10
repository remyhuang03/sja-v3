import showdown from 'showdown';

export default function Markdown({ mdText }) {
    return (
        <div>
            {showdown.Converter().makeHtml((mdText))}
        </div>
    )
}