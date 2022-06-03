/* eslint-disable no-undef, no-use-before-define, no-unused-vars, no-param-reassign */

const publishtime = 0;

function changetype() {
  if (loadingcommunities === 0) {
    setTimeout(() => {
      if (document.getElementById('communitytype1').checked) {
        communitytype = 1;
      } else if (document.getElementById('communitytype2').checked) {
        communitytype = 2;
      } else if (document.getElementById('communitytype3').checked) {
        communitytype = 3;
      } else if (document.getElementById('communitytype4').checked) {
        communitytype = 4;
      } else if (document.getElementById('communitytype5').checked) {
        communitytype = 5;
      } else {
        communitytype = 0;
      }
      lasteventtime = 0;
      getcommunities();
    }, 500);
  }
}

function getcommunities() {
  if (loadingcommunities === 0) {
    loadingcommunities = 1;
    descsearch = document.getElementById('descsearch').value;
    document.getElementById('typesdiv').disable = true;
    document.getElementById('loadingcommunities').style.display = 'block';
    $('.endposts').removeClass('endposts');
    $.ajax({
      url: 'getcommunities.php',
      type: 'GET',
      async: true,
      data: {
        lasteventtime,
        communitytype,
        descsearch,
      },
      success(response) {
        if (lasteventtime === 0) {
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
        getcommunities();
      },
    });
  }
}

function showcommunities() {
  if (loadingcommunities === 0) {
    for (let i = 0; i < $('.endposts').get().length; i++) {
      const item = document.getElementsByClassName('endposts');
      const itemFirst = item[i];
      if (elementInViewport(itemFirst) || publishtime === 0) {
        getcommunities();
      }
    }
  }
}

function newcommunity() {
  // prettier-ignore
  if (!{$user_id}) {
    loginform();
    return;
  }
  document.getElementById('createcommunity').style.display = 'block';
}
