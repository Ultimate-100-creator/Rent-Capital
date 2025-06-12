/**
 * Functionality 4: Search Overlay
 * Manages the opening and closing of a full-screen search interface.
 */
function setupSearchOverlay() {
    const searchTriggerBtn = document.getElementById('search-trigger-btn');
    const searchOverlay = document.getElementById('search-overlay');
    const searchCloseBtn = document.getElementById('search-close-btn');
    const searchInput = document.getElementById('search-input');
    
    if (searchTriggerBtn && searchOverlay && searchCloseBtn && searchInput) {
        const openSearch = () => {
            searchOverlay.classList.add('active');
            document.body.style.overflow = 'hidden';
            setTimeout(() => searchInput.focus(), 300); 
        };
        const closeSearch = () => {
            searchOverlay.classList.remove('active');
            document.body.style.overflow = '';
        };
        searchTriggerBtn.addEventListener('click', openSearch);
        searchCloseBtn.addEventListener('click', closeSearch);
        document.addEventListener('keydown', e => {
            if (e.key === 'Escape' && searchOverlay.classList.contains('active')) {
                closeSearch();
            }
        });
    }
}