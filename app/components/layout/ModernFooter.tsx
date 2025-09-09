import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, Github, Mail, Shield } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import ModernProjectDisplay from "./ModernProjectDisplay";

export default function ModernFooter() {
    return (
        <footer className="border-t border-border/40 bg-muted/30 mt-auto">
            <div className="container mx-auto px-4 py-8">
                {/* Project Display Section */}
                <ModernProjectDisplay />

                <Separator className="my-8" />

                {/* Site Info */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-16">
                    {/* About */}
                    <div>
                        <h4 className="font-semibold mb-3 flex items-center gap-2">
                            <Image src="/meta/main-logo.svg" alt="SJA" width={20} height={20} />
                            关于 SJA Plus
                        </h4>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                            SJA Plus 是一个专为 Scratch 社区打造的服务平台，
                            提供作品分析、抄袭检测、资源导航等多样化功能。
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="font-semibold mb-3">快速链接</h4>
                        <ul className="space-y-2">
                            <li>
                                <Link href="/analyze" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                                    作品分析器
                                </Link>
                            </li>
                            <li>
                                <Link href="/nav" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                                    航站楼
                                </Link>
                            </li>
                            <li>
                                <Link href="/update-log" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                                    更新日志
                                </Link>
                            </li>
                            <li>
                                <a
                                    href="https://note.youdao.com/s/80ZZTzYW"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-sm text-muted-foreground hover:text-primary transition-colors inline-flex items-center gap-1"
                                >
                                    常见问题
                                    <ExternalLink className="h-3 w-3" />
                                </a>
                            </li>
                        </ul>
                    </div>

                    {/* Legal & Contact */}
                    <div>
                        <h4 className="font-semibold mb-3">法律信息</h4>
                        <ul className="space-y-2">
                            <li>
                                <Link href="/legal/privacy" className="text-sm text-muted-foreground hover:text-primary transition-colors inline-flex items-center gap-1">
                                    隐私政策
                                </Link>
                            </li>
                            <li>
                                <Link href="/legal/contract" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                                    服务条款
                                </Link>
                            </li>
                        </ul>
                    </div>
                </div>

                <Separator className="my-6" />

                {/* Copyright */}
                <div className="text-center text-xs">
                    <div className="mb-3 flex items-center gap-3 md:gap-6 justify-center flex-wrap">
                        <div>
                            <a target="_blank" href="http://www.beian.gov.cn/portal/registerSystemInfo?recordcode=32050502001212" className="flex justify-center gap-2">
                                <Image width={16} height={16} src="/footer/beian_ico.png" alt="" />
                                <span>苏公网安备 32050502001212号</span>
                            </a>
                        </div>
                        <div>
                            <a href="https://beian.miit.gov.cn/" target="_blank">
                                <span>苏ICP备2023024793号-1</span>
                            </a>
                        </div>
                    </div>
                    <p>
                        Copyright &copy; 2024-2025 SJA Plus. Made with ❤️ for the Scratch community.
                    </p>
                </div>
            </div>
        </footer>
    );
}
