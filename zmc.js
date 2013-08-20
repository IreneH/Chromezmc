;(function () {
  var _main = function () {
    self.zmc = self.zmc || { };
    if ("function" == typeof (zmc.new)) return;

    var _odev, _act = { },
      _stop = function () {
        try {
          _act.inst && self.clearTimeout(_act.inst)
        }
        catch (ex) {
          $.noop()
        }
        _act.inst = !1;
        $("[name=bnStart]").val(zmc.text.START);
        $("#ltHint").removeClass("strun").text(zmc.text.STHAL)
      },
      _mat = function (opts) {
        for (var j in _act) {
          if (opts.cate !== j) continue;

          return opts.code == _act[j].code ? !1 : (_act[j].code = opts.code, !0)
        }

        return !0
      },
      _eajx = function (urlx, optx) {
        return function () {
          _mat(optx) && zmc.write([
            '<b class="fbrow">', zmc.text.EAJAX, "</b>",
            '<a target=_blank href="', urlx, '">', zmc.text.EAJX2, "</a>"
          ].join(""))
        }
      },
      _rsor = /sorry but|something went wrong|error occurred/,
      _cmsg = function (msg, red) {
        return red || _rsor.test(msg) ?
          ('<b class="fbrow">' + msg + "</b>") :
          ('<b class="susses">' + msg + "</b>")
      },
      // display cw lotto
      _rlot = /\/scratch_lotto\.php\?/,
      _rlcw = /:\/\/apps\.facebook\.com\/cafeworld\/+/,
      _rlcn = /lottoContainer/,
      _rltr = /getLottoTicketReward\((.+?)\)/, _rqtg = /\'/g,
      _rgon = /Looks like all the scratch lotto tickets are gone/,
      _rbzy = /Too many requests from this user/,
      _rutl = /[&;]until=(\d+)/,
      _disp8 = function (pval) {
        if (!_act.inst) return;

        var _str, _ary,
          _now = new Date(),
          _creat = new Date(pval.created_time);

        (_now.setDate(_now.getDate() - 2) > _creat) && $("[name=cbBack]").prop("checked", !1);
        0 === $("#cwl_" + pval.id).length && zmc.push([
          "<div>",
            '<img class="itemimg" align=left src="lotto.png" />',
            pval.from.name, "<br />",
            '<span class="fgrey">(', _creat, ")</span><br />",
            '<span id="cwl_', pval.id, '"></span>',
          "</div>"
        ].join(""));
        _str = $('<a href="' + pval.actions[2].link + '">x</a>').attr("href");
        _str = _str.replace(_rlcw, "://fb-zc-0.cafe.zynga.com/current/iframe/");
        $.ajax({
          url: _str,
          dataType: "text",
          error: _eajx(_str, { cate: "cwl", code: 9 }),
          success: function(hdata) {
            _rlcn.test(hdata) ? (
              _str = $(hdata).find("#lottoScratchButton1").attr("onclick"),
              _ary = $.json.parse('[' + _rltr.exec(_str)[1].replace(_rqtg, '"') + ']'),
              $.getJSON([
                _ary[0], "?uid=", _ary[1],
                "&secret=", _ary[2],
                "&scratchAreaName=", _ary[3],
                "&channel=", _ary[4],
                "&their_snood=", _ary[5],
                "&rid=", _ary[6]
              ].join(""), function (jdata) {
                jdata.prize_won ? (
                  _str = "http://facebook.cafe.static.zynga.com/60479/img/scratchLotto/",
                  $("#cwl_" + pval.id).html([
                    '<b class="susses">',
                      jdata.prize_message_part1, "&nbsp;", jdata.prize_message_part2,
                    "</b>"
                  ].join("")).parent().find("img").attr("src", _str + jdata.prize_image),
                  !(_act.cwl.creat >= _creat) && (_act.cwl.creat = _creat)
                ) : $("#cwl_" + pval.id).html(_cmsg(zmc.text.ELOTO, !0))
              })
            ) : (
              _rgon.test(hdata) ? (
                $("#cwl_" + pval.id).html(_cmsg(zmc.text.ELOTO, !0))
              ) : (
                _rbzy.test(hdata) ? (
                  $("[name=tbLimt]").val($("[name=tbLimt]").val() - 1),
                  $("#cwl_" + pval.id).html(_cmsg(zmc.text.ELIMT, !0))
                ): (
                  //$("[name=cbLott]").prop("checked", !1),
                  $("#cwl_" + pval.id).html(_cmsg(zmc.text.ELOT2, !0)).append($("<pre />").text(hdata).hide())
                )
              )
            )
          }
        })
      },
      _disp7 = function (pkey, pval) {
        if (pval.from.id === _act.uid) return;
        _rlot.test(pval.actions[2].link) ? (
          !(_act.cwl.creat < new Date()) && (_act.cwl.creat = 0),
          ($("[name=cbBack]").is(":checked") || !(_act.cwl.creat >= new Date(pval.created_time))) && (
            _act.cwl.code = 0,
            _disp8(pval)
          )
        ) : (
          $("[name=cbBack]").is(":checked") && $.ajax({
            url: pval.actions[2].link,
            error: $.noop,
            success: $.noop
          })
        )
      },
      _disp6 = function (jdata) {
        _act.inst && (
          jdata.data && jdata.data.length ? $.each(jdata.data, _disp7) : (
            _mat({ cate: "cwl", code: 8 }) && zmc.write(zmc.text.ELOTO)
          ),
          _act.cwl.untl = _rutl.exec(jdata.paging.next)[1]
        )
      },
      // display cw request from sign
      _disp5 = function (ikey, ival) {
        ival.success && zmc.push([
          "<div>",
            '<img class="itemimg" align=left src="http://graph.facebook.com/', ival.from_uid, '/picture" />',
            _cmsg(ival.message),
          "</div>"
        ].join(""))
      },
      _disp4 = function (rng) {
        $(rng).each(_disp5)
      },
      // display fv2 request
      _disp3 = function(pkey, pval) {
        if (!_act.inst) return;

        var _bnpost = $("[name=cbDark]").is(":checked") ? pval.data[0].ignore_post : pval.data[0].button_post;

        //if ("45004" == _tid) return;
        0 === $("#fv2_" + pkey).length && zmc.push([
          '<div>',
            '<img class="itemimg" align=left src="', pval.data[0].image, '" />',
            pval.data[0].title, "&nbsp;", pval.data[0].body, "<br />",
            '<span class="fgrey">(', pval.metadata.type_text, "&nbsp;",
            pval.metadata.subtype, "&nbsp;", pval.metadata.subtype_aggregate,
            ")</span><br />",
            '<span id="fv2_', pkey, '"></span>',
          "</div>"
        ].join(""));

        var _url = [
          _bnpost, "?eventIds%5B%5D=", pkey,
          "&eventTypeId=", pval.metadata.eventTypeId,
          "&action=accept&zySnid=1&zyAuthHash=", _act.fv2.auth,
          "&zySig=", _act.fv2.sig,
          //"&eventIds=", pkey,
          "&all=all&acceptOnly=0&zy_ctoken=null"
        ];

        $.getJSON(_url.join(""), function(jdata) {
          $("#fv2_" + pkey).html(
            jdata.success ? [
              '<b class="susses">',
                jdata.notif_data ? [
                  jdata.notif_data.title, "<br />",
                  jdata.notif_data.body
                ].join("") : zmc.text.ENOSP,
              "</b>"
            ].join("") : _cmsg(zmc.text.ERESP, !0)
          )
        })
      },
      // display cv request
      _ritm = /\{itemName\}/g,
      _disp2 = function(pkey, pval) {
        if (!_act.inst) return;

        var _ent = [
          "<div>",
            '<img class="itemimg" align=left src="', pval.data[0].image, '" />'],
          _usr = pval.data[0].userName,
          _iname = (pval.data[0].itemName || { }).value || pval.metadata.subtype;

        _usr && (_ent = _ent.concat([_usr, "&nbsp;"]));
        _ent = _ent.concat([
            pval.data[0].body, "<br />",
            '<span class="fgrey">(', _iname, ")</span><br />",
            '<span id="cv_', pkey, '"></span>',
          "</div>"
        ]);
        0 === $("#cv_" + pkey).length && zmc.push(_ent.join(""));

        var _url = [
          "http://fb.cooking.zynga.com/zsc.json?eventIds=", pkey,
          "&eventTypeId=", pval.metadata.type_id,
          "&action=accept&zySnid=1&zyAuthHash=", _act.cv.auth,
          "&zySig=", _act.cv.sig,
          "&all=all&eventIds%5B%5D=", pkey,
          "&zy_ctoken=null"
        ].join("");

        $.getJSON(_url, function(jdata) {
          jdata[0] && (jdata = jdata[0]);
          $("#cv_" + pkey).html(
            jdata.success ? [
              '<b class="susses">',
                (jdata.message && jdata.message.replace(_ritm, _iname)) || zmc.text.ENOSP,
              "</b>"
            ].join("") : _cmsg(zmc.text.ERESP, !0)
          )
        })
      },
      // display cw request
      _disp = function(pkey, pval) {
        var _bnpost = $("[name=cbDark]").is(":checked") ? pval.data[0].ignore_post : pval.data[0].button_post,
          _tid = pval.metadata.type_id;

        0 === $("#cw_" + pkey).length && zmc.push([
          "<div>",
            '<img class="itemimg" align=left src="', pval.data[0].image, '" />',
            pval.data[0].title, "&nbsp;", pval.data[0].body, "<br />",
            '<span class="fgrey">(', pval.metadata.subtype, ")</span><br />",
            '<span id="cw_', pkey, '"></span>',
          "</div>"
        ].join(""));

        var _url = [
          _bnpost,
          "&all=all&action=accept&eventIds%5B%5D=", pkey,
          "&acceptOnly=0&zy_ctoken=null"
        ];

        _tid && (_url = _url.concat(["&eventTypeId=", _tid]));
        $.getJSON(_url.join(""), function(jdata) {
          $("#cw_" + pkey).html(
            jdata[0].success ?
              _cmsg(jdata[0].message || zmc.text.ENOSP) :
              _cmsg(zmc.text.ERESP, !0)
          )
        })
      },
      // get you
      _ruid = /\/hprofile-ak-\w+\/\d+_(\d+)_\d+_\w\.jpg/,
      _ratk = /[&;]access_token=(\w+)/,
      _getu = function (hdata) {
        var _uid = _ruid.exec(hdata)[1];

        _uid && (
          $.extend(!0, _act, {
            uid: _uid,
            cwl: { lotk: _ratk.exec(hdata)[1] }
          }),
          $("#ltUID2").text(_uid)
        )
      },
      // get cw lotto token
      _sign16 = function () {
        _act.cwl.lotk = !1;
        _sign13()
      },
      _sign15 = function () {
        var _siz = Number($("[name=tbLimt]").val());
        var _url = [
          "https://graph.facebook.com/me/home?limit=", _siz,
          "&filter=app_101539264719&access_token=", _act.cwl.lotk
        ];

        _act.cwl.untl && $("[name=cbBack]").is(":checked") && (_url = _url.concat(["&until=", _act.cwl.untl]));
        $.getJSON(_url.join(""), _disp6).error(_sign16)
      },
      _sign14 = function(hdata) {
        _getu(hdata);
        _act.cwl.lotk && _sign15()
      },
      _sign13 = function () {
        var _url = "http://developers.facebook.com/docs/reference/api/search/";

        $.ajax({
          url: _url,
          dataType: "text",
          success: _sign14
        })
      },
      // get fv2 sign
      _rzya = /zySnid=(\d*)&.*?zyAuthHash=(\w+)&.*?zySig=(\w+)/,
      _rsgq = /name="signed_request"\s*value="(.+?)"\s*\/>/,
      _sign12 = function (hdata) {
        if (!_act.inst) return;

        var _zy = _rzya.exec(hdata);

        _act.fv2.auth = _zy[2];
        _act.fv2.sig = _zy[3];
        _act.fv2.proc();
        _act.fv2.proc = $.noop
      },
      _sign11 = function (hdata) {
        if (!_act.inst) return;
        _act.fv2.req = _rsgq.exec(hdata)[1];

        var _url = "http://fb1.farm2.zynga.com/?signed_request=" + _act.fv2.req;

        $.ajax({
          url: _url,
          dataType: "text",
          timeout: 100000,
          error: _eajx(_url, { cate: "fv2", code: 8 }),
          success: _sign12
        })
      },
      _sign10 = function () {
        var _url = "http://apps.facebook.com/farmville-two/";

        $.ajax({
          url: _url,
          cache: !1,
          dataType: "text",
          error: _eajx(_url, { cate: "fv2", code: 9 }),
          success: _sign11
        })
      },
      // get cv sign
      _rmsd = /messageData:\s*"(.*?)",/,
      _sign9 = function (hdata) {
        if (!_act.inst) return;
        _act.cv.uri = _rmsd.exec(hdata)[1];

        var _zy = _rzya.exec(_act.cv.uri);

        _act.cv.auth = _zy[2];
        _act.cv.sig = _zy[3];
        _act.cv.proc();
        _act.cv.proc = $.noop
      },
      _sign8 = function(hdata) {
        if (!_act.inst) return;
        _act.cv.req = _rsgq.exec(hdata)[1];

        var _url = "http://fb.cooking.zynga.com/?fb_source=bookmark_apps&ref=bookmarks&count=2&signed_request=" + _act.cv.req;

        $.ajax({
          url: _url,
          dataType: "text",
          error: _eajx(_url, { cate: "cv", code: 8 }),
          success: _sign9
        })
      },
      _sign7 = function () {
        var _url = "https://apps.facebook.com/chefville/";

        $.ajax({
          url: _url,
          cache: !1,
          dataType: "text",
          error: _eajx(_url, { cate: "cv", code: 9 }),
          success: _sign8
        })
      },
      // sign cw requests
      _rmsc = /_messageCenter\.(\w+)\((.+?)\);/,
      _sign5 = function (uri, act, eid, tid, tok) {
        $.getJSON(uri, {
          "action": act,
          eventId: eid,
          eventTypeId: tid,
          zy_ctoken: tok
        }, _disp4).error(_eajx(uri, { cate: "cw", code: 5 }))
      },
      _sign6 = function (uri, act, tid, eid, tok) {
        $.getJSON(uri, {
          "all": "all",
          "action": act,
          eventTypeId: tid,
          eventIds: eid,
          zy_ctoken: tok || null
        }, _disp4).error(_eajx(uri, { cate: "cw", code: 5 }))
      },
      _sign4 = function (idx, ent) {
        var _term = _rmsc.exec($(ent).attr("onclick"));

        if (!_term) return;

        var _term2 = $.json.parse('[' + _term[2].replace(_rqtg, '"') + ']');

        switch (_term[1]) {
          case "doAjaxRequest":
            _sign5(_term2[0], _term2[1], _term2[2], _term2[3], _term2[4]);
            break;
          case "doAjaxRequestForList":
            _sign6(_term2[0], _term2[1], _term2[2], _term2[3], _term2[4]);
            break;
        }
      },
      _sign3 = function (hdata) {
        if ($("[name=cbAlt]").is(":checked")) {
          var _list;

          try {
            _list = $(hdata).find(".action_accept")
          }
          catch (ex) {
            $.noop()
          }
          0 === _list.length ? (
            _mat({ cate: "cw", code: 7 }) && zmc.write("&nbsp;Caf&eacute; World" + zmc.text.MISSA)
          ) : (
            _act.cw.code = 0,
            _list.each(_sign4)
          )
        }
        else {
          if (!_act.inst) return;
          _act.cw.proc();
          _act.cw.proc = $.noop
        }
        zmc.write("&nbsp;Caf&eacute; World" + zmc.text.SIGNE)
      },
      _sign2 = function(hdata) {
        if (!_act.inst) return;
        _act.cw.req = _rsgq.exec(hdata)[1];

        var _url = "http://fb-zc-0.cafe.zynga.com/current/fb/ZMC/message_center.php?signed_request=" + _act.cw.req;

        $.ajax({
          url: _url,
          timeout: 100000,
          error: _eajx(_url, { cate: "cw", code: 8 }),
          success: _sign3
        })
      },
      _sign1 = function () {
        var _url = "http://apps.facebook.com/cafeworld/";

        $.ajax({
          url: _url,
          cache: !1,
          dataType: "text",
          error: _eajx(_url, { cate: "cw", code: 9 }),
          success: _sign2
        })
      },
      // parse fv2 requests
      _ask6 = function(jdata) {
        jdata && (
          0 === jdata.length ? (
            _mat({ cate: "fv2", code: 7 }) && zmc.write("&nbsp;Farm Ville 2" + zmc.text.MISSA)
          ) : (
            _act.fv2.code = 0,
            $.each(jdata, _disp3)
          )
        )
      },
      _ask5 = function () {
        if (!_act.inst) return;

        var _url = "http://fb1.farm2.zynga.com/message_center.php?signed_request=" + _act.fv2.req; 

        $.getJSON(_url, _ask6).error(_sign10)
      },
      // parse cv request
      _ask4 = function(jdata) {
        0 === jdata.length ? (
          _mat({ cate: "cv", code: 7 }) && zmc.write("&nbsp;Chef Ville" + zmc.text.MISSA)
        ) : (
          _act.cv.code = 0,
          $.each(jdata, _disp2)
        )
      },
      _ask3 = function () {
        _act.inst && (_act.cv.sig ? $.getJSON(_act.cv.uri, _ask4).error(_sign7) : _sign7())
      },
      // parse cw request
      _ask2 = function(jdata) {
        jdata ? (
          0 === jdata.length ? (
            _mat({ cate: "cw", code: 7 }) && zmc.write("&nbsp;Caf&eacute; World" + zmc.text.MISSA)
          ) : (
            _act.cw.code = 0,
            $.each(jdata, _disp)
          )
        ) : (
          zmc.write("&nbsp;Caf&eacute; World" + zmc.text.SIGNS),
          _sign1()
        )
      },
      _ask = function () {
        var _url = "http://fb-zc-0.cafe.zynga.com/current/iframe/messageCenter.php?action=getMessageData";

        $.getJSON(_url, _ask2).error(_eajx(_url, { cate: "cw", code: 6 }))
      },
      _trd = function () {
        var _cnt = $("[name=tbTime]");
        var _time = Number(_cnt.val());

        return 1 > _time ? (
          _stop(),
          zmc.pop(zmc.text.ETIME),
          _cnt.addClass("require"),
          _cnt.focus(),
          !1
        ) : (
          _act.time = _time * 1E3,
          !0
        )
      },
      // main loop
      _loop = function () {
        if (!_trd() || !_act.inst) return;

        var _rcv = !1;

        $("[name=cbCafe]").is(":checked") && (
          _rcv = !0,
          _act.cw.proc = _ask,
          _ask(),
          $("[name=cbLott]").is(":checked") && (_act.cwl.lotk ? _sign15() : _sign13())
        );
        $("[name=cbChef]").is(":checked") && (
          _rcv = !0,
          _act.cv.proc = _ask3,
          _ask3()
        );
        $("[name=cbFarm]").is(":checked") && (
          _rcv = !0,
          _act.fv2.proc = _ask5,
          _sign10()
        );
        _rcv ? (
          _act.inst = self.setTimeout(_loop, _act.time)
        ) : (
          zmc.pop(zmc.text.ECHK),
          _stop()
        )
      },
      _lng = function () {
        (!$("[name=cbEng]").is(":checked") && zmc.default) ? zmc.default() : zmc.lang();
        $("[name=bnEmpty]").click()
      };

    // y = $.json.text(x)
    // x = $.json.parse(y)
    $.json = $.json || (function (old) {
      var _f1, _f2, _this = { };

      old ? (
        _f1 = function (obj) {
          var _hexs = "0123456789ABCDEF",
            _2hex = function (d) {
              return _hexs[d >> 4] + _hexs[d & 0x0F]
            },
            _cod = function (s) {
              return s.replace(/[\"\\\x00-\x1F]/g, function (c) {
                switch (c) {
                  case '"':
                  case '\\':
                    return "\\" + c;
                  default:
                    return "\\x" + _2hex(c.charCodeAt(0));
                }
              })
            },
            _seri = function (ob) {
              var _ary = [];

              if (ob instanceof Array) {
                for (var j = 0, cnt = ob.length; j < cnt; j++)
                  _ary.push(_seri(ob[j]));

                return '[' + _ary.join(", ") + ']'
              }
              switch (typeof (ob)) {
                case "string":
                  // don't forget quotes
                  return '"' + _cod(ob) + '"';
                case "object":
                  for (var j in ob)
                    ob.hasOwnProperty(j) && _ary.push('"' + _cod(j) + '": ' + _seri(ob[j]));

                  return "{ " + _ary.join(", ") + " }";
                default:
                  return ob.toSource ? ob.toSource() : ob.toString();
              }
            };

          return _seri(obj)
        },
        _f2 = $.parseJSON
      ) : (
        _f1 = self.JSON.stringify,
        _f2 = self.JSON.parse
      )
      _this.text = _f1;
      _this.parse = _f2;

      return _this
    })(typeof (self.JSON) == "undefined");

    // backdoor
    zmc.current = function () {
      return _act;
    };
    // add log
    zmc.push = function (htms) {
      var _siz = Number($("[name=tbSize]").val());

      0 < _siz && $(".hist :nth-child(n+" + _siz + ")").remove();

      var _tag = _odev ? "<p />" : '<p class="entsev" />';

      $(".hist").prepend($(_tag).addClass("entp").append(htms));
      _odev = !_odev
    };
    zmc.write = function (msg) {
      zmc.push(new Date() + msg)
    };
    // pop message
    zmc.pop = function (msg) {
      $("[name=cbQuiet]").is(":checked") ? (
        $("#dvMemo").hide(),
        $("#dvMsg").text(msg).show(),
        $(".fulblk").fadeIn()
      ) : self.alert(msg)
    };
    // change UIs
    zmc.lang = function (msg) {
      zmc.text = $.extend({
        TITLE: "ZMC Clicker",
        HEADR: "ZMC Clicker [Beta]",
        FLBL: "Frequency(sec):",
        LIMFQ: "Too short increases risk of malfunction.",
        CLEAR: "Empty",
        CHINT: "Clear logs below.",
        START: "Start",
        STOP: "Stop",
        SHINT: "Machine Power On/Off.",
        ADVS: "Advanced",
        CAFE: "Receive from Caf\u00E9 World.",
        CHEF: "Receive from Chef Ville.",
        FARM: "Receive from Farm Ville 2.",
        QUIET: "Try to be quite.",
        QLBL: "Silent mode",
        ALTER: "Try to click request when signing.",
        ALBL: "Alternate mode",
        LOTTO: "Scratch Caf\u00E9 World Lottery",
        LLBL: "Lottery",
        BWARD: "Look backward to traverse all post.",
        BLBL: "Back",
        DARK: "Evil mode, I want NO requests!",
        DLBL: "Dark mode",
        TLBL: "Threshold:",
        THINT: "No more then 9 quadrillion.",
        LIMLT: "Lottery collecting limit.",
        ULBL: "Your UID:",
        FETCH: "Fetch",
        FHINT: "Get currently logged-in UID.",
        STHAL: "Ready.",
        STRUN: "Running.",
        CLOSE: "Close this popup.",
        SHUT: "Stopped.",
        RUNS: " - begin accept.",
        FINDA: " - ask found.",
        PARSA: " - ask downloaded.",
        MISSA: " - no ask found.",
        SIGNS: " - unknown response, start try signing.",
        SIGNX: " - get sign failed.",
        SIGNE: " - sign request done.",
        HANG: " - stop accept.",
        LOAD: "Configurations restored.",
        SAVE: "Configurations saved.",
        EAJAX: " Ajax request Error: ",
        EAJX2: "Check link",
        ETIME: "Invalid time interval.",
        ENOSP: "Accepted OK.",
        ERESP: "This request receiving failed.",
        ECHK: "Which game to run?",
        ESTOR: "LocalStorage not supported.",
        ELOTO: "Oops! Lottery missed.",
        ELOT2: "Lotto broken, relogin Facebook and then try check again.",
        ELIMT: "Too many requests, try decrease limitation."
      }, msg || { });
      $("#ltFreq").text(zmc.text.FLBL);
      $("[name=bnEmpty]").val(zmc.text.CLEAR).attr("title", zmc.text.CHINT);
      $("#ltAdvs").text(zmc.text.ADVS);
      $("#ltQuiet").text(zmc.text.QLBL);
      $("#ltAlt").text(zmc.text.ALBL);
      $("#ltLott").text(zmc.text.LLBL);
      $("#ltBack").text(zmc.text.BLBL);
      $("#ltDark").text(zmc.text.DLBL);
      $("#ltSize").text(zmc.text.TLBL);
      $("#ltUID").text(zmc.text.ULBL);
      if (_act.inst) {
        $("[name=bnStart]").val(zmc.text.STOP);
        $("#ltHint").addClass("strun").text(zmc.text.STRUN)
      }
      else {
        $("[name=bnStart]").val(zmc.text.START);
        $("#ltHint").removeClass("strun").text(zmc.text.STHAL)
      }
      $("[name=bnUID]").val(zmc.text.FETCH).attr("title", zmc.text.FHINT);
      $("[name=tbTime]").attr("title", zmc.text.LIMFQ);
      $("[name=bnStart]").attr("title", zmc.text.SHINT);
      $("[name=cbCafe]").parent().attr("title", zmc.text.CAFE);
      $("[name=cbAlt]").parent().attr("title", zmc.text.ALTER);
      $("[name=cbLott]").parent().attr("title", zmc.text.LOTTO);
      $("[name=cbBack]").parent().attr("title", zmc.text.BWARD);
      $("[name=cbChef]").parent().attr("title", zmc.text.CHEF);
      $("[name=cbFarm]").parent().attr("title", zmc.text.FARM);
      $("[name=cbQuiet]").parent().attr("title", zmc.text.QUIET);
      $("[name=cbDark]").parent().attr("title", zmc.text.DARK);
      $("[name=tbSize]").attr("title", zmc.text.THINT);
      $("[name=tbLimt]").attr("title", zmc.text.LIMLT);
      $(".qwin").attr("title", zmc.text.CLOSE);
      $("#gfBanner").attr("alt", zmc.text.HEADR);
      document.title = zmc.text.TITLE
    };
    // load setting
    zmc.load = function () {
      try {
        var jObj;

        (jObj = $.json.parse(self.localStorage.getItem("EZSKey"))) ? (
          $("[name=tbTime]").val(jObj.tbTime || 50),
          $("[name=cbEng]").prop("checked", jObj.cbEng),
          _lng(),
          $("[name=cbCafe]").prop("checked", jObj.cbCafe),
          $("[name=cbAlt]").prop("checked", jObj.cbAlt),
          $("[name=cbLott]").prop("checked", jObj.cbLott),
          $("[name=cbChef]").prop("checked", jObj.cbChef),
          $("[name=cbFarm]").prop("checked", jObj.cbFarm),
          $("[name=cbQuiet]").prop("checked", jObj.cbQuiet),
          $("[name=cbDark]").prop("checked", jObj.cbDark),
          $("[name=tbSize]").val(0 < Number(jObj.tbSize) ? jObj.tbSize : -1),
          $("[name=tbLimt]").val(0 < Number(jObj.tbLimt) ? jObj.tbLimt : 25),
          $("[name=taMemo]").val(jObj.taMemo),
          _act = $.extend(!0, jObj.oAct, _act),
          zmc.pop(zmc.text.LOAD)
        ) : _lng()
      }
      catch (ex) {
        _lng();
        zmc.pop(zmc.text.ESTOR)
      }
    };
    // save setting
    zmc.save = function () {
      if (!_trd()) return;
      try {
        self.localStorage.setItem("EZSKey", $.json.text({
          tbTime: $("[name=tbTime]").val(),
          cbCafe: $("[name=cbCafe]").is(":checked"),
          cbAlt: $("[name=cbAlt]").is(":checked"),
          cbLott: $("[name=cbLott]").is(":checked"),
          cbChef: $("[name=cbChef]").is(":checked"),
          cbFarm: $("[name=cbFarm]").is(":checked"),
          cbQuiet: $("[name=cbQuiet]").is(":checked"),
          cbDark: $("[name=cbDark]").is(":checked"),
          cbEng: $("[name=cbEng]").is(":checked"),
          tbSize: $("[name=tbSize]").val(),
          tbLimt: $("[name=tbLimt]").val(),
          taMemo: $("[name=taMemo]").val(),
          oAct: _act
        }));
        zmc.pop(zmc.text.SAVE)
      }
      catch (ex) {
        zmc.pop(zmc.text.ESTOR)
      }
    };
    zmc.new = function () {
      if (zmc.isFound) return;
      zmc.isFound = !0;
      $(".advblk, .fulblk, #dvMemo").hide();
      $("[name=bnEmpty]").click(function () {
        $.extend(!0, _act, {
          cw: { code: 0 },
          cv: { code: 0 },
          fv2: { code: 0 },
          cwl: { code: 0 }
        });
        $(".hist").empty()
      });
      zmc.load();
      _stop();
      $("[name=cbEng]").click(_lng);
      $("[name=tbTime]").change(function () {
        $(this).removeClass("require")
      });
      $("[name=bnStart]").click(function () {
        _act.inst ? (
          _stop(),
          zmc.write(zmc.text.HANG),
          zmc.pop(zmc.text.SHUT)
        ) : (
          $.extend(!0, _act, {
            cw: { code: 0 },
            cv: { code: 0 },
            fv2: { code: 0 },
            cwl: { code: 0 },
            inst: !0
          }),
          $(this).val(zmc.text.STOP),
          $("#ltHint").addClass("strun").text(zmc.text.STRUN),
          zmc.write(zmc.text.RUNS),
          _loop()
        )
      });
      $("[name=bnUID]").click(function () {
        $("#ltUID2").text("?");
        $.ajax({
          url: "http://developers.facebook.com/docs/reference/api/search/",
          dataType: "text",
          success: _getu
        })
      });
      $("#ltAdvs").click(function () {
        ("none" != $(".advblk").css("display")) && zmc.save();
        $(".advblk").slideToggle()
      });
      $(".qwin").click(function () {
        $(".fulblk").fadeOut()
      });
      $("img").error($.noop)
    };
    $(zmc.new)
  };

  // jquery.js REQUIRED
  self.jQuery ? _main() : (function () {
    var _head = document.getElementsByTagName("head")[0];
    var _jq = document.createElement("script");
    var _js = "jquery.min.js";

    try {
      _jq.type = "text/javascript";
      _jq.src = _js
    }
    catch (ex) {
      _jq.setAttribute("type", "text/javascript");
      _jq.setAttribute("src", _js)
    }
    _jq.onreadystatechange = _main;
    _jq.onload = _main;
    _head.appendChild(_jq)
  })()
})();
