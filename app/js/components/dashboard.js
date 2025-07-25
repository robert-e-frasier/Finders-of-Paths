/* Finders of Paths License v1.0
   See LICENSE file in the root of this repository for details.
   Unauthorized commercial use is prohibited. */

// Flag to indicate script is loaded and available (used by other systems if needed)
window.__scriptReady = true;

window.initializeDashboard = function () {
    try {
        // =========================================================
        // GridStack Initialization
        // =========================================================

        // Initialize GridStack with float mode (free positioning within grid)
        const grid = GridStack.init({ float: true });
        const gridElement = document.querySelector('.grid-stack');

        // Dynamically calculate cell size for responsive grid rendering
        const cellHeight = grid.getCellHeight();
        const columnCount = grid.opts.column || 12;
        const cellWidth = gridElement.clientWidth / columnCount;

        // Apply computed grid cell sizes via CSS custom properties
        gridElement.style.setProperty('--grid-cell-size-x', `${cellWidth}px`);
        gridElement.style.setProperty('--grid-cell-size-y', `${cellHeight}px`);
        gridElement.style.backgroundSize = `${cellWidth}px ${cellHeight}px`;

        // Toggle grid line visibility during drag and resize interactions
        grid.on('dragstart', () => gridElement.classList.add('grid-lines'));
        grid.on('dragstop', () => gridElement.classList.remove('grid-lines'));
        grid.on('resizestart', () => gridElement.classList.add('grid-lines'));

        // =========================================================
        // Load Default Widget Template (Widget Shell)
        // =========================================================

        // Fetch and inject the master widget HTML template into the grid
        fetch('../app/components/widgets/widget-display.html')
            .then(res => res.text())
            .then(html => {
                const temp = document.createElement('div');
                temp.innerHTML = html;
                const widget = temp.firstElementChild;
                gridElement.appendChild(widget);
                grid.makeWidget(widget); // Register with GridStack
                console.log('Widget loaded and added to grid');
            });

        // =========================================================
        // Dashboard Settings: Gear Icon + Outside Click Logic
        // =========================================================

        const settingsBtn = document.getElementById('dashboard-settings-gear');
        const settingsMenu = document.getElementById('dashboard-settings-menu');

        if (settingsBtn && settingsMenu) {
            // Toggle menu visibility and active gear icon state
            settingsBtn.addEventListener('click', (e) => {
                e.stopPropagation(); // Prevent click from triggering outside-close
                settingsMenu.classList.toggle('hidden');
                settingsBtn.classList.toggle('active');
            });

            // Automatically close settings menu when clicking outside
            document.addEventListener('click', (e) => {
                const isGear = settingsBtn.contains(e.target);
                const isInsideMenu = settingsMenu.contains(e.target);
                if (!isGear && !isInsideMenu && !settingsMenu.classList.contains('hidden')) {
                    settingsMenu.classList.add('hidden');
                    settingsBtn.classList.remove('active');
                }
            });
        }

        // =========================================================
        // Interactive Toggle Buttons
        // =========================================================

        // Toggle grid line visibility manually
        const gridToggle = document.getElementById('grid-toggle');
        gridToggle.addEventListener('click', () => {
            const isActive = gridToggle.getAttribute('aria-pressed') === 'true';
            const newState = !isActive;
            gridToggle.setAttribute('aria-pressed', String(newState));
            gridElement.classList.toggle('grid-lines', newState);
        });

        // Toggle snap-to-grid behavior
        const snapToggle = document.getElementById('snap-toggle');
        snapToggle.addEventListener('click', () => {
            const isActive = snapToggle.getAttribute('aria-pressed') === 'true';
            const newState = !isActive;
            snapToggle.setAttribute('aria-pressed', String(newState));
            grid.opts.disableOneColumnMode = !newState;
        });

        // Toggle edit lock: disables dragging/resizing for all widgets
        const lockBtn = document.getElementById('lock-toggle');
        lockBtn.addEventListener('click', () => {
            const isPressed = lockBtn.getAttribute('aria-pressed') === 'true';
            const newState = !isPressed;
            lockBtn.setAttribute('aria-pressed', String(newState));

            grid.setStatic(newState); // Global static mode on/off
        });

        // =========================================================
        // Layout Management Actions
        // =========================================================

        // Clear all widgets from the grid
        document.getElementById('reset-layout-btn').addEventListener('click', () => {
            grid.removeAll();
            console.log('Dashboard layout reset');
        });

        // Export current layout to JSON and trigger download
        document.getElementById('export-layout-btn').addEventListener('click', () => {
            const layout = grid.save();
            const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(layout));
            const dlAnchor = document.createElement('a');
            dlAnchor.setAttribute("href", dataStr);
            dlAnchor.setAttribute("download", "dashboard-layout.json");
            dlAnchor.click();
        });

        // Import layout from JSON file and load it into GridStack
        document.getElementById('import-layout-btn').addEventListener('click', () => {
            const input = document.createElement('input');
            input.type = 'file';
            input.accept = 'application/json';
            input.addEventListener('change', (event) => {
                const file = event.target.files[0];
                const reader = new FileReader();
                reader.onload = function (e) {
                    const importedLayout = JSON.parse(e.target.result);
                    grid.removeAll();
                    grid.load(importedLayout);
                };
                reader.readAsText(file);
            });
            input.click();
        });

        // =========================================================
        // Placeholder Buttons for Future Features
        // =========================================================

        document.getElementById('preset-dashboards-btn').addEventListener('click', () => {
            console.log('Open preset dashboards panel (to be implemented)');
        });

        document.getElementById('add-widget-btn').addEventListener('click', () => {
            console.log('Open add widget panel (to be implemented)');
        });

        document.getElementById('save-layout-btn').addEventListener('click', () => {
            console.log('Save current layout to presets (to be implemented)');
        });

        console.log('Gridstack initialized');
    } catch (e) {
        console.error('Error in initializeDashboard:', e);
    }
};

// Initialize dashboard once DOM is ready
window.addEventListener('DOMContentLoaded', () => {
    console.log("Script loaded");
    initializeDashboard();
});
