/* =====================================================================
   HappyDaysOut: site-specific block types for tools/build.js (kit hook).

   "scout": Scout the Fox (mascot) speech bubble with a tip or a verdict.
     { "type": "scout", "mood": "tip" | "verdict", "label": "Scout's tip",
       "title": "...", "text": "<p>html</p>", "points": ["html", ...],
       "facts": [["Best for", "Ages 5+"], ["Value tip", "..."]] }
     Verdicts are editorial guidance (who it suits, how to save, what to
     watch out for). Never star ratings or made-up visitor reviews.

   "attractions": photo cards for days out, with region filter tabs.
     { "type": "attractions", "title", "intro", "tabs": true,
       "items": [{ "title", "kind", "where", "region": "uk|us|europe|world",
         "image": {src, alt, credit, creditUrl}, "text", "tags": [..],
         "saves": ["ways to save", ...], "scout": "Scout's one-line tip",
         "url": "official site", "link": "<referral slug>", "slug": "<guide page>" }] }

   "codes": voucher-style offer cards. Only REAL codes/offers go here.
     { "type": "codes", "title", "intro", "tabs": true,
       "items": [{ "merchant", "title", "text", "region", "icon", "stub",
         "code": "REAL-CODE" (optional; omit when no code is needed),
         "terms", "url": "official offer page", "link": "<referral slug>", "checked": "YYYY-MM-DD" }] }
   ===================================================================== */
const REGIONS = { uk: 'UK', us: 'USA', europe: 'Europe', world: 'Worldwide' };

const fmt = d => new Date(d + 'T12:00:00Z').toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'UTC' });
const head = (b, k) => b.title ? `<div class="block-head"><h2>${k.esc(b.title)}</h2>${b.intro ? `<p>${b.intro}</p>` : ''}</div>` : '';
const host = u => { try { return new URL(u).hostname.replace(/^www\./, ''); } catch (e) { return ''; } };

function tabs(b, items, k) {
  if (!b.tabs) return '';
  const used = Object.keys(REGIONS).filter(r => items.some(it => it.region === r));
  if (used.length < 2) return '';
  return `<div class="region-tabs" data-tabs hidden><button type="button" data-tab="all" aria-pressed="true">Everywhere</button>${used.map(r =>
    `<button type="button" data-tab="${r}" aria-pressed="false">${REGIONS[r]}</button>`).join('')}</div>`;
}

function links(it, p, k, goLabel) {
  const out = [];
  if (it.link) {
    if (!k.LINKS[it.link]) k.errors.push(`${p._file}: item link "${it.link}" isn't in shmor-site.json "links"`);
    else out.push(`<a class="btn btn-go" href="${k.goHref(it.link, p.slug)}" ${k.AFF}>${k.esc(it.cta || goLabel)} →</a>`);
  }
  if (it.slug !== undefined) {
    if (!k.bySlug.has(it.slug)) k.errors.push(`${p._file}: item links to missing page "${it.slug}"`);
    else out.push(`<a class="btn" href="${k.pagePath(k.bySlug.get(it.slug))}">${k.esc(it.more || 'Read our guide')}</a>`);
  }
  if (it.href) out.push(`<a class="btn" href="${k.esc(it.href)}">${k.esc(it.hrefLabel || 'Plan a trip')} →</a>`);
  if (it.url) out.push(`<a class="btn" href="${k.esc(it.url)}" rel="nofollow noopener" target="_blank">${k.esc(it.urlLabel || host(it.url))} ↗</a>`);
  return out.length ? `<div class="attr-foot">${out.join('')}</div>` : '';
}

module.exports = {
  scout(b, p, k) {
    const verdict = b.mood === 'verdict';
    const label = b.label || (verdict ? 'Scout’s verdict' : 'Scout’s tip');
    const facts = (b.facts || []).length ? `<dl class="scout-facts">${b.facts.map(([t, d]) => `<div><dt>${k.esc(t)}</dt><dd>${d}</dd></div>`).join('')}</dl>` : '';
    return `<section class="blocks blocks-scout${b.class ? ` ${k.esc(b.class)}` : ''}"><div class="wrap"><div class="scout${verdict ? ' scout-verdict' : ''}">
  <img class="scout-face" src="/assets/scout.svg" width="120" height="120" alt="Scout the Fox">
  <div class="scout-bubble"><p class="scout-label">${k.esc(label)}</p>${b.title ? `<h3>${k.esc(b.title)}</h3>` : ''}${b.text || ''}${(b.points || []).length ? `<ul>${b.points.map(x => `<li>${x}</li>`).join('')}</ul>` : ''}${facts}</div>
</div></div></section>`;
  },

  attractions(b, p, k) {
    const items = b.items || [];
    const cards = items.map(it => {
      const im = k.imgOf(it.image);
      const photo = im ? `<div class="attr-photo"><img src="${k.esc(k.imgSrc(im, 640, 400))}" width="640" height="400" alt="${k.esc(im.alt || '')}" loading="lazy" decoding="async">${it.region ? `<span class="attr-region">${REGIONS[it.region] || k.esc(it.region)}</span>` : ''}${im.credit ? `<p class="attr-credit">Photo: ${im.creditUrl ? `<a href="${k.esc(im.creditUrl)}?utm_source=shmor&utm_medium=referral" rel="nofollow noopener" target="_blank">${k.esc(im.credit)}</a>` : k.esc(im.credit)} / Unsplash</p>` : ''}</div>` : '';
      return `<article class="attr"${it.region ? ` data-tag="${k.esc(it.region)}"` : ''}>${photo}<div class="attr-body">
  ${it.kind ? `<p class="attr-kind">${k.esc(it.kind)}</p>` : ''}<h3>${k.esc(it.title)}</h3>
  ${it.where ? `<p class="attr-where">${k.icon('pin')}${k.esc(it.where)}</p>` : ''}
  ${it.text ? `<p class="attr-text">${it.text}</p>` : ''}
  ${(it.tags || []).length ? `<div class="attr-tags">${it.tags.map(t => `<span>${k.esc(t)}</span>`).join('')}</div>` : ''}
  ${(it.saves || []).length ? `<ul class="attr-saves">${it.saves.map(s => `<li>${k.icon('wallet')}<span>${s}</span></li>`).join('')}</ul>` : ''}
  ${it.scout ? `<p class="attr-scout"><img src="/assets/scout.svg" alt="" width="40" height="40"><span><strong>Scout says:</strong> ${it.scout}</span></p>` : ''}
  ${links(it, p, k, 'See tickets')}
</div></article>`;
    }).join('');
    return `<section class="blocks blocks-attractions${b.class ? ` ${k.esc(b.class)}` : ''}"><div class="wrap">${head(b, k)}${tabs(b, items, k)}<div class="attr-grid">${cards}</div></div></section>`;
  },

  codes(b, p, k) {
    const items = b.items || [];
    const cards = items.map(it => {
      const code = it.code
        ? `<div class="voucher-code"><code>${k.esc(it.code)}</code><button type="button" class="copy" data-copy="${k.esc(it.code)}">Copy</button></div>`
        : `<div class="voucher-code"><span class="nocode">${k.icon('check')} ${k.esc(it.nocode || 'No code needed')}</span></div>`;
      return `<article class="voucher"${it.region ? ` data-tag="${k.esc(it.region)}"` : ''}>
  <div class="voucher-stub">${k.icon(it.icon || 'tag')}<span>${k.esc(it.stub || REGIONS[it.region] || 'Offer')}</span></div>
  <div class="voucher-body">${it.merchant ? `<p class="voucher-merchant">${k.esc(it.merchant)}</p>` : ''}<h3>${k.esc(it.title)}</h3>
  ${it.text ? `<p>${it.text}</p>` : ''}${code}
  ${it.terms || it.checked ? `<small>${it.terms ? k.esc(it.terms) : ''}${it.terms && it.checked ? ' · ' : ''}${it.checked ? `Checked ${fmt(it.checked)}` : ''}</small>` : ''}
  ${links(it, p, k, 'Get this offer')}</div>
</article>`;
    }).join('');
    return `<section class="blocks blocks-codes${b.class ? ` ${k.esc(b.class)}` : ''}"><div class="wrap">${head(b, k)}${tabs(b, items, k)}<div class="codes-grid">${cards}</div>${items.some(it => it.link) ? `<p class="aff-note">Some offers are affiliate links: we may earn a commission at no extra cost to you. <a href="https://shmor.ai/affiliate-disclosure/">How we make money</a>.</p>` : ''}</div></section>`;
  },
};
