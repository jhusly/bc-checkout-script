window.addEventListener("load", function () {
  const interval = setInterval(() => {
    if (window.checkoutConfig && window.Checkout && window.Checkout.$container) {
      clearInterval(interval);
      initPickupHandler();
    }
  }, 500);

  function initPickupHandler() {
    console.log("In-store pickup script initialized");

    const storeAddress = {
      firstName: 'Pickup',
      lastName: 'Customer',
      address1: '123 Store St.',
      address2: '',
      city: 'Durham',
      stateOrProvinceCode: 'NC',
      postalCode: '27701',
      countryCode: 'US',
      phone: '919-000-0000',
      customFields: [],
    };

    const checkoutEl = document.querySelector("#checkout-app");
    const observer = new MutationObserver(() => {
      checkPickupAndReplaceAddress();
    });
    observer.observe(checkoutEl, { childList: true, subtree: true });

    async function checkPickupAndReplaceAddress() {
      try {
        const state = window.Checkout.getState();
        const consignments = state.consignments || [];
        if (!consignments.length) return;

        const consignment = consignments[0];
        const selectedMethod = consignment.selectedShippingOption;
        if (!selectedMethod) return;

        const methodId = selectedMethod.id.toLowerCase();
        const shippingAddress = consignment.shippingAddress;

        if (methodId.includes("pickup") && shippingAddress?.stateOrProvinceCode === "NC") {
          console.log("In-store pickup selected for NC. Overriding shipping address…");

          const service = window.Checkout;

          await service.executeCheckoutAction((checkoutService) => {
            return checkoutService.updateShippingAddress(storeAddress);
          });

          console.log("Shipping address overwritten with store address");
        }
      } catch (err) {
        console.error("Pickup script error", err);
      }
    }
  }
});
