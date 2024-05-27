import { useEffect, useState } from 'react';
import screenfull from 'screenfull';
import Link from 'next/link'
import styles from './Player.module.scss';
import Shares from 'components/Shares';

const Player = ({ options }) => {

  const [gameInitialized, setGameInitialized] = useState(false);

  useEffect(() => {
    const flash = document.getElementById('flash-container');

    if (flash == null) {
			return;
		}

    if (!gameInitialized) {
      addGameScrollListeners();
    } else {
      window.addEventListener('resize', gameRecalc);
    }
    
  }, [gameInitialized]);

  function canFullscreen() {
		for (const key of [
			'exitFullscreen',
			'webkitExitFullscreen',
			'webkitCancelFullScreen',
			'mozCancelFullScreen',
			'msExitFullscreen',
		]) {
			if (key in document) {
				return true;
			}
		}
		return false;
	}

  function enableFullscreen(event) {
    event.preventDefault();

    const flash = document.getElementById('flash-container');
    if (canFullscreen) {
			if (screenfull.isEnabled) {
        screenfull.request(flash);
      }

			screenfull.on('change', () => {
				changeFullscreen(flash);
			});

		}
	}

  function changeFullscreen(flash) {
		if (screenfull.isFullscreen) {
			flash.classList.add('fullscreen');
		} else {
			flash.classList.remove('fullscreen');
		}
	}

  function addGameScrollListeners() {
		window.addEventListener('scroll', gameInit, { once: true, passive: true });
		window.addEventListener('click', gameInit, { once: true, passive: true });
		window.addEventListener('mousemove', gameInit, { once: true, passive: true });
		window.addEventListener('touchstart', gameInit, { once: true, passive: true });
		window.addEventListener('keydown', gameInit, { once: true, passive: true });

		setTimeout(gameInit, 7000);
	}

	function removeGameScrollListeners() {
		window.removeEventListener('scroll', gameInit, false);
		window.removeEventListener('click', gameInit, false);
		window.removeEventListener('mousemove', gameInit, false);
		window.removeEventListener('touchstart', gameInit, false);
		window.removeEventListener('keydown', gameInit, false);
	}

  function gameInit() {
		if (gameInitialized === false) {
			setGameInitialized(true);
			gameLoader();

			setTimeout(() => {
				removeGameScrollListeners();
			}, 100);
		} else {
      removeGameScrollListeners();
    }
	}

  function gameLoader() {
		const flash = document.getElementById('flash-container');
		const btnStart = document.getElementById('js-player-start');

		if (flash == null) {
			return;
		}

		if (btnStart == null) {
			gameInitialize();
			gameRecalc();
		} else {
			btnStart.addEventListener("click", function (event) {
				event.preventDefault();
				playerStart(btnStart, flash);
			});
		}
	}

  function gameInitialize() {
		const iframes = document.querySelectorAll('iframe[external_src]');

    iframes.forEach( (iframe) => {
      let external_src = iframe.getAttribute('external_src');
      iframe.setAttribute('src', external_src);
      iframe.removeAttribute("external_src");
    });
	}

  function playerStart(btnStart, flash) {
		const iframe_code = btnStart.dataset.code;
		const overlay = document.getElementById('js-overlay');

		flash.innerHTML = iframe_code;
		flash.classList.remove('hidden');
		overlay.classList.add('hidden');
		gameRecalc();
	}

  function gameRecalc() {

    const flash = document.getElementById('flash-container');
		const fullwidth = flash.dataset.fullwidth;

		if (!fullwidth) {

			recalcIframe();

		} else {

			var exampleContainer = document.querySelector('header .area');
			var containerWidth = exampleContainer.clientWidth;

			var gameContainer = document.querySelector('.flash-container');
			var game = document.querySelector('.flash-container iframe');
			var gameWidth = game.getAttribute('width');
			game.classList.add('hidden');
			var gameWidthRendered = gameContainer.clientWidth;
			var differentWidth = gameWidth - gameWidthRendered;

			let fullwidthContent = containerWidth + differentWidth;

			let heading = document.querySelector('.area--content');
			if (heading !== null && differentWidth > 0) {
				heading.style.width = fullwidthContent + 'px';
				heading.style.maxWidth = fullwidthContent + 'px';
			}

			game.classList.remove('hidden');
		}
	}

  function recalcIframe() {

    const flash = document.getElementById('flash-container');
    const iframe = flash.querySelector('iframe');

		var wHeight = window.innerHeight;

		var initWidth = iframe.getAttribute('width');
		var initHeight = iframe.getAttribute('height');

		var newWidth, newHeight, ratio = 0;

		iframe.classList.add('hidden');

		newWidth = flash.offsetWidth;

		ratio = parseInt(initWidth) / parseInt(initHeight);
		newHeight = newWidth / ratio;


		// if result height object > height window
		if (newHeight > wHeight) {
			newHeight = wHeight;
			newWidth = newHeight * ratio;
		}

		if (newHeight > (wHeight - 60) && !flash.classList.contains('fullscreen')) {
			newHeight = wHeight - 60;
			newWidth = newHeight * ratio;
		}

		iframe.setAttribute('width', newWidth);
		iframe.setAttribute('height', newHeight);

		iframe.classList.remove('hidden');

	}
  

  return (
    <div className={styles.player}>
      <div className={styles.playerContent}>
        <div className={styles.playerArea}>
          <div
            id="flash-container"
            className="flash-container"
            dangerouslySetInnerHTML={{
              __html: options.flashIframe,
            }}
          ></div>

          <div className={styles.playerFooter}>
            <Shares />

            <Link
              href="#"
              className="btn btn--primary"
              data-id={`1`}
              title="Add to my games"
            >
              To favorites
            </Link>
            <Link
              href="#"
              className="btn btn--accent btn--icon"
              title="Fullscreen"
              onClick={enableFullscreen}
            >
              <svg className="icon" width="24px" height="24px">
                <use href="#icon-fullscreen"></use>
              </svg>
            </Link>
          </div>

        </div>
        <div className={styles.player__promo}>
          Promo
        </div>
      </div>

    </div>
  );
};

export default Player;
