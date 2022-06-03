(() => {
  /** Strip nbsp; around Edit item */
  const dropdownEdit = document.getElementById('dropdown-menu-edit');
  if (dropdownEdit) {
    dropdownEdit.innerHTML = dropdownEdit.innerHTML.replace(/&nbsp;/g, '');
  }
})();
