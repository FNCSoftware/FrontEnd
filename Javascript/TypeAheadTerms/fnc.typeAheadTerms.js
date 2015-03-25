var fncNS = fncNS || {};

fncNS.typeAhead = (function ($) {
    
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

        // we could allow a fn arg to be passed in if we want to allow the
        // client code to override the default functionality
        // may require making other functions to be made public so for now we just do this
        $(jqSelector).on('keypress', (function (e) {

            var code = e.keyCode || e.which;

            if (code === 32) {
                // user pressed space
                var text = $(jqSelector).val();
                updateAutoCompleteWithExistingText(text);
                return e;
            }

        }));

        $(jqSelector).on('keyup', (function(e) {

            var code = e.keyCode || e.which;

            if (code === 46 || code === 8) {

                var text = $(jqSelector).val();

                if(text.trim() === '') {
                    bindElementToTypeAhead(originalOptions);
                }
            }

        }));
    }

    function bindElementToTypeAhead(terms) { 

        if(terms === undefined) {
            terms = options;
        }

        $(jqSelector).typeahead().data('typeahead').source = terms;
    }

    function isFunctionLegit(fn) {

        return fn && typeof fn === 'function';
    }

    function setTerms(terms) {

        if (isFunctionLegit((terms))) {
            options = terms();
            originalOptions = options.slice();
            return;
        }

        // check if it is an array
        if (terms.constructor === Array) {
            options = terms;
            originalOptions = terms.slice();

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
})(window.jQuery);


