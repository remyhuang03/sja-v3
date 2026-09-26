import sitesData from '@/data/nav/sites.json';

const sites: Record<string, string[]> = sitesData;
export default function getNavItemById(ids: number[]): string[][] {
  return ids.map(id => sites[String(id)]).filter((site): site is string[] => !!site);
}
