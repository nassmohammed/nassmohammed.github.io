/*
	Strata by HTML5 UP
	html5up.net | @ajlkn
	Free for personal and commercial use under the CCA 3.0 license (html5up.net/license)
*/

(function($) {

	var $window = $(window),
		$body = $('body'),
		$header = $('#header'),
		$footer = $('#footer'),
		$main = $('#main'),
		settings = {

			// Parallax background effect?
				parallax: true,

			// Parallax factor (lower = more intense, higher = less intense).
				parallaxFactor: 20

		};

	// Breakpoints.
		breakpoints({
			xlarge:  [ '1281px',  '1800px' ],
			large:   [ '981px',   '1280px' ],
			medium:  [ '737px',   '980px'  ],
			small:   [ '481px',   '736px'  ],
			xsmall:  [ null,      '480px'  ],
		});

	// Play initial animations on page load.
		$window.on('load', function() {
			window.setTimeout(function() {
				$body.removeClass('is-preload');
			}, 100);
		});

	// Touch?
		if (browser.mobile) {

			// Turn on touch mode.
				$body.addClass('is-touch');

			// Height fix (mostly for iOS).
				window.setTimeout(function() {
					$window.scrollTop($window.scrollTop() + 1);
				}, 0);

		}

	// Footer.
		breakpoints.on('<=medium', function() {
			$footer.insertAfter($main);
		});

		breakpoints.on('>medium', function() {
			$footer.appendTo($header);
		});

	// Header.

		// Parallax background.

			// Disable parallax on IE (smooth scrolling is jerky), and on mobile platforms (= better performance).
				if (browser.name == 'ie'
				||	browser.mobile)
					settings.parallax = false;

			if (settings.parallax) {

				breakpoints.on('<=medium', function() {

					$window.off('scroll.strata_parallax');
					$header.css('background-position', '');

				});

				breakpoints.on('>medium', function() {

					$header.css('background-position', 'left 0px');

					$window.on('scroll.strata_parallax', function() {
						$header.css('background-position', 'left ' + (-1 * (parseInt($window.scrollTop()) / settings.parallaxFactor)) + 'px');
					});

				});

				$window.on('load', function() {
					$window.triggerHandler('scroll');
				});

			}

	// Main Sections: Two.

		// Lightbox gallery (opt-in).
		$window.on('load', function() {
			var $two = $('#two');
			if ($two.length === 0)
				return;

			// Only enable if explicitly requested by the page.
			if (!$two.is('[data-lightbox="true"]'))
				return;

			if (!$.fn.poptrox)
				return;

			$two.poptrox({
				caption: function($a) {
					return $a.closest('.work-item').find('.hidden-caption').html();
				},
				overlayColor: '#2c2c2c',
				overlayOpacity: 0.85,
				popupCloserText: '',
				popupLoaderText: 'Loading',
				selector: '.work-item a.image',
				usePopupCaption: true,
				usePopupDefaultStyling: false,
				usePopupEasyClose: true,
				windowMargin: (breakpoints.active('<=small') ? 0 : 50)
			});
		});

	// Highlights: expand details within the card (no popups).
		$window.on('load', function() {
			var $two = $('#two');
			if ($two.length === 0)
				return;

			if (!$two.is('[data-inline-expand="card"]'))
				return;

			var collapseAllExcept = function($keep) {
				$two.find('.work-item.is-expanded').not($keep).each(function() {
					var $item = $(this);
					$item.removeClass('is-expanded');
					$item.find('.work-item-details').attr('aria-hidden', 'true');
				});
			};

			$two.on('click', '.work-item', function(e) {
				// Don't steal clicks from links inside the card.
				if ($(e.target).closest('a, button').length)
					return;

				var $item = $(this);
				var $details = $item.find('.work-item-details').first();
				if ($details.length === 0)
					return;

				var isExpanded = $item.hasClass('is-expanded');
				if (!isExpanded)
					collapseAllExcept($item);

				$item.toggleClass('is-expanded', !isExpanded);
				$details.attr('aria-hidden', String(isExpanded));
			});
		});
})(jQuery);
