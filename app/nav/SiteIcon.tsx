"use client";

import Image from "next/image";
import React from "react";

interface SiteIconProps {
    src: string;
    alt: string;
    websiteUrl: string; // 用于生成多个favicon URL
}

// 自动获取网站图标的函数 - 使用中国友好的方式
const getFaviconUrl = (url: string): string => {
    try {
        const domain = new URL(url).hostname;
        // 优先使用网站的 favicon.ico
        return `https://${domain}/favicon.ico`;
    } catch {
        // 如果URL解析失败，返回一个默认的占位符
        return '/favicon.ico';
    }
};

// 获取多个可能的favicon URL作为备用选项
const getFaviconUrls = (url: string): string[] => {
    try {
        const domain = new URL(url).hostname;
        return [
            `https://${domain}/favicon.ico`,
            `https://${domain}/favicon.png`,
            `https://${domain}/apple-touch-icon.png`,
            `https://${domain}/apple-touch-icon-precomposed.png`,
        ];
    } catch {
        return ['/favicon.ico'];
    }
};

// 单独的客户端组件来处理图标
const SiteIcon = ({ src, alt, websiteUrl }: SiteIconProps) => {
    const [currentSrc, setCurrentSrc] = React.useState(src);
    const [fallbackIndex, setFallbackIndex] = React.useState(0);
    const [showIcon, setShowIcon] = React.useState(true);

    const handleError = () => {
        // 获取所有可能的favicon URL
        const fallbackUrls = getFaviconUrls(websiteUrl);

        if (fallbackIndex < fallbackUrls.length - 1) {
            // 尝试下一个备用URL
            setCurrentSrc(fallbackUrls[fallbackIndex + 1]);
            setFallbackIndex(fallbackIndex + 1);
        } else {
            // 所有URL都失败了，隐藏图标
            setShowIcon(false);
        }
    };

    if (!showIcon) return null;

    return (
        <Image
            src={currentSrc}
            alt={alt}
            width={16}
            height={16}
            className="flex-shrink-0 rounded-sm"
            onError={handleError}
        />
    );
};export default SiteIcon;
