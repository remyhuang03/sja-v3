import Image from "next/image"

export default function NetworkError(){
    return <div className="flex gap-5 justify-center">
        <Image width={24} height={24} src="/ui/wifi_off.svg" alt="Offline"/>
        <p>网络错误，加载失败喵！</p>
    </div>
}