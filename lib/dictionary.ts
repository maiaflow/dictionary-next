export type DictionaryEntry = {
  word: string;
  partOfSpeech?: string;
  definition?: string;
  excerpt?: string;
  page?: string;
};

export const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

export function normalizeWord(word = "") {
  return word.trim();
}

export function normalizeSortText(value = "") {
  return normalizeWord(value).normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

export function stripHtml(value = "") {
  return value.replace(/<[^>]+>/g, " ").replace(/&nbsp;/g, " ").trim();
}

export function getEntryLetter(entry: DictionaryEntry) {
  const firstCharacter = normalizeSortText(entry.word).charAt(0).toUpperCase();

  return /^[A-Z]$/.test(firstCharacter) ? firstCharacter : "#";
}

export function getSortedEntries(entries: DictionaryEntry[] = []) {
  return [...entries]
    .filter((entry) => normalizeWord(entry.word) || stripHtml(entry.definition))
    .sort((entryA, entryB) => {
      const wordComparison = normalizeSortText(entryA.word).localeCompare(
        normalizeSortText(entryB.word),
        undefined,
        { sensitivity: "base" },
      );

      if (wordComparison !== 0) {
        return wordComparison;
      }

      return normalizeSortText(stripHtml(entryA.definition)).localeCompare(
        normalizeSortText(stripHtml(entryB.definition)),
        undefined,
        { sensitivity: "base" },
      );
    });
}

export function groupEntriesByLetter(entries: DictionaryEntry[]) {
  return entries.reduce<Record<string, DictionaryEntry[]>>((groups, entry) => {
    const letter = getEntryLetter(entry);
    groups[letter] = [...(groups[letter] || []), entry];
    return groups;
  }, {});
}

export function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

export function hasHtmlTags(value: string) {
  return /<\/?[a-z][\s\S]*>/i.test(value);
}

export function getDefinitionHtml(definition = "") {
  const trimmedDefinition = definition.trim();

  if (!trimmedDefinition) {
    return "";
  }

  if (hasHtmlTags(trimmedDefinition)) {
    return trimmedDefinition;
  }

  return `<p>${escapeHtml(trimmedDefinition).replace(/\r?\n/g, "<br>")}</p>`;
}

export function getInlineRichTextHtml(value = "") {
  const trimmedValue = value.trim();

  if (!trimmedValue) {
    return "";
  }

  if (!hasHtmlTags(trimmedValue)) {
    return escapeHtml(trimmedValue).replace(/\r?\n/g, "<br>");
  }

  return trimmedValue
    .replace(/^<p(?:\s[^>]*)?>/i, "")
    .replace(/<\/p>$/i, "")
    .replace(/<\/p>\s*<p(?:\s[^>]*)?>/gi, "<br>");
}

export function getExcerptCitationHtml(entry: DictionaryEntry) {
  const excerpt = getInlineRichTextHtml(entry.excerpt);
  const page = normalizeWord(entry.page);

  if (!excerpt) {
    return "";
  }

  if (!page) {
    return `“${excerpt}”`;
  }

  const pageReference = /^p\.?\s/i.test(page) ? page : `p. ${page}`;

  return `“${excerpt}” ${escapeHtml(pageReference)}`;
}
