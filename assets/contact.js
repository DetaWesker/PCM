/* PHOR COFFEE: หน้าติดต่อ */
/* ติดต่อ */
$("channels").innerHTML = [
  [SITE.line, "chat", "LINE", "จองโต๊ะ / สอบถาม", true],
  [TEL, "phone", "โทรศัพท์", SITE.phoneDisplay],
  [SITE.email && "mailto:" + SITE.email, "mail", "อีเมล", SITE.email],
  [SITE.facebook, "fb", "Facebook", "PHOR COFFEE", true],
  [SITE.instagram, "ig", "Instagram", "PHOR COFFEE", true],
].filter(c => c[0]).map(([href, ic, label, value, ext]) =>
  `<li><a href="${esc(href)}"${ext ? ' target="_blank" rel="noopener"' : ""}><span class="ic">${icon(ic)}</span><span><small>${esc(label)}</small><b>${esc(value)}</b></span>${icon("chev", "i go")}</a></li>`).join("");
$("contactImg").innerHTML = photo(PHOTO.iced, "อเมริกาโน่เย็นหน้าร้าน", 640, 800);
