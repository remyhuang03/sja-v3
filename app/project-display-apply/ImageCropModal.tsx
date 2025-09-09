'use client';

import React, { useState, useRef, useCallback } from 'react';
import ReactCrop, { Crop, PixelCrop, centerCrop, makeAspectCrop } from 'react-image-crop';

interface ImageCropModalProps {
    isOpen: boolean;
    onClose: () => void;
    onCropComplete: (croppedImageBlob: Blob) => void;
    imageFile: File | null;
    aspectRatio?: number; // 宽高比，例如：1为正方形，16/9为宽屏
    cropSize?: { width: number; height: number }; // 输出尺寸
    title?: string;
}

function centerAspectCrop(
    mediaWidth: number,
    mediaHeight: number,
    aspect: number,
) {
    return centerCrop(
        makeAspectCrop(
            {
                unit: '%',
                width: 90,
            },
            aspect,
            mediaWidth,
            mediaHeight,
        ),
        mediaWidth,
        mediaHeight,
    )
}

export default function ImageCropModal({
    isOpen,
    onClose,
    onCropComplete,
    imageFile,
    aspectRatio = 1, // 默认正方形
    cropSize = { width: 400, height: 400 },
    title = "裁剪图片"
}: ImageCropModalProps) {
    const [crop, setCrop] = useState<Crop>();
    const [completedCrop, setCompletedCrop] = useState<PixelCrop>();
    const [imageUrl, setImageUrl] = useState<string>('');
    const [isProcessing, setIsProcessing] = useState(false);
    const imgRef = useRef<HTMLImageElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);

    // 当图片文件改变时，创建预览URL
    React.useEffect(() => {
        if (imageFile) {
            const url = URL.createObjectURL(imageFile);
            setImageUrl(url);
            return () => URL.revokeObjectURL(url);
        }
    }, [imageFile]);

    const onImageLoad = useCallback((e: React.SyntheticEvent<HTMLImageElement>) => {
        const { width, height } = e.currentTarget;
        setCrop(centerAspectCrop(width, height, aspectRatio));
    }, [aspectRatio]);

    // 生成裁剪后的图片
    const generateCroppedImage = useCallback(async () => {
        if (!completedCrop || !imgRef.current || !canvasRef.current) {
            return;
        }

        setIsProcessing(true);

        const image = imgRef.current;
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');

        if (!ctx) {
            setIsProcessing(false);
            return;
        }

        const scaleX = image.naturalWidth / image.width;
        const scaleY = image.naturalHeight / image.height;

        // 设置画布尺寸
        canvas.width = cropSize.width;
        canvas.height = cropSize.height;

        // 绘制裁剪后的图片
        ctx.drawImage(
            image,
            completedCrop.x * scaleX,
            completedCrop.y * scaleY,
            completedCrop.width * scaleX,
            completedCrop.height * scaleY,
            0,
            0,
            cropSize.width,
            cropSize.height,
        );

        // 转换为Blob
        canvas.toBlob((blob) => {
            if (blob) {
                onCropComplete(blob);
                onClose();
            }
            setIsProcessing(false);
        }, 'image/jpeg', 0.9);
    }, [completedCrop, cropSize, onCropComplete, onClose]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-auto">
                <div className="p-6">
                    {/* 标题栏 */}
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-3">
                            <span className="material-symbols-outlined text-blue-600">crop</span>
                            {title}
                        </h2>
                        <button
                            onClick={onClose}
                            className="text-gray-400 hover:text-gray-600 transition-colors"
                        >
                            <span className="material-symbols-outlined text-3xl">close</span>
                        </button>
                    </div>

                    {/* 裁剪区域 */}
                    {imageUrl && (
                        <div className="space-y-6">
                            <div className="flex justify-center bg-gray-100 rounded-xl p-4">
                                <ReactCrop
                                    crop={crop}
                                    onChange={(_, percentCrop) => setCrop(percentCrop)}
                                    onComplete={(c) => setCompletedCrop(c)}
                                    aspect={aspectRatio}
                                    className="max-w-full max-h-96"
                                >
                                    <img
                                        ref={imgRef}
                                        alt="待裁剪图片"
                                        src={imageUrl}
                                        onLoad={onImageLoad}
                                        className="max-w-full max-h-96 object-contain"
                                    />
                                </ReactCrop>
                            </div>

                            {/* 提示信息 */}
                            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                                <div className="flex items-start gap-3">
                                    <span className="material-symbols-outlined text-blue-600 mt-0.5">info</span>
                                    <div>
                                        <h4 className="font-semibold text-blue-800 mb-2">裁剪提示</h4>
                                        <ul className="text-sm text-blue-700 space-y-1">
                                            <li>• 拖拽选择框四角可调整裁剪区域大小</li>
                                            <li>• 拖拽选择框中心可移动裁剪位置</li>
                                            <li>• 输出尺寸：{cropSize.width} × {cropSize.height} 像素</li>
                                            <li>• 宽高比：{aspectRatio === 1 ? '正方形 (1:1)' : `${aspectRatio.toFixed(2)}:1`}</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>

                            {/* 操作按钮 */}
                            <div className="flex gap-4 justify-end">
                                <button
                                    onClick={onClose}
                                    className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors font-medium"
                                >
                                    取消
                                </button>
                                <button
                                    onClick={generateCroppedImage}
                                    disabled={!completedCrop || isProcessing}
                                    className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all font-medium flex items-center gap-2"
                                >
                                    {isProcessing ? (
                                        <>
                                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                            处理中...
                                        </>
                                    ) : (
                                        <>
                                            <span className="material-symbols-outlined text-sm">check</span>
                                            确认裁剪
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    )}

                    {/* 隐藏的画布用于生成裁剪图片 */}
                    <canvas
                        ref={canvasRef}
                        className="hidden"
                        width={cropSize.width}
                        height={cropSize.height}
                    />
                </div>
            </div>
        </div>
    );
}
