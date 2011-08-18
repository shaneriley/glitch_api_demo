$(function() {
  var reportMsg = function() {
    var logger = function(o) {
      ("log" in console) ?
        console[(typeof o === "object") ? "dir" : "log"](o) :
        alert(o);
    };
    $.each(arguments, function(i, m) {
      logger(m);
    });
  };

  var incomplete = function(method) {
    var b = true;
    if ("complete" in method) {
      b = !method.complete;
    }
    return b;
  };

  var glitch = {
    url: "http://api.glitch.com/simple/",
    player: {},
    auth: {
      key: "67-a96fade161031dd5dbaaef1b2c459ab8b3e2dbdd",
      secret: "ea64f8ab707c99093f1eb1763b30b491e38203d1",
      token: "?oauth_token=cD0zNjQyNSZzYz1pZGVudGl0eSZ0PTEzMTM2NzU0NTkmdT0zNjUwMiZoPWJkM2YwZjUwZTM3MWQ3ZmI"
    },
    getPlayerInfo: function() {
      $.getJSON(glitch.url + "auth.check" + this.auth.token, function(json) {
        if (json.ok) {
          $.extend(glitch.player, json);
          delete glitch.player.ok;
          glitch.getPlayerInfo.complete = true;
        }
        else { reportMsg(json); }
      });
    },
    getSpriteSheet: function() {
      if (incomplete(glitch.getPlayerInfo)) { setTimeout(glitch.getSpriteSheet, 20); }
      else {
        $.getJSON(glitch.url + "players.getAnimations" + glitch.auth.token + "&player_tsid=" + glitch.player.player_tsid, function(json) {
          if (json.ok) {
            $.extend(glitch.player.sheets = {}, json.sheets);
          }
          else { reportMsg(json); }
        });
      }
    }
  };

  var c = $("canvas")[0].getContext("2d");
  c.canvas.width = 800;
  c.canvas.height = 600;

  glitch.getPlayerInfo();
  glitch.getSpriteSheet();
  reportMsg("Player Info:", (new Array(81)).join("="), glitch.player);
});
