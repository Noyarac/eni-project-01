const pageName = window.location.pathname.split('/').pop().split('.htm')[0];

window.onload = async () => {
  await loadNav();
  if (!localStorage.getItem('display')) localStorage.setItem('display', 'list');

  switch(pageName) {
    case 'index':
      let displayValue = localStorage.getItem('display');
      document.querySelector(`[role='radio'][value=${displayValue}]`).click();
      if (displayValue == "list") {generateTable()} else {generateCards()};
      break;
    case 'preferences':
      document.querySelector(`option[value=${localStorage.getItem('yacl-theme')}]`).setAttribute("selected", true);
      document.querySelector(`div[value=${localStorage.getItem('display')}]`).click();
      break;
    case 'carte':
      loadMap();
      break;
    case 'informations':
      loadInfos();
  }
}


function loadNav() {
    return fetch(`./nav.htm`)
    .then(response => response.text())
    .then(data => {
        const nav = document.querySelector('nav');
        nav.innerHTML = data;
    })
}

function saveDisplay() {
    localStorage.setItem('display', document.querySelector("[aria-checked='true']").getAttribute('value'));
}

function saveTheme() {
    const value =  document.querySelector('select').value;
    localStorage.setItem('yacl-theme', value);
    document.body.setAttribute('data-yacl-theme', value);
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
    let map = L.map('map');
    const bounds = L.latLngBounds();
    data.apprenants.forEach(apprenant => {
      const latLng = [parseFloat(apprenant.coordonnees.latitude), parseFloat(apprenant.coordonnees.longitude)];
      L.marker(latLng).addTo(map).bindPopup(apprenant.prenom + ' ' + apprenant.nom);
      bounds.extend(latLng);
    });
    map.fitBounds(bounds);
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(map);
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