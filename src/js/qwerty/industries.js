/* eslint-disable */
function delindustry(code) {
  $(`#industrytag${code}`).remove();
  var industries = $('#industries').val();
  var industries = industries.replace(`|${code}|`, '');
  $('#industries').val(industries);
}

function addindustry(str) {
  $.ajax({
    url: './industrylng.php',
    type: 'POST',
    data: { industry: str, user_lng: '{$read_lng}' },
    async: false,
    success(response) {
      response = $.parseJSON(response);
      if (response[0] === 'OK') {
        $('.typeahead__result').remove();
        $(`#industrytag${response[1]}`).remove();
        var industries = $('#industries').val();
        var industries = industries.replace(`|${response[1]}|`, '');
        var industries = `${industries}|${response[1]}|`;
        $('#industries').val(industries);
        const industrytags = $('#industrytags').html();
        $('#industrytags').html(
          `${industrytags}<div id="industrytag${response[1]}"><span class="tag"><span class="blink">${response[2]}</span><button class="tag__remover" type="button" onclick="delindustry(${response[1]})">×</button></span></div>`
        );
        $('#searchbyindustry').val('');
        searchindustry();
      }
    },
  });
}

function searchindustry() {
  $('#searchbyindustry').typeahead({
    minLength: 2,
    order: 'asc',
    cache: false,
    maxItem: false,
    offset: false,
    source: {
      ajax: {
        type: 'POST',
        url: '/json.php',
        data: {
          industry: 'ok',
          user_lng: '{$read_lng}',
        },
      },
    },
    callback: {
      onClick(node, a, item, event) {
        addindustry(item.display);
        return false;
      },
    },
  });
}
