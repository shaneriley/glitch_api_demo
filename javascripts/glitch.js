$(function() {
  var glitch = {
    url: "http://api.glitch.com",
    player: {},
    auth: {
      key: "67-a96fade161031dd5dbaaef1b2c459ab8b3e2dbdd",
      secret: "ea64f8ab707c99093f1eb1763b30b491e38203d1"
    },
    getPlayerInfo: function() {
      $.getJSON(glitch.auth_url, function(json) {
        if (json.ok) {
          $.extend(glitch.player, json);
          delete glitch.player.ok;
        }
      });
    }
  };
  glitch.auth_url = glitch.url +"/simple/auth.check?oauth_token=cD0zNjQyNSZzYz1pZGVudGl0eSZ0PTEzMTM2NzU0NTkmdT0zNjUwMiZoPWJkM2YwZjUwZTM3MWQ3ZmI";

  var c = $("canvas")[0].getContext("2d");
  c.canvas.width = 800;
  c.canvas.height = 600;

  glitch.getPlayerInfo();
  console.dir(glitch.player);
});
