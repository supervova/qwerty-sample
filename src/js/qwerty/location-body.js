/* eslint-disable no-unused-vars, no-use-before-define, camelcase, no-undef */

function searchcities(country_code) {
  $('.typeahead__result').remove();
  $.typeahead({
    input: '.cities',
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
          user_lng: '{$user_lng}',
        },
      },
    },
    callback: {
      onClick(node, a, item, event) {
        $('#memberregion_lng').val(item.display);
        checkregion();
      },
    },
  });
}

function checkregion() {
  const location_country = document.getElementById('cclist').value;
  const this_region_lng = document.getElementById('this_region_lng').value;
  if (this_region_lng != '') {
    if (this_region_lng != '{$this_region_lng}') {
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
          if (response[0] == 'OK') {
            document.getElementById('this_region').value = response[1];
            document.getElementById('this_region_lng').value = response[2];
            getnew(100);
          }
        },
      });
    } else {
      document.getElementById('this_region').value = '{$this_region}';
      document.getElementById('this_region_lng').value = '{$this_region_lng}';
    }
  } else {
    document.getElementById('this_region').value = '';
    document.getElementById('this_region_lng').value = '';
  }
}

function getnew(delaysec = 1000) {
  adcountry = document.getElementById('cclist').value;
  searchcities(adcountry);
  if (adcountry != '') {
    document.getElementById('this_region_lng').disabled = false;
  } else {
    document.getElementById('this_region_lng').disabled = true;
  }
}

function saveregion() {
  const location_country = document.getElementById('cclist').value;
  const this_region = document.getElementById('this_region').value;
  const this_region_lng = document.getElementById('this_region_lng').value;
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
      if (response[0] == 'OK') {
        $('#locationstr').html(response[1]);
        $('#modal-location').modal('hide');
      }
    },
    error(response) {
      loadingdata = 0;
      getblock();
    },
  });
}

function changeprovide() {
  if (document.getElementById('whoprovides1').checked) {
    $('#pagesdiv').show();
  } else {
    $('#pagesdiv').hide();
  }
  if (document.getElementById('locationtype1').checked) {
    $('#mylocation').show();
  } else {
    $('#mylocation').hide();
  }
}

function keyupcity() {
  const this_region_lng = document.getElementById('this_region_lng').value;
  if (this_region_lng == '') {
    getnew(100);
  }
}
