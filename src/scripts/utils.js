export async function getAllposts() {
  return Object.values(await import.meta.glob('../pages/posts/*.md', { eager: true }));
}

export function getUniqueTags(posts) {
  const tags = posts.map((post) => post.frontmatter.tags).flat();
  return [...new Set(tags)];
}