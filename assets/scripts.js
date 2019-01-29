(function () {
  var __Player$t = [function(_c, context){with(this){return _c('div',{staticClass:"Player",class:state},[(state === "closed")?_c('span',{domProps:{"innerHTML":_s(innerHTML)},on:{"click":open}}):_c('div',[_c('div',{staticClass:"Player--title flex"},[_c('button',{staticClass:"col btn",on:{"click":close}},[_c('svg',[_c('use',{attrs:{"xlink:href":"#x-cancel"}})])]),_c('span',{staticClass:"col"},[_v(_s(title))])]),_v(" "),_c('div',{ref:"player",staticClass:"Player--canvas"}),_v(" "),_c('div',{staticClass:"Player--controls flex"},[(state !== "stopped")?_c('button',{staticClass:"col btn",on:{"click":stop}},[_c('svg',[_c('use',{attrs:{"xlink:href":"#x-stop"}})])]):_e(),_v(" "),_c('button',{staticClass:"col btn",on:{"click":toggle}},[(state === "playing")?_c('svg',[_c('use',{attrs:{"xlink:href":"#x-pause"}})]):_e(),_v(" "),(state !== "playing")?_c('svg',[_c('use',{attrs:{"xlink:href":"#x-play"}})]):_e()]),_c('span',{staticClass:"col"},[_v(_s(current)+"/"+_s(duration))])])])])}},
  []];
  var __Player$v = {};

  

  var TITLE = document.title;

  function formatTime(time) {
    return [
      Math.floor((time % 3600) / 60),
      ("00" + (Math.floor(time % 60))).slice(-2) ].join(':');
  }
  function initPlayer() {
    var this$1 = this;

    this.$refs.wavesurfer = WaveSurfer.create({
      container: this.$refs.player,
      barWidth: 3,
      cursorWidth: 0,
      waveColor: '#DDDDDD',
      progressColor: '#01FF70',
    });

    this.$refs.wavesurfer.load(this.src);

    this.$refs.wavesurfer.on('audioprocess', function () {
      this$1.current = formatTime(this$1.$refs.wavesurfer.getCurrentTime());
    });

    this.$refs.wavesurfer.on('ready', function () {
      this$1.duration = formatTime(this$1.$refs.wavesurfer.getDuration());
      this$1.play();
    });

    this.$refs.wavesurfer.on('finish', function () {
      doTrack('finish', this$1.title);

      var offset = PLAYERS.indexOf(this$1);
      var key = offset === PLAYERS.length - 1 ? 0 : offset + 1;

      PLAYERS[key].open();
      PLAYERS[key].play();
    });
  }

  function doTrack(e, title) {
    if (typeof ga !== 'undefined') {
      ga('send', 'event', e, title);
    }
  }

  var PLAYERS = [];

  __Player$v =  {
    props: ['src', 'title', 'innerHTML'],
    data: function data() {
      return {
        state: 'closed',
        current: '00:00',
        duration: '00:00',
      };
    },
    created: function created() {
      PLAYERS.push(this);

      var track = location.search.split('play=').pop();

      if (track && this.src.indexOf(track) > -1) {
        this.open();
        this.play();
      }
    },
    methods: {
      toggle: function toggle() {
        if (this.state !== 'playing') {
          this.play();
        } else {
          this.pause();
        }
      },
      pause: function pause() {
        document.title = TITLE + " - Playing \"" + (this.title) + "\" (paused)";

        if (this.$refs.wavesurfer) {
          this.$refs.wavesurfer.pause();
        }

        this.state = 'paused';
      },
      stop: function stop() {
        document.title = TITLE + " - Playing \"" + (this.title) + "\" (stopped)";

        if (this.$refs.wavesurfer) {
          this.$refs.wavesurfer.stop();
        }

        this.state = 'stopped';
      },
      play: function play() {
        doTrack('play', this.title);

        document.title = TITLE + " - Now playing \"" + (this.title) + "\"";

        history.replaceState(null, document.title, ("/our-music?play=" + (this.src.split('/').pop())));

        if (this.$refs.wavesurfer) {
          this.$refs.wavesurfer.play();
        }

        this.state = 'playing';
      },
      open: function open(e) {
        if (e) {
          e.preventDefault();

          doTrack('open', this.title);
        }

        document.title = TITLE + " - Loading \"" + (this.title) + "\"";

        setTimeout(initPlayer.bind(this));

        PLAYERS.forEach(function (player) {
          if (player.state !== 'closed') {
            player.close();
          }
        });

        this.state = 'stopped';
      },
      close: function close() {
        document.title = TITLE;

        history.replaceState(null, document.title, '/our-music');

        if (this.$refs.wavesurfer) {
          this.$refs.wavesurfer.destroy();
          this.$refs.wavesurfer = null;
        }

        this.state = 'closed';
      },
    },
  };
  __Player$v._scopeId = "vuePlayer";
  __Player$v.render = __Player$t[0];
  __Player$v.render._withStripped = true;
  __Player$v.staticRenderFns = __Player$t[1];

  var Player = __Player$v;

  

  Array.prototype.slice.call(document.querySelectorAll('a[data-is-music]'))
    .map(function (node) {
      var div = document.createElement('div');

      var audioTitle = node.dataset.isMusic;
      var outerHTML = node.outerHTML;
      var audioUrl = node.href;

      node.parentNode.insertBefore(div, node);
      node.parentNode.removeChild(node);

      return new Vue({
        el: div,
        render: function render(h) {
          return h(Player, {
            props: {
              src: audioUrl,
              title: audioTitle,
              innerHTML: outerHTML,
            },
          });
        },
      });
    });

}());
