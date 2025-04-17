new MutationObserver((mutationList) => {
    if (mutationList.some(mutation => mutation.type === "childList")) updateDepth();
}).observe(document.body, {childList: true, subtree: true});
updateDepth();

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