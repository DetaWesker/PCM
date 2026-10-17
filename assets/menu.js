/* PHOR COFFEE: หน้าเมนู */
/* =================================================================
   เมนู: แฟ้มกระจก (ดัดแปลงจากคอมโพเนนต์ Glass Folder Cards ให้เป็น JavaScript ธรรมดา)
   ชั้นหลังคือรูปในแฟ้ม ตรงกลางคือแผ่นเมนู ชั้นหน้าคือกระจกขุ่นที่เบลอทุกอย่างข้างหลัง
   ปกติ: ปิดอยู่ เห็นขอบแผ่นเมนูนิดเดียว | ชี้/โฟกัส: กระจกเอนออก แผ่นเมนูยกขึ้น
   กด/Enter/Space: กระจกพับลง แผ่นเมนูกางออก แต่ละแผ่นกดได้ (แผ่นที่มีรูป = เปิดดูรูปใหญ่) | Esc หรือกดข้างนอก: ปิด
   ================================================================= */
const GF = (() => {
  const W = 340, H = 272, HEADROOM = 54, FRONT_TOP = 74, FRONT_H = H - FRONT_TOP;
  const SHEET_W = 272, SHEET_H = 184, MAX_VISIBLE = 4;
  const BACK_PATH = "M0 56A22 22 0 0 1 22 34L146 34C170 34 172 0 198 0L318 0A22 22 0 0 1 340 22L340 250A22 22 0 0 1 318 272L22 272A22 22 0 0 1 0 250Z";
  const FRONT_PATH = `M0 22A22 22 0 0 1 22 0L118 0C144 0 146 32 172 32L318 32A22 22 0 0 1 340 54L340 ${FRONT_H - 22}A22 22 0 0 1 318 ${FRONT_H}L22 ${FRONT_H}A22 22 0 0 1 0 ${FRONT_H - 22}Z`;

  // ตัวสุ่มที่กำหนดค่าเริ่มได้ (mulberry32) ให้แผ่นแต่ละแผ่นเอียงเหมือนเดิมทุกครั้ง
  const rng = seed => { let a = seed >>> 0; return () => { a = (a + 0x6d2b79f5) >>> 0; let t = a; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; };
  const hashString = s => { let x = 2166136261; for (let i = 0; i < s.length; i++) x = Math.imul(x ^ s.charCodeAt(i), 16777619); return x >>> 0; };
  const fanSlot = (i, n) => (n <= 1 ? 0 : (i / (n - 1)) * 2 - 1);
  // รูปแบบไม่ตัด แล้วให้ CSS ตัดตามจุดโฟกัส (imgUrl อยู่ใน common.js)
  const fit = imgUrl;
  const ZOOM = `<span class="gf-zoom" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M15 3h6v6"/><path d="M9 21H3v-6"/><path d="M21 3l-7 7"/><path d="M3 21l7-7"/></svg></span>`;
  const loaded = img => { const on = () => img.classList.add("is-loaded"); if (img.complete && img.naturalWidth) on(); else img.addEventListener("load", on, { once: true }); };
  let uidN = 0;

  function create(group, { width, appear = true, appearDelay = 0, open = false, active = false, onOpenChange, onSelect }) {
    const uid = "gf" + (++uidN);
    const k = width / W;
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    const withImg = group.items.filter(it => it.img), noImg = group.items.filter(it => !it.img);
    // แผ่นหน้าสุดโชว์หน้าแผ่นได้มากที่สุดตอนเปิดแฟ้ม จึงให้แผ่นที่มีรูปอยู่หน้า แผ่นกระดาษอยู่หลัง
    const picked = [...withImg, ...noImg].slice(0, MAX_VISIBLE);
    const visible = [...picked.filter(it => !it.img), ...picked.filter(it => it.img)];
    const count = group.items.length;

    const root = document.createElement("div");
    root.className = "gf-root";
    root.style.width = width + "px";
    root.style.height = (H + HEADROOM) * k + "px";
    // แฟ้มเล็กลง ตัวหนังสือข้างในจะเล็กตาม จึงขยายชดเชยให้อ่านได้อย่างน้อยราว 80% ของขนาดเต็ม
    root.style.setProperty("--gf-text", Math.max(1, 0.8 / k).toFixed(3));
    if (!appear) root.dataset.entered = "";
    if (open) root.dataset.open = "";
    if (active) root.dataset.active = "";

    const sheets = visible.map((it, v) => {
      const jit = rng(hashString(it.name) + v);
      const jx = ((jit() - 0.5) * 10).toFixed(2) + "px", jr = ((jit() - 0.5) * 3.2).toFixed(2) + "deg";
      const style = `--gf-slot:${fanSlot(v, visible.length)};--gf-depth:${visible.length - 1 - v};--gf-jx:${jx};--gf-jr:${jr};z-index:${v + 1}`;
      const body = it.img
        ? `<img class="gf-sheet-art" src="${fit(it.img, Math.round(SHEET_W * k * dpr))}" alt="" width="${SHEET_W}" height="${SHEET_H}" style="object-position:${esc(it.pos || "50% 50%")}" draggable="false" referrerpolicy="no-referrer" decoding="async">`
        : `<span class="gf-lines" aria-hidden="true"><i style="width:86%"></i><i style="width:92%"></i><i style="width:64%"></i><i style="width:88%"></i><i style="width:42%"></i></span>`;
      return `<div role="listitem" class="gf-sheet-slot"><button type="button" class="gf-sheet${it.img ? " gf-sheet--art" : ""}" style="${style}" data-item="${esc(it.name)}" aria-label="${esc(it.img ? t("menu.viewPhoto", { name: L(it, "name") }) : L(it, "name"))}, ${esc(t("menu.price", { n: it.price }))}">${body}<span class="gf-sheet-head"><span class="gf-sheet-name">${esc(L(it, "name"))}</span><span class="gf-sheet-meta">${esc(t("menu.price", { n: it.price }))}</span>${it.img ? ZOOM : ""}</span></button></div>`;
    }).join("");

    root.innerHTML = `
      <div class="gf-stage" style="transform:translateY(${HEADROOM * k}px) scale(${k})">
        <div class="gf-tilt">
          <div class="gf-shadow" aria-hidden="true"></div>
          <div class="gf-back" style="clip-path:path('${BACK_PATH}')" aria-hidden="true">
            ${group.cover ? `<img class="gf-art" src="${fit(group.cover.img, Math.round((W + 24) * k * dpr))}" alt="" width="${W + 24}" height="${H + 24}" style="object-position:${esc(group.cover.pos || "50% 50%")}" draggable="false" referrerpolicy="no-referrer" decoding="async">` : ""}
            <div class="gf-back-sheen"></div>
          </div>
          <svg class="gf-rim gf-back-rim" viewBox="0 0 ${W} ${H}" aria-hidden="true"><path d="${BACK_PATH}"/></svg>
          <div class="gf-front" style="clip-path:path('${FRONT_PATH}')">
            <div class="gf-tint" aria-hidden="true"></div>
            <div class="gf-spec" aria-hidden="true"></div>
            <svg class="gf-rim gf-front-rim" viewBox="0 0 ${W} ${FRONT_H}" aria-hidden="true">
              <defs><linearGradient id="${uid}-rim" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff" stop-opacity="0.95"/><stop offset="0.35" stop-color="#fff" stop-opacity="0.35"/><stop offset="1" stop-color="#fff" stop-opacity="0.12"/></linearGradient></defs>
              <path d="${FRONT_PATH}" stroke="url(#${uid}-rim)"/>
            </svg>
            <button type="button" class="gf-hit"></button>
            <div class="gf-label"><span class="gf-title">${esc(L(group, "group"))}</span><span class="gf-meta">${esc(countText(count))}</span></div>
          </div>
          <div class="gf-files" role="list" aria-label="${esc(t("menu.folderItems", { name: L(group, "group") }))}">${sheets}</div>
        </div>
      </div>`;

    const hit = root.querySelector(".gf-hit"), files = root.querySelector(".gf-files");
    root.querySelectorAll("img").forEach(loaded);

    const isOpen = () => root.hasAttribute("data-open");
    const sync = () => {
      const o = isOpen();
      hit.setAttribute("aria-expanded", String(o));
      hit.setAttribute("aria-label", t(o ? "menu.folderClose" : "menu.folderOpen", { name: L(group, "group"), n: count }));
      files.toggleAttribute("inert", !o);   // แผ่นเมนูตอนปิดแฟ้ม ไม่อยู่ในลำดับปุ่ม Tab
    };
    const setOpen = (o, notify = true) => {
      if (o === isOpen()) return;
      root.toggleAttribute("data-open", o);
      sync();
      if (notify) onOpenChange?.(group, o);
    };
    sync();

    hit.addEventListener("click", () => setOpen(!isOpen()));
    files.addEventListener("click", e => {
      const b = e.target.closest(".gf-sheet");
      if (b) onSelect?.(group, b.dataset.item, b);
    });

    // แสงและภาพขยับตามเมาส์ โดยไม่ต้อง render ใหม่
    let raf = 0, px = 0, py = 0;
    const write = () => { raf = 0; root.style.setProperty("--gf-px", px.toFixed(3)); root.style.setProperty("--gf-py", py.toFixed(3)); };
    root.addEventListener("pointermove", e => {
      if (e.pointerType === "touch") return;
      const r = root.getBoundingClientRect();
      px = ((e.clientX - r.left) / r.width) * 2 - 1;
      py = ((e.clientY - r.top) / r.height) * 2 - 1;
      if (!raf) raf = requestAnimationFrame(write);
    });
    root.addEventListener("pointerleave", () => { px = 0; py = 0; if (!raf) raf = requestAnimationFrame(write); });

    // Esc หรือกดข้างนอก ปิดแฟ้ม (ยกเว้นตอนดูรูปใหญ่อยู่: Esc ปิดแค่รูป แฟ้มยังเปิดค้างไว้)
    const viewing = () => !!document.querySelector(".lb[open]");
    const onKey = e => { if (e.key === "Escape" && isOpen() && !viewing()) { setOpen(false); hit.focus(); } };
    const onDown = e => { if (isOpen() && !root.contains(e.target) && !viewing()) setOpen(false); };
    document.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onDown);

    // ประกอบตัวเองครั้งแรกที่เลื่อนมาเห็น
    let io = null, appearT = 0;
    if (appear) {
      if (typeof IntersectionObserver === "undefined") root.dataset.entered = "";
      else {
        io = new IntersectionObserver(es => {
          if (!es.some(x => x.isIntersecting)) return;
          io.disconnect();
          appearT = setTimeout(() => { root.dataset.entered = ""; }, appearDelay);
        }, { threshold: 0.1 });   // มือถือ: แฟ้มถัดไปที่โผล่มาขอบจอต้องเห็นตั้งแต่แรก
        io.observe(root);
      }
    }

    return {
      el: root, group, isOpen, setOpen,
      setActive: a => root.toggleAttribute("data-active", a),
      destroy() {
        document.removeEventListener("keydown", onKey);
        document.removeEventListener("pointerdown", onDown);
        io?.disconnect(); clearTimeout(appearT); cancelAnimationFrame(raf);
        root.remove();
      },
    };
  }
  return { create };
})();

/* =================================================================
   ดูรูปเมนูขนาดใหญ่ (lightbox)
   เปิดจากแผ่นที่มีรูปในแฟ้ม หรือรูปย่อในรายการ  เลื่อนดูรูปอื่นในหมวดเดียวกันได้
   ปุ่มลูกศร / ปุ่มซ้ายขวาบนคีย์บอร์ด / ปัดบนมือถือ | ปิด: ปุ่ม X, Esc หรือกดพื้นที่ว่างรอบรูป
   ================================================================= */
const Lightbox = (() => {
  const I = d => `<svg viewBox="0 0 24 24" aria-hidden="true">${d}</svg>`;
  const lb = document.createElement("dialog");
  lb.className = "lb";
  lb.setAttribute("aria-labelledby", "lbName");
  lb.innerHTML = `
    <button type="button" class="lb-btn lb-close">${I('<path d="M18 6 6 18"/><path d="m6 6 12 12"/>')}</button>
    <div class="lb-stage">
      <figure class="lb-fig">
        <div class="lb-media"><img class="lb-img" alt="" decoding="async" referrerpolicy="no-referrer"></div>
        <figcaption class="lb-cap">
          <span class="lb-text"><span class="lb-meta" id="lbMeta"></span><span class="lb-name" id="lbName"></span><span class="lb-desc" id="lbDesc"></span></span>
          <span class="lb-price" id="lbPrice"></span>
        </figcaption>
      </figure>
    </div>
    <button type="button" class="lb-btn lb-prev">${I('<path d="m15 18-6-6 6-6"/>')}</button>
    <button type="button" class="lb-btn lb-next">${I('<path d="m9 18 6-6-6-6"/>')}</button>`;
  document.body.appendChild(lb);

  const img = lb.querySelector(".lb-img"), stage = lb.querySelector(".lb-stage");
  const prevB = lb.querySelector(".lb-prev"), nextB = lb.querySelector(".lb-next"), closeB = lb.querySelector(".lb-close");
  const reduce = matchMedia("(prefers-reduced-motion: reduce)");
  const big = u => imgUrl(u, 1080);
  const labelBtns = () => { closeB.setAttribute("aria-label", t("lb.close")); prevB.setAttribute("aria-label", t("lb.prev")); nextB.setAttribute("aria-label", t("lb.next")); };
  labelBtns();
  addEventListener("langchange", labelBtns);
  let list = [], idx = 0, group = null, trigger = null, token = 0, closing = 0, swiped = 0;

  function show(i) {
    idx = (i + list.length) % list.length;
    const it = list[idx], my = ++token;
    const gname = L(group, "group"), desc = L(it, "desc");
    $("lbMeta").textContent = list.length > 1 ? `${gname}  ${idx + 1} / ${list.length}` : gname;
    $("lbName").textContent = L(it, "name");
    $("lbDesc").textContent = desc || "";
    $("lbDesc").hidden = !desc;
    $("lbPrice").textContent = t("menu.price", { n: it.price });
    img.alt = L(it, "name");
    // โหลดรูปให้เสร็จก่อนแล้วค่อยสลับ ภาพจะไม่กระตุกหรือว่างระหว่างโหลด
    lb.classList.add("is-loading");
    const pre = new Image();
    pre.referrerPolicy = "no-referrer";
    const done = () => {
      if (my !== token) return;
      img.src = pre.src;
      lb.classList.remove("is-loading");
      img.classList.remove("is-shown"); void img.offsetWidth; img.classList.add("is-shown");
    };
    pre.onload = done;
    pre.onerror = () => { if (my === token) { img.removeAttribute("src"); lb.classList.remove("is-loading"); } };
    pre.src = big(it.img);
    if (pre.complete && pre.naturalWidth) done();
    // โหลดรูปข้างๆ รอไว้ กดถัดไปแล้วขึ้นทันที
    [1, -1].forEach(d => { const n = list[(idx + d + list.length) % list.length]; if (n !== it) { const p = new Image(); p.referrerPolicy = "no-referrer"; p.src = big(n.img); } });
  }

  function open(grp, name, from) {
    list = grp.items.filter(it => it.img);
    if (!list.length) return;
    group = grp; trigger = from || null;
    clearTimeout(closing);
    lb.classList.toggle("is-single", list.length < 2);
    show(Math.max(0, list.findIndex(it => it.name === name)));
    if (!lb.open) {
      // ล็อกหน้าไม่ให้เลื่อนข้างหลัง และกันหน้ากระตุกจากแถบเลื่อนที่หายไป
      const sbw = window.innerWidth - document.documentElement.clientWidth;
      document.documentElement.classList.add("lb-lock");
      if (sbw > 0) document.body.style.paddingRight = sbw + "px";
      if (lb.showModal) lb.showModal(); else lb.setAttribute("open", "");
      requestAnimationFrame(() => lb.classList.add("is-in"));
    }
    closeB.focus({ preventScroll: true });
  }

  function close() {
    if (!lb.open || !lb.classList.contains("is-in")) return;
    lb.classList.remove("is-in");
    clearTimeout(closing);
    closing = setTimeout(() => {
      if (lb.close) lb.close(); else lb.removeAttribute("open");
      document.documentElement.classList.remove("lb-lock");
      document.body.style.paddingRight = "";
      if (trigger && trigger.isConnected) trigger.focus({ preventScroll: true });
    }, reduce.matches ? 0 : 200);
  }

  closeB.addEventListener("click", close);
  prevB.addEventListener("click", () => show(idx - 1));
  nextB.addEventListener("click", () => show(idx + 1));
  lb.addEventListener("cancel", e => { e.preventDefault(); close(); });   // Esc
  lb.addEventListener("keydown", e => {
    if (e.key === "ArrowLeft" && list.length > 1) { e.preventDefault(); show(idx - 1); }
    else if (e.key === "ArrowRight" && list.length > 1) { e.preventDefault(); show(idx + 1); }
  });
  // กดพื้นที่ว่างรอบรูป = ปิด  (กดที่รูปหรือคำบรรยายไม่ปิด)
  lb.addEventListener("click", e => {
    if (Date.now() - swiped < 400) return;
    if (!e.target.closest(".lb-fig, .lb-btn")) close();
  });
  // ปัดซ้ายขวาบนจอสัมผัส
  let sx = 0, sy = 0, st = 0;
  stage.addEventListener("pointerdown", e => { if (e.pointerType !== "mouse") { sx = e.clientX; sy = e.clientY; st = Date.now(); } });
  stage.addEventListener("pointerup", e => {
    if (e.pointerType === "mouse" || !st || list.length < 2) return;
    const dx = e.clientX - sx, dy = e.clientY - sy; st = 0;
    if (Math.abs(dx) > 48 && Math.abs(dx) > Math.abs(dy) * 1.3) { swiped = Date.now(); show(idx + (dx < 0 ? 1 : -1)); }
  });
  stage.addEventListener("pointercancel", () => { st = 0; });
  return { open, close };
})();

const Menu = (() => {
  let folders = [], activeId = SITE.menu[0].id, openId = null, builtFor = 0, entered = false;
  const host = $("folders");
  // ไอคอนเส้นบาง (lucide) ในช่องรูปย่อของเมนูที่ยังไม่มีรูป
  const svg = d => `<svg viewBox="0 0 24 24">${d}</svg>`;
  const GLYPH = {
    coffee: svg('<path d="M10 2v2"/><path d="M14 2v2"/><path d="M6 2v2"/><path d="M16 8a1 1 0 0 1 1 1v8a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4V9a1 1 0 0 1 1-1h14a4 4 0 1 1 0 8h-1"/>'),
    drinks: svg('<path d="m6 8 1.75 12.28a2 2 0 0 0 2 1.72h4.54a2 2 0 0 0 2-1.72L18 8"/><path d="M5 8h14"/><path d="M7 15a6.47 6.47 0 0 1 5 0 6.47 6.47 0 0 0 5 0"/><path d="m12 8 1-6h2"/>'),
    desserts: svg('<circle cx="9" cy="7" r="2"/><path d="M7.2 7.9 3 11v9c0 .6.4 1 1 1h16c.6 0 1-.4 1-1v-9c0-2-3-6-7-8l-3.6 2.6"/><path d="M16 13H3"/><path d="M16 17H3"/>'),
  };

  function renderList(animate) {
    const g = SITE.menu.find(m => m.id === activeId);
    $("menuListTitle").textContent = L(g, "group");
    $("menuListCount").textContent = countText(g.items.length);
    const ul = $("menuListItems");
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    ul.innerHTML = g.items.map(it => `
      <li class="menu-item" data-item="${esc(it.name)}">
        ${it.img
          ? `<button type="button" class="mi-thumb" data-item="${esc(it.name)}" aria-label="${esc(t("menu.viewPhoto", { name: L(it, "name") }))}"><img src="${imgUrl(it.img, Math.round(64 * dpr))}" alt="" style="object-position:${esc(it.pos || "50% 50%")}" loading="lazy" decoding="async" referrerpolicy="no-referrer"></button>`
          : `<span class="mi-thumb mi-thumb--none" aria-hidden="true">${GLYPH[g.id] || GLYPH.coffee}</span>`}
        <span class="mi-body">
          <span class="name">${esc(L(it, "name"))}${L(it, "desc") ? `<span class="desc">${esc(L(it, "desc"))}</span>` : ""}</span>
          <span class="leader" aria-hidden="true"></span>
          <span class="price">${esc(it.price)}</span>
        </span>
      </li>`).join("");
    ul.querySelectorAll(".mi-thumb img").forEach(img => { const on = () => img.classList.add("is-loaded"); if (img.complete && img.naturalWidth) on(); else img.addEventListener("load", on, { once: true }); });
    if (animate) { ul.classList.remove("swap"); void ul.offsetWidth; ul.classList.add("swap"); }
  }

  function setActive(id) {
    if (id === activeId) return;
    activeId = id;
    folders.forEach(f => f.setActive(f.group.id === id));
    renderList(true);
  }

  // ขนาดแฟ้มตามพื้นที่: คอมเรียง 3 แฟ้ม  มือถือเลื่อนแนวนอนและเห็นแฟ้มถัดไปนิดหนึ่ง
  function folderWidth() {
    const vw = document.documentElement.clientWidth;
    if (vw >= 700) return Math.round(Math.min(320, (host.clientWidth - 48) / 3 - 12));   // iPad แนวตั้งขึ้นไป: วางครบ 3 แฟ้ม
    const gutter = parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--gutter")) || 16;
    return Math.round(Math.min(300, vw - gutter * 2 - 52));
  }

  function build(force) {
    const w = folderWidth();
    if (!w || (w === builtFor && !force)) return;
    builtFor = w;
    folders.forEach(f => f.destroy());
    host.innerHTML = "";
    folders = SITE.menu.map((g, i) => GF.create(g, {
      width: w,
      appear: !entered,
      appearDelay: i * 140,
      open: g.id === openId,
      active: g.id === activeId,
      onOpenChange: (grp, o) => {
        if (o) {
          openId = grp.id;
          folders.forEach(f => { if (f.group.id !== grp.id) f.setOpen(false, false); });   // เปิดได้ทีละแฟ้ม
          setActive(grp.id);
        } else if (openId === grp.id) openId = null;
      },
      onSelect: (grp, name, el) => {
        const it = grp.items.find(x => x.name === name);
        if (it && it.img) { Lightbox.open(grp, name, el); return; }   // แผ่นที่มีรูป: เปิดดูรูปใหญ่
        const li = [...$("menuListItems").children].find(x => x.dataset.item === name);
        if (!li) return;
        li.scrollIntoView({ behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth", block: "center" });
        li.classList.remove("flash"); void li.offsetWidth; li.classList.add("flash");
      },
    }));
    folders.forEach(f => host.appendChild(f.el));
    entered = true;
  }

  renderList(false);
  $("menuListItems").addEventListener("click", e => {
    const b = e.target.closest(".mi-thumb[data-item]");
    if (b) Lightbox.open(SITE.menu.find(m => m.id === activeId), b.dataset.item, b);
  });
  if (SITE.menuFoot) $("menuFoot").textContent = SITE.menuFoot; else $("menuFoot").remove();
  let rt = 0;
  addEventListener("resize", () => { clearTimeout(rt); rt = setTimeout(build, 150); });
  // เปลี่ยนภาษา: วาดรายการและแฟ้มใหม่ (แฟ้มที่เปิดอยู่ยังเปิดค้าง)
  addEventListener("langchange", () => { renderList(false); build(true); });
  return { show: build };
})();

Menu.show();
