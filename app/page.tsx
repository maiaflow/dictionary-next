import { DictionaryBrowser } from "@/components/DictionaryBrowser";
import { getDictionaryEntriesFromHubDb } from "@/lib/hubdb";

export const revalidate = 60;

export default async function Home() {
  const dictionaryEntries = await getDictionaryEntriesFromHubDb();

  return (
    <div className="page-shell">
      <DictionaryBrowser
        entries={dictionaryEntries}
        emptyMessage="No published HubDB rows were found."
      />
    </div>
  );
}
