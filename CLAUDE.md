# HappyDaysOut (happydaysout.shmor.ai)

A Shmor marketplace (shared rules in `../../CLAUDE.md`): its own brand, design and SEO. Family days out for less (UK, US, Europe): theme park offers, kids-go-free deals, real discount schemes, free days out, experience days and Harry Potter / Disney days out, with tips from the mascot **Scout the Fox**. Replaced the planned "Shmor Experiences" entry. Repo: `Shmorai/shmor-happydaysout` (private until launch). Status: **building**, no referral links yet.

## Where things are
| What | Where |
|---|---|
| Card on shmor.ai, search keywords, **referral links**, offers, SEO defaults | `shmor-site.json` |
| Pages (1 JSON file = 1 Google landing page) | `content/` (`home.json` = homepage, `content/blog/*.json` = posts) |
| Site-specific blocks: `scout`, `attractions`, `codes` | `tools/blocks.js` (documented at the top of the file) |
| Mascot artwork | `assets/scout.svg` (full Scout), `assets/favicon.svg` (logo mark) |
| Design: header, logo, footer | `templates/layout.html` |
| Design: styles | `assets/site.css` (kit defaults at the top; **HappyDaysOut theme** block at the bottom) |
| Copy-code buttons, region tabs | `assets/site.js` |
| Generated output (don't edit by hand) | `index.html`, `*/index.html`, `sitemap.xml`, `robots.txt`, `404.html`, `search/`, `blog/feed.xml` |

## Pages (44)
Home · theme-parks · harry-potter-days-out · disney-deals · discount-codes · experience-days · free-days-out · local-days-out ("Near me") · uk-days-out · international-days-out · merlin-annual-pass · zoos-and-aquariums · meet-scout (mascot + editorial standards) · blog (+30 posts).
Top menu = pages with `navOrder` (Theme parks, Harry Potter, Disney, Discount codes, Experiences, Free days out, Near me, Blog).

## Design: "sunny storybook" (built 2026-10-14)
Light cream pages #FFF8EE, navy ink #1F2A44, tangerine #FF7A1A (buttons, matches the shmor.ai card accent), sunshine #FFD23F, grass #1E8E5A (links/CTAs), sky #2BA6E0 (CTA band). Fonts: Fredoka (headings) + Nunito (body). Navy top line with the "Part of the Shmor.ai network" link; logo = fox head in a yellow rounded square + "Happy**DaysOut**". Home hero: sky gradient, sun, bunting and a bobbing Scout. Inner pages: photo hero with navy overlay and a wavy bottom edge. Chunky outlined search, sticker-style chips, cards with soft offset shadows, wavy navy footer. Mobile checked at 375px (no horizontal scroll).

## Scout the Fox (mascot) rules
Scout gives **editorial guidance** only: who a day out suits, how to save, what to watch out for. Never star ratings, invented visitor reviews or fake quotes. `meet-scout` explains this publicly. Scout appears as a `scout` block (tip or verdict) on every page and post, and as "Scout says" lines on attraction cards.

## Offers & discount codes
The `codes` block shows voucher cards. **Only real, checked offers**: every item has `"checked": "YYYY-MM-DD"` and links to the official source. A `"code"` is shown only when the user supplies or we verify a real current code; otherwise the card says what to do instead (e.g. "Show badge + badge ID card"). Offers live in the page JSON (`content/discount-codes.json` has the full list; home, free-days-out, harry-potter and disney pages reuse subsets). Re-check dated facts (Museums on Us dates, Merlin pass tiers, Every Kid Outdoors year, Days Out Guide listings) when refreshing.

## Referral links (none yet)
Programmes worth applying to (user must join; never invent IDs): experience gifts (Virgin Experience Days, Buyagift, Red Letter Days), attraction tickets (Tiqets, GetYourGuide, Klook, Attraction Tickets Direct), theme parks / Merlin, Disneyland Paris, Kids Pass. When links arrive: add to `shmor-site.json` → `"links"`, then use the slug as `"link"` on `attractions`/`codes` items (renders a "See tickets / Get this offer" button via shmor.ai/go/) or in a page's `"partners"`. Rebuild, sync the master, commit both repos.

## Blog (/blog/)
30 posts dated 2026-09-15 → 2026-10-14 (seasonal: half-term, Halloween, Christmas; money-saving: 2FOR1 rail, Blue Peter badge, Kids Pass, kids go free, annual passes, fake codes; Harry Potter, Disney/Epic Universe, Merlin changes; US: Every Kid Outdoors, free US days out, national parks; ideas for toddlers/teens/rainy days, picnics, zoos, steam trains, Europe's parks). Each post has a Scout tip, internal links to 2–5 HappyDaysOut pages/posts, related cards, FAQs (FAQPage schema) and official sources; many link to sister sites (traveldeals.shmor.ai family-holidays, Orlando, UK ETA, EES/ETIAS, city breaks, Christmas markets; cruisedeals.shmor.ai family-cruises; petsavings.shmor.ai dog walkers). Writing rules: research with web search, confirm on official sites, "as of" wording for things that change, no invented prices/stats/reviews, free-licence Unsplash photo (images.unsplash.com only, not plus.unsplash.com).

## Commands (run here)
```bash
node tools/build.js           # rebuild after ANY change to content/, templates/ or shmor-site.json
node tools/build.js --check   # validate only
node tools/serve.js 4013      # preview http://localhost:4013  (preview config "happydaysout")
```
After changing `shmor-site.json`, also run `node tools/sync-network.js` in `../../shmor-ai`.

## Ideas / next
Referral links (above) · more local/regional pages (London, Scotland, Wales, Orlando, Paris) · seasonal refresh of offers · weekly blog automation like TravelDeals · after launch: Search Console + sitemap.
