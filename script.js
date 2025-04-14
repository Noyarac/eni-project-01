window.onload = init;
function init() {
    loadNav();
}

function loadNav() {
    fetch(`./nav.htm`)
    .then(response => response.text())
    .then(data => {
        const nav = document.querySelector('nav');
        nav.innerHTML = data;
        const li = nav.querySelector('#nav-' + window.location.pathname.split('/').pop().split('.htm')[0]);

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