/* eslint-disable */

// #region : ready
$(document).ready(() => {
  searchcities('{$startup_country}');

  $('#cclist').change(function () {
    const servicecountry = document.getElementById('cclist').value;
    if (servicecountry != '{$startup_country}') {
      document.getElementById('this_region').value = '';
      document.getElementById('this_region_lng').value = '';
    } else {
      document.getElementById('this_region').value = '{$startup_region}';
      document.getElementById('this_region_lng').value =
        '{$startup_region_lng}';
    }
    searchcities(servicecountry);
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

  contactEditor = tinymce.init({
    selector: '#contactinfo',

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

    height: 100,
    {$tinymcelng}
  });

  $(document).on('focusin', function (e) {
    if ($(e.target).closest('.mce-window, .moxman-window').length) {
      e.stopImmediatePropagation();
    }
  });

  if ({$startup[id]} === 0) {
    $('#deletebutton').hide();
  }

  // TODO: Remove me when replace datetimepicker with input='date'
  $('.form_datetime').datetimepicker({
    {$datetimepicker_locale}
    // prettier-ignore
    weekStart: {$weekstart},
    todayBtn: 1,
    autoclose: 1,
    todayHighlight: 1,
    startView: 2,
    minView: 2,
    forceParse: 0,
    showMeridian: 1,
    calendarWeeks: 1,
    pickTime: false,
    format: 'yyyy-mm-dd',
  });

  $('#UserFile').change(function () {
    loadfile('');
  });

  changeprovide();
  showprice();
  businessplan = '{$businessplan}';
  financialmodel = '{$financialmodel}';
  expertreview = '{$expertreview}';
  invest_stage = '{$startup[invest_stage]}';
  expertsection();
});

// #endregion

function expertsection() {
  if (businessplan == '') {
    $('#businessplan').html(
      '<span style="white-space:nowrap;"><strong><span class="text-danger">file not uploaded</span></strong> <button class="btn btn-xs btn-success" onclick="$(\'#businessplanFile\').click()">upload file</button></span><br><span style="color:#666;">Valid file formats: MS Excel (.xls, .xlsx), MS Word (.doc, .docx), Adobe Acrobat (.pdf)</span><br><a href="#" target="_blank" style="white-space:nowrap;">order the development of a business plan - {$businessplancost}</a>'
    );
  } else {
    $('#businessplan').html(
      `<span style="white-space:nowrap;"><strong><a href="/file/${businessplan}?oid=u{$user_id}">Download business plan</a></strong></span> <span style="white-space:nowrap;"><a href="javascript:void(0)" onclick="deldoc('businessplan')" style="color:#ff0000;">Delete a file</a></span>`
    );
  }

  $('#businessplanFile').change(function () {
    loadfile('businessplan');
  });

  if (financialmodel == '') {
    $('#financialmodel').html(
      '<span style="white-space:nowrap;"><strong><span class="text-danger">file not uploaded</span></strong> <button class="btn btn-xs btn-success" onclick="$(\'#financialmodelFile\').click()">upload file</button></span><br><span style="color:#666;">Valid file formats: MS Excel (.xls, .xlsx), MS Word (.doc, .docx), Adobe Acrobat (.pdf)</span><br><a href="#" target="_blank" style="white-space:nowrap;">order the development of a financial model - {$financialmodelcost}</a>'
    );
  } else {
    $('#financialmodel').html(
      `<span style="white-space:nowrap;"><strong><a href="/file/${financialmodel}?oid=u{$user_id}">Download financial model</a></strong></span> <span style="white-space:nowrap;"><a href="javascript:void(0)" onclick="deldoc('financialmodel')" style="color:#ff0000;">Delete a file</a></span>`
    );
  }

  $('#financialmodelFile').change(function () {
    loadfile('financialmodel');
  });
}

function deldoc(arg) {
  eval(`${arg} = ''`);
  expertsection();
}

function saverecord() {
  tinymce.activeEditor.save(); // Never delete, in order to avoid problems of inconsistency of the saved text with the data from the editor.
  const industries = invest_industries;

  if (industries == '') {
    bootpopup.alert('No business sector has been selected!', 'Please note');
    return;
  }
  var location_country = '';
  var this_region = '';
  var this_region_lng = '';
  if (document.getElementById('locationtype1').checked) {
    var location_country = document.getElementById('cclist').value;
    var this_region = document.getElementById('this_region').value;
    var this_region_lng = document.getElementById('this_region_lng').value;
    if (this_region_lng == '') {
      bootpopup.alert('You did not specify your location!', 'Please note');
      return;
    }
  }
  const title = document.getElementById('title').value;
  if (title == '') {
    bootpopup.alert('You have not entered project name!', 'Please note');
    return;
  }
  const curr = document.getElementById('usercurr').value;
  var cost = parseInt(document.getElementById('cost').value);
  if ($('#pricemode0').prop('checked')) {
    var cost = 0;
  }
  const sharessale = parseInt(document.getElementById('sharessale').value);
  if (sharessale <= 0 || sharessale > 100) {
    bootpopup.alert(
      'Specify the correct percentage of the share that you want to offer to the investor!',
      'Please note'
    );
    return;
  }

  $('#editortext').html(tinymce.get('editortext').getContent());
  const editortext = $('#editortext').val();
  if (editortext.length < 255) {
    bootpopup.alert(
      'Provide maximum information about the project - description, investment conditions, payback forecasts.',
      'Please note'
    );
    return;
  }
  if (editortext.length > 32767) {
    bootpopup.alert(
      `The length of the text can not be more than 32767 characters! The current text length - ${editortext.length}`,
      'Please note'
    );
    return;
  }
  var enabled = 1;
  if (document.getElementById('enabled1').checked) {
    var enabled = 0;
  }
  const thisphoto_b64 = document.getElementById('thisphoto_b64').value;
  $('#p_prldr').show();
  $.post('./savestartup.php', {
    id: {$startup[id]},
    recstatus: 'edit',
    industries,
    title,
    conditions: editortext,
    location_country,
    this_region,
    this_region_lng,
    sharessale,
    cost,
    curr,
    thisphoto_b64,
    businessplan,
    financialmodel,
    invest_stage,
    enabled,
  }).done(function (data) {
    data = $.parseJSON(data);
    if (data[0] != 'OK') {
      $('#p_prldr').delay(100).fadeOut('slow');
      bootpopup.alert(data[0], 'Please note');
    } else {
      tinymce.remove();
      $('#editortext').hide();
      location.href = `/startup/${data[1]}`;
    }
  });
}

function deleterecord() {
  bootpopup.confirm(
    'Are you sure you want to delete this entry?',
    'Confirmation request',
    function (ans) {
      if (ans) {
        $('#p_prldr').show();
        $.post('./savestartup.php', {
          id: {$startup[id]},
          recstatus: 'delete',
        }).done(function (data) {
          data = $.parseJSON(data);
          if (data[0] != 'OK') {
            $('#p_prldr').delay(100).fadeOut('slow');
            bootpopup.alert(data[0], 'Error');
          } else {
            tinymce.remove();
            $('#editortext').hide();
            location.href = '/startups';
          }
        });
      }
    }
  );
}

function loadfile(arg) {
  if (arg == 'businessplan') {
    var { files } = document.getElementById('businessplanFile');
    var filedesc = `Business Plan ${filename}`;
    var validext = 'documents';
  } else if (arg == 'financialmodel') {
    var { files } = document.getElementById('financialmodelFile');
    var filedesc = `Financial Model ${filename}`;
    var validext = 'documents';
  } else {
    var { files } = document.getElementById('UserFile');
    var filedesc = `Attach ${filename}`;
    var validext = '';
  }
  if (files.length == 0) {
    return;
  }
  const fileToLoad = files[0];
  const fileReader = new FileReader();
  const fileaccess = 1;
  var filename = files[0].name;
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
        validext,
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
        } else if (arg == 'businessplan') {
          businessplan = data[1];
          expertsection();
        } else if (arg == 'financialmodel') {
          financialmodel = data[1];
          expertsection();
        } else {
          const thiscontent = tinymce.get('editortext').getContent();
          tinyMCE.activeEditor.setContent(
            `${thiscontent}<p><strong>Download:</strong> <a href="/file/${data[1]}?oid=u{$user_id}">${filename}</a> (${data[3]})</p>`
          );
          tinymce.activeEditor.save();
        }
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
    alert(error);
  };
  fileReader.readAsDataURL(fileToLoad);
  $('#UserFile').val('');
  $('#businessplanFile').val('');
  $('#financialmodelFile').val('');
}

function setstage(arg) {
  invest_stage = arg;
}

function showprice() {
  if ($('#pricemode0').prop('checked')) {
    $('#pricediv').hide();
    $('#paymentsdiv').hide();
  } else {
    $('#pricediv').show();
    $('#paymentsdiv').show();
  }
}
