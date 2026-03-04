import { getCollection } from "astro:content";

export async function getAllposts() {
  return await getCollection("blog");
}

export function getUniqueTags(posts) {
  const tags = posts.map((post) => post.data.tags).flat();
  return [...new Set(tags)];
}

/**
 * Calculates the duration between two dates and returns a human-readable string.
 * @param {Date} startDate
 * @param {Date | null} endDate - If null, uses today's date.
 * @returns {string} e.g. "3 yrs 1 mo", "5 mos", "2 yrs"
 */
export function getDateDuration(startDate, endDate) {
  const end = endDate ?? new Date();

  let years = end.getFullYear() - startDate.getFullYear();
  let months = end.getMonth() - startDate.getMonth();

  if (months < 0) {
    years -= 1;
    months += 12;
  }

  const yearStr = years === 1 ? "1 yr" : years > 1 ? `${years} yrs` : "";
  const monthStr = months === 1 ? "1 mo" : months > 1 ? `${months} mos` : "";

  if (yearStr && monthStr) return `${yearStr} ${monthStr}`;
  if (yearStr) return yearStr;
  if (monthStr) return monthStr;
  return "";
}