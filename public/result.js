//message
function showMessage(msg, duration = 2000) {
    let box = document.createElement('div');
    box.className = 'message-box';
    box.textContent = msg;
    document.body.appendChild(box);

    requestAnimationFrame(() => box.classList.add('show'));

    setTimeout(() => {
        box.classList.remove('show');
        setTimeout(() => document.body.removeChild(box), 400);
    }, duration);
}

//getting the shortLink from the url
const params = new URLSearchParams(window.location.search);
const shortLink = params.get("link");

if (!shortLink) {
    document.body.innerHTML = "No link found!";
} else {
    const shortLinkInput = document.getElementById("shortLink");
    shortLinkInput.value = shortLink;

    const copyBtn = document.getElementById("copyBtn");
    copyBtn.addEventListener("click", function () {
        navigator.clipboard.writeText(shortLink)
            .then(() => showMessage("Copied!"))
            .catch(() => showMessage("Copy failed!"));
    });
}

//scrolling animation for sections
const sections = document.querySelectorAll(".section");

function revealSections() {
    sections.forEach(section => {
        const sectionTop = section.getBoundingClientRect().top;
        const trigger = window.innerHeight * 0.85;
        if (sectionTop < trigger) {
            section.classList.add("show");
        }
    });
}

window.addEventListener("scroll", revealSections);
window.addEventListener("load", revealSections);