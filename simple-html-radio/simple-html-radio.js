/*
 * Simple HTML Radio 1.0.0
 * https://github.com/kosinix/simple-html-radio
 * Replace radio with span for easy styling via css.
 * 
 * Copyright 2014, Nico Amarilla
 * Dual licensed under the MIT or GPL Version 2 licenses.
 * http://www.opensource.org/licenses/mit-license.php
 * http://www.gnu.org/licenses/gpl.html
 */
(function($){
	var KEY_SPACE = 32,
		KEY_LEFT = 37,
		KEY_RIGHT = 39,
		KEY_UP = 38,
		KEY_DOWN = 40;
		
	var methods = {
		init : function( options ) {
			//Settings list and the default values
			var defaults = {
				classNames:{
					main:'simple-html-radio',
					inside:'simple-html-radio-inside',
					checked:'simple-html-radio-checked',
					disabled:'simple-html-radio-disabled',
					hidden:'simple-html-radio-hidden'
				}
			};
			options = $.extend(true, {}, defaults, options);
			
			return this.each(function() {
				var radioObj = $(this);//jquery object of our select element
				
				if('input'!=radioObj[0].nodeName.toLowerCase() || 'radio'!=radioObj.attr('type').toLowerCase() ){//check if its a <input> tag
					$.error( 'Not a radio element on jQuery.simpleHtmlRadio' );
				} else {
					
					var initialVal = radioObj.val(),
						initIndex = 0,
						html = '',
						simpleHtmlRadio = null;
					
					
					html = '<span class="'+options.classNames.main+'"><span class="'+options.classNames.inside+'"></span></span>';
					
					// Add to DOM and save ref
					simpleHtmlRadio = $(html).insertAfter(radioObj);
					
					
					//store cross references of radio and simpleHtmlRadio
					simpleHtmlRadio.data('radioObj', radioObj);
					radioObj.data('simpleHtmlRadio', simpleHtmlRadio);//save the new html element associated with a radio element
					
					if(radioObj.attr('disabled')){
						simpleHtmlRadio.addClass(options.classNames.disabled);
					} else {
						simpleHtmlRadio.attr('tabindex','0'); // Only add tabbing if not disabled
						radioObj.bind('click.simpleHtmlRadio', _radioClicked);
						simpleHtmlRadio.bind('click.simpleHtmlRadio', _simpleHtmlRadioClicked);
						simpleHtmlRadio.on("keydown", function(e) {
							e = e || window.event; // Use param e if it exists. use window.event otherwise (for <=IE8)
							var	self = $(this),
								key = null,
								name = '',
								radioObj = self.data('radioObj'),
								index = -1,
								max = 0,
								next = -1;
								
							if (e.keyCode) {
								key = e.keyCode;
							}
							
							if (radioObj) {
								name = radioObj.attr('name');
								index = $("input[name='"+name+"']").index(radioObj);
								max = $("input[name='"+name+"']").length;
							}
								
							if ( key == KEY_SPACE ) {
								$(this).trigger('click.simpleHtmlRadio');
								e.preventDefault(); // Stop browser from scrolling
							} else if (key == KEY_LEFT) {
								_selectPrev(index, max, name);
								e.preventDefault();
							} else if (key == KEY_RIGHT) {
								_selectNext(index, max, name);
								e.preventDefault();
							} else if (key == KEY_DOWN) {
								_selectNext(index, max, name);
								e.preventDefault();
							} else if (key == KEY_UP) {
								_selectPrev(index, max, name)
								e.preventDefault();
							}
						});
					}
					if(radioObj.is(':checked')){
						simpleHtmlRadio.addClass(options.classNames.checked);
					}
					
					// Hide the element. Must have style that hides it denoted by the classname
					radioObj.addClass(options.classNames.hidden);
					
				}
			});
		}
	};
	/*** Plugin Main ***/
	$.fn.simpleHtmlRadio = function(method) {
		
		// Method calling logic
		if ( methods[method] ) {
			return methods[ method ].apply( this, Array.prototype.slice.call( arguments, 1 )); // exclude first method "init"
		} else if ( typeof method === 'object' || ! method ) {
			return methods.init.apply( this, arguments );
		} else {
			$.error( 'Method ' +  method + ' does not exist on jQuery.simpleHtmlRadio' );
		}
		return false;
	}
	/*** Private Functions ***/
	function _radioClicked(e) {
		var radioObj = $(this), // $(this) refers to the original radio element
			name = radioObj.attr('name'),
			simpleHtmlRadio = radioObj.data('simpleHtmlRadio'); // Reference to simpleHtmlRadio
		
		// Select all radio with these names
		$('input[name="'+name+'"]').each(function(){
			var currentRadioObj = $(this),
				currentRadioData = currentRadioObj.data('simpleHtmlRadio');
			
			if(currentRadioData){
				currentRadioData.removeClass('simple-html-radio-checked'); // Remove check from all element with the same name
			}
		});
		simpleHtmlRadio.focus();
		simpleHtmlRadio.addClass('simple-html-radio-checked'); // Check self
		
	}
	function _simpleHtmlRadioClicked(e) {
		var simpleHtmlRadio = $(this), // $(this) refers to simpleHtmlRadio
			radioObj = simpleHtmlRadio.data('radioObj'); // Reference to  radioObj
			
		if (radioObj) {
			
			radioObj.trigger('click.simpleHtmlRadio'); // Trigger as if radio was clicked
		}
	}
	function _selectPrev(index, max, name){
		if (index != -1) {
			var next = index - 1;
			if (next >= 0) {
				_selectRadio( name, next );
			}
		}
	}
	function _selectNext(index, max, name){
		if (index != -1) {
			var next = index + 1;
			if (next <= max) {
				_selectRadio( name, next );
			}
		}
	}
	function _selectRadio( name, index ) {
		$("input[name='"+name+"']").eq(index).trigger('click.simpleHtmlRadio');
	}
})(jQuery);