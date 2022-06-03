/* eslint-disable */

const qwerty = typeof Qwerty === 'undefined' ? {} : Qwerty;
qwerty.ListProfession = ko.observableArray(['1q', '2q']);
qwerty.ListProfessionSelected = ko.observableArray([]);

const acRenderCallbackFunc = (ul, item) => {
  // console.log(1, ul, item);
  return $('<li>')
    .append(
      `<a><strong ${item.Blacklist ? 'class="text-danger"' : ''}>${
        item.label
      }</strong></a>`
    )
    .appendTo(ul);
};

const acCallbackFunc = (obs, label, ui, ul) => {
  // console.log(2, obs, label(), ui, ul);
  $('#skillstags').tagsinput('add', ui.item.label);
  // console.log(22, ui.item.label);
  // return $("<li>").append("<a><strong "+((item.Blacklist)?"class=\"text-danger\"":"")+">" + item.label + '</strong></a>').appendTo(ul);
};

const resetCallback = (observable, label, ui, event) => {
  // console.log(3, obs, label(), ui);
};

ko.bindingHandlers.autocomplete = {
  init(element, valueAccessor, allBindingsAccessor) {
    const observable = valueAccessor();
    const label = allBindingsAccessor().acLabel || ko.observable();
    let options = allBindingsAccessor().acOptions || {};
    const source = allBindingsAccessor().acSource || false;
    const extraData = allBindingsAccessor().acExtraData || {};
    const response =
      allBindingsAccessor().acResponse ||
      function nothingFound(event, ui) {
        if (ui.content.length === 0) {
          ui.content.push({
            label: 'Nothing found!',
            value: '',
            deps: [],
          });
        }
      };
    const callback =
      allBindingsAccessor().acCallback ||
      // eslint-disable-next-line func-names
      function (o, l, u, e) {
        o(u.item.id);
        l(u.item.value);
      };
    const remoteDataCallback =
      allBindingsAccessor().acRemoteDataCallback || null;
    const resetCallback =
      allBindingsAccessor().acResetCallback ||
      // eslint-disable-next-line func-names
      function (o, l, u, e) {
        o(null);
        l('');
      };
    const renderCallback =
      allBindingsAccessor().acRenderCallback ||
      // eslint-disable-next-line func-names
      function (ul, item) {
        return $('<li>')
          .append(item.value ? `<a>${item.label}</a>` : item.label)
          .appendTo(ul);
      };
    const defaultOptions = {
      delay: 500,
      minLength: 2,
      URL: '/',
      useFavorite: 0,
    };
    let onEmptyFavorite = false;
    if (allBindingsAccessor().hasOwnProperty('onEmptyFavorite')) {
      onEmptyFavorite = allBindingsAccessor().onEmptyFavorite;
    }

    options = $.extend(defaultOptions, options);
    if (source) {
      if (ko.isObservable(source)) {
        source.subscribe((newList) => {
          if (document.body.contains(element)) {
            let src = newList;
            if (allBindingsAccessor().acSourceHandler) {
              if (typeof allBindingsAccessor().acSourceHandler === 'function') {
                src = allBindingsAccessor().acSourceHandler(src);
              }
            }
            $(element).autocomplete('option', 'source', src);
          }
        });
        if (Array.isArray(source())) {
          var src = source();
          if (allBindingsAccessor().acSourceHandler) {
            if (typeof allBindingsAccessor().acSourceHandler === 'function') {
              src = allBindingsAccessor().acSourceHandler(src);
            }
          }
        } else {
          throw 'Invoking source gives an instance of non array type (autocomplete custom binding)';
        }
      } else {
        throw 'Given source for the autocomplete custom binding is not observable';
      }
    } else {
      var src = (request, response) => {
        const inp = this.element;
        const bg = inp.data('oldBG');

        sendData = $.extend({ term: request.term }, ko.unwrap(extraData));
        if (options.useFavorite && request.term === '') {
          sendData.favorite = 1;
        }

        inp.css('backgroundImage', 'URL(/img/animated-overlay.gif)');
        $.ajax({
          url: ko.unwrap(options.URL),
          dataType: 'json',
          method: options.Method || 'POST',
          data: sendData,
          success(data) {
            inp.css('backgroundImage', bg);
            if (remoteDataCallback) {
              data = remoteDataCallback(data);
            }
            response(data);
            options.useFavorite = 0;
          },
        });
      };
    }

    $(element)
      .val(label())
      .autocomplete({
        minLength: options.minLength,
        create() {
          $(this).data('oldBG', $(this).css('backgroundImage'));

          $(this).data('ui-autocomplete').term = label();
        },
        source: src,
        select(event, ui) {
          setTimeout(() => {
            callback(observable, label, ui, event);
            setTimeout(() => {
              label.valueHasMutated();
            });
            $(element).val(label());
          });
        },
        change(event, ui) {
          setTimeout(() => {
            if (ui.item) {
              return;
            }

            resetCallback(observable, label, ui, event);
            setTimeout(() => {
              label.valueHasMutated();
            });
            // Remove invalid value
            $(element).val('');
            $(element).data('ui-autocomplete').term = '';
          });
        },
        response,
        delay: options.delay,
      });

    if (onEmptyFavorite) {
      inputWraper = $(element).wrap('<div class="input-group">').parent();
      inputWraper.append(
        '<span class="input-group-btn show-favorite-span"></span>'
      );
      inputWraper = $('span.show-favorite-span', inputWraper);

      inputWraper.append(
        '<button class="btn btn-default show-favorite-btn" title="Show favorite"  type="button">' +
          'Favorites</button>'
      );
      ko.applyBindingsToNode($('button.show-favorite-btn', inputWraper)[0], {
        click() {
          options.useFavorite = 1;
          $(element).autocomplete({
            minLength: 0,
          }); /* If search favorite set minLength to zero */
          $(element).autocomplete(
            'search',
            ''
          ); /* If search favorite search empty */
          $(element).autocomplete({
            minLength: options.minLength,
          }); /* If search favorite after search set minLength back */
        },
      });
    }

    if (typeof renderCallback === 'function') {
      $(element).data('ui-autocomplete')._renderItem = renderCallback;
    }

    ko.applyBindingsToNode(element, { value: label });
    // handle disposal (if KO removes by the template binding)
    ko.utils.domNodeDisposal.addDisposeCallback(element, () => {
      $(element).autocomplete();
      $(element).autocomplete('destroy');
    });
  },
};

// #region : ready
$(document).ready(() => {
  searchcities('{$job_country}');

  $('#cclist').change(() => {
    const servicecountry = document.getElementById('cclist').value;
    if (servicecountry !== '{$job_country}') {
      document.getElementById('this_region').value = '';
      document.getElementById('this_region_lng').value = '';
      searchcities(servicecountry);
    } else {
      document.getElementById('this_region').value = '{$job_region}';
      document.getElementById('this_region_lng').value = '{$job_region_lng}';
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

  $(document).on('focusin', (e) => {
    if ($(e.target).closest('.mce-window, .moxman-window').length) {
      e.stopImmediatePropagation();
    }
  });

  if ({$job[id]} == 0) {
    $('#deletebutton').hide();
  }

  searchindustry();

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

  $('#UserFile').change(() => {
    loadfile();
  });

  changeprovide();
  searchisco();
});
// #endregion

function savejob() {
  tinymce.activeEditor.save(); // Never delete, in order to avoid problems of inconsistency of the saved text with the data from the editor.
  legalname = '';
  if (document.getElementById('whoprovides1').checked) {
    legalname = $('#legalname').val();
    if (legalname === '') {
      bootpopup.alert(
        'You have not entered the name of the organization!',
        'Please note'
      );
      return;
    }
  }
  const isco = document.getElementById('isco').value;
  const skillstags = document.getElementById('skillstags').value;
  const industries = document.getElementById('industries').value;
  if (industries === '') {
    bootpopup.alert('No business sector has been selected!', 'Please note');
    return;
  }
  var location_country = '';
  var this_region = '';
  var this_region_lng = '';
  var location_address = '';
  if (document.getElementById('locationtype1').checked) {
    var location_country = document.getElementById('cclist').value;
    var this_region = document.getElementById('this_region').value;
    var this_region_lng = document.getElementById('this_region_lng').value;
    if (this_region_lng === '') {
      bootpopup.alert('You did not specify your location!', 'Please note');
      return;
    }
    var location_address = document.getElementById('location_address').value;
    if (location_address === '') {
      bootpopup.alert(
        'You have not entered the address of the company!',
        'Please note'
      );
      return;
    }
  }
  const title = document.getElementById('title').value;
  if (title === '') {
    bootpopup.alert('You did not specify a job title!', 'Please note');
    return;
  }
  const education = document.getElementById('education').value;
  const experience = document.getElementById('experience').value;
  const salary_curr = document.getElementById('usercurr').value;
  const salary_period = document.getElementById('salary_period').value;
  const salary_value_from = parseInt(
    document.getElementById('salary_value_from').value,
    10
  );
  const salary_value_to = parseInt(
    document.getElementById('salary_value_to').value,
    10
  );

  $('#contactinfo').html(tinymce.get('contactinfo').getContent());
  const contactinfo = $('#contactinfo').val();
  const contactname = $('#contactname').val();
  if (contactinfo === '' || contactname === '') {
    bootpopup.alert(
      'Provide contact information so potential applicants can contact you!',
      'Please note'
    );
    return;
  }
  if (contactinfo.length > 10000) {
    bootpopup.alert(
      `The length of the contact information can not be more than 10000 characters! The current text length - ${contactinfo.length}`,
      'Please note'
    );
    return;
  }

  $('#editortext').html(tinymce.get('editortext').getContent());
  const editortext = $('#editortext').val();
  if (editortext === '') {
    bootpopup.alert(
      'Indicate the full job conditions - the presence or absence of a social package, additional requirements, working conditions, etc.',
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
  $.post('./savejob.php', {
    id: {$job[id]},
    recstatus: 'edit',
    legalname,
    industries,
    isco,
    skillstags,
    title,
    conditions: editortext,
    location_country,
    this_region,
    this_region_lng,
    location_address,
    education,
    experience,
    salary_value_from,
    salary_value_to,
    salary_curr,
    salary_period,
    contactinfo,
    contactname,
    enabled,
    thisphoto_b64,
  }).done((data) => {
    data = $.parseJSON(data);
    if (data[0] !== 'OK') {
      $('#p_prldr').delay(100).fadeOut('slow');
      bootpopup.alert(data[0], 'Please note');
    } else {
      tinymce.remove();
      $('#editortext').hide();
      window.location.href = `/job/${data[1]}`;
    }
  });
}

function deletejob() {
  bootpopup.confirm(
    'Are you sure you want to delete this entry?',
    'Confirmation request',
    (ans) => {
      if (ans) {
        $('#p_prldr').show();
        $.post('./savejob.php', {
          id: {$job[id]},
          recstatus: 'delete',
        }).done((data) => {
          data = $.parseJSON(data);
          if (data[0] !== 'OK') {
            $('#p_prldr').delay(100).fadeOut('slow');
            bootpopup.alert(data[0], 'Error');
          } else {
            tinymce.remove();
            $('#editortext').hide();
            window.location.href = '/jobsearch';
          }
        });
      }
    }
  );
}

function loadfile() {
  const { files } = document.getElementById('UserFile');
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
    // eslint-disable-next-line no-alert
    alert(error);
  };
  fileReader.readAsDataURL(fileToLoad);
}

function addisco(str) {
  $.ajax({
    url: './iscolng.php',
    type: 'POST',
    data: { skill: str, user_lng: '{$read_lng}' },
    async: false,
    success(response) {
      response = $.parseJSON(response);
      if (response[0] === 'OK') {
        $('.typeahead__result').remove();
        $(`#iscotag${response[1]}`).remove();
        var isco = $('#isco').val();
        var isco = isco.replace(`|${response[1]}|`, '');
        var isco = `${isco}|${response[1]}|`;
        $('#isco').val(isco);
        const iscotags = $('#iscotags').html();
        $('#iscotags').html(
          `${iscotags}<div id="iscotag${response[1]}"><span class="tag"><span class="blink">${response[2]}</span><button class="tag__remover" type="button" onclick="delisco(${response[1]})">×</button></span></div>`
        );
        $('#searchbyisco').val('');
        searchisco();
        $('#searchbyisco').focus();
      }
    },
  });
}

function searchisco() {
  $('#searchbyisco').typeahead({
    minLength: 2,
    order: 'asc',
    cache: false,
    maxItem: false,
    offset: false,
    source: {
      ajax: {
        type: 'POST',
        url: '/json.php',
        data: {
          skill: 'ok',
          user_lng: '{$read_lng}',
        },
      },
    },
    callback: {
      onClick(node, a, item, event) {
        addisco(item.display);
        return false;
      },
    },
  });
}
