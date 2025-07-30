(function () {
  const STORE_ADDRESS = {
    firstName: 'In-Store',
    lastName: 'Pickup',
    address1: '123 Main Street',
    city: 'Durham',
    stateOrProvince: 'NC',
    postalCode: '27701',
    countryCode: 'US',
  };

  function waitForCheckoutSdk(callback) {
    const interval = setInterval(() => {
      if (window.checkout && window.checkout.customer) {
        clearInterval(interval);
        callback();
      }
    }, 250);
  }

  function overrideShippingAddressIfNeeded() {
    const shippingOptionSelector = 'input[name="shipping-option"]';

    document.querySelectorAll(shippingOptionSelector).forEach((input) => {
      input.addEventListener('change', () => {
        const selectedOptionLabel = input.closest('label');
        const isPickup = selectedOptionLabel && selectedOptionLabel.textContent.toLowerCase().includes('pickup');

        if (isPickup) {
          const shippingAddress = window.checkout?.shippingAddress;

          // Only proceed if customer is from NC
          if (shippingAddress?.stateOrProvinceCode === 'NC') {
            window.checkout.shippingAddress = {
              ...shippingAddress,
              ...STORE_ADDRESS,
            };

            // Autofill visible form fields for user feedback
            const fields = {
              'addressLine1Input': STORE_ADDRESS.address1,
              'cityInput': STORE_ADDRESS.city,
              'postCodeInput': STORE_ADDRESS.postalCode,
              'provinceInput': STORE_ADDRESS.stateOrProvince,
            };

            for (const [fieldId, value] of Object.entries(fields)) {
              const el = document.getElementById(fieldId);
              if (el) el.value = value;
            }
          }
        }
      });
    });
  }

  waitForCheckoutSdk(() => {
    const stepWatcher = new MutationObserver(() => {
      overrideShippingAddressIfNeeded();
    });

    stepWatcher.observe(document.body, { childList: true, subtree: true });
    overrideShippingAddressIfNeeded();
  });
})();
