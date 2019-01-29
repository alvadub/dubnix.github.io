import Player from './components/Player.vue.pug';

/* global Vue */

Array.prototype.slice.call(document.querySelectorAll('a[data-is-music]'))
  .map((node) => {
    const div = document.createElement('div');

    const audioTitle = node.dataset.isMusic;
    const outerHTML = node.outerHTML;
    const audioUrl = node.href;

    node.parentNode.insertBefore(div, node);
    node.parentNode.removeChild(node);

    return new Vue({
      el: div,
      render(h) {
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
