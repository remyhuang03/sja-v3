'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { requestJSON } from '@/lib/api';

type Report = { total_block_count: number; sprite_count: number; total_paragraph_count: number };
type Comparison = { similarity: number; opcode_similarity: number; structure_similarity: number; left: Report; right: Report };

export default function ComparePage() {
  const [original, setOriginal] = useState<File | null>(null);
  const [compared, setCompared] = useState<File | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState<Comparison | null>(null);
  async function submit(event: React.FormEvent) {
    event.preventDefault();
    if (!original || !compared || busy) return;
    setError(''); setResult(null);
    if ([original, compared].some(file => file.size > 48 * 1024 * 1024)) { setError('每个文件不得超过 48 MiB。'); return; }
    setBusy(true);
    try {
      const body = new FormData(); body.append('original', original); body.append('compared', compared);
      const response = await requestJSON<{ data: Comparison }>('/api/v2/compare', { method: 'POST', body });
      setResult(response.data);
    } catch (e) { setError(e instanceof Error ? e.message : '对比失败'); }
    finally { setBusy(false); }
  }
  const percent = (value: number) => `${(value * 100).toFixed(1)}%`;
  return <div className="mx-auto max-w-4xl px-4 py-10 space-y-6">
    <div><h1 className="text-3xl font-bold">作品相似度对比</h1><p className="mt-3 text-muted-foreground">比较两个 Scratch 作品的积木类型与连接关系。支持 SB3、CC3 和 JSON，每个文件最大 48 MiB。</p></div>
    <Card><CardHeader><CardTitle>选择两个作品</CardTitle></CardHeader><CardContent>
      <form onSubmit={submit} className="space-y-5">
        <div className="grid gap-5 md:grid-cols-2">
          <div className="space-y-2"><Label htmlFor="original">原作品</Label><Input id="original" type="file" accept=".sb3,.cc3,.json" required disabled={busy} onChange={e => setOriginal(e.target.files?.[0] ?? null)} /></div>
          <div className="space-y-2"><Label htmlFor="compared">待比较作品</Label><Input id="compared" type="file" accept=".sb3,.cc3,.json" required disabled={busy} onChange={e => setCompared(e.target.files?.[0] ?? null)} /></div>
        </div>
        <Button disabled={busy || !original || !compared}>{busy ? '正在对比…' : '开始对比'}</Button>
      </form>
    </CardContent></Card>
    {error && <Alert variant="destructive" role="alert"><AlertDescription>{error}</AlertDescription></Alert>}
    {result && <Card aria-live="polite"><CardHeader><CardTitle>综合相似度 {percent(result.similarity)}</CardTitle></CardHeader><CardContent className="space-y-4">
      <p>积木类型：{percent(result.opcode_similarity)} · 连接关系：{percent(result.structure_similarity)}</p>
      <table className="w-full text-left text-sm"><thead><tr><th className="py-2">指标</th><th>原作品</th><th>待比较作品</th></tr></thead><tbody>
        {([['total_block_count', '积木'], ['total_paragraph_count', '脚本'], ['sprite_count', '角色']] as const).map(([key, label]) => <tr key={key} className="border-t"><th className="py-3">{label}</th><td>{result.left[key]}</td><td>{result.right[key]}</td></tr>)}
      </tbody></table>
      <p className="text-sm text-muted-foreground">采用积木类型和相邻积木类型的多重集合 Dice 系数，忽略积木 ID、坐标和素材。数值反映结构相似程度，不能单独作为抄袭认定依据；常用模板也可能得到较高分数。</p>
    </CardContent></Card>}
  </div>;
}
