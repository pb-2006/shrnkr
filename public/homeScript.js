document.addEventListener('DOMContentLoaded', () => {

    const shortenBtn = document.getElementById('shortenBtn');  
    const inputField = document.getElementById('urlInput');    

    //message
    function showMessage(msg, duration = 2000) {
        const box = document.createElement('div');
        box.className = 'message-box';
        box.textContent = msg;
        document.body.appendChild(box);

        requestAnimationFrame(() => box.classList.add('show'));

        setTimeout(() => {
            box.classList.remove('show');
            setTimeout(() => document.body.removeChild(box), 400);
        }, duration);
    }

    //url shortening function
    const handleShorten = async () => {
        const inputURL = inputField.value.trim();

        if (!inputURL || !inputURL.startsWith('http')) {
            showMessage('Please enter a valid URL (http/https)');
            return;
        }

        try {
            const response = await fetch('/shorten', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ url: inputURL })
            });

            const data = await response.json();

            if (data.error) {
                showMessage(data.error);
                return;
            }

            window.location.href = `/result.html?link=${encodeURIComponent(data.shortLink)}`;

        } catch (err) {
            showMessage('Server error. Please try again.');
            console.error(err);
        }
    };

    shortenBtn.addEventListener('click', handleShorten);
    inputField.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleShorten();
        }
    });

}); 

//smooth scrolling for navigation links
document.querySelectorAll('.nav-right a').forEach(link => {
    link.addEventListener('click', e => {
        e.preventDefault();
        const targetId = link.getAttribute('href').substring(1); // Remove #
        const targetSection = document.getElementById(targetId);
        if (targetSection) {
            targetSection.scrollIntoView({ behavior: 'smooth' });
        }
    });
});

//scrolling animation for sections
const sections = document.querySelectorAll(".section");

function revealSections() {
    sections.forEach(section => {
        const top = section.getBoundingClientRect().top;
        if (top < window.innerHeight * 0.85) { 
            section.classList.add("show");
        }
    });
}

window.addEventListener("scroll", revealSections);
window.addEventListener("load", revealSections);