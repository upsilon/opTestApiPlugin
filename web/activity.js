/*
 * @license Apache License 2.0
 * @author Kimura Youichi <kim.upsilon@bucyou.net>
 */

function runTests(apiBase, apiKey) {
  QUnit.moduleStart(function(details) {
    $.ajax(apiBase + 'test/setup.json?force=1', { async: false });
  });

  module('activity/search.json');

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
      ok(member.profile_url.match(/\/member\/1$/), 'data[0].member.profile_url');
      ok(member.profile_image.match(/\/no_image.gif$/), 'data[0].member.profile_image');
    })
    .complete(function(jqXHR, textStatus){ start(); });
  });

  asyncTest('search.json - visibility test (me - PUBLIC_FLAG_SNS)', 1, function() {
    $.getJSON(apiBase + 'activity/search.json',
    {
      apiKey: apiKey['1'],
      activity_id: '1'
    },
    function(data){
      equal(data.data.length, 1, 'data.length');
    })
    .complete(function(jqXHR, textStatus){ start(); });
  });

  asyncTest('search.json - visibility test (me - PUBLIC_FLAG_FRIEND)', 1, function() {
    $.getJSON(apiBase + 'activity/search.json',
    {
      apiKey: apiKey['1'],
      activity_id: '2'
    },
    function(data){
      equal(data.data.length, 1, 'data.length');
    })
    .complete(function(jqXHR, textStatus){ start(); });
  });

  asyncTest('search.json - visibility test (me - PUBLIC_FLAG_PRIVATE)', 1, function() {
    $.getJSON(apiBase + 'activity/search.json',
    {
      apiKey: apiKey['1'],
      activity_id: '3'
    },
    function(data){
      equal(data.data.length, 1, 'data.length');
    })
    .complete(function(jqXHR, textStatus){ start(); });
  });

  asyncTest('search.json - visibility test (friend - PUBLIC_FLAG_SNS)', 1, function() {
    $.getJSON(apiBase + 'activity/search.json',
    {
      apiKey: apiKey['1'],
      activity_id: '4'
    },
    function(data){
      equal(data.data.length, 1, 'data.length');
    })
    .complete(function(jqXHR, textStatus){ start(); });
  });

  asyncTest('search.json - visibility test (friend - PUBLIC_FLAG_FRIEND)', 1, function() {
    $.getJSON(apiBase + 'activity/search.json',
    {
      apiKey: apiKey['1'],
      activity_id: '5'
    },
    function(data){
      equal(data.data.length, 1, 'data.length');
    })
    .complete(function(jqXHR, textStatus){ start(); });
  });

  asyncTest('search.json - visibility test (friend - PUBLIC_FLAG_PRIVATE)', 1, function() {
    $.getJSON(apiBase + 'activity/search.json',
    {
      apiKey: apiKey['1'],
      activity_id: '6'
    },
    function(data){
      equal(data.data.length, 0, 'data.length');
    })
    .complete(function(jqXHR, textStatus){ start(); });
  });

  asyncTest('search.json - visibility test (other - PUBLIC_FLAG_SNS)', 1, function() {
    $.getJSON(apiBase + 'activity/search.json',
    {
      apiKey: apiKey['1'],
      activity_id: '7'
    },
    function(data){
      equal(data.data.length, 1, 'data.length');
    })
    .complete(function(jqXHR, textStatus){ start(); });
  });

  asyncTest('search.json - visibility test (other - PUBLIC_FLAG_FRIEND)', 1, function() {
    $.getJSON(apiBase + 'activity/search.json',
    {
      apiKey: apiKey['1'],
      activity_id: '8'
    },
    function(data){
      equal(data.data.length, 0, 'data.length');
    })
    .complete(function(jqXHR, textStatus){ start(); });
  });

  asyncTest('search.json - visibility test (other - PUBLIC_FLAG_PRIVATE)', 1, function() {
    $.getJSON(apiBase + 'activity/search.json',
    {
      apiKey: apiKey['1'],
      activity_id: '9'
    },
    function(data){
      equal(data.data.length, 0, 'data.length');
    })
    .complete(function(jqXHR, textStatus){ start(); });
  });

  asyncTest('search.json - all activities', 2, function() {
    $.getJSON(apiBase + 'activity/search.json',
    {
      apiKey: apiKey['1']
    },
    function(data){
      equal(data.status, 'success', 'status');
      ok($.isArray(data.data), 'data');
    })
    .complete(function(jqXHR, textStatus){ start(); });
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
    })
    .complete(function(jqXHR, textStatus){ start(); });
  });

  asyncTest('search.json - community (id = 1)', 3, function() {
    $.getJSON(apiBase + 'activity/search.json',
    {
      apiKey: apiKey['1'],
      target: 'community',
      target_id: 1
    },
    function(data){
      equal(data.status, 'success', 'status');

      equal(data.data.length, 1, 'data.length');
      equal(data.data[0].id, 11, 'data[0].id');
    })
    .complete(function(jqXHR, textStatus){ start(); });
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

  asyncTest('search.json - member_id = 2 (friend)', 2, function() {
    $.getJSON(apiBase + 'activity/search.json',
    {
      apiKey: apiKey['1'],
      member_id: 2
    },
    function(data){
      equal(data.status, 'success', 'status');

      var fail = false;
      $.each(data.data, function(index, activity) {
        if (activity.member.id !== '2')
          fail = true;
      });
      ok(!fail, 'data[].member.friend');
    })
    .complete(function(jqXHR, textStatus){ start(); });
  });

  asyncTest('search.json - member_id = 3 (not friend)', 2, function() {
    $.getJSON(apiBase + 'activity/search.json',
    {
      apiKey: apiKey['1'],
      member_id: 3
    },
    function(data){
      equal(data.status, 'success', 'status');

      var fail = false;
      $.each(data.data, function(index, activity) {
        if (activity.member.id !== '3')
          fail = true;
      });
      ok(!fail, 'data[].member.friend');
    })
    .complete(function(jqXHR, textStatus){ start(); });
  });

  asyncTest('search.json - member_id = 5 (blocked)', 2, function() {
    $.getJSON(apiBase + 'activity/search.json',
    {
      apiKey: apiKey['1'],
      member_id: 5
    },
    function(data){
      equal(data.status, 'success', 'status');

      equal(data.data.length, 0, 'data.length');
    })
    .complete(function(jqXHR, textStatus){ start(); });
  });

  module('activity/post.json');

  asyncTest('post.json - simple', 2, function() {
    $.getJSON(apiBase + 'activity/post.json',
    {
      apiKey: apiKey['1'],
      body: 'hogehoge'
    },
    function(data) {
      equal(data.status, 'success', 'status');

      equal(data.data.body, 'hogehoge', 'data.body');
    })
    .complete(function(jqXHR, textStatus){ start(); });
  });

  asyncTest('post.json - over 140 characters', 1, function() {
    $.getJSON(apiBase + 'activity/post.json',
    {
      apiKey: apiKey['1'],
      body: 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa' // 141文字
    })
    .complete(function(jqXHR) {
      equal(jqXHR.status, 400, 'statusCode');
      start();
    });
  });
}

runTests(
  '../api.php/',
  {
    '1': 'abcdef12345678900001', // member1
  }
);
