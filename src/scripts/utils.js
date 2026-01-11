import { getCollection } from "astro:content";

export async function getAllposts() {
  return await getCollection("blog");
}

export function getUniqueTags(posts) {
  const tags = posts.map((post) => post.data.tags).flat();
  return [...new Set(tags)];
}