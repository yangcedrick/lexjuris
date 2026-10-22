// Affiche les actualités écrites depuis l'espace d'édition (contenu/actualites.json).
// Sans article, ou si le fichier ne se charge pas (page ouverte depuis le disque), l'état vide reste affiché.
document.addEventListener("DOMContentLoaded", function () {
  var zone = document.getElementById("actus");
  if (!zone) return;

  function el(tag, cls, texte) {
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    if (texte) e.textContent = texte;
    return e;
  }
  function dateFr(iso) {
    var d = new Date(iso);
    return isNaN(d) ? "" : d.toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" });
  }
  // Les « caractères gras » copiés depuis Facebook (𝐔𝐧…) redeviennent des lettres normales,
  // lisibles par Google et par les lecteurs d'écran ; le site met déjà les titres en valeur.
  function propre(t) {
    t = String(t || "").trim();
    return t.normalize ? t.normalize("NFKC") : t;
  }
  function paragraphes(parent, texte) {
    propre(texte).split(/\n\s*\n/).forEach(function (p) {
      if (p.trim()) parent.appendChild(el("p", "", p.trim()));
    });
  }
  function resume(a) {
    if (a.resume) return propre(a.resume);
    var t = propre(a.corps).replace(/\s+/g, " ");
    return t.length > 180 ? t.slice(0, 180).replace(/\s+\S*$/, "") + "…" : t;
  }
  function image(a, cls) {
    if (!a.image) return null;
    var cadre = el("div", "photo-decalee paysage " + cls);
    var img = el("img");
    img.src = String(a.image).replace(/^\//, "");
    img.alt = "";
    img.loading = "lazy";
    cadre.appendChild(img);
    return cadre;
  }

  fetch("contenu/actualites.json", { cache: "no-store" })
    .then(function (r) { return r.json(); })
    .then(function (data) {
      var articles = (data && data.articles || []).filter(function (a) { return a.titre && a.publie !== false; });
      if (!articles.length) return;
      articles.sort(function (a, b) { return String(b.date).localeCompare(String(a.date)); });

      var id = new URLSearchParams(location.search).get("article");
      zone.textContent = "";

      if (id !== null && articles[+id]) {
        var a = articles[+id];
        var art = el("article", "actu-detail");
        var lien = el("a", "lien-fleche", "‹ Toutes les actualités");
        lien.href = "actualites.html";
        art.appendChild(lien);
        var t = el("time", "", dateFr(a.date)); t.dateTime = a.date;
        art.appendChild(el("p", "etiquette")).appendChild(t);
        art.appendChild(el("h1", "", propre(a.titre)));
        var illus = image(a, "actu-image");
        if (illus) art.appendChild(illus);
        var corps = el("div", "corps");
        paragraphes(corps, a.corps || a.resume);
        art.appendChild(corps);
        zone.appendChild(art);
        document.title = propre(a.titre) + " — LEX JURIS EXPERT & PARTNERS";
        return;
      }

      var liste = el("div", "liste-actus");
      articles.forEach(function (a, i) {
        var art = el("article", "actu");
        var illus = image(a, "actu-vignette");
        if (illus) art.appendChild(illus);
        var t = el("time", "", dateFr(a.date)); t.dateTime = a.date;
        art.appendChild(t);
        art.appendChild(el("h2", "", propre(a.titre)));
        art.appendChild(el("p", "", resume(a)));
        var lien = el("a", "lien-fleche", "Lire l'article ›");
        lien.href = "actualites.html?article=" + i;
        lien.style.marginTop = "12px";
        art.appendChild(lien);
        liste.appendChild(art);
      });
      zone.appendChild(liste);
    })
    .catch(function () { /* l'état vide reste affiché */ });
});
