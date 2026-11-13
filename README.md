# Order Entry Playground

**Try the review flow before wiring up the AI.**

Once a document comes in, who checks it, which fields can change, and what happens when something looks wrong?

This small React demo lets you walk through those questions with mock data before connecting OCR or a business system.

## What you can try

- An upload screen and simulated recognition results.
- A manual-review form with editable structured fields.
- Record filters and a mock audit-log interface.

## Run the demo

From the repository root, using Node.js and npm:

```bash
cd ai-order-entry-mvp
npm install
npm run dev
```

Open the local address printed by Vite. See the [original setup and feature notes](ai-order-entry-mvp/README.md) and [product scope](ai-order-entry-mvp/PRODUCT.md) for details.

## What is mocked

Recognition, records, and audit logs use sample data. There is no OCR integration, language model, backend, or database. Uploads are not persisted. The Excel export control is a UI placeholder and does not create a file.

This is an interaction prototype, not a production order-processing system. The setup instructions come from the existing project; the public copy was not rebuilt during this documentation update. Some linked project notes are in Chinese.

## Sources and license

The new presentation material and the owner's original contributions are published under the [MIT license](LICENSE). Third-party material keeps its own licenses and attribution; this license does not relicense it. Existing source and license files have not been changed by this update.

This public snapshot contains 20 source files. The [source manifest](SOURCE_MANIFEST.csv) lists their paths and hashes. Original media, databases, private account records, and unprocessed attachments are outside this public text-and-source snapshot.

Publication and static checks do not establish runtime readiness, customer acceptance, or measured productivity gains.

<details>
<summary>Reference links retained from the project notes</summary>

These links were present in the source notes; they have not all been independently reviewed.

- https://github.com/sponsors/SuperchupuDev
- https://github.com/sponsors/ai
- https://github.com/sponsors/antonk52
- https://github.com/sponsors/feross
- https://github.com/sponsors/jonschlinkert
- https://github.com/sponsors/ljharb
- https://github.com/sponsors/rawify
- https://github.com/sponsors/sindresorhus
- https://github.com/vitejs/vite

</details>
