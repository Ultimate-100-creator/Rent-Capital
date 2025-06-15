/**
 * A helper function to limit how often another function can run.
 * This is used for the window resize event to improve performance by
 * preventing the resize logic from firing on every single pixel change.
 */
function debounce(func, wait = 250) {
    let timeout;
    return function(...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => {
            func.apply(this, args);
        }, wait);
    };
}


/**
 * Main function that runs after the HTML document has been fully loaded.
 * It initializes all the interactive components of the website.
 */
document.addEventListener('DOMContentLoaded', () => {
    setupMobileMenu();
    setupAccordion();
    setupScrollAnimations();
    setupSearchOverlay();
    setupTestimonialCarousel();
    setupChoiceButtons();
    setupModals();
    setupFeatureTabs(); // <-- ADD THIS NEW FUNCTION CALL
});


/**
 * Functionality 1: Mobile Header Toggle
 * Toggles an 'active' class on the main header to show/hide the mobile dropdown.
 */
function setupMobileMenu() {
    const menuBtn = document.getElementById('menu-btn');
    const siteHeader = document.getElementById('site-header');
    const openIcon = document.getElementById('menu-open-icon');
    const closeIcon = document.getElementById('menu-close-icon');

    if (menuBtn && siteHeader && openIcon && closeIcon) {
        menuBtn.addEventListener('click', () => {
            siteHeader.classList.toggle('mobile-menu-active');
            const isMenuActive = siteHeader.classList.contains('mobile-menu-active');
            openIcon.style.display = isMenuActive ? 'none' : 'block';
            closeIcon.style.display = isMenuActive ? 'block' : 'none';
        });
    }
}


/**
 * Functionality 2: FAQ Accordion
 * Allows only one FAQ item to be open at a time for a cleaner user experience.
 */
function setupAccordion() {
    const accordionItems = document.querySelectorAll('.accordion-item');
    if (accordionItems.length > 0) {
        accordionItems.forEach(item => {
            const header = item.querySelector('.accordion-header');
            if (header) {
                header.addEventListener('click', () => {
                    const currentlyActive = document.querySelector('.accordion-item.active');
                    if (currentlyActive && currentlyActive !== item) {
                        currentlyActive.classList.remove('active');
                    }
                    item.classList.toggle('active');
                });
            }
        });
    }
}


/**
 * Functionality 3: Scroll-triggered Fade-in Animation
 * Uses Intersection Observer for performance-friendly animations as sections enter the viewport.
 */
function setupScrollAnimations() {
    const sectionsToAnimate = document.querySelectorAll('.fade-in-section');
    if (sectionsToAnimate.length > 0) {
        const observerOptions = { root: null, rootMargin: '0px', threshold: 0.1 };
        const intersectionObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);
        sectionsToAnimate.forEach(section => intersectionObserver.observe(section));
    }
}


/**
 * Functionality 4: Search Overlay
 * Manages the opening and closing of a full-screen search interface.
 * Now triggers on any element with the .js-search-trigger class.
 */
function setupSearchOverlay() {
    const searchTriggers = document.querySelectorAll('.js-search-trigger');
    const searchOverlay = document.getElementById('search-overlay');
    const searchCloseBtn = document.getElementById('search-close-btn');
    const searchInput = document.getElementById('search-input');
    
    if (searchTriggers.length > 0 && searchOverlay && searchCloseBtn && searchInput) {
        
        const openSearch = (event) => {
            event.preventDefault(); 
            searchOverlay.classList.add('active');
            document.body.style.overflow = 'hidden';
            setTimeout(() => searchInput.focus(), 300); 
        };

        const closeSearch = () => {
            searchOverlay.classList.remove('active');
            document.body.style.overflow = '';
        };

        searchTriggers.forEach(trigger => {
            trigger.addEventListener('click', openSearch);
        });

        searchCloseBtn.addEventListener('click', closeSearch);
        
        document.addEventListener('keydown', e => {
            if (e.key === 'Escape' && searchOverlay.classList.contains('active')) {
                closeSearch();
            }
        });
    }
}


/**
 * Functionality 5: Testimonial Carousel
 * Handles button clicks and touch-swipe functionality for the responsive testimonial slider.
 */
function setupTestimonialCarousel() {
    const viewport = document.querySelector('.testimonial-viewport');
    const track = document.getElementById('testimonial-track');
    const prevBtn = document.getElementById('testimonial-prev');
    const nextBtn = document.getElementById('testimonial-next');
    
    if (!track || !viewport || !prevBtn || !nextBtn) return;

    let currentIndex = 0;
    const cards = Array.from(track.children);
    let isDragging = false, startPos = 0, currentTranslate = 0, prevTranslate = 0;

    const getVisibleCardsCount = () => {
        if (window.innerWidth >= 1024) return 3;
        if (window.innerWidth >= 768) return 2;
        return 1;
    };

    const goToSlide = (slideIndex) => {
        const visibleCards = getVisibleCardsCount();
        currentIndex = Math.max(0, Math.min(slideIndex, cards.length - visibleCards));
        const cardWidth = cards[0].offsetWidth;
        const gap = parseInt(window.getComputedStyle(track).gap);
        const moveDistance = (cardWidth + gap) * currentIndex;
        track.style.transform = `translateX(-${moveDistance}px)`;
        prevTranslate = -moveDistance;
        prevBtn.disabled = currentIndex === 0;
        nextBtn.disabled = currentIndex >= cards.length - visibleCards;
    };
    
    nextBtn.addEventListener('click', () => goToSlide(currentIndex + 1));
    prevBtn.addEventListener('click', () => goToSlide(currentIndex - 1));
    window.addEventListener('resize', debounce(() => goToSlide(currentIndex)));

    viewport.addEventListener('touchstart', touchStart, { passive: true });
    viewport.addEventListener('touchmove', touchMove, { passive: true });
    viewport.addEventListener('touchend', touchEnd);

    function touchStart(event) {
        isDragging = true;
        startPos = event.touches[0].clientX;
        track.style.transition = 'none';
    }

    function touchMove(event) {
        if (!isDragging) return;
        const currentPos = event.touches[0].clientX;
        currentTranslate = prevTranslate + currentPos - startPos;
        track.style.transform = `translateX(${currentTranslate}px)`;
    }

    function touchEnd() {
        if (!isDragging) return;
        isDragging = false;
        const movedBy = currentTranslate - prevTranslate;
        track.style.transition = 'transform 0.5s ease-in-out';
        if (movedBy < -50) goToSlide(currentIndex + 1);
        else if (movedBy > 50) goToSlide(currentIndex - 1);
        else goToSlide(currentIndex);
    }
    
    if (cards.length > 0) goToSlide(0);
}


/**
 * Functionality 6: Interactive Choice Buttons
 * Handles the active state for a group of buttons where only one can be selected.
 */
function setupChoiceButtons() {
    const buttonContainer = document.getElementById('unit-choice-buttons');
    if (!buttonContainer) return;

    const buttons = buttonContainer.querySelectorAll('.choice-btn');
    
    buttons.forEach(button => {
        button.addEventListener('click', () => {
            buttons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
        });
    });
}


/**
 * Functionality 7: Modal Pop-ups
 * Handles opening and closing modals based on data attributes.
 */
function setupModals() {
    const modalTriggers = document.querySelectorAll('[data-modal-target]');
    const closeButtons = document.querySelectorAll('.modal-close-btn');
    const modalOverlays = document.querySelectorAll('.modal-overlay');

    const openModal = (modalId) => {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.add('active');
            document.body.style.overflow = 'hidden';
        }
    };

    const closeModal = (modal) => {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    };

    modalTriggers.forEach(trigger => {
        trigger.addEventListener('click', () => {
            const modalId = trigger.getAttribute('data-modal-target');
            openModal(modalId);
        });
    });

    closeButtons.forEach(button => {
        button.addEventListener('click', () => {
            const modal = button.closest('.modal-overlay');
            if (modal) {
                closeModal(modal);
            }
        });
    });

    modalOverlays.forEach(overlay => {
        overlay.addEventListener('click', (event) => {
            if (event.target === overlay) {
                closeModal(overlay);
            }
        });
    });

    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') {
            const activeModal = document.querySelector('.modal-overlay.active');
            if (activeModal) {
                closeModal(activeModal);
            }
        }
    });
}

/**
 * Functionality 8: Feature Page Tabs
 * Handles the logic for switching between feature tabs.
 */
function setupFeatureTabs() {
    const tabContainer = document.querySelector('.feature-tabs-nav');
    if (!tabContainer) return;

    const tabButtons = tabContainer.querySelectorAll('.feature-tab-btn');
    const tabPanes = document.querySelectorAll('.feature-tab-pane');

    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Deactivate all buttons and panes first
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabPanes.forEach(pane => pane.classList.remove('active'));

            // Activate the clicked button
            button.classList.add('active');

            // Activate the corresponding content pane
            const targetPaneId = button.dataset.tab;
            const targetPane = document.getElementById(targetPaneId);
            if (targetPane) {
                targetPane.classList.add('active');
            }
        });
    });
}