'use client';

import Link from 'next/link';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface ToolCardProps {
  title: string;
  href: string;
  icon: string;
  description?: string;
  disabled?: boolean;
  variant?: 'default' | 'analyze' | 'compare' | 'display' | 'nav' | 'update' | 'faq';
}

const ToolCard = ({ title, href, icon, description, disabled = false, variant = 'default' }: ToolCardProps) => {
  const variantStyles = {
    analyze: "bg-gradient-to-br from-purple-500/20 to-purple-600/10 border-purple-500/20 hover:border-purple-400/40 hover:shadow-lg hover:shadow-purple-500/20",
    compare: "bg-gradient-to-br from-blue-500/20 to-blue-600/10 border-blue-500/20 hover:border-blue-400/40 hover:shadow-lg hover:shadow-blue-500/20",
    display: "bg-gradient-to-br from-pink-500/20 to-purple-600/10 border-pink-500/20 hover:border-pink-400/40 hover:shadow-lg hover:shadow-pink-500/20",
    nav: "bg-gradient-to-br from-orange-500/20 to-red-600/10 border-orange-500/20 hover:border-orange-400/40 hover:shadow-lg hover:shadow-orange-500/20",
    update: "bg-gradient-to-br from-gray-500/20 to-gray-600/10 border-gray-500/20 hover:border-gray-400/40 hover:shadow-lg hover:shadow-gray-500/20",
    faq: "bg-gradient-to-br from-emerald-500/20 to-emerald-600/10 border-emerald-500/20 hover:border-emerald-400/40 hover:shadow-lg hover:shadow-emerald-500/20",
    default: "bg-gradient-to-br from-muted/50 to-muted/20 border-muted hover:border-muted-foreground/20"
  };

  const content = (
    <Card className={cn(
      "group relative overflow-hidden transition-all duration-300 hover:scale-[1.02]",
      variantStyles[variant],
      disabled && "opacity-60 cursor-not-allowed"
    )}>
      <CardContent className="flex items-center p-6">
        <div className="flex-shrink-0 mr-4">
          <div 
            className="w-16 h-16 bg-no-repeat bg-center bg-contain"
            style={{ backgroundImage: `url(${icon})` }}
          />
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-card-foreground group-hover:text-primary transition-colors">
            {disabled ? <del>{title}</del> : title}
          </h3>
          {description && (
            <p className="text-sm text-muted-foreground mt-1">{description}</p>
          )}
          {disabled && (
            <Badge variant="secondary" className="mt-2 text-xs">
              未开放
            </Badge>
          )}
        </div>
      </CardContent>
    </Card>
  );

  if (disabled) {
    return <div onClick={(e) => e.preventDefault()}>{content}</div>;
  }

  return (
    <Link href={href} className="block">
      {content}
    </Link>
  );
};

export default function HomeIcons() {
  const tools = [
    {
      title: "作品分析器",
      href: "/analyze",
      icon: "/homepage/analyze-logo.svg",
      description: "快速分析Scratch作品文件，获取详细信息",
      variant: "analyze" as const
    },
    {
      title: "抄袭对比器",
      href: "/compare",
      icon: "/homepage/cmpr-logo.svg",
      description: "对比作品相似度，检测抄袭行为",
      disabled: true,
      variant: "compare" as const
    },
    // {
    //   title: "作品展示",
    //   href: "/project-display",
    //   icon: "/homepage/donation-logo.svg",
    //   description: "展示优秀Scratch作品，分享创作经验",
    //   variant: "display" as const
    // },
    {
      title: "航站楼",
      href: "/nav",
      icon: "/homepage/nav-logo.svg",
      description: "助力 Scratch 创作的快捷导航页",
      variant: "nav" as const
    },
    {
      title: "更新日志",
      href: "/update-log",
      icon: "/homepage/update-log-logo.svg",
      description: "查看最新功能更新和改进",
      variant: "default" as const
    },
    {
      title: "常见问题",
      href: "https://note.youdao.com/s/80ZZTzYW",
      icon: "/homepage/faq-logo.svg",
      description: "获取使用帮助和解答疑问",
      variant: "default" as const
    }
  ];

  return (
    <div className="space-y-4">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-foreground mb-2">功能导航</h2>
        <p className="text-muted-foreground">选择您需要的功能开始使用</p>
      </div>
      
      <div className="grid gap-4">
        {tools.map((tool) => (
          <ToolCard
            key={tool.title}
            title={tool.title}
            href={tool.href}
            icon={tool.icon}
            description={tool.description}
            disabled={tool.disabled}
            variant={tool.variant}
          />
        ))}
      </div>
    </div>
  );
}
