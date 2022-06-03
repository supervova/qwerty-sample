/* eslint-disable */
function resizeLogo(file, b64field, rW, rH) {
  document.getElementById('savebutton').disabled = true;
  document.getElementById('loadinglogo').style.display = 'block';
  const reader = new FileReader();
  reader.onloadend = function () {
    const tempImg = new Image();
    tempImg.src = reader.result;
    tempImg.onload = function () {
      const tempW = tempImg.width;
      const tempH = tempImg.height;
      imgcrop(this, tempW, tempH, rW, rH, b64field, 0, 0);
      document.getElementById(
        'communitylogo'
      ).style.background = `no-repeat center left url("${$(b64field).val()}")`;
      document.getElementById('communitylogo').style.backgroundSize = 'contain';
      document.getElementById('savebutton').disabled = false;
      document.getElementById('loadinglogo').style.display = 'none';
    };
  };
  reader.readAsDataURL(file);
}

function resizecover(file, b64field, rW, rH) {
  // document.getElementById('loadingphoto').style.display = 'block';
  const reader = new FileReader();
  reader.onloadend = function () {
    const tempImg = new Image();
    tempImg.src = reader.result;
    tempImg.onload = function () {
      // document.getElementById('loadingphoto').style.display = 'none';
      const tempW = tempImg.width;
      const tempH = tempImg.height;
      if (tempW < 800 || tempH < 250) {
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
    };
  };
  reader.readAsDataURL(file);
}

function showlogo() {
  const image = $('#LogoFile');
  if (image[0].files && image[0].files[0]) {
    resizeLogo(image[0].files[0], $('#logo_b64'), 400, 400);
  }
}

function savesettings() {
  address = document.getElementById('address').value;
  lenaddress = address.length;
  if (lenaddress == 0) {
    return;
  }
  const checkregular = /^[A-Za-z0-9.\-_]{0,50}$/;
  if (!checkregular.test(address)) {
    return;
  }
  const blogname = document.getElementById('blogname').value;
  const blogdescription = document.getElementById('blogdescription').value;
  const blogpassword = '';
  const isadult = false;
  const enabled = document.getElementById('enabled').checked;
  const blogaccess = 0;
  const blogpostaccess = 2;
  const blogmoderation = 1;
  const logo_b64 = document.getElementById('logo_b64').value;
  const coverimage64 = document.getElementById('coverimage64').value;
  const journalists_list = document.getElementById('journalists_list').value;
  const administrators_list = document.getElementById(
    'administrators_list'
  ).value;
  const moderators_list = document.getElementById('moderators_list').value;

  global_location = 0;
  if (document.getElementById('globallocation').checked) {
    global_location = 1;
  }
  const postcode = document.getElementById('postcode').value;
  const pagecountry = document.getElementById('cclist').value;
  const pageregion = document.getElementById('pageregion').value;
  const pageregion_lng = document.getElementById('pageregion_lng').value;
  const street = document.getElementById('street').value;
  const house = document.getElementById('house').value;
  const office = document.getElementById('office').value;
  $('#editortext').html(tinymce.get('editortext').getContent());
  const about = $('#editortext').val();
  if (about.length > 32767) {
    bootpopup.alert(
      `The length of the text can not be more than 32767 characters! The current text length - ${about.length}`,
      'Please note'
    );
    return;
  }
  if (global_location == 0 && pagecountry == '') {
    bootpopup.alert('You did not enter the address!', 'Please note');
    return;
  }
  page_type = 1;
  if (document.getElementById('pagetype2').checked) {
    page_type = 2;
  }
  if (document.getElementById('pagetype3').checked) {
    page_type = 3;
  }
  if (document.getElementById('pagetype4').checked) {
    page_type = 4;
  }
  const headname = document.getElementById('headname').value;
  const siteurl = document.getElementById('siteurl').value;
  const email = document.getElementById('email').value;
  const phone = document.getElementById('phone').value;
  const twitter = document.getElementById('twitter').value;
  const vk = document.getElementById('vk').value;
  const facebook = document.getElementById('facebook').value;
  const telegram = document.getElementById('telegram').value;
  const viber = document.getElementById('viber').value;
  const whatsapp = document.getElementById('whatsapp').value;

  document.getElementById('savebutton').disabled = true;
  // document.getElementById('loadingphoto').style.display = 'block';
  $.post('./savecommunity.php', {
    blogaddress: '{$blogaddress}',
    address,
    blogname,
    blogdescription,
    isadult,
    enabled,
    photo_b64: logo_b64,
    coverimage64,
    blogaccess,
    blogpostaccess,
    blogmoderation,
    blogpassword,
    journalists_list,
    moderators_list,
    administrators_list,
    page_type,
    global_location,
    postcode,
    pagecountry,
    pageregion,
    pageregion_lng,
    street,
    house,
    office,
    about,
    headname,
    siteurl,
    email,
    emailcode,
    phone,
    twitter,
    vk,
    facebook,
    telegram,
    viber,
    whatsapp,
    // prettier-ignore
    checkID: {$startruntime},
  }).done(function (data) {
    if (data != 'OK') {
      if (data == 'emailcode' || data == 'invalidcode') {
        document.getElementById('savebutton').disabled = false;
        // document.getElementById('loadingphoto').style.display = 'none';
        if (data == 'invalidcode') {
          alert('Invalid confirmation code!');
        }
        bootpopup({
          title: 'Confirmation code',
          content: [
            '<p>A confirmation code has been sent to your email. Check your mail and enter the verification code: <input id="emailcode" type="text" value=""></p>',
          ],
          ok(data, array, event) {
            emailcode = $('#emailcode').val();
            savesettings();
            return false;
          },
        });
      } else {
        emailcode = '';
        bootpopup.alert(data, 'Error');
        document.getElementById('savebutton').disabled = false;
        // document.getElementById('loadingphoto').style.display = 'none';
      }
    } else {
      tinymce.remove();
      $('#editortext').hide();
      location.href = `/page/${address}`;
    }
  });
}

function unbanuser(ban_user_id, ban_username) {
  bootpopup({
    title: 'Unblock user',
    content: [
      'Are you sure you want to unblock this user?<br />',
      `User: <b>${ban_username}</b>`,
    ],
    cancel(data, array, event) {
      return false;
    },
    ok(data, array, event) {
      $.post('./banuser.php', {
        // prettier-ignore
        checkID: {$startruntime},
        ban_user_id,
        unblock: 1,
      }).done(function (data) {
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

function globallocationcheck() {
  if (document.getElementById('globallocation').checked) {
    $('#addressfields').hide();
  } else {
    $('#addressfields').show();
  }
}

jQuery(document).ready(() => {
  emailcode = '';
  // prettier-ignore
  document.getElementById('enabled').checked = {$blog_settings[enabled]};
  if ('{$page_type}' === '1') {
    document.getElementById('pagetype1').checked = true;
  }
  if ('{$page_type}' === '2') {
    document.getElementById('pagetype2').checked = true;
  }
  if ('{$page_type}' === '3') {
    document.getElementById('pagetype3').checked = true;
  }
  if ('{$page_type}' === '4') {
    document.getElementById('pagetype4').checked = true;
  }
  resizecommunity();
  window.onresize = resizecommunity;
  wheight = $(window).height() * 0.5;
  tinymce.init({
    selector: '#editortext',

    skin: 'custom',
    toolbar: 'formatselect bold italic forecolor | bullist numlist | link myimage media | table | ltr rtl | code',
    plugins: 'directionality, autolink, autosave, code, colorpicker, imagetools, link, lists, media, paste, table',
    content_style: 'body { -moz-osx-font-smoothing: grayscale; -webkit-font-smoothing: antialiased; background-color: #fcfcfd; color: #1a2632; font-family: -apple-system, "Helvetica Neue", Roboto, Helvetica, Arial, "Noto Sans", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"; font-size: 16px; font-weight: 400; line-height: 24px;  padding-right: 24px; padding-left: 24px; }',
    block_formats: 'Paragraph=p; Middle Heading=h2; Small Heading=h3',
    invalid_styles: 'background background-color background-iamge color float font font-size width',
    invalid_elements: 'style,span',
    statusbar: false,
    menubar: false,
    branding: false,
    remove_script_host: true,
    relative_urls: false,
    height: '600',
    {$tinymcelng}

    setup(editor) {
      editor.addButton('myimage', {
        text: false,
        icon: 'image',
        tooltip: 'Upload image',
        onclick() {
          addpicture(-1);
        },
      });
    },
  });
  $('#cclist').change(function () {
    const pagecountry = document.getElementById('cclist').value;
    if (pagecountry != '{$pagecountry}') {
      document.getElementById('pageregion').value = '';
      document.getElementById('pageregion_lng').value = '';
      searchcities(pagecountry);
    } else {
      document.getElementById('pageregion').value = '{$pageregion}';
      document.getElementById('pageregion_lng').value = '{$pageregion_lng}';
    }
  });
  const pagecountry = document.getElementById('cclist').value;
  if (pagecountry != '') {
    searchcities(pagecountry);
  }
  // prettier-ignore
  document.getElementById('globallocation').checked = {$global_location_logic};
  globallocationcheck();
  $(document).on('focusin', function (e) {
    if ($(e.target).closest('.mce-window, .moxman-window').length) {
      e.stopImmediatePropagation();
    }
  });
});
