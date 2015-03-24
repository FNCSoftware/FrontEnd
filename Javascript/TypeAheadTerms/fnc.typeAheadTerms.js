var fncNS = fncNS || {};

fncNS.typeAhead = (function ($) {
    var $ = $;
    var jqSelector = '';
    var options = [];
    var originalOptions = [];


    function init(selector, terms) {
        // todo: add check
        jqSelector = selector;
        setTerms(terms);
        bindElementToTypeAhead();
        bindKeyPresses();
    }

    function bindKeyPresses() {

        $(jqSelector).on('keypress', (function (e) {


            if (e.which === 32) {
                // user pressed space
                var text = $(jqSelector).val();
                updateAutoCompleteWithExistingText(text);
            }

            //if (e.which === 8) {
            //    debugger;
            //    // user backspaced
            //    var text = $(jqSelector).val();
            //    if (text.trim() === '') {
            //        debugger;
            //        // revert back to original options
            //        options = originalOptions;
            //        bindElementToTypeAhead();
            //
            //    }
            //}

        }));
    }

    function bindElementToTypeAhead() {
        $(jqSelector).typeahead().data('typeahead').source = options;
    }

    function isFunctionLegit(fn) {
        return fn && typeof fn === 'function';
    }

    function setTerms(terms) {
        if (isFunctionLegit((terms))) {
            options = terms();
            originalOptions = options;
            return;
        }

        // check if it is an array
        if (terms.constructor === Array) {
            options = terms;
            originalOptions = options;

        }

    }

    function updateAutoCompleteWithExistingText(text) {
        var terms = options;

        if (text != '') {
            text = text + ' ';
        }

        for (var term in terms) {
            options.push(text + terms[term]);
        }

        bindElementToTypeAhead();
    }

    return {
        init: init
    }
})($);


