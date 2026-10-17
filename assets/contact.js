/* PHOR COFFEE: หน้าติดต่อ */
function renderContact() {
  $("channels").innerHTML = [
    [SITE.line, "chat", "LINE", t("contact.line"), true],
    [TEL, "phone", t("contact.phone"), SITE.phoneDisplay],
    [SITE.email && "mailto:" + SITE.email, "mail", t("contact.email"), SITE.email],
    [SITE.facebook, "fb", "Facebook", "PHOR COFFEE", true],
    [SITE.instagram, "ig", "Instagram", "PHOR COFFEE", true],
  ].filter(c => c[0]).map(([href, ic, label, value, ext]) =>
    `<li><a href="${esc(href)}"${ext ? ' target="_blank" rel="noopener"' : ""}><span class="ic">${icon(ic)}</span><span><small>${esc(label)}</small><b>${esc(value)}</b></span>${icon("chev", "i go")}</a></li>`).join("");
  const img = $("contactImg").querySelector("img"); if (img) img.alt = t("contact.imgAlt");
}
$("contactImg").innerHTML = photoFit(PHOTO.latteCrumble, t("contact.imgAlt"), 640, "50% 45%");
renderContact();
addEventListener("langchange", renderContact);
