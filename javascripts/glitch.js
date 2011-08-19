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
    anim: {
      sheet: "idle0",
      frame: 0,
      interval: null
    },
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
          g.player.sheets = json.sheets;
          g.player.anims = json.anims;
          g.createAnimIndex();
        }
        else { reportMsg(json); }
      });
    },
    createAnimIndex: function() {
      var s = this.player.sheets;
      this.player.anim_index = {};
      for (var i in s) {
        for (var j = 0; j < s[i].frames.length; j++) {
          var col = j % s[i].cols;
          var row = Math.floor(j / s[i].cols);
          this.player.anim_index[s[i].frames[j]] = [i, col, row];
        }
      }
      this.loadSprites();
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
    animate: function(sheet) {
      if (incomplete(glitch.loadSprites)) {
        setTimeout(glitch.animate, 20, sheet);
        return;
      }
      if (!(typeof sheet === "string")) { sheet = $(this).find(":selected").text(); }
      console.log(sheet);
      var g = glitch;
      clearInterval(g.anim.interval);
      g.anim.sheet = sheet;
      g.anim.frame = 0;
      g.anim.interval = setInterval(g.drawGlitch, 33);
    },
    drawGlitch: function() {
      var g = glitch,
          id = g.player.anims[g.anim.sheet][g.anim.frame],
          sheet = g.player.anim_index[id][0],
          col = g.player.anim_index[id][1],
          row = g.player.anim_index[id][2],
          f_w = g.sprites[sheet].width / g.player.sheets[sheet].cols,
          f_h = g.sprites[sheet].height / g.player.sheets[sheet].rows,
          f_x = f_w * col,
          f_y = f_h * row,
          d_x = (c.canvas.width / 2) - (f_w / 2);
          d_y = (c.canvas.height / 2) - (f_h / 2);

      c.clearRect(0, 0, c.canvas.width, c.canvas.height);
      c.drawImage(g.sprites[sheet], f_x, f_y, f_w, f_h, d_x, d_y, f_w, f_h);
      g.anim.frame++;
      if (g.anim.frame >= g.player.anims[g.anim.sheet].length) { g.anim.frame = 0; }
    },
  };

  var c = $("canvas")[0].getContext("2d");
  c.canvas.width = 800;
  c.canvas.height = 600;

  glitch.getPlayerInfo();
  glitch.getSpriteSheet();

  var createAnimationSelection = function() {
    var g = glitch;
    if (incomplete(g.loadSprites)) {
      setTimeout(createAnimationSelection, 20);
      return;
    }
    var $s = $("<select />").appendTo(document.body),
        opts = [];
    for (var v in g.player.anims) {
      opts.push("<option>" + v + "</option>");
    }
    $s.html(opts.join("")).change(glitch.animate).change();
  };
  createAnimationSelection();

  reportMsg("Player Info:", (new Array(81)).join("="), glitch.player);
});
