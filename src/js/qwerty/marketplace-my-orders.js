// TODO: refactor

$(document).ready(function () {
  loadingdata = 0;
  lasteventtime = 0;
  window.onscroll = showblock;
  showblock();
});

function cancelorder(id) {
  bootpopup.confirm(
    'Are you sure you want to cancel this order?',
    'Please note',
    function (ans) {
      if (ans) {
        $.post('./savemporder.php', {
          id,
          order_status: 'order canceled',
        }).done(function (data) {
          data = $.parseJSON(data);
          if (data[0] != 'OK') {
            $('#p_prldr').delay(100).fadeOut('slow');
            bootpopup.alert(data[0], 'Please note');
          } else {
            getnew(100);
          }
        });
      }
    }
  );
}

function payorder(id) {
  const payobject = `mplace|${id}`;
  $.post('./createbill.php', {
    payobject,
    checkID: { $startruntime },
  }).done(function (data) {
    if (data > 0) {
      location.href = `/bill/${data}`;
    } else {
      alert(data);
    }
  });
}
