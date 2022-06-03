/* eslint-disable camelcase, no-unused-vars */

/*
this_region_lng / this_region_lng_header - city search input
*/

let lastcall;
let location_country;
let searchtext;
let this_region;
let this_region_lng;
let costfrom;
let costto;
let curr;
let loadingdata;
let lasteventtime;
let mycart;
let cartData;

function getblock() {
  if (loadingdata === 0) {
    lastcall = new Date().getTime();
    location_country = document.getElementById('cclist_header').value;
    searchtext = document.getElementById('header-search-input').value;
    this_region = document.getElementById('this_region_header').value;
    this_region_lng = document.getElementById('this_region_lng_header').value;
    costfrom = document.getElementById('costfrom').value;
    costto = document.getElementById('costto').value;
    curr = document.getElementById('usercurr').value;
    loadingdata = 1;
    document.getElementById('loadingdata').style.display = 'block';
    $('.endblock').removeClass('endblock');
    if (lasteventtime === 0) {
      $('#datablock').html('');
    }
    $.ajax({
      url: './getmarketplace.php',
      type: 'POST',
      async: false,
      data: {
        lasteventtime,
        searchtext,
        location_country,
        this_region,
        this_region_lng,
        costfrom,
        costto,
        curr,
        mpcountry: '{$mpcountry}',
        // prettier-ignore
        cat: {$thiscat},
        // prettier-ignore
        myads: {$mylogic},
      },
      success(response) {
        if (lasteventtime === 0) {
          $('#datablock').html(response);
        } else {
          $('#datablock').append(response);
        }
        loadingdata = 0;
        document.getElementById('loadingdata').style.display = 'none';
        $('[data-toggle="tooltip"]').tooltip();
        showblock();
      },
      error(response) {
        loadingdata = 0;
        getblock();
      },
    });
  }
}

function showblock() {
  if (loadingdata === 0) {
    for (let i = 0; i < $('.endblock').get().length; i++) {
      const item = document.getElementsByClassName('endblock');
      const itemFirst = item[i];
      if (elementInViewport(itemFirst) || lasteventtime === 0) {
        getblock();
      }
    }
  }
}

function cartinfo() {
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
  if (cartData.total > 0) {
    $('#cartinfo').show();
    $('#cartinfo').html(
      `<a href="/marketplace/cart"><span style="font-weight:500;">Your shopping cart: ${cartData.total} {$select_curr_show}</span></a>`
    );
  } else {
    $('#cartinfo').hide();
  }
}

function keyupcity() {
  const this_region_lng = document.getElementById(
    'this_region_lng_header'
  ).value;
  if (this_region_lng === '') {
    getnew_header(100);
  }
}

$(document).ready(() => {
  loadingdata = 0;
  lasteventtime = 0;
  window.onscroll = showblock;

  $('#usercurr').change(() => {
    getnew_header(100);
  });
  // prettier-ignore
  if ({$mylogic}) {
    $('.allads').hide();
    $('.myads').show();
  } else {
    $('.allads').show();
    $('.myads').hide();
  }
  searchcities_header('{$user_country}');
  showblock();
  cartinfo();
});
