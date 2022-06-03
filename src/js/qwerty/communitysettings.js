/* eslint-disable no-use-before-define, no-undef, no-var, block-scoped-var, vars-on-top, no-redeclare, no-unused-vars, camelcase, no-shadow, no-constant-condition */

function resizeFile(file, b64field, rW, rH) {
  $('#p_prldr').show();
  const reader = new FileReader();
  reader.onloadend = () => {
    const tempImg = new Image();
    tempImg.src = reader.result;
    tempImg.onload = () => {
      const tempW = tempImg.width;
      const tempH = tempImg.height;
      imgcrop(this, tempW, tempH, rW, rH, b64field, 0, 0);
      document.getElementById('communitylogo').style.background = `url("${$(
        b64field
      ).val()}") no-repeat center left`;
      document.getElementById('communitylogo').style.backgroundSize = 'cover';
      $('#p_prldr').delay(100).fadeOut('slow');
    };
  };
  reader.readAsDataURL(file);
}

function resizecover(file, b64field, rW, rH) {
  $('#p_prldr').show();
  const reader = new FileReader();
  reader.onloadend = () => {
    const tempImg = new Image();
    tempImg.src = reader.result;
    tempImg.onload = () => {
      const tempW = tempImg.width;
      const tempH = tempImg.height;
      if (tempW < 800 || tempH < 250) {
        $('#p_prldr').delay(100).fadeOut('slow');
        document.getElementById('coverimage').value = '';
        bootpopup.alert(
          'The image size for the community should be 1600x500 pixels!',
          'Please note'
        );
        return;
      }
      imgcrop(this, tempW, tempH, rW, rH, b64field);
      document.getElementById(
        'coverbg'
      ).style.background = `no-repeat top left url("${$(b64field).val()}")`;
      document.getElementById('coverbg').style.backgroundSize = 'contain';
      $('#p_prldr').delay(100).fadeOut('slow');
    };
  };
  reader.readAsDataURL(file);
}

function imgcrop(image, tempW, tempH, maxW, maxH, elem, strongmode, filetype) {
  const sourceX = 0;
  const sourceY = 0;
  var destWidth = tempW;
  var destHeight = tempH;

  if (strongmode === 0) {
    if (tempW > maxW) {
      var destWidth = maxW;
      var destHeight = destHeight * (maxW / tempW);
    }
    if (destHeight > maxH) {
      var destWidth = tempW;
      var destHeight = tempH;
      var destHeight = maxH;
      var destWidth = destWidth * (maxH / tempH);
    }
  } else {
    var destWidth = maxW;
    var destHeight = maxH;
  }
  const destX = 0;
  const destY = 0;

  const canvas = document.createElement('canvas');
  canvas.width = destWidth;
  canvas.height = destHeight;

  const ctx = canvas.getContext('2d');
  ctx.drawImage(
    image,
    sourceX,
    sourceY,
    tempW,
    tempH,
    destX,
    destY,
    destWidth,
    destHeight
  );
  if (filetype === 1) {
    var dataURL = canvas.toDataURL('image/jpeg');
  } else {
    var dataURL = canvas.toDataURL('image/png');
  }
  $(elem).val(dataURL);
}

function showlogo() {
  const image = $('#PhotoFile');
  if (image[0].files && image[0].files[0]) {
    resizeFile(image[0].files[0], $('#photo_b64'), 400, 400);
  }
}

function showcoverimage() {
  const image = $('#coverimage');
  if (image[0].files && image[0].files[0]) {
    resizecover(image[0].files[0], $('#coverimage64'), 1600, 500);
  }
}

function autocost() {
  document.getElementById('cost24').value = {$autocost24};
  document.getElementById('cost48').value = {$autocost48};
  document.getElementById('cost96').value = {$autocost96};
  document.getElementById('cost7').value = {$autocost7};
  document.getElementById('cost30').value = {$autocost30};
  document.getElementById('costunlim').value = {$autocostunlim};
}

function savesettings() {
  const blogname = document.getElementById('blogname').value;
  const blogdescription = document.getElementById('blogdescription').value;
  const blogpassword = document.getElementById('blogpassword').value;
  const journalists_list = document.getElementById('journalists_list').value;
  const administrators_list = document.getElementById(
    'administrators_list'
  ).value;
  const moderators_list = document.getElementById('moderators_list').value;
  const cost24 = document.getElementById('cost24').value;
  const cost48 = document.getElementById('cost48').value;
  const cost96 = document.getElementById('cost96').value;
  const cost7 = document.getElementById('cost7').value;
  const cost30 = document.getElementById('cost30').value;
  const costunlim = document.getElementById('costunlim').value;

  const subscribecost7 = document.getElementById('subscribecost7').value;
  const subscribecost30 = document.getElementById('subscribecost30').value;
  const subscribecost182 = document.getElementById('subscribecost182').value;
  const subscribecost365 = document.getElementById('subscribecost365').value;
  const subscribecostunlim =
    document.getElementById('subscribecostunlim').value;

  const isadult = document.getElementById('isadult').checked;
  const enabled = document.getElementById('enabled').checked;
  const noover = document.getElementById('noover').checked;
  var blogaccess = '';
  var blogpostaccess = '';
  var blogmoderation = '';
  if (document.getElementById('blogaccess0').checked) {
    var blogaccess = 0;
  }
  if (document.getElementById('blogaccess1').checked) {
    var blogaccess = 1;
  }
  if (document.getElementById('blogaccess2').checked) {
    var blogaccess = 2;
  }
  if (document.getElementById('blogpostaccess0').checked) {
    var blogpostaccess = 0;
  }
  if (document.getElementById('blogpostaccess1').checked) {
    var blogpostaccess = 1;
  }
  if (document.getElementById('blogpostaccess2').checked) {
    var blogpostaccess = 2;
  }
  if (document.getElementById('blogmoderation0').checked) {
    var blogmoderation = 0;
  }
  if (document.getElementById('blogmoderation1').checked) {
    var blogmoderation = 1;
  }
  const photo_b64 = document.getElementById('photo_b64').value;
  const coverimage64 = document.getElementById('coverimage64').value;
  var community_type = -1;
  if (document.getElementById('communitytype0').checked) {
    var community_type = 0;
  }
  if (document.getElementById('communitytype1').checked) {
    var community_type = 1;
  }
  if (document.getElementById('communitytype2').checked) {
    var community_type = 2;
  }
  if (document.getElementById('communitytype3').checked) {
    var community_type = 3;
  }
  if (document.getElementById('communitytype4').checked) {
    var community_type = 4;
  }
  $('#p_prldr').show();
  $.post('./savecommunity.php', {
    blogaddress: '{$blogaddress}',
    blogname,
    blogdescription,
    isadult,
    enabled,
    noover,
    photo_b64,
    coverimage64,
    blogaccess,
    blogpostaccess,
    blogmoderation,
    blogpassword,
    journalists_list,
    moderators_list,
    administrators_list,
    cost24,
    cost48,
    cost96,
    cost7,
    cost30,
    costunlim,
    subscribecost7,
    subscribecost30,
    subscribecost182,
    subscribecost365,
    subscribecostunlim,
    community_type,
    checkID: {$startruntime},
  }).done((data) => {
    if (data !== 'OK') {
      bootpopup.alert(data, 'Error');
      $('#p_prldr').delay(100).fadeOut('slow');
    } else {
      window.location.href = '/community-{$blogaddress}';
    }
  });
}

function unbanuser(ban_user_id, ban_username) {
  bootpopup({
    title: 'Unblock user',
    content: [
      'Are you sure you want to unblock this user?<br>',
      `User: <b>${ban_username}</b>`,
    ],
    cancel(data, array, event) {
      return false;
    },
    ok(data, array, event) {
      $.post('./banuser.php', {
        checkID: {$startruntime},
        ban_user_id,
        unblock: 1,
        community: '{$community}',
      }).done((data) => {
        bootpopup.alert(data, 'Please note');
        document.getElementById(`banned${ban_user_id}`).remove();
      });
    },
  });
}

function resizecommunity() {
  BlockW = document.getElementById('coverbg').offsetWidth;
  BlockH = 500 * (BlockW / 1600);
  document.getElementById('coverbg').style.height = `${BlockH}px`;
  logowidth = BlockH / 2;
  document.getElementById('communitylogo').style.height = `${logowidth}px`;
  document.getElementById('communitylogo').style.width = `${logowidth}px`;
}

function overshow() {
  if (document.getElementById('noover').checked) {
    $('#communitylogo').hide();
    $('#communitydescr').hide();
  } else {
    $('#communitylogo').show();
    $('#communitydescr').show();
  }
}

jQuery(document).ready(() => {
  document.getElementById('isadult').checked={$blog_settings[isadult]};
  document.getElementById('enabled').checked={$blog_settings[enabled]};
  document.getElementById('noover').checked={$blog_settings[noover]};

  if ('{$blog_settings[blogaccess]}' === '0') {
    document.getElementById('blogaccess0').checked = true;
  }
  if ('{$blog_settings[blogaccess]}' === '1') {
    document.getElementById('blogaccess1').checked = true;
  }
  if ('{$blog_settings[blogaccess]}' === '2') {
    document.getElementById('blogaccess2').checked = true;
  }
  if ('{$blog_settings[blogpostaccess]}' === '0') {
    document.getElementById('blogpostaccess0').checked = true;
  }
  if ('{$blog_settings[blogpostaccess]}' === '1') {
    document.getElementById('blogpostaccess1').checked = true;
  }
  if ('{$blog_settings[blogpostaccess]}' === '2') {
    document.getElementById('blogpostaccess2').checked = true;
  }
  if ('{$blog_settings[blogmoderation]}' === '0') {
    document.getElementById('blogmoderation0').checked = true;
  }
  if ('{$blog_settings[blogmoderation]}' === '1') {
    document.getElementById('blogmoderation1').checked = true;
  }
  if ('{$community_type}' === '0') {
    document.getElementById('communitytype0').checked = true;
  }
  if ('{$community_type}' === '1') {
    document.getElementById('communitytype1').checked = true;
  }
  if ('{$community_type}' === '2') {
    document.getElementById('communitytype2').checked = true;
  }
  // if ('{$community_type}' === '3') {
  //   document.getElementById('communitytype3').checked = true;
  // }
  if ('{$community_type}' === '4') {
    document.getElementById('communitytype4').checked = true;
  }
  // if ('{$userdata[isspec]}' === '0') {
  //   document.getElementById('communitytype3').disabled = true;
  // }
  resizecommunity();
  overshow();
  window.onresize = resizecommunity;
});
