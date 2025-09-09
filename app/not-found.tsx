"use client"

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function NotFound() {
    const router = useRouter();

    useEffect(() => {
        const timer = setTimeout(() => {
            router.push('/');
        }, 5000);

        return () => clearTimeout(timer);
    }, [router]);

    return (<div className="text-center my-[40vh]">
        <h1>404 Not Found</h1>
        <h2>输入的网址不存在唉，呜呜呜~</h2>
        <p>5秒后自动跳转到主页...</p>
    </div>
    );
}