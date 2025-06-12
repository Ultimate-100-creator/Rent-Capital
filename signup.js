document.addEventListener('DOMContentLoaded', () => {
    const accountGrid = document.getElementById('account-type-grid');
    const nextButton = document.querySelector('.btn-primary'); // Targets the button correctly

    if (accountGrid && nextButton) {
        const cards = accountGrid.querySelectorAll('.account-card');

        cards.forEach(card => {
            card.addEventListener('click', () => {
                // 1. Remove 'active' from all other cards
                cards.forEach(c => c.classList.remove('active'));
                
                // 2. Add 'active' to the one that was clicked
                card.classList.add('active');

                // 3. Remove the 'disabled' attribute from the button
                nextButton.disabled = false;
            });
        });
    }
});