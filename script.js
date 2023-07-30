// ==UserScript==
// @name         Amazon Free Shipping Marker
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Mark items eligible for free shipping to Israel
// @match        https://www.amazon.com/*
// @grant        GM.xmlHttpRequest
// ==/UserScript==

(function() {
    'use strict';

    function checkShippingInfo(variant, url) {
        GM.xmlHttpRequest({
            method: 'GET',
            url: 'https://www.amazon.com' + url,
            onload: function(response) {
                // Parse the response
                var parser = new DOMParser();
                var doc = parser.parseFromString(response.responseText, 'text/html');

                // Check if the item is eligible for free shipping to Israel
                var shippingInfo = doc.querySelector('#mir-layout-DELIVERY_BLOCK-slot-PRIMARY_DELIVERY_MESSAGE_LARGE');
                if (shippingInfo) {
                    console.log('Found shipping info for ' + url);
                    var condition = shippingInfo.getAttribute('data-csa-c-delivery-condition');
                    if (condition && condition.includes('on eligible orders over $49')) {
                        // If it is, mark the item in some way
                        console.log('Marking variant ' + url);
                        variant.style.border = '3px solid lightgreen';
                    } else if (shippingInfo.textContent.includes('FREE delivery')) {
                        console.log('Marking variant based on text content ' + url);
                        variant.style.border = '3px solid lightgreen';
                    } else if (shippingInfo.textContent.includes('to Israel')) {
                        console.log('payed shipping found for ' + url);
                        variant.style.border = '3px solid red';                              
                    }
                } else {
                    variant.style.border = '3px solid grey';                                                        
                    console.log('No shipping info found for ' + url);
                }
            }
        });
    }

    // Identify the HTML elements that represent product variants
    var variants = document.querySelectorAll('li[id^="color_name_"]');
    console.log('Found ' + variants.length + ' variants');

    variants.forEach(function(variant) {
        // Get the URL for the variant
        var url = variant.getAttribute('data-dp-url');
        if (url) {
            console.log('Checking variant ' + url);
            // Make a request to the URL
            checkShippingInfo(variant, url);
        } else {
            console.log('No URL found for variant');
        }
    });

    // Check the currently selected item
    var selectedVariant = document.querySelector('li[id^="color_name_"].swatchSelect');
    if (selectedVariant) {
        var selectedUrl = selectedVariant.getAttribute('data-dp-url');
        if (selectedUrl) {
            console.log('Checking selected variant ' + selectedUrl);
            checkShippingInfo(selectedVariant, selectedUrl);
        } else {
            console.log('No URL found for selected variant');
        }
    }

})();
