'use client'

import { useState, useEffect, useRef } from "react"
import Image from "next/image"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Upload, FileImage } from "lucide-react"

interface Project {
  id: string
  name: string
  author: string
  author_link: string
  project_link: string
  brief: string
}

export default function ProjectDisplayPage() {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [dragActive, setDragActive] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    async function fetchProjects() {
      try {
  const response = await fetch('/api/v2/projects-display?n=6', {
          cache: "no-store",
        })
        if (response.ok) {
          const data = await response.json()
          setProjects(data)
        }
      } catch (err) {
        console.error('Failed to fetch projects:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchProjects()
  }, [])

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files[0])
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault()
    if (e.target.files && e.target.files[0]) {
      handleFiles(e.target.files[0])
    }
  }

  const handleFiles = (file: File) => {
    console.log('File selected:', file.name)
    console.log('File type:', file.type)
    console.log('File size:', file.size, 'bytes')
    
    // 检查文件类型
    const allowedTypes = ['.sb3', '.sb2']
    const fileName = file.name.toLowerCase()
    const isValidType = allowedTypes.some(type => fileName.endsWith(type))
    
    if (!isValidType) {
      alert('请选择 .sb3 或 .sb2 格式的Scratch项目文件')
      return
    }
    
    // 检查文件大小 (50MB)
    const maxSize = 50 * 1024 * 1024
    if (file.size > maxSize) {
      alert('文件大小不能超过50MB')
      return
    }
    
    // 这里可以添加实际的文件上传逻辑
    alert(`文件 "${file.name}" 已选择，准备上传！`)
  }

  const onButtonClick = () => {
    fileInputRef.current?.click()
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header Section */}
      <div className="flex flex-col items-center mb-8">
        <h1 className="text-3xl font-bold mb-2">作品展示</h1>
        <p className="text-muted-foreground mb-6">展示您的优秀Scratch作品，让更多人发现和学习</p>
        
        {/* Action Buttons */}
        <div className="flex gap-4 mb-8">
          <Link href="/project-display-apply" target="_blank" rel="noopener noreferrer">
            <Button className="bg-primary hover:bg-primary/90">
              申请展位
            </Button>
          </Link>
          <Link href="/project-display-review" target="_blank" rel="noopener noreferrer">
            <Button variant="outline">
              查看作品
            </Button>
          </Link>
        </div>
      </div>

      {/* Top Right Corner Links */}
      <div className="fixed top-20 right-4 flex flex-col gap-2 z-10">
  <Link href="/project-display-apply" target="_blank" rel="noopener noreferrer">
          <Badge variant="secondary" className="cursor-pointer hover:bg-secondary/80">
            资格申请
          </Badge>
        </Link>
  <Link href="/project-display-review" target="_blank" rel="noopener noreferrer">
          <Badge variant="outline" className="cursor-pointer hover:bg-secondary/20">
            申请进度查询
          </Badge>
        </Link>
      </div>

      {/* Projects Grid */}
      <div className="mb-12">
        {/* Use auto-fit so last row left space is reduced; min width 220px scalable */}
        <div className="grid gap-5 [grid-template-columns:repeat(auto-fit,minmax(220px,1fr))] auto-rows-[1fr]">
          {loading ? (
            Array.from({ length: 10 }).map((_, i) => (
              <Card key={i} className="animate-pulse h-full flex flex-col">
                <CardContent className="p-4 flex flex-col h-full">
                  <div className="aspect-[4/3] bg-muted rounded-md mb-4"></div>
                  <div className="space-y-2 mb-2">
                    <div className="h-4 bg-muted rounded w-5/6"></div>
                    <div className="h-3 bg-muted rounded w-1/2"></div>
                  </div>
                  <div className="mt-auto h-3 bg-muted rounded w-20"></div>
                </CardContent>
              </Card>
            ))
          ) : (
            projects.map((project) => (
              <Card
                key={project.id}
                className="group h-full flex flex-col rounded-2xl border-border/50 hover:border-primary/40 shadow-sm hover:shadow-primary/10 transition-all duration-500 bg-card/70 hover:bg-card/90 backdrop-blur supports-[backdrop-filter]:bg-card/60 will-change-transform"
              >
                <CardContent className="p-4 flex flex-col h-full gap-1">
                  {/* Poster */}
                  <div className="relative mb-2 rounded-xl overflow-hidden bg-gradient-to-br from-muted/60 to-muted/20 aspect-[4/3] ring-1 ring-border/40 group-hover:ring-primary/40 transition-all duration-500">
                    <Image
                      src={`/project-display/poster/${project.id}.png`}
                      alt={project.name}
                      fill
                      className="object-cover transition-transform duration-700 ease-[cubic-bezier(.4,.2,.2,1)] group-hover:scale-[1.06] group-hover:rotate-[0.35deg]"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement
                        target.style.display = 'none'
                      }}
                      sizes="(max-width:768px) 100vw, 240px"
                      priority={false}
                    />
                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-background/40 via-background/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  </div>

                  {/* Title & Author */}
                  <h3 className="font-semibold text-[13px] leading-snug mb-0.5 line-clamp-2 group-hover:text-primary transition-colors tracking-wide">
                    {project.name}
                  </h3>
                  <div className="flex items-center gap-1.5 mb-1 text-[11px] text-muted-foreground">
                    <div className="w-6 h-6 relative rounded-full overflow-hidden bg-muted/60 ring-1 ring-border/50 shrink-0">
                      <Image
                        src={`/project-display/avatar/${project.id}.png`}
                        alt={project.author}
                        fill
                        className="object-cover"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement
                          target.style.display = 'none'
                        }}
                        sizes="32px"
                      />
                    </div>
                    <span className="truncate max-w-[120px]">{project.author}</span>
                  </div>

                  {/* Brief */}
                  <div className="mb-2 min-h-[2.75rem]">
                    {project.brief ? (
                      <p className="text-[11px] text-muted-foreground line-clamp-3 leading-relaxed">
                        {project.brief}
                      </p>
                    ) : (
                      <p className="text-[11px] text-muted-foreground italic opacity-60">暂无简介</p>
                    )}
                  </div>

                  <div className="mt-auto flex items-center justify-between pt-2 border-t border-border/50 group-hover:border-primary/30 transition-colors">
                    <Link
                      href={project.project_link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[11px] font-medium text-primary hover:underline inline-flex items-center gap-0.5"
                    >
                      <span className="translate-x-0 group-hover:translate-x-0.5 transition-transform">查看作品</span>
                      <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">→</span>
                    </Link>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-primary/12 text-primary/90 tracking-wide backdrop-blur-sm border border-primary/20">
                      展位
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>

      {/* File Upload Section */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <Upload className="w-5 h-5" />
          作品上传与设置
        </h2>
        
        <Card className="max-w-4xl mx-auto">
          <CardContent className="p-8">
            <h3 className="text-lg font-medium mb-6">上传作品文件</h3>
            
            {/* File Upload Area */}
            <div
              className={`relative border-2 border-dashed rounded-xl p-12 text-center transition-all duration-300 cursor-pointer min-h-[280px] flex items-center justify-center ${
                dragActive 
                  ? 'border-primary bg-primary/15 scale-[1.02] shadow-lg shadow-primary/25' 
                  : 'border-muted-foreground/30 hover:border-primary/70 hover:bg-primary/8 hover:shadow-md'
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              onClick={onButtonClick}
            >
              <input
                ref={fileInputRef}
                type="file"
                className="hidden"
                onChange={handleChange}
                accept=".sb3,.sb2"
              />
              
              <div className="flex flex-col items-center gap-6 pointer-events-none">
                <div className={`w-24 h-24 rounded-full flex items-center justify-center transition-all duration-300 ${
                  dragActive ? 'bg-primary/20 scale-110' : 'bg-primary/10'
                }`}>
                  <FileImage className="w-12 h-12 text-primary" />
                </div>
                
                <div className="space-y-4">
                  <p className="text-2xl font-semibold">
                    {dragActive ? '🎯 松开鼠标开始上传' : '📁 拖拽文件到此处'}
                  </p>
                  <p className="text-lg text-muted-foreground">
                    或者点击此区域选择文件
                  </p>
                  <p className="text-sm text-muted-foreground">
                    支持 .sb3 和 .sb2 格式的Scratch项目文件
                  </p>
                </div>
                
                <div className="flex gap-3">
                  <span className="px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-medium">
                    💾 拖拽上传
                  </span>
                  <span className="px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-medium">
                    🖱️ 点击选择
                  </span>
                </div>
                
                {/* Visual indicators */}
                <div className="absolute top-6 left-6 right-6 border border-dashed border-primary/30 rounded-lg h-8"></div>
                <div className="absolute bottom-6 left-6 right-6 border border-dashed border-primary/30 rounded-lg h-8"></div>
                <div className="absolute top-6 bottom-6 left-6 border border-dashed border-primary/30 rounded-lg w-8"></div>
                <div className="absolute top-6 bottom-6 right-6 border border-dashed border-primary/30 rounded-lg w-8"></div>
              </div>
            </div>
            
            <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>文件大小限制：最大 50MB</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span>支持格式：.sb3, .sb2</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                <span>上传后进入审核流程</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
