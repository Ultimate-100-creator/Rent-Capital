document.addEventListener('DOMContentLoaded', () => {

    // --- 1. State & Elements ---
    let currentStep = 1;
    const form = document.getElementById('landlord-signup-form');
    if (!form) return;

    // Navigation
    const backButton = document.querySelector('.btn-back');

    // Step Containers
    const steps = [
        document.getElementById('step-1'),
        document.getElementById('step-2'),
        document.getElementById('step-3')
    ];

    // Progress Bar
    const progressSteps = [
        document.getElementById('progress-step-1'),
        document.getElementById('progress-step-2'),
        document.getElementById('progress-step-3')
    ];
    const checkmarkSVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M9,20.42L2.79,14.21L5.62,11.38L9,14.77L18.88,4.88L21.71,7.71L9,20.42Z"/></svg>`;
    
    // Step 1 Elements
    const emailInput = document.getElementById('email');
    const emailContinueBtn = document.getElementById('btn-email-continue');

    // Step 2 Elements
    const detailsContinueBtn = document.getElementById('btn-details-continue');
    const phoneInput = document.getElementById('phone');
    let phoneInputInstance = null;
    
    // Step 3 Elements
    const passwordInput = document.getElementById('password');
    const confirmPasswordInput = document.getElementById('confirmPassword');
    const termsCheckbox = document.getElementById('terms');
    const finishBtn = document.getElementById('btn-finish');
    const passwordToggles = document.querySelectorAll('.password-toggle');

    // NEW: Modal Elements
    const successModal = document.getElementById('success-modal');
    const goToDashboardBtn = document.getElementById('btn-go-dashboard');


    // --- 2. Navigation Functions ---
    const goToStep = (stepNumber) => {
        currentStep = stepNumber;
        steps.forEach((step, index) => {
            step.classList.toggle('hidden', index + 1 !== currentStep);
        });
        if (backButton) backButton.classList.toggle('hidden', currentStep === 1);
        updateProgressBar();
    };

    const updateProgressBar = () => {
        progressSteps.forEach((stepEl, index) => {
            const stepIcon = stepEl.querySelector('.step-icon');
            stepEl.classList.remove('active', 'completed');
            stepIcon.innerHTML = '';
            
            if (index < currentStep - 1) {
                stepEl.classList.add('completed');
                stepIcon.innerHTML = checkmarkSVG;
            } else if (index === currentStep - 1) {
                stepEl.classList.add('active');
            }
        });
    };

    // --- 3. Validation Functions ---
    const validateStep1 = () => {
        emailContinueBtn.disabled = !emailInput.validity.valid;
    };

    const validateStep2 = () => {
        let allValid = true;
        steps[1].querySelectorAll('input[required]').forEach(input => {
            if (input.id !== 'phone' && !input.validity.valid) {
                allValid = false;
            }
        });
        if (phoneInputInstance && !phoneInputInstance.isValidNumber()) {
            allValid = false;
        }
        detailsContinueBtn.disabled = !allValid;
    };

    const validateStep3 = () => {
        const passwordsMatch = passwordInput.value === confirmPasswordInput.value && passwordInput.value !== '';
        const passwordValid = passwordInput.validity.valid;
        const termsAgreed = termsCheckbox.checked;
        finishBtn.disabled = !(passwordsMatch && passwordValid && termsAgreed);
    };

    // --- 4. Event Listeners ---
    if(backButton) {
        backButton.addEventListener('click', () => goToStep(currentStep - 1));
    }

    emailInput.addEventListener('input', validateStep1);
    emailContinueBtn.addEventListener('click', () => goToStep(2));

    steps[1].querySelectorAll('input[required]').forEach(input => input.addEventListener('input', validateStep2));
    detailsContinueBtn.addEventListener('click', () => goToStep(3));
    if (phoneInput) phoneInput.addEventListener('countrychange', validateStep2);
    
    [passwordInput, confirmPasswordInput, termsCheckbox].forEach(el => {
        el.addEventListener('input', validateStep3);
        el.addEventListener('change', validateStep3);
    });

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

    // UPDATED: Form submission logic
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        validateStep3();
        if (!finishBtn.disabled) {
            // In a real app, this is where you'd send data to the server
            const fullPhoneNumber = phoneInputInstance.getNumber();
            console.log('Account created! Full number:', fullPhoneNumber);

            // Show the success modal instead of an alert
            if(successModal) {
                successModal.classList.remove('hidden');
            }
        }
    });

    // NEW: Handle modal button click
    if (goToDashboardBtn) {
        goToDashboardBtn.addEventListener('click', () => {
            // Redirect to the dashboard page
            // Replace with your actual dashboard URL
            window.location.href = 'dashboard.html'; 
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
                  .catch(() => callback("us"));
            },
            utilsScript: "https://cdnjs.cloudflare.com/ajax/libs/intl-tel-input/17.0.19/js/utils.js",
        });
    }

    goToStep(1);
});