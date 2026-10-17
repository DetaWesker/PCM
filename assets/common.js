/* PHOR COFFEE: ส่วนที่ทุกหน้าใช้ร่วมกัน */
/* =================================================================
   ส่วนแสดงผล (ปกติไม่ต้องแก้)
   ================================================================= */
const $ = id => document.getElementById(id);
const esc = s => String(s ?? "").replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const icon = (id, cls = "i") => `<svg class="${cls}" aria-hidden="true"><use href="#i-${id}"/></svg>`;
const TEL = "tel:+66" + SITE.phone.replace(/^0/, "");
const toMin = t => { const [h, m] = t.split(":").map(Number); return h * 60 + m; };
const bkkNow = () => new Date(new Date().toLocaleString("en-US", { timeZone: "Asia/Bangkok" }));
const sameEveryDay = SITE.hours.every(h => h && SITE.hours[0] && h[0] === SITE.hours[0][0] && h[1] === SITE.hours[0][1]);

/* ภาษา: ไทยเป็นค่าเริ่มต้น  อังกฤษเมื่อผู้ใช้เลือกเอง (จำไว้ทุกหน้า) หรือเปิดลิงก์ที่มี ?lang=en */
const LANG_KEY = "phor-lang";
let LANG = (() => {
  let q = null; try { q = new URLSearchParams(location.search).get("lang"); } catch (e) {}
  if (q === "th" || q === "en") { try { localStorage.setItem(LANG_KEY, q); } catch (e) {} return q; }
  let v = null; try { v = localStorage.getItem(LANG_KEY); } catch (e) {}
  return v === "en" ? "en" : "th";
})();
// t("key", {n: 3}) = ข้อความตามภาษาที่เลือก  ถ้าภาษาอังกฤษไม่มีคำนั้นจะใช้ภาษาไทย
const t = (key, vars) => {
  let str = STR[LANG][key] ?? STR.th[key] ?? key;
  if (vars) for (const k in vars) str = str.split("{" + k + "}").join(vars[k]);
  return str;
};
// L(item, "name") = item.nameEn ตอนภาษาอังกฤษ (ถ้ามี) ไม่อย่างนั้น item.name
const L = (o, f) => (LANG === "en" && o[f + "En"] != null && o[f + "En"] !== "") ? o[f + "En"] : o[f];
const hoursText = () => sameEveryDay ? t("hours.daily", { open: SITE.hours[0][0], close: SITE.hours[0][1] }) : t("hours.seeLocation");
const countText = n => n === 1 ? t("menu.count1") : t("menu.count", { n });

/* รูปจาก Google: ขอขนาดที่พอดีกับพื้นที่ + รองรับจอความละเอียดสูง */
const src = (u, w, h) => `${u}=w${w}-h${h}-p-k-no`;   // -p = ตัดรูปให้พอดีขนาด
function photo(u, alt, w, h, eager) {
  return `<img src="${src(u, w, h)}" srcset="${src(u, w, h)} 1x, ${src(u, w * 2, h * 2)} 2x" alt="${esc(alt)}" width="${w}" height="${h}" ${eager ? "" : 'loading="lazy"'} decoding="async" referrerpolicy="no-referrer" onerror="this.parentNode.classList.add('failed')">`;
}
/* รูปแบบไม่ตัด: ให้ CSS ตัดเองตามจุดโฟกัส (pos = "แนวนอน แนวตั้ง") แก้วและขนมจึงไม่โดนตัดไม่ว่ากรอบจะเป็นทรงไหน
   รูปจาก Google ขอตามความกว้าง  รูปในเครื่อง (assets/img) ถ้าพื้นที่เล็กใช้ไฟล์ขนาดเล็กใน assets/img/sm */
const isGoogle = u => /^https:\/\/lh3\.googleusercontent\.com\//.test(u);
const imgUrl = (u, w) => isGoogle(u) ? `${u}=w${w}-h${w * 2}-k-no` : (w <= 600 ? u.replace("assets/img/", "assets/img/sm/") : u);
function photoFit(u, alt, w, pos, eager) {
  return `<img src="${imgUrl(u, w)}" srcset="${imgUrl(u, w)} 1x, ${imgUrl(u, w * 2)} 2x" alt="${esc(alt)}" style="object-position:${esc(pos || "50% 50%")}" ${eager ? "" : 'loading="lazy"'} decoding="async" referrerpolicy="no-referrer" onerror="this.parentNode.classList.add('failed')">`;
}

/* ทั่วไป */
document.querySelectorAll(".js-line").forEach(a => a.href = SITE.line);
document.querySelectorAll(".js-gmaps").forEach(a => a.href = SITE.gmapsUrl);
$("barCall").href = TEL;

function updateStatus() {
  const now = bkkNow(), h = SITE.hours[now.getDay()], m = now.getHours() * 60 + now.getMinutes();
  const open = !!h && m >= toMin(h[0]) && m < toMin(h[1]);
  $("status").classList.toggle("is-open", open);
  $("status").querySelector(".txt").textContent = open ? t("status.open", { time: h[1] }) : (h ? t("status.closed", { time: h[0] }) : t("status.closedToday"));
}
updateStatus(); setInterval(updateStatus, 60000);

/* โหมดสว่าง / มืด: ปุ่มมุมขวาบน จำค่าที่เลือกไว้ทุกหน้า ถ้ายังไม่เคยเลือกจะใช้ตามโหมดของเครื่อง */
const Theme = (() => {
  const KEY = "phor-theme", root = document.documentElement, btn = $("themeToggle");
  const mq = matchMedia("(prefers-color-scheme: dark)");
  const reduce = matchMedia("(prefers-reduced-motion: reduce)");
  const meta = document.querySelector('meta[name="theme-color"]');
  const saved = () => { try { const t = localStorage.getItem(KEY); return t === "light" || t === "dark" ? t : null; } catch (e) { return null; } };
  const save = t => { try { localStorage.setItem(KEY, t); } catch (e) {} };
  let tid = 0;
  function apply(mode, animate) {
    if (animate && !reduce.matches) {
      root.classList.add("theme-anim");
      clearTimeout(tid); tid = setTimeout(() => root.classList.remove("theme-anim"), 450);
    }
    root.setAttribute("data-theme", mode);
    if (meta) meta.content = mode === "dark" ? "#121A15" : "#F7F7F4";
    btn.setAttribute("aria-checked", String(mode === "dark"));
    btn.setAttribute("aria-label", t("theme.label"));
    btn.title = t(mode === "dark" ? "theme.toLight" : "theme.toDark");
  }
  apply(root.getAttribute("data-theme") === "dark" ? "dark" : "light", false);
  btn.addEventListener("click", () => {
    const mode = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
    save(mode); apply(mode, true);
  });
  // ถ้ายังไม่เคยเลือกเอง แล้วเครื่องเปลี่ยนโหมด (เช่น มือถือเปลี่ยนเป็นมืดตอนค่ำ) เว็บเปลี่ยนตาม
  mq.addEventListener("change", e => { if (!saved()) apply(e.matches ? "dark" : "light", true); });
  addEventListener("langchange", () => apply(root.getAttribute("data-theme") === "dark" ? "dark" : "light", false));
  return { apply };
})();

/* footer */
const renderFooter = () => {
  $("footHours").textContent = sameEveryDay ? t("hours.footer", { open: SITE.hours[0][0], close: SITE.hours[0][1] }) : t("hours.seeLocation");
};
renderFooter();
addEventListener("langchange", () => { renderFooter(); updateStatus(); });

/* ===== เปลี่ยนภาษา =====
   ข้อความคงที่ในหน้า: ใส่ data-i18n="key" (ตัวหนังสือ) หรือ data-i18n-attr="aria-label:key;alt:key2" (แอตทริบิวต์)
   ข้อความที่สร้างด้วย JavaScript: แต่ละหน้าฟัง event "langchange" แล้ววาดใหม่ */
const I18N = (() => {
  const root = document.documentElement;
  const page = document.body.dataset.page;
  function applyStatic() {
    root.lang = LANG;
    document.querySelectorAll("[data-i18n]").forEach(el => { el.textContent = t(el.dataset.i18n); });
    document.querySelectorAll("[data-i18n-attr]").forEach(el => {
      el.dataset.i18nAttr.split(";").forEach(pair => { const [a, k] = pair.split(":"); if (a && k) el.setAttribute(a.trim(), t(k.trim())); });
    });
    if (page) {
      document.title = t("title." + page);
      const d = document.querySelector('meta[name="description"]'); if (d) d.content = t("desc." + page);
    }
  }
  function set(lang) {
    if (lang !== "th" && lang !== "en" || lang === LANG) return;
    LANG = lang;
    try { localStorage.setItem(LANG_KEY, lang); } catch (e) {}
    applyStatic();
    dispatchEvent(new CustomEvent("langchange", { detail: lang }));
  }
  applyStatic();
  return { set, applyStatic };
})();

/* ปุ่มเลือกภาษา: ดัดแปลงจากคอมโพเนนต์ Language Selector Dropdown (ปุ่มทรงแคปซูล + รายการภาษาพร้อมเครื่องหมายถูก) */
const LangSelect = (() => {
  const LANGS = [{ code: "th", label: "ไทย", short: "TH" }, { code: "en", label: "English", short: "EN" }];
  const wrap = $("langSelect"); if (!wrap) return null;
  const btn = wrap.querySelector(".ls-trigger"), menu = wrap.querySelector(".ls-menu"), cur = wrap.querySelector(".ls-current");
  const CHECK = '<svg class="ls-check" viewBox="0 0 24 24" aria-hidden="true"><path d="M20 6 9 17l-5-5"/></svg>';
  menu.innerHTML = LANGS.map(l => `<li role="none"><button type="button" role="menuitemradio" class="ls-item" data-lang="${l.code}" lang="${l.code}"><span class="ls-label">${l.label}</span>${CHECK}</button></li>`).join("");
  const items = [...menu.querySelectorAll(".ls-item")];
  function sync() {
    const l = LANGS.find(x => x.code === LANG);
    cur.textContent = l.label;
    cur.setAttribute("lang", l.code);
    btn.setAttribute("aria-label", `${t("lang.label")}: ${l.label}`);
    menu.setAttribute("aria-label", t("lang.label"));
    items.forEach(b => { const on = b.dataset.lang === LANG; b.setAttribute("aria-checked", String(on)); b.classList.toggle("is-on", on); });
  }
  const isOpen = () => wrap.hasAttribute("data-open");
  function open(focusItem) {
    wrap.setAttribute("data-open", ""); btn.setAttribute("aria-expanded", "true");
    if (focusItem) (items.find(b => b.dataset.lang === LANG) || items[0]).focus();
  }
  function close(refocus) {
    if (!isOpen()) return;
    wrap.removeAttribute("data-open"); btn.setAttribute("aria-expanded", "false");
    if (refocus) btn.focus();
  }
  btn.addEventListener("click", () => isOpen() ? close(false) : open(false));
  btn.addEventListener("keydown", e => {
    if (e.key === "ArrowDown" || e.key === "ArrowUp") { e.preventDefault(); open(true); }
  });
  menu.addEventListener("click", e => {
    const b = e.target.closest(".ls-item"); if (!b) return;
    close(true);
    I18N.set(b.dataset.lang);
  });
  menu.addEventListener("keydown", e => {
    const i = items.indexOf(document.activeElement);
    if (e.key === "ArrowDown") { e.preventDefault(); items[(i + 1) % items.length].focus(); }
    else if (e.key === "ArrowUp") { e.preventDefault(); items[(i - 1 + items.length) % items.length].focus(); }
    else if (e.key === "Home") { e.preventDefault(); items[0].focus(); }
    else if (e.key === "End") { e.preventDefault(); items[items.length - 1].focus(); }
    else if (e.key === "Tab") close(false);
  });
  document.addEventListener("keydown", e => { if (e.key === "Escape" && isOpen()) close(true); });
  document.addEventListener("pointerdown", e => { if (isOpen() && !wrap.contains(e.target)) close(false); });
  addEventListener("langchange", sync);
  sync();
  return { close };
})();
document.documentElement.classList.remove("i18n-pending");
