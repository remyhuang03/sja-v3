import { Metadata } from 'next'

export const metadata: Metadata = {
    title: "SJA隐私政策"
}

export default function Page() {
    return (
        <div className='m-5'>
            <p className='text-right font-bold'>版本更新日期：2023年09月08日</p>
            <p className='text-right font-bold'>政策生效日期：2023年09月08日</p>

            <h1>SJA隐私政策</h1>

            <p>SJA分析器（以下简称“分析器”）非常重视并保护用户的个人信息。</p>
            <p>本政策适用于您通过 sjaplus.top 网站、供第三方网站和应用程序使用的软件开发工具包（SDK）和应用程序编程接口（API）等方式访问和使用服务。</p>
            <p>请您务必在点击同意本政策前，认真阅读并理解各条款内容。</p>
            <p>一旦您使用或继续使用分析器，即表示您同意我们按照本隐私政策处理您的相关信息。</p>
            <p>如果您不同意分析器收集您的任何个人信息，请您停止使用并退出分析器。</p>
            <p>如果您未满18周岁，在使用分析器前，必须在监护人的监护、陪同下共同仔细阅读本隐私政策，并征得监护人对本隐私政策的同意。</p>
            <h2>一、分析器会出于以下目的，收集您的个人信息：</h2>
            <h3>1. 分析器功能优化与研究分析</h3>
            <p>1.1 您所上传提交分析的 Scratch 文件将被服务器保存，并用于后续分析器功能优化与研究分析。您的 Scratch 文件仅用于研究分析，不会被转载或传播。</p>

            <h3>2. 提升用户使用体验</h3>
            <p>2.1 为提升访问体验，可能会利用 Cookie，Flash Cookie，或其他本地存储方式存取信息。</p>
            <p>2.2 为实现数据看板功能，提供更多元的数据分析，我们将记录您在本平台生成的报告图片的请求访问所关联的来源URL情况。</p>
            <p>2.3 为方便实现个人用户的数据管理和认证，我们会将您在本分析器的 “账号” 与其它第三方 Scratch 编程社区账号 ID 绑定。</p>

            <h3>3. 其它根据国家法律法规、监管规定的要求，所必须收集的个人信息。</h3>

            <h2>二.联系方式</h2>
            <p>当您有个人信息相关问题，可以通过 chinaguyan@gmail.com 获得联系。</p>
        </div>)
}