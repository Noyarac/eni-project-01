const pageName = window.location.pathname.split('/').pop().split('.htm')[0];

window.onload = init;
async function init() {
  await loadNav();
  const radios = document.querySelectorAll('[role="radiogroup"]');
  for (let i = 0; i < radios.length; i++) {
    new RadioGroup(radios[i]);
  }

  let themeValue = localStorage.getItem('theme');
  let displayValue = localStorage.getItem('display');
  if (!themeValue) {
    const preferdTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? 'dark' : 'light';
    localStorage.setItem('theme', preferdTheme);
    themeValue = preferdTheme;
  }
  if (!displayValue) {
    localStorage.setItem('display', 'list');
    displayValue = 'list';
  }
  const option = document.querySelector(`option[value=${themeValue}]`);
  if (option) option.setAttribute("selected", true);
  document.body.setAttribute('data-theme', themeValue)
  const radio = document.querySelector(`[role='radio'][value=${displayValue}]`);
  if (radio) radio.click();

  document.getElementById('nav-' + pageName).setAttribute("aria-current", "page");

  switch(pageName) {
    case 'index':
      if (displayValue) {if (displayValue == "list") {generateTable()} else {generateCards()}};
      break;
    case 'carte':
      loadMap();
      break;
    case 'informations':
      loadInfos();
  }
}

class RadioGroup {
    constructor(groupNode) {
      this.groupNode = groupNode;
  
      this.radioButtons = [];
  
      this.firstRadioButton = null;
      this.lastRadioButton = null;
  
      var rbs = this.groupNode.querySelectorAll('[role=radio]');
  
      for (var i = 0; i < rbs.length; i++) {
        var rb = rbs[i];
  
        rb.tabIndex = -1;
        rb.setAttribute('aria-checked', 'false');
  
        rb.addEventListener('keydown', this.handleKeydown.bind(this));
        rb.addEventListener('focus', this.handleFocus.bind(this));
        rb.addEventListener('click', this.handleClick.bind(this));
        rb.addEventListener('blur', this.handleBlur.bind(this));
  
        this.radioButtons.push(rb);
  
        if (!this.firstRadioButton) {
          this.firstRadioButton = rb;
        }
        this.lastRadioButton = rb;
      }
      this.firstRadioButton.tabIndex = 0;
    }
  
    setChecked(currentItem) {
      for (var i = 0; i < this.radioButtons.length; i++) {
        var rb = this.radioButtons[i];
        rb.setAttribute('aria-checked', 'false');
        rb.tabIndex = -1;
      }
      currentItem.setAttribute('aria-checked', 'true');
      currentItem.tabIndex = 0;
      // currentItem.focus();
    }
  
    setCheckedToPreviousItem(currentItem) {
      var index;
  
      if (currentItem === this.firstRadioButton) {
        this.setChecked(this.lastRadioButton);
        this.lastRadioButton.focus();
      } else {
        index = this.radioButtons.indexOf(currentItem);
        this.setChecked(this.radioButtons[index - 1]);
        this.radioButtons[index - 1].focus();
      }
    }
  
    setCheckedToNextItem(currentItem) {
      var index;
  
      if (currentItem === this.lastRadioButton) {
        this.setChecked(this.firstRadioButton);
        this.firstRadioButton.focus();
      } else {
        index = this.radioButtons.indexOf(currentItem);
        this.setChecked(this.radioButtons[index + 1]);
        this.radioButtons[index + 1].focus();
      }
    }
  
    /* EVENT HANDLERS */
  
    handleKeydown(event) {
      var tgt = event.currentTarget,
        flag = false;
  
      switch (event.key) {
        case ' ':
          this.setChecked(tgt);
          flag = true;
          break;
  
        case 'Up':
        case 'ArrowUp':
        case 'Left':
        case 'ArrowLeft':
          this.setCheckedToPreviousItem(tgt);
          flag = true;
          break;
  
        case 'Down':
        case 'ArrowDown':
        case 'Right':
        case 'ArrowRight':
          this.setCheckedToNextItem(tgt);
          flag = true;
          break;
  
        default:
          break;
      }
  
      if (flag) {
        event.stopPropagation();
        event.preventDefault();
      }
    }
  
    handleClick(event) {
      this.setChecked(event.currentTarget);
    }
  
    handleFocus(event) {
      event.currentTarget.classList.add('focus');
      if (pageName == 'index') toggleDisplay(event);
      this.setChecked(event.currentTarget);
    }

  
    handleBlur(event) {
      event.currentTarget.classList.remove('focus');
    }
  }


async function loadNav() {
    return fetch(`./nav.htm`)
    .then(response => response.text())
    .then(data => {
        const nav = document.querySelector('nav');
        nav.innerHTML = data;

        nav.querySelector('nav button').addEventListener('click', toggleMenu)

        document.querySelectorAll('nav ul li a').forEach(a => a.classList.remove("nav-active"));
        const a = nav.querySelector('#nav-' + pageName);
        a.classList.add("nav-active");
        if (window.innerWidth < 800) toggleMenu();
    })
}

function toggleMenu() {
    let button = document.querySelector('nav button');
    let span = button.querySelector('span');
    let ul = document.querySelector('nav ul');

    if (span.innerText == 'menu') {
        span.innerText = 'close';
        ul.style.display = 'flex';
        ul.setAttribute('aria-hidden', false);
    } else {
        span.innerText = 'menu';
        ul.style.display = 'none';
        ul.setAttribute('aria-hidden', true);
    }
}
function saveDisplay() {
    const value = document.querySelector("[aria-checked='true']").getAttribute('value');
    localStorage.setItem('display', value);
}

function saveTheme() {
    const value =  document.querySelector('select').value;
    localStorage.setItem('theme', value);
    document.body.setAttribute('data-theme', value);
}

function savePreferences() {
    saveDisplay();
    saveTheme();
}

function generateTable() {
  const table = document.createElement('table');
  const thead = document.createElement('thead');
  const tr = document.createElement('tr');
  const tbody = document.createElement('tbody');
  table.append(thead);
  thead.append(tr);
  table.append(tbody);
  ['Nom', 'Prénom', 'Ville', 'Détails'].forEach(titre => {
    const th = document.createElement('th'); 
    th.setAttribute('scope', 'col');
    tr.append(th);
    th.innerText = titre;
  });
  fetch('./promo.json')
  .then(response => response.json())
  .then(data => {
    for (let apprenant of data.apprenants) {
      const tr = document.createElement('tr');
      tbody.append(tr);
      ['nom', 'prenom', 'ville'].forEach(titre => {
        const td = document.createElement('td');
        td.innerText = apprenant[titre];
        tr.append(td);
      });
      const td = document.createElement('td');
      const a = document.createElement('a');
      a.addEventListener('click', displayModal);
      a.innerText = 'Détails'
      a.id = 'delails-' + apprenant.id;
      a.setAttribute('href', '#');
      td.append(a);
      tr.append(td);
    }
  });
  const apprenants = document.getElementById('apprenants');
  apprenants.innerHTML = '';
  apprenants.append(table);
}

function generateCards() {
  const apprenants = document.getElementById('apprenants');
  apprenants.innerHTML = '';
  fetch('./promo.json')
  .then(response => response.json())
  .then(data => {
    for (let apprenant of data.apprenants) {
      const card = document.createElement('div');
      card.classList.add('card');
      const h4 = document.createElement('h4');
      h4.innerText = apprenant.prenom + ' ' + apprenant.nom;
      card.append(h4);
      const p = document.createElement('p');
      p.innerText = apprenant.ville;
      card.append(p);
      const a = document.createElement('a');
      a.id = 'delails-' + apprenant.id;
      a.setAttribute('href', '#');
      a.addEventListener('click', displayModal);
      a.style.display = "block";
      a.style.marginTop = "1.2rem";
      a.innerText = 'Détails';
      card.append(a);
      apprenants.append(card);
    }
  });
}

function toggleDisplay(event) {
  if (event.srcElement.getAttribute('value') == "list") {
    generateTable()
  } else {
    generateCards()
  }
}

function loadMap() {
  fetch('./promo.json')
  .then(response => response.json())
  .then(data => {
    function getAverage(axe) {
      return data.apprenants.map(apprenant => parseFloat(apprenant.coordonnees[axe])).reduce((total, current) => {total += current; return total}, 0)/data.apprenants.length;
    }
    let map = L.map('map').setView([getAverage('latitude'), getAverage('longitude')], 7);
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(map);
    data.apprenants.forEach(apprenant => {
      const marker = L.marker([parseFloat(apprenant.coordonnees.latitude), parseFloat(apprenant.coordonnees.longitude)]).addTo(map);
      marker.bindPopup(apprenant.prenom + ' ' + apprenant.nom);
    });
  });
}

async function displayModal(event) {
  const apprenant = await fetch('./promo.json')
    .then(response => response.json())
    .then(data => {
      return data.apprenants.filter(apprenant => apprenant.id == event.srcElement.id.split('delails-').pop()).pop();
    });
  ['nom', 'prenom', 'ville'].forEach(titre => document.getElementById('modal-' + titre).innerText = apprenant[titre])
  const img = document.querySelector('dialog img');
  img.addEventListener('error', () => img.setAttribute('src', './images/avatar.png'))
  img.setAttribute('src', './images/avatar-' +  (apprenant.prenom).toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '') + '.png');
  document.getElementById('anecdote').innerText = apprenant.anecdotes;
  document.querySelector('dialog').showModal();
}

function loadInfos() {
  fetch('./promo.json')
    .then(response => response.json())
    .then(data => {
      ['date-debut', 'date-fin', 'nom-promo'].forEach(titre => document.getElementById(titre).innerText = data[titre]);
      document.getElementById("description").innerHTML = data["description"];
      document.getElementById('quantite-apprenants').innerText = data.apprenants.length;
    });
}