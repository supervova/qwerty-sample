function addToCart() {
  itemprop = {};
  propstr = '';
  $('.mpitemptop').each((i, obj) => {
    if (typeof itemprop[obj] === 'undefined') {
      itemprop[obj] = 0;
      itemprop[`${obj}name`] = $(obj).attr('data-lng');
    }
    if ($(obj).is(':checked')) {
      itemprop[obj] = 1;
      if (propstr === '') {
        propstr = $(obj).attr('data-prop');
      } else {
        propstr = `${propstr}, ${$(obj).attr('data-prop')}`;
      }
    }
  });
  prop2choice = '';
  $('.mpitemptop').each((i, obj) => {
    if (itemprop[obj] === 0) {
      prop2choice = itemprop[`${obj}name`];
    }
  });
  if (prop2choice !== '') {
    bootpopup.alert(`You have not chosen: ${prop2choice}`, 'Please note');
    return;
  }
  if (propstr !== '') {
    propstr = ` (${propstr})`;
  }
  mycart = GetCookieQwerty('mycart');
  if (mycart === null) {
    cartData = {};
    cartData.total = 0;
  } else {
    cartData = JSON.parse(mycart);
  }
  if (typeof cartData !== 'object') {
    cartData = {};
    cartData.total = 0;
  }

  if (Object.prototype.hasOwnProperty.call(cartData, 'id{$product[id]}')) {
    cartData.id{$product[id]}[1] += 1;
    cartData.id{$product[id]}[2] = propstr;
  } else {
    cartData.id{$product[id]} = [{$user_full_price}, 1, propstr];
  }

  // prettier-ignore
  cartData.total += {$user_full_price};
  newtotal = cartData.total;
  newtotal = round(newtotal, 2);
  cartData.total = newtotal;
  mycart = JSON.stringify(cartData);
  const largeExpDate = new Date();
  largeExpDate.setTime(largeExpDate.getTime() + 24 * 60 * 60 * 100000);
  SetCookieQwerty('mycart', mycart, largeExpDate, '/', '{$this2leveldomain}');
  cartinfo();
  $('#cartinfo').removeClass('shortblink');
  $('#cartinfo').addClass('shortblink');
  $.toast({
    text: 'Product added to cart!',
    position: 'bottom-right',
    icon: 'normal',
    showHideTransition: 'fade',
    hideAfter: 1000,
    loader: true,
    stack: 5,
  });
}
