/* eslint-disable no-unused-vars, no-undef */
function delisco(code) {
  const isco = $('#isco').val().replace(`|${code}|`, '');
  $(`#iscotag${code}`).remove();
  $('#isco').val(isco);
}

function ChangeAddress() {
  address = document.getElementById('address').value;
  lenaddress = address.length;
  lastinputtime = Date.now();

  if (lenaddress === 0 || address === '{$blogaddress}') {
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

  setTimeout(() => {
    thistime = Date.now();
    interval = new Date(thistime - lastinputtime);
    intervalsec = interval.getUTCSeconds();
    if (intervalsec >= 2) {
      // функция проверка свободного адреса:
      $.ajax({
        url: 'checkaddress.php',
        type: 'POST',
        async: false,
        data: { address, oldaddress: '{$blogaddress}' },
        success(response) {
          if (response === 'OK') {
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

function isNumber(n) {
  return /^-?[\d.]+(?:e-?\d+)?$/.test(n);
}
