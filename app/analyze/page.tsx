'use client'

import Menu from "./Menu"
import Result from "./Result"

export default function Page() {
    return <div>
        <h1 className="text-xl text-center m-5">SJA作品分析器</h1>
        <div className="flex flex-wrap sm:flex-nowrap">
            <Result />
            <Menu />
        </div>
    </div>
}