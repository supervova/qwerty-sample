$(document).ready(() => {
  loadingdata = 0;
  lasteventtime = 0;
  window.onscroll = showblock;
  $('#usercurr').change(function () {
    getnew(100);
  });
  // prettier-ignore
  if ({$myrecommendations} > 0) {
    $('.allads').hide();
    $('.myads').hide();
    $('.myrecomendations').show();
  // prettier-ignore
  } else if ({$mylogic} > 0) {
    $('.allads').hide();
    $('.myrecomendations').hide();
    $('.myads').show();
  } else {
    $('.myads').hide();
    $('.myrecomendations').hide();
    $('.allads').show();
  }
  searchcities('{$user_country}');
  if (document.location.href.indexOf('part=ok') != -1) {
    document.getElementById('offertype2').checked = true;
  }
  showblock();
});

function showindustries() {
  if (document.getElementById('industries').style.display == 'none') {
    $('#industries').show();
  } else {
    $('#industries').hide();
  }
}
