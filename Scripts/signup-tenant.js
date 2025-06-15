document.addEventListener('DOMContentLoaded', () => {

    // --- 1. State & Elements ---
    const form = document.getElementById('tenant-signup-form');
    if (!form) return; // Exit if the form isn't on the page

    // Input Fields
    const firstNameInput = document.getElementById('firstName');
    const lastNameInput = document.getElementById('lastName');
    const emailInput = document.getElementById('email');
    const phoneInput = document.getElementById('phone');
    const passwordInput = document.getElementById('password');
    const confirmPasswordInput = document.getElementById('confirmPassword');
    const termsCheckbox = document.getElementById('terms');
    
    // Buttons
    const createAccountBtn = document.getElementById('btn-create-account');
    const passwordToggles = document.querySelectorAll('.password-toggle');

    // Modals
    const successModal = document.getElementById('success-modal');
    const goToSignInBtn = document.getElementById('btn-go-dashboard'); // Note: Button ID is shared, but we'll point it to signin.html

    // Phone Input Instance
    let phoneInputInstance = null;

    // --- 2. Modal Handling (Privacy Policy) ---
    const privacyTriggers = document.querySelectorAll('[data-modal-target="privacy-policy-modal"]');
    const privacyModal = document.getElementById('privacy-policy-modal');
    if (privacyModal) {
        const privacyModalCloseBtn = privacyModal.querySelector('.modal-close-btn');

        const openPrivacyModal = () => {
            privacyModal.classList.remove('hidden');
            document.body.style.overflow = 'hidden';
        };

        const closePrivacyModal = () => {
            privacyModal.classList.add('hidden');
            document.body.style.overflow = '';
        };

        privacyTriggers.forEach(trigger => trigger.addEventListener('click', openPrivacyModal));
        if (privacyModalCloseBtn) privacyModalCloseBtn.addEventListener('click', closePrivacyModal);
        privacyModal.addEventListener('click', (event) => { if (event.target === privacyModal) closePrivacyModal(); });
        document.addEventListener('keydown', (event) => { if (event.key === 'Escape' && !privacyModal.classList.contains('hidden')) closePrivacyModal(); });
    }

    // --- 3. Validation Function ---
    const validateForm = () => {
        if (!form.checkValidity()) {
            createAccountBtn.disabled = true;
            return;
        }

        const isPhoneValid = phoneInputInstance && phoneInputInstance.isValidNumber();
        const passwordsMatch = passwordInput.value === confirmPasswordInput.value && passwordInput.value !== '';
        
        // Enable the button only if all conditions are met
        createAccountBtn.disabled = !(isPhoneValid && passwordsMatch);
    };


    // --- 4. Event Listeners ---

    // Add listeners to all inputs to validate on every change
    const allInputs = [firstNameInput, lastNameInput, emailInput, passwordInput, confirmPasswordInput, termsCheckbox, phoneInput];
    allInputs.forEach(input => {
        if(input) {
            input.addEventListener('input', validateForm);
            input.addEventListener('change', validateForm);
        }
    });
    
    // Specific listener for phone country changes
    if (phoneInput) {
        phoneInput.addEventListener('countrychange', validateForm);
    }
    
    // Password visibility toggle listeners
    passwordToggles.forEach(toggle => {
        toggle.addEventListener('click', () => {
            const input = toggle.previousElementSibling;
            const iconShow = toggle.querySelector('.icon-show');
            const iconHide = toggle.querySelector('.icon-hide');
            const isPassword = input.getAttribute('type') === 'password';
            
            input.setAttribute('type', isPassword ? 'text' : 'password');
            toggle.setAttribute('aria-label', isPassword ? 'Hide password' : 'Show password');
            iconShow.classList.toggle('hidden', isPassword);
            iconHide.classList.toggle('hidden', !isPassword);
        });
    });

    // Form submission listener
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        validateForm(); // Final check
        
        if (!createAccountBtn.disabled) {
            const fullPhoneNumber = phoneInputInstance.getNumber();
            console.log('Tenant Account creation submitted!');
            console.log('Email:', emailInput.value);
            console.log('Full Phone Number:', fullPhoneNumber);

            // Show the success modal
            if(successModal) {
                successModal.classList.remove('hidden');
                document.body.style.overflow = 'hidden';
            }
        }
    });

    // Success modal button listener
    if (goToSignInBtn) {
        goToSignInBtn.addEventListener('click', () => {
            // Redirect to the sign-in page for the tenant
            window.location.href = 'signin.html'; 
        });
    }

    // --- 5. Initialization ---
    if (phoneInput) {
        phoneInputInstance = window.intlTelInput(phoneInput, {
            initialCountry: "auto",
            geoIpLookup: function(callback) {
                fetch("https://ipapi.co/json")
                  .then(res => res.json())
                  .then(data => callback(data.country_code))
                  .catch(() => callback("us")); // Default to US on error
            },
            utilsScript: "https://cdnjs.cloudflare.com/ajax/libs/intl-tel-input/17.0.19/js/utils.js",
        });
    }
    
    // Initial validation check to set button state on page load
    validateForm();
});