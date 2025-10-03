'use client'

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import Link from "next/link"
import Image from "next/image"

interface Project {
  id: string
  name: string
  author: string
  author_link: string
  project_link: string
  brief: string
}

export default function ProjectDisplay() {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
  async function fetchProjects() {
      try {
  const response = await fetch('/api/v2/projects-display?n=5', {
          cache: "no-store",
        })
        if (response.ok) {
          const data = await response.json()
          setProjects(data)
        } else {
          setError(true)
        }
      } catch (err) {
        setError(true)
      } finally {
        setLoading(false)
      }
    }

    fetchProjects()
  }, [])

  return (
    <Card className="mb-8">
      <CardContent className="p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold flex items-center gap-2 tracking-wide text-foreground">
            🐱 <span>作品展位</span>
          </h2>
          <div className="flex gap-3">
            <Link href="/project-display-apply" target="_blank" rel="noopener noreferrer" className="text-sm text-muted-foreground hover:text-primary transition-colors">
              申请展位
            </Link>
          </div>
        </div>

        {/* Projects */}
        {loading ? (
          <div className="flex gap-4 overflow-x-auto py-4 custom-scrollbar snap-x snap-mandatory">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="snap-start w-56 flex-shrink-0 rounded-xl border border-border/50 bg-card/60 animate-pulse overflow-hidden">
                <div className="flex p-3 gap-3">
                  <div className="w-9 h-9 bg-muted-foreground/15 rounded-full" />
                  <div className="flex-1 space-y-2">
                    <div className="h-3 bg-muted-foreground/15 rounded w-4/5" />
                    <div className="h-2 bg-muted-foreground/15 rounded w-2/3" />
                  </div>
                </div>
                <div className="aspect-[4/3] bg-muted-foreground/10" />
                <div className="p-3">
                  <div className="h-2 bg-muted-foreground/15 rounded w-full" />
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-4 text-muted-foreground">
            <p>无法加载作品列表</p>
          </div>
        ) : (
  <div className="flex gap-4 overflow-x-auto py-4 custom-scrollbar snap-x snap-mandatory">
            {projects.map((project) => (
              <div
                key={project.id}
        className="group snap-start w-56 flex-shrink-0 rounded-2xl border border-border/60 bg-[hsl(var(--card)_/_85%)] hover:bg-[hsl(var(--card)_/_95%)] transition-colors overflow-hidden shadow-md hover:shadow-primary/20 ring-1 ring-border/40 hover:ring-primary/50 duration-500"
              >
                {/* Author and Project Info */}
        <div className="flex p-3 pb-2 gap-3 items-center">
                  <Link href={project.author_link} target="_blank" rel="noopener noreferrer" className="flex-shrink-0">
                    <Image
                      width={36}
                      height={36}
                      src={`/project-display/avatar/${project.id}.png`}
                      className="w-9 h-9 rounded-full ring-2 ring-primary/30 object-cover"
                      alt={project.author}
                      onError={(e) => {
                        const target = e.target as HTMLImageElement
                        target.style.display = 'none'
                      }}
                    />
                  </Link>
                  <div className="flex-1 min-w-0">
                    <Link href={project.project_link} target="_blank" rel="noopener noreferrer">
          <h3 className="text-sm font-semibold text-white group-hover:text-primary line-clamp-1 tracking-wide">
                        {project.name}
                      </h3>
                    </Link>
                    <Link href={project.author_link} target="_blank" rel="noopener noreferrer">
          <p className="text-xs text-muted-foreground hover:text-primary/80 truncate leading-tight">
                        {project.author}
                      </p>
                    </Link>
                  </div>
                </div>

                {/* Project Poster */}
                <Link href={project.project_link} target="_blank" rel="noopener noreferrer">
          <div className="aspect-[4/3] relative bg-muted overflow-hidden">
                    <Image
                      width={224}
            height={168}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.05] group-hover:rotate-[0.3deg]"
                      src={`/project-display/poster/${project.id}.png`}
                      alt={project.name}
                      onError={(e) => {
                        const target = e.target as HTMLImageElement
                        target.style.display = 'none'
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-background/40 via-background/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  </div>
                </Link>

                {/* Brief */}
                <div className="p-3 pt-2">
                  <p className="text-[12px] text-muted-foreground line-clamp-2 leading-relaxed min-h-[2.9rem]">
                    {project.brief || '暂无简介'}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
