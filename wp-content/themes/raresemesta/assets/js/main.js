/**
 * Rare Semesta — interaksi front-end.
 */
(function () {
	'use strict';

	/* Splash: tutup setelah beberapa detik (sekali per sesi). */
	var splash = document.getElementById('splash');
	if (splash && document.documentElement.classList.contains('splash-aktif')) {
		var tutupSplash = function () {
			if (splash.classList.contains('is-done')) return;
			splash.classList.add('is-done');
			try { sessionStorage.setItem('rs-splash', '1'); } catch (e) {}
			setTimeout(function () {
				splash.style.display = 'none';
				document.documentElement.classList.remove('splash-aktif');
			}, 600);
		};
		var jeda = window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 400 : 2600;
		setTimeout(tutupSplash, jeda);
		splash.addEventListener('click', tutupSplash);
		document.addEventListener('keydown', function (e) {
			if (e.key === 'Escape' || e.key === 'Enter' || e.key === ' ') tutupSplash();
		});
	}

	/* Toggle menu mobile. */
	var toggle = document.getElementById('nav-toggle');
	var nav = document.getElementById('site-nav');

	if (toggle && nav) {
		toggle.addEventListener('click', function () {
			var open = nav.classList.toggle('is-open');
			toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
			document.body.classList.toggle('nav-open', open);
		});

		nav.addEventListener('click', function (e) {
			if (e.target.closest('a')) {
				nav.classList.remove('is-open');
				toggle.setAttribute('aria-expanded', 'false');
				document.body.classList.remove('nav-open');
			}
		});

		document.addEventListener('keydown', function (e) {
			if (e.key === 'Escape' && nav.classList.contains('is-open')) {
				nav.classList.remove('is-open');
				toggle.setAttribute('aria-expanded', 'false');
				document.body.classList.remove('nav-open');
				toggle.focus();
			}
		});
	}

	/* Form: cegah double-submit. */
	document.querySelectorAll('form.form-guard').forEach(function (form) {
		form.addEventListener('submit', function (e) {
			var btn = form.querySelector('button[type="submit"], input[type="submit"]');
			if (form.dataset.sending === '1') {
				e.preventDefault();
				return;
			}
			form.dataset.sending = '1';
			if (btn) {
				btn.disabled = true;
				btn.setAttribute('aria-busy', 'true');
				if (btn.tagName === 'BUTTON') {
					btn.textContent = 'Mengirim…';
				}
			}
		});
	});

	/* Tab/toggle untuk halaman Profil (sidebar tabs tanpa reload). */
	var tabLinks = document.querySelectorAll('[data-tab]');
	if (tabLinks.length) {
		tabLinks.forEach(function (link) {
			link.addEventListener('click', function (e) {
				var target = link.getAttribute('data-tab');
				var panel = document.getElementById('tab-' + target);
				if (!panel) return;
				e.preventDefault();
				tabLinks.forEach(function (l) { l.classList.remove('is-active'); });
				link.classList.add('is-active');
				document.querySelectorAll('.profil-tabpanel').forEach(function (p) {
					p.hidden = p !== panel;
				});
				if (history.replaceState) {
					history.replaceState(null, '', '#' + target);
				}
			});
		});

		/* Deep-link: #visi, #tab-visi dst. */
		if (location.hash) {
			var h = location.hash.replace(/^#(tab-)?/, '');
			var deep = document.querySelector('[data-tab="' + h + '"]');
			if (deep) deep.click();
		}
	}
})();
