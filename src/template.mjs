/* =========================================================
   鲸柜柜家居 · HTML 模板
   纯字符串模板，无第三方依赖。由 scripts/build.mjs 调用。
   ========================================================= */

const ICONS = {
  arrow: `<svg viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="M2.5 8h10.5M9 3.8 13.2 8 9 12.2" stroke="currentColor" stroke-width="1.15" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
  arrowUp: `<svg viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="M8 13V3M3.8 7.2 8 3l4.2 4.2" stroke="currentColor" stroke-width="1.15" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
  close: `<svg viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="m3.5 3.5 9 9m0-9-9 9" stroke="currentColor" stroke-width="1.2" stroke-linecap="round"/></svg>`,
  check: `<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="m5 12.5 4.2 4.2L19 7" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
};

const HTML_ESCAPE = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#39;",
};

export function escapeHtml(value = "") {
  return String(value).replace(/[&<>"']/g, (char) => HTML_ESCAPE[char]);
}

function attr(value = "") {
  return escapeHtml(value);
}

function url(base, path) {
  const href = new URL(path, base.endsWith("/") ? base : `${base}/`).href;
  return href.replace(/\.html$/, "");
}

function navLinks(site, solid) {
  const prefix = solid ? "/" : "";
  return [
    { href: `${prefix}#about`, label: "关于", en: "ABOUT" },
    { href: `${prefix}#series`, label: "产品", en: "SERIES" },
    { href: `${prefix}#projects`, label: "案例", en: "PROJECTS" },
    { href: `${prefix}#materials`, label: "板材", en: "MATERIALS" },
    { href: "/factory.html", label: "厂区", en: "FACTORY" },
    { href: `${prefix}#craft`, label: "工艺", en: "CRAFT" },
    { href: `${prefix}#contact`, label: "联系", en: "CONTACT" },
  ];
}

function headerBrand(site) {
  return `<a class="brand" href="/" aria-label="${attr(site.brand.fullName)} 首页">
    <img class="brand-logo brand-logo--light" src="/images/logo-header-light.png" alt="${attr(site.brand.name)}" width="480" height="167" decoding="async">
    <img class="brand-logo brand-logo--color" src="/images/logo-header.png" alt="${attr(site.brand.name)}" width="480" height="167" decoding="async">
  </a>`;
}

function footerBrand(site) {
  return `<a class="brand brand--footer" href="/" aria-label="${attr(site.brand.fullName)} 首页">
    <img class="brand-logo brand-logo--footer" src="/images/logo-lockup.png" alt="${attr(site.brand.fullName)}" width="1200" height="286" loading="lazy" decoding="async">
  </a>`;
}

function header(site, solid) {
  const links = navLinks(site, solid);
  const desktop = links
    .map((link) => `<a href="${attr(link.href)}">${escapeHtml(link.label)}</a>`)
    .join("\n        ");
  const mobile = links
    .map(
      (link) =>
        `<a href="${attr(link.href)}"><span>${escapeHtml(link.label)}</span><small>${escapeHtml(link.en)}</small></a>`
    )
    .join("\n          ");
  const contactHref = solid ? "/#contact" : "#contact";

  return `<header class="site-header${solid ? " is-solid" : ""}" data-solid="${solid ? "true" : "false"}">
  <div class="header-inner">
    ${headerBrand(site)}
    <nav class="desktop-nav" aria-label="主导航">
        ${desktop}
    </nav>
    <a class="header-cta" href="${attr(contactHref)}" data-booking-open>预约咨询</a>
    <button class="menu-toggle" type="button" aria-label="打开菜单" aria-controls="mobile-menu" aria-expanded="false">
      <span></span><span></span>
    </button>
  </div>
</header>

<div class="mobile-menu" id="mobile-menu" aria-hidden="true">
  <nav class="mobile-menu__nav" aria-label="移动端导航">
          ${mobile}
  </nav>
  <div class="mobile-menu__foot">
    <span>${escapeHtml(site.contact.serviceArea)} · 全屋定制</span>
    <a href="${attr(contactHref)}" data-booking-open>预约一次设计沟通 →</a>
  </div>
</div>`;
}

function footer(site, solid) {
  const links = navLinks(site, solid);
  const linkHtml = links
    .map((link) => `<li><a href="${attr(link.href)}">${escapeHtml(link.label)}</a></li>`)
    .join("\n            ");
  const icp = site.footer.icp
    ? `<a href="https://beian.miit.gov.cn/" target="_blank" rel="noopener noreferrer">${escapeHtml(site.footer.icp)}</a>`
    : "";

  return `<footer class="site-footer">
  <div class="container">
    <div class="footer-grid">
      <div class="footer-brand">
        ${footerBrand(site)}
        <p>${escapeHtml(site.footer.statement)}</p>
      </div>
      <div class="footer-col">
        <h4>Browse / 浏览</h4>
        <ul>
            ${linkHtml}
        </ul>
      </div>
      <div class="footer-col">
        <h4>Visit / 联系</h4>
        <ul>
          <li>服务范围：${escapeHtml(site.contact.serviceArea)}</li>
          <li>预约方式：官网预约表单</li>
          <li><a href="${solid ? "/" : ""}#contact" data-booking-open>开始一次设计咨询 →</a></li>
        </ul>
      </div>
    </div>
    <div class="footer-bottom">
      <span>${escapeHtml(site.footer.copyright)}</span>
      <div class="footer-bottom__links">
        <a href="/privacy">隐私说明</a>
        ${icp}
        <a class="back-top" href="${solid ? "/" : ""}#top">回到顶部 ${ICONS.arrowUp}</a>
      </div>
    </div>
    <div class="footer-watermark" aria-hidden="true">${escapeHtml(site.brand.name)}</div>
  </div>
</footer>`;
}

function head({ site, title, description, canonicalPath, image, imageWidth, imageHeight, imageAlt, preloadImage, noindex, jsonLd }) {
  const canonical = url(site.seo.siteUrl, canonicalPath);
  const ogImage = url(site.seo.siteUrl, image || site.seo.ogImage);
  const fullTitle = title || site.seo.title;
  const desc = description || site.seo.description;
  const width = imageWidth || 1200;
  const height = imageHeight || 630;

  return `<meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${escapeHtml(fullTitle)}</title>
  <meta name="description" content="${attr(desc)}">
  ${canonicalPath === "/" ? `<meta name="keywords" content="${attr(site.seo.keywords)}">` : ""}
  <meta name="robots" content="${noindex ? "noindex,nofollow" : "index,follow"}">
  <meta name="theme-color" content="#1d302e">
  <meta name="format-detection" content="telephone=no">
  <link rel="canonical" href="${attr(canonical)}">
  <link rel="icon" href="/favicon-32.png" sizes="32x32" type="image/png">
<link rel="icon" href="/favicon-192.png" sizes="192x192" type="image/png">
<link rel="apple-touch-icon" href="/apple-touch-icon.png">
  <link rel="stylesheet" href="/styles.css">
  ${preloadImage ? `<link rel="preload" as="image" href="${attr(preloadImage)}" fetchpriority="high">` : ""}
  <meta property="og:type" content="website">
  <meta property="og:locale" content="zh_CN">
  <meta property="og:site_name" content="${attr(site.brand.fullName)}">
  <meta property="og:title" content="${attr(fullTitle)}">
  <meta property="og:description" content="${attr(desc)}">
  <meta property="og:url" content="${attr(canonical)}">
  <meta property="og:image" content="${attr(ogImage)}">
  <meta property="og:image:width" content="${width}">
  <meta property="og:image:height" content="${height}">
  <meta property="og:image:alt" content="${attr(imageAlt || site.hero.alt)}">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${attr(fullTitle)}">
  <meta name="twitter:description" content="${attr(desc)}">
  <meta name="twitter:image" content="${attr(ogImage)}">
  <script>document.documentElement.classList.add('js');</script>
  ${jsonLd ? `<script type="application/ld+json">${jsonLd.replace(/</g, "\\u003c")}</script>` : ""}`;
}

function organizationJsonLd(site) {
  return JSON.stringify({
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${site.seo.siteUrl.replace(/\/$/, "")}/#organization`,
    name: site.brand.fullName,
    alternateName: site.brand.name,
    url: site.seo.siteUrl,
    logo: url(site.seo.siteUrl, "/apple-touch-icon.png"),
    image: url(site.seo.siteUrl, site.seo.ogImage),
    description: site.seo.description,
    areaServed: { "@type": "City", name: "成都" },
    address: {
      "@type": "PostalAddress",
      addressLocality: "成都",
      addressRegion: "四川",
      addressCountry: "CN",
    },
    knowsAbout: ["全屋定制", "衣柜定制", "橱柜定制", "客厅柜体", "空间设计"],
  });
}

function websiteJsonLd(site) {
  return JSON.stringify({
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: site.brand.fullName,
    url: site.seo.siteUrl,
    inLanguage: "zh-CN",
  });
}

function hero(site) {
  return `<section class="hero" id="top">
  <div class="hero-media">
    <img src="${attr(site.hero.image)}" alt="${attr(site.hero.alt)}" fetchpriority="high" decoding="async">
  </div>
  <div class="hero-overlay"></div>
  <div class="hero-content">
    <p class="eyebrow eyebrow--light">${escapeHtml(site.hero.eyebrow)}</p>
    <h1 class="hero-title">${escapeHtml(site.hero.title)}</h1>
    <p class="hero-sub">${escapeHtml(site.hero.subtitle)}</p>
    <div class="hero-actions">
      <a class="btn btn--light" href="#contact" data-booking-open>${escapeHtml(site.hero.primaryCta)} ${ICONS.arrow}</a>
      <a class="btn btn--ghost" href="#projects">${escapeHtml(site.hero.secondaryCta)}</a>
    </div>
  </div>
  <div class="hero-foot">
    <span>${escapeHtml(site.hero.note)}</span>
    <span class="hero-scroll">SCROLL</span>
  </div>
</section>`;
}

function intro(site) {
  const facts = site.intro.facts
    .map(
      (fact) => `<div class="fact">
        <span class="fact-value">${escapeHtml(fact.value)}</span>
        <span class="fact-label">${escapeHtml(fact.label)}</span>
      </div>`
    )
    .join("\n      ");

  return `<section class="section intro" id="intro">
  <div class="container">
    <div class="intro-grid">
      <div class="reveal">
        <p class="eyebrow">${escapeHtml(site.intro.eyebrow)}</p>
        <h2 class="intro-title">${escapeHtml(site.intro.title)}</h2>
      </div>
      <div class="intro-copy reveal" style="--delay:.08s">
        <p>${escapeHtml(site.intro.text)}</p>
        <span class="intro-copy__sign">${escapeHtml(site.brand.tagline)}</span>
      </div>
    </div>
    <div class="intro-facts reveal">
      ${facts}
    </div>
  </div>
</section>`;
}

function about(site) {
  const badges = site.about.badges
    .map((badge) => `<span>${escapeHtml(badge)}</span>`)
    .join("\n        ");
  const paragraphs = site.about.paragraphs
    .map((paragraph) => `<p>${escapeHtml(paragraph)}</p>`)
    .join("\n      ");

  return `<section class="section about" id="about">
  <div class="container">
    <div class="about-grid">
      <div class="about-visual reveal">
        <div class="about-visual__main">
          <img src="${attr(site.about.image)}" alt="${attr(site.about.alt)}" loading="lazy" decoding="async">
        </div>
        <div class="about-visual__detail">
          <img src="${attr(site.about.detailImage)}" alt="${attr(site.about.detailAlt)}" loading="lazy" decoding="async">
        </div>
        <p class="about-visual__caption">${escapeHtml(site.about.caption)}</p>
      </div>
      <div class="about-copy reveal" style="--delay:.08s">
        <p class="eyebrow">${escapeHtml(site.about.eyebrow)}</p>
        <h2 class="section-title">${escapeHtml(site.about.title)}</h2>
        ${paragraphs}
        <p class="about-signature">${escapeHtml(site.about.signature)}</p>
        <div class="about-badges">
        ${badges}
        </div>
      </div>
    </div>
  </div>
</section>`;
}

const SERIES_FILTER_FALLBACK = {
  衣柜系统: "衣柜",
  厨房橱柜: "厨房",
  客厅系统: "客厅",
  书房与多功能房: "多功能",
};

function series(site) {
  const cards = site.series.items
    .map((item, index) => {
      const filter = item.filter || SERIES_FILTER_FALLBACK[item.name] || "";
      const tags = (item.features || [])
        .map((feature) => `<span>${escapeHtml(feature)}</span>`)
        .join("");
      return `<a class="series-card reveal" href="/products/${attr(item.slug)}.html" style="--delay:${(index % 2) * 0.08}s">
        <div class="series-card__media">
          <img src="${attr(item.image)}" alt="${attr(item.alt)}" loading="lazy" decoding="async">
        </div>
        <div class="series-card__overlay"></div>
        <div class="series-card__top">
          <span class="num">${escapeHtml(item.number)}</span>
          <span>${escapeHtml(item.english)}</span>
        </div>
        <div class="series-card__body">
          <h3>${escapeHtml(item.name)}</h3>
          <p>${escapeHtml(item.description)}</p>
          <div class="series-tags">${tags}</div>
        </div>
        <span class="series-card__arrow">${ICONS.arrow}</span>
      </a>`;
    })
    .join("\n      ");

  return `<section class="section series" id="series">
  <div class="container">
    <div class="section-head">
      <div class="reveal">
        <p class="eyebrow">${escapeHtml(site.series.eyebrow)}</p>
        <h2 class="section-title">${escapeHtml(site.series.title)}</h2>
      </div>
      <div class="section-head__aside reveal" style="--delay:.08s">
        <p class="section-lead">${escapeHtml(site.series.description)}</p>
      </div>
    </div>
    <div class="series-grid">
      ${cards}
    </div>
  </div>
</section>`;
}

function philosophy(site) {
  return `<section class="philosophy" id="philosophy">
  <div class="philosophy__media">
    <img src="${attr(site.philosophy.image)}" alt="${attr(site.philosophy.alt)}" loading="lazy" decoding="async">
  </div>
  <div class="philosophy__overlay"></div>
  <div class="philosophy__inner reveal">
    <span class="philosophy__mark" aria-hidden="true">“</span>
    <blockquote>${escapeHtml(site.philosophy.quote)}</blockquote>
    <cite>${escapeHtml(site.philosophy.caption)}</cite>
  </div>
</section>`;
}

function process(site) {
  const steps = site.process.steps
    .map(
      (step, index) => `<article class="process-step reveal" style="--delay:${(index % 3) * 0.06}s">
        <span class="process-step__num">STEP ${escapeHtml(step.number)}</span>
        <h3>${escapeHtml(step.title)}</h3>
        <p>${escapeHtml(step.text)}</p>
      </article>`
    )
    .join("\n      ");

  return `<section class="section process" id="process">
  <div class="container">
    <div class="section-head">
      <div class="reveal">
        <p class="eyebrow eyebrow--light">${escapeHtml(site.process.eyebrow)}</p>
        <h2 class="section-title section-title--dark">${escapeHtml(site.process.title)}</h2>
      </div>
      <div class="section-head__aside reveal" style="--delay:.08s">
        <p class="section-lead section-lead--light">${escapeHtml(site.process.description)}</p>
      </div>
    </div>
    <div class="process-grid">
      ${steps}
    </div>
  </div>
</section>`;
}

function projectCard(project, index, wide) {
  return `<a class="project-card reveal${wide ? " is-wide" : ""}" href="/cases/${attr(project.slug)}.html" data-category="${attr(project.category)}" aria-label="查看案例：${attr(project.title)}" style="--delay:${(index % 3) * 0.05}s">
    <span class="project-card__media">
      <img src="${attr(project.cover)}" alt="${attr(project.alt)}" loading="lazy" decoding="async">
    </span>
    <span class="project-card__overlay"></span>
    <span class="project-card__category">${escapeHtml(project.category)}</span>
    <span class="project-card__body">
      <span>
        <h3>${escapeHtml(project.title)}</h3>
        <p>${escapeHtml(project.description)}</p>
      </span>
      <span class="project-card__arrow">${ICONS.arrow}</span>
    </span>
  </a>`;
}

function projects(site, projectsList) {
  const total = projectsList.length;
  const cards = projectsList
    .map((project, index) => {
      const wide = total === 1 || (total >= 3 && index === 0) || (total >= 4 && index === total - 1 && (total - 1) % 2 === 1);
      return projectCard(project, index, wide);
    })
    .join("\n      ");

  const filters = site.projectsSection.filters
    .map(
      (filter, index) =>
        `<button class="project-filter${index === 0 ? " is-active" : ""}" type="button" data-filter="${attr(filter)}" aria-pressed="${index === 0 ? "true" : "false"}">${escapeHtml(filter)}</button>`
    )
    .join("\n        ");

  return `<section class="section projects" id="projects">
  <div class="container">
    <div class="projects-head">
      <div class="reveal">
        <p class="eyebrow">${escapeHtml(site.projectsSection.eyebrow)}</p>
        <h2 class="section-title">${escapeHtml(site.projectsSection.title)}</h2>
      </div>
      <p class="projects-note reveal" style="--delay:.08s">${escapeHtml(site.projectsSection.description)}</p>
    </div>
    <div class="project-filters" role="group" aria-label="按空间筛选案例">
        ${filters}
    </div>
    <div class="projects-grid" id="projects-grid">
      ${cards}
    </div>
    <p class="projects-empty">这个分类下暂时还没有案例，欢迎直接与我们聊聊你的空间。</p>
    <p class="projects-footnote">${escapeHtml(site.projectsSection.note)}</p>
  </div>
</section>`;
}

function craft(site) {
  const items = site.craft.items
    .map(
      (item, index) => `<div class="craft-item${index === 0 ? " is-open" : ""}">
        <button class="craft-item__trigger" type="button" aria-expanded="${index === 0 ? "true" : "false"}" aria-controls="craft-panel-${index}">
          <span class="craft-item__num">${escapeHtml(item.number)}</span>
          <span class="craft-item__title">${escapeHtml(item.title)}</span>
          <span class="craft-item__icon" aria-hidden="true"></span>
        </button>
        <div class="craft-item__panel" id="craft-panel-${index}" aria-hidden="${index === 0 ? "false" : "true"}">
          <div class="craft-item__panel-inner">
            <p>${escapeHtml(item.text)}</p>
          </div>
        </div>
      </div>`
    )
    .join("\n      ");

  return `<section class="section craft" id="craft">
  <div class="container">
    <div class="craft-grid">
      <div class="craft-visual reveal">
        <div class="craft-visual__image">
          <img src="${attr(site.craft.image)}" alt="${attr(site.craft.alt)}" loading="lazy" decoding="async">
        </div>
        <p class="craft-visual__caption">DETAILS / 材质与收口</p>
      </div>
      <div class="craft-copy reveal" style="--delay:.08s">
        <p class="eyebrow">${escapeHtml(site.craft.eyebrow)}</p>
        <h2 class="section-title">${escapeHtml(site.craft.title)}</h2>
        <p>${escapeHtml(site.craft.description)}</p>
        <div class="craft-list">
      ${items}
        </div>
      </div>
    </div>
  </div>
</section>`;
}

function bookingForm(site, prefix) {
  const formEmail = (site.contact.formEmail || "").trim();
  const action = formEmail ? `https://formsubmit.co/${encodeURIComponent(formEmail)}` : "";
  const footnote = escapeHtml(site.contact.formNote);
  const uid = (name) => `${prefix}-${name}`;

  return `<form id="${uid("form")}" class="booking-form" data-booking-form method="POST" action="${attr(action)}" data-form-email="${attr(formEmail)}" novalidate>
          <input type="hidden" name="_subject" value="官网预约咨询 · 鲸柜柜">
          <input type="hidden" name="_template" value="table">
          <input type="hidden" name="_captcha" value="false">
          <input type="hidden" name="_next" value="${attr(url(site.seo.siteUrl, "/thanks"))}">
          <input type="text" name="_honey" class="hp-field" tabindex="-1" autocomplete="off" aria-hidden="true">
          <div class="form-grid">
            <div class="form-field">
              <label for="${uid("name")}">称呼 <span aria-hidden="true">*</span></label>
              <input id="${uid("name")}" name="name" type="text" autocomplete="name" placeholder="怎么称呼你" required>
            </div>
            <div class="form-field">
              <label for="${uid("phone")}">联系电话 <span aria-hidden="true">*</span></label>
              <input id="${uid("phone")}" name="phone" type="tel" autocomplete="tel" inputmode="tel" placeholder="手机或座机" required>
            </div>
            <div class="form-field">
              <label for="${uid("email")}">邮箱（选填）</label>
              <input id="${uid("email")}" name="email" type="email" autocomplete="email" placeholder="方便接收方案资料">
            </div>
            <div class="form-field">
              <label for="${uid("category")}">想了解的空间</label>
              <select id="${uid("category")}" name="category">
                <option value="全屋定制">全屋定制</option>
                <option value="衣柜">衣柜</option>
                <option value="厨房">厨房橱柜</option>
                <option value="客厅">客厅柜体</option>
                <option value="多功能房">书房 / 多功能房</option>
                <option value="其他">其他</option>
              </select>
            </div>
            <div class="form-field">
              <label for="${uid("budget")}">预算范围（选填）</label>
              <select id="${uid("budget")}" name="budget">
                <option value="暂不确定">暂不确定</option>
                <option value="10 万以内">10 万以内</option>
                <option value="10–20 万">10–20 万</option>
                <option value="20–30 万">20–30 万</option>
                <option value="30 万以上">30 万以上</option>
              </select>
            </div>
            <div class="form-field">
              <label for="${uid("city")}">所在区域（选填）</label>
              <input id="${uid("city")}" name="city" type="text" placeholder="如：成都 · 武侯区">
            </div>
            <div class="form-field form-field--full">
              <label for="${uid("message")}">简单说说你的需求（选填）</label>
              <textarea id="${uid("message")}" name="message" rows="3" placeholder="户型、面积、喜欢的风格，或任何你在意的细节"></textarea>
            </div>
          </div>
          <label class="form-consent">
            <input id="${uid("consent")}" name="consent" type="checkbox" value="同意" required>
            <span>我已阅读并同意<a href="/privacy" target="_blank" rel="noopener">隐私说明</a>，同意将以上信息用于本次设计咨询。</span>
          </label>
          <p class="form-note">${footnote}</p>
          <button class="booking-submit" type="submit">${escapeHtml(site.contact.submitText)}</button>
          <p class="form-status" data-form-status role="status" aria-live="polite"></p>
        </form>`;
}

function bookingSuccess(site) {
  return `<div class="form-success" data-form-success role="status" aria-live="polite">
          <span class="form-success__mark">${ICONS.check}</span>
          <h4>${escapeHtml(site.contact.successTitle)}</h4>
          <p>${escapeHtml(site.contact.successText)}</p>
        </div>`;
}

function contact(site) {
  return `<section class="section contact" id="contact">
  <div class="container">
    <div class="contact-grid">
      <div class="contact-copy reveal">
        <p class="eyebrow eyebrow--light">${escapeHtml(site.contact.eyebrow)}</p>
        <h2 class="section-title">${escapeHtml(site.contact.title)}</h2>
        <p>${escapeHtml(site.contact.description)}</p>
        <dl class="contact-meta">
          <div class="contact-meta__row">
            <dt>服务范围</dt>
            <dd>${escapeHtml(site.contact.serviceArea)}</dd>
          </div>
          <div class="contact-meta__row">
            <dt>预约方式</dt>
            <dd>填写右侧表单，我们会主动与你联系</dd>
          </div>
          <div class="contact-meta__row">
            <dt>沟通地址</dt>
            <dd>${escapeHtml(site.contact.address)}</dd>
          </div>
          <div class="contact-meta__row">
            <dt>响应时间</dt>
            <dd>${escapeHtml(site.contact.response)}</dd>
          </div>
        </dl>
      </div>
      <div class="booking-card reveal" style="--delay:.1s">
        <div class="booking-card__head">
          <h3>预约设计咨询</h3>
          <span>01 / 03</span>
        </div>
        <div class="booking-form-wrap" data-booking-wrap>
          ${bookingForm(site, "contact")}
          ${bookingSuccess(site)}
        </div>
      </div>
    </div>
  </div>
</section>`;
}

function bookingModal(site) {
  return `<div class="booking-modal" id="booking-modal" role="dialog" aria-modal="true" aria-labelledby="booking-modal-title" aria-hidden="true">
  <div class="booking-modal__inner">
    <button class="booking-modal__close" type="button" aria-label="关闭预约表单">${ICONS.close}</button>
    <div class="booking-modal__head">
      <p class="eyebrow">预约设计咨询</p>
      <h2 id="booking-modal-title">先聊聊你的家。</h2>
      <p>留下联系方式与大致需求，我们会尽快与你确认沟通时间。</p>
    </div>
    <div class="booking-form-wrap" data-booking-wrap>
      ${bookingForm(site, "modal")}
      ${bookingSuccess(site)}
    </div>
  </div>
</div>`;
}

function factorySection(factory) {
  const stats = factory.stats
    .map((stat) => `<div class="factory-stat"><strong>${escapeHtml(stat.value)}</strong><span>${escapeHtml(stat.label)}</span></div>`)
    .join("\n        ");
  const responsibilities = factory.responsibilities
    .map((item) => `<li><span>${escapeHtml(item.label)}</span><p>${escapeHtml(item.text)}</p></li>`)
    .join("\n        ");

  return `<section class="section factory" id="factory">
  <div class="container">
    <div class="factory-grid">
      <div class="factory-copy reveal">
        <p class="eyebrow">${escapeHtml(factory.eyebrow)}</p>
        <h2 class="section-title">${escapeHtml(factory.title)}</h2>
        <p class="section-lead">${escapeHtml(factory.lead)}</p>
        <p class="factory-copy__text">${escapeHtml(factory.paragraphs[0])}</p>
        <a class="btn btn--dark" href="/factory.html">走进厂区 ${ICONS.arrow}</a>
      </div>
      <div class="factory-card reveal" style="--delay:.08s">
        <div class="factory-card__top">
          <span>FACTORY / 生产</span>
          <span class="factory-card__dot" aria-hidden="true"></span>
        </div>
        <p class="factory-card__place">${escapeHtml(factory.location)}</p>
        <p class="factory-card__name">${escapeHtml(factory.name)}</p>
        <div class="factory-stats">
        ${stats}
        </div>
        <ul class="factory-resp">
        ${responsibilities}
        </ul>
        <p class="factory-card__note">${escapeHtml(factory.note)}</p>
      </div>
    </div>
  </div>
</section>`;
}

function materialsSection(materials) {
  const cards = materials.items
    .map(
      (item, index) => `<a class="material-card reveal" href="/materials/${attr(item.slug)}.html" data-material-index="${index}" style="--delay:${(index % 2) * 0.06}s">
        <span class="material-card__swatch material-swatch--${attr(item.swatch)}">
          <span class="material-card__num">${escapeHtml(item.number)}</span>
          <span class="material-card__en">${escapeHtml(item.english)}</span>
        </span>
        <span class="material-card__body">
          <span class="material-card__price">${escapeHtml(item.priceLevel)}</span>
          <span class="material-card__title">${escapeHtml(item.name)}</span>
          <span class="material-card__summary">${escapeHtml(item.summary)}</span>
          <span class="material-card__brands">${escapeHtml(item.brands.join(" · "))}</span>
          <span class="material-card__arrow">${ICONS.arrow}</span>
        </span>
      </a>`
    )
    .join("\n      ");

  return `<section class="section materials" id="materials">
  <div class="container">
    <div class="section-head">
      <div class="reveal">
        <p class="eyebrow">${escapeHtml(materials.eyebrow)}</p>
        <h2 class="section-title">${escapeHtml(materials.title)}</h2>
      </div>
      <div class="section-head__aside reveal" style="--delay:.08s">
        <p class="section-lead">${escapeHtml(materials.description)}</p>
      </div>
    </div>
    <div class="materials-grid">
      ${cards}
    </div>
    <p class="projects-footnote">${escapeHtml(materials.note)}</p>
  </div>
</section>`;
}

function materialModal() {
  return `<div class="material-modal" id="material-modal" role="dialog" aria-modal="true" aria-labelledby="material-modal-title" aria-hidden="true">
  <div class="material-modal__inner">
    <button class="material-modal__close" type="button" aria-label="关闭板材详情">${ICONS.close}</button>
    <div class="material-modal__visual">
      <div class="material-modal__swatch" id="material-modal-swatch">
        <span class="material-modal__num" id="material-modal-num"></span>
        <span class="material-modal__en" id="material-modal-en"></span>
      </div>
      <img id="material-modal-image" src="data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=" alt="" decoding="async">
    </div>
    <div class="material-modal__content">
      <span class="material-modal__price" id="material-modal-price"></span>
      <h3 id="material-modal-title"></h3>
      <p class="material-modal__summary" id="material-modal-summary"></p>
      <div class="material-brands" id="material-modal-brands"></div>
      <dl class="material-facts">
        <div><dt>芯材</dt><dd id="material-modal-core"></dd></div>
        <div><dt>适合空间</dt><dd id="material-modal-spaces"></dd></div>
        <div><dt>饰面</dt><dd id="material-modal-finish"></dd></div>
      </dl>
      <div class="material-lists">
        <div><h4>优点</h4><ul id="material-modal-advantages"></ul></div>
        <div><h4>要注意</h4><ul id="material-modal-cautions"></ul></div>
      </div>
      <a class="btn btn--dark" id="material-modal-link" href="/#contact">按这个板材聊方案 ${ICONS.arrow}</a>
    </div>
  </div>
</div>`;
}

function breadcrumb(items) {
  const parts = items.map((item, index) => {
    if (index === items.length - 1) {
      return `<span aria-current="page">${escapeHtml(item.name)}</span>`;
    }
    return `<a href="${attr(item.path)}">${escapeHtml(item.name)}</a>`;
  });
  return `<nav class="breadcrumb" aria-label="面包屑">${parts.join('<span class="breadcrumb__sep" aria-hidden="true">/</span>')}</nav>`;
}

function pageJsonLd(site, items, extra) {
  const graph = [
    JSON.parse(organizationJsonLd(site)),
    {
      "@type": "BreadcrumbList",
      itemListElement: items.map((item, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: item.name,
        item: url(site.seo.siteUrl, item.path),
      })),
    },
  ];
  if (extra) graph.push(extra);
  return JSON.stringify({ "@context": "https://schema.org", "@graph": graph });
}

function pageShell({ site, title, description, canonicalPath, image, imageWidth, imageHeight, imageAlt, jsonLd, body }) {
  return `<!doctype html>
<html lang="zh-CN">
<head>
  ${head({ site, title, description, canonicalPath, image, imageWidth, imageHeight, imageAlt, jsonLd })}
</head>
<body class="detail-page">
  <a class="skip-link" href="#main">跳到主要内容</a>
  ${header(site, true)}
  <main class="page-main detail-main" id="main">
    ${body}
  </main>
  ${footer(site, true)}
  ${bookingModal(site)}
  <script src="/main.js" defer></script>
</body>
</html>`;
}

function relatedCard(project) {
  return `<a class="related-card reveal" href="/cases/${attr(project.slug)}.html">
    <span class="related-card__media"><img src="${attr(project.cover)}" alt="${attr(project.alt)}" loading="lazy" decoding="async"></span>
    <span class="related-card__body">
      <span class="related-card__category">${escapeHtml(project.category)}</span>
      <h3>${escapeHtml(project.title)}</h3>
      <span class="related-card__more">查看案例 ${ICONS.arrow}</span>
    </span>
  </a>`;
}

function materialMiniCard(item) {
  return `<a class="material-mini" href="/materials/${attr(item.slug)}.html">
    <span class="material-mini__swatch material-swatch--${attr(item.swatch)}"></span>
    <span class="material-mini__body">
      <strong>${escapeHtml(item.name)}</strong>
      <small>${escapeHtml(item.brands.join(" · "))}</small>
    </span>
  </a>`;
}

function detailCta(site, text) {
  return `<div class="detail-cta reveal">
    <div>
      <p class="eyebrow eyebrow--light">NEXT / 下一步</p>
      <h2>${escapeHtml(text)}</h2>
    </div>
    <a class="btn btn--light" href="/#contact" data-booking-open>预约一次设计沟通 ${ICONS.arrow}</a>
  </div>`;
}

export function renderProduct({ site, product, projects, materials }) {
  const crumbs = [
    { name: "首页", path: "/" },
    { name: "产品系列", path: "/#series" },
    { name: product.name, path: `/products/${product.slug}.html` },
  ];
  const detailCards = (product.details || [])
    .map((item, index) => `<article class="detail-point reveal" style="--delay:${index * 0.06}s">
      <span class="detail-point__num">${String(index + 1).padStart(2, "0")}</span>
      <h3>${escapeHtml(item.title)}</h3>
      <p>${escapeHtml(item.text)}</p>
    </article>`)
    .join("\n      ");
  const suitable = (product.suitable || []).map((item) => `<li>${escapeHtml(item)}</li>`).join("");
  const materialCards = (product.materialSlugs || [])
    .map((slug) => materials.items.find((item) => item.slug === slug))
    .filter(Boolean)
    .map(materialMiniCard)
    .join("\n      ");
  const related = projects
    .filter((project) => project.category === product.filter)
    .concat(projects.filter((project) => project.category !== product.filter))
    .slice(0, 3)
    .map(relatedCard)
    .join("\n      ");

  const body = `<div class="container">
    ${breadcrumb(crumbs)}
    <header class="detail-hero">
      <div class="detail-hero__copy reveal">
        <p class="eyebrow">产品系列 / ${escapeHtml(product.english)}</p>
        <h1 class="detail-title">${escapeHtml(product.name)}</h1>
        <p class="detail-lead">${escapeHtml(product.lead)}</p>
        <div class="detail-tags">${(product.features || []).map((feature) => `<span>${escapeHtml(feature)}</span>`).join("")}</div>
        <a class="btn btn--dark" href="/#contact">按这个系列聊方案 ${ICONS.arrow}</a>
      </div>
      <figure class="detail-hero__media reveal" style="--delay:.08s">
        <img src="${attr(product.image)}" alt="${attr(product.alt)}" fetchpriority="high" decoding="async">
        <figcaption>${escapeHtml(product.english)} / 设计意向</figcaption>
      </figure>
    </header>

    <section class="detail-section">
      <div class="detail-section__head reveal">
        <p class="eyebrow">DESIGN / 设计</p>
        <h2 class="detail-subtitle">先理解生活，再排柜体。</h2>
      </div>
      <div class="detail-prose reveal">
        ${(product.paragraphs || []).map((p) => `<p>${escapeHtml(p)}</p>`).join("")}
      </div>
      <div class="detail-points">
        ${detailCards}
      </div>
    </section>

    <section class="detail-section detail-section--tint">
      <div class="detail-columns">
        <div class="reveal">
          <h2 class="detail-subtitle">适合空间</h2>
          <ul class="chip-list">${suitable}</ul>
        </div>
        <div class="reveal" style="--delay:.08s">
          <h2 class="detail-subtitle">常用板材</h2>
          <div class="material-mini-grid">${materialCards}</div>
          <p class="detail-note">板材按项目预算、使用空间与饰面方案配置，可在沟通时一起定。</p>
        </div>
      </div>
    </section>

    <section class="detail-section">
      <div class="detail-section__head reveal">
        <p class="eyebrow">RELATED / 案例</p>
        <h2 class="detail-subtitle">把这种系统放进真实的家。</h2>
      </div>
      <div class="related-grid">${related}</div>
    </section>

    ${detailCta(site, "想把这个系列，放进你的家？")}
  </div>`;

  return pageShell({
    site,
    title: `${product.name}｜${site.brand.name}`,
    description: `${product.description} ${product.lead}`,
    canonicalPath: `/products/${product.slug}.html`,
    image: product.image,
    imageWidth: 1600,
    imageHeight: 1200,
    imageAlt: product.alt,
    jsonLd: pageJsonLd(site, crumbs, {
      "@type": "Product",
      name: product.name,
      description: product.description,
      image: url(site.seo.siteUrl, product.image),
      category: "全屋定制",
      brand: { "@type": "Brand", name: site.brand.name },
    }),
    body,
  });
}

export function renderCase({ site, project, nearby }) {
  const crumbs = [
    { name: "首页", path: "/" },
    { name: "空间案例", path: "/#projects" },
    { name: project.title, path: `/cases/${project.slug}.html` },
  ];
  const highlights = (project.highlights || [])
    .map((item, index) => `<li><span>${String(index + 1).padStart(2, "0")}</span>${escapeHtml(item)}</li>`)
    .join("");
  const materials = (project.materials || []).map((item) => `<li>${escapeHtml(item)}</li>`).join("");
  const nearbyCards = nearby.map(relatedCard).join("\n      ");

  const body = `<div class="container">
    ${breadcrumb(crumbs)}
    <header class="case-hero">
      <div class="case-hero__media reveal">
        <img src="${attr(project.cover)}" alt="${attr(project.alt)}" fetchpriority="high" decoding="async">
      </div>
      <div class="case-hero__copy reveal" style="--delay:.08s">
        <p class="eyebrow">空间案例 / ${escapeHtml(project.category)}</p>
        <h1 class="detail-title">${escapeHtml(project.title)}</h1>
        <p class="detail-lead">${escapeHtml(project.description)}</p>
        <dl class="case-meta">
          <div><dt>项目分类</dt><dd>${escapeHtml(project.category)}</dd></div>
          <div><dt>项目地址</dt><dd>${escapeHtml(project.location)} · ${escapeHtml(project.address)}</dd></div>
          <div><dt>风格</dt><dd>${escapeHtml(project.style)}</dd></div>
          <div><dt>设计范围</dt><dd>${escapeHtml(project.scope)}</dd></div>
        </dl>
        <p class="case-privacy">${escapeHtml(project.locationNote)}</p>
      </div>
    </header>

    <section class="detail-section case-story">
      <div class="detail-section__head reveal">
        <p class="eyebrow">STORY / 这个家</p>
        <h2 class="detail-subtitle">从需求，到落地。</h2>
      </div>
      <div class="detail-prose reveal">
        ${(project.story || []).map((p) => `<p>${escapeHtml(p)}</p>`).join("")}
      </div>
    </section>

    <section class="detail-section detail-section--tint">
      <div class="detail-columns">
        <div class="reveal">
          <h2 class="detail-subtitle">设计重点</h2>
          <ul class="highlight-list">${highlights}</ul>
        </div>
        <div class="reveal" style="--delay:.08s">
          <h2 class="detail-subtitle">使用材料</h2>
          <ul class="chip-list">${materials}</ul>
          <p class="detail-note">图片为设计意向示意，具体材质、颜色与收口以项目合同为准。</p>
        </div>
      </div>
    </section>

    <section class="detail-section">
      <div class="detail-section__head reveal">
        <p class="eyebrow">NEARBY / 相近案例</p>
        <h2 class="detail-subtitle">同一类空间，不同的解法。</h2>
      </div>
      <div class="related-grid">${nearbyCards}</div>
    </section>

    ${detailCta(site, "想要一个类似的空间？")}
  </div>`;

  return pageShell({
    site,
    title: `${project.title}｜${project.category}案例｜${site.brand.name}`,
    description: `${project.description} 项目地址：${project.location}。${project.locationNote}`,
    canonicalPath: `/cases/${project.slug}.html`,
    image: project.cover,
    imageWidth: 1600,
    imageHeight: 1200,
    imageAlt: project.alt,
    jsonLd: pageJsonLd(site, crumbs, {
      "@type": "CreativeWork",
      name: project.title,
      description: project.description,
      image: url(site.seo.siteUrl, project.cover),
      about: project.category,
      locationCreated: { "@type": "Place", name: project.location },
    }),
    body,
  });
}

export function renderMaterial({ site, material, products }) {
  const crumbs = [
    { name: "首页", path: "/" },
    { name: "板材系统", path: "/#materials" },
    { name: material.name, path: `/materials/${material.slug}.html` },
  ];
  const related = products
    .filter((product) => (product.materialSlugs || []).includes(material.slug))
    .map(relatedCardProduct)
    .join("\n      ");

  const body = `<div class="container">
    ${breadcrumb(crumbs)}
    <header class="material-hero">
      <div class="material-hero__visual material-swatch--${attr(material.swatch)} reveal">
        <span class="material-hero__num">${escapeHtml(material.number)}</span>
        <span class="material-hero__en">${escapeHtml(material.english)}</span>
      </div>
      <div class="material-hero__copy reveal" style="--delay:.08s">
        <p class="eyebrow">板材 / ${escapeHtml(material.english)}</p>
        <h1 class="detail-title">${escapeHtml(material.name)}</h1>
        <p class="detail-lead">${escapeHtml(material.summary)}</p>
        <div class="material-brands">${material.brands.map((brand) => `<span>${escapeHtml(brand)}</span>`).join("")}</div>
        <dl class="material-facts">
          <div><dt>定位</dt><dd>${escapeHtml(material.priceLevel)}</dd></div>
          <div><dt>芯材</dt><dd>${escapeHtml(material.core)}</dd></div>
          <div><dt>饰面</dt><dd>${escapeHtml(material.finish)}</dd></div>
        </dl>
        <a class="btn btn--dark" href="/#contact">按这个板材聊方案 ${ICONS.arrow}</a>
      </div>
    </header>

    <section class="detail-section">
      <div class="material-detail-grid">
        <figure class="material-application reveal">
          <img src="${attr(material.image)}" alt="${attr(material.imageAlt)}" loading="lazy" decoding="async">
          <figcaption>${escapeHtml(material.imageNote)}</figcaption>
        </figure>
        <div class="material-lists reveal" style="--delay:.08s">
          <div>
            <h3>优点</h3>
            <ul>${material.advantages.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>
          </div>
          <div>
            <h3>要注意</h3>
            <ul>${material.cautions.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>
          </div>
        </div>
      </div>
      <div class="detail-columns material-spaces">
        <div class="reveal">
          <h2 class="detail-subtitle">适合空间</h2>
          <ul class="chip-list">${material.spaces.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>
        </div>
        <div class="reveal" style="--delay:.08s">
          <h2 class="detail-subtitle">常见品牌</h2>
          <p class="detail-note">${escapeHtml(material.brands.join("、"))}。具体批次与环保等级以项目报价与合同为准。</p>
        </div>
      </div>
    </section>

    <section class="detail-section detail-section--tint">
      <div class="detail-section__head reveal">
        <p class="eyebrow">APPLY / 用在哪里</p>
        <h2 class="detail-subtitle">这种板材，适合这些系列。</h2>
      </div>
      <div class="related-grid">${related}</div>
    </section>

    ${detailCta(site, "不确定选哪种板？")}
  </div>`;

  return pageShell({
    site,
    title: `${material.name}｜板材系统｜${site.brand.name}`,
    description: `${material.summary} 品牌：${material.brands.join("、")}。`,
    canonicalPath: `/materials/${material.slug}.html`,
    image: material.image,
    imageWidth: 1600,
    imageHeight: 1200,
    imageAlt: material.imageAlt,
    jsonLd: pageJsonLd(site, crumbs, {
      "@type": "Product",
      name: material.name,
      description: material.summary,
      image: url(site.seo.siteUrl, material.image),
      category: "板材",
      brand: { "@type": "Brand", name: site.brand.name },
    }),
    body,
  });
}

function relatedCardProduct(product) {
  return `<a class="related-card reveal" href="/products/${attr(product.slug)}.html">
    <span class="related-card__media"><img src="${attr(product.image)}" alt="${attr(product.alt)}" loading="lazy" decoding="async"></span>
    <span class="related-card__body">
      <span class="related-card__category">${escapeHtml(product.english)}</span>
      <h3>${escapeHtml(product.name)}</h3>
      <span class="related-card__more">查看产品 ${ICONS.arrow}</span>
    </span>
  </a>`;
}

export function renderFactory({ site, factory }) {
  const crumbs = [
    { name: "首页", path: "/" },
    { name: "自有厂区", path: "/factory.html" },
  ];
  const responsibilities = factory.responsibilities
    .map((item, index) => `<article class="factory-duty reveal" style="--delay:${index * 0.06}s">
      <span>${String(index + 1).padStart(2, "0")}</span>
      <h3>${escapeHtml(item.label)}</h3>
      <p>${escapeHtml(item.text)}</p>
    </article>`)
    .join("\n      ");
  const capabilities = factory.capabilities
    .map((item, index) => `<article class="detail-point reveal" style="--delay:${index * 0.06}s">
      <span class="detail-point__num">${String(index + 1).padStart(2, "0")}</span>
      <h3>${escapeHtml(item.title)}</h3>
      <p>${escapeHtml(item.text)}</p>
    </article>`)
    .join("\n      ");
  const stats = factory.stats
    .map((stat) => `<div class="factory-stat"><strong>${escapeHtml(stat.value)}</strong><span>${escapeHtml(stat.label)}</span></div>`)
    .join("");

  const body = `<div class="container">
    ${breadcrumb(crumbs)}
    <header class="factory-page-hero reveal">
      <p class="eyebrow eyebrow--light">${escapeHtml(factory.eyebrow)}</p>
      <h1 class="detail-title detail-title--light">${escapeHtml(factory.title)}</h1>
      <p class="detail-lead detail-lead--light">${escapeHtml(factory.lead)}</p>
      <div class="factory-page-stats">${stats}</div>
    </header>

    <section class="detail-section">
      <div class="detail-section__head reveal">
        <p class="eyebrow">ROLES / 各司其职</p>
        <h2 class="detail-subtitle">品牌、生产、安装，分开管理。</h2>
      </div>
      <div class="factory-duties">${responsibilities}</div>
    </section>

    <section class="detail-section detail-section--tint">
      <div class="detail-section__head reveal">
        <p class="eyebrow">PROCESS / 厂内工序</p>
        <h2 class="detail-subtitle">从图纸到板件，在厂内完成。</h2>
      </div>
      <div class="detail-points">${capabilities}</div>
      <div class="detail-prose reveal">
        ${factory.paragraphs.map((p) => `<p>${escapeHtml(p)}</p>`).join("")}
      </div>
    </section>

    <div class="factory-note reveal">
      <p>${escapeHtml(factory.note)}</p>
      <a class="btn btn--dark" href="/#contact">预约到厂沟通 ${ICONS.arrow}</a>
    </div>
  </div>`;

  return pageShell({
    site,
    title: `自有厂区｜${factory.name}｜${site.brand.name}`,
    description: `${factory.name}，位于${factory.location}。${factory.lead}`,
    canonicalPath: "/factory.html",
    jsonLd: pageJsonLd(site, crumbs, {
      "@type": "Place",
      name: factory.name,
      address: { "@type": "PostalAddress", addressLocality: "成都", addressRegion: "四川", addressCountry: "CN" },
    }),
    body,
  });
}


export function renderHome({ site, projects: projectsList, materials, factory }) {
  const jsonLd = `${organizationJsonLd(site)}`;
  const materialData = materials.items.map((item) => ({
    slug: item.slug,
    name: item.name,
    english: item.english,
    number: item.number,
    swatch: item.swatch,
    priceLevel: item.priceLevel,
    summary: item.summary,
    brands: item.brands,
    core: item.core,
    advantages: item.advantages,
    cautions: item.cautions,
    spaces: item.spaces,
    finish: item.finish,
    image: item.image,
    imageAlt: item.imageAlt,
  }));
  return `<!doctype html>
<html lang="zh-CN">
<head>
  ${head({
    site,
    canonicalPath: "/",
    preloadImage: site.hero.image,
    jsonLd,
  })}
</head>
<body>
  <a class="skip-link" href="#main">跳到主要内容</a>
  ${header(site, false)}
  <main id="main">
    ${hero(site)}
    ${intro(site)}
    ${about(site)}
    ${series(site)}
    ${philosophy(site)}
    ${process(site)}
    ${factorySection(factory)}
    ${projects(site, projectsList)}
    ${craft(site)}
    ${materialsSection(materials)}
    ${contact(site)}
  </main>
  ${footer(site, false)}
  ${materialModal()}
  ${bookingModal(site)}
  <script type="application/json" id="materials-data">${JSON.stringify(materialData).replace(/</g, "\\u003c")}</script>
  <script src="/main.js" defer></script>
</body>
</html>`;
}

export function renderPrivacy({ site, privacy }) {
  const sections = privacy.sections
    .map((section) => {
      const paragraphs = (section.paragraphs || []).map((p) => `<p>${escapeHtml(p)}</p>`).join("\n      ");
      const list = section.list
        ? `<ul>${section.list.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>`
        : "";
      return `<section>
      <h2>${escapeHtml(section.heading)}</h2>
      ${paragraphs}
      ${list}
    </section>`;
    })
    .join("\n    ");

  return `<!doctype html>
<html lang="zh-CN">
<head>
  ${head({
    site,
    title: `${privacy.title}｜${site.brand.fullName}`,
    description: privacy.description,
    canonicalPath: "/privacy",
  })}
</head>
<body>
  <a class="skip-link" href="#main">跳到主要内容</a>
  ${header(site, true)}
  <main class="page-main" id="main">
    <div class="container">
      <p class="eyebrow">PRIVACY / 隐私</p>
      <h1 class="page-title">${escapeHtml(privacy.title)}</h1>
      <p class="page-updated">最近更新：${escapeHtml(privacy.updated)}</p>
      <div class="prose">
        <p>${escapeHtml(privacy.intro)}</p>
        ${sections}
        <p><a href="/">← 返回首页</a></p>
      </div>
    </div>
  </main>
  ${footer(site, true)}
  ${bookingModal(site)}
  <script src="/main.js" defer></script>
</body>
</html>`;
}

export function render404({ site }) {
  return `<!doctype html>
<html lang="zh-CN">
<head>
  ${head({
    site,
    title: `页面未找到｜${site.brand.fullName}`,
    description: "你访问的页面不存在，或已经移动。",
    canonicalPath: "/404.html",
    noindex: true,
  })}
</head>
<body>
  <a class="skip-link" href="#main">跳到主要内容</a>
  ${header(site, true)}
  <main class="page-main" id="main">
    <div class="container">
      <p class="eyebrow">404 / NOT FOUND</p>
      <h1 class="page-title">这面墙后面，<br>暂时没有空间。</h1>
      <div class="prose">
        <p>你访问的页面不存在，或已经移动。可以回到首页，继续看看我们的空间提案。</p>
        <p><a class="btn btn--dark" href="/">回到首页 ${ICONS.arrow}</a></p>
      </div>
    </div>
  </main>
  ${footer(site, true)}
  ${bookingModal(site)}
  <script src="/main.js" defer></script>
</body>
</html>`;
}

export function renderThanks({ site }) {
  return `<!doctype html>
<html lang="zh-CN">
<head>
  ${head({
    site,
    title: `预约已提交｜${site.brand.fullName}`,
    description: "预约信息已提交，我们会尽快与你联系。",
    canonicalPath: "/thanks",
    noindex: true,
  })}
</head>
<body>
  <a class="skip-link" href="#main">跳到主要内容</a>
  ${header(site, true)}
  <main class="page-main" id="main">
    <div class="container">
      <p class="eyebrow">THANK YOU / 已收到</p>
      <h1 class="page-title">预约信息已收到。</h1>
      <div class="prose">
        <p>感谢你的信任。我们会尽快与你联系，确认沟通时间与方式。</p>
        <p>如果希望补充户型图或参考图片，可以在后续沟通中直接发给我们。</p>
        <p><a class="btn btn--dark" href="/">返回首页 ${ICONS.arrow}</a></p>
      </div>
    </div>
  </main>
  ${footer(site, true)}
  ${bookingModal(site)}
  <script src="/main.js" defer></script>
</body>
</html>`;
}
