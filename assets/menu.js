/* PHOR COFFEE: หน้าเมนู */
/* =================================================================
   เมนู: แฟ้มกระจก (ดัดแปลงจากคอมโพเนนต์ Glass Folder Cards ให้เป็น JavaScript ธรรมดา)
   ชั้นหลังคือรูปในแฟ้ม ตรงกลางคือแผ่นเมนู ชั้นหน้าคือกระจกขุ่นที่เบลอทุกอย่างข้างหลัง
   ปกติ: ปิดอยู่ เห็นขอบแผ่นเมนูนิดเดียว | ชี้/โฟกัส: กระจกเอนออก แผ่นเมนูยกขึ้น
   กด/Enter/Space: กระจกพับลง แผ่นเมนูกางออก แต่ละแผ่นกดได้ | Esc หรือกดข้างนอก: ปิด
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
  // รูปจาก Google แบบไม่ตัด แล้วให้ CSS ตัดตามจุดโฟกัส
  const fit = (u, w) => `${u}=w${w}-h${w * 2}-k-no`;
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
      return `<div role="listitem" class="gf-sheet-slot"><button type="button" class="gf-sheet${it.img ? " gf-sheet--art" : ""}" style="${style}" data-item="${esc(it.name)}" aria-label="${esc(it.name)} ${esc(it.price)} บาท">${body}<span class="gf-sheet-head"><span class="gf-sheet-name">${esc(it.name)}</span><span class="gf-sheet-meta">${esc(it.price)} บาท</span></span></button></div>`;
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
            <div class="gf-label"><span class="gf-title">${esc(group.group)}</span><span class="gf-meta">${count} เมนู</span></div>
          </div>
          <div class="gf-files" role="list" aria-label="เมนูในหมวด${esc(group.group)}">${sheets}</div>
        </div>
      </div>`;

    const hit = root.querySelector(".gf-hit"), files = root.querySelector(".gf-files");
    root.querySelectorAll("img").forEach(loaded);

    const isOpen = () => root.hasAttribute("data-open");
    const sync = () => {
      const o = isOpen();
      hit.setAttribute("aria-expanded", String(o));
      hit.setAttribute("aria-label", `${o ? "ปิด" : "เปิด"}แฟ้ม${group.group} ${count} เมนู`);
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
      if (b) onSelect?.(group, b.dataset.item);
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

    // Esc หรือกดข้างนอก ปิดแฟ้ม
    const onKey = e => { if (e.key === "Escape" && isOpen()) { setOpen(false); hit.focus(); } };
    const onDown = e => { if (isOpen() && !root.contains(e.target)) setOpen(false); };
    document.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onDown);

    // ประกอบตัวเองครั้งแรกที่เลื่อนมาเห็น
    let io = null, t = 0;
    if (appear) {
      if (typeof IntersectionObserver === "undefined") root.dataset.entered = "";
      else {
        io = new IntersectionObserver(es => {
          if (!es.some(x => x.isIntersecting)) return;
          io.disconnect();
          t = setTimeout(() => { root.dataset.entered = ""; }, appearDelay);
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
        io?.disconnect(); clearTimeout(t); cancelAnimationFrame(raf);
        root.remove();
      },
    };
  }
  return { create };
})();

const Menu = (() => {
  let folders = [], activeId = SITE.menu[0].id, openId = null, builtFor = 0, entered = false;
  const host = $("folders");

  function renderList(animate) {
    const g = SITE.menu.find(m => m.id === activeId);
    $("menuListTitle").textContent = g.group;
    $("menuListCount").textContent = `${g.items.length} เมนู`;
    const ul = $("menuListItems");
    ul.innerHTML = g.items.map(it => `
      <li class="menu-item" data-item="${esc(it.name)}">
        <span class="name">${esc(it.name)}${it.desc ? `<span class="desc">${esc(it.desc)}</span>` : ""}</span>
        <span class="leader" aria-hidden="true"></span>
        <span class="price">${esc(it.price)}</span>
      </li>`).join("");
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

  function build() {
    const w = folderWidth();
    if (!w || w === builtFor) return;
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
      onSelect: (grp, name) => {
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
  if (SITE.menuFoot) $("menuFoot").textContent = SITE.menuFoot; else $("menuFoot").remove();
  let rt = 0;
  addEventListener("resize", () => { clearTimeout(rt); rt = setTimeout(build, 150); });
  return { show: build };
})();

Menu.show();
