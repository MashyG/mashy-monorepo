import { defineDocumentType, makeSource } from "contentlayer/source-files";
import remarkGfm from "remark-gfm"; // 用于扩展 Markdown 语法
import rehypePrismPlus from "rehype-prism-plus"; //用于处理语法高亮

export const Post = defineDocumentType(() => ({
  name: "Post",
  filePathPattern: `**/*.mdx`,
  contentType: "mdx",
  fields: {
    title: { type: "string", required: true },
    date: { type: "date", required: true },
  },
  computedFields: {
    url: {
      type: "string",
      resolve: (post) => `/posts/${post._raw.flattenedPath}`,
    },
  },
}));

export default makeSource({
  contentDirPath: "posts",
  documentTypes: [Post],
  mdx: {
    remarkPlugins: [remarkGfm],
    rehypePlugins: [
      [rehypePrismPlus, { defaultLanguage: "js", ignoreMissing: true }],
    ],
  },
});
