/* eslint-disable no-unused-vars, no-undef, no-use-before-define, no-var, block-scoped-var, vars-on-top, no-redeclare, camelcase */
function addpicture(fileid) {
  insmode = fileid;
  document.getElementById('editphoto').src = './images/no-image.png';
  document.getElementById('filename').value = '';
  document.getElementById('photo_b64').value = '';
  document.getElementById('PhotoFile').value = '';
  document.getElementById('description').value = '';
  document.getElementById('saveimgbutton').disabled = false;
  document.getElementById('cancelimgbutton').disabled = false;
  document.getElementById('loadingphoto').style.display = 'none';
  document.getElementById('deletediv').style.display = 'none';
  if (insmode === -1) {
    document.getElementById('saveimgbutton').innerHTML = 'Insert image';
  } else {
    document.getElementById('saveimgbutton').innerHTML = 'Save changes';
  }
  $('#newpicture').appendTo('body').modal('show');
}

function showeditphoto() {
  const image = $('#PhotoFile');
  if (image[0].files && image[0].files[0]) {
    resizeFile(image[0].files[0], $('#editphoto'), $('#photo_b64'));
  }
}

function resizeFile(file, editphoto, b64field) {
  document.getElementById('loadingphoto').style.display = 'block';
  const reader = new FileReader();
  reader.onloadend = () => {
    const tempImg = new Image();
    tempImg.src = reader.result;
    tempImg.onload = () => {
      const tempW = tempImg.width;
      const tempH = tempImg.height;
      imgcrop(this, tempW, tempH, 900, 600, b64field);
      $(editphoto).attr('src', $(b64field).val());
      document.getElementById('loadingphoto').style.display = 'none';
    };
  };
  reader.readAsDataURL(file);
}

function imgcrop(image, tempW, tempH, maxW, maxH, elem) {
  const sourceX = 0;
  const sourceY = 0;
  var destWidth = tempW;
  var destHeight = tempH;
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
  const destX = 0;
  const destY = 0;

  const canvas = document.createElement('canvas');
  canvas.width = destWidth;
  canvas.height = destHeight;

  const ctx = canvas.getContext('2d');
  ctx.fillStyle = '#FFFFFF';
  ctx.fillRect(0, 0, destWidth, destHeight);
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
  const dataURL = canvas.toDataURL('image/jpeg');
  $(elem).val(dataURL);
}

function saveimage() {
  const photo_b64 = document.getElementById('photo_b64').value;
  const filename = document.getElementById('filename').value;
  const description = document.getElementById('description').value;
  if (photo_b64 === '' && filename === '') {
    return;
  }
  document.getElementById('saveimgbutton').disabled = true;
  document.getElementById('cancelimgbutton').disabled = true;
  document.getElementById('loadingphoto').style.display = 'block';
  $.post('./loadpictures.php', {
    photo_b64,
    filename,
    description,
    object_id: 'blogcomments{$blog_id}',
  }).done((data) => {
    if (!(data.indexOf('.jpg') + 1) && data !== 'OK') {
      document.getElementById('saveimgbutton').disabled = false;
      document.getElementById('cancelimgbutton').disabled = false;
      document.getElementById('loadingphoto').style.display = 'none';
      bootpopup.alert(data, 'Error');
    } else {
      document.getElementById('saveimgbutton').disabled = false;
      document.getElementById('cancelimgbutton').disabled = false;
      document.getElementById('loadingphoto').style.display = 'none';
      $('#newpicture').modal('hide');
      if (insmode === -1) {
        tinyMCE.activeEditor.insertContent(
          `<a href="/${data}" class="js-smartPhoto" target="_blank"><img style="max-width: 90%; max-height: 250px; margin: 5px;" src="/${data}" /></a><br />&nbsp;`
        );
        tinyMCE.activeEditor.focus();
      }
    }
  });
}

function showcoverimage() {
  const image = $('#coverimage');
  if (image[0].files && image[0].files[0]) {
    resizeFile(
      image[0].files[0],
      $('#imgcover'),
      $('#coverimage64'),
      1600,
      500
    );
  }
}

function deletephoto() {
  document.getElementById('pagephoto').src = '{$defaultavatar}';
  document.getElementById('pagephotosmall').src = '{$defaultavatar}';
  document.getElementById('thisphoto_b64').value = 'delete';
  document.getElementById('PagePhotoFile').value = '';
}

function insimage(webpath, filename) {
  $('#editortext').html(tinymce.get('editortext').getContent());
  tinyMCE.activeEditor.setContent(
    `${$('#editortext').val()}<p><img src="${webpath}"></p>`
  );
  tinymce.activeEditor.save();
  $.post('./loadpictures.php', {
    photo_b64: '',
    filename,
    description: 'updatedate',
    postid: 0,
  }).done((data) => {});
  goposttab();
}
