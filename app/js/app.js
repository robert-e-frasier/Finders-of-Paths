// Finders of Paths License v1.0
// See LICENSE file in the root of this repository for details.
// Unauthorized commercial use is prohibited.

// Collapse logic
document.getElementById('collapse-btn').addEventListener('click', () => {
    const sidebar = document.getElementById('sidebar');
    sidebar.classList.toggle('collapsed');
});

// Load content into main area
function loadPage(page) {
    fetch(`pages/${page}.html`)
        .then(response => response.text())
        .then(html => {
            document.getElementById('content').innerHTML = html;
        })
        .catch(err => {
            document.getElementById('content').innerHTML = '<p>Error loading page.</p>';
        });
}

// Load content into modal
function loadModal(page) {
    fetch(`pages/${page}.html`)
        .then(response => response.text())
        .then(html => {
            const modal = document.getElementById('modal');
            document.getElementById('modal-content').innerHTML = html;
            modal.style.display = "block";
        })
        .catch(err => {
            document.getElementById('modal-content').innerHTML = '<p>Error loading modal.</p>';
            document.getElementById('modal').style.display = "block";
        });
}

// Attach events to buttons
document.querySelectorAll('.nav-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        const label = btn.querySelector('.label').textContent.trim().toLowerCase();
        if (label === 'collapse') return;

        if (label === 'settings' || label === 'help') {
            loadModal(label);
        } else {
            loadPage(label.replace(/ /g, '').replace('&', 'and'));
        }
    });
});

// Load Dashboard by default
loadPage('dashboard');

// Close modal when clicking outside
document.getElementById('modal').addEventListener('click', function (e) {
    if (e.target === this) {
        this.style.display = "none";
    }
});
