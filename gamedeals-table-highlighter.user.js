// ==UserScript==
// @name        GameDeals table highlighter
// @namespace   ohmanger
// @grant       GM_xmlhttpRequest
// @include     https://www.reddit.com/r/GameDeals/comments/*
// @require     http://ajax.googleapis.com/ajax/libs/jquery/2.2.2/jquery.min.js
// @updateURL   https://raw.githubusercontent.com/ohmanger/userscripts/master/gamedeals-table-highlighter.user.js
// @downloadURL https://raw.githubusercontent.com/ohmanger/userscripts/master/gamedeals-table-highlighter.user.js
// @version     1.1.3
// ==/UserScript==

this.$ = this.jQuery = jQuery.noConflict(true);

var users = [
	'.author.id-t2_bukfv', // /u/dEnissay
	'.author.id-t2_in61j', // /u/ABOOD-THE-PLAYER
	'.author.id-t2_1pry1', // /u/pantsu
];

$( users.join(',') ).each( function( index ) {

	var table = $( this ).parent().parent().find( '.usertext-body table' );
	table.after( '<button class="gdth-get-status">Get Steam status</button>' );

});

$( '.sitetable' ).on( 'click', 'button.gdth-get-status', function( event ) {
	event.preventDefault();

	var table_rows = $( this ).siblings( 'table' ).find( 'tbody tr' );

	table_rows.each( function ( index ) {
		var tr = $(this),
		    app_url = tr.html().match( /http:\/\/store\.steampowered\.com\/app\/(\d*)\//ig );

		// Skip if no steam URL found
		if ( app_url === null ) {
			return 'continue';
		}

		GM_xmlhttpRequest ( {
			method:  "GET",
			url:     app_url[0],
			onload:  function ( response ) {
				var is_logged_in = response.responseText.indexOf( "Logout();" ) > -1;
				if ( is_logged_in ) {
					var in_library = response.responseText.indexOf( '<div class="already_in_library">' ) > -1;

					if ( in_library ) {
						tr.css( 'background', 'lightgreen' );
					} else {
						var in_wishlist = response.responseText.indexOf( '<div id="add_to_wishlist_area_success"' ) === -1;
						if ( in_wishlist ) {
							tr.css( 'background', 'lightblue' );
						}
					}
				}
			}
		});
	});
});
