"use client";

import { useState } from "react";
import { RichText } from "@/components/RichText";
import {
  alphabet,
  getDefinitionHtml,
  getExcerptCitationHtml,
  getSortedEntries,
  groupEntriesByLetter,
  normalizeWord,
  type DictionaryEntry,
} from "@/lib/dictionary";
import styles from "./DictionaryBrowser.module.css";

type DictionaryBrowserProps = {
  entries?: DictionaryEntry[];
  emptyMessage: string;
};

function combineClassNames(...classNames: Array<string | undefined | false>) {
  return classNames.filter(Boolean).join(" ") || undefined;
}

export function DictionaryBrowser({
  entries = [],
  emptyMessage,
}: DictionaryBrowserProps) {
  const sortedEntries = getSortedEntries(entries);
  const groupedEntries = groupEntriesByLetter(sortedEntries);
  const activeLetters = alphabet.filter((letter) => groupedEntries[letter]);
  const sectionLetters = groupedEntries["#"]
    ? ["#", ...activeLetters]
    : activeLetters;
  const [selectedLetter, setSelectedLetter] = useState<string | null>(null);
  const activeFilterLetter =
    selectedLetter && groupedEntries[selectedLetter] ? selectedLetter : null;
  const visibleSectionLetters = activeFilterLetter ? [activeFilterLetter] : sectionLetters;
  const visibleEntriesCount = activeFilterLetter
    ? groupedEntries[activeFilterLetter].length
    : sortedEntries.length;

  if (!sortedEntries.length) {
    return (
      <section className={styles.wrapper}>
        <h1>Dictionary</h1>
        <p className={styles.empty}>{emptyMessage}</p>
      </section>
    );
  }

  return (
    <section className={styles.wrapper} aria-label="Dictionary">
      <div className={styles.header}>
        <h1>Dictionary</h1>
        <p className={styles.count}>
          {visibleEntriesCount} {visibleEntriesCount === 1 ? "entry" : "entries"}
        </p>
      </div>

      <nav className={styles.alphabetNav} aria-label="Dictionary letters">
        {alphabet.map((letter) =>
          groupedEntries[letter] ? (
            <button
              key={letter}
              type="button"
              className={combineClassNames(
                styles.letterLink,
                activeFilterLetter === letter ? styles.letterLinkActive : "",
              )}
              aria-pressed={activeFilterLetter === letter}
              onClick={() =>
                setSelectedLetter(activeFilterLetter === letter ? null : letter)
              }
            >
              {letter}
            </button>
          ) : (
            <span key={letter} className={styles.letterDisabled} aria-disabled="true">
              {letter}
            </span>
          ),
        )}
      </nav>

      <div className={styles.scroller}>
        {visibleSectionLetters.map((letter) => (
          <section key={letter} id={`dictionary-${letter}`} className={styles.section}>
            <h3>{letter}</h3>
            <div className={styles.entries}>
              {groupedEntries[letter].map((entry, index) => {
                const definitionHtml = getDefinitionHtml(entry.definition);
                const excerptCitationHtml = getExcerptCitationHtml(entry);

                return (
                  <article
                    key={`${normalizeWord(entry.word)}-${entry.partOfSpeech}-${index}`}
                    className={styles.entry}
                  >
                    <div className={styles.entryHeader}>
                      <h4>{entry.word}</h4>
                      {entry.partOfSpeech ? (
                        <span className={styles.partOfSpeech}>{entry.partOfSpeech}</span>
                      ) : null}
                    </div>
                    <RichText
                      html={definitionHtml}
                      className={combineClassNames(styles.definition, styles.styledText)}
                    />
                    <RichText
                      html={excerptCitationHtml}
                      className={combineClassNames(styles.excerpt, styles.styledText)}
                    />
                  </article>
                );
              })}
            </div>
          </section>
        ))}
      </div>
    </section>
  );
}
