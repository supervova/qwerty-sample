/* eslint-disable */
function changetype() {
  if (loadingcommunities == 0) {
    setTimeout(function () {
      moderationtype = 0;
      if (document.getElementById('moderationtype1').checked) {
        moderationtype = 1;
      }
      if (document.getElementById('moderationtype2').checked) {
        moderationtype = 2;
      }
      if (document.getElementById('moderationtype3').checked) {
        moderationtype = 3;
      }
      if (document.getElementById('communitytype1').checked) {
        communitytype = 1;
      } else if (document.getElementById('communitytype2').checked) {
        communitytype = 2;
      } else if (document.getElementById('communitytype3').checked) {
        communitytype = 3;
      } else if (document.getElementById('communitytype4').checked) {
        communitytype = 4;
      } else {
        communitytype = 0;
      }
      lasteventtime = 0;
      getpages();
    }, 500);
  }
}

function cleanfilter() {
  const cclist = document.querySelector('#cclist');
  cclist.selectedIndex = 0;
  document.getElementById('pageregion').value = '';
  document.getElementById('pageregion_lng').value = '';
  document.getElementById('communitytype0').checked = true;
  document.getElementById('moderationtype0').checked = true;
  document.getElementById('descsearch').value = '';
  changetype();
}

function getpages() {
  if (loadingcommunities == 0) {
    loadingcommunities = 1;
    descsearch = document.getElementById('descsearch').value;
    document.getElementById('typesdiv').disable = true;
    document.getElementById('loadingcommunities').style.display = 'block';
    country = document.getElementById('cclist').value;
    if (country != '') {
      $('#citydiv').show();
    } else {
      $('#citydiv').hide();
    }
    searchcities(country);
    pageregion = document.getElementById('pageregion').value;
    pageregion_lng = document.getElementById('pageregion_lng').value;
    $('.endposts').removeClass('endposts');
    $.ajax({
      url: './getpages.php',
      type: 'POST',
      async: true,
      data: {
        lasteventtime,
        moderationtype,
        communitytype,
        descsearch,
        country,
        pageregion,
        pageregion_lng,
      },
      success(response) {
        if (lasteventtime == 0) {
          $('#postsblock').html(response);
        } else {
          $('#postsblock').append(response);
        }
        loadingcommunities = 0;
        document.getElementById('loadingcommunities').style.display = 'none';
        document.getElementById('typesdiv').disable = false;
        showcommunities();
      },
      error(response) {
        loadingcommunities = 0;
        getpages();
      },
    });
  }
}

function ChangeAddress() {
  address = document.getElementById('address').value;
  lenaddress = address.length;
  lastinputtime = Date.now();
  if (lenaddress == 0) {
    document.getElementById('addressok').style.display = 'none';
    document.getElementById('addressno').style.display = 'none';
    document.getElementById('checking').style.display = 'none';
    document.getElementById('addressinstr').style.display = 'block';
    return;
  }
  const checkregular = /^[A-Za-z0-9.\-_]{0,50}$/;
  if (!checkregular.test(address)) {
    document.getElementById('errmsg').innerHTML = 'Invalid address!';
    document.getElementById('checking').style.display = 'none';
    document.getElementById('addressinstr').style.display = 'block';
    document.getElementById('addressok').style.display = 'none';
    document.getElementById('addressno').style.display = 'block';
    return;
  }
  if (lenaddress < 3) {
    document.getElementById('checking').style.display = 'none';
    document.getElementById('addressok').style.display = 'none';
    document.getElementById('addressno').style.display = 'none';
    document.getElementById('addressinstr').style.display = 'block';
    return;
  }
  document.getElementById('addressok').style.display = 'none';
  document.getElementById('addressno').style.display = 'none';
  document.getElementById('addressinstr').style.display = 'none';
  document.getElementById('checking').style.display = 'block';
  document.getElementById('errmsg').innerHTML = 'address is busy';
  setTimeout(function () {
    thistime = Date.now();
    interval = new Date(thistime - lastinputtime);
    intervalsec = interval.getUTCSeconds();
    if (intervalsec >= 2) {
      // функция проверка свободного адреса:
      $.ajax({
        url: 'checkaddress.php',
        type: 'POST',
        async: false,
        data: { address },
        success(response) {
          if (response == 'OK') {
            document.getElementById('errmsg').innerHTML = 'address is busy';
            document.getElementById('checking').style.display = 'none';
            document.getElementById('addressinstr').style.display = 'none';
            document.getElementById('addressno').style.display = 'none';
            document.getElementById('addressok').style.display = 'block';
          } else {
            document.getElementById('errmsg').innerHTML = response;
            document.getElementById('checking').style.display = 'none';
            document.getElementById('addressinstr').style.display = 'none';
            document.getElementById('addressok').style.display = 'none';
            document.getElementById('addressno').style.display = 'block';
          }
        },
        error(response) {
          document.getElementById('errmsg').innerHTML =
            'error. Please try again...';
          document.getElementById('checking').style.display = 'none';
          document.getElementById('addressok').style.display = 'none';
          document.getElementById('addressno').style.display = 'none';
          document.getElementById('addressinstr').style.display = 'none';
        },
      });
    }
  }, 2300);
}

function defaultcover(covernum) {
  $('#imgcover').attr('src', `./images/cover/${covernum}.jpg`);
  $('#imgcover').attr('style', 'border: 1px solid gray;');
  defcover = covernum;
}

function savecommunity() {
  address = document.getElementById("address").value;
  lenaddress = address.length;
  if (lenaddress == 0) {
    return;
  }
  var checkregular = /^[A-Za-z0-9.\-_]{0,50}$/;
  if (!checkregular.test(address)) {
    return;
  }
  communitytitle = document.getElementById("communitytitle").value;
  if (communitytitle.length < 5) {
    bootpopup.alert("The name of the Page must contain at least 5 characters!", "Please note");
    return;
  }
  communitydescr = document.getElementById("communitydescr").value;
  if (communitydescr.length < 30) {
    bootpopup.alert("The description of the Page must contain at least 30 characters!", "Please note");
    return;
  }
  page_type = 1;
  if (document.getElementById("pagetype2").checked) {
    page_type = 2;
  }
  if (document.getElementById("pagetype3").checked) {
    page_type = 3;
  }
  if (document.getElementById("pagetype4").checked) {
    page_type = 4;
  }
  document.getElementById("savebutton").style.display = "none";
  document.getElementById("saving").style.display = "block";
  $.post("./newcommunity.php", { communitytitle: communitytitle, communitydescr: communitydescr, page_type: page_type, address: address, checkID: {$startruntime} }).done(function (data) {
    document.getElementById("savebutton").style.display = "block";
    document.getElementById("saving").style.display = "none";
    data = $.parseJSON(data);
    if (data[0] == "timererror") {
      alert("The session was interrupted. Refresh the page!");
      location.reload();
    } else if (data[0] != "OK") {
      bootpopup.alert(data, "Please note");
      return;
    } else {
      location.href = "/page/" + address + "/settings";
    }
  });
}

jQuery(document).ready(function () {
  $('#cclist').change(function () {
    document.getElementById('pageregion').value = '';
    document.getElementById('pageregion_lng').value = '';
    changetype();
  });
  $('#descsearch').keyup(function (e) {
    if (e.keyCode === 13) {
      changetype();
    }
  });
  loadingcommunities = 0;
  lasteventtime = 0;
  communitytype = 0;
  moderationtype = 0;
  defcover = 0;
  showcommunities();
  window.onscroll = showcommunities;
});
