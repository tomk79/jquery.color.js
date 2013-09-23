/**
 * jquery.color.js 0.1.0b1
 * @author (C)Tomoya Koyanagi.
 */
(function($){

	/**
	 * 文字列を数値に変換
	 */
	function intval(val){
		var type = typeof(val);
		if( type === typeof(0) ){
			return val;
		}
		if( type === typeof('') ){
			val = val.replace(/[^0-9]/, '');
			val = val.replace(/^0+/, '');
			return Number(val);
		}
		if( type === typeof([]) ){
			return val.length;
		}
		if( val === true ){
			return 1;
		}
		if( val === false ){
			return 0;
		}
		if( val === undefined ){
			return 0;
		}
		return val;
	}

	/**
	 * 数値かどうか調べる
	 */
	function isInt(val){
		if( typeof(val) !== typeof(0) ){
			return false;
		}
		return true;
	}

	/**
	 * 文字列かどうか調べる
	 */
	function isString(val){
		if( typeof(val) !== typeof('') ){
			return false;
		}
		return true;
	}

	/**
	 * 文字数を調べる
	 */
	function strlen(val){
		if(val === null){ return 0; }
		if(val === undefined){ return 0; }
		val = ''+val;
		return val.length;
	}


	/**
	 * strPadLeft()
	 */
	 function strPadLeft( str, width, strPad ){
	 	if( !strlen(strPad) ){
	 		strPad = '_';
	 	}
	 	if( !isString(str) ){
	 		str = ''+str;
	 	}
	 	if( !isString(str) ){
	 		return false;
	 	}
	 	while( strlen(str+'')  < width ){
	 		str = '' + strPad + str;
	 	}
	 	return str;
	 }


	/**
	 * 16進数の色コードからRGBの10進数を得る
	 */
	$.color_hex2rgb = function( txt_hex ){
		if( isInt( txt_hex ) ){
			txt_hex = txt_hex.toString(16).replace(/\..+$/, '');
			txt_hex = '#'.strPadLeft( txt_hex , 6 , '0' );
		}
		txt_hex = txt_hex.replace( /^#/ , '' );
		if( strlen( txt_hex ) == 3 ){
			// 長さが3バイトだったら
			if( !txt_hex.match( new RegExp('^([0-9a-f])([0-9a-f])([0-9a-f])$', 'i') ) ){
				return	false;
			}
			$matched = [];
			$matched[1] = RegExp.$1+''+RegExp.$1;
			$matched[2] = RegExp.$2+''+RegExp.$2;
			$matched[3] = RegExp.$3+''+RegExp.$3;

		}else if( strlen( txt_hex ) == 6 ){
			// 長さが6バイトだったら
			$matched = [];
			if( !txt_hex.match( new RegExp('^([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})$', 'i') ) ){
				return	false;
			}
			$matched[1] = RegExp.$1+'';
			$matched[2] = RegExp.$2+'';
			$matched[3] = RegExp.$3+'';
		}else{
			return	false;
		}
		var rtn = {};
		rtn['r'] = eval( '0x' + $matched[1] );
		rtn['g'] = eval( '0x' + $matched[2] );
		rtn['b'] = eval( '0x' + $matched[3] );

		return	rtn;
	}

	/**
	 * RGBの10進数の色コードから16進数を得る
	 */
	$.color_rgb2hex = function( int_r , int_g , int_b ){
		var hex_r = intval(int_r).toString(16).replace(/\..+$/, '');
		var hex_g = intval(int_g).toString(16).replace(/\..+$/, '');
		var hex_b = intval(int_b).toString(16).replace(/\..+$/, '');
		if( strlen( hex_r ) > 2 || strlen( hex_g ) > 2 || strlen( hex_b ) > 2 ){
			return	false;
		}
		var rtn = '#';
		rtn += strPadLeft( hex_r , 2 , '0' );
		rtn += strPadLeft( hex_g , 2 , '0' );
		rtn += strPadLeft( hex_b , 2 , '0' );
		return	rtn;
	}

	/**
	 * 色相を調べる
	 */
	$.color_get_hue = function( txt_hex , int_round ){
		var int_round = intval( int_round );
		if( int_round < 0 ){ return false; }

		var rgb = $.color_hex2rgb( txt_hex );
		if( rgb === false ){ return false; }

		for( var $key in rgb ){
			rgb[$key] = rgb[$key]/255;
		}

		var $hue = 0;
		if( rgb['r'] == rgb['g'] && rgb['g'] == rgb['b'] ){
			return	0;
		}
		if( rgb['r'] >= rgb['g'] && rgb['g'] >= rgb['b'] ){
			// R>G>B
			$hue = 60 * ( (rgb['g']-rgb['b'])/(rgb['r']-rgb['b']) );

		}else if( rgb['g'] >= rgb['r'] && rgb['r'] >= rgb['b'] ){
			// G>R>B
			$hue = 60 * ( 2-( (rgb['r']-rgb['b'])/(rgb['g']-rgb['b']) ) );

		}else if( rgb['g'] >= rgb['b'] && rgb['b'] >= rgb['r'] ){
			// G>B>R
			$hue = 60 * ( 2+( (rgb['b']-rgb['r'])/(rgb['g']-rgb['r']) ) );

		}else if( rgb['b'] >= rgb['g'] && rgb['g'] >= rgb['r'] ){
			// B>G>R
			$hue = 60 * ( 4-( (rgb['g']-rgb['r'])/(rgb['b']-rgb['r']) ) );

		}else if( rgb['b'] >= rgb['r'] && rgb['r'] >= rgb['g'] ){
			// B>R>G
			$hue = 60 * ( 4+( (rgb['r']-rgb['g'])/(rgb['b']-rgb['g']) ) );

		}else if( rgb['r'] >= rgb['b'] && rgb['b'] >= rgb['g'] ){
			// R>B>G
			$hue = 60 * ( 6-( (rgb['b']-rgb['g'])/(rgb['r']-rgb['g']) ) );

		}else{
			return	0;
		}

		if( int_round ){
			$hue = Math.round( $hue , int_round );
		}else{
			$hue = intval( $hue );
		}
		return $hue;
	}

	/**
	 * 彩度を調べる
	 */
	$.color_get_saturation = function( txt_hex , int_round ){
		var int_round = intval( int_round );
		if( int_round < 0 ){ return false; }

		var rgb = $.color_hex2rgb( txt_hex );
		if( rgb === false ){ return false; }

		var aryRGB = [rgb['r'], rgb['g'], rgb['b']];
		aryRGB.sort();
		var minval = aryRGB[0];
		var maxval = aryRGB[2];

		if( minval == 0 && maxval == 0 ){
			// 真っ黒だったら
			return	0;
		}

		var saturation = ( 100-( minval/maxval * 100 ) );

		if( int_round ){
			saturation = Math.round( saturation , int_round );
		}else{
			saturation = intval( saturation );
		}
		return intval(saturation);
	}

	/**
	 * 明度を調べる
	 */
	$.color_get_brightness = function( txt_hex , int_round ){
		var int_round = intval( int_round );
		if( int_round < 0 ){ return false; }

		var rgb = $.color_hex2rgb( txt_hex );
		if( rgb === false ){ return false; }

		var aryRGB = [rgb['r'], rgb['g'], rgb['b']];
		aryRGB.sort();
		var maxval = aryRGB[2];

		var $brightness = ( maxval * 100/255 );

		if( int_round ){
			$brightness = Math.round( $brightness , int_round );
		}else{
			$brightness = intval( $brightness );
		}
		return $brightness;
	}

	/**
	 * 16進数のRGBコードからHSB値を得る
	 */
	$.color_hex2hsb = function( txt_hex , int_round ){
		var int_round = intval( int_round );
		if( int_round < 0 ){ return false; }

		var $hsb = {
			'h': $.color_get_hue( txt_hex , int_round ) ,
			's': $.color_get_saturation( txt_hex , int_round ) ,
			'b': $.color_get_brightness( txt_hex , int_round )
		};
		return	$hsb;
	}

	/**
	 * RGB値からHSB値を得る
	 */
	$.color_rgb2hsb = function( int_r , int_g , int_b , int_round ){
		var int_round = intval( int_round );
		if( int_round < 0 ){ return false; }

		var txt_hex = $.color_rgb2hex( int_r , int_g , int_b );
		var $hsb = {
			'h': $.color_get_hue( txt_hex , int_round ) ,
			's': $.color_get_saturation( txt_hex , int_round ) ,
			'b': $.color_get_brightness( txt_hex , int_round )
		};
		return	$hsb;
	}

	/**
	 * HSB値からRGB値を得る
	 */
	$.color_hsb2rgb = function( int_hue , int_saturation , int_brightness , int_round ){
		var int_round = intval( int_round );
		if( int_round < 0 ){ return false; }

		var int_hue = Math.round( int_hue%360 , 3 );
		var int_saturation = Math.round( int_saturation , 3 );
		var int_brightness = Math.round( int_brightness , 3 );

		var maxval = Math.round( int_brightness * ( 255/100 ) , 3 );
		var minval = Math.round( maxval - ( maxval * int_saturation/100 ) , 3 );

		var keyname = ['r' , 'g' , 'b'];
		if(      int_hue >=   0 && int_hue <  60 ){
			keyname = ['r' , 'g' , 'b'];
			midval = minval + ( (maxval - minval) * ( (int_hue -  0)/60 ) );
		}else if( int_hue >=  60 && int_hue < 120 ){
			keyname = [ 'g' , 'r' , 'b' ];
			midval = maxval - ( (maxval - minval) * ( (int_hue - 60)/60 ) );
		}else if( int_hue >= 120 && int_hue < 180 ){
			keyname = [ 'g' , 'b' , 'r' ];
			midval = minval + ( (maxval - minval) * ( (int_hue -120)/60 ) );
		}else if( int_hue >= 180 && int_hue < 240 ){
			keyname = [ 'b' , 'g' , 'r' ];
			midval = maxval - ( (maxval - minval) * ( (int_hue -180)/60 ) );
		}else if( int_hue >= 240 && int_hue < 300 ){
			keyname = [ 'b' , 'r' , 'g' ];
			midval = minval + ( (maxval - minval) * ( (int_hue -240)/60 ) );
		}else if( int_hue >= 300 && int_hue < 360 ){
			keyname = [ 'r' , 'b' , 'g' ];
			midval = maxval - ( (maxval - minval) * ( (int_hue -300)/60 ) );
		}

		var tmpRGB = {};
		if( int_round ){
			tmpRGB[keyname[0]] = Math.round( maxval , int_round );
			tmpRGB[keyname[1]] = Math.round( midval , int_round );
			tmpRGB[keyname[2]] = Math.round( minval , int_round );
		}else{
			tmpRGB[keyname[0]] = intval( maxval );
			tmpRGB[keyname[1]] = intval( midval );
			tmpRGB[keyname[2]] = intval( minval );
		}

		var rgb = {
			'r': tmpRGB['r'] ,
			'g': tmpRGB['g'] ,
			'b': tmpRGB['b']
		};

		return	rgb;
	}
	/**
	 * HSB値から16進数のRGBコードを得る
	 */
	$.color_hsb2hex = function( int_hue , int_saturation , int_brightness , int_round ){
		var rgb = $.color_hsb2rgb( int_hue , int_saturation , int_brightness , int_round );
		var hex = $.color_rgb2hex( rgb['r'] , rgb['g'] , rgb['b'] );
		return	hex;
	}

})(jQuery);
