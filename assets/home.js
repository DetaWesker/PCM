/* PHOR COFFEE: หน้าข้อมูล */
/* ข้อมูล */
const hero = $("heroImg");
hero.src = src(PHOTO.front, 1600, 1000);
hero.srcset = `${src(PHOTO.front, 900, 1100)} 900w, ${src(PHOTO.front, 1600, 1000)} 1600w, ${src(PHOTO.front, 2400, 1500)} 2400w`;
hero.sizes = "100vw";
hero.onerror = () => hero.remove();
$("heroTitle").textContent = SITE.name;
$("aboutTitle").textContent = SITE.aboutTitle;
$("aboutText").textContent = SITE.about;
$("quick").innerHTML = [
  ["เวลาเปิด", esc(HOURS_TEXT)],
  ["โทร", `<a href="${TEL}">${esc(SITE.phoneDisplay)}</a>`],
  ["ที่จอดรถ", esc(SITE.parking)],
].map(([k, v]) => `<div><dt>${k}</dt><dd>${v}</dd></div>`).join("");
$("aboutImg").innerHTML = photo(PHOTO.bar, "เคาน์เตอร์บาร์กาแฟภายในร้าน", 720, 540);
$("gallery").innerHTML = [
  [PHOTO.seating, "โซนที่นั่งภายในร้าน"],
  [PHOTO.matcha, "มัทฉะลาเต้"],
  [PHOTO.brick, "มุมผนังอิฐในร้าน"],
  [PHOTO.signature, "เครื่องดื่มซิกเนเจอร์"],
  [PHOTO.inside, "กาแฟเย็นในโซนติดแอร์"],
].map(([u, a], i) => `<figure class="ph">${photo(u, a, i ? 400 : 800, i ? 400 : 800)}</figure>`).join("");
$("ratingNum").textContent = SITE.rating;
$("ratingStars").innerHTML = icon("star").repeat(5);
$("ratingStars").setAttribute("aria-label", `${SITE.rating} ดาว`);
$("ratingCount").textContent = `จาก ${SITE.ratingCount} รีวิวบน Google`;
$("quotes").innerHTML = SITE.quotes.map(q => `<li><blockquote>“${esc(q)}”</blockquote></li>`).join("");

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
