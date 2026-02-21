document.addEventListener('DOMContentLoaded', () => {
    // Configuration
    const MAX_PASSENGERS = 20;
    let currentSelection = 2; // Default value

    // DOM Elements
    const triggerBtn = document.getElementById('pp-trigger-btn');
    const displayCount = document.getElementById('pp-selected-count');
    const modalOverlay = document.getElementById('pp-modal-overlay');
    const closeBtn = document.getElementById('pp-close-btn');
    const applyBtn = document.getElementById('pp-apply-btn');
    const list = document.getElementById('pp-list');

    // Generate List Items
    function renderList() {
        list.innerHTML = ''; // Clear list
        for (let i = 1; i <= MAX_PASSENGERS; i++) {
            const li = document.createElement('li');
            li.className = 'pp-item';
            if (i === currentSelection) {
                li.classList.add('pp-selected');
            }

            // Text logic
            const text = i + (i === 1 ? ' Passenger' : ' Passengers');

            li.innerHTML = `
                <span>${text}</span>
                <span class="pp-checkmark">✓</span>
            `;

            // Click Handler
            li.addEventListener('click', () => {
                selectItem(i);
            });

            list.appendChild(li);
        }
    }

    // Select Item Logic
    function selectItem(count) {
        currentSelection = count;
        renderList();
    }

    // Open Modal
    if (triggerBtn) {
        triggerBtn.addEventListener('click', () => {
            renderList(); // Ensure correct state
            modalOverlay.style.display = 'flex';
            // Small delay to allow display:flex to apply before adding opacity class for transition
            setTimeout(() => {
                modalOverlay.classList.add('pp-open');
            }, 10);

            // Scroll selected item into view
            setTimeout(() => {
                const selected = list.querySelector('.pp-selected');
                if (selected) {
                    selected.scrollIntoView({ block: 'center', behavior: 'smooth' });
                }
            }, 100);
        });
    }

    // Close Modal Function
    function closeModal() {
        modalOverlay.classList.remove('pp-open');
        setTimeout(() => {
            modalOverlay.style.display = 'none';
        }, 300); // Match CSS transition duration
    }

    // Update & Close
    if (applyBtn) {
        applyBtn.addEventListener('click', () => {
            if (displayCount) {
                displayCount.innerText = currentSelection;
            }
            closeModal();
        });
    }

    if (closeBtn) {
        closeBtn.addEventListener('click', closeModal);
    }

    // Close on backdrop click
    if (modalOverlay) {
        modalOverlay.addEventListener('click', (e) => {
            if (e.target === modalOverlay) {
                closeModal();
            }
        });
    }
});
