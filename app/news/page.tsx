import { getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import Markdown from "../components/layout/Markdown";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ a?: string }>;
}) {
  const article = (await searchParams).a;
  const t = await getTranslations("articles");
  if (!article || !/^[a-zA-Z0-9-]+$/.test(article) || !t.has(article))
    notFound();
  return (
    <div className="mx-4 mb-10 sm:mx-6">
      <Markdown mdText={t.raw(article)} />
    </div>
  );
}
