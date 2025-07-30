(function () {
  const STORE_ADDRESS = {
    firstName: 'MidAtlantic',
    lastName: 'Distribution',
    address1: '2316 Reichard St',
    city: 'Durham',
    stateOrProvinceCode: 'NC',
    postalCode: '27705',
    countryCode: 'US'
  };

  const PICKUP_LABEL = 'Pickup In Store';

  function shippingOptionSelectedIsPickup() {
    const selectedOption = document.querySelector('.form-check-input[aria-checked="true"]')?.closest('.shippingOption');
    return selectedOption && selectedOption.textContent.includes(PICKUP_LABEL);
  }

  function setField(name, value) {
    const input = document.querySelector(`[name="shippingAddress.${name}"]`);
    if (input) input.value = value;
  }

  function setSelectField(name, value) {
    const select = document.querySelector(`select[name="shippingAddress.${name}"]`);
    if (select) {
      select.value = value;
      select.dispatchEvent(new Event('change', { bubbles: true }));
    }
  }

  function overwriteShippingAddressIfNeeded() {
    if (shippingOptionSelectedIsPickup()) {
      setField('firstName', STORE_ADDRESS.firstName);
      setField('lastName', STORE_ADDRESS.lastName);
      setField('address1', STORE_ADDRESS.address1);
      setField('city', STORE_ADDRESS.city);
      setField('postalCode', STORE_ADDRESS.postalCode);
      setSelectField('stateOrProvinceCode', STORE_ADDRESS.stateOrProvinceCode);
      setSelectField('countryCode', STORE_ADDRESS.countryCode);
      console.log('[StorePickup Script] Store address applied.');
    } else {
      console.log('[StorePickup Script] Not using pickup, address untouched.');
    }
  }

  function waitForCheckoutForm() {
    const formCheck = setInterval(() => {
      const form = document.querySelector('form[name="checkout_shipping_address"]');
      if (form) {
        clearInterval(formCheck);
        overwriteShippingAddressIfNeeded();

        // Listen for manual change to shipping option
        form.addEventListener('click', () => {
          setTimeout(overwriteShippingAddressIfNeeded, 500);
        });
      }
    }, 300);
  }

  document.addEventListener('DOMContentLoaded', waitForCheckoutForm);
})();
