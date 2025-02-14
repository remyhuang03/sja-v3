import Board from "../components/ui/Board"
import BigButton from "./BigButton";

import Image from "next/image";

import styles from './Menu.module.css'

export default function Menu({ setReport, status, setStatus, setErrorMsg, className }) {
    function submitHandler(e) {
        // console.log("DBG submitBtn clicked");
        e.preventDefault();
        if (status === 'analyzing')
            return;

        setStatus('analyzing');
        //检查参数

        fetch('/api/v2/analyze', {
            method: 'POST',
            body: {

            }
        })

    }

    return (<div className={`menu sja-display ${className}`}>
        <Board>
            <form onSubmit={submitHandler}>
                {/* <!-- 选择文件框 --> */}
                <label className="h-24" htmlFor="input-upload">
                    <div className="mb-4 cursor-pointer hover:bg-[#333] text-lg py-5 text-center border-dashed border-4 border-[#eee] rounded-lg flex items-center justify-center gap-2">
                        <Image className="w-[1em]" src="/ui/upload.svg" width={24} height={24} alt="" />
                        <span>上传作品（sb3/json/cc3）</span>
                    </div>
                    <input className="hidden" type="file" accept=".sb3,.json,.cc3,application/json,application/json, application/octet-stream" id="input-upload" name="file" />
                </label>

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
                <BigButton icon="/ui/start.svg" text="开始分析" />
            </form>


            {/* <!-- 分析结果菜单（复制MD、下载报告图） --> */}
            {/* {status === 'analyzed' && */}
            <hr className="my-6"/>
            <div>
                <div className="flex items-center">
                    <input type="radio" className={styles.radioBtn}/>
                    为报告图片提供点击放大功能（推荐用于CCW的小简介栏显示）
                </div>

                <div className="gap-3 flex flex-wrap">
                    <BigButton icon='/ui/markdown.svg' text="复制Markdown" />
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