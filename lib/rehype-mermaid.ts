/**
 * Rehype plugin that extracts mermaid code blocks BEFORE rehype-pretty-code
 * processes them. Converts `<pre><code class="language-mermaid">` into a
 * `<div class="__mermaid__">` with the raw chart text as a child, so
 * rehype-pretty-code ignores it entirely.
 */

interface HastNode {
  type: string;
  tagName?: string;
  properties?: Record<string, unknown>;
  children?: HastNode[];
  value?: string;
}

function extractText(node: HastNode): string {
  if (node.type === "text") return node.value ?? "";
  return node.children?.map(extractText).join("") ?? "";
}

function walk(node: HastNode) {
  if (!node.children) return;
  for (let i = 0; i < node.children.length; i++) {
    const child = node.children[i];
    if (child.type === "element" && child.tagName === "pre") {
      const code = child.children?.[0];
      if (
        code?.type === "element" &&
        code.tagName === "code" &&
        Array.isArray(code.properties?.className) &&
        (code.properties.className as string[]).includes("language-mermaid")
      ) {
        node.children[i] = {
          type: "element",
          tagName: "div",
          properties: { className: ["__mermaid__"] },
          children: [{ type: "text", value: extractText(code) }],
        };
        continue;
      }
    }
    walk(child);
  }
}

export function rehypeMermaid() {
  return (tree: HastNode) => walk(tree);
}
