// REVEAL ANIMATE

var revealAnimate = function() {

	var _init = function() {
		if (!(/msie [6|7|8|9]/i.test(navigator.userAgent))){
		wow = new WOW(
		{
			animateClass: 'animated',
			offset:100,
			live: true,
			mobile: false
		});}
	}

	return {
		//main function to initiate the module
		init: function() {

			_init();

		}

	};
}();

$(document).ready(function() {
	revealAnimate.init();
	new WOW().init();
});


