function getstat() {
  const fromTime = document.getElementById('input-time-from').value;
  const toTime = document.getElementById('input-time-to').value;

  if (fromTime === '' || toTime === '') {
    return;
  }

  const request = new XMLHttpRequest();
  const url = './authorstat.php';
  const params = `from=${fromTime}&to=${toTime}`;

  request.open('POST', url, true);
  request.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
  request.addEventListener('readystatechange', () => {
    if (request.readyState === 4 && request.status === 200) {
      document.getElementById('tbody').innerHTML = request.responseText;
    }
  });
  request.send(params);
}

getstat();
