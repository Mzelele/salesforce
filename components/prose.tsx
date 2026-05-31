import clsx from "clsx";

const escapeHtml = (value: string) =>
  value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;")
    .replace(/'/g, "&#039;");

const contentToHtml = (value: string) => {
  if (/<[a-z][\s\S]*>/i.test(value)) return value;
  return value
    .split(/\n{2,}/)
    .map((block) => {
      const trimmed = block.trim();
      if (!trimmed) return "";
      if (trimmed.startsWith("### ")) return `<h3>${escapeHtml(trimmed.slice(4))}</h3>`;
      if (trimmed.startsWith("## ")) return `<h2>${escapeHtml(trimmed.slice(3))}</h2>`;
      if (trimmed.startsWith("# ")) return `<h1>${escapeHtml(trimmed.slice(2))}</h1>`;
      if (trimmed.split("\n").every((line) => line.trim().startsWith("- "))) {
        return `<ul>${trimmed.split("\n").map((line) => `<li>${escapeHtml(line.trim().slice(2))}</li>`).join("")}</ul>`;
      }
      return `<p>${escapeHtml(trimmed).replace(/\n/g, "<br />")}</p>`;
    })
    .join("");
};

const Prose = ({ html, className }: { html: string; className?: string }) => {
  return (
    <div
      className={clsx(
        "prose mx-auto max-w-6xl text-base leading-7 text-neutral-700 prose-headings:mt-8 prose-headings:font-semibold prose-headings:tracking-wide prose-headings:text-neutral-900 prose-h1:text-5xl prose-h2:text-4xl prose-h3:text-3xl prose-h4:text-2xl prose-h5:text-xl prose-h6:text-lg prose-a:text-neutral-900 prose-a:underline prose-a:hover:text-blue-700 prose-strong:text-neutral-900 prose-ol:mt-8 prose-ol:list-decimal prose-ol:pl-6 prose-ul:mt-8 prose-ul:list-disc prose-ul:pl-6",
        className,
      )}
      dangerouslySetInnerHTML={{ __html: contentToHtml(html) }}
    />
  );
};

export default Prose;
