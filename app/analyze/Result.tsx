import Board from "../components/ui/Board";


export default function Result({ status, report, errorMsg, className }) {
    const mainSection = (status) => {
        switch (status) {
            case 'init':
                return <p>暂无报告，上传文件试试吧！</p>;
                break;
            case 'analyzing':
                return <p>正在分析中，请稍等...</p>;
                break;
            case 'analyze_error':
                return <p>分析过程中遇到了错误，请将如下信息反馈给我们: {errorMsg}。</p>;
                break;
            case 'analyzed':
                return <img src={`/data/var/analyze/${report}`} />
            default:
                break;
        }
    }

    return (<div className={`${className}`}>
            <Board>
                {mainSection(status)}
            </Board>
        </div>);
}