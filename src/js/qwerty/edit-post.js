/* eslint-disable */

function geo_success(position) {
  $.post('./api/googlemaps.php', {
    latitude: position.coords.latitude,
    longitude: position.coords.longitude,
  }).done(function (data) {
    if (data != '') {
      setgeodata(data, position.coords.latitude, position.coords.longitude);
    } else {
      setgeodata('{$user_geoip_location}', '', '');
    }
  });
}

function geo_error(error) {
  setgeodata('{$user_geoip_location}', '', '');
}

function setgeodata(postlocation, latitude, longitude) {
  document.getElementById('postlocation').value = postlocation;
  document.getElementById('latitude').value = latitude;
  document.getElementById('longitude').value = longitude;
}

function locationdetect(act) {
  if (act) {
    if ('geolocation' in navigator) {
      const geo_options = {
        enableHighAccuracy: true,
        maximumAge: 45000,
        timeout: 30000,
      };

      navigator.geolocation.getCurrentPosition(
        geo_success,
        geo_error,
        geo_options
      );
    } else {
      setgeodata('{$user_geoip_location}', '', '');
    }
  } else {
    setgeodata('', '', '');
  }
}

function choisemood(eid) {
  if (eid == 0) {
    if (document.getElementById('moods').style.display == 'none') {
      document.getElementById('moods').style.display = 'block';
    } else {
      document.getElementById('moods').style.display = 'none';
    }
  }
  if (eid > 0) {
    document.getElementById(
      'emotioninner'
    ).innerHTML = `<img src="/images/emotions/${eid}.png" width="24" height="24" alt="">`;
    document.getElementById(
      'inputemotion'
    ).innerHTML = `<input type="text" name="emotiontext" id="emotiontext" value="${
      document.getElementById(`emotiontext${eid}`).innerHTML
    }" style="margin-left: 5px;"> <button class="btn" type="button" aria-label="Left Align" onclick="choisemood(-1)"><svg class="icon" aria-hidden="true" focusable="false"><use href="/projects/hlaclub.com/images/base/graphics/sprite.svg#icon-close"></use></svg></button>`;
    document.getElementById('inputemotion').style.display = 'block';
    document.getElementById('emotionid').value = eid;
    document.getElementById('moods').style.display = 'none';
  }
  if (eid < 0) {
    document.getElementById('emotioninner').innerHTML = 'Choose your mood';
    document.getElementById('inputemotion').innerHTML =
      '<input type="hidden" name="emotiontext" id="emotiontext" value="">';
    document.getElementById('inputemotion').style.display = 'none';
    document.getElementById('emotionid').value = 0;
    document.getElementById('moods').style.display = 'none';
  }
}

function getcategory() {
  document.getElementById('categorylist').innerHTML = '';
  $.ajax({
    url: './getcategory.php',
    type: 'POST',
    // prettier-ignore
    data: { postid: {$postid}, community: '{$community}' },
    async: true,
    success(response) {
      $('#categorylist').append(response);
    },
    error(response) {
      bootpopup.alert(
        'Sorry, there was some error with the request. Please refresh the page.',
        'Error'
      );
    },
  });
}

function checkcat(catid) {
  var postcategories = document.getElementById('postcategories').value;
  if (document.getElementById(`checkcat${catid}`).checked) {
    var postcategories = `${postcategories}|${catid}|`;
  } else {
    var postcategories = postcategories.replace(`|${catid}|`, '');
  }
  document.getElementById('postcategories').value = postcategories;
}

function deletepost() {
  qwst = '';
  if ('{$blog_post[addays]}' !== '' && '{$blog_post[addays]}' !== '0') {
    if ({$blog_post[user_id]} == {$user_id}) {
      qwst =
        'This is an advertising post. If you delete it, the funds for its publication will NOT be returned!';
    } else {
      qwst =
        'This is an advertising post. If you delete it, the amount of previously received income will be canceled.';
    }
  }
  qwst += ' Are you sure you want to remove this post?';
  bootpopup.confirm(qwst, 'The removal of the post', function (ans) {
    if (ans) {
      $('#p_prldr').show();
      $.post('./removepost.php', {
        // prettier-ignore
        checkID: {$startruntime},
        postid: '{$postid}',
        community: '{$community}',
      }).done(function (data) {
        if (data != 'OK') {
          $('#p_prldr').delay(100).fadeOut('slow');
          bootpopup.alert(data, 'Error');
        } else {
          location.href = '{$addpath}/';
        }
      });
    }
  });
}

function savepost() {
  tinymce.activeEditor.save();
  adperiod = '';
  const emotionid = document.getElementById('emotionid').value;
  const emotiontext = document.getElementById('emotiontext').value;
  const postlocation = document.getElementById('postlocation').value;
  const latitude = document.getElementById('latitude').value;
  const longitude = document.getElementById('longitude').value;
  const posttitle = document.getElementById('posttitle').value;
  if (document.location.href.indexOf('?ad', 0) > 0 && adperiod == '') {
    bootpopup.alert(
      'You did not choose the period of placement of the advertising post!',
      'Please note'
    );
    return;
  }
  if (posttitle.length < 3) {
    bootpopup.alert('Specify the title of this post!', 'Please note');
    return;
  }

  $('#editor').html(tinymce.get('editor').getContent());
  const postbody = $('#editor').val();

  if (postbody.length < 30) {
    bootpopup.alert(
      'The minimum length of the post - 30 characters.',
      'Please note'
    );
    return;
  }
  if (emotiontext.length > 30) {
    bootpopup.alert(
      'Description of emotion should not be more than 30 characters!',
      'Please note'
    );
    return;
  }
  var showcomments = '0';
  if (document.getElementById('showcomments').checked) {
    var showcomments = '1';
  }
  var posttype = '0';
  if (document.getElementById('posttype0').checked) {
    var posttype = '0';
  }
  if (document.getElementById('posttype1').checked) {
    var posttype = '1';
  }
  var accessmode = '0';
  if (document.getElementById('accessmode0').checked) {
    var accessmode = '0';
  }
  if (document.getElementById('accessmode1').checked) {
    var accessmode = '1';
  }
  var donates = '1';
  if (document.getElementById('donates0').checked) {
    var donates = '0';
  }
  var commentsmode = '0';
  if (document.getElementById('commentsmode0').checked) {
    var commentsmode = '0';
  }
  if (document.getElementById('commentsmode1').checked) {
    var commentsmode = '1';
  }
  if (document.getElementById('commentsmode2').checked) {
    var commentsmode = '2';
  }
  const posttags = document.getElementById('posttags').value;
  if (posttags.length > 500) {
    bootpopup.alert('Too many tags!', 'Please note');
    return;
  }
  const postdescription = document.getElementById('postdescription').value;
  if (postdescription.length > 320) {
    bootpopup.alert(
      'Description should not be more than 320 characters!',
      'Please note'
    );
    return;
  }
  const posttime = document.getElementById('posttime').value;
  var attached = '0';
  if (document.getElementById('attached').checked) {
    var attached = '1';
  }
  const postcategories = document.getElementById('postcategories').value;
  const pricecurr = document.getElementById('usercurr').value;
  const price = document.getElementById('price').value;
  if ('{$community_type}' === '1' && price <= 0) {
    bootpopup.alert('You must specify the price of the goods!', 'Please note');
    return;
  }
  $('#p_prldr').show();
  $.post('./savepost.php', {
    emotionid,
    emotiontext,
    postlocation,
    latitude,
    longitude,
    posttitle,
    postbody,
    posttype,
    accessmode,
    donates,
    commentsmode,
    showcomments,
    posttags,
    posttime,
    attached,
    price,
    pricecurr,
    postcategories,
    thumbnailfilename,
    postdescription,
    adperiod,
    // prettier-ignore
    checkID: {$startruntime},
    postid: '{$postid}',
    userutc: '{$user_utc}',
    community: '{$community}',
  }).done(function (data) {
    if (data > 0) {
      tinymce.remove();
      $('#editor').hide();
      location.href = `{$addpath}/${data}`;
    } else {
      $('#p_prldr').delay(100).fadeOut('slow');
      if (data.indexOf('posthash') + 1) {
        data = 'The text of the post must be unique!';
      }
      bootpopup.alert(data, 'Please note');
    }
  });
}

function opengraph(thiscontent) {
  if (getopengraph == 0) {
    getopengraph = 1;
    $.ajax({
      url: './opengraph.php',
      type: 'POST',
      data: { thiscontent, url: '' },
      async: false,
      success(response) {
        response = $.parseJSON(response);
        if (response[0] == 'OK' && response[1] != '') {
          tinyMCE.activeEditor.setContent(
            `${thiscontent + response[1]}<p>&nbsp;</p>`
          );
          tinymce.activeEditor.save();
          titletext = document.getElementById('posttitle').value;
          if (titletext == '' && response[2] != '') {
            document.getElementById('posttitle').value = response[2];
          }
        }
        getopengraph = 0;
      },
    });
  }
}

function selectthumbnail(md5file, filename) {
  if (thumbnailmd5file != '') {
    thn = document.getElementById(`thn${thumbnailmd5file}`);
    img = document.getElementById(`img${thumbnailmd5file}`);
    if ($(`#thn${thumbnailmd5file}`).length > 0) {
      img.style.backgroundColor = '#eaeaea';
      thn.checked = false;
    }
  }
  if (md5file != '') {
    thn = document.getElementById(`thn${md5file}`);
    img = document.getElementById(`img${md5file}`);
    thumbnailfilename = document.getElementById('thumbnailfilename').innerHTML;
    if (thn.checked == true) {
      img.style.backgroundColor = '#b6e1fc';
      thumbnailfilename = filename;
      thumbnailmd5file = md5file;
      document.getElementById('thumbnailfilename').innerHTML =
        thumbnailfilename;
    } else {
      img.style.backgroundColor = '#eaeaea';
      thumbnailfilename = '';
      thumbnailmd5file = '';
      document.getElementById('thumbnailfilename').innerHTML =
        thumbnailfilename;
    }
  } else {
    thumbnailfilename = '';
    thumbnailmd5file = '';
    document.getElementById('thumbnailfilename').innerHTML = thumbnailfilename;
  }
}

function uploadclick() {
  if (canupload) {
    $('#UserFile').prop('disabled', false);
    $('#UserFile').click();
  }
}

function loadfile() {
  const { files } = document.getElementById('UserFile');
  if (files.length == 0) {
    $('#UserFile').prop('disabled', true);
    return;
  }
  const fileToLoad = files[0];
  const fileReader = new FileReader();
  const fileaccess = 1;
  const filename = files[0].name;
  const filedesc = `Attach ${filename}`;
  $('#uploadingwin').modal('show');
  $('#progressbar').show();
  $('#filechecking').hide();
  $('#progressperc').html('');
  $('#progressline').attr('aria-valuenow', '0').css('width', '0%');
  fileReader.onload = function (fileLoadedEvent) {
    filebase64 = fileLoadedEvent.target.result;
    $.ajax({
      type: 'POST',
      url: './uploadfile.php',
      data: {
        filename,
        filebase64,
        fileaccess,
        filedesc,
        md5f: '',
        notuniq: 1,
      },
      xhr() {
        const xhr = $.ajaxSettings.xhr();
        xhr.upload.onprogress = function (e) {
          percentComplete = Math.floor((e.loaded / e.total) * 100);
          $('#progressperc').html(` ${percentComplete}%`);
          if (percentComplete >= 100) {
            $('#progressbar').hide();
            $('#filechecking').show();
          } else {
            $('#progressline')
              .attr('aria-valuenow', percentComplete)
              .css('width', `${percentComplete}%`);
          }
        };
        return xhr;
      },
      success(data) {
        data = $.parseJSON(data);
        $('#uploadingwin').modal('hide');
        if (data[0] != 'OK') {
          bootpopup.alert(data[0], 'Error');
        } else {
          const thiscontent = tinymce.get('editor').getContent();
          tinyMCE.activeEditor.setContent(
            `${thiscontent}<p><strong>Download:</strong> <a href="/file/${data[1]}?oid=u{$user_id}">${filename}</a> (${data[3]})</p>`
          );
          tinymce.activeEditor.save();
        }
        $('#UserFile').prop('disabled', true);
      },
      error(jqXHR, exception) {
        $('#uploadingwin').modal('hide');
        let msg = '';
        if (jqXHR.status === 0) {
          msg = 'Not connect.\n Verify Network.';
        } else if (jqXHR.status == 404) {
          msg = 'Requested page not found. [404]';
        } else if (jqXHR.status == 413) {
          msg = 'File is too big!';
        } else if (jqXHR.status == 500) {
          msg = 'Internal Server Error [500].';
        } else if (exception === 'parsererror') {
          msg = 'Requested JSON parse failed.';
        } else if (exception === 'timeout') {
          msg = 'Time out error.';
        } else if (exception === 'abort') {
          msg = 'Ajax request aborted.';
        } else {
          msg = jqXHR.responseText;
        }
        bootpopup.alert(msg, 'Error');
      },
    });
  };
  fileReader.onerror = function (error) {
    $('#uploadingwin').modal('hide');
    $('#UserFile').prop('disabled', true);
    alert(error);
  };
  fileReader.readAsDataURL(fileToLoad);
}

$(document).ready(() => {
  $('#UserFile').change(function () {
    loadfile();
  });
  // prettier-ignore
  if ({$postid}) {
    if ({$blog_post[emotion]}) {
      document.getElementById('emotionid').value = '{$blog_post[emotion]}';
      // choisemood({$blog_post[emotion]});
      document.getElementById('emotiontext').value =
        '{$blog_post[emotion_descr]}';
    }
    document.getElementById('postlocation').value = '{$blog_post[location]}';
    document.getElementById('latitude').value = '{$blog_post[latitude]}';
    document.getElementById('longitude').value = '{$blog_post[longitude]}';
    if ({$blog_post[showcomments]}) {
      document.getElementById('showcomments').checked = true;
    }
    if ({$blog_post[attached]}) {
      document.getElementById('attached').checked = true;
    }
    document.getElementById('posttype{$blog_post[posttype]}').checked = true;
    document.getElementById(
      'accessmode{$blog_post[accessmode]}'
    ).checked = true;
    document.getElementById('donates{$blog_post[donates]}').checked = true;
    document.getElementById(
      'commentsmode{$blog_post[commentsmode]}'
    ).checked = true;

    pos = document.getElementById('editor').innerHTML.indexOf('&lt;script');
    while (pos != -1) {
      $('#editor').html(function (index, text) {
        return text.replace('&lt;script', '&lt;scriрt');
      });
      pos = document
        .getElementById('editor')
        .innerHTML.indexOf('&lt;script', pos + 1);
    }

    pos = document.getElementById('editor').innerHTML.indexOf('script&gt;');
    while (pos != -1) {
      $('#editor').html(function (index, text) {
        return text.replace('script&gt;', 'scriрt&gt;');
      });
      pos = document
        .getElementById('editor')
        .innerHTML.indexOf('script&gt;', pos + 1);
    }

    pos = document.getElementById('editor').innerHTML.indexOf('/scr');
    while (pos != -1) {
      $('#editor').html(function (index, text) {
        return text.replace('/scr', '&frasl;scr');
      });
      pos = document
        .getElementById('editor')
        .innerHTML.indexOf('/scr', pos + 1);
    }

    thumbnailfilename = '{$blog_post[thumbnail]}';
    thumbnailmd5file = '{$blog_post[thumbnailmd5]}';
    document.getElementById('thumbnailfilename').innerHTML = thumbnailfilename;
  } else {
    document.getElementById('posttype0').checked = true;
    document.getElementById('accessmode0').checked = true;
    document.getElementById('donates1').checked = true;
    document.getElementById('commentsmode0').checked = true;
    document.getElementById('showcomments').checked = true;
    $('.deletebutton').hide();
    thumbnailfilename = '';
    thumbnailmd5file = '';
  }
  wheight = $(window).height() * 0.55;
  getopengraph = 0;
  activeEditor = tinymce.init({
    selector: '#editor',

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
      editor.on('change', function (e) {
        thiscontent = editor.getContent();
        if (
          thiscontent.indexOf('href=') + 1 &&
          thiscontent.indexOf('sharedlink') + 1 == 0
        ) {
          opengraph(thiscontent);
        }
      });
    },
  });
  if ('{$community_type}' !== '1') {
    document.getElementById('pricediv').style.display = 'none';
  } else {
    document.getElementById('posttypediv').style.display = 'none';
  }
  getcategory();
  canupload = true;
});
