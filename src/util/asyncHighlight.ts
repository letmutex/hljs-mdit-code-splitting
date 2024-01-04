import hljs from 'highlight.js/lib/core'

export async function asyncHighlight(code: string, lang: string): Promise<string | null> {
  let promise: Promise<any | null> | null = null
  // We cannot put lang to our dynamic import statement, the packing tool
  // won't be happy if we did that. We need to make the import explicit,
  // so the packing tool will generate these language chunks.
  switch (lang) {
    case 'typescript': {
      promise = import('highlight.js/lib/languages/typescript')
      break
    }
    case 'javascript': {
      promise = import('highlight.js/lib/languages/javascript')
      break
    }
    case 'css': {
      promise = import('highlight.js/lib/languages/css')
      break
    }
    case 'html':
    case 'xml': {
      promise = import('highlight.js/lib/languages/xml')
      break
    }
    case 'java': {
      promise = import('highlight.js/lib/languages/java')
      break
    }
    case 'kotlin': {
      promise = import('highlight.js/lib/languages/kotlin')
      break
    }
    case 'rust': {
      promise = import('highlight.js/lib/languages/rust')
      break
    }
    case 'c': {
      promise = import('highlight.js/lib/languages/c')
      break
    }
    case 'diff': {
      promise = import('highlight.js/lib/languages/diff')
      break
    }
  }
  if (promise == null) {
    // We don't know or don't need this language
    return null
  }
  return await promise
    .then((language) => {
      if (language != null) {
        // The language module is imported
        hljs.registerLanguage(lang, language.default)
        return true
      } else {
        return false
      }
    })
    .then((shouldHighlight) => {
      if (shouldHighlight) {
        return hljs.highlight(code, { language: lang }).value
      } else {
        return null
      }
    })
    .catch((e) => {
      // Failed to import or highlight
      console.error('Failed to highlight:', e)
      return null
    })
}
