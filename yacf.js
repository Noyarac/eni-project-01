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


new MutationObserver(mutationList => {
    if (mutationList.some(mutation => mutation.type === "childList")) {
        updateDepth();
        updateNav();
    }
}).observe(document.body, {childList: true, subtree: true});
updateDepth();

function updateNav() {
    const pageName = window.location.pathname.split('/').pop().split('.htm')[0];
    document.querySelector('nav button').addEventListener('click', toggleMenu)
    document.querySelectorAll('nav ul li a').forEach(a => a.classList.remove("nav-active"));
    document.getElementById('nav-' + pageName).classList.add("nav-active");
    document.getElementById('nav-' + pageName).setAttribute("aria-current", "page");
}

let themeValue = localStorage.getItem('yacl-theme');
if (!themeValue) {
  const preferdTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? 'dark' : 'light';
  localStorage.setItem('yacl-theme', preferdTheme);
  themeValue = preferdTheme;
}
document.body.setAttribute('data-yacl-theme', themeValue);

const radios = document.querySelectorAll('[role="radiogroup"]');
for (let i = 0; i < radios.length; i++) {
  new RadioGroup(radios[i]);
}

function updateDepth() {
    switch (true) {
        case document.querySelector('h6') !== null:
            document.body.setAttribute('data-yacf-depth', 6);
            break;
        case document.querySelector('h5') !== null:
            document.body.setAttribute('data-yacf-depth', 5);
            break;
        case document.querySelector('h4') !== null:
            document.body.setAttribute('data-yacf-depth', 4);
            break;
        case document.querySelector('h3') !== null:
            document.body.setAttribute('data-yacf-depth', 3);
            break;
        case document.querySelector('h2') !== null:
            document.body.setAttribute('data-yacf-depth', 2);
            break;
        case document.querySelector('h1') !== null:
            document.body.setAttribute('data-yacf-depth', 1);
            break;
    }
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