window.onload = init;
function init() {
    document.querySelectorAll('nav ul li').forEach(li => li.addEventListener('click', loadPage));
    document.getElementById('nav-accueil').click();
    document.querySelector('nav button').addEventListener('click', toggleMenu);
}

function loadPage(event) {
    fetch(`./${event.currentTarget.id.split('nav-').pop()}.htm`)
    .then(response => response.text())
    .then(data => {
        let li = event.target.tagName == 'A' ? event.target.parentElement : event.target;
        document.querySelector('main').innerHTML = data;
        document.title = "PromoENI - " + document.querySelector('h2').innerText.split(' ').shift();
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