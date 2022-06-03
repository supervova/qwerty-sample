/* eslint-disable */
$(document).ready(() => {
  loadingdata = 0;
  lasteventtime = 0;
  window.onscroll = showblock;
  $('#usercurr').change(function () {
    getnew(100);
  });
  // prettier-ignore
  if ({$mylogic}) {
    $('.allads').hide();
    $('.myads').show();
  } else {
    $('.allads').show();
    $('.myads').hide();
  }
  searchcities('{$user_country}');
  searchindustry();
  showblock();
});

function getblock() {
  if (loadingdata == 0) {
    lastcall = new Date().getTime();
    const industries = document.getElementById('industries').value;
    const searchtext = document.getElementById('searchtext').value;
    var remotework = 0;
    if (document.getElementById('locationtype').checked) {
      var remotework = 1;
    }
    const location_country = document.getElementById('cclist').value;
    const this_region = document.getElementById('this_region').value;
    const this_region_lng = document.getElementById('this_region_lng').value;
    const salaryfrom = document.getElementById('salaryfrom').value;
    const curr = document.getElementById('usercurr').value;
    const salaryperiod = document.getElementById('salary_period').value;
    loadingdata = 1;
    document.getElementById('loadingdata').style.display = 'block';
    $('.endblock').removeClass('endblock');
    if (lasteventtime == 0) {
      $('#datablock').html('');
    }
    $.ajax({
      url: './getjob.php',
      type: 'POST',
      async: false,
      data: {
        lasteventtime,
        searchtext,
        location_country,
        this_region,
        this_region_lng,
        industries,
        salaryfrom,
        curr,
        salaryperiod,
        remotework,
        // prettier-ignore
        myads: {$mylogic},
      },
      success(response) {
        if (lasteventtime == 0) {
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
  if (loadingdata == 0) {
    const posTop =
      window.pageYOffset !== undefined
        ? window.pageYOffset
        : (
            document.documentElement ||
            document.body.parentNode ||
            document.body
          ).scrollTop;
    for (let i = 0; i < $('.endblock').get().length; i++) {
      const item = document.getElementsByClassName('endblock');
      const itemFirst = item[i];
      if (elementInViewport(itemFirst) || lasteventtime == 0) {
        getblock();
      }
    }
  }
}

function keyupcity() {
  const this_region_lng = document.getElementById('this_region_lng').value;
  if (this_region_lng == '') {
    getnew(100);
  }
}
