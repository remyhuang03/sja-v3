'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { requestJSON } from '@/lib/api';
import Image from 'next/image';

type Application = {
  id: string; project_name: string; author_name: string; author_link: string; brief: string;
  links: { url: string; platform: string; is_default: boolean }[];
  cover_image_path: string; avatar_image_path: string;
  status: 'pending' | 'approved' | 'rejected'; created_at: string; reviewer_notes: string;
};

export default function ReviewPage() {
  // The credential stays in memory and is cleared on refresh/logout.
  const [token, setToken] = useState('');
  const [authenticated, setAuthenticated] = useState(false);
  const [items, setItems] = useState<Application[]>([]);
  const [page, setPage] = useState(0);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [notes, setNotes] = useState<Record<string, string>>({});
  async function load(target = page) {
    setBusy(true); setError('');
    try {
      const rows = await requestJSON<Application[]>(`/api/v2/project-display-review?limit=20&offset=${target * 20}`, { headers: { Authorization: `Bearer ${token}` } });
      setItems(rows); setPage(target); setAuthenticated(true);
    } catch (e) { setError(e instanceof Error ? e.message : '加载失败'); }
    finally { setBusy(false); }
  }
  async function review(id: string, status: 'approved' | 'rejected') {
    setBusy(true); setError('');
    try {
      await requestJSON('/api/v2/project-display-review', { method: 'POST', headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' }, body: JSON.stringify({ id, status, notes: notes[id] || '' }) });
      await load();
    } catch (e) { setError(e instanceof Error ? e.message : '审核失败'); }
    finally { setBusy(false); }
  }
  return <div className="max-w-5xl mx-auto px-4 py-10 space-y-6">
    <div className="flex justify-between items-center gap-4"><h1 className="text-2xl font-bold">作品展位审核</h1>{authenticated && <Button variant="outline" onClick={() => { setToken(''); setAuthenticated(false); setItems([]); }}>退出</Button>}</div>
    {error && <Alert variant="destructive" role="alert"><AlertDescription>{error}</AlertDescription></Alert>}
    {!authenticated ? <Card><CardHeader><CardTitle>管理员验证</CardTitle></CardHeader><CardContent><form className="space-y-4" onSubmit={e => { e.preventDefault(); void load(0); }}>
      <Label htmlFor="admin-token">审核密钥</Label><Input id="admin-token" type="password" value={token} onChange={e => setToken(e.target.value)} autoComplete="off" required />
      <Button disabled={busy}>{busy ? '验证中…' : '进入审核'}</Button>
    </form></CardContent></Card> : <>
      <div className="flex gap-3 items-center"><Button variant="outline" disabled={busy || page === 0} onClick={() => load(page - 1)}>上一页</Button><span>第 {page + 1} 页</span><Button variant="outline" disabled={busy || items.length < 20} onClick={() => load(page + 1)}>下一页</Button><Button variant="ghost" disabled={busy} onClick={() => load()}>刷新</Button></div>
      {items.length === 0 && <p className="text-muted-foreground">暂无申请。</p>}
      {items.map(item => <Card key={item.id}><CardHeader><CardTitle className="flex justify-between gap-4"><span>{item.project_name}</span><Badge variant={item.status === 'pending' ? 'secondary' : 'outline'}>{({ pending: '待审核', approved: '已通过', rejected: '已拒绝' })[item.status]}</Badge></CardTitle></CardHeader><CardContent className="space-y-4">
        <div className="flex flex-col sm:flex-row gap-5"><Image src={item.cover_image_path} width={240} height={180} alt={`${item.project_name}封面`} className="rounded-md object-contain" /><div className="space-y-3"><div className="flex items-center gap-2"><Image src={item.avatar_image_path} width={32} height={32} alt="作者头像" className="rounded-full" /><a href={item.author_link} target="_blank" rel="noopener noreferrer" className="underline">{item.author_name}</a></div><p>{item.brief}</p><p className="text-sm text-muted-foreground">{new Date(item.created_at).toLocaleString('zh-CN')}</p>{item.links.map((link, i) => <a className="block text-sm underline break-all" key={i} href={link.url} target="_blank" rel="noopener noreferrer">{link.platform || '作品链接'}{link.is_default ? '（默认）' : ''}：{link.url}</a>)}</div></div>
        {item.status === 'pending' ? <div className="space-y-3"><Label htmlFor={`notes-${item.id}`}>审核备注（拒绝时必填）</Label><Textarea id={`notes-${item.id}`} maxLength={2000} value={notes[item.id] || ''} onChange={e => setNotes(previous => ({ ...previous, [item.id]: e.target.value }))} /><div className="flex gap-3"><Button disabled={busy} onClick={() => review(item.id, 'approved')}>通过并展示</Button><Button variant="destructive" disabled={busy || !notes[item.id]?.trim()} onClick={() => review(item.id, 'rejected')}>拒绝</Button></div></div> : <p className="text-sm text-muted-foreground">{item.reviewer_notes || '无审核备注'}</p>}
      </CardContent></Card>)}
    </>}
  </div>;
}
