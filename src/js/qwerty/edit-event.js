/* eslint-disable camelcase, no-use-before-define, no-undef, no-param-reassign, prefer-destructuring, no-unused-vars, no-var, block-scoped-var, vars-on-top, no-redeclare, no-constant-condition */

// #region : document ready
$(document).ready(() => {
  searchcities('{$event_country}');

  $('#cclist').change(() => {
    const servicecountry = document.getElementById('cclist').value;
    if (servicecountry !== '{$event_country}') {
      document.getElementById('this_region').value = '';
      document.getElementById('this_region_lng').value = '';
      searchcities(servicecountry);
    } else {
      document.getElementById('this_region').value = '{$event_region}';
      document.getElementById('this_region_lng').value = '{$event_region_lng}';
    }
  });

  wheight = $(window).height() * 0.35;

  activeEditor = tinymce.init({
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
          currenteditor = 'editortext';
          addpicture(-1);
        },
      });
    },
  });

  activeEditor = tinymce.init({
    selector: '#editortextins',

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
          currenteditor = 'editortextins';
          addpicture(-1);
        },
      });
    },
  });

  $(document).on('focusin', (e) => {
    if ($(e.target).closest('.mce-window, .moxman-window').length) {
      e.stopImmediatePropagation();
    }
  });
  if ({$event[id]} === 0) {
    $('#deletebutton').hide();
  }
  searchindustry();

  // TODO: Remove me when replace datetimepicker with input='date'
  $('.startdate').datetimepicker({
    {$datetimepicker_locale}
    // prettier-ignore
    weekStart: {$weekstart},
    todayBtn: 1,
    autoclose: 1,
    todayHighlight: 1,
    startView: 2,
    forceParse: 0,
    showMeridian: 1,
    calendarWeeks: 1,
    format: 'yyyy-mm-dd hh:ii',
  });

  // TODO: Remove me when replace datetimepicker with input='date'
  $('.enddate').datetimepicker({
    {$datetimepicker_locale}
    // prettier-ignore
    weekStart: {$weekstart},
    todayBtn: 1,
    autoclose: 1,
    todayHighlight: 1,
    startView: 2,
    forceParse: 0,
    showMeridian: 1,
    calendarWeeks: 1,
    format: 'yyyy-mm-dd hh:ii',
  });

  $('#UserFile_editortext').change(() => {
    loadeditorfile('editortext');
  });

  $('#UserFile_editortextins').change(() => {
    loadeditorfile('editortextins');
  });
  changeprovide();
  showprice();
  onlinechange();
});

// #endregion

function onlinechange() {
  if (document.getElementById('online1').checked) {
    $('.onlinetype').show();
  } else {
    $('.onlinetype').hide();
  }
}

function saverecord() {
  tinymce.activeEditor.save(); // Never delete, in order to avoid problems of inconsistency of the saved text with the data from the editor.
  const industries = document.getElementById('industries').value;
  const fromtime = document.getElementById('fromtime').value;
  const totime = document.getElementById('totime').value;
  if (fromtime === '' || totime === '') {
    bootpopup.alert('Choose the correct event period.', 'Please note');
    return;
  }
  if (fromtime > totime) {
    bootpopup.alert(
      'The start time of the event cannot be longer than the end time!',
      'Please note'
    );
    return;
  }
  const eventtype = document.getElementById('eventtype').value;
  if (eventtype === 0) {
    bootpopup.alert('You must select the type of event!', 'Please note');
    return;
  }
  var legalname = '';
  if (document.getElementById('whoprovides1').checked) {
    var legalname = document.getElementById('legalname').value;
    if (legalname === '') {
      bootpopup.alert(
        'Enter the name of the company organizing the event!',
        'Please note'
      );
      return;
    }
  }
  var country_code = '';
  var this_region = '';
  var this_region_lng = '';
  var this_address = '';
  if (document.getElementById('locationtype1').checked) {
    var country_code = document.getElementById('cclist').value;
    var this_region = document.getElementById('this_region').value;
    var this_region_lng = document.getElementById('this_region_lng').value;
    var this_address = document.getElementById('location_address').value;
    if (this_region_lng === '') {
      bootpopup.alert('You did not specify your location!', 'Please note');
      return;
    }
  }
  var online = 0;
  if (document.getElementById('online1').checked) {
    var online = 1;
  }
  var onlinetype = 0;
  if (document.getElementById('onlinetype2').checked) {
    var onlinetype = 1;
  }
  const title = document.getElementById('title').value;
  if (title === '') {
    bootpopup.alert('You have not entered event name!', 'Please note');
    return;
  }
  const curr = document.getElementById('usercurr').value;
  var cost = parseInt(document.getElementById('cost').value, 10);
  if ($('#pricemode0').prop('checked')) {
    var cost = 0;
  }
  if ($('#pricemode1').prop('checked') && cost === 0) {
    bootpopup.alert(
      'Indicate the cost of participation in the event!',
      'Please note'
    );
    return;
  }
  $('#editortext').html(tinymce.get('editortext').getContent());
  const details = $('#editortext').val();
  if (details.length < 255) {
    bootpopup.alert(
      'Provide maximum information about the event!',
      'Please note'
    );
    return;
  }
  if (details.length > 32767) {
    bootpopup.alert(
      `The length of the text can not be more than 32767 characters! The current text length - ${details.length}`,
      'Please note'
    );
    return;
  }
  $('#editortextins').html(tinymce.get('editortextins').getContent());
  const instruction = $('#editortextins').val();
  if (instruction.length < 5) {
    bootpopup.alert(
      'Enter the accompanying information or instructions for the participants of the event!',
      'Please note'
    );
    return;
  }
  if (instruction.length > 32767) {
    bootpopup.alert(
      `The length of the instructions for the participants can not be more than 32767 characters! The current text length - ${instruction.length}`,
      'Please note'
    );
    return;
  }
  var enabled = 1;
  if (document.getElementById('enabled1').checked) {
    var enabled = 0;
  }
  var payonline = 1;
  if (document.getElementById('payonline0').checked) {
    var payonline = 0;
  }
  const thisphoto_b64 = document.getElementById('thisphoto_b64').value;
  $('#p_prldr').show();
  $.post('./saveevent.php', {
    id: {$event[id]},
    recstatus: 'edit',
    legalname,
    industries,
    title,
    fromtime,
    totime,
    details,
    instruction,
    online,
    onlinetype,
    country_code,
    this_region,
    this_region_lng,
    this_address,
    eventtype,
    cost,
    curr,
    payonline,
    thisphoto_b64,
    enabled,
  }).done((data) => {
    data = $.parseJSON(data);
    if (data[0] !== 'OK') {
      $('#p_prldr').delay(100).fadeOut('slow');
      bootpopup.alert(data[0], 'Please note');
    } else {
      tinymce.remove();
      $('#editortext').hide();
      window.location.href = `/event/${data[1]}`;
    }
  });
}

function deleterecord() {
  bootpopup.confirm(
    'Are you sure you want to delete this entry?',
    'Confirmation request',
    (ans) => {
      if (ans) {
        $('#p_prldr').show();
        $.post('./saveevent.php', {
          id: {$event[id]},
          recstatus: 'delete',
        }).done((data) => {
          data = $.parseJSON(data);
          if (data[0] !== 'OK') {
            $('#p_prldr').delay(100).fadeOut('slow');
            bootpopup.alert(data[0], 'Error');
          } else {
            tinymce.remove();
            $('#editortext').hide();
            window.location.href = '/events';
          }
        });
      }
    }
  );
}

function loadeditorfile(editorid) {
  const { files } = document.getElementById(`UserFile_${editorid}`);
  if (files.length === 0) {
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
  fileReader.onload = (fileLoadedEvent) => {
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
      },
      xhr() {
        const xhr = $.ajaxSettings.xhr();
        xhr.upload.onprogress = (e) => {
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
        if (data[0] !== 'OK') {
          bootpopup.alert(data[0], 'Error');
        } else {
          const thiscontent = tinymce.get(editorid).getContent();
          tinymce
            .get(editorid)
            .setContent(
              `${thiscontent}<p><strong>Download:</strong> <a href="/file/${data[1]}?oid=u{$user_id}">${filename}</a> (${data[3]})</p>`
            );
        }
      },
      error(jqXHR, exception) {
        $('#uploadingwin').modal('hide');
        let msg = '';
        if (jqXHR.status === 0) {
          msg = 'Not connect.\n Verify Network.';
        } else if (jqXHR.status === 404) {
          msg = 'Requested page not found. [404]';
        } else if (jqXHR.status === 413) {
          msg = 'File is too big!';
        } else if (jqXHR.status === 500) {
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
  fileReader.onerror = (error) => {
    $('#uploadingwin').modal('hide');
    alert(error);
  };
  fileReader.readAsDataURL(fileToLoad);
}

function changeprovide() {
  if (document.getElementById('whoprovides1').checked) {
    $('#pagesdiv').show();
  } else {
    $('#pagesdiv').hide();
  }
  if (document.getElementById('locationtype1').checked) {
    $('#mylocation').show();
  } else {
    $('#mylocation').hide();
  }
}

function showprice() {
  if ($('#payonline1').prop('checked')) {
    $('#paycom').show();
  } else {
    $('#paycom').hide();
  }
  if ($('#pricemode1').prop('checked')) {
    $('#pricediv').show();
  } else {
    $('#pricediv').hide();
  }
}
