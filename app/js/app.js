/* Finders of Paths License v1.0
   See LICENSE file in the root of this repository for details.
   Unauthorized commercial use is prohibited. */

// ==========================================================
// Sidebar Collapse Toggle
// ==========================================================

document.getElementById('collapse-btn').addEventListener('click', () => {
    const sidebar = document.getElementById('sidebar');
    sidebar.classList.toggle('collapsed'); // Toggles CSS class to collapse/expand sidebar
});

// ==========================================================
// Page Loader
// Loads HTML content dynamically into the main view area
// Also handles conditional script injection
// ==========================================================

function loadPage(page) {
    fetch(`pages/${page}.html`)
        .then(response => response.text())
        .then(html => {
            document.getElementById('content').innerHTML = html;

            // Reset any previously flagged readiness states from other pages
            delete window.__scriptReady;

            // Conditional JS loader (used primarily for Gridstack on dashboard)
            if (page === 'dashboard') {
                const gridstackScript = document.createElement('script');
                gridstackScript.src = 'node_modules/gridstack/dist/gridstack-all.js';

                gridstackScript.onload = () => {
                    console.log('Gridstack loaded');
                    loadDashboardScript(); // Load page-specific logic
                };

                gridstackScript.onerror = () => {
                    console.error('Failed to load Gridstack!');
                };

                document.body.appendChild(gridstackScript);
            } else {
                loadDashboardScript(); // Skip Gridstack for non-dashboard pages
            }

            function loadDashboardScript() {
                const script = document.createElement('script');
                script.src = `js/components/${page}.js`;

                script.onload = () => {
                    if (typeof window.initializeDashboard === 'function') {
                        console.log('initializeDashboard is defined, calling it...');
                        window.initializeDashboard(); // Run setup logic for this page
                    }
                };

                script.onerror = () => {
                    console.error(`Could not load js/components/${page}.js`);
                };

                document.body.appendChild(script);

                // Catch cases where the script fails silently or doesn't set readiness
                setTimeout(() => {
                    if (!window.__scriptReady) {
                        console.error(`${page}.js loaded but did not signal readiness or ran into a silent failure`);
                    }
                }, 1500);
            }
        })
        .catch(() => {
            console.error(`Failed to load page: pages/${page}.html`);
            document.getElementById('content').innerHTML = '<p>Error loading page.</p>';
        });
}

// ==========================================================
// Modal Loader
// Loads HTML into modal and displays it
// ==========================================================

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

// ==========================================================
// Navigation Button Routing
// Attaches event handlers to sidebar nav buttons
// Determines whether to load modal or standard content
// ==========================================================

document.querySelectorAll('.nav-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        const label = btn.querySelector('.label').textContent.trim().toLowerCase();

        // Skip collapse button, already handled separately
        if (label === 'collapse') return;

        // Load modal pages for special sections like Settings/Help
        if (label === 'settings' || label === 'help') {
            loadModal(label);
        } else {
            // Load standard content pages, normalize label string to match filenames
            loadPage(label.replace(/ /g, '').replace('&', 'and'));
        }
    });
});

// ==========================================================
// Auto-load Dashboard on Initial Load
// ==========================================================

loadPage('dashboard');

// ==========================================================
// Modal Dismissal: Clicking outside closes the modal
// ==========================================================

document.getElementById('modal').addEventListener('click', function (e) {
    if (e.target === this) {
        this.style.display = "none";
    }
});
