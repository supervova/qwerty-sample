/* eslint-disable */

function msgreply(msgid) {
  reply_msgid = msgid;
  // prettier-ignore
  if (!{$user_id}) {
    loginform();
    return;
  }
  $('#sellermsg').val('');
  $('#buywin').show();
}

function buyform() {
  reply_msgid = 0;
  // prettier-ignore
  if (!{$user_id}) {
    loginform();
    return;
  }
  if ('{$startup[user_id]}' === '{$user_id}' && '{$user_id}' !== '18') {
    bootpopup.alert('You can not contact yourself!', 'Error');
    return;
  }
  $('#sellermsg').val('');
  $('#buywin').show();
}

function sendorder() {
  if (document.getElementById('iagree').checked != true) {
    bootpopup.alert(
      'You must agree to the transfer of personal data!',
      'Please note'
    );
    return;
  }
  sellermsg = $('#sellermsg').val();
  if (sellermsg == '') {
    bootpopup.alert('You have not entered anything!', 'Please note');
    return;
  }
  document.getElementById('orderbtn').style.display = 'none';
  document.getElementById('orderwait').style.display = 'block';
  $.post('./saveorder.php', {
    parent_id: reply_msgid,
    objectid: 'startup{$startup[id]}',
    sellermsg,
    // prettier-ignore
    checkID: {$startruntime},
  }).done(function (data) {
    if (data == 'OK') {
      document.getElementById('orderwait').style.display = 'none';
      document.getElementById('orderbtn').style.display = 'block';
      $('#buywin').hide();
      bootpopup.alert('Message sent!', 'Please note');
      loadingdata = 0;
      lasteventtime = 0;
      getblock();
    } else {
      document.getElementById('orderwait').style.display = 'none';
      document.getElementById('orderbtn').style.display = 'block';
      bootpopup.alert(data, 'Please note');
    }
  });
}

function getblock() {
  if (loadingdata == 0) {
    loadingdata = 1;
    document.getElementById('loadingdata').style.display = 'block';
    $('.endblock').removeClass('endblock');
    if (lasteventtime == 0) {
      $('#datablock').html('');
    }
    $.ajax({
      url: './getsalemassages.php',
      type: 'POST',
      async: false,
      data: {
        archived,
        lasteventtime,
        objectid: 'startup{$startup[id]}',
        postid: 0,
      },
      success(response) {
        if (lasteventtime == 0) {
          $('#datablock').html(response);
        } else {
          $('#datablock').append(response);
        }
        loadingdata = 0;
        document.getElementById('loadingdata').style.display = 'none';
        showblock();
      },
      error(response) {
        loadingdata = 0;
        getblock();
      },
    });
  }
}

function showarchive(setatchived) {
  loadingdata = 0;
  lasteventtime = 0;
  archived = setatchived;
  if (archived == 1) {
    $('#actualdiv').hide();
    $('#archivediv').show();
  } else {
    $('#actualdiv').show();
    $('#archivediv').hide();
  }
  getblock();
}

function toarchive(msgid) {
  bootpopup({
    title: 'Hide record',
    content: ['Do you really want to hide this entry (send to archive)?'],
    cancel(data, array, event) {
      return false;
    },
    yes(data, array, event) {
      $.post('./servicestatus.php', {
        msgid,
        objectid: 'startup{$startup[id]}',
        statusid: -1,
      }).done(function (data) {
        if (data == 'OK') {
          loadingdata = 0;
          lasteventtime = 0;
          getblock();
        } else {
          bootpopup.alert(data, 'Error');
        }
      });
    },
  });
}

function fromarchive(msgid) {
  $.post('./servicestatus.php', {
    msgid,
    objectid: 'startup{$startup[id]}',
    statusid: -2,
  }).done(function (data) {
    if (data == 'OK') {
      showarchive(0);
    } else {
      bootpopup.alert(data, 'Error');
    }
  });
}

function showblock() {
  if (loadingdata == 0) {
    for (let i = 0; i < $('.endblock').get().length; i++) {
      const item = document.getElementsByClassName('endblock');
      const itemFirst = item[i];
      if (elementInViewport(itemFirst) || lasteventtime == 0) {
        getblock();
      }
    }
  }
}

$(document).ready(() => {
  loadingdata = 0;
  lasteventtime = 0;
  archived = 0;
  window.onscroll = showblock;
  showblock();
});
