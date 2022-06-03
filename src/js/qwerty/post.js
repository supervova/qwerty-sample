/* eslint-disable camelcase, no-unused-vars, no-undef, no-param-reassign, no-shadow, no-constant-condition */
function votepost(postid, votemode) {
  if (votemode === 1) {
    if (document.getElementById('postpluscount').innerHTML === '&nbsp;') {
      document.getElementById('postpluscount').innerHTML = 0;
    }
    if ($('#thumbsup').hasClass('postvote')) {
      $('#thumbsup').removeClass('postvote');
      $('#thumbsup').addClass('postvotedplus');
      document.getElementById('postpluscount').innerHTML =
        document.getElementById('postpluscount').innerHTML * 1 + 1;
    } else if ($('#thumbsup').hasClass('postvotedplus')) {
      $('#thumbsup').removeClass('postvotedplus');
      $('#thumbsup').addClass('postvote');
      document.getElementById('postpluscount').innerHTML =
        document.getElementById('postpluscount').innerHTML * 1 - 1;
    }
    if ($('#thumbsdown').hasClass('postvotedminus')) {
      $('#thumbsdown').removeClass('postvotedminus');
      $('#thumbsdown').addClass('postvote');
    }
  }
  if (votemode === 0) {
    if (document.getElementById('postminuscount').innerHTML === '&nbsp;') {
      document.getElementById('postminuscount').innerHTML = 0;
    }
    if ($('#thumbsdown').hasClass('postvote')) {
      $('#thumbsdown').removeClass('postvote');
      $('#thumbsdown').addClass('postvotedminus');
      document.getElementById('postminuscount').innerHTML =
        document.getElementById('postminuscount').innerHTML * 1 + 1;
    } else if ($('#thumbsdown').hasClass('postvotedminus')) {
      $('#thumbsdown').removeClass('postvotedminus');
      $('#thumbsdown').addClass('postvote');
      document.getElementById('postminuscount').innerHTML =
        document.getElementById('postminuscount').innerHTML * 1 - 1;
    }
    if ($('#thumbsup').hasClass('postvotedplus')) {
      $('#thumbsup').removeClass('postvotedplus');
      $('#thumbsup').addClass('postvote');
      document.getElementById('postpluscount').innerHTML =
        document.getElementById('postpluscount').innerHTML * 1 - 1;
    }
  }
  $.post('./postvote.php', {
    // prettier-ignore
    checkID: {$startruntime},
    postid,
    votemode,
    community: '{$community}',
  }).done((data) => {
    data = $.parseJSON(data);
    if (data[0] === 'plus' || data[0] === 'minus' || data[0] === 'none') {
      if (data[0] === 'plus') {
        if ($('#thumbsup').hasClass('postvote')) {
          $('#thumbsup').removeClass('postvote');
        }
        $('#thumbsup').addClass('postvotedplus');
        if ($('#thumbsdown').hasClass('postvotedminus')) {
          $('#thumbsdown').removeClass('postvotedminus');
        }
        $('#thumbsdown').addClass('postvote');
      }
      if (data[0] === 'minus') {
        if ($('#thumbsdown').hasClass('postvote')) {
          $('#thumbsdown').removeClass('postvote');
        }
        $('#thumbsdown').addClass('postvotedminus');
        if ($('#thumbsup').hasClass('postvotedplus')) {
          $('#thumbsup').removeClass('postvotedplus');
        }
        $('#thumbsup').addClass('postvote');
      }
      if (data[0] === 'none') {
        if ($('#thumbsup').hasClass('postvotedplus')) {
          $('#thumbsup').removeClass('postvotedplus');
        }
        $('#thumbsup').addClass('postvote');
        if ($('#thumbsdown').hasClass('postvotedminus')) {
          $('#thumbsdown').removeClass('postvotedminus');
        }
        $('#thumbsdown').addClass('postvote');
      }
      document.getElementById('postpluscount').innerHTML = '&nbsp;';
      document.getElementById('postminuscount').innerHTML = '&nbsp;';
      if (data[1] > 0 && data[1] - 1 > 0) {
        document.getElementById('postpluscount').innerHTML = data[1] - 1;
      }
      if (data[2] > 0 && data[2] - 1 > 0) {
        document.getElementById('postminuscount').innerHTML = data[2] - 1;
      }
    }
  });
}

function abusepost() {
  // prettier-ignore
  if (!{$user_id}) {
    loginform();
    return;
  }
  url = '{$thispageurl}';
  bootpopup({
    title: 'Report abuse',
    content: [
      'If you believe that this page violates the rules of our service, let us know!<br /><br />',
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
          postid: '{$postid}',
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

function buyform() {
  // prettier-ignore
  if (!{$user_id}) {
    loginform();
    return;
  }
  $('#buywin').show();
}

function reg_stayed() {
  const xhr = new XMLHttpRequest();
  xhr.open('GET', './regstayed.php?postid={$postid}');
  xhr.onreadystatechange = () => {
    if (xhr.readyState !== 4 || xhr.status !== 200) {
      return;
    }
    const response = xhr.responseText;
    if (response !== 'OK') {
      const sec = response * 1000;
      if (sec > 0) {
        stayed_Id = setTimeout(() => {
          reg_stayed();
        }, sec);
      }
    }
    // console.log(response);
  };
  xhr.send();
}

function getshared() {
  sharedposts = document.getElementsByClassName('sharedlink');
  for (let i = 0; i < sharedposts.length; i++) {
    sharedinn = sharedposts[i].innerHTML;
    sharedurl = sharedposts[i].getAttribute('data-shared-url');
    if (sharedurl !== null) {
      if (sharedinn.length > 10 && sharedurl.length > 5) {
        sharedurl = encodeURIComponent(sharedurl);
        sharedposts[i].setAttribute(
          'onclick',
          `window.open('/go/?url=${sharedurl}', '_blank');`
        );
      } else {
        sharedposts[i].remove();
      }
    }
  }
}
