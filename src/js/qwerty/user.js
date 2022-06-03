/* eslint-disable camelcase, no-unused-vars, no-undef, no-shadow */
function banuser(ban_user_id, ban_username) {
  bootpopup({
    title: 'Ban user',
    content: [
      'Are you sure you want to block this user?<br />',
      `User: <b>${ban_username}</b><br />`,
      `Access to this community will be completely closed for ${ban_username}<br />`,
      'All publications and comments made by this user in your community will also be deleted.',
      'You can unlock the user later in the settings of your community.',
    ],
    cancel(data, array, event) {
      return false;
    },
    ok(data, array, event) {
      $.post('./banuser.php', {
        // prettier-ignore
        checkID: {$startruntime},
        ban_user_id,
        community: '{$community}',
      }).done((data) => {
        bootpopup.alert(data, 'Please note');
        getcomments(0);
      });
    },
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
        community: '{$community}',
      }).done((data) => {
        bootpopup.alert(data, 'Please note');
        getcomments(0);
      });
    },
  });
}
