if (window.matchMedia('(min-width: 1024px)').matches) {
  const filterCategory = document.getElementById('filter-categories-input');
  const filterPriceFrom = document.getElementById('costfrom');
  const filterPriceTo = document.getElementById('costto');

  const txtAny = '{{ "Any"|trans }}';
  const txtFrom = '{{ "from"|trans }}';
  const txtTo = '{{ "to"|trans }}';
  const txtAll = '{{ "All"|trans }}';
  const txtAllProducts = '{{ "All products"|trans }}';

  /**
   * Update filter labels with selected values
   * @param {object} event - Input blur
   */
  const changeFilterLabel = (event) => {
    const el = event.currentTarget;
    const src = el.id;
    const newValue = el.value;
    const label = el
      .closest('.dropdown')
      .querySelector(`[data-source="${src}"]`);
    if (src === 'costfrom') {
      if (newValue === '' && filterPriceTo.value === '') {
        label.textContent = txtAny;
      } else if (newValue === '') {
        label.textContent = '';
      } else {
        label.textContent = `${txtFrom} ${newValue}`;
      }
    } else if (src === 'costto') {
      if (newValue === '') {
        label.textContent = '';
      } else {
        label.textContent = `${txtTo} ${newValue}`;
      }
    } else if (
      src === 'filter-categories-input' &&
      newValue === txtAllProducts
    ) {
      label.textContent = txtAll;
    } else {
      label.textContent = newValue;
    }
  };

  filterCategory.addEventListener('blur', changeFilterLabel);
  filterPriceFrom.addEventListener('blur', changeFilterLabel);
  filterPriceTo.addEventListener('blur', changeFilterLabel);
}
