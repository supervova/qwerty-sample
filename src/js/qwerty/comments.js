/* eslint-disable no-undef, no-use-before-define, no-unused-vars, no-param-reassign, block-scoped-var, no-var, vars-on-top, no-redeclare, no-shadow */
function fromunixtime() {
  for (let i = 0; i < $('.commentd').get().length; i++) {
    datetext = $(`.commentd:eq(${i})`).text();
    if (datetext.indexOf('unixtime') + 1) {
      datetext = datetext.replace('unixtime', '');
      $(`.commentd:eq(${i})`).text(timestamp2date(datetext));
      $(`.commentdiff:eq(${i})`).text();
    }
  }
  $('.commentd').removeClass('commentd');
  $('.commentdiff').removeClass('commentdiff');
}

function getcomments(startid) {
  loadingcomments = 1;
  $.ajax({
    url: './getcomments.php',
    type: 'GET',
    async: false,
    data: {
      object_id: 'blog{$blog_id}',
      startid,
      gocomment,
      community: '{$community}',
    },
    success(response) {
      $('.endcomments').remove();
      document.getElementById('loadingcomments').style.display = 'none';
      if (startid === 0) {
        $('#commentsblock').html(response);
      } else {
        $('#commentsblock').append(response);
      }
      fromunixtime();
      loadingcomments = 0;
      showcomments();
      $('[data-toggle="tooltip"]').tooltip();
    },
    error(response) {
      document.getElementById('loadingcomments').style.display = 'none';
      loadingcomments = 0;
    },
    timeout: 10000,
  });
}

function showcomments() {
  if (loadingcomments === 0) {
    for (let i = 0; i < $('.endcomments').get().length; i++) {
      fromid = $(`.endcomments:eq(${i})`).attr('id');
      const item = document.getElementsByClassName('endcomments');
      const itemFirst = item[i];
      if (elementInViewport(itemFirst)) {
        getcomments(fromid);
      }
    }
  }
}

function copycommentlink(commentid) {
  url = `{$thispageurl}#comment${commentid}`;
  bootpopup({
    title: 'Link to comment',
    content: [
      '<p>Highlight and copy this link:</p>',
      `<input id="commenturl" type="text" style="width: 100%; line-height: 1.5em; font-size: 1em" value="${url}" onclick="$(this).select();" readonly>`,
    ],
    ok(data, array, event) {
      return false;
    },
  });
}

function votecomment(commentid, objectid, votemode) {
  if (votemode === 1) {
    if (
      document.getElementById(`pluscount${commentid}`).innerHTML === '&nbsp;'
    ) {
      document.getElementById(`pluscount${commentid}`).innerHTML = 0;
    }
    if ($(`#thumbsup${commentid}`).hasClass('vote')) {
      $(`#thumbsup${commentid}`).removeClass('vote');
      $(`#thumbsup${commentid}`).addClass('votedplus');
      document.getElementById(`pluscount${commentid}`).innerHTML =
        document.getElementById(`pluscount${commentid}`).innerHTML * 1 + 1;
    } else if ($(`#thumbsup${commentid}`).hasClass('votedplus')) {
      $(`#thumbsup${commentid}`).removeClass('votedplus');
      $(`#thumbsup${commentid}`).addClass('vote');
      document.getElementById(`pluscount${commentid}`).innerHTML =
        document.getElementById(`pluscount${commentid}`).innerHTML * 1 - 1;
    }
    if ($(`#thumbsdown${commentid}`).hasClass('votedminus')) {
      $(`#thumbsdown${commentid}`).removeClass('votedminus');
      $(`#thumbsdown${commentid}`).addClass('vote');
    }
  }
  if (votemode === 0) {
    if (
      document.getElementById(`minuscount${commentid}`).innerHTML === '&nbsp;'
    ) {
      document.getElementById(`minuscount${commentid}`).innerHTML = 0;
    }
    if ($(`#thumbsdown${commentid}`).hasClass('vote')) {
      $(`#thumbsdown${commentid}`).removeClass('vote');
      $(`#thumbsdown${commentid}`).addClass('votedminus');
      document.getElementById(`minuscount${commentid}`).innerHTML =
        document.getElementById(`minuscount${commentid}`).innerHTML * 1 + 1;
    } else if ($(`#thumbsdown${commentid}`).hasClass('votedminus')) {
      $(`#thumbsdown${commentid}`).removeClass('votedminus');
      $(`#thumbsdown${commentid}`).addClass('vote');
      document.getElementById(`minuscount${commentid}`).innerHTML =
        document.getElementById(`minuscount${commentid}`).innerHTML * 1 - 1;
    }
    if ($(`#thumbsup${commentid}`).hasClass('votedplus')) {
      $(`#thumbsup${commentid}`).removeClass('votedplus');
      $(`#thumbsup${commentid}`).addClass('vote');
      document.getElementById(`pluscount${commentid}`).innerHTML =
        document.getElementById(`pluscount${commentid}`).innerHTML * 1 - 1;
    }
  }
  $.post('./commentvote.php', {
    // prettier-ignore
    checkID: {$startruntime},
    commentid,
    object_id: objectid,
    votemode,
    community: '{$community}',
  }).done((data) => {
    data = $.parseJSON(data);
    if (data[0] === 'plus' || data[0] === 'minus' || data[0] === 'none') {
      if (data[0] === 'plus') {
        if ($(`#thumbsup${commentid}`).hasClass('vote')) {
          $(`#thumbsup${commentid}`).removeClass('vote');
        }
        $(`#thumbsup${commentid}`).addClass('votedplus');
        if ($(`#thumbsdown${commentid}`).hasClass('votedminus')) {
          $(`#thumbsdown${commentid}`).removeClass('votedminus');
        }
        $(`#thumbsdown${commentid}`).addClass('vote');
      }
      if (data[0] === 'minus') {
        if ($(`#thumbsdown${commentid}`).hasClass('vote')) {
          $(`#thumbsdown${commentid}`).removeClass('vote');
        }
        $(`#thumbsdown${commentid}`).addClass('votedminus');
        if ($(`#thumbsup${commentid}`).hasClass('votedplus')) {
          $(`#thumbsup${commentid}`).removeClass('votedplus');
        }
        $(`#thumbsup${commentid}`).addClass('vote');
      }
      if (data[0] === 'none') {
        if ($(`#thumbsup${commentid}`).hasClass('votedplus')) {
          $(`#thumbsup${commentid}`).removeClass('votedplus');
        }
        $(`#thumbsup${commentid}`).addClass('vote');
        if ($(`#thumbsdown${commentid}`).hasClass('votedminus')) {
          $(`#thumbsdown${commentid}`).removeClass('votedminus');
        }
        $(`#thumbsdown${commentid}`).addClass('vote');
      }
      document.getElementById(`pluscount${commentid}`).innerHTML = '&nbsp;';
      document.getElementById(`minuscount${commentid}`).innerHTML = '&nbsp;';
      if (data[1] > 0 && data[1] - 1 > 0) {
        document.getElementById(`pluscount${commentid}`).innerHTML =
          data[1] - 1;
      }
      if (data[2] > 0 && data[2] - 1 > 0) {
        document.getElementById(`minuscount${commentid}`).innerHTML =
          data[2] - 1;
      }
    }
  });
}

function savecomment(replytoid, commentid) {
  tinyMCE.triggerSave();
  if (commentid < 0) {
    commentid = document.getElementById('editcommentid').value;
  }
  commentscore = 0;
  if (replytoid === 0) {
    commentscore = document.getElementById('commentscore').value;
    if (commentscore === 0) {
      bootpopup.alert('Please rate from 1 to 5 points!', 'Please note');
      return;
    }
  }
  if (commentid === 0) {
    var comment = $('#editor').val();
    document.getElementById('savecomment').style.display = 'none';
  } else {
    var comment = $('#commenteditor').val();
  }
  if (comment.length < 5) {
    document.getElementById('savecomment').style.display = 'inline-block';
    bootpopup.alert(
      'The minimum length of the comment - 5 characters.',
      'Please note'
    );
    return;
  }
  $.post('./savecomment.php', {
    comment,
    object_id: 'blog{$blog_id}',
    replytoid,
    commentid,
    commentscore,
    // prettier-ignore
    checkID: {$startruntime},
    community: '{$community}',
    thispageurl: '{$thispageurl}',
  }).done((data) => {
    if (data > 0) {
      if (commentid > 0) {
        document.getElementById(`textcomment${commentid}`).innerHTML = comment;
        if (commentscore > 0) {
          window.location.reload();
        }
      } else {
        replyto(0);
        $.ajax({
          url: './getcomments.php',
          type: 'GET',
          async: true,
          data: {
            object_id: 'blog{$blog_id}',
            commentid: data,
            community: '{$community}',
          },
          success(response) {
            if (replytoid > 0) {
              $(`div.comment${replytoid}:first`).after(response);
            } else {
              $('#replyto0').after(response);
            }
            fromunixtime();
            $('.js-smartPhoto').SmartPhoto();
          },
          error(response) {
            window.location.href = '{$thispageurl}';
          },
        });
      }
      lastcommentedit = 0;
    } else {
      bootpopup.alert(data, 'Please note');
    }
    if (commentid === 0) {
      document.getElementById('savecomment').style.display = 'inline-block';
    }
  });
}

function deletecomment(commentid) {
  const allcomments = 0;
  authorname = document.getElementById(`author${commentid}`).innerHTML;
  bootpopup({
    title: `Delete comment #${commentid}`,
    content: [
      'Are you sure you want to delete this comment?<br />',
      `<label><input id="allcomments" name="allcomments" type="checkbox"> Delete all comments <b>${authorname}</b></label><br />`,
    ],
    cancel(data, array, event) {
      return false;
    },
    ok(data, array, event) {
      if (data.allcomments === 'on') {
        var allcomments = 1;
      } else {
        $(`div.comment${commentid}`).remove();
      }
      replyto(0);
      $.post('./removecomment.php', {
        // prettier-ignore
        checkID: {$startruntime},
        object_id: 'blog{$blog_id}',
        commentid,
        allcomments,
        community: '{$community}',
      }).done((data) => {});
      if (allcomments === 1) {
        getcomments(0);
      }
    },
  });
}

function replyto(commentid) {
  tinymce.remove();
  document.getElementById(`replyto${lastcommentedit}`).innerHTML = '';
  document.getElementById('commentscore').value = 0;
  if (commentid === 0) {
    document.getElementById('postcomment').style.display = 'none';
    ratediv =
      '<div style="text-align:left;">Rate this: <div id="ratestars" style="display:inline-block;"></div></div>';
  } else {
    document.getElementById('postcomment').style.display = 'inline-block';
    ratediv = '';
  }
  lastcommentedit = commentid;
  document.getElementById(
    `replyto${commentid}`
  ).innerHTML = `${ratediv}<textarea id="editor"></textarea><button id="savecomment" type="button" class="btn btn-primary" style="display: inline-block; margin-top: 5px; margin-bottom: 10px;" onclick="savecomment(${commentid},0);">Save comment</button><br />`;
  $('#ratestars').raty({
    cancel: true,
    cancelHint: 'Do not rate',
    cancelPlace: 'right',
    hints: [
      'it’s disgusting',
      'it’s bad',
      'so-so',
      'it’s good',
      'it’s perfectly',
    ],
    click(score, evt) {
      document.getElementById('commentscore').value = score;
    },
  });
  $('[data-toggle="tooltip"]').tooltip();
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

    // prettier-ignore
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
  $('#editor').html('');
}

function editcomment(commentid) {
  document.getElementById('commentscore').value = 0;
  textcomment = document.getElementById(`textcomment${commentid}`).innerHTML;
  document.getElementById('editcommentid').value = commentid;
  commentscore = document.getElementById(`score${commentid}`).value;
  if (commentscore > 0) {
    document.getElementById('commentscore').value = commentscore;
    $('#editstarsdiv').remove();
    $('#commenteditor').before(
      '<div id="editstarsdiv" style="text-align:left;">Rate this: <div id="editstars" style="display:inline-block;"></div></div>'
    );
    $('#editstars').raty({
      score: commentscore,
      cancel: true,
      cancelHint: 'Do not rate',
      cancelPlace: 'right',
      hints: [
        'it’s disgusting',
        'it’s bad',
        'so-so',
        'it’s good',
        'it’s perfectly',
      ],
      click(score, evt) {
        document.getElementById('commentscore').value = score;
      },
    });
    $('[data-toggle="tooltip"]').tooltip();
  }
  $('#editcomment').appendTo('body').modal('show');
  if (edited) {
    tinymce.remove('#commenteditor');
  }
  activeEditor = tinymce.init({
    selector: '#commenteditor',

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

    // prettier-ignore
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
  edited = true;
  tinyMCE.activeEditor.setContent(textcomment);
}

function abusecomment(commentid) {
  // prettier-ignore
  if (!{$user_id}) {
    loginform();
    return;
  }
  url = `{$thispageurl}&reviews#comment${commentid}`;
  authorname = document.getElementById(`author${commentid}`).innerHTML;
  bootpopup({
    title: 'Report abuse',
    content: [
      `Comment #<b>${commentid}</b><br />`,
      `User: <b>${authorname}</b><br />`,
      'A description of the problem or the essence of the claims:',
      {
        textarea: {
          name: 'abusetext',
          id: 'abusetext',
          style: 'width: 100%; height: 100px;',
        },
      },
    ],
    cancel(data, array, event) {
      return false;
    },
    ok(data, array, event) {
      abusetext = data.abusetext;
      if (abusetext.length > 0) {
        $.post('./abuse.php', {
          // prettier-ignore
          checkID: {$startruntime},
          postid: 0,
          commentid,
          abusetext,
          url,
          community: '{$community}',
        }).done((data) => {
          bootpopup.alert(data, 'Please note');
        });
      } else {
        bootpopup.alert(
          'Please describe the essence of the claims',
          'Please note '
        );
      }
    },
  });
}
