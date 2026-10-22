// Menu repliable sur téléphone, et année du pied de page.
document.addEventListener("DOMContentLoaded", function () {
  var bouton = document.querySelector(".bouton-menu");
  var nav = document.getElementById("nav");
  if (bouton && nav) {
    bouton.addEventListener("click", function () {
      var ouvert = nav.classList.toggle("ouvert");
      bouton.setAttribute("aria-expanded", ouvert ? "true" : "false");
    });
    nav.addEventListener("click", function (e) {
      if (e.target.closest("a")) { nav.classList.remove("ouvert"); bouton.setAttribute("aria-expanded", "false"); }
    });
  }
  document.querySelectorAll(".annee").forEach(function (el) { el.textContent = new Date().getFullYear(); });
});
