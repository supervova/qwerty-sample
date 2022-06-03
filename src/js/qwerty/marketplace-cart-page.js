/* eslint-disable camelcase, no-constant-condition, no-param-reassign, no-prototype-builtins, no-use-before-define, no-undef, no-unused-vars, no-shadow */

// TODO: Divide-and-conquer
function checkout() {
  // prettier-ignore
  if (!{$user_id}) {
    loginform();
    return;
  }

  if (!$('#mpagree').prop('checked')) {
    bootpopup.alert('You must read and accept our terms!', 'Please note');
    return;
  }

  // prettier-ignore
  if ({$user_id} !== 18) {
    bootpopup.alert(
      'The order processing and logistics system will be implemented in the 2nd phase!',
      'Please note'
    );
    return;
  }
  if ($('#orderform').is(':hidden')) {
    $('#orderform').show();
  } else {
    savemporder();
  }
}

function savemporder() {
  const recipient_name = $('#recipient_name').val();
  const recipient_country = $('#cclist').val();
  const recipient_region_lng = $('#recipient_region_lng').val();
  const recipient_region = $('#recipient_region').val();
  const recipient_postcode = $('#recipient_postcode').val();
  const recipient_address = $('#recipient_address').val();
  const recipient_addinfo = $('#recipient_addinfo').val();
  if (
    recipient_name === '' ||
    recipient_country === '' ||
    recipient_region_lng === '' ||
    recipient_postcode === '' ||
    recipient_address === ''
  ) {
    bootpopup.alert(
      'Fill in all the information about the recipient of the order!',
      'Error'
    );
    return;
  }
  $('#p_prldr').show();
  $.post('./savemporder.php', {
    id: 0,
    order_status: 'new',
    recipient_name,
    recipient_country,
    recipient_region_lng,
    recipient_region,
    recipient_postcode,
    recipient_address,
    recipient_addinfo,
  }).done((data) => {
    data = $.parseJSON(data);
    if (data[0] !== 'OK') {
      $('#p_prldr').delay(100).fadeOut('slow');
      bootpopup.alert(data[0], 'Please note');
    } else if (data[1] > 0) {
      const payobject = `mplace|${data[1]}`;
      $.post('./createbill.php', {
        payobject,
        // prettier-ignore
        checkID: {$startruntime},
      }).done((data) => {
        if (data > 0) {
          window.location.href = `/bill/${data}`;
        }
        // else {alert(data);}
      });
    }
  });
}

function clearcart() {
  bootpopup.confirm(
    'Are you sure you want to empty your shopping cart?',
    'Please note',
    (ans) => {
      if (ans) {
        const largeExpDate = new Date();
        largeExpDate.setTime(largeExpDate.getTime());
        SetCookieQwerty('mycart', '', largeExpDate, '/', '{$this2leveldomain}');
        SetCookieQwerty('mycart', '', largeExpDate, '/');
        window.location.href = '/marketplace';
      }
    }
  );
}

function setcart(pid, qty) {
  removeitem = false;
  if (qty === -10) {
    bootpopup.confirm(
      'Are you sure you want to delete this product item?',
      'Please note',
      (ans) => {
        if (ans) {
          setcart(pid, -20);
        }
      }
    );
    return;
  }
  if (qty === -20) {
    removeitem = true;
    qty = 0;
  }
  mycart = GetCookieQwerty('mycart');
  if (mycart == null) {
    cartData = {};
    cartData.total = 0;
  } else {
    cartData = JSON.parse(mycart);
  }
  if (typeof cartData !== 'object') {
    cartData = {};
    cartData.total = 0;
  }
  if (cartData.hasOwnProperty(pid)) {
    // eval(`cartData.${pid}[1] = ${qty}`);
    cartData.pid[1] = qty;
    const oldtotal = $('#totalval').val();
    const oldsum = $(`#sum${pid}`).html() * 1;
    const price = $(`#price${pid}`).html() * 1;
    const newsum = price * qty;
    if (qty > 0) {
      cartData.total = oldtotal - oldsum + newsum;
    } else {
      cartData.total = oldtotal - oldsum;
    }
    let newtotal = cartData.total * 1;
    newtotal = newtotal.toFixed(2);
    cartData.total = newtotal;
    $('#totalval').val(newtotal);
    $('#total').html(newtotal);
    $(`#sum${pid}`).html(newsum);
    mycart = JSON.stringify(cartData);
    let largeExpDate = new Date();
    largeExpDate.setTime(largeExpDate.getTime() + 24 * 60 * 60 * 100000);
    SetCookieQwerty('mycart', mycart, largeExpDate, '/', '{$this2leveldomain}');
    if (removeitem) {
      $(`#tr${pid}`).hide();
      if (newtotal <= 0) {
        largeExpDate = new Date();
        largeExpDate.setTime(largeExpDate.getTime());
        SetCookieQwerty('mycart', '', largeExpDate, '/', '{$this2leveldomain}');
        SetCookieQwerty('mycart', '', largeExpDate, '/');
        window.location.href = '/marketplace';
      }
    }
  } else {
    window.location.reload();
  }
}

$(document).ready(() => {
  searchcities('{$recipient_country}');
  $('#cclist').change(() => {
    const newcountry = document.getElementById('cclist').value;
    if (newcountry !== '{$recipient_country}') {
      document.getElementById('recipient_region').value = '';
      document.getElementById('recipient_region_lng').value = '';
    } else {
      document.getElementById('recipient_region').value = '{$recipient_region}';
      document.getElementById('recipient_region_lng').value =
        '{$recipient_region_lng}';
    }
    searchcities(newcountry);
  });
});
