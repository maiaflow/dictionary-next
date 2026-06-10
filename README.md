# Dictionary Next

Standalone Next.js version of the HubSpot dictionary project.

This copy removes HubSpot CMS module fields and HubL templates. Dictionary entries currently load from the public HubDB rows API, so the HubDB table remains the source of truth while the app can run on any Next.js host.

## Commands

```bash
npm install
npm run dev
npm run build
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

The page revalidates HubDB data every 60 seconds by default.

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

Because the app fetches HubDB from a server component, it should be hosted on a Next-capable platform such as Vercel, Netlify, or a Node server. If you need static-only hosting later, convert the HubDB table to local data during build or move the content into another database.

- keep the dictionary as checked-in static data
- fetch from a private backend/API route using a server-side HubSpot token
- move the content into a database such as Supabase, Neon/Postgres, PlanetScale, Turso, or Airtable
