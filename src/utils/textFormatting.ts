export function formatTitleWithHighlights(text: string) {
  return text.split(/(\[[^\]]+\])/).map((part) => {
    if (part.startsWith('[') && part.endsWith(']')) {
      return {
        text: part.slice(1, -1),
        highlight: true
      };
    }
    return {
      text: part,
      highlight: false
    };
  });
} 