/**
---
_bundle: true
---
*/

import Player from '../_components/player.vue.pug';

Array.prototype.slice.call(document.querySelectorAll('[data-play]'))
  .map((node) => {
    const div = document.createElement('div');

    const innerHTML = node.innerHTML;
    const dataSet = node.dataset;

    node.parentNode.insertBefore(div, node);
    node.parentNode.removeChild(node);

    return new Player({
      el: div,
      data: () => ({
        innerHTML,
        src: dataSet.play,
        title: dataSet.title,
      }),
    });
  });
