const pageName = window.location.pathname.split('/').pop().split('.htm')[0];

window.onload = init;
function init() {
    loadNav();
    const radios = document.querySelectorAll('[role="radiogroup"]');
    for (let i = 0; i < radios.length; i++) {
      new RadioGroup(radios[i]);
    }

    const themeValue = localStorage.getItem('theme');
    const displayValue = localStorage.getItem('display');
    if (themeValue) {
        const option = document.querySelector(`option[value=${themeValue}]`);
        if (option) option.setAttribute("selected", true);
        document.body.setAttribute('data-theme', themeValue)
    }
    if (displayValue) {
        const radio = document.querySelector(`[role='radio'][value=${displayValue}]`);
        if (radio) radio.click();
    }

    switch(pageName) {
      case 'index':
        fetch('./promo.json')
        .then(response => response.json())
        .then(data => {
          const tbody = document.querySelector('tbody');
          for (let apprenant of data.apprenants) {
            const tr = document.createElement('tr');
            tbody.append(tr);
            ['nom', 'prenom', 'ville'].forEach(titre => {
              const td = document.createElement('td');
              td.innerText = apprenant[titre];
              tr.append(td);
            });
            const td = document.createElement('td');
            td.innerHTML = '<a href="#">D&eacute;tails</a>';
            tr.append(td);
          }
        })
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
        rb.addEventListener('click', this.handleClick.bind(this));
        rb.addEventListener('focus', this.handleFocus.bind(this));
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
      currentItem.focus();
    }
  
    setCheckedToPreviousItem(currentItem) {
      var index;
  
      if (currentItem === this.firstRadioButton) {
        this.setChecked(this.lastRadioButton);
      } else {
        index = this.radioButtons.indexOf(currentItem);
        this.setChecked(this.radioButtons[index - 1]);
      }
    }
  
    setCheckedToNextItem(currentItem) {
      var index;
  
      if (currentItem === this.lastRadioButton) {
        this.setChecked(this.firstRadioButton);
      } else {
        index = this.radioButtons.indexOf(currentItem);
        this.setChecked(this.radioButtons[index + 1]);
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
    }
  
    handleBlur(event) {
      event.currentTarget.classList.remove('focus');
    }
  }


function loadNav() {
    fetch(`./nav.htm`)
    .then(response => response.text())
    .then(data => {
        const nav = document.querySelector('nav');
        nav.innerHTML = data;
        const li = nav.querySelector('#nav-' + pageName);

        nav.querySelector('nav button').addEventListener('click', toggleMenu)

        document.querySelectorAll('nav ul li').forEach(li => li.classList.remove("nav-active"));
        li.classList.add("nav-active");
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
    } else {
        span.innerText = 'menu';
        ul.style.display = 'none';
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