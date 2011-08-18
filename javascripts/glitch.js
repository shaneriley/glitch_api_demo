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
    sprites: {},
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
      var g = glitch;
      if (incomplete(g.getPlayerInfo)) {
        setTimeout(g.getSpriteSheet, 20);
        return;
      }
      $.getJSON(g.url + "players.getAnimations" + g.auth.token + "&player_tsid=" + g.player.player_tsid, function(json) {
        if (json.ok) {
          $.extend(g.player.sheets = {}, json.sheets);
          glitch.loadSprites();
        }
        else { reportMsg(json); }
      });
    },
    loadSprites: function() {
      var len = 0,
          loaded = 0;
      var complete = function() {
        (loaded === len) ?
          glitch.loadSprites.complete = true :
          setTimeout(complete, 20);
      };

      for (var v in glitch.player.sheets) {
        var img = new Image();
        img.onload = function() { loaded++; };
        img.src = glitch.player.sheets[v].url;
        glitch.sprites[v] = img;
        len++;
      }
      complete();
    },
    drawGlitch: function() {
      if (incomplete(glitch.loadSprites)) {
        setTimeout(glitch.drawGlitch, 20);
        return;
      }
      var g = glitch,
          idx = 1,
          sprite = g.sprites["idle" + idx],
          w = sprite.width / g.player.sheets["idle" + idx].cols,
          h = sprite.height / g.player.sheets["idle" + idx].rows,
          x = (c.canvas.width / 2) - (w / 2),
          y = (c.canvas.height / 2) - (h / 2),
          sx = 0,
          sy = 0;
      c.drawImage(sprite, sx, sy, w, h, x, y, w, h);
    },
  };

  var c = $("canvas")[0].getContext("2d");
  c.canvas.width = 800;
  c.canvas.height = 600;

  glitch.getPlayerInfo();
  glitch.getSpriteSheet();
  glitch.drawGlitch();
  reportMsg("Player Info:", (new Array(81)).join("="), glitch.player);
});
