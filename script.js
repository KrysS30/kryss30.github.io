let sante = 100;

function version(douce, bizarre, inquiet) {
  if (sante > 60) return douce;
  if (sante >= 30) return bizarre;
  return inquiet;
}

function parler(texte) {
  document.getElementById("narrateur").textContent = "Narrateur : " + texte;
}

function majJauge() {
  document.getElementById("jauge").textContent = "Santé mentale : " + sante;
}

function afficher(description, choix) {
  document.getElementById("scene").textContent = description;
  const zone = document.getElementById("choix");
  zone.innerHTML = "";
  for (const c of choix) {
    const b = document.createElement("button");
    b.textContent = c.texte;
    b.onclick = c.action;
    zone.appendChild(b);
  }
  majJauge();
}

function reaction(variation, douce, bizarre, inquiet, suite) {
  sante += variation;
  parler(version(douce, bizarre, inquiet));
  afficher("", [{ texte: "Continuer", action: suite }]);
}

function intro() {
  parler("Bonjour toi ! On va jouer à cache-cache. Noé s'est caché, et toi, tu vas le trouver.");
  afficher("", [{ texte: "Commencer", action: scene1 }]);
}

function scene1() {
  afficher("Un camion de jouet cassé, un lit vide, un téléphone par terre.", [
    { texte: "Ramasser le jouet", action: () => reaction(-10,
        "Oh, il est un peu abîmé !",
        "Il était déjà abîmé...",
        "Il était déjà cassé quand tu es parti.", scene2) },
    { texte: "Regarder sous le lit", action: () => reaction(-15,
        "Personne, tant pis !",
        "Personne... Pourquoi tu cherches là ?",
        "Pourquoi tu cherches là ? Tu sais bien qu'il n'est pas là.", scene2) },
    { texte: "Appeler « Noé ! »", action: () => reaction(-20,
        "Il fait semblant de ne pas t'entendre !",
        "Il n'a pas l'air de répondre...",
        "Il ne répond plus. C'est normal.", scene2) }
  ]);
}

function scene2() {
  parler("À suivre...");
  afficher("Le jardin (scène 2 à écrire).", []);
}

intro();