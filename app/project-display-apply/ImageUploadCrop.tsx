'use client';

import { useState, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Upload, Image as ImageIcon } from "lucide-react";

interface ImageUploadCropProps {
    aspectRatio?: number;
    cropSize?: { width: number; height: number };
    onImageChange: (file: File | null) => void;
    currentImage?: string;
    placeholder?: string;
    maxSize?: number; // MB
}

export default function ImageUploadCrop({
    aspectRatio = 1,
    cropSize = { width: 200, height: 200 },
    onImageChange,
    currentImage,
    placeholder = "选择图片",
    maxSize = 5
}: ImageUploadCropProps) {
    const [dragActive, setDragActive] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFiles = (files: FileList | null) => {
        if (!files || files.length === 0) return;

        const file = files[0];
        
        // 验证文件类型
        if (!file.type.startsWith('image/')) {
            alert('请选择图片文件');
            return;
        }

        // 验证文件大小
        if (file.size > maxSize * 1024 * 1024) {
            alert(`文件大小不能超过 ${maxSize}MB`);
            return;
        }

        onImageChange(file);
    };

    const handleDrag = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        handleFiles(e.dataTransfer.files);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        handleFiles(e.target.files);
    };

    const openFileDialog = () => {
        fileInputRef.current?.click();
    };

    return (
        <Card className="w-full">
            <CardContent className="p-4">
                <div
                    className={`
                        border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-all
                        ${dragActive ? 'border-purple-400 bg-purple-50' : 'border-gray-300 hover:border-purple-400'}
                        ${currentImage ? 'min-h-[200px]' : 'min-h-[150px]'}
                    `}
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={handleDrop}
                    onClick={openFileDialog}
                >
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleInputChange}
                        className="hidden"
                    />

                    {currentImage ? (
                        <div className="space-y-4">
                            <div className="relative inline-block">
                                <img
                                    src={currentImage}
                                    alt="预览"
                                    className="max-w-full max-h-48 object-contain rounded"
                                    style={{
                                        aspectRatio: aspectRatio,
                                        width: `${cropSize.width}px`,
                                        height: `${cropSize.height}px`
                                    }}
                                />
                            </div>
                            <Button variant="outline" size="sm">
                                <Upload className="w-4 h-4 mr-2" />
                                更换图片
                            </Button>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            <div className="flex justify-center">
                                <ImageIcon className="w-12 h-12 text-gray-400" />
                            </div>
                            <div>
                                <p className="text-lg font-medium text-gray-700">{placeholder}</p>
                                <p className="text-sm text-gray-500 mt-1">
                                    拖拽图片到这里或点击选择文件
                                </p>
                                <p className="text-xs text-gray-400 mt-1">
                                    支持 JPG、PNG 格式，大小不超过 {maxSize}MB
                                </p>
                            </div>
                            <Button variant="outline">
                                <Upload className="w-4 h-4 mr-2" />
                                选择文件
                            </Button>
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}
