/* PHOR COFFEE: หน้าสถานที่ร้าน */
/* สถานที่ร้าน */
const LL = `${SITE.lat},${SITE.lng}`;
$("addr").textContent = SITE.address;
$("parking").textContent = SITE.parking;
$("mapFrame").src = `https://maps.google.com/maps?q=${LL}&z=17&hl=th&output=embed`;
$("dirBtn").href = `https://www.google.com/maps/dir/?api=1&destination=${LL}`;
const today = bkkNow().getDay();
// เปิดเวลาเดียวกันทุกวัน = แสดงบรรทัดเดียว  ถ้าแต่ละวันไม่เหมือนกันจึงแสดงเป็นตาราง
$("hoursBox").innerHTML = sameEveryDay ? esc(HOURS_TEXT) : `<table class="hours">${[1, 2, 3, 4, 5, 6, 0].map(d => {
  const h = SITE.hours[d];
  return `<tr${d === today ? ' class="today"' : ""}><td>${DAYS[d]}</td><td>${h ? `${h[0]}–${h[1]}` : "ปิด"}</td></tr>`;
}).join("")}</table>`;
$("copyAddr").addEventListener("click", e => {
  const label = e.currentTarget.querySelector("span"), old = label.textContent;
  const done = t => { label.textContent = t; setTimeout(() => label.textContent = old, 1800); };
  if (navigator.clipboard) navigator.clipboard.writeText(SITE.address).then(() => done("คัดลอกแล้ว"), () => done("คัดลอกไม่สำเร็จ"));
  else done("คัดลอกไม่สำเร็จ");
});
