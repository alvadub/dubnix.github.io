/**
---
_bundle: true
---
*/

import Player from '../_components/player.vue.pug';

Array.prototype.slice.call(document.querySelectorAll('a[data-is-music]'))
  .map((node) => {
    const div = document.createElement('div');

    const audioTitle = node.dataset.isMusic;
    const outerHTML = node.outerHTML;
    const audioUrl = node.href;

    node.parentNode.insertBefore(div, node);
    node.parentNode.removeChild(node);

    return new Player({
      el: div,
      data: () => ({
        innerHTML: outerHTML,
        src: audioUrl,
        title: audioTitle,
      }),
    });
  });
