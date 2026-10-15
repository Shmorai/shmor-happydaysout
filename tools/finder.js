/* =====================================================================
   HappyDaysOut: the "finder" block (adventure finder), used via tools/blocks.js.

   Renders every matching day out from data/activities.json as static,
   crawlable cards carrying data-* filter values. assets/site.js adds the
   age / where / cost / type / indoor filters, search, "Surprise me" and
   shareable links (?age=teens&where=uk&cost=free&type=escape&set=indoor).

     { "type": "finder", "title", "intro",
       "preset": { "type": "waterpark" } | { "age": "teens" } | { "region": "uk" }
               | { "cost": "free" } | { "setting": "indoor" }   (server-side filter)
       "ids": ["id", ...]   (curated list, in this order)
       "limit": 12, "filters": false (hide the filter bar), "note": false }

   data/activities.json items: { id, title, type, ages: [under5|kids|teens],
     region: near|uk|us|europe|world, where, cost: free|budget|mid|splurge,
     setting: indoor|outdoor|both, image, text, scout, url, slug, link, tags }
   "near" = a kind of day out you'll find near most homes (no single venue).
   Cost bands are editorial guides to a typical family visit, never prices.
   ===================================================================== */
const fs = require('fs');
const path = require('path');

const DATA = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'data', 'activities.json'), 'utf8'));
const AGES = { under5: 'Under 5s', kids: 'Ages 5–11', teens: 'Teens' };
const WHERE = { near: 'Near you', uk: 'UK', us: 'USA', europe: 'Europe', world: 'Worldwide' };
const COSTS = { free: 'Free', budget: '£ Budget', mid: '££ Mid-range', splurge: '£££ Splurge' };
const SETTINGS = { indoor: 'Indoor', outdoor: 'Outdoor', both: 'Indoor + outdoor' };
const LABELS = { age: 'Age', where: 'Where', cost: 'Cost' };

function matches(it, pre) {
  return Object.entries(pre).every(([f, v]) =>
    f === 'age' ? it.ages.includes(v) : f === 'setting' ? (it.setting === v || it.setting === 'both') : it[f] === v);
}

function card(it, p, k) {
  const t = DATA.types[it.type] || { label: it.type, icon: 'star' };
  const im = it.image;
  const go = [];
  if (it.link) {
    if (!k.LINKS[it.link]) k.errors.push(`data/activities.json: "${it.id}" link "${it.link}" isn't in shmor-site.json "links"`);
    else go.push(`<a class="btn btn-go" href="${k.goHref(it.link, p.slug)}" ${k.AFF}>See tickets →</a>`);
  }
  if (it.slug !== undefined) {
    if (!k.bySlug.has(it.slug)) k.errors.push(`data/activities.json: "${it.id}" links to missing page "${it.slug}"`);
    else if (it.slug !== p.slug) go.push(`<a class="btn" href="${k.pagePath(k.bySlug.get(it.slug))}">${k.esc(it.more || 'Scout’s guide')}</a>`);
  }
  if (it.url) go.push(`<a class="btn" href="${k.esc(it.url)}" rel="nofollow noopener" target="_blank">Official site ↗</a>`);
  const terms = [it.title, it.where, it.text, t.label, ...(it.tags || [])].join(' ').replace(/<[^>]+>/g, '').toLowerCase();
  const ages = it.ages.length === 3 ? '<span class="a-set">All ages</span>' : it.ages.map(a => `<span class="a-${a}">${AGES[a]}</span>`).join('');
  const photo = im ? `<img src="${k.esc(k.imgSrc(im, 600, 375))}" width="600" height="375" alt="${k.esc(im.alt || '')}" loading="lazy" decoding="async">` : '';
  const credit = im && im.credit ? `<p class="fcredit">Photo: <a href="${k.esc(im.creditUrl)}?utm_source=shmor&utm_medium=referral" rel="nofollow noopener" target="_blank">${k.esc(im.credit)}</a> / Unsplash</p>` : '';
  return `<article class="fcard" id="a-${it.id}" data-age="${it.ages.join(' ')}" data-where="${it.region}" data-cost="${it.cost}" data-type="${it.type}" data-set="${it.setting}" data-terms="${k.esc(terms)}">
  <div class="fphoto">${photo}<span class="ftype">${k.icon(t.icon)}${k.esc(t.label)}</span><span class="fcost c-${it.cost}">${COSTS[it.cost]}</span>${credit}</div>
  <div class="fbody"><h3>${k.esc(it.title)}</h3><p class="fwhere">${k.icon('pin')}${k.esc(it.where)}</p><p class="ftext">${it.text}</p>
  <div class="fages">${ages}<span class="a-set">${SETTINGS[it.setting]}</span></div>
  ${it.scout ? `<p class="fscout"><img src="/assets/scout.svg" alt="" width="34" height="34"><span><strong>Scout:</strong> ${it.scout}</span></p>` : ''}
  ${go.length ? `<div class="ffoot">${go.join('')}</div>` : ''}</div></article>`;
}

module.exports = function finder(b, p, k) {
  const pre = b.preset || {};
  let items = b.ids ? b.ids.map(id => DATA.items.find(x => x.id === id)) : DATA.items.filter(it => matches(it, pre));
  if (items.some(x => !x)) { k.errors.push(`${p._file}: a finder id isn't in data/activities.json`); items = items.filter(Boolean); }
  if (b.limit) items = items.slice(0, b.limit);
  const chips = (f, map, skip) => skip ? '' : `<div class="f-row" data-f="${f}"><b>${LABELS[f]}</b><button type="button" class="f-chip" data-v="" aria-pressed="true">Any</button>${Object.entries(map).map(([v, l]) =>
    `<button type="button" class="f-chip" data-v="${v}" aria-pressed="false">${l}</button>`).join('')}</div>`;
  const typeSelect = pre.type ? '' : `<select data-ftype aria-label="Type of day out"><option value="">All types</option>${Object.entries(DATA.types).map(([v, t]) =>
    `<option value="${v}">${k.esc(t.label)}</option>`).join('')}</select>`;
  const bar = b.filters === false ? '' : `<div class="finder-bar" data-finder hidden>
  ${chips('age', AGES, pre.age)}${chips('where', WHERE, pre.region)}${chips('cost', COSTS, pre.cost)}
  <div class="f-tools"><input type="search" data-fq placeholder="Search: coaster, rainy day, Paris…" aria-label="Search adventures">${typeSelect}
  <select data-fset aria-label="Indoor or outdoor"><option value="">Indoor or outdoor</option><option value="indoor">Indoor (rainy day)</option><option value="outdoor">Outdoor</option></select>
  <button type="button" class="f-surprise" data-fsurprise>🎲 Surprise me</button><button type="button" class="f-reset" data-freset>Reset</button></div>
</div><p class="f-count" data-fcount hidden>Showing <b>${items.length}</b> of ${items.length} adventures</p>`;
  const note = b.note === false ? '' : '<p class="finder-note">Cost bands are a rough guide to a typical family visit, not prices. Always check current prices, ages and opening times on the official site.</p>';
  return `<section class="blocks blocks-finder${b.class ? ` ${k.esc(b.class)}` : ''}"${bar ? ' id="finder"' : ''}><div class="wrap">${b.title ? `<div class="block-head"><h2>${k.esc(b.title)}</h2>${b.intro ? `<p>${b.intro}</p>` : ''}</div>` : ''}${bar}
<div class="fgrid" data-fgrid>${items.map(it => card(it, p, k)).join('')}<p class="f-empty" data-fempty hidden>No adventures match those filters. Try fewer filters, or hit 🎲 Surprise me!</p></div>${note}</div></section>`;
};
module.exports.DATA = DATA;
