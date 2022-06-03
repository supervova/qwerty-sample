regstayed = 0;
loadingcomments = 0;
function js_translate(str) {
if (str == '{$phraseclose}') { str = '{$btn_close}'; } if (str == 'Close') { str = '{$btn_close}'; }
if (str == '{$phraseok}') { str = '{$btn_ok}'; }
if (str == '{$phrasecancel}') { str = '{$btn_cancel}'; }
if (str == '{$phraseyes}') { str = '{$btn_yes}'; }
if (str == '{$phraseno}') { str = '{$btn_no}'; }
return str;
}
function fromunixtime() {
  for(var i=0;i<$('.commentd').get().length;i++)
  {
    datetext = $('.commentd:eq(' + i + ')').text();
    if (datetext.indexOf('unixtime') + 1)
    {
      datetext = datetext.replace('unixtime','');
      $('.commentd:eq(' + i + ')').text(timestamp2date(datetext));
      $('.commentdiff:eq(' + i + ')').text();
    }
  }
  $(".commentd").removeClass("commentd");
  $(".commentdiff").removeClass("commentdiff");
}
function getcomments(startid) {
  loadingcomments = 1;
  $.ajax({
    url: 'getcomments.php',
    type: 'GET',
    async: false,
    data: {object_id: 'posts{$postid}', startid: startid, gocomment: gocomment, community: '{$community}' },
    success: function(response) {
      document.getElementById('loadingcomments').style.display = 'none';
      if (startid == 0)
      {
        $('#commentsblock').html(response);
      }
      else
      {
        $('#commentsblock').append(response);
      }
      fromunixtime();
      loadingcomments = 0;
      showcomments();
      $('[data-toggle="tooltip"]').tooltip();
    },
    error: function(response) {
      getcomments(startid);
    },
    timeout: 10000
  });
}
function showcomments() {
  if (loadingcomments == 0)
  {
    for(var i=0;i<$('.endcomments').get().length;i++)
    {
      fromid = $('.endcomments:eq(' + i + ')').attr('id');
      var coordstop = $('.endcomments:eq(' + i + ')').offset().top;
      var posTop = (window.pageYOffset !== undefined) ? window.pageYOffset : (document.documentElement || document.body.parentNode || document.body).scrollTop;
      var windowHeight = screen.height;
      if (coordstop<windowHeight+posTop+3000)
      {
        $(".endcomments").removeClass("endcomments");
        getcomments(fromid);
      }
    }
  }
}
function copycommentlink(commentid) {
  url = '{$thispageurl_lng}#comment'+commentid;
  bootpopup({
    title: "Link to comment",
    content: [
    '<p>Highlight and copy this link:</p>',
    '<input id="commenturl" type="text" style="width: 100%; line-height: 1.5em; font-size: 1em" value="'+url+'" onclick="$(this).select();" readonly>'
      ],
    ok: function(data, array, event) { return false; }
  });
}
function votepost(postid,votemode) {
  if (votemode == 1)
  {
    if (document.getElementById('postpluscount').innerHTML == '&nbsp;')
    {
      document.getElementById('postpluscount').innerHTML = 0;
    }
    if ( $('#thumbsup').hasClass('postvote') )
    {
      $('#thumbsup').removeClass('postvote');
      $('#thumbsup').addClass('postvotedplus');
      document.getElementById('postpluscount').innerHTML = document.getElementById('postpluscount').innerHTML * 1 + 1;
    }
    else if ( $('#thumbsup').hasClass('postvotedplus') )
    {
      $('#thumbsup').removeClass('postvotedplus');
      $('#thumbsup').addClass('postvote');
      document.getElementById('postpluscount').innerHTML = document.getElementById('postpluscount').innerHTML * 1 - 1;
    }
    if ( $('#thumbsdown').hasClass('postvotedminus') )
    {
      $('#thumbsdown').removeClass('postvotedminus');
      $('#thumbsdown').addClass('postvote');
    }
  }
  if (votemode == 0)
  {
    if (document.getElementById('postminuscount').innerHTML == '&nbsp;')
    {
      document.getElementById('postminuscount').innerHTML = 0;
    }
    if ( $('#thumbsdown').hasClass('postvote') )
    {
      $('#thumbsdown').removeClass('postvote');
      $('#thumbsdown').addClass('postvotedminus');
      document.getElementById('postminuscount').innerHTML = document.getElementById('postminuscount').innerHTML * 1 + 1;
    }
    else if ( $('#thumbsdown').hasClass('postvotedminus') )
    {
      $('#thumbsdown').removeClass('postvotedminus');
      $('#thumbsdown').addClass('postvote');
      document.getElementById('postminuscount').innerHTML = document.getElementById('postminuscount').innerHTML * 1 - 1;
    }
    if ( $('#thumbsup').hasClass('postvotedplus') )
    {
      $('#thumbsup').removeClass('postvotedplus');
      $('#thumbsup').addClass('postvote');
      document.getElementById('postpluscount').innerHTML = document.getElementById('postpluscount').innerHTML * 1 - 1;
    }
  }
  $.post( "./postvote.php", { checkID: {$startruntime}, postid: postid, votemode: votemode, community: '{$community}' })
    .done(function( data ) {
    data = $.parseJSON(data);
    if (data[0] == 'plus' || data[0] == 'minus' || data[0] == 'none')
    {
      if (data[0] == 'plus')
      {
        if ( $('#thumbsup').hasClass('postvote') )
        {
          $('#thumbsup').removeClass('postvote');
        }
        $('#thumbsup').addClass('postvotedplus');
        if ( $('#thumbsdown').hasClass('postvotedminus') )
        {
          $('#thumbsdown').removeClass('postvotedminus');
        }
        $('#thumbsdown').addClass('postvote');
      }
      if (data[0] == 'minus')
      {
        if ( $('#thumbsdown').hasClass('postvote') )
        {
          $('#thumbsdown').removeClass('postvote');
        }
        $('#thumbsdown').addClass('postvotedminus');
        if ( $('#thumbsup').hasClass('postvotedplus') )
        {
          $('#thumbsup').removeClass('postvotedplus');
        }
        $('#thumbsup').addClass('postvote');
      }
      if (data[0] == 'none')
      {
        if ( $('#thumbsup').hasClass('postvotedplus') )
        {
          $('#thumbsup').removeClass('postvotedplus');
        }
        $('#thumbsup').addClass('postvote');
        if ( $('#thumbsdown').hasClass('postvotedminus') )
        {
          $('#thumbsdown').removeClass('postvotedminus');
        }
        $('#thumbsdown').addClass('postvote');
      }
      document.getElementById('postpluscount').innerHTML = '&nbsp;';
      document.getElementById('postminuscount').innerHTML = '&nbsp;';
      if (data[1] > 0 && data[1]-1 > 0)
      {
        document.getElementById('postpluscount').innerHTML = data[1]-1;
      }
      if (data[2] > 0 && data[2]-1 > 0)
      {
        document.getElementById('postminuscount').innerHTML = data[2]-1;
      }
    }
  });
}
function votecomment(commentid,objectid,votemode) {
  if (votemode == 1)
  {
    if (document.getElementById('pluscount'+commentid).innerHTML == '&nbsp;')
    {
      document.getElementById('pluscount'+commentid).innerHTML = 0;
    }
    if ( $('#thumbsup'+commentid).hasClass('vote') )
    {
      $('#thumbsup'+commentid).removeClass('vote');
      $('#thumbsup'+commentid).addClass('votedplus');
      document.getElementById('pluscount'+commentid).innerHTML = document.getElementById('pluscount'+commentid).innerHTML * 1 + 1;
    }
    else if ( $('#thumbsup'+commentid).hasClass('votedplus') )
    {
      $('#thumbsup'+commentid).removeClass('votedplus');
      $('#thumbsup'+commentid).addClass('vote');
      document.getElementById('pluscount'+commentid).innerHTML = document.getElementById('pluscount'+commentid).innerHTML * 1 - 1;
    }
    if ( $('#thumbsdown'+commentid).hasClass('votedminus') )
    {
      $('#thumbsdown'+commentid).removeClass('votedminus');
      $('#thumbsdown'+commentid).addClass('vote');
    }
  }
  if (votemode == 0)
  {
    if (document.getElementById('minuscount'+commentid).innerHTML == '&nbsp;')
    {
      document.getElementById('minuscount'+commentid).innerHTML = 0;
    }
    if ( $('#thumbsdown'+commentid).hasClass('vote') )
    {
      $('#thumbsdown'+commentid).removeClass('vote');
      $('#thumbsdown'+commentid).addClass('votedminus');
      document.getElementById('minuscount'+commentid).innerHTML = document.getElementById('minuscount'+commentid).innerHTML * 1 + 1;
    }
    else if ( $('#thumbsdown'+commentid).hasClass('votedminus') )
    {
      $('#thumbsdown'+commentid).removeClass('votedminus');
      $('#thumbsdown'+commentid).addClass('vote');
      document.getElementById('minuscount'+commentid).innerHTML = document.getElementById('minuscount'+commentid).innerHTML * 1 - 1;
    }
    if ( $('#thumbsup'+commentid).hasClass('votedplus') )
    {
      $('#thumbsup'+commentid).removeClass('votedplus');
      $('#thumbsup'+commentid).addClass('vote');
      document.getElementById('pluscount'+commentid).innerHTML = document.getElementById('pluscount'+commentid).innerHTML * 1 - 1;
    }
  }
  $.post( "./commentvote.php", { checkID: {$startruntime}, commentid: commentid, object_id: objectid, votemode: votemode, community: '{$community}' })
    .done(function( data ) {
    data = $.parseJSON(data);
    if (data[0] == 'plus' || data[0] == 'minus' || data[0] == 'none')
    {
      if (data[0] == 'plus')
      {
        if ( $('#thumbsup'+commentid).hasClass('vote') )
        {
          $('#thumbsup'+commentid).removeClass('vote');
        }
        $('#thumbsup'+commentid).addClass('votedplus');
        if ( $('#thumbsdown'+commentid).hasClass('votedminus') )
        {
          $('#thumbsdown'+commentid).removeClass('votedminus');
        }
        $('#thumbsdown'+commentid).addClass('vote');
      }
      if (data[0] == 'minus')
      {
        if ( $('#thumbsdown'+commentid).hasClass('vote') )
        {
          $('#thumbsdown'+commentid).removeClass('vote');
        }
        $('#thumbsdown'+commentid).addClass('votedminus');
        if ( $('#thumbsup'+commentid).hasClass('votedplus') )
        {
          $('#thumbsup'+commentid).removeClass('votedplus');
        }
        $('#thumbsup'+commentid).addClass('vote');
      }
      if (data[0] == 'none')
      {
        if ( $('#thumbsup'+commentid).hasClass('votedplus') )
        {
          $('#thumbsup'+commentid).removeClass('votedplus');
        }
        $('#thumbsup'+commentid).addClass('vote');
        if ( $('#thumbsdown'+commentid).hasClass('votedminus') )
        {
          $('#thumbsdown'+commentid).removeClass('votedminus');
        }
        $('#thumbsdown'+commentid).addClass('vote');
      }
      document.getElementById('pluscount'+commentid).innerHTML = '&nbsp;';
      document.getElementById('minuscount'+commentid).innerHTML = '&nbsp;';
      if (data[1] > 0 && data[1]-1 > 0)
      {
        document.getElementById('pluscount'+commentid).innerHTML = data[1]-1;
      }
      if (data[2] > 0 && data[2]-1 > 0)
      {
        document.getElementById('minuscount'+commentid).innerHTML = data[2]-1;
      }
    }
  });
}
function savecomment(replytoid,commentid) {
  tinyMCE.triggerSave();
  if (commentid < 0)
  {
    commentid = document.getElementById('editcommentid').value;
  }
  if (commentid == 0)
  {
    var comment = $('#editor').val();
    document.getElementById('savecomment').style.display = 'none';
  }
  else
  {
    var comment = $('#commenteditor').val();
  }
  privatecomment = 0;
  if (document.getElementById('privatecomment'))
  {
    if (document.getElementById('privatecomment').checked)
    {
      privatecomment = 1;
    }
  }
  if (comment.length < 5)
  {
    document.getElementById('savecomment').style.display = 'inline-block';
    bootpopup.alert('The minimum length of the comment - 5 characters.','Please note');
    return;
  }
  $.post( "./savecomment.php", { privatecomment: privatecomment, comment: comment, object_id: 'posts{$postid}', replytoid: replytoid, commentid: commentid, checkID: {$startruntime}, community: '{$community}' })
    .done(function( data ) {
    if (data > 0)
    {
      if (commentid > 0)
      {
        document.getElementById('textcomment'+commentid).innerHTML = comment;
      }
      else
      {
        replyto(0);
        $.ajax({
          url: 'getcomments.php',
          type: 'GET',
          async: true,
          data: {object_id: 'posts{$postid}', commentid: data, community: '{$community}' },
          success: function(response) {
            if (replytoid > 0)
            {
              $('div.comment'+replytoid+':first').after(response);
            }
            else
            {
              $('#replyto0').after(response);
            }
            fromunixtime();
            $(".js-smartPhoto").SmartPhoto();
          },
          error: function(response) {
            location.href='{$thispageurl}';
          }
        });
      }
      lastcommentedit = 0;
    }
    else
    {
      bootpopup.alert(data,'Please note');
    }
    if (commentid == 0)
    {
      document.getElementById('savecomment').style.display = 'inline-block';
    }
  });
}
function deletecomment(commentid) {
  var allcomments = 0;
  authorname = document.getElementById('author'+commentid).innerHTML;
  bootpopup({
    title: 'Delete comment'+' #'+commentid,
    content: [
    'Are you sure you want to delete this comment?<br >',
    '<label><input id="allcomments" name="allcomments" type="checkbox"> Delete all comments <b>'+authorname+'</b></label><br >'
      ],
    cancel: function(data, array, event) { return false; },
    ok: function(data, array, event) {
      if (data.allcomments == 'on')
      {
        var allcomments = 1;
      }
      else
      {
        $("div.comment"+commentid).remove();
      }
      replyto(0);
      $.post( "./removecomment.php", { checkID: {$startruntime}, object_id: 'posts{$postid}', commentid: commentid, allcomments: allcomments, community: '{$community}' })
        .done(function( data ) {
      });
      if (allcomments == 1)
      {
        getcomments(0);
      }
    }
  });
}
function replyto(commentid) {
  tinymce.remove();
  document.getElementById('replyto'+lastcommentedit).innerHTML = '';
  if (commentid == 0)
  {
    document.getElementById('postcomment').style.display = 'none';
  }
  else
  {
    document.getElementById('postcomment').style.display = 'inline-block';
  }
  lastcommentedit = commentid;
  privatedisplay = 'none';
  if (commentid == 0)
  {
    privatedisplay = 'block';
  }
  document.getElementById('replyto'+commentid).innerHTML = '<textarea id="editor"></textarea><label data-tooltip="Hidden comments are available only to the author of the publication and you."><input type="checkbox" id="privatecomment"> Hidden comment</label><button class="btn is-primary" id="savecomment" type="submit" onclick="savecomment('+ commentid +',0);">Save comment</button>';
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

    {$tinymcelng}

    setup: function (editor) {
      editor.addButton('myimage', {
        text: false,
        icon: 'image',
        tooltip: "Upload image",
        onclick: function () {
          addpicture(-1);
        }
      });
      editor.on('change', (e) => {
        thiscontent = editor.getContent();
        if (thiscontent.indexOf('href=') + 1 && thiscontent.indexOf('sharedlink') + 1 == 0) {
          opengraph(thiscontent);
        }
      });
    }
  });
  $('#editor').html('');
}
function addpicture(fileid) {
  insmode = fileid;
  document.getElementById('todelete').checked = false;
  document.getElementById('editphoto').src = './images/no-image.png';
  document.getElementById('filename').value = '';
  document.getElementById('photo_b64').value = '';
  document.getElementById('PhotoFile').value = '';
  document.getElementById('description').value = '';
  document.getElementById('saveimgbutton').disabled = false;
  document.getElementById('cancelimgbutton').disabled = false;
  document.getElementById('loadingphoto').style.display = 'none';
  document.getElementById('selectfile').style.display = 'inline-block';
  document.getElementById('deletediv').style.display = 'none';
  if (insmode == -1)
  {
    document.getElementById('saveimgbutton').innerHTML = 'Insert image';
  }
  else
  {
    document.getElementById('saveimgbutton').innerHTML = 'Save changes';
  }
  $("#newpicture").appendTo("body").modal('show');
}
function showeditphoto() {
  var image = $("#PhotoFile");
  if (image[0].files && image[0].files[0]) {
    resizeFile(image[0].files[0], $('#editphoto'), $('#photo_b64'))
  }
}
function resizeFile(file, editphoto, b64field) {
  document.getElementById('loadingphoto').style.display = 'block';
  var reader = new FileReader();
    reader.onloadend = function () {
        var tempImg = new Image();
        tempImg.src = reader.result;
        tempImg.onload = function () {
            var tempW = tempImg.width;
            var tempH = tempImg.height;
            imgcrop(this, tempW, tempH, 900, 600, b64field);
            $(editphoto).attr('src', $(b64field).val());
      document.getElementById('loadingphoto').style.display = 'none';
      }
    }
    reader.readAsDataURL(file);
}
function imgcrop(image, tempW, tempH, maxW, maxH, elem) {
  var sourceX = 0;
  var sourceY = 0;
  var destWidth = tempW;
  var destHeight = tempH;
  if (tempW > maxW)
  {
    var destWidth = maxW;
    var destHeight = destHeight * (maxW/tempW);
  }
  if (destHeight > maxH)
  {
    var destWidth = tempW;
    var destHeight = tempH;
    var destHeight = maxH;
    var destWidth = destWidth * (maxH/tempH);
  }
  var destX = 0;
  var destY = 0;

  var canvas = document.createElement('canvas');
  canvas.width = destWidth;
  canvas.height = destHeight;

  var ctx = canvas.getContext("2d");
  ctx.fillStyle = "#FFFFFF";
    ctx.fillRect(0, 0, destWidth, destHeight);
  ctx.drawImage(image, sourceX, sourceY, tempW, tempH, destX, destY, destWidth, destHeight);
  var dataURL = canvas.toDataURL("image/jpeg");
  $(elem).val(dataURL);
}
function saveimage() {
  var photo_b64 = document.getElementById('photo_b64').value;
  var filename = document.getElementById('filename').value;
  var description = document.getElementById('description').value;
  if (photo_b64 == '' && filename == '')
  {
    return;
  }
  document.getElementById('saveimgbutton').disabled = true;
  document.getElementById('cancelimgbutton').disabled = true;
  document.getElementById('loadingphoto').style.display = 'block';
  $.post( "./loadpictures.php", { photo_b64: photo_b64, filename: filename, description: description, object_id: 'comments{$postid}' })
    .done(function( data ) {
    if(!(data.indexOf('.jpg') + 1) && data != 'OK')
    {
      document.getElementById('saveimgbutton').disabled = false;
      document.getElementById('cancelimgbutton').disabled = false;
      document.getElementById('loadingphoto').style.display = 'none';
      bootpopup.alert(data,'Error');
    }
    else
    {
      document.getElementById('saveimgbutton').disabled = false;
      document.getElementById('cancelimgbutton').disabled = false;
      document.getElementById('loadingphoto').style.display = 'none';
      $("#newpicture").modal('hide');
      if (insmode == -1)
      {
        tinyMCE.activeEditor.insertContent('<a href="/'+data+'" class="js-smartPhoto" target="_blank"><img style="max-width: 90%; max-height: 250px; margin: 5px;" src="/'+data+'" ></a><br >&nbsp;');
        tinyMCE.activeEditor.focus();
      }
    }
  });
}
function editcomment(commentid) {
  textcomment = document.getElementById('textcomment'+commentid).innerHTML;
  document.getElementById('editcommentid').value = commentid;
  $('#editcomment').appendTo("body").modal('show');
  if (edited)
  {
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

    {$tinymcelng}

    setup: function (editor) {
      editor.addButton('myimage', {
        text: false,
        icon: 'image',
        tooltip: "Upload image",
        onclick: () => {
          addpicture(-1);
        }
      });
    }
  });
  edited = true;
  tinyMCE.activeEditor.setContent(textcomment);
}
function abusecomment(commentid) {
  if (!{$user_id})
  {
    loginform();
    return;
  }
  url = '{$thispageurl_lng}#comment'+commentid;
  authorname = document.getElementById('author'+commentid).innerHTML;
  bootpopup({
    title: "Report abuse",
    content: [
    'Comment #<b>'+commentid+'</b><br >',
    'User: <b>'+authorname+'</b><br >',
    'A description of the problem or the essence of the claims:',
    { textarea: {name: "abusetext", id: "abusetext", style: "width: 100%; height: 100px;"}}
      ],
    cancel: function(data, array, event) { return false; },
    ok: function(data, array, event) {
      abusetext = data.abusetext;
      if (abusetext.length>0)
      {
        $.post( "./abuse.php", { checkID: {$startruntime}, postid: '{$postid}', commentid: commentid, abusetext: abusetext, url: url, community: '{$community}' })
          .done(function( data ) {
          bootpopup.alert(data,'Please note');
        });
      }
      else
      {
        bootpopup.alert('Please describe the essence of the claims','Please note ');
      }
    }
  });
}
function abusepost() {
  if (!{$user_id})
  {
    loginform();
    return;
  }
  url = '{$thispageurl_lng}';
  bootpopup({
    title: "Report abuse",
    content: [
    'If you believe that this page violates the rules of our service, let us know!<br ><br >',
    'A description of the problem or the essence of the claims:',
    { textarea: {name: "abusetext", id: "abusetext", style: "width: 100%; height: 100px;"}}
      ],
    cancel: function(data, array, event) { return false; },
    ok: function(data, array, event) {
      abusetext = data.abusetext;
      if (abusetext.length>0)
      {
        $.post( "./abuse.php", { checkID: {$startruntime}, postid: '{$postid}', abusetext: abusetext, url: url, community: '{$community}' })
          .done(function( data ) {
          bootpopup.alert(data,'Please note');
        });
      }
      else
      {
        bootpopup.alert('Please describe the essence of the claims','Please note ');
      }
    }
  });
}
function banuser(ban_user_id, ban_username) {
  bootpopup({
    title: "Ban user",
    content: [
    'Are you sure you want to block this user?<br >',
    'User: <b>'+ban_username+'</b><br >',
    'Access to this community will be completely closed for '+ban_username+'<br >',
    'All publications and comments made by this user in your community will also be deleted.',
    'You can unlock the user later in the settings of your community.'
      ],
    cancel: function(data, array, event) { return false; },
    ok: function(data, array, event) {
      $.post( "./banuser.php", { checkID: {$startruntime}, ban_user_id: ban_user_id, community: '{$community}' })
        .done(function( data ) {
        bootpopup.alert(data,"Please note");
        getcomments(0);
        });
    }
  });
}
function unbanuser(ban_user_id, ban_username) {
  bootpopup({
    title: "Unblock user",
    content: [
    'Are you sure you want to unblock this user?<br >',
    'User: <b>'+ban_username+'</b>'
      ],
    cancel: function(data, array, event) { return false; },
    ok: function(data, array, event) {
      $.post( "./banuser.php", { checkID: {$startruntime}, ban_user_id: ban_user_id, unblock: 1, community: '{$community}' })
        .done(function( data ) {
        bootpopup.alert(data,"Please note");
        getcomments(0);
      });
    }
  });
}
function buyform() {
  if (!{$user_id})
  {
    loginform();
    return;
  }
  $('#buywin').show();
}
function reg_stayed() {
  if (regstayed == 0)
  {
    $.post( "./regstayed.php", { postid: '{$postid}', community: '{$community}' })
      .done(function( data ) {
      regstayed = regstayed + 1;
    });
  }
}
function getshared() {
  sharedposts = document.getElementsByClassName('sharedlink');
  for (var i = 0; i < sharedposts.length; i++) {
    sharedinn = sharedposts[i].innerHTML;
    sharedurl = sharedposts[i].getAttribute("data-shared-url");
    if(sharedurl !== null)
    {
      if (sharedinn.length > 10 && sharedurl.length > 5)
      {
        sharedurl = encodeURIComponent(sharedurl);
        sharedposts[i].setAttribute("onclick","window.open('/go/?url="+sharedurl+"', '_blank');");
      }
      else
      {
        sharedposts[i].remove();
      }
    }
  }
}
