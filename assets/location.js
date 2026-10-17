/* PHOR COFFEE: หน้าสถานที่ร้าน */
/* สถานที่ร้าน */
const LL = `${SITE.lat},${SITE.lng}`;
$("dirBtn").href = `https://www.google.com/maps/dir/?api=1&destination=${LL}`;
const today = bkkNow().getDay();
let mapLang = "";
function renderLocation() {
  $("addr").textContent = L(SITE, "address");
  $("parking").textContent = L(SITE, "parking");
  if (mapLang !== LANG) { mapLang = LANG; $("mapFrame").src = `https://maps.google.com/maps?q=${LL}&z=17&hl=${LANG}&output=embed`; }
  // เปิดเวลาเดียวกันทุกวัน = แสดงบรรทัดเดียว  ถ้าแต่ละวันไม่เหมือนกันจึงแสดงเป็นตาราง
  $("hoursBox").innerHTML = sameEveryDay ? esc(hoursText()) : `<table class="hours">${[1, 2, 3, 4, 5, 6, 0].map(d => {
    const h = SITE.hours[d];
    return `<tr${d === today ? ' class="today"' : ""}><td>${DAY_NAMES[LANG][d]}</td><td>${h ? `${h[0]}–${h[1]}` : esc(t("hours.closed"))}</td></tr>`;
  }).join("")}</table>`;
}
renderLocation();
addEventListener("langchange", renderLocation);
let copyT = 0;
$("copyAddr").addEventListener("click", e => {
  const label = e.currentTarget.querySelector("span");
  const done = key => { label.textContent = t(key); clearTimeout(copyT); copyT = setTimeout(() => label.textContent = t("loc.copy"), 1800); };
  const text = L(SITE, "address");
  if (navigator.clipboard) navigator.clipboard.writeText(text).then(() => done("loc.copied"), () => done("loc.copyFail"));
  else done("loc.copyFail");
});
