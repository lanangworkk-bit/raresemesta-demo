/**
 * Rare Semesta — demo statis.
 * Meniru perilaku server (filter kategori, pencarian, aksi form)
 * yang tidak ada pada mirror statis GitHub Pages.
 */
(function () {
	'use strict';

	function toast(pesan) {
		var t = document.getElementById('rs-demo-toast');
		if (!t) {
			t = document.createElement('div');
			t.id = 'rs-demo-toast';
			t.setAttribute('role', 'status');
			t.style.cssText = 'position:fixed;left:50%;bottom:84px;transform:translateX(-50%);z-index:400;' +
				'max-width:min(92vw,420px);background:#2E5140;color:#fff;padding:12px 18px;border-radius:12px;' +
				'box-shadow:0 8px 30px rgba(0,0,0,.25);font-size:14px;line-height:1.45;text-align:center;' +
				'opacity:0;transition:opacity .25s;pointer-events:none';
			document.body.appendChild(t);
		}
		t.textContent = pesan;
		t.style.opacity = '1';
		clearTimeout(t._timer);
		t._timer = setTimeout(function () { t.style.opacity = '0'; }, 3400);
	}

	window.alert = function (pesan) { toast(pesan); };

	function param(nama) {
		var m = new RegExp('[?&]' + nama + '=([^&]*)').exec(window.location.search);
		return m ? decodeURIComponent(m[1].replace(/\+/g, ' ')) : '';
	}

	function setAktifChip(label) {
		document.querySelectorAll('.filter-chip').forEach(function (c) {
			c.classList.toggle('is-active', c.textContent.trim().toLowerCase() === label);
		});
	}

	function pesanKosong(kotak) {
		var lama = document.querySelector('.rs-kosong');
		if (lama) lama.remove();
		var p = document.createElement('p');
		p.className = 'rs-kosong';
		p.style.cssText = 'text-align:center;padding:36px 8px;color:#5a6b60';
		p.textContent = 'Belum ada konten yang cocok. Coba kategori atau kata kunci lain.';
		if (kotak && kotak.parentNode) kotak.parentNode.insertBefore(p, kotak.nextSibling);
	}

	function adaKonten() {
		var lama = document.querySelector('.rs-kosong');
		if (lama) lama.remove();
	}

	/* Galeri: chip ?kategori= → filter klien */
	var kotakGaleri = document.querySelector('.galeri-grid');
	if (kotakGaleri && document.querySelector('.galeri-item')) {
		var katG = param('kategori').toLowerCase();
		var cocokG = 0;
		document.querySelectorAll('.galeri-item').forEach(function (el) {
			var k = ((el.querySelector('.galeri-item__kategori') || {}).textContent || '').trim().toLowerCase();
			el.dataset.kat = k;
			var cocok = !katG || k === katG;
			el.style.display = cocok ? '' : 'none';
			if (cocok) cocokG++;
		});
		setAktifChip(katG || 'semua');
		if (!cocokG) pesanKosong(kotakGaleri);
		else adaKonten();
	}

	/* Publikasi: chip ?kategori= + pencarian ?q= → filter klien */
	var daftarBerita = document.querySelector('.berita-list');
	if (daftarBerita && document.querySelector('.berita-baris')) {
		var katP = param('kategori').toLowerCase();
		var qP = param('q').trim().toLowerCase();
		if (katP || qP) {
			var cocokP = 0;
			document.querySelectorAll('.berita-baris').forEach(function (el) {
				var judul = ((el.querySelector('h2') || {}).textContent || '').trim().toLowerCase();
				var okKat = !katP || (el.dataset.kat || '') === katP;
				var okQ = !qP || judul.indexOf(qP) !== -1;
				var tampil = okKat && okQ;
				el.style.display = tampil ? '' : 'none';
				if (tampil) cocokP++;
			});
			setAktifChip(katP || 'semua');
			if (qP) {
				var inp = document.querySelector('.search-form [name="q"]');
				if (inp) inp.value = param('q');
			}
			if (!cocokP) pesanKosong(daftarBerita);
			else adaKonten();
		}
	}

	document.addEventListener('submit', function (e) {
		var form = e.target;
		var action = form.getAttribute('action') || '';

		/* Form aksi WordPress / komentar tidak ada di demo statis */
		if (/admin-post\.php|wp-comments-post\.php|wp-login\.php/.test(action)) {
			e.preventDefault();
			toast('Ini demo statis — formulir tidak mengirim data. Silakan hubungi via WhatsApp atau email.');
			return;
		}

		/* Pencarian publikasi → filter di tempat */
		if (form.classList.contains('search-form')) {
			e.preventDefault();
			var input = form.querySelector('[name="q"]');
			var q = ((input || {}).value || '').trim().toLowerCase();
			var kotak = document.querySelector('.berita-list');
			var cocok = 0;
			document.querySelectorAll('.berita-baris').forEach(function (el) {
				var judul = ((el.querySelector('h2') || {}).textContent || '').trim().toLowerCase();
				var tampil = !q || judul.indexOf(q) !== -1;
				el.style.display = tampil ? '' : 'none';
				if (tampil) cocok++;
			});
			if (!cocok) pesanKosong(kotak);
			else adaKonten();
			setAktifChip('semua');
		}
	});
})();
