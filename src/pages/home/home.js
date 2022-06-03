/* eslint-disable no-param-reassign */
(() => {
  const annualPrices = document.getElementById('input-annual-subscription');
  const prices = document.querySelectorAll('[data-role="price"]');

  /** Reduce the prices by 17% if the annual subscription is selected */
  const changePrices = () => {
    prices.forEach((price) => {
      let newValue;
      if (annualPrices.checked) {
        newValue = Math.round((price.innerHTML *= 0.8547));
      } else {
        newValue = Math.round((price.innerHTML *= 1.17));
      }
      price.innerHTML = newValue;
    });
  };

  if (annualPrices) {
    annualPrices.addEventListener('change', changePrices);
  }
})();
