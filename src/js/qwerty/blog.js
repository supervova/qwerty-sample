/* eslint-disable no-undef, camelcase, no-unused-vars */
function getmembers() {
  if (loadingmembers === 0) {
    loadingmembers = 1;
    membersearch = document.getElementById('membersearch').value;
    document.getElementById('loadingmembers').style.display = 'block';
    country = document.getElementById('cclist').value;
    memberregion = document.getElementById('memberregion').value;
    memberregion_lng = document.getElementById('memberregion_lng').value;
    $.ajax({
      url: './getmembers.php',
      type: 'POST',
      async: true,
      data: {
        lasteventtime,
        membersearch,
        country,
        memberregion,
        memberregion_lng,
        // prettier-ignore
        membersof: {$blog_id},
      },
      success(response) {
        $('.endmembers').remove();
        if (lasteventtime === 0) {
          $('#membersblock').html(response);
        } else {
          $('#membersblock').append(response);
        }
        loadingmembers = 0;
        document.getElementById('loadingmembers').style.display = 'none';
        document.getElementById('typesdiv').disable = false;
        // showmembers();
      },
      error(response) {
        loadingmembers = 0;
        document.getElementById('loadingmembers').style.display = 'none';
        document.getElementById('typesdiv').disable = false;
      },
    });
  }
}

function showmembers() {
  if (loadingmembers === 0) {
    for (let i = 0; i < $('.endmembers').get().length; i++) {
      const item = document.getElementsByClassName('endmembers');
      const itemFirst = item[i];
      if (elementInViewport(itemFirst)) {
        getmembers();
      }
    }
  }
}

function searchblog() {
  // prettier-ignore
  if ({$user_id} === 0) {
    quickreg();
    return;
  }
  const searchstr = document.getElementById('blogsearch').value;
  if (searchstr === '') {
    window.location.href = '{$addpath}{$blogpath}';
  } else {
    window.location.href = `{$addpath}/search/${searchstr}`;
  }
}

function delsubscr(uid) {
  bootpopup({
    title: 'Please note',
    content: [
      'Are you sure you want to cancel the subscription for the selected user?',
    ],
    cancel(data, array, event) {
      return false;
    },
    ok(data, array, event) {
      window.location.href = `{$addpath}?action=rejectuser&id=${uid}`;
    },
  });
}

function getprojects(showid) {
  $('#projects').html(
    '<div style="text-align:center;"><img src="/images/loading.gif" width="50" height="50" alt="Loading..."></div>'
  );
  $.ajax({
    url: './getprojects.php',
    type: 'POST',
    async: true,
    data: { community: '{$community}', showid },
    success(response) {
      $('#projects').html(response);
    },
    error(response) {
      getprojects(showid);
    },
  });
}

function changetype() {
  country = document.getElementById('cclist').value;
  searchcities(country);
  if (country !== '') {
    $('#citydiv').show();
  } else {
    $('#citydiv').hide();
  }
  if (loadingmembers === 0) {
    setTimeout(() => {
      lasteventtime = 0;
      getmembers();
    }, 500);
  }
}

function cleanfilter() {
  const cclist = document.querySelector('#cclist');
  cclist.selectedIndex = 0;
  document.getElementById('memberregion').value = '';
  document.getElementById('memberregion_lng').value = '';
  document.getElementById('membersearch').value = '';
  changetype();
}
