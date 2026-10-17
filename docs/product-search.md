# Intelligent product search

Search is integrated with the existing shop and navigation search fields. It uses the storefront catalog for descriptions and intent matching, then confirms and enriches matched products from the existing Prisma `Product` records. Product IDs must resolve to storefront pages, so unrelated legacy/demo rows in the product table are not shown.

## What it supports

- Relevance-ranked name, category, description, tag, product-ID, and model/SKU-like ID searches.
- Typo tolerance and cautious spelling suggestions, without correcting numeric IDs.
- A centralized synonym list for clothing terms such as sari/saree and kurta/kurti.
- Natural-language price phrases including `under 1500`, `below 2000`, and `between 500 and 1500`.
- Category and price filters, pagination, and relevance/price/name sorting in the search API.
- Debounced product/category suggestions, keyboard selection, and explicit loading/error/no-results states.

The catalog is small and has no configured embedding/vector service. Semantic-style matching is therefore implemented with local synonyms and the product descriptions already in the project; there is no paid AI dependency, external product-data transfer, migration, or additional environment variable. Search terms and synonyms are maintained in `src/lib/productSearch.ts`.

## API

- `GET /api/products/search?q=kurti&page=1&size=20`
- `GET /api/products/search?q=shirts%20under%201000&category=Men&sort=price-asc`
- `GET /api/products/search?q=sareee&exact=true`
- `GET /api/products/suggestions?q=kur`

Search pagination is one-based. `size` is limited to 50. Supported sort values are `relevance`, `price-asc`, `price-desc`, and `name`. `exact=true` disables fuzzy/synonym matching so customers can explicitly retry their original spelling. Invalid filters and overlong queries return HTTP 400; database/search failures return a generic HTTP 500 response and are logged server-side.

## Run and verify

```powershell
npm run dev
```

Use `/shop` or the navigation search and try searches such as `kurti`, a misspelling like `kurtie`, `shirts under 1000`, and a category such as `women`. Verify category and price results against the inventory shown on the shop page. The same endpoints can be exercised directly in a browser or with `Invoke-WebRequest`.

No schema migration or environment setup is needed; the existing database configuration and product records are reused.
