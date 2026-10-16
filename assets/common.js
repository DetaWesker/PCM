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

/* footer */
$("footHours").textContent = sameEveryDay ? "เปิด" + HOURS_TEXT : HOURS_TEXT;
