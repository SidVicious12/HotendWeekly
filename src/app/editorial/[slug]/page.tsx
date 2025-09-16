import { getArticleBySlug, articles } from '@/data/articles'
import { notFound } from 'next/navigation'
import ArticlePageClient from './client'

export async function generateStaticParams() {
  return articles.map((article) => ({
    slug: article.slug,
  }))
}

interface PageProps {
  params: {
    slug: string
  }
}

export default function ArticlePage({ params }: PageProps) {
  const article = getArticleBySlug(params.slug)

  if (!article) {
    notFound()
  }

  return <ArticlePageClient article={article} />
}