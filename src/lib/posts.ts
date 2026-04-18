import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const postsDir = path.join(process.cwd(), 'content/posts');

export interface PostMeta {
  slug: string;
  title_tr: string;
  title_en: string;
  date: string;
  league_tr: string;
  league_en: string;
  home_team: string;
  away_team: string;
  match_date: string;
  tags: string[];
  over25: number;
  over35: number;
  btts: number;
  fhover15: number;
  fhbtts: number;
  corners: number;
}

export interface Post extends PostMeta {
  content: string;
}

export function getAllPosts(): PostMeta[] {
  if (!fs.existsSync(postsDir)) return [];

  const files = fs.readdirSync(postsDir).filter(f => f.endsWith('.mdx'));

  const posts = files.map(file => {
    const slug = file.replace('.mdx', '');
    const raw = fs.readFileSync(path.join(postsDir, file), 'utf-8');
    const { data } = matter(raw);
    return { slug, ...data } as PostMeta;
  });

  return posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export function getPostBySlug(slug: string): Post | null {
  const filePath = path.join(postsDir, `${slug}.mdx`);
  if (!fs.existsSync(filePath)) return null;

  const raw = fs.readFileSync(filePath, 'utf-8');
  const { data, content } = matter(raw);
  return { slug, content, ...data } as Post;
}
