import Board from "../components/ui/Board"
import BigButton from "./BigButton";
import FileUpload from "../components/ui/FileUpload";

import Image from "next/image";
import { useContext, useState } from "react";
import { GlobalContext } from "./context";

import styles from './Menu.module.css'

export default function Menu({ className }) {
    const states = useContext(GlobalContext);
    const [files, setFiles] = useState<File>();
    const [enableClickableReport, setEnableClickableReport] = useState(false);

    function submitHandler(e) {
        e.preventDefault();
        if (states.status() === 'analyzing')
            return;

        states.setStatus('analyzing');

        const formData = new FormData();
        if (files && files[0]) {
            formData.append("file", files[0]);
        }
        else {
            states.setErrorMsg("请先上传作品！");
            states.setStatus('analyze_error');
            return;
        }
        formData.append("is_sort", e.currentTarget.is_sort.value);
        formData.append("is_high_rank_cate", e.currentTarget.is_high_rank_cate.value);

        fetch('/api/v2/analyze', {
            method: 'POST',
            body: formData
        }).then(response => {
            if (response.status === 413) {
                throw new Error('您所上传的文件已超出大小限制，请解压作品后直接上传 project.json 文件。');
            }
            if (response.status !== 200) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
            else
                return response.json();
        }
        )
            .then(data => {
                if (data.status === 'ok') {
                    states.setReportUrl(data.token);
                    states.setStatus('analyzed');
                } else {
                    states.setErrorMsg(data.msg);
                    states.setStatus('analyze_error');
                }
            }).catch(error => {
                states.setErrorMsg(error.message);
                states.setStatus('analyze_error');
            });
    }

    function markdownHandler(e) {
        e.preventDefault();
        const url = states.reportUrl();

        let md = "";
        if (enableClickableReport)
            md = `[![](${url})](${url})`;
        else
            md = `[![](${url})](https://sjaplus.top)`;

        // copy to clipboard
        navigator.clipboard.writeText(md).then(function () {
            alert("Markdown 代码复制成功，可直接粘贴到作品简介。");
        }, function () {
            alert("Markdown 代码复制失败！");
        })
    }

    return (<div className={`menu sja-display ${className}`}>
        <Board>
            <form onSubmit={submitHandler}>
                {/* <!-- 上传文件 --> */}
                <FileUpload fileLoadedHandler={(files) => { setFiles(files); }} accept=".sb3,.json,.cc3,application/json, application/octet-stream" id="input-upload" name="file">
                    <label className="h-24" htmlFor="input-upload">
                        <div className="mb-4 cursor-pointer hover:bg-[#333] text-lg py-5 text-center border-dashed border-4 border-[#eee] rounded-lg flex items-center justify-center gap-2">
                            {
                                !(files && files[0] && files[0].name) ? <>
                                    <Image className="w-[1em]" src="/ui/upload.svg" width={24} height={24} alt="" />
                                    <span>上传作品（sb3/json/cc3）</span>
                                </> :
                                    <span>{files[0].name}</span>
                            }

                        </div>
                    </label>
                </FileUpload>

                {/* <!-- 是否排序单选按钮 --> */}
                <fieldset className="my-4">
                    <div className="flex items-center mb-2">
                        <Image src='/ui/sort.svg' width={24} height={24} className="w-[1em] mr-2" alt="" />
                        <span className="font-bold">类型排序：</span>
                    </div>
                    <div className="flex flex-wrap gap-4 ml-6">
                        <label className="flex items-center cursor-pointer">
                            <input className={styles.radioBtn} type="radio" name="is_sort" value="1" id='is_sort-1' defaultChecked />
                            <span className="ml-1">降序排序</span>
                        </label>
                        <label className="flex items-center cursor-pointer">
                            <input className={styles.radioBtn} type="radio" name="is_sort" value="0" id='is_sort-0' />
                            <span className="ml-1">默认</span>
                        </label>
                    </div>
                </fieldset>

                {/* <!-- 统计图类型 --> */}
                <fieldset className="my-4">
                    <div className="flex items-center mb-2">
                        <Image src='/ui/block.svg' width={24} height={24} className="w-[1em] mr-2" alt="" />
                        <span className="font-bold">显示占比积木：</span>
                    </div>
                    <div className="flex flex-wrap gap-4 ml-6">
                        <label className="flex items-center cursor-pointer">
                            <input className={styles.radioBtn} type="radio" name="is_high_rank_cate" value="1" id='is_high_rank_cate-1' defaultChecked />
                            <span className="ml-1">排名前12的积木</span>
                        </label>
                        <label className="flex items-center cursor-pointer">
                            <input className={styles.radioBtn} type="radio" name="is_high_rank_cate" value="0" id='is_high_rank_cate-0' />
                            <span className="ml-1">经典类型</span>
                        </label>
                    </div>
                </fieldset>

                {/* <!-- 开始分析按钮 --> */}
                <div className="mt-6">
                    <BigButton icon="/ui/start.svg" text="开始分析" className="w-full" />
                </div>
            </form>

            {/* <!-- 分析结果菜单（复制MD、下载报告图） --> */}
            <hr className="my-6" />
            <div className="space-y-4">
                <label className="flex items-center cursor-pointer gap-2">
                    <input 
                        type="checkbox" 
                        className={`${styles.radioBtn} mr-4`} 
                        checked={enableClickableReport}
                        onChange={(e) => setEnableClickableReport(e.target.checked)}
                    />
                    <span className="text-sm">为报告图片提供点击放大功能（推荐用于CCW的小简介栏显示）</span>
                </label>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <BigButton icon='/ui/markdown.svg' text="复制Markdown" onClick={markdownHandler} className="w-full" />
                    <a 
                        href='$url' 
                        download='SJA分析报告.svg' 
                        className="px-3 cursor-pointer bg-[#333] hover:bg-[#373737] rounded-lg text-xl font-bold flex gap-2 justify-center items-center py-3 mt-2 transition-colors duration-200 w-full text-white no-underline"
                    >
                        <Image src='/ui/download.svg' height={38} width={28} alt="" className="h-[1em]" />
                        <span>下载报告图</span>
                    </a>
                </div>
            </div>

        </Board >
    </div >
    );

}