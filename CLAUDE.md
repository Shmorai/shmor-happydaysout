# HappyDaysOut (happydaysout.shmor.ai)

A Shmor marketplace (shared rules in `../../CLAUDE.md`): its own brand, design and SEO. Family days out for less (UK, US, Europe): theme park offers, kids-go-free deals, real discount schemes, free days out, experience days and Harry Potter / Disney days out, with tips from the mascot **Scout the Fox**. Replaced the planned "Shmor Experiences" entry. Repo: `Shmorai/shmor-happydaysout` (private until launch). Status: **building**, no referral links yet.

## Where things are
| What | Where |
|---|---|
| Card on shmor.ai, search keywords, **referral links**, offers, SEO defaults | `shmor-site.json` |
| Pages (1 JSON file = 1 Google landing page) | `content/` (`home.json` = homepage, `content/blog/*.json` = posts) |
| Site-specific blocks: `scout`, `attractions`, `codes`, `finder` | `tools/blocks.js` + `tools/finder.js` (documented at the top of each) |
| Adventure finder data (108 days out: type, ages, region, cost band, indoor/outdoor) | `data/activities.json` |
| Mascot artwork | `assets/scout.svg` (full Scout), `assets/favicon.svg` (logo mark) |
| Design: header, logo, footer | `templates/layout.html` |
| Design: styles | `assets/site.css` (kit defaults at the top; **HappyDaysOut theme** block at the bottom) |
| Copy-code buttons, region tabs | `assets/site.js` |
| Generated output (don't edit by hand) | `index.html`, `*/index.html`, `sitemap.xml`, `robots.txt`, `404.html`, `search/`, `blog/feed.xml` |

## Pages (91)
Home · adventure-finder · teen-days-out · toddler-days-out · theme-parks · harry-potter-days-out · disney-deals · discount-codes · experience-days · free-days-out · local-days-out · uk-days-out · international-days-out · merlin-annual-pass · zoos-and-aquariums · meet-scout · type pages (escape-rooms, water-parks, adventure-parks, snow-and-ice, beaches-and-seaside, indoor-activities, go-karting-and-skating, surf-and-paddle, museums-and-science, castles-and-history, nature-and-national-parks, farm-days-out, film-and-tv-tours, seasonal-events) · blog (+60 posts).
Top menu = pages with  (Finder, Theme parks, Harry Potter, Disney, Discount codes, Teens, Free days out, Blog). A gradient ticker under the header links the popular pages (edit it in ).

## Adventure finder
 blocks render cards from  as static HTML.  adds filters for age (Under 5s / 5–11 / Teens), where (Near you / UK / USA / Europe / Worldwide), cost band (Free / £ / ££ / £££), type, indoor/outdoor, plus search and “Surprise me”, and keeps them in the URL (). The home hero quick-finder form submits to it. Block options:  (server-side filter, used by every type page),  (curated list, e.g. home “Teen zone” / “Free this weekend” / “Little explorers”), ,  (dark starry section). “Near you” items are kinds of day out (trampoline parks, rock pooling), not one venue. Cost bands are editorial guides, never prices. Every venue URL was checked to load (2026-10-15). Adventure Parc Snowdonia was dropped because its domain didn’t resolve.

## Design: "sunny storybook" (built 2026-10-14) + teen refresh (2026-10-15)
Light cream pages #FFF8EE, navy ink #1F2A44, tangerine #FF7A1A (buttons, matches the shmor.ai card accent), sunshine #FFD23F, grass #1E8E5A (links/CTAs), sky #2BA6E0 (CTA band). Fonts: Fredoka (headings) + Nunito (body). Navy top line with the "Part of the Shmor.ai network" link; logo = fox head in a yellow rounded square + "Happy**DaysOut**". Home hero: sky gradient, sun, bunting and a bobbing Scout. Inner pages: photo hero with navy overlay and a wavy bottom edge. Chunky outlined search, sticker-style chips, cards with soft offset shadows, wavy navy footer. Mobile checked at 375px (no horizontal scroll).
**Teen refresh** (user asked for a more teenager-targeted look while keeping the family feel): violet #6C3BFF + hot pink #FF3D8B added, an orange-pink-violet gradient () on the ticker, buttons and heading squiggles, a sunset-gradient home hero with a quick finder, “night” blocks (dark starry background), bolder headings, and Scout now wears shades on his hat and headphones round his neck. Theme CSS lives in two blocks at the bottom of .

## Scout the Fox (mascot) rules
Scout gives **editorial guidance** only: who a day out suits, how to save, what to watch out for. Never star ratings, invented visitor reviews or fake quotes. `meet-scout` explains this publicly. Scout appears as a `scout` block (tip or verdict) on every page and post, and as "Scout says" lines on attraction cards.

## Offers & discount codes
The `codes` block shows voucher cards. **Only real, checked offers**: every item has `"checked": "YYYY-MM-DD"` and links to the official source. A `"code"` is shown only when the user supplies or we verify a real current code; otherwise the card says what to do instead (e.g. "Show badge + badge ID card"). Offers live in the page JSON (`content/discount-codes.json` has the full list; home, free-days-out, harry-potter and disney pages reuse subsets). Re-check dated facts (Museums on Us dates, Merlin pass tiers, Every Kid Outdoors year, Days Out Guide listings) when refreshing.

## Referral links (none yet)
Programmes worth applying to (user must join; never invent IDs): experience gifts (Virgin Experience Days, Buyagift, Red Letter Days), attraction tickets (Tiqets, GetYourGuide, Klook, Attraction Tickets Direct), theme parks / Merlin, Disneyland Paris, Kids Pass. When links arrive: add to `shmor-site.json` → `"links"`, then use the slug as `"link"` on `attractions`/`codes` items (renders a "See tickets / Get this offer" button via shmor.ai/go/) or in a page's `"partners"`. Rebuild, sync the master, commit both repos.

## Blog (/blog/)
60 posts. Batch 2 (2026-08-16 → 2026-09-14) leans teen and adventure: escape rooms, thrill rides, teen birthdays, London with teens, karting, trampoline parks, zip lines, indoor skydiving, surfing, skate parks, gaming, photo spots, water parks, summer bucket list, geocaching, snow centres, ice skating, beach safety, rock pooling, camping, glamping, stargazing, space, science centres, castles, wildlife, cycling, accessible days out, grandparents and travelling by train. Batch 1 has 30 posts dated 2026-09-15 → 2026-10-14 (seasonal: half-term, Halloween, Christmas; money-saving: 2FOR1 rail, Blue Peter badge, Kids Pass, kids go free, annual passes, fake codes; Harry Potter, Disney/Epic Universe, Merlin changes; US: Every Kid Outdoors, free US days out, national parks; ideas for toddlers/teens/rainy days, picnics, zoos, steam trains, Europe's parks). Each post has a Scout tip, internal links to 2–5 HappyDaysOut pages/posts, related cards, FAQs (FAQPage schema) and official sources; many link to sister sites (traveldeals.shmor.ai family-holidays, Orlando, UK ETA, EES/ETIAS, city breaks, Christmas markets; cruisedeals.shmor.ai family-cruises; petsavings.shmor.ai dog walkers). Writing rules: research with web search, confirm on official sites, "as of" wording for things that change, no invented prices/stats/reviews, free-licence Unsplash photo (images.unsplash.com only, not plus.unsplash.com).

## Commands (run here)
```bash
node tools/build.js           # rebuild after ANY change to content/, templates/ or shmor-site.json
node tools/build.js --check   # validate only
node tools/serve.js 4013      # preview http://localhost:4013  (preview config "happydaysout")
```
After changing `shmor-site.json`, also run `node tools/sync-network.js` in `../../shmor-ai`.

## Ideas / next
Referral links (above) · more local/regional pages (London, Scotland, Wales, Orlando, Paris) · seasonal refresh of offers · weekly blog automation like TravelDeals · after launch: Search Console + sitemap.
