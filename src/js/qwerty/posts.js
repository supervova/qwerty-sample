/* eslint-disable no-undef, no-use-before-define, no-unused-vars */
function getposts() {
  loadingposts = 1;
  document.getElementById('loadingposts').style.display = 'block';
  $.ajax({
    url: './getposts.php',
    type: 'GET',
    async: true,
    data: {
      community: '{$community}',
      publishtime,
      attached,
      blogcatid: '{$blog_cat_id}',
      blogtag: '{$blog_tag}',
      blogdate: '{$blog_date}',
      blogsearch: '{$blog_search}',
      // prettier-ignore
      byuid: {$byuid},
      posttype: '0,1',
    },
    success(response) {
      $('.endposts').remove();
      loadingposts = 0;
      if (publishtime === 0) {
        $('#postsblock').html(response);
      } else {
        $('#postsblock').append(response);
      }
      document.getElementById('loadingposts').style.display = 'none';
      $('[data-toggle="tooltip"]').tooltip();
      showposts();
      if (typeof RePositions === 'function') {
        RePositions();
      }
    },
    error(response) {
      loadingposts = 0;
      document.getElementById('loadingposts').style.display = 'none';
      // console.log('Can’t load records!');
    },
    timeout: 10000,
  });
}

function showposts() {
  if (loadingposts === 0 && currenttab === 'maintab') {
    for (let i = 0; i < $('.endposts').get().length; i++) {
      const item = document.getElementsByClassName('endposts');
      const itemFirst = item[i];
      if (elementInViewport(itemFirst)) {
        getposts();
      }
    }
  }
}
