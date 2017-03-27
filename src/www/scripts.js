/**
---
_bundle: true
---
*/

import Player from '../_components/player.vue.pug';

const _players = [];

function setupPlayer(node, done) {
  return (e) => {
    e.preventDefault();

    const div = document.createElement('div');

    node.parentNode.insertBefore(div, node);
    node.parentNode.removeChild(node);

    _players.push(new Player({
      el: div,
      data: () => ({
        src: node.dataset.play,
        title: node.dataset.title,
      }),
    }));

    done();
  };
}

Array.prototype.slice.call(document.querySelectorAll('button[data-play]'))
  .forEach((node) => {
    const cb = setupPlayer(node, () => {
      Promise.all(_players.map(player => player.stop()))
        .then(() => {
          node.removeEventListener('click', cb);
        });
    });

    node.addEventListener('click', cb);
  });
