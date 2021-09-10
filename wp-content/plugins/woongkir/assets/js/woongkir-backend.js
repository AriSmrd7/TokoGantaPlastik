(function($, wc_checkout_params) {
"use strict";

// https://tc39.github.io/ecma262/#sec-array.prototype.find
if (!Array.prototype.find) {
	Object.defineProperty(Array.prototype, 'find', {
		value: function (predicate) {
			// 1. Let O be ? ToObject(this value).
			if (this == null) {
				throw TypeError('"this" is null or not defined');
			}

			var o = Object(this);

			// 2. Let len be ? ToLength(? Get(O, "length")).
			var len = o.length >>> 0;

			// 3. If IsCallable(predicate) is false, throw a TypeError exception.
			if (typeof predicate !== 'function') {
				throw TypeError('predicate must be a function');
			}


			// 4. If thisArg was supplied, let T be thisArg; else let T be undefined.
			var thisArg = arguments[1];

			// 5. Let k be 0.
			var k = 0;

			// 6. Repeat, while k < len
			while (k < len) {
				// a. Let Pk be ! ToString(k).
				// b. Let kValue be ? Get(O, Pk).
				// c. Let testResult be ToBoolean(? Call(predicate, T, « kValue, k, O »)).
				// d. If testResult is true, return kValue.
				var kValue = o[k];
				if (predicate.call(thisArg, kValue, k, o)) {
					return kValue;
				}
				// e. Increase k by 1.
				k++;
			}

			// 7. Return undefined.
			return undefined;
		},
		configurable: true,
		writable: true
	});
}

if (!Array.prototype.filter) {
	Array.prototype.filter = function (func, thisArg) {
		'use strict';
		if (!((typeof func === 'Function' || typeof func === 'function') && this))
			throw new TypeError();

		var len = this.length >>> 0,
			res = new Array(len), // preallocate array
			t = this, c = 0, i = -1;

		var kValue;
		if (thisArg === undefined) {
			while (++i !== len) {
				// checks to see if the key was set
				if (i in this) {
					kValue = t[i]; // in case t is changed in callback
					if (func(t[i], i, t)) {
						res[c++] = kValue;
					}
				}
			}
		}
		else {
			while (++i !== len) {
				// checks to see if the key was set
				if (i in this) {
					kValue = t[i];
					if (func.call(thisArg, t[i], i, t)) {
						res[c++] = kValue;
					}
				}
			}
		}

		res.length = c; // shrink down array to proper size
		return res;
	};
}

if (!Array.prototype.every) {
	Array.prototype.every = function (callbackfn, thisArg) {
		'use strict';
		var T, k;

		if (this == null) {
			throw new TypeError('this is null or not defined');
		}

		// 1. Let O be the result of calling ToObject passing the this
		//    value as the argument.
		var O = Object(this);

		// 2. Let lenValue be the result of calling the Get internal method
		//    of O with the argument "length".
		// 3. Let len be ToUint32(lenValue).
		var len = O.length >>> 0;

		// 4. If IsCallable(callbackfn) is false, throw a TypeError exception.
		if (typeof callbackfn !== 'function' && Object.prototype.toString.call(callbackfn) !== '[object Function]') {
			throw new TypeError();
		}

		// 5. If thisArg was supplied, let T be thisArg; else let T be undefined.
		if (arguments.length > 1) {
			T = thisArg;
		}

		// 6. Let k be 0.
		k = 0;

		// 7. Repeat, while k < len
		while (k < len) {

			var kValue;

			// a. Let Pk be ToString(k).
			//   This is implicit for LHS operands of the in operator
			// b. Let kPresent be the result of calling the HasProperty internal
			//    method of O with argument Pk.
			//   This step can be combined with c
			// c. If kPresent is true, then
			if (k in O) {
				var testResult;
				// i. Let kValue be the result of calling the Get internal method
				//    of O with argument Pk.
				kValue = O[k];

				// ii. Let testResult be the result of calling the Call internal method
				// of callbackfn with T as the this value if T is not undefined
				// else is the result of calling callbackfn
				// and argument list containing kValue, k, and O.
				if (T) testResult = callbackfn.call(T, kValue, k, O);
				else testResult = callbackfn(kValue, k, O)

				// iii. If ToBoolean(testResult) is false, return false.
				if (!testResult) {
					return false;
				}
			}
			k++;
		}
		return true;
	};
}

// Production steps of ECMA-262, Edition 5, 15.4.4.19
// Reference: https://es5.github.io/#x15.4.4.19
if (!Array.prototype.map) {

	Array.prototype.map = function (callback/*, thisArg*/) {

		var T, A, k;

		if (this == null) {
			throw new TypeError('this is null or not defined');
		}

		// 1. Let O be the result of calling ToObject passing the |this|
		//    value as the argument.
		var O = Object(this);

		// 2. Let lenValue be the result of calling the Get internal
		//    method of O with the argument "length".
		// 3. Let len be ToUint32(lenValue).
		var len = O.length >>> 0;

		// 4. If IsCallable(callback) is false, throw a TypeError exception.
		// See: https://es5.github.com/#x9.11
		if (typeof callback !== 'function') {
			throw new TypeError(callback + ' is not a function');
		}

		// 5. If thisArg was supplied, let T be thisArg; else let T be undefined.
		if (arguments.length > 1) {
			T = arguments[1];
		}

		// 6. Let A be a new array created as if by the expression new Array(len)
		//    where Array is the standard built-in constructor with that name and
		//    len is the value of len.
		A = new Array(len);

		// 7. Let k be 0
		k = 0;

		// 8. Repeat, while k < len
		while (k < len) {

			var kValue, mappedValue;

			// a. Let Pk be ToString(k).
			//   This is implicit for LHS operands of the in operator
			// b. Let kPresent be the result of calling the HasProperty internal
			//    method of O with argument Pk.
			//   This step can be combined with c
			// c. If kPresent is true, then
			if (k in O) {

				// i. Let kValue be the result of calling the Get internal
				//    method of O with argument Pk.
				kValue = O[k];

				// ii. Let mappedValue be the result of calling the Call internal
				//     method of callback with T as the this value and argument
				//     list containing kValue, k, and O.
				mappedValue = callback.call(T, kValue, k, O);

				// iii. Call the DefineOwnProperty internal method of A with arguments
				// Pk, Property Descriptor
				// { Value: mappedValue,
				//   Writable: true,
				//   Enumerable: true,
				//   Configurable: true },
				// and false.

				// In browsers that support Object.defineProperty, use the following:
				// Object.defineProperty(A, k, {
				//   value: mappedValue,
				//   writable: true,
				//   enumerable: true,
				//   configurable: true
				// });

				// For best browser support, use the following:
				A[k] = mappedValue;
			}
			// d. Increase k by 1.
			k++;
		}

		// 9. return A
		return A;
	};
}

// Production steps of ECMA-262, Edition 5, 15.4.4.18
// Reference: https://es5.github.io/#x15.4.4.18

if (!Array.prototype['forEach']) {

	Array.prototype.forEach = function (callback, thisArg) {

		if (this == null) { throw new TypeError('Array.prototype.forEach called on null or undefined'); }

		var T, k;
		// 1. Let O be the result of calling toObject() passing the
		// |this| value as the argument.
		var O = Object(this);

		// 2. Let lenValue be the result of calling the Get() internal
		// method of O with the argument "length".
		// 3. Let len be toUint32(lenValue).
		var len = O.length >>> 0;

		// 4. If isCallable(callback) is false, throw a TypeError exception.
		// See: https://es5.github.com/#x9.11
		if (typeof callback !== "function") { throw new TypeError(callback + ' is not a function'); }

		// 5. If thisArg was supplied, let T be thisArg; else let
		// T be undefined.
		if (arguments.length > 1) { T = thisArg; }

		// 6. Let k be 0
		k = 0;

		// 7. Repeat, while k < len
		while (k < len) {

			var kValue;

			// a. Let Pk be ToString(k).
			//    This is implicit for LHS operands of the in operator
			// b. Let kPresent be the result of calling the HasProperty
			//    internal method of O with argument Pk.
			//    This step can be combined with c
			// c. If kPresent is true, then
			if (k in O) {

				// i. Let kValue be the result of calling the Get internal
				// method of O with argument Pk.
				kValue = O[k];

				// ii. Call the Call internal method of callback with T as
				// the this value and argument list containing kValue, k, and O.
				callback.call(T, kValue, k, O);
			}
			// d. Increase k by 1.
			k++;
		}
		// 8. return undefined
	};
}

// From https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/keys
if (!Object.keys) {
	Object.keys = (function () {
		'use strict';
		var hasOwnProperty = Object.prototype.hasOwnProperty,
			hasDontEnumBug = !({ toString: null }).propertyIsEnumerable('toString'),
			dontEnums = [
				'toString',
				'toLocaleString',
				'valueOf',
				'hasOwnProperty',
				'isPrototypeOf',
				'propertyIsEnumerable',
				'constructor'
			],
			dontEnumsLength = dontEnums.length;

		return function (obj) {
			if (typeof obj !== 'function' && (typeof obj !== 'object' || obj === null)) {
				throw new TypeError('Object.keys called on non-object');
			}

			var result = [], prop, i;

			for (prop in obj) {
				if (hasOwnProperty.call(obj, prop)) {
					result.push(prop);
				}
			}

			if (hasDontEnumBug) {
				for (i = 0; i < dontEnumsLength; i++) {
					if (hasOwnProperty.call(obj, dontEnums[i])) {
						result.push(dontEnums[i]);
					}
				}
			}
			return result;
		};
	}());
}

var woongkirShared = {
	updateCheckoutTimeoutId: null,
	renderLocationFields: function (fieldPrefix, fieldSuffixes) {
		var dfd = new $.Deferred();

		var renderCounter = 0;

		$.each(woongkirShared.getFields(), function (fieldSuffix, fieldData) {
			if (!fieldSuffixes || fieldSuffixes.indexOf(fieldSuffix) === -1) {
				return;
			}

			var fieldId = fieldPrefix + '_' + fieldSuffix;

			if (!$('#' + fieldId) || !$('#' + fieldId).length) {
				return;
			}

			woongkirShared.getLocationData(fieldSuffix).then(function (results) {
				var options = woongkirShared.filterLocationData(results, fieldPrefix, fieldSuffix, fieldData);

				var optionSelected = options.find(function (option) {
					return option.selected;
				});

				var optionSelectedValue = optionSelected ? optionSelected.id : null;

				$('#' + fieldId).selectWoo({
					data: options,
					width: '100%',
				}).val(optionSelectedValue);

				renderCounter++;

				if (renderCounter === fieldSuffixes.length) {
					dfd.resolve();
				}
			});
		});

		return dfd.promise();
	},
	onChangeFieldState: function (event) {
		var fieldPrefix = $(event.target).attr('id').replace('_state', '');

		woongkirShared.renderLocationFields(fieldPrefix, ['city', 'address_2']).then(function () {
			$('#' + fieldPrefix + '_city').trigger('change');
		});
	},
	onChangeFieldCity: function (event) {
		var fieldPrefix = $(event.target).attr('id').replace('_city', '');

		woongkirShared.renderLocationFields(fieldPrefix, ['address_2']).then(function () {
			$('#' + fieldPrefix + '_address_2').trigger('change');
		});
	},
	onChangeFieldAddress2: function (event) {
		var fieldPrefix = $(event.target).attr('id').replace('_address_2', '');
		var isShipDifferentAddress = $('#ship-to-different-address-checkbox').is(':checked');
		var isCheckout = wc_checkout_params && wc_checkout_params.is_checkout;

		if (!isCheckout) {
			return;
		}

		if (isShipDifferentAddress && 'billing' === fieldPrefix) {
			return;
		}

		if (woongkirShared.updateCheckoutTimeoutId) {
			clearTimeout(woongkirShared.updateCheckoutTimeoutId);
		}

		woongkirShared.updateCheckoutTimeoutId = setTimeout(function () {
			$(document.body).trigger('update_checkout');
		}, 200);
	},
	getFields: function () {
		return {
			state: {
				onChange: woongkirShared.onChangeFieldState,
				convert: false,
				restore: false,
			},
			city: {
				onChange: woongkirShared.onChangeFieldCity,
				convert: true,
				restore: true,
				fieldFilters: ['state'],
			},
			address_2: {
				onChange: woongkirShared.onChangeFieldAddress2,
				convert: true,
				restore: true,
				fieldFilters: ['state', 'city'],
			},
		};
	},
	getLocationDataCountry: function () {
		return woongkirShared.getLocationData('country');
	},
	getLocationDataState: function () {
		return woongkirShared.getLocationData('state');
	},
	getLocationDataCity: function () {
		return woongkirShared.getLocationData('city');
	},
	getLocationDataAddress2: function () {
		return woongkirShared.getLocationData('address_2');
	},
	getLocationData: function (locationType) {
		var dfd = new $.Deferred();
		var dataKey = woongkir_params.json[locationType].key;
		var dataUrl = woongkir_params.json[locationType].url;

		var items = Lockr.get(dataKey);

		if (null === items || typeof items === 'undefined') {
			var randomKey = Math.random().toString(36).substring(7);
			$.getJSON(dataUrl, { [randomKey]: new Date().getTime() }, function (data) {
				data.sort(function (a, b) {
					return (a.value > b.value) ? 1 : ((b.value > a.value) ? -1 : 0);
				});

				Lockr.set(dataKey, data);

				dfd.resolve(data);
			});
		} else {
			dfd.resolve(items);
		}

		return dfd.promise();
	},
	filterLocationData: function (results, fieldPrefix, fieldSuffix, fieldData) {
		var getLocationDataFilter = [];

		if (fieldData.fieldFilters) {
			getLocationDataFilter = fieldData.fieldFilters.filter(function (item) {
				return $('#' + fieldPrefix + '_' + item).length > 0;
			}).map(function (item) {
				return {
					key: item,
					value: $('#' + fieldPrefix + '_' + item).val(),
				};
			});
		}

		return results.filter(function (result) {
			if (!getLocationDataFilter || !getLocationDataFilter.length) {
				return true;
			}

			return getLocationDataFilter.every(function (locationFilter) {
				return result[locationFilter.key] === locationFilter.value;
			});
		}).map(function (item) {
			return {
				id: item.value,
				text: item.label || item.value,
				selected: $('#' + fieldPrefix + '_' + fieldSuffix).val() === item.value,
			};
		});
	},
};

var openSettingsModalTimeout;

function woongkirBackendGetUrlParams(url) {
	var params = {};
	var parser = document.createElement('a');

	parser.href = url;

	var query = parser.search.substring(1);
	var vars = query.split('&');

	for (var i = 0; i < vars.length; i++) {
		var pair = vars[i].split('=');

		if (pair.length === 2) {
			params[pair[0]] = decodeURIComponent(pair[1]);
		}
	}

	return params;
};

function woongkirBackendOpenSettingsModal() {
	var urlParams = woongkirBackendGetUrlParams(window.location.search);

	if (!urlParams.woongkir_settings) {
		return;
	}

	if (openSettingsModalTimeout) {
		clearTimeout(openSettingsModalTimeout);
	}

	openSettingsModalTimeout = setTimeout(function () {
		var methodsMatch = $(document).find('.wc-shipping-zone-method-type').filter(function () {
			return $(this).text() === woongkir_params.method_title;
		});

		if (methodsMatch.length) {
			$(methodsMatch).closest('tr').find('.row-actions .wc-shipping-zone-method-settings').trigger('click');
		} else {
			$('.wc-shipping-zone-add-method').trigger('click');
			$('select[name="add_method_id"]').val(woongkir_params.method_id).trigger('change');
		}
	}, 500);
}

function woongkirBackendRenderOriginLocations() {
	var fieldPrefix = 'woocommerce_woongkir_origin_location';

	var localeData = $.extend(true, {}, woongkir_params.locale.default, woongkir_params.locale.ID);

	$.each(woongkirShared.getFields(), function (fieldSuffix, fieldData) {
		var $field = $('#' + fieldPrefix + '_' + fieldSuffix);

		if (!$field || !$field.length) {
			return;
		}

		$field.off('change', fieldData.onChange);

		woongkirShared.getLocationData(fieldSuffix).then(function (results) {
			var options = woongkirShared.filterLocationData(results, fieldPrefix, fieldSuffix, fieldData);
			var placeholder = localeData[fieldSuffix] && localeData[fieldSuffix].placeholder || '';

			$field.attr({
				placeholder: placeholder,
			}).data({
				placeholder: placeholder,
			}).selectWoo({
				data: options,
				width: '100%',
			});

			$field.on('change', fieldData.onChange);
		});
	});
}

function woongkirBackendToggleApiKeyVisibility() {
	$('#woocommerce_woongkir_api_key_toggle').remove();

	$("#woocommerce_woongkir_api_key").each(function () {
		$(this).after('<button id="woocommerce_woongkir_api_key_toggle" type="button" class="button button-secondary"><span class="dashicons dashicons-visibility" style="margin-top: 4px;"></span></button>');
	});

	$('#woocommerce_woongkir_api_key_toggle').off('click');

	$('#woocommerce_woongkir_api_key_toggle').on('click', function (event) {
		event.preventDefault();

		var fieldType = $("#woocommerce_woongkir_api_key").attr('type');

		if ('password' === fieldType) {
			$("#woocommerce_woongkir_api_key").attr('type', 'text');
		} else {
			$("#woocommerce_woongkir_api_key").attr('type', 'password');
		}

		$(this).find('span').toggleClass('dashicons-visibility dashicons-hidden');
	});
}

function woongkirBackendInitCouriersSortable() {
	$(".woongkir-couriers").sortable({
		axis: 'y',
		cursor: 'move',
	});
}

function woongkirBackendHandleChangeAccountType(event) {
	var $accountType = $(event.target);

	if (!$accountType.is(':checked')) {
		return;
	}

	var accounts = $accountType.data('accounts');
	var accountType = $accountType.val();
	var accountSelected = accountType && accounts[accountType];

	if (!accountSelected) {
		return;
	}

	// Toggle volumetric converter fields
	var $volumetricCalculator = $('#woocommerce_woongkir_volumetric_calculator');

	if (accountSelected.volumetric) {
		$volumetricCalculator.closest('tr').show();
	} else {
		$volumetricCalculator.prop('checked', false).closest('tr').hide();
	}

	$volumetricCalculator.trigger('change');

	var couriers = $accountType.data('couriers');

	$.each(couriers, function (zoneId, zoneData) {
		var zoneCouriers = [];

		$.each(zoneData, function (courierId, courierData) {
			if (courierData.account && courierData.account.indexOf(accountType) !== -1) {
				zoneCouriers.push(courierId);
			}
		});

		$('#woongkir-couriers-' + zoneId).find('.woongkir-couriers-item').each(function () {
			if (zoneCouriers.length && zoneCouriers.indexOf($(this).data('id')) !== -1) {
				$(this).show();
			} else {
				$(this).hide().find('.woongkir-service--bulk').prop('checked', false).trigger('change');
			}
		});
	});

	if (!accountSelected.multiple_couriers) {
		$.each(couriers, function (zoneId) {
			var $firstCheckBox = $('#woongkir-couriers-' + zoneId).find('.woongkir-service--single:checked').first();

			if ($firstCheckBox && $firstCheckBox.length) {
				var $firstCheckBoxBulk = $firstCheckBox.closest('.woongkir-couriers-item').find('.woongkir-service--bulk');

				if ($firstCheckBoxBulk && $firstCheckBoxBulk.length) {
					$('#woongkir-couriers-' + zoneId).find('.woongkir-service--bulk').not($firstCheckBoxBulk).prop('checked', false).trigger('change');
				}
			}
		});
	}
}

function woongkirBackendHandleChangeVolumetricCalculator(event) {
	if ($(event.target).is(':checked')) {
		$('#woocommerce_woongkir_volumetric_divider').closest('tr').show();
	} else {
		$('#woocommerce_woongkir_volumetric_divider').closest('tr').hide();
	}
}

function woongkirBackendToggleCourierServices(event) {
	event.preventDefault();

	$(event.currentTarget)
		.find('.dashicons')
		.toggleClass('dashicons-admin-generic dashicons-arrow-up-alt2')
		.closest('.woongkir-couriers-item')
		.toggleClass('expanded');

}

function woongkirBackendSelectServicesBulk(event) {
	var $checkboxBulk = $(event.target);
	var $couriers = $checkboxBulk.closest('.woongkir-couriers');
	var $courierItem = $checkboxBulk.closest('.woongkir-couriers-item');

	var $accountType = $('.woongkir-account-type:checked');
	var accounts = $accountType.data('accounts');
	var accountType = $accountType.val();
	var accountSelected = accountType && accounts[accountType];

	var isChecked = $checkboxBulk.is(':checked');

	$courierItem.find('.woongkir-service--single').prop('checked', isChecked).trigger('change');

	if (isChecked && !accountSelected.multiple_couriers) {
		$couriers.find('.woongkir-couriers-item').not($courierItem).each(function () {
			$(this).find('.woongkir-service--bulk:checked').prop('checked', false).trigger('change');
			$(this).find('.woongkir-service--single:checked').prop('checked', false).trigger('change');
		});
	}
}

function woongkirBackendSelectServicesSingle(event) {
	var $checkbox = $(event.target);
	var $couriers = $checkbox.closest('.woongkir-couriers');
	var $courierItem = $checkbox.closest('.woongkir-couriers-item');
	var $accountType = $('.woongkir-account-type:checked');
	var accounts = $accountType.data('accounts');
	var accountType = $accountType.val();
	var accountSelected = accountType && accounts[accountType];

	var courierItemsSelected = $courierItem.find('.woongkir-service--single:checked').length;
	var courierItemsAvailable = $courierItem.find('.woongkir-service--single').length;

	$courierItem.find('.woongkir-couriers--selected').text(courierItemsSelected);
	$courierItem.find('.woongkir-couriers--available').text(courierItemsAvailable);

	var checkCheckboxBulk = courierItemsSelected > 0;
	var selectorCheckboxBulk = checkCheckboxBulk ? '.woongkir-service--bulk:not(:checked)' : '.woongkir-service--bulk:checked';

	$courierItem.find(selectorCheckboxBulk).prop('checked', checkCheckboxBulk);

	if ($checkbox.is(':checked') && !accountSelected.multiple_couriers) {
		$couriers.find('.woongkir-couriers-item').not($courierItem).each(function () {
			$(this).find('.woongkir-service--single:checked').prop('checked', false).trigger('change');
		});
	}
}

function woongkirBackendHandleClickTabNav(event) {
	event.preventDefault();
	var $link = $(event.target);
	var target = $link.attr('href');
	var $target = $(target);

	if (!$target || !$target.length) {
		return;
	}

	$('.woongkir-tab-nav-item').each(function () {
		if ($(this).is($link)) {
			$(this).addClass('active');
		} else {
			$(this).removeClass('active');
		}
	});

	$('.woongkir-tab-content').each(function () {
		if ($(this).is(target)) {
			$(this).addClass('active');
		} else {
			$(this).removeClass('active');
		}
	});
}

function woongkirBackendHandleWcBackboneModalLoaded(event, target) {
	if (!event || 'wc-modal-shipping-method-settings' !== target || 1 > $('.' + target).find('[name^="woocommerce_woongkir_"]').length) {
		return;
	}

	$('.' + target).addClass('wc-modal-shipping-method-settings--woongkir');

	woongkirBackendRenderOriginLocations();
	woongkirBackendInitCouriersSortable();
	woongkirBackendToggleApiKeyVisibility();

	$(document.body).off('change', '.woongkir-account-type', woongkirBackendHandleChangeAccountType);
	$(document.body).on('change', '.woongkir-account-type', woongkirBackendHandleChangeAccountType);
	$(document.body).find('.woongkir-account-type').trigger('change');

	$(document.body).off('change', '#woocommerce_woongkir_volumetric_calculator', woongkirBackendHandleChangeVolumetricCalculator);
	$(document.body).on('change', '#woocommerce_woongkir_volumetric_calculator', woongkirBackendHandleChangeVolumetricCalculator);
	$(document.body).find('#woocommerce_woongkir_volumetric_calculator').trigger('change');

	$(document.body).off('click', '.woongkir-couriers-toggle', woongkirBackendToggleCourierServices);
	$(document.body).on('click', '.woongkir-couriers-toggle', woongkirBackendToggleCourierServices);

	$(document.body).off('change', '.woongkir-service--bulk', woongkirBackendSelectServicesBulk);
	$(document.body).on('change', '.woongkir-service--bulk', woongkirBackendSelectServicesBulk);

	$(document.body).off('change', '.woongkir-service--single', woongkirBackendSelectServicesSingle);
	$(document.body).on('change', '.woongkir-service--single', woongkirBackendSelectServicesSingle);

	$(document.body).off('click', '.woongkir-tab-nav-item', woongkirBackendHandleClickTabNav);
	$(document.body).on('click', '.woongkir-tab-nav-item', woongkirBackendHandleClickTabNav);
	$(document.body).find('.woongkir-tab-nav-item').first().trigger('click');
}

$(document.body).on('wc_backbone_modal_loaded', woongkirBackendHandleWcBackboneModalLoaded);
$(document).ready(woongkirBackendOpenSettingsModal);
}(jQuery, window.wc_checkout_params));
