/* PHOR COFFEE: ส่วนที่ทุกหน้าใช้ร่วมกัน */
/* =================================================================
   ส่วนแสดงผล (ปกติไม่ต้องแก้)
   ================================================================= */
const $ = id => document.getElementById(id);
const esc = s => String(s ?? "").replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const icon = (id, cls = "i") => `<svg class="${cls}" aria-hidden="true"><use href="#i-${id}"/></svg>`;
const TEL = "tel:+66" + SITE.phone.replace(/^0/, "");
const DAYS = ["อาทิตย์", "จันทร์", "อังคาร", "พุธ", "พฤหัสบดี", "ศุกร์", "เสาร์"];
const toMin = t => { const [h, m] = t.split(":").map(Number); return h * 60 + m; };
const bkkNow = () => new Date(new Date().toLocaleString("en-US", { timeZone: "Asia/Bangkok" }));
const sameEveryDay = SITE.hours.every(h => h && SITE.hours[0] && h[0] === SITE.hours[0][0] && h[1] === SITE.hours[0][1]);
const HOURS_TEXT = sameEveryDay ? `ทุกวัน ${SITE.hours[0][0]}–${SITE.hours[0][1]} น.` : "ดูเวลาเปิดในหน้าสถานที่ร้าน";

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
  $("status").querySelector(".txt").textContent = open ? `เปิดอยู่ ปิด ${h[1]} น.` : (h ? `ปิดอยู่ เปิด ${h[0]} น.` : "วันนี้ปิด");
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
  function apply(t, animate) {
    if (animate && !reduce.matches) {
      root.classList.add("theme-anim");
      clearTimeout(tid); tid = setTimeout(() => root.classList.remove("theme-anim"), 450);
    }
    root.setAttribute("data-theme", t);
    if (meta) meta.content = t === "dark" ? "#121A15" : "#F7F7F4";
    btn.setAttribute("aria-checked", String(t === "dark"));
    btn.title = t === "dark" ? "เปลี่ยนเป็นโหมดสว่าง" : "เปลี่ยนเป็นโหมดมืด";
  }
  apply(root.getAttribute("data-theme") === "dark" ? "dark" : "light", false);
  btn.addEventListener("click", () => {
    const t = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
    save(t); apply(t, true);
  });
  // ถ้ายังไม่เคยเลือกเอง แล้วเครื่องเปลี่ยนโหมด (เช่น มือถือเปลี่ยนเป็นมืดตอนค่ำ) เว็บเปลี่ยนตาม
  mq.addEventListener("change", e => { if (!saved()) apply(e.matches ? "dark" : "light", true); });
  return { apply };
})();

/* footer */
$("footHours").textContent = sameEveryDay ? "เปิด" + HOURS_TEXT : HOURS_TEXT;
