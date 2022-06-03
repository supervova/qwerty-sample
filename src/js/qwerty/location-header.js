/* eslint-disable no-param-reassign, prefer-destructuring, no-unused-vars, camelcase */
function searchcities_header(country_code) {
  $('.typeahead__result').remove();
  $('#this_region_lng_header').typeahead({
    minLength: 1,
    order: 'asc',
    cache: false,
    maxItem: false,
    offset: true,
    source: {
      ajax: {
        type: 'POST',
        url: '/json.php',
        data: {
          country_code,
          user_lng: 'ru',
        },
      },
    },
    callback: {
      onClick(node, a, item, event) {
        $('#this_region_lng_header').val(item.display);
        // eslint-disable-next-line no-use-before-define
        checkregion_header();
      },
    },
  });
}

function getnew_header(delaysec = 1000) {
  const adcountry = document.getElementById('cclist_header').value;
  searchcities_header(adcountry);
  if (adcountry !== '') {
    document.getElementById('this_region_lng_header').disabled = false;
  } else {
    document.getElementById('this_region_lng_header').disabled = true;
  }
}

function checkregion_header() {
  const location_country = document.getElementById('cclist_header').value;
  const this_region_lng = document.getElementById(
    'this_region_lng_header'
  ).value;
  if (this_region_lng !== '') {
    if (this_region_lng !== '') {
      $.ajax({
        url: './regionlng.php',
        type: 'POST',
        data: {
          region_lng: this_region_lng,
          usercountry: location_country,
        },
        async: false,
        success(response) {
          response = $.parseJSON(response);
          if (response[0] === 'OK') {
            document.getElementById('this_region_header').value = response[1];
            document.getElementById('this_region_lng_header').value =
              response[2];
            getnew_header(100);
          }
        },
      });
    } else {
      document.getElementById('this_region_header').value = '';
      document.getElementById('this_region_lng_header').value = '';
    }
  } else {
    document.getElementById('this_region_header').value = '';
    document.getElementById('this_region_lng_header').value = '';
  }
}

function getnewcountry_header() {
  document.getElementById('this_region_lng_header').value = '';
  document.getElementById('this_region_header').value = '';
  getnew_header();
}

function saveregion_header() {
  const location_country = document.getElementById('cclist_header').value;
  const this_region = document.getElementById('this_region_header').value;
  const this_region_lng = document.getElementById(
    'this_region_lng_header'
  ).value;
  $.ajax({
    url: 'saveregion.php',
    type: 'POST',
    async: false,
    data: {
      location_country,
      this_region,
      this_region_lng,
    },
    success(response) {
      response = $.parseJSON(response);
      if (response[0] === 'OK') {
        $('#locationstr_header').html(response[1]);
        $('#modal-location').modal('hide');
      }
    },
    error(response) {
      const loadingdata = 0;
    },
  });
}
