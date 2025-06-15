document.addEventListener('DOMContentLoaded', () => {

    // --- 1. State Management ---
    let currentStep = 1;

    // --- 2. DOM Element Selection ---
    // Step Containers
    const stepLocation = document.getElementById('step-location');
    const stepRentalType = document.getElementById('step-rental-type');
    const stepCriteria = document.getElementById('step-criteria');
    const steps = [stepLocation, stepRentalType, stepCriteria];

    // Common Elements
    const backButton = document.querySelector('.btn-back');
    const progressBarSteps = document.querySelectorAll('.progress-bar .step');

    // Step 1 Elements
    const locationInput = document.getElementById('location-input');
    const useLocationButton = document.querySelector('.btn-use-location');
    const locationContinueButton = document.getElementById('btn-location-continue');

    // Step 2 Elements
    const rentalTypeOptions = document.querySelectorAll('.rental-type-option');
    const rentalTypeContinueButton = document.getElementById('btn-rental-type-continue');

    // Step 3 Elements
    const bedsOptions = document.getElementById('beds-options');
    const bathsOptions = document.getElementById('baths-options');
    const priceSlider = document.getElementById('price-slider');
    const priceOutput = document.getElementById('price-output');
    const finishButton = document.getElementById('btn-finish');
    
    // SVG Icon for Progress Bar
    const checkmarkSVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M9,20.42L2.79,14.21L5.62,11.38L9,14.77L18.88,4.88L21.71,7.71L9,20.42Z"/></svg>`;

    // --- 3. Navigation Functions ---
    const goToStep = (stepNumber) => {
        currentStep = stepNumber;
        steps.forEach(step => step.classList.add('hidden'));
        if (steps[currentStep - 1]) {
            steps[currentStep - 1].classList.remove('hidden');
        }
        updateProgressBar();
    };

    const updateProgressBar = () => {
        progressBarSteps.forEach((stepEl, index) => {
            const stepIndex = index + 1;
            const stepIcon = stepEl.querySelector('.step-icon');
            stepEl.classList.remove('active', 'completed');
            stepIcon.innerHTML = '';
            if (stepIndex < currentStep) {
                stepEl.classList.add('completed');
                stepIcon.innerHTML = checkmarkSVG;
            } else if (stepIndex === currentStep) {
                stepEl.classList.add('active');
            }
        });
    };

    // --- 4. Event Listeners ---
    
    // Back Button
    backButton.addEventListener('click', () => {
        if (currentStep > 1) {
            goToStep(currentStep - 1);
        } else {
            // If on the first step, go to the previous page in history
            history.back();
        }
    });

    // Step 1: Location
    locationInput.addEventListener('input', () => {
        locationContinueButton.disabled = locationInput.value.trim() === '';
    });
    locationContinueButton.addEventListener('click', () => goToStep(2));
    useLocationButton.addEventListener('click', handleUseMyLocation);

    // Step 2: Rental Type
    rentalTypeOptions.forEach(option => {
        option.addEventListener('click', () => {
            option.classList.toggle('active');
            rentalTypeContinueButton.disabled = !document.querySelector('.rental-type-option.active');
        });
    });
    rentalTypeContinueButton.addEventListener('click', () => goToStep(3));

    // Step 3: Rental Criteria
    const handleOptionGroup = (container) => {
        const options = container.querySelectorAll('.criteria-option');
        options.forEach(option => {
            option.addEventListener('click', () => {
                options.forEach(opt => opt.classList.remove('active'));
                option.classList.add('active');
            });
        });
    };
    handleOptionGroup(bedsOptions);
    handleOptionGroup(bathsOptions);

    priceSlider.addEventListener('input', () => {
        const value = parseInt(priceSlider.value, 10);
        priceOutput.textContent = value.toLocaleString(); // Formats as "5,000"
    });

    finishButton.addEventListener('click', () => {
        alert('Signup complete! Redirecting...');
        // In a real application, you would collect form data and then redirect:
        // window.location.href = '/dashboard';
    });

    // --- 5. Geolocation Functionality ---
    function handleUseMyLocation() {
        if (!navigator.geolocation) {
            alert('Geolocation is not supported by your browser.');
            return;
        }

        const originalButtonHtml = useLocationButton.innerHTML;
        useLocationButton.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" class="spinner" viewBox="0 0 50 50"><path d="M25,3A22,22,0,1,1,3,25,22,22,0,0,1,25,3m0-3A25,25,0,1,0,50,25,25,25,0,0,0,25,0h0Z"/></svg><span>Finding...</span>`;
        useLocationButton.disabled = true;

        navigator.geolocation.getCurrentPosition(
            (position) => {
                const { latitude, longitude } = position.coords;
                fetch(`https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}`)
                    .then(response => response.json())
                    .then(data => {
                        if (data && data.display_name) {
                            locationInput.value = data.display_name;
                            locationInput.dispatchEvent(new Event('input'));
                        } else {
                            alert('Could not find address for your location.');
                        }
                    })
                    .catch(() => {
                        alert('Could not retrieve address. Please check your connection.');
                    })
                    .finally(() => {
                        useLocationButton.innerHTML = originalButtonHtml;
                        useLocationButton.disabled = false;
                    });
            },
            (error) => {
                let errorMessage = 'An unknown error occurred.';
                // Using the more detailed error handler
                switch (error.code) {
                    case error.PERMISSION_DENIED:
                        errorMessage = 'You denied the request for Geolocation.';
                        break;
                    case error.POSITION_UNAVAILABLE:
                        errorMessage = 'Location information is unavailable.';
                        break;
                    case error.TIMEOUT:
                        errorMessage = 'The request to get user location timed out.';
                        break;
                }
                alert(errorMessage);
                useLocationButton.innerHTML = originalButtonHtml;
                useLocationButton.disabled = false;
            }
        );
    }
    
    // --- 6. Initialization ---
    // Start the process at the first step when the page loads
    goToStep(1);
});