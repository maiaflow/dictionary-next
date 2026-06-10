# Dictionary Next

Standalone Next.js version of the HubSpot dictionary project.

This copy removes HubSpot CMS module fields and HubL templates. Dictionary entries currently load from the public HubDB rows API, so the HubDB table remains the source of truth while the app can run on any Next.js host.

## Commands

```bash
npm install
npm run dev
npm run build
npm run build:pages
npm start
```

## Data Source

By default, the app reads from:

```text
Portal: 21495103
HubDB table: 318438928
```

Override those values with:

```bash
HUBSPOT_PORTAL_ID=21495103
HUBSPOT_HUBDB_TABLE_ID=318438928
HUBDB_REVALIDATE_SECONDS=60
```

On a server-capable Next.js host, the page revalidates HubDB data every 60 seconds
by default. On GitHub Pages, the table is fetched during the GitHub Actions build
and published as static HTML.

## Local Data Shape

The app expects entries with this shape:

```ts
{
  word: string;
  partOfSpeech?: string;
  definition?: string;
  excerpt?: string;
  page?: string;
}
```

`definition` and `excerpt` can contain trusted rich-text HTML from HubDB. If this is later connected to a public form or untrusted external data source, sanitize those fields before rendering.

To convert the public HubDB table to checked-in local JSON/TypeScript later:

```bash
npm run import:hubdb
```

If the table becomes private again, run the same command with `HUBSPOT_ACCESS_TOKEN`.

## HubDB Note

The GitHub Pages workflow publishes the app to:

```text
https://maiaflow.github.io/dictionary-next/
```

GitHub Pages is static hosting, so newly published HubDB changes appear after the
workflow runs again. Push to `main` or run the `Deploy GitHub Pages` workflow
manually from GitHub Actions to rebuild from the current table.

If you need live content updates without rebuilding, host on a Next-capable
platform such as Vercel, Netlify, or a Node server, or move the content behind a
client-safe API.

- keep the dictionary as checked-in static data
- fetch from a private backend/API route using a server-side HubSpot token
- move the content into a database such as Supabase, Neon/Postgres, PlanetScale, Turso, or Airtable
