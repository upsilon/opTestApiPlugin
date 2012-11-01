/*
 * @license Apache License 2.0
 * @author Kimura Youichi <kim.upsilon@bucyou.net>
 */

$(function($) {

function runTests(apiBase, apiKey) {
  asyncTest('search.json - apiKey is required', 1, function() {
    $.getJSON(apiBase + 'activity/search.json')
      .complete(function(jqXHR){
        equal(jqXHR.status, 401, 'statusCode');
        start();
      });
  });

  asyncTest('search.json - activity format', 16, function() {
    $.getJSON(apiBase + 'activity/search.json',
    {
      apiKey: apiKey['1'],
      activity_id: '1'
    },
    function(data){
      equal(data.status, 'success', 'status');

      var activity = data.data[0];
      equal(activity.id, '1', 'data[0].id');
      equal(activity.body, 'dummy1', 'data[0].body');
      equal(activity.body_html, 'dummy1', 'data[0].body_html');
      equal(activity.uri, null, 'data[0].uri');
      equal(activity.source, null, 'data[0].source');
      equal(activity.source_uri, null, 'data[0].source_uri');
      equal(activity.image_url, null, 'data[0].image_url');
      equal(activity.image_large_url, null, 'data[0].image_large_url');

      var member = activity.member;
      equal(member.id, '1', 'data[0].member.id');
      equal(member.name, 'A', 'data[0].member.name');
      equal(member.self, true, 'data[0].member.self');
      equal(member.friend, false, 'data[0].member.friend');
      equal(member.blocking, false, 'data[0].member.blocking');
      ok(member.profile_url.endsWith('/member/1'), 'data[0].member.profile_url');
      ok(member.profile_image.endsWith('/dummy_file3.jpg'), 'data[0].member.profile_image');

      start();
    });
  });

  asyncTest('search.json - all activities', 2, function() {
    $.getJSON(apiBase + 'activity/search.json',
    {
      apiKey: apiKey['1']
    },
    function(data){
      equal(data.status, 'success', 'status');
      equal(data.data.length, 8, 'data.length');

      start();
    });
  });

  asyncTest('search.json - friends', 2, function() {
    $.getJSON(apiBase + 'activity/search.json',
    {
      apiKey: apiKey['1'],
      target: 'friend'
    },
    function(data){
      equal(data.status, 'success', 'status');

      var fail = false;
      $.each(data.data, function(index, activity) {
        if (!activity.member.friend)
          fail = true;
      });
      ok(!fail, 'data[].member.friend');

      start();
    });
  });

  asyncTest('search.json - invalid target', 1, function() {
    $.getJSON(apiBase + 'activity/search.json',
    {
      apiKey: apiKey['1'],
      target: 'aaaaaa'
    })
    .complete(function(jqXHR) {
      equal(jqXHR.status, 400, 'statusCode');
      start();
    });
  });
}

runTests(
  'http://ukimura.dazai2.pne.jp/master/api_test.php/',
  {
    '1': 'abcdef12345678900001' // member1
  }
);

});
