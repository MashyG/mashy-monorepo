import { marked } from "marked"; // 一个把 markdown 转换为 HTML 的库
import sanitizeHtml from "sanitize-html"; // 一个 HTML 清理库

const allowedTags = sanitizeHtml.defaults.allowedTags.concat([
  "img",
  "h1",
  "h2",
  "h3",
]);
const allowedAttributes = Object.assign(
  {},
  sanitizeHtml.defaults.allowedAttributes,
  {
    img: ["alt", "src"],
  }
);

type NotePreviewProps = {
  children: string;
};

export default function NotePreview({ children }: NotePreviewProps) {
  const showHtml = sanitizeHtml(marked(children || "") as string, {
    allowedTags,
    allowedAttributes,
  });

  return (
    <div className="note-preview">
      <div
        className="text-with-markdown"
        dangerouslySetInnerHTML={{
          __html: showHtml,
        }}
      />
    </div>
  );
}
