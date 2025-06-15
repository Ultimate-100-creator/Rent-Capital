// signin.js (UPDATED FILE)

document.addEventListener('DOMContentLoaded', () => {

    // --- Privacy Policy Modal Elements ---
    const privacyModalTrigger = document.querySelector('[data-modal-target="privacy-policy-modal"]');
    const privacyModal = document.getElementById('privacy-policy-modal');
    
    // --- Download App Modal Elements ---
    const signInForm = document.querySelector('.signin-form');
    const downloadModal = document.getElementById('download-app-modal');

    // --- Logic for Privacy Policy Modal ---
    if (privacyModalTrigger && privacyModal) {
        const privacyModalCloseBtn = privacyModal.querySelector('.modal-close-btn');

        const openPrivacyModal = () => {
            privacyModal.classList.add('active');
            document.body.style.overflow = 'hidden';
        };
        const closePrivacyModal = () => {
            privacyModal.classList.remove('active');
            document.body.style.overflow = '';
        };

        privacyModalTrigger.addEventListener('click', openPrivacyModal);
        privacyModalCloseBtn.addEventListener('click', closePrivacyModal);
        privacyModal.addEventListener('click', (event) => {
            if (event.target === privacyModal) closeModal();
        });
    }

    // --- Logic for Download App Modal ---
    if (signInForm && downloadModal) {
        const downloadModalCloseBtn = downloadModal.querySelector('.modal-close-btn');

        const openDownloadModal = () => {
            downloadModal.classList.add('active');
            document.body.style.overflow = 'hidden';
        };
        const closeDownloadModal = () => {
            downloadModal.classList.remove('active');
            document.body.style.overflow = '';
        };

        // Trigger the modal when the main sign-in button is clicked
        signInForm.addEventListener('submit', (event) => {
            event.preventDefault(); // Prevent the form from actually submitting
            // You could add validation here if needed
            openDownloadModal();
        });

        downloadModalCloseBtn.addEventListener('click', closeDownloadModal);
        downloadModal.addEventListener('click', (event) => {
            if (event.target === downloadModal) closeDownloadModal();
        });
    }

    // --- Shared 'Escape' Key Logic for ALL Modals ---
    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') {
            // Close whichever modal is currently active
            const activeModal = document.querySelector('.modal-overlay.active');
            if (activeModal) {
                activeModal.classList.remove('active');
                document.body.style.overflow = '';
            }
        }
    });
});