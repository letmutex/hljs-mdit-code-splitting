<script setup lang="ts">
import markdownit from 'markdown-it';
import { asyncHighlight } from "./util/asyncHighlight";
// A markdown theme CSS is needed, markdown-it is just a parsing library.
// I use the old good GitHub theme: https://github.com/sindresorhus/github-markdown-css
import "github-markdown-css/github-markdown-light.css";
import 'highlight.js/styles/github.css';

const md = markdownit({
  html: true,
  linkify: true,
  highlight: function (code: string, lang: string) {
    if (lang == null) {
      return '';
    }
    asyncHighlight(code, lang)
      .then((highlighted) => {
        if (highlighted == null || onHighlighted == null) return;
        onHighlighted(code, lang, highlighted);
      });
    return '';
  }
});

function onHighlighted(code: string, lang: string, highlighted: string) {
  // Find the target <code></code> element and replace innerHTML with
  // the rendered html.
  const trimmedCode = code.trim();
  const elements = document.querySelectorAll(`code.language-${lang}`);
  for (const element of elements) {
    if (element.innerHTML.trim() === trimmedCode) {
      // Got it!
      element.innerHTML = highlighted;
      break;
    }
  }
}

const html = md.render(`
\`\`\`typescript
function hi() {
  return "Hi"
}
console.log(\`\${hi()}, Jack.\`)
\`\`\`
`);
</script>

<template>
  <div v-html="html" class="markdown-body"></div>
</template>
