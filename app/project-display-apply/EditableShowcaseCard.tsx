"use client";
import React, { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { ShowcaseCardState, ProjectLinkItem, buildSubmissionFormData, isSubmissionReady } from './types';
import ImageCropModal from './ImageCropModal';
// simple id generator (timestamp + random) to avoid extra dependency
const genId = () => `${Date.now().toString(36)}-${Math.random().toString(36).slice(2,8)}`;

interface EditableShowcaseCardProps {
  value: ShowcaseCardState;
  onChange: (v: ShowcaseCardState) => void;
  onSubmit?: (fd: FormData, state: ShowcaseCardState) => Promise<void> | void;
}

// Helper: update state immutably
function update<T extends keyof ShowcaseCardState>(state: ShowcaseCardState, key: T, val: ShowcaseCardState[T]): ShowcaseCardState {
  return { ...state, [key]: val };
}

const MAX_TITLE = 20;
const MAX_AUTHOR = 12;
const MAX_BRIEF = 20;

export const defaultShowcaseState: ShowcaseCardState = {
  projectName: '',
  authorName: '',
  authorLink: '',
  projectBrief: '',
  links: [],
  defaultLinkId: '',
  coverFile: null,
  avatarFile: null,
  agreedNotice: false,
  confirmedAuthor: false,
  confirmedContent: false,
};

export default function EditableShowcaseCard({ value, onChange, onSubmit }: EditableShowcaseCardProps) {
  const [editing, setEditing] = useState<string | null>(null);
  const [tempFile, setTempFile] = useState<File | null>(null);
  const [cropAspect, setCropAspect] = useState(1);
  const [cropSize, setCropSize] = useState<{width:number;height:number}>({width:400,height:400});
  const [cropOpen, setCropOpen] = useState(false);
  const titleRef = useRef<HTMLInputElement>(null);
  const authorRef = useRef<HTMLInputElement>(null);
  const briefRef = useRef<HTMLInputElement>(null);
  const authorLinkRef = useRef<HTMLInputElement>(null);

  const avatarUrl = value.avatarFile ? URL.createObjectURL(value.avatarFile) : null;
  const coverUrl = value.coverFile ? URL.createObjectURL(value.coverFile) : null;

  useEffect(() => () => { // revoke on unmount
    if (avatarUrl) URL.revokeObjectURL(avatarUrl);
    if (coverUrl) URL.revokeObjectURL(coverUrl);
  }, [avatarUrl, coverUrl]);

  useEffect(() => {
    if (editing === 'projectName' && titleRef.current) titleRef.current.focus();
    if (editing === 'authorName' && authorRef.current) authorRef.current.focus();
    if (editing === 'projectBrief' && briefRef.current) briefRef.current.focus();
    if (editing === 'authorLink' && authorLinkRef.current) authorLinkRef.current.focus();
  }, [editing]);

  const updateState = <K extends keyof ShowcaseCardState>(k: K, v: ShowcaseCardState[K]) => onChange(update(value, k, v));

  const addLink = () => {
  const item: ProjectLinkItem = { id: genId(), platform: '', url: '' };
    updateState('links', [...value.links, item]);
  };
  const updateLink = (id: string, field: keyof ProjectLinkItem, v: string) => {
    updateState('links', value.links.map(l => l.id === id ? { ...l, [field]: v } : l));
  };
  const removeLink = (id: string) => {
    const filtered = value.links.filter(l => l.id !== id);
    const newDefault = value.defaultLinkId === id ? '' : value.defaultLinkId;
    onChange({ ...value, links: filtered, defaultLinkId: newDefault });
  };

  const openCropper = (file: File, aspect: number, size: {width:number;height:number}, target: 'avatarFile'|'coverFile') => {
    setTempFile(file);
    setCropAspect(aspect);
    setCropSize(size);
    setCropOpen(true);
    // store target in editing var meta
    setEditing(target);
  };

  const handleLocalImage = (e: React.ChangeEvent<HTMLInputElement>, target: 'avatarFile'|'coverFile') => {
    const f = e.target.files?.[0];
    if (!f) return;
    const aspect = target === 'avatarFile' ? 1 : 4/3;
    const size = target === 'avatarFile' ? {width:400,height:400} : {width:800,height:600};
    openCropper(f, aspect, size, target);
  };

  const handleCropped = (blob: Blob) => {
    const file = new File([blob], editing === 'avatarFile' ? 'avatar.jpg' : 'cover.jpg', { type: 'image/jpeg' });
    if (editing === 'avatarFile') updateState('avatarFile', file);
    else if (editing === 'coverFile') updateState('coverFile', file);
    setEditing(null);
  };

  const saveSubmission = async () => {
    if (!isSubmissionReady(value)) return;
    const fd = buildSubmissionFormData(value);
    if (onSubmit) await onSubmit(fd, value);
    else {
      // default placeholder submit
      await fetch('/api/v2/project-display-apply', { method: 'POST', body: fd });
    }
  };

  // keyboard commit
  const commitOnEnter: React.KeyboardEventHandler<HTMLInputElement> = (e) => {
    if (e.key === 'Enter') setEditing(null);
    if (e.key === 'Escape') setEditing(null);
  };

  return (
    <div className="space-y-4">
      {/* Card mimic production display look */}
      <div className="w-[240px] select-none">
        <div className="group h-full flex flex-col rounded-2xl border border-border/60 shadow-sm bg-card/80 backdrop-blur-sm overflow-hidden">
          {/* Poster */}
          <div className="relative aspect-[4/3] bg-gradient-to-br from-muted/60 to-muted/20">
            {coverUrl ? (
              <Image src={coverUrl} alt="cover" fill className="object-cover" />
            ) : (
              <div className="absolute inset-0 flex flex-col items-center justify-center text-xs text-muted-foreground">
                <span>点击上传封面</span>
                <span className="opacity-60 mt-1">4:3</span>
              </div>
            )}
            <label className="absolute inset-0 cursor-pointer opacity-0 hover:opacity-100 bg-black/40 text-white flex flex-col items-center justify-center text-xs transition-opacity">
              <span className="mb-1">更换封面</span>
              <input type="file" accept="image/*" className="hidden" onChange={e=>handleLocalImage(e,'coverFile')} />
            </label>
          </div>
          {/* Content area */}
          <div className="p-3 flex flex-col gap-1">
            <div className="flex items-center gap-1.5">
              <div className="w-6 h-6 relative rounded-full overflow-hidden bg-muted ring-1 ring-border/50 shrink-0">
                {avatarUrl ? (
                  <Image src={avatarUrl} alt="avatar" fill className="object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-[10px] text-muted-foreground">头像</div>
                )}
                <label className="absolute inset-0 cursor-pointer bg-black/40 opacity-0 hover:opacity-100 text-[10px] text-white flex items-center justify-center">
                  <input type="file" accept="image/*" className="hidden" onChange={e=>handleLocalImage(e,'avatarFile')} />
                  编辑
                </label>
              </div>
              <div className="flex-1 min-w-0">
                {editing === 'projectName' ? (
                  <input ref={titleRef} maxLength={MAX_TITLE} value={value.projectName} onChange={e=>updateState('projectName', e.target.value)} onKeyDown={commitOnEnter} onBlur={()=>setEditing(null)} className="w-full bg-transparent text-[13px] font-semibold outline-none border-b border-primary" placeholder="作品名称" />
                ) : (
                  <div className="text-[13px] font-semibold line-clamp-2 cursor-text hover:bg-primary/10 px-1 rounded" onClick={()=>setEditing('projectName')} title="点击编辑作品名称">
                    {value.projectName || '点击输入作品名称'}
                  </div>
                )}
                {editing === 'authorName' ? (
                  <input ref={authorRef} maxLength={MAX_AUTHOR} value={value.authorName} onChange={e=>updateState('authorName', e.target.value)} onKeyDown={commitOnEnter} onBlur={()=>setEditing(null)} className="w-full bg-transparent text-[11px] outline-none border-b border-primary" placeholder="作者昵称" />
                ) : (
                  <div className="text-[11px] text-muted-foreground cursor-text hover:bg-primary/10 px-1 rounded" onClick={()=>setEditing('authorName')} title="点击编辑作者昵称">{value.authorName || '点击输入作者昵称'}</div>
                )}
              </div>
            </div>
            <div>
              {editing === 'projectBrief' ? (
                <input ref={briefRef} maxLength={MAX_BRIEF} value={value.projectBrief} onChange={e=>updateState('projectBrief', e.target.value)} onKeyDown={commitOnEnter} onBlur={()=>setEditing(null)} className="w-full bg-transparent text-[11px] outline-none border-b border-primary" placeholder="作品简介（可选）" />
              ) : (
                <div className="text-[11px] text-muted-foreground line-clamp-3 cursor-text hover:bg-primary/10 px-1 -mx-1 rounded min-h-[2.5rem]" onClick={()=>setEditing('projectBrief')} title="点击编辑简介">{value.projectBrief || '点击输入作品简介（可选）'}</div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Links editing */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-medium">作品链接</h4>
          <button onClick={addLink} className="text-xs px-2 py-1 rounded bg-primary text-primary-foreground hover:bg-primary/90">添加</button>
        </div>
        {value.links.length === 0 && <div className="text-xs text-muted-foreground border border-dashed rounded p-3 text-center">暂无链接，点击添加</div>}
        <div className="space-y-2">
          {value.links.map(l => (
            <div key={l.id} className="flex items-start gap-2 text-xs border rounded p-2 bg-background/60">
              <select value={l.platform} onChange={e=>updateLink(l.id,'platform',e.target.value)} className="bg-transparent border px-1 rounded">
                <option value="">平台</option>
                <option value="scratch">Scratch官网</option>
                <option value="40code">40code</option>
                <option value="github">GitHub</option>
                <option value="other">其他</option>
              </select>
              <input value={l.url} onChange={e=>updateLink(l.id,'url',e.target.value)} placeholder="https://..." className="flex-1 bg-transparent border px-1 rounded outline-none" />
              <button onClick={()=>updateState('defaultLinkId', l.id)} className={`px-2 py-1 rounded border ${value.defaultLinkId===l.id? 'bg-primary text-primary-foreground':'bg-muted'}`}>{value.defaultLinkId===l.id?'默认':'设为默认'}</button>
              <button onClick={()=>removeLink(l.id)} className="px-2 py-1 rounded border bg-destructive/10 hover:bg-destructive/20 text-destructive">删</button>
            </div>
          ))}
        </div>
        <div className="text-[10px] text-muted-foreground">默认链接会用于主卡片跳转。</div>
      </div>

      {/* Author external link */}
      <div className="space-y-1">
        <label className="text-sm font-medium">作者外部链接（可选）</label>
        {editing === 'authorLink' ? (
          <input ref={authorLinkRef} value={value.authorLink} onChange={e=>updateState('authorLink', e.target.value)} onKeyDown={commitOnEnter} onBlur={()=>setEditing(null)} placeholder="https://..." className="w-full bg-transparent border px-2 py-1 rounded outline-none text-xs" />
        ) : (
          <div className="text-xs cursor-text border rounded px-2 py-1 hover:bg-primary/10" onClick={()=>setEditing('authorLink')}>{value.authorLink || '点击添加作者链接（可选）'}</div>
        )}
      </div>

      {/* Confirmations */}
      <div className="grid gap-2 text-xs">
        <label className="flex items-center gap-2"><input type="checkbox" checked={value.agreedNotice} onChange={e=>updateState('agreedNotice', e.target.checked)} /> 阅读并同意申请须知</label>
        <label className="flex items-center gap-2"><input type="checkbox" checked={value.confirmedAuthor} onChange={e=>updateState('confirmedAuthor', e.target.checked)} /> 确认作者授权</label>
        <label className="flex items-center gap-2"><input type="checkbox" checked={value.confirmedContent} onChange={e=>updateState('confirmedContent', e.target.checked)} /> 确认内容健康</label>
      </div>

      <button disabled={!isSubmissionReady(value)} onClick={saveSubmission} className="w-full text-sm font-medium rounded bg-primary text-primary-foreground py-2 disabled:opacity-40 disabled:cursor-not-allowed">提交申请</button>

      {/* Crop Modals */}
      <ImageCropModal isOpen={cropOpen} onClose={()=>{setCropOpen(false); setEditing(null);}} onCropComplete={handleCropped} imageFile={tempFile} aspectRatio={cropAspect} cropSize={cropSize} title={cropAspect===1?'裁剪头像 (1:1)':'裁剪封面 (4:3)'} />
    </div>
  );
}
