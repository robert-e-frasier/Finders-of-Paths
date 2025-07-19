/* Finders of Paths License v1.0
 See LICENSE file in the root of this repository for details.
 Unauthorized commercial use is prohibited. */

window.__scriptReady = true;

window.initializeDashboard = function () {
    try {
        const grid = GridStack.init({ float: true }); // initialize once
        const gridElement = document.querySelector('.grid-stack');

        // Set CSS variable for grid line spacing based on actual cell height
        const cellHeight = grid.getCellHeight(); // ← vertical
        const columnCount = grid.opts.column || 12;
        const cellWidth = gridElement.clientWidth / columnCount; // ← horizontal

        gridElement.style.setProperty('--grid-cell-size-x', `${cellWidth}px`);
        gridElement.style.setProperty('--grid-cell-size-y', `${cellHeight}px`);
        gridElement.style.backgroundSize = `${cellWidth}px ${cellHeight}px`;

        // Show/hide grid lines during drag
        grid.on('dragstart', () => {
            gridElement.classList.add('grid-lines');
        });

        grid.on('dragstop', () => {
            gridElement.classList.remove('grid-lines');
        });

        // How/hide grid lines during resizing
        grid.on('resizestart', () => {
            gridElement.classList.add('grid-lines');
        })

        grid.on('resizestart', () => {
            gridElement.classList.add('grid-lines')
        })

        // Load widget HTML and make it a GridStack widget
        fetch('../app/components/widgets/widget-display.html')
            .then(res => res.text())
            .then(html => {
                const temp = document.createElement('div');
                temp.innerHTML = html;
                const widget = temp.firstElementChild;
                gridElement.appendChild(widget);
                grid.makeWidget(widget);
                console.log('✅ Widget loaded and added to grid');
            });

        console.log('✅ Gridstack initialized');
    } catch (e) {
        console.error('❌ Error in initializeDashboard:', e);
    }
};

// Run initialization on DOM ready
window.addEventListener('DOMContentLoaded', () => {
    window.initializeDashboard();
});
