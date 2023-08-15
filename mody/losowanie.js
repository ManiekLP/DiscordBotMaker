module.exports = {
  name: "Losuj Opcję na Podstawie Procentów",
  section: "Inne",
  author: "maniek_0",
  version: "1.0",

  subtitle(data) {
    return `Losuj opcję z ${data.options.length} możliwych`;
  },

  fields: ["options", "chances", "tempVar"],

  html(isEvent, data) {
    return `
<div>
  <p>
    Wybierz opcje, które mają być losowane:<br>
    <textarea id="options" rows="3" placeholder="Wpisz opcje oddzielone przecinkami">${data.options}</textarea>
  </p>
  <p>
    Podaj procenty odpowiadające każdej opcji (oddzielone przecinkami):<br>
    <textarea id="chances" rows="3" placeholder="Podaj procenty oddzielone przecinkami">${data.chances}</textarea>
  </p>
  <p>
    Wynik losowania zapisz do tempVar o nazwie:<br>
    <input id="tempVar" class="round" type="text" placeholder="tempVar Name" value="${data.tempVar || ""}">
  </p>
  <p>
    <b style="color: red;">Autor: </b> <b style="color: blue;">@maniek_0</b></p>
  </p>
</div>`;
  },

  action(cache) {
    const data = cache.actions[cache.index];
    const options = this.evalMessage(data.options, cache).split(",");
    const chances = this.evalMessage(data.chances, cache).split(",").map(Number);

    if (options.length !== chances.length) {
      console.error("Błąd w akcji 'Losuj Opcję na Podstawie Procentów': Ilość opcji musi być równa ilości procentów.");
      this.callNextAction(cache);
      return;
    }

    let totalChances = chances.reduce((acc, chance) => acc + chance, 0);
    if (totalChances <= 0) {
      console.error("Błąd w akcji 'Losuj Opcję na Podstawie Procentów': Suma procentów musi być większa od zera.");
      this.callNextAction(cache);
      return;
    }

    let randomValue = Math.random() * totalChances;
    let cumulativeChances = 0;
    let result = null;

    for (let i = 0; i < chances.length; i++) {
      cumulativeChances += chances[i];
      if (randomValue < cumulativeChances) {
        result = options[i].trim();
        break;
      }
    }

    if (result !== null) {
      const tempVar = this.evalMessage(data.tempVar, cache);
      this.storeValue(result, 1, tempVar, cache);
    }

    this.callNextAction(cache);
  },

  mod() {},
};