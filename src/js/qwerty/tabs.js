/* eslint-disable no-unused-vars */

function gopictab() {
  $('#posttab').removeClass('active');
  $('#Mypost').removeClass('active');
  $('#pictab').addClass('active');
  $('#Mypictures').addClass('active');
  window.scrollTo(0, 0);
}

function goposttab() {
  $('#pictab').removeClass('active');
  $('#Mypictures').removeClass('active');
  $('#posttab').addClass('active');
  $('#Mypost').addClass('active');
  window.scrollTo(0, 0);
}
