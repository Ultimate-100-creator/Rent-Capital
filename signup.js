document.addEventListener('DOMContentLoaded', () => {
    const accountGrid = document.getElementById('account-type-grid');
    const nextButton = document.getElementById('next-btn'); // Using the more specific ID selector

    if (accountGrid && nextButton) {
        const cards = accountGrid.querySelectorAll('.account-card');
        let selectedAccountType = null; // Variable to store the user's selection

        // Add a click listener to each account type card
        cards.forEach(card => {
            card.addEventListener('click', () => {
                // 1. Remove the 'active' class from all other cards
                cards.forEach(c => c.classList.remove('active'));
                
                // 2. Add the 'active' class to the card that was just clicked
                card.classList.add('active');

                // 3. Store the selected account type from the card's data attribute
                selectedAccountType = card.dataset.accountType;

                // 4. Enable the 'Next' button so the user can proceed
                nextButton.disabled = false;
            });
        });

        // Add a click listener for the 'Next' button
        nextButton.addEventListener('click', () => {
            // Prevent the redirect if the button is somehow clicked while disabled
            if (nextButton.disabled) {
                return; 
            }

            // Check the stored account type and redirect the user to the correct page
            switch (selectedAccountType) {
                case 'tenant':
                    window.location.href = 'signup-tenant.html';
                    break;
                case 'landlord':
                    window.location.href = 'signup-landlord.html';
                    break;
                case 'manager':
                    // A placeholder for a future feature
                    alert('Property Manager signup is not yet available.');
                    break;
                default:
                    // This case should not be reachable since the button is disabled by default
                    alert('Please select an account type to continue.');
                    break;
            }
        });
    }
});