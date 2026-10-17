/* PHOR COFFEE: หน้าข้อมูล */
/* ข้อมูล */
const hero = $("heroImg");
hero.src = src(PHOTO.front, 1600, 1000);
hero.srcset = `${src(PHOTO.front, 900, 1100)} 900w, ${src(PHOTO.front, 1600, 1000)} 1600w, ${src(PHOTO.front, 2400, 1500)} 2400w`;
hero.sizes = "100vw";
hero.onerror = () => hero.remove();
$("heroTitle").textContent = SITE.name;

/* ===== รูปข้างข้อความแนะนำร้าน: เลื่อนเปลี่ยนเองทุก 5 วินาที =====
   รูปใหม่เลื่อนเข้ามาจากขวาทับรูปเดิม รูปเดิมเลื่อนออกช้ากว่าเล็กน้อย (parallax) ให้ดูมีมิติ
   หยุดชั่วคราวเมื่อเอาเมาส์ชี้ / กดปุ่มด้านล่าง / เลื่อนพ้นจอ / สลับไปแท็บอื่น  ปัดซ้ายขวาบนมือถือได้ */
const Slides = (() => {
  const box = $("aboutImg"), photos = SITE.aboutPhotos || [], N = photos.length;
  const SHOW = 5000, MOVE = 1100;
  const reduce = matchMedia("(prefers-reduced-motion: reduce)");
  if (!N) return null;
  const srcAttrs = u => isGoogle(u)
    ? `src="${imgUrl(u, 1080)}"`
    : `src="${imgUrl(u, 1080)}" srcset="${imgUrl(u, 540)} 540w, ${imgUrl(u, 1080)} 1080w" sizes="(max-width: 699px) 100vw, 50vw"`;
  box.innerHTML = `<div class="sl-view">${photos.map((p, i) =>
      `<div class="sl${i ? "" : " is-cur"}" role="group" aria-roledescription="slide"><img data-src='${srcAttrs(p.img)}' alt="" style="object-position:${esc(p.pos || "50% 50%")}" decoding="async" referrerpolicy="no-referrer" draggable="false"></div>`).join("")}</div>` +
    (N > 1 ? `<div class="sl-dots">${photos.map((_, i) => `<button type="button" class="sl-dot${i ? "" : " is-cur"}" data-i="${i}"><i></i></button>`).join("")}</div>` : "");
  const slides = [...box.querySelectorAll(".sl")], dots = [...box.querySelectorAll(".sl-dot")];
  const imgs = slides.map(s => s.querySelector("img"));
  const failed = new Set();
  // ใส่ src ตอนต้องใช้: รูปแรกทันที รูปที่เหลือเมื่อเลื่อนมาใกล้ส่วนนี้
  const load = i => {
    const img = imgs[i]; if (!img.dataset.src) return;
    const tmp = document.createElement("div"); tmp.innerHTML = `<img ${img.dataset.src}>`;
    const m = tmp.firstChild;
    img.onerror = () => { failed.add(i); slides[i].classList.add("failed"); };
    img.onload = () => slides[i].classList.add("is-loaded");
    if (m.srcset) { img.sizes = m.sizes; img.srcset = m.srcset; }
    img.src = m.getAttribute("src");
    delete img.dataset.src;
    if (img.complete && img.naturalWidth) slides[i].classList.add("is-loaded");
  };
  load(0);

  let cur = 0, busy = false, timer = 0, started = 0, remaining = SHOW;
  const holds = new Set(["view"]);   // เหตุที่หยุด: ยังไม่เห็น (view) ชี้เมาส์ (hover) โฟกัส (focus) แท็บซ่อน (hidden) กำลังเลื่อน (move)

  function labels() {
    box.setAttribute("aria-label", t("home.slides"));
    slides.forEach((s, i) => {
      s.setAttribute("aria-label", t("home.slide", { n: i + 1, total: N }));
      s.setAttribute("aria-hidden", String(i !== cur));
      imgs[i].alt = L(photos[i], "alt");
    });
    dots.forEach((d, i) => { d.setAttribute("aria-label", t("home.goSlide", { n: i + 1 })); });
  }
  function markDots() {
    dots.forEach((d, i) => {
      const on = i === cur;
      d.classList.toggle("is-cur", on);
      if (on) d.setAttribute("aria-current", "true"); else d.removeAttribute("aria-current");
    });
    // เริ่มแถบเวลาใหม่ให้รูปปัจจุบัน
    const fill = dots[cur] && dots[cur].querySelector("i");
    if (fill) { fill.style.animation = "none"; void fill.offsetWidth; fill.style.animation = ""; }
  }

  function tick() { clearTimeout(timer); if (holds.size || N < 2) return; started = Date.now(); timer = setTimeout(next, remaining); }
  function hold(why) { if (holds.has(why)) return; if (!holds.size) remaining = Math.max(0, remaining - (Date.now() - started)); clearTimeout(timer); holds.add(why); box.classList.toggle("is-held", holds.size > 0); }
  function release(why) { if (!holds.delete(why)) return; box.classList.toggle("is-held", holds.size > 0); tick(); }

  function nextIndex(from, dir) {
    for (let k = 1; k <= N; k++) { const i = (from + dir * k + N * k) % N; if (!failed.has(i)) return i; }
    return from;
  }
  function next() { go(nextIndex(cur, 1), 1); }

  function go(to, dir) {
    if (busy || to === cur) return;
    const img = imgs[to];
    if (img.dataset.src) load(to);
    // รอรูปถัดไปโหลดเสร็จก่อนค่อยเลื่อน จะไม่เห็นกรอบว่าง
    if (!(img.complete && img.naturalWidth) && !failed.has(to)) {
      hold("load");
      const go2 = () => { img.removeEventListener("load", go2); img.removeEventListener("error", go2); release("load"); go(to, dir); };
      img.addEventListener("load", go2); img.addEventListener("error", go2);
      return;
    }
    busy = true; hold("move");
    const a = slides[cur], b = slides[to];
    b.classList.remove("anim");
    b.style.setProperty("--x", dir * 100 + "%");
    b.style.setProperty("--sc", "1.06");
    b.classList.add("is-in");
    void b.offsetWidth;
    a.classList.add("anim", "is-out"); b.classList.add("anim");
    a.style.setProperty("--x", -dir * 100 + "%");
    a.style.setProperty("--ix", dir * 50 + "%");
    a.style.setProperty("--dim", "1");
    b.style.setProperty("--x", "0%");
    b.style.setProperty("--sc", "1");
    cur = to;
    remaining = SHOW;
    labels(); markDots();
    if (!imgs[nextIndex(cur, 1)].src) load(nextIndex(cur, 1));
    setTimeout(() => {
      a.classList.remove("anim", "is-out", "is-cur");
      ["--x", "--ix", "--dim", "--sc"].forEach(v => a.style.removeProperty(v));
      b.classList.remove("anim", "is-in"); b.classList.add("is-cur");
      ["--x", "--sc"].forEach(v => b.style.removeProperty(v));
      busy = false; release("move");
    }, reduce.matches ? 30 : MOVE + 40);
  }

  dots.forEach((d, i) => d.addEventListener("click", () => { if (i !== cur) go(i, i > cur ? 1 : -1); }));
  // ชี้เมาส์ = หยุดดู (เฉพาะอุปกรณ์ที่มีเมาส์) / โฟกัสปุ่มด้วยคีย์บอร์ด = หยุด
  box.addEventListener("pointerenter", e => { if (e.pointerType === "mouse") hold("hover"); });
  box.addEventListener("pointerleave", e => { if (e.pointerType === "mouse") release("hover"); });
  box.addEventListener("focusin", e => { if (e.target.matches(":focus-visible")) hold("focus"); });
  box.addEventListener("focusout", () => release("focus"));
  document.addEventListener("visibilitychange", () => document.hidden ? hold("hidden") : release("hidden"));
  // ปัดซ้าย = รูปถัดไป  ปัดขวา = รูปก่อนหน้า
  let sx = 0, sy = 0, down = false;
  box.addEventListener("pointerdown", e => { if (e.pointerType !== "mouse") { sx = e.clientX; sy = e.clientY; down = true; } });
  box.addEventListener("pointerup", e => {
    if (!down) return; down = false;
    const dx = e.clientX - sx, dy = e.clientY - sy;
    if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(dy) * 1.3) go(nextIndex(cur, dx < 0 ? 1 : -1), dx < 0 ? 1 : -1);
  });
  box.addEventListener("pointercancel", () => { down = false; });
  // เริ่มเล่นเมื่อเลื่อนมาเห็น และโหลดรูปที่เหลือตอนนั้น
  if (typeof IntersectionObserver === "undefined") { photos.forEach((_, i) => load(i)); release("view"); }
  else new IntersectionObserver(es => {
    es.forEach(e => {
      if (e.isIntersecting) { photos.forEach((_, i) => load(i)); release("view"); }
      else hold("view");
    });
  }, { rootMargin: "120px 0px", threshold: 0.25 }).observe(box);

  labels(); markDots();
  if (document.hidden) hold("hidden");
  return { labels };
})();

/* ข้อความที่เปลี่ยนตามภาษา */
function renderHome() {
  $("aboutTitle").textContent = L(SITE, "aboutTitle");
  $("aboutText").textContent = L(SITE, "about");
  $("quick").innerHTML = [
    [t("home.hours"), esc(hoursText())],
    [t("home.phone"), `<a href="${TEL}">${esc(SITE.phoneDisplay)}</a>`],
    [t("home.parking"), esc(L(SITE, "parking"))],
  ].map(([k, v]) => `<div><dt>${esc(k)}</dt><dd>${v}</dd></div>`).join("");
  $("gallery").querySelectorAll("img").forEach(img => { img.alt = t("gal." + img.dataset.k); });
  $("ratingStars").setAttribute("aria-label", t("home.stars", { n: SITE.rating }));
  $("ratingCount").textContent = t("home.ratingCount", { n: SITE.ratingCount });
  const quotes = L(SITE, "quotes");
  $("quotes").innerHTML = quotes.map(q => `<li><blockquote>“${esc(q)}”</blockquote></li>`).join("");
  $("quotes").lang = quotes === SITE.quotes ? "th" : "en";
  $("quotesNote").hidden = !t("home.translated") || quotes === SITE.quotes;
  Slides && Slides.labels();
}

// แต่ละรูปมีกรอบประจำ (ดู .g-* ใน style.css) และจุดโฟกัสที่ทำให้แก้ว/คนในรูปไม่โดนตัด
$("gallery").innerHTML = [
  ["matcha",    PHOTO.matcha,    "58% 50%"],
  ["brick",     PHOTO.brick,     "50% 55%"],
  ["signature", PHOTO.signature, "50% 60%"],
  ["seating",   PHOTO.seating,   "50% 40%"],
  ["inside",    PHOTO.inside,    "50% 66%"],
].map(([k, u, pos]) => `<figure class="ph g-${k}">${photoFit(u, t("gal." + k), k === "brick" ? 900 : 600, pos).replace("<img ", `<img data-k="${k}" `)}</figure>`).join("");
$("ratingNum").textContent = SITE.rating;
$("ratingStars").innerHTML = icon("star").repeat(5);
renderHome();
addEventListener("langchange", renderHome);

/* ข้อมูลร้านสำหรับ Google Search */
const ld = document.createElement("script");
ld.type = "application/ld+json";
ld.textContent = JSON.stringify({
  "@context": "https://schema.org", "@type": "CafeOrCoffeeShop", name: SITE.name,
  address: { "@type": "PostalAddress", streetAddress: "62/2 ถนนร่มเกล้า 1", addressLocality: "ลาดกระบัง", addressRegion: "กรุงเทพมหานคร", postalCode: "10520", addressCountry: "TH" },
  geo: { "@type": "GeoCoordinates", latitude: SITE.lat, longitude: SITE.lng },
  telephone: "+66" + SITE.phone.replace(/^0/, ""), email: SITE.email, image: src(PHOTO.front, 1200, 800),
  servesCuisine: "Coffee", priceRange: "฿",
  openingHoursSpecification: SITE.hours.map((h, i) => h && { "@type": "OpeningHoursSpecification",
    dayOfWeek: ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"][i], opens: h[0], closes: h[1] }).filter(Boolean),
});
document.head.appendChild(ld);
