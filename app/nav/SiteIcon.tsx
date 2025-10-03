"use client";

import Image from "next/image";
import React from "react";
import { Globe } from "lucide-react";

interface SiteIconProps {
    src?: string;
    alt: string;
    websiteUrl: string;
}

const getFaviconUrls = (url: string, providedIcon?: string): string[] => {
    const urls: string[] = [];
    
    // 如果提供了icon，先尝试使用
    if (providedIcon && providedIcon.trim() !== '') {
        urls.push(providedIcon);
    }
    
    try {
        const urlObj = new URL(url);
        const domain = urlObj.hostname;
        const origin = urlObj.origin;
        
        urls.push(
            // 标准 favicon 路径
            `${origin}/favicon.ico`,
            `${origin}/favicon.png`,
            `${origin}/favicon.svg`,
            `https://${domain}/favicon.ico`,
            `https://${domain}/favicon.png`,
            `https://${domain}/favicon.svg`,
            // Apple Touch 图标
            `${origin}/apple-touch-icon.png`,
            `${origin}/apple-touch-icon-precomposed.png`,
            `${origin}/apple-icon.png`,
            // 常见的 logo 路径
            `${origin}/logo.png`,
            `${origin}/logo.svg`,
            `${origin}/logo.ico`,
            // 其他路径
            `${origin}/static/favicon.ico`,
            `${origin}/assets/favicon.ico`,
            `${origin}/images/favicon.ico`,
            `${origin}/img/favicon.ico`,
            `${origin}/icon.png`,
            `${origin}/icon.svg`,
        );
    } catch (error) {
        console.warn('Invalid URL:', url, error);
    }
    
    return urls;
};


const SiteIcon = ({ src, alt, websiteUrl }: SiteIconProps) => {
    const faviconUrls = React.useMemo(() => getFaviconUrls(websiteUrl, src), [websiteUrl, src]);
    const [currentIndex, setCurrentIndex] = React.useState(0);
    const [showFallback, setShowFallback] = React.useState(false);
    const currentSrc = faviconUrls[currentIndex];

    const handleError = () => {
        // 尝试备用URL
        if (currentIndex < faviconUrls.length - 1) {
            setCurrentIndex(prev => prev + 1);
        } else {
            setShowFallback(true);
        }
    };

    if (showFallback) {
        return (
            <div className="w-4 h-4 flex items-center justify-center bg-muted rounded-sm flex-shrink-0">
                <Globe className="w-3 h-3 text-muted-foreground" />
            </div>
        );
    }

    return (
        <div className="w-4 h-4 flex items-center justify-center flex-shrink-0">
            <Image
                src={currentSrc}
                alt={alt}
                width={16}
                height={16}
                className="rounded-sm object-contain"
                onError={handleError}
                unoptimized // 允许外部图片
            />
        </div>
    );
};

export default SiteIcon;
