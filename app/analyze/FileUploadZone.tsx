'use client';

import { useState, useRef } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Upload, FileText, X, CheckCircle, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface FileUploadZoneProps {
    onFileChange: (files: FileList | null) => void;
    currentFile: File | null;
    accept?: string;
    maxSize?: number; // MB
    className?: string;
}

export default function FileUploadZone({
    onFileChange,
    currentFile,
    accept = ".sb3,.json,.cc3,application/json,application/octet-stream",
    maxSize = 50,
    className
}: FileUploadZoneProps) {
    const [dragActive, setDragActive] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const acceptedFormats = accept.split(',').map(format => format.trim().replace('.', ''));

    const validateFile = (file: File): boolean => {
        setError(null);

        // 检查文件大小
        if (file.size > maxSize * 1024 * 1024) {
            setError(`文件大小不能超过 ${maxSize}MB`);
            return false;
        }

        // 检查文件扩展名
        const fileExtension = file.name.split('.').pop()?.toLowerCase();
        if (!fileExtension || !acceptedFormats.some(format =>
            format.toLowerCase().includes(fileExtension) ||
            fileExtension === format.toLowerCase()
        )) {
            setError(`不支持的文件格式，请上传 ${acceptedFormats.join(', ')} 格式的文件`);
            return false;
        }

        return true;
    };

    const handleFiles = (files: FileList | null) => {
        if (!files || files.length === 0) return;

        const file = files[0];
        if (validateFile(file)) {
            onFileChange(files);
        } else {
            onFileChange(null);
        }
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

    const removeFile = () => {
        setError(null);
        onFileChange(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const formatFileSize = (bytes: number): string => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    return (
        <div className={cn("space-y-4", className)}>
            <Card>
                <CardContent className="p-0">
                    <div
                        className={cn(
                            "relative border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all duration-200",
                            "min-h-[200px] flex flex-col items-center justify-center",
                            dragActive ? "border-primary bg-primary/5 scale-105" : "border-muted-foreground/25 hover:border-primary hover:bg-muted/20",
                            error ? "border-destructive bg-destructive/5" : "",
                            currentFile ? "border-primary bg-primary/5" : ""
                        )}
                        onDragEnter={handleDrag}
                        onDragLeave={handleDrag}
                        onDragOver={handleDrag}
                        onDrop={handleDrop}
                        onClick={openFileDialog}
                    >
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept={accept}
                            onChange={handleInputChange}
                            className="hidden"
                        />

                        {currentFile ? (
                            <div className="space-y-4 w-full">
                                <div className="flex items-center justify-center">
                                    <CheckCircle className="w-12 h-12 text-primary" />
                                </div>
                                <div className="space-y-2">
                                    <div className="flex items-center justify-center gap-2">
                                        <FileText className="w-5 h-5 text-primary" />
                                        <span className="font-medium text-foreground">{currentFile.name}</span>
                                    </div>
                                    <Badge variant="outline" className="text-sm">
                                        {formatFileSize(currentFile.size)}
                                    </Badge>
                                </div>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        removeFile();
                                    }}
                                    className="flex items-center gap-2"
                                >
                                    <X className="w-4 h-4" />
                                    移除文件
                                </Button>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                <div className="flex justify-center">
                                    {error ? (
                                        <AlertCircle className="w-12 h-12 text-destructive" />
                                    ) : (
                                        <Upload className="w-12 h-12 text-muted-foreground" />
                                    )}
                                </div>
                                <div className="space-y-2">
                                    <h3 className="text-lg font-medium text-foreground">
                                        {dragActive ? "释放文件开始分析" : "上传Scratch作品文件"}
                                    </h3>
                                    <p className="text-sm text-muted-foreground">
                                        拖拽文件到这里或点击选择文件
                                    </p>
                                    <p className="text-xs text-muted-foreground">
                                        支持 .sb3, .json, .cc3 格式，大小不超过 {maxSize}MB
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>

            {error && (
                <div className="flex items-center gap-2 p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
                    <AlertCircle className="w-4 h-4 text-destructive flex-shrink-0" />
                    <span className="text-sm text-destructive">{error}</span>
                </div>
            )}
        </div>
    );
}
