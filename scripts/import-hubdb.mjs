import { writeFile } from "node:fs/promises";

const tableId = process.env.HUBSPOT_HUBDB_TABLE_ID || "318438928";
const portalId = process.env.HUBSPOT_PORTAL_ID || "21495103";
const token = process.env.HUBSPOT_ACCESS_TOKEN;

const entries = [];
let after;

do {
  const params = new URLSearchParams({ limit: "100" });

  if (after) {
    params.set("after", decodeURIComponent(after));
  }

  const response = await fetch(
    `https://api.hubapi.com/cms/v3/hubdb/tables/${tableId}/rows?portalId=${portalId}&${params}`,
    {
      headers: token ? { Authorization: `Bearer ${token}` } : undefined,
    },
  );

  if (!response.ok) {
    throw new Error(`HubDB request failed: ${response.status} ${await response.text()}`);
  }

  const payload = await response.json();

  for (const row of payload.results || []) {
    const values = row.values || {};

    entries.push({
      word: values.word || "",
      partOfSpeech: values.part_of_speech || "",
      definition: values.definition || "",
      excerpt: values.excerpt || "",
      page: values.page || "",
    });
  }

  after = payload.paging?.next?.after;
} while (after);

const file = `import type { DictionaryEntry } from "@/lib/dictionary";

export const dictionaryEntries: DictionaryEntry[] = ${JSON.stringify(entries, null, 2)};
`;

await writeFile(new URL("../data/dictionary.ts", import.meta.url), file);
console.log(`Imported ${entries.length} entries from HubDB table ${tableId}.`);
