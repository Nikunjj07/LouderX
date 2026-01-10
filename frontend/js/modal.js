/**
 * Modal Module
 * Handles email capture modal functionality
 */

// DOM Elements
const modal = document.getElementById('email-modal');
const modalOverlay = document.getElementById('modal-overlay');
const modalClose = document.getElementById('modal-close');
const emailForm = document.getElementById('email-form');
const emailInput = document.getElementById('email');
const consentCheckbox = document.getElementById('consent');
const submitBtn = document.getElementById('submit-btn');
const emailError = document.getElementById('email-error');
const consentError = document.getElementById('consent-error');

/**
 * Initialize modal event listeners
 */
function initModal() {
    modalClose.addEventListener('click', closeModal);
    modalOverlay.addEventListener('click', closeModal);
    emailForm.addEventListener('submit', handleFormSubmit);

    // Close on escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
            closeModal();
        }
    });
}

/**
 * Open the modal
 */
function openModal() {
    modal.classList.remove('hidden');
    emailInput.focus();
    document.body.style.overflow = 'hidden'; // Prevent background scroll
}

/**
 * Close the modal
 */
function closeModal() {
    modal.classList.add('hidden');
    resetForm();
    document.body.style.overflow = ''; // Restore scroll
}

/**
 * Handle form submission
 */
async function handleFormSubmit(e) {
    e.preventDefault();

    // Clear previous errors
    hideErrors();

    // Validate form
    const email = emailInput.value.trim();
    const consent = consentCheckbox.checked;

    let isValid = true;

    if (!isValidEmail(email)) {
        showError(emailError);
        isValid = false;
    }

    if (!consent) {
        showError(consentError);
        isValid = false;
    }

    if (!isValid || !currentEvent) {
        return;
    }

    // Show loading state
    setLoading(true);

    try {
        // Subscribe email
        await APIService.subscribeEmail(email, currentEvent._id, consent);

        // Close modal
        closeModal();

        // Show success message (you could add a toast notification here)
        console.log('Subscription successful!');

        // Redirect to ticket URL if available
        if (currentEvent.ticket_url) {
            setTimeout(() => {
                window.open(currentEvent.ticket_url, '_blank');
            }, 500);
        }

    } catch (error) {
        console.error('Subscription failed:', error);
        alert('Failed to subscribe. Please try again.');
    } finally {
        setLoading(false);
    }
}

/**
 * Validate email format
 */
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

/**
 * Show error message
 */
function showError(errorElement) {
    errorElement.classList.remove('hidden');
}

/**
 * Hide all error messages
 */
function hideErrors() {
    emailError.classList.add('hidden');
    consentError.classList.add('hidden');
}

/**
 * Set loading state
 */
function setLoading(loading) {
    const submitText = submitBtn.querySelector('.submit-text');
    const submitLoading = submitBtn.querySelector('.submit-loading');

    if (loading) {
        submitText.classList.add('hidden');
        submitLoading.classList.remove('hidden');
        submitBtn.disabled = true;
    } else {
        submitText.classList.remove('hidden');
        submitLoading.classList.add('hidden');
        submitBtn.disabled = false;
    }
}

/**
 * Reset form
 */
function resetForm() {
    emailForm.reset();
    hideErrors();
    setLoading(false);
}

// Initialize modal when module loads
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initModal);
} else {
    initModal();
}
