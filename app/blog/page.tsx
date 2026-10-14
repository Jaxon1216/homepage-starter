import type { Metadata } from "next";
import { getAllPosts, getAllTags } from "@/lib/mdx";
import { BlogList } from "./BlogList";
import { MottoBlock } from "@/components/common/MottoBlock";

export const metadata: Metadata = {
  title: "Blog",
  description: "Technical articles and notes",
};

export default function BlogPage() {
  const posts = getAllPosts();
  const tags = getAllTags();

  return (
    <div className="max-w-3xl mx-auto px-4 py-16">
      <h1 className="text-3xl font-bold mb-8">Posts</h1>
      <BlogList posts={posts} tags={tags} />
      <MottoBlock text="If you can't explain it simply, you don't understand it well enough." />
    </div>
  );
}
