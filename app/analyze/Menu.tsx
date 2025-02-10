import Board from "../components/ui/Board"

import Image from "next/image";

export default function Menu({ setReport, status, setStatus, setErrorMsg }) {
    function submitHandler(e) {
        e.preventDefault();
        setStatus('analyzing');
        //TODO
    }

    return (<div className="menu sja-display">
        <Board>
            <form onSubmit={submitHandler}>
                <input type="hidden" name="token" />

                {/* <!-- 选择文件框 --> */}
                <label className="h-24 btn" id="unloaded" htmlFor="input-upload">
                    <span id="file-name" className="text-lg">上传作品（sb3/json/cc3）</span>
                    <input type="file" accept=".sb3,.json,.cc3,application/json,application/json, application/octet-stream" id="input-upload" name="file" />
                </label>

                {/* <!-- 是否排序单选按钮 --> */}
                <fieldset className="flex flex-wrap">
                    <span>类型排序：</span>
                    <div>
                        <span className='radio-btn'>
                            <input type="radio" name="is_sort" value="1" id='is_sort-1' checked />
                            <label htmlFor='is_sort-1'>
                                降序排序
                            </label>
                        </span>
                        <span className='radio-btn'>
                            <input type="radio" name="is_sort" value="0" id='is_sort-0' />
                            <label htmlFor='is_sort-0'>
                                默认
                            </label>
                        </span>
                    </div>
                </fieldset>

                {/* <!-- 统计图类型 --> */}
                <fieldset className="flex flex-wrap">
                    <span>显示占比积木：</span>
                    <div>
                        <span className='radio-btn'>
                            <input type="radio" name="is_high_rank_cate" value="1" id='is_high_rank_cate-1' checked />
                            <label htmlFor='is_high_rank_cate-1'>
                                排名前12的积木
                            </label>
                        </span>
                        <span className='radio-btn'>
                            <input type="radio" name="is_high_rank_cate" value="0" id='is_high_rank_cate-0' />
                            <label htmlFor='is_high_rank_cate-0'>
                                经典类型
                            </label>
                        </span>
                    </div>
                </fieldset>

                {/* <!-- 开始分析按钮 --> */}
                <button type="submit" className="font: 20px bold;" class="icon-btn">
                    <img src="img/start_ico.svg" alt="" />
                    <span>开始分析</span>
                </button>
            </form>


            {/* <!-- 分析结果菜单（复制MD、下载报告图） --> */}
            {status === 'analyzed' &&
                <div>
                    <hr />
                    <div className='notification'>
                        SJA 报告 markdown 加载速度已大幅提升，推荐直接粘贴 markdown 到作品简介！
                    </div>
                    <div>
                        <input type='checkbox' id='check_magnify'>
                            为报告图片提供点击放大功能（推荐用于CCW的小简介栏显示）
                        </input>
                    </div>
                    <ul id='result-menu'>

                        <li>
                            <button id='copy-md-btn' className='icon-btn'>
                                <img src='img/md_ico.svg' alt='' />
                                <span>复制Markdown</span>
                            </button>
                        </li>
                        <li>
                            <a href='$url' download='SJA分析报告.svg'>
                                <button id='save-report-btn' className='icon-btn'>
                                    <img src='img/download_ico.svg' alt='' />
                                    下载报告图
                                </button>
                            </a>
                        </li>
                    </ul>
                </div>
            }



        </Board >   </div>
    );

}