import type { DictionaryEntry } from "@/lib/dictionary";

const DEFAULT_PORTAL_ID = "21495103";
const DEFAULT_TABLE_ID = "318438928";
const DEFAULT_REVALIDATE_SECONDS = 60;

type HubDbValue =
  | null
  | undefined
  | string
  | number
  | boolean
  | HubDbValue[]
  | {
      html?: HubDbValue;
      label?: HubDbValue;
      name?: HubDbValue;
      text?: HubDbValue;
      title?: HubDbValue;
      value?: HubDbValue;
    };

type HubDbRow = {
  values?: Record<string, HubDbValue>;
};

type HubDbRowsResponse = {
  results?: HubDbRow[];
  paging?: {
    next?: {
      after?: string;
    };
  };
};

function getDisplayValue(value: HubDbValue): string {
  if (value === null || value === undefined) {
    return "";
  }

  if (typeof value === "string") {
    return value;
  }

  if (typeof value === "number" || typeof value === "boolean") {
    return String(value);
  }

  if (Array.isArray(value)) {
    return value.map(getDisplayValue).filter(Boolean).join(", ");
  }

  return (
    getDisplayValue(value.html) ||
    getDisplayValue(value.label) ||
    getDisplayValue(value.name) ||
    getDisplayValue(value.value) ||
    getDisplayValue(value.text) ||
    getDisplayValue(value.title)
  );
}

function getRevalidateSeconds() {
  const parsedValue = Number.parseInt(
    process.env.HUBDB_REVALIDATE_SECONDS || "",
    10,
  );

  return Number.isFinite(parsedValue) && parsedValue > 0
    ? parsedValue
    : DEFAULT_REVALIDATE_SECONDS;
}

function getHubDbRowsUrl(after?: string) {
  const portalId = process.env.HUBSPOT_PORTAL_ID || DEFAULT_PORTAL_ID;
  const tableId = process.env.HUBSPOT_HUBDB_TABLE_ID || DEFAULT_TABLE_ID;
  const url = new URL(`https://api.hubapi.com/cms/v3/hubdb/tables/${tableId}/rows`);

  url.searchParams.set("portalId", portalId);
  url.searchParams.set("limit", "100");

  if (after) {
    url.searchParams.set("after", decodeURIComponent(after));
  }

  return url;
}

export async function getDictionaryEntriesFromHubDb(): Promise<DictionaryEntry[]> {
  const entries: DictionaryEntry[] = [];
  let after: string | undefined;

  do {
    const response = await fetch(getHubDbRowsUrl(after), {
      next: { revalidate: getRevalidateSeconds() },
    });

    if (!response.ok) {
      throw new Error(`HubDB request failed: ${response.status} ${response.statusText}`);
    }

    const payload = (await response.json()) as HubDbRowsResponse;

    for (const row of payload.results || []) {
      const values = row.values || {};

      entries.push({
        word: getDisplayValue(values.word),
        partOfSpeech: getDisplayValue(values.part_of_speech),
        definition: getDisplayValue(values.definition),
        excerpt: getDisplayValue(values.excerpt),
        page: getDisplayValue(values.page),
      });
    }

    after = payload.paging?.next?.after;
  } while (after);

  return entries;
}
