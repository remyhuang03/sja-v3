import Board from "../components/ui/Board";
import { useContext } from "react";
import { GlobalContext } from "./context";

export default function Result({ className }) {
    const states = useContext(GlobalContext);

    const mainSection = (status) => {
        switch (status) {
            case 'init':
                return <p>暂无报告，上传文件试试吧！</p>;
                break;
            case 'analyzing':
                return <p>正在分析中，请稍等...</p>;
                break;
            case 'analyze_error':
                return <p>分析出错: {states.errorMsg()}</p>;
                break;
            case 'analyzed':
                return <img src={`${states.reportUrl()}`} alt=""/>
            default:
                break;
        }
    }

    return (<div className={`${className}`}>
            <Board>
                {mainSection(states.status())}
            </Board>
        </div>);
}