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
        const url = states.reportUrl();

        let md = "";
        if (e.currentTarget.checked)
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
                <fieldset className="flex flex-wrap my-1 items-center">
                    <Image src='/ui/sort.svg' width={24} height={24} className="w-[1em] mr-1" alt="" />
                    <span className="font-bold">类型排序：</span>
                    <div>
                        <span className='mr-5 items-center'>
                            <input className={styles.radioBtn} type="radio" name="is_sort" value="1" id='is_sort-1' defaultChecked />
                            <label htmlFor='is_sort-1'>
                                降序排序
                            </label>
                        </span>
                        <span>
                            <input className={styles.radioBtn} type="radio" name="is_sort" value="0" id='is_sort-0' />
                            <label htmlFor='is_sort-0'>
                                默认
                            </label>
                        </span>
                    </div>
                </fieldset>

                {/* <!-- 统计图类型 --> */}
                <fieldset className="flex flex-wrap my-1 items-center">
                    <Image src='/ui/block.svg' width={24} height={24} className="w-[1em] mr-1" alt="" />
                    <span className="font-bold">显示占比积木：</span>
                    <div>
                        <span className='mr-5'>
                            <input className={styles.radioBtn} type="radio" name="is_high_rank_cate" value="1" id='is_high_rank_cate-1' defaultChecked />
                            <label htmlFor='is_high_rank_cate-1'>
                                排名前12的积木
                            </label>
                        </span>
                        <span>
                            <input className={styles.radioBtn} type="radio" name="is_high_rank_cate" value="0" id='is_high_rank_cate-0' />
                            <label htmlFor='is_high_rank_cate-0'>
                                经典类型
                            </label>
                        </span>
                    </div>
                </fieldset>

                {/* <!-- 开始分析按钮 --> */}
                <BigButton icon="/ui/start.svg" text="开始分析" className="w-full" />
            </form>


            {/* <!-- 分析结果菜单（复制MD、下载报告图） --> */}
            {/* {status === 'analyzed' && */}
            <hr className="my-6" />
            <div>
                <div className="flex items-center">
                    <input type="checkbox" className={styles.radioBtn} />
                    为报告图片提供点击放大功能（推荐用于CCW的小简介栏显示）
                </div>

                <div className="gap-3 flex flex-wrap">
                    <BigButton icon='/ui/markdown.svg' text="复制Markdown" onClick={markdownHandler} />
                    <a href='$url' download='SJA分析报告.svg' className="flex-1">
                        <BigButton icon='/ui/download.svg' text="下载报告图" />
                    </a>
                </div>
            </div>
            {/* } */}

        </Board >
    </div >
    );

}