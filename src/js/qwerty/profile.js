/* eslint-disable */
// #region
$(document).ready(() => {
  userphone = '{$userdata[phone]}';
  if (document.location.href.indexOf('wmprofile.com') != -1) {
    document.getElementById('notwmprofile').style.display = 'none';
    document.getElementById('myblogstab').style.display = 'none';
  } else {
    const notWmProfile = document.getElementById('notwmprofile');
    if (notWmProfile) {
      notWmProfile.style.display = 'block';
    }
  }
  if (document.location.href.indexOf('visitorsale.com') != -1) {
    document.getElementById('notvs').style.display = 'none';
    document.getElementById('notificationstab').style.display = 'none';
    document.getElementById('myblogstab').style.display = 'none';
  } else {
    document.getElementById('notvs').style.display = 'block';
  }
  if (document.location.href.indexOf('hightech.edu.eu') != -1) {
    document.getElementById('myblogstab').style.display = 'none';
    document.getElementById('sitestab').style.display = 'none';
  }
  if (document.location.href.indexOf('icg') != -1) {
    document.getElementById('myblogstab').style.display = 'none';
    document.getElementById('sitestab').style.display = 'none';
  }
  if (document.location.href.indexOf('wmworker.com') != -1) {
    document.getElementById('myblogstab').style.display = 'none';
  } else {
    document.getElementById('wmworkerletters').style.display = 'none';
  }
  if (document.location.href.indexOf('worldvet') != -1) {
    document.getElementById('myblogstab').style.display = 'none';
    document.getElementById('sitestab').style.display = 'none';
    document.getElementById('wmworkerletters').style.display = 'none';
  }
  document.getElementById(
    'birthdatemonth'
  ).options[{$userdata[birthdatemonth]}].selected = true;
  document.getElementById(
    'gender'
  ).options[{$userdata[gender]}].selected = true;
  // prettier-ignore
  document.getElementById('checkip').checked = {$checkip_logic};
  // prettier-ignore
  document.getElementById('birthdateshow').checked = {$birthdateshow_logic};
  // prettier-ignore
  document.getElementById('hidelocation').checked = {$hidelocation_logic};
  // prettier-ignore
  document.getElementById('notify1').checked = {$notify1_logic};
  // prettier-ignore
  document.getElementById('notify2').checked = {$notify2_logic};
  // prettier-ignore
  document.getElementById('notify3').checked = {$notify3_logic};
  // prettier-ignore
  document.getElementById('notify4').checked = {$notify4_logic};
  // prettier-ignore
  document.getElementById('notify5').checked = {$notify5_logic};
  // prettier-ignore
  document.getElementById('notify6').checked = {$notify6_logic};

  clienttime = new Date();
  ClientTimeZoneOffset = -clienttime.getTimezoneOffset() / 60;
  tinymce.remove();
  tinymce.init({
    selector: '#aboutme',

    skin: 'custom',
    toolbar: 'undo redo | myimage | ltr rtl',
    plugins: 'directionality',
    content_style: 'body { -moz-osx-font-smoothing: grayscale; -webkit-font-smoothing: antialiased; background-color: #fcfcfd; color: #1a2632; font-family: -apple-system, "Helvetica Neue", Roboto, Helvetica, Arial, "Noto Sans", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"; font-size: 16px; font-weight: 400; line-height: 24px;  padding-right: 24px; padding-left: 24px; }',
    invalid_elements: 'style,span,a',
    statusbar: false,
    menubar: false,
    branding: false,
    remove_script_host: true,
    relative_urls: false,
    keep_styles: false,

    {$tinymcelng}

  });
  searchcities('{$user_country}');
  $('#cclist').change(function () {
    const usercountry = document.getElementById('cclist').value;
    if (usercountry != '{$user_country}') {
      document.getElementById('user_region').value = '';
      document.getElementById('user_region_lng').value = '';
    } else {
      document.getElementById('user_region').value = '{$user_region}';
      document.getElementById('user_region_lng').value = '{$user_region_lng}';
    }
    searchcities(usercountry);
  });
  mailretry = 0;
});
// #endregion

function showprofilephoto() {
  const image = $('#PhotoFile');
  if (image[0].files && image[0].files[0]) {
    resizeFile(image[0].files[0], $('#profilephoto'), $('#photo_b64'));
  }
}

function changemail() {
  document.getElementById('email').disabled = false;
  document.getElementById('email').focus();
  document.getElementById('changemaillink').style.display = 'none';
  document.getElementById('savemaillink').style.display = 'inline-block';
}

function changephone() {
  document.getElementById('smscode').value = '';
  document.getElementById('phone').disabled = false;
  document.getElementById('phone').focus();

  document.querySelectorAll('[data-role="change-phone"]').forEach((el) => {
    el.style.display = 'none';
  });

  document.getElementById('savephonelink').style.display = 'inline-block';
  document.getElementById('phonetext').style.display = 'block';
}

function cancelsavemail() {
  document.getElementById('email').value = '{$userdata[email]}';
  document.getElementById('email').disabled = true;
  document.getElementById('changemaillink').style.display = 'inline-block';
  document.getElementById('savemaillink').style.display = 'none';
}

function cancelsavephone() {
  document.getElementById('phone').value = userphone;
  document.getElementById('smscode').value = '';
  document.getElementById('phone').disabled = true;

  document.querySelectorAll('[data-role="change-phone"]').forEach((el) => {
    el.style.display = 'inline-block';
  });

  document.getElementById('savephonelink').style.display = 'none';
  document.getElementById('phonetext').style.display = 'none';
  document.getElementById('enterconfirmcode').style.display = 'none';
}

function savemail() {
  mailfunc = 'savemail()';
  mailretry += 1;
  const newmail = document.getElementById('email').value;
  if (newmail != '{$userdata[email]}' && newmail != '') {
    document.getElementById('email').disabled = true;
    document.getElementById('changemaillink').style.display = 'none';
    document.getElementById('savemaillink').style.display = 'none';
    $.post('./savesettings.php', {
      email: newmail,
      lng: '{$user_lng}',
      mailretry,
      // prettier-ignore
      checkID: {$startruntime},
    }).done(function (data) {
      if (data != 'OK') {
        document.getElementById('email').value = '{$userdata[email]}';
        bootpopup.alert(data, 'Error');
      } else {
        mailmsg(mailretry);
      }
      document.getElementById('email').disabled = true;
      document.getElementById('changemaillink').style.display = 'inline-block';
      document.getElementById('savemaillink').style.display = 'none';
    });
  } else {
    document.getElementById('email').disabled = true;
    document.getElementById('changemaillink').style.display = 'inline-block';
    document.getElementById('savemaillink').style.display = 'none';
  }
}

function savephone() {
  const newphone = document.getElementById('phone').value;
  const smscode = document.getElementById('smscode').value;
  document.getElementById('smscode').value = '';
  if (newphone != userphone && newphone != '') {
    document.getElementById('phone').disabled = true;

    document.querySelectorAll('[data-role="change-phone"]').forEach((el) => {
      el.style.display = 'none';
    });

    document.getElementById('savephonelink').style.display = 'none';
    document.getElementById('enterconfirmcode').style.display = 'none';
    $.post('./confirmphone.php', {
      phone: newphone,
      smscode,
      lng: '{$user_lng}',
      // prettier-ignore
      checkID: {$startruntime},
    }).done(function (data) {
      if (data != 'OK') {
        bootpopup.alert(data, 'Error');
        if (smscode == '') {
          document.getElementById('phone').value = userphone;
          document.getElementById('enterconfirmcode').style.display = 'none';
        } else {
          document.getElementById('enterconfirmcode').style.display = 'block';
        }
      } else if (smscode == '') {
        bootpopup.alert(
          'The SMS message with a confirmation code will be sent to your phone number.',
          'Please note'
        );
        document.getElementById('enterconfirmcode').style.display = 'block';
      } else {
        userphone = newphone;
        bootpopup.alert('New phone number saved successfully', 'Please note');
      }
      document.getElementById('phone').disabled = true;

      document.querySelectorAll('[data-role="change-phone"]').forEach((el) => {
        el.style.display = 'inline-block';
      });

      document.getElementById('savephonelink').style.display = 'none';
      document.getElementById('phonetext').style.display = 'none';
    });
  } else {
    document.getElementById('phone').disabled = true;

    document.querySelectorAll('[data-role="change-phone"]').forEach((el) => {
      el.style.display = 'inline-block';
    });

    document.getElementById('savephonelink').style.display = 'none';
    document.getElementById('enterconfirmcode').style.display = 'none';
    document.getElementById('phonetext').style.display = 'none';
  }
}

function savesettings() {
  tinymce.get('aboutme').save();
  $('#' + 'aboutme').html(tinymce.get('aboutme').getContent());
  const aboutmehtml = $('#aboutme').val();
  if (aboutmehtml.length > 60000) {
    bootpopup.alert(
      `The length of the text "About me" should be no more than 60000 symbols! The current text length - ${aboutmehtml.length}`,
      'Please note'
    );
    return;
  }
  const photo_b64 = document.getElementById('photo_b64').value;
  const firstname = document.getElementById('firstname').value;
  const surname = document.getElementById('surname').value;
  const nickname = document.getElementById('nickname').value;
  const birthdateday = document.getElementById('birthdateday').value;
  const birthdatemonth = document.getElementById('birthdatemonth').value;
  const birthdateyear = document.getElementById('birthdateyear').value;
  const gender = document.getElementById('gender').value;
  const userUTC = document.getElementById('userUTC').value;
  const usercountry = document.getElementById('cclist').value;
  const user_region = document.getElementById('user_region').value;
  const user_region_lng = document.getElementById('user_region_lng').value;
  const oldpwd = document.getElementById('oldpwd').value;
  const newpwd1 = document.getElementById('newpwd1').value;
  const newpwd2 = document.getElementById('newpwd2').value;
  const checkip = document.getElementById('checkip').checked;
  const birthdateshow = document.getElementById('birthdateshow').checked;
  const hidelocation = document.getElementById('hidelocation').checked;
  const notify1 = document.getElementById('notify1').checked;
  const notify2 = document.getElementById('notify2').checked;
  const notify3 = document.getElementById('notify3').checked;
  const notify4 = document.getElementById('notify4').checked;
  const notify5 = document.getElementById('notify5').checked;
  const notify6 = document.getElementById('notify6').checked;
  $('#p_prldr').show();
  $.post('./savesettings.php', {
    photo_b64,
    firstname,
    surname,
    nickname,
    gender,
    birthdateday,
    birthdatemonth,
    birthdateyear,
    userUTC,
    usercountry,
    user_region,
    user_region_lng,
    oldpwd,
    newpwd1,
    newpwd2,
    checkip,
    birthdateshow,
    hidelocation,
    aboutmehtml,
    notify1,
    notify2,
    notify3,
    notify4,
    notify5,
    notify6,
    lng: '{$user_lng}',
    // prettier-ignore
    checkID: {$startruntime},
  }).done(function (data) {
    $('#p_prldr').delay(100).fadeOut('slow');
    if (data != 'OK') {
      bootpopup.alert(data, 'Error');
    } else {
      window.scrollTo(0, 0);
      $.toast({
        text: 'Saved successfully!',
        textAlign: 'center',
        position: 'mid-center',
        icon: 'success',
        showHideTransition: 'fade',
        hideAfter: 3000,
        loader: true,
        stack: 5,
      });
    }
  });
}

function addblog() {
  $('#addblogform').modal('show');
}

function showaddress(LastKeyCode) {
  if (LastKeyCode != 13) {
    const newblog = document.getElementById('blogname').value;
    document.getElementById('message').innerHTML = '';
    if (newblog != '') {
      fontpt = 20;
      if (newblog.length > 5) fontpt = 16;
      if (newblog.length > 10) fontpt = 14;
      if (newblog.length > 13) fontpt = 12;
      if (newblog.length > 17) fontpt = 10;
      if (newblog.length > 24) fontpt = 8;
      document.getElementById(
        'newaddress'
      ).innerHTML = `<span style="font-family: Courier; font-size: ${fontpt}px; color: var(--color-ink-base);">${newblog}.qwerty.blog</span>`;
    } else {
      document.getElementById('newaddress').innerHTML = '';
    }
  }
}

function regblog() {
  const newblog = document.getElementById('blogname').value;
  if (newblog != '') {
    $('#p_prldr').show();
    $.post('register.php', {
      blogname: newblog,
      lng: '{$user_lng}',
      // prettier-ignore
      checkID: {$startruntime},
      userUTC: ClientTimeZoneOffset,
    }).done(function (data) {
      if (data.indexOf(newblog) + 1) {
        location.href = data;
      } else {
        $('#p_prldr').delay(100).fadeOut('slow');
        document.getElementById(
          'message'
        ).innerHTML = `<font color="red">${data}</font>`;
        document.getElementById('newaddress').innerHTML = '';
      }
    });
  }
}

function mailcountdown(stopsec) {
  const seconds = parseInt(new Date().getTime() / 1000);
  showsec = stopsec - seconds;
  if (showsec <= 0 || stopsend == 1) {
    $('#waitsend').hide();
    if (mailretry > 1) {
      $('#difemail').show();
    }
    if (mailretry > 2) {
      $('#resend').hide();
    } else {
      $('#resend').show();
    }
    return;
  }
  $('#waitsec').html(showsec);
  timer = setTimeout(function () {
    mailcountdown(stopsec);
  }, 1000);
}

function mailmsg(argretry) {
  if (argretry == 0) {
    mailretry = argretry;
    stopsend = 1;
    $('#sended').hide();
  } else {
    $('#difemail').hide();
    stopsend = 0;
    showsec = 60;
    $('#waitsec').html(showsec);
    $('#resend').hide();
    $('#waitsend').show();
    $('#sended').show();
    const seconds = parseInt(new Date().getTime() / 1000) + showsec;
    mailcountdown(seconds);
  }
}
