var fncNS = fncNS || {};

fncNS.typeAhead = (function(){

    var elem = '';
    var options = [];


    function init(jqueryElement, terms){
        // todo: add check
        elem = jqueryElement;
        setTerms(terms);
        bindElementToTypeAhead();
    }
    function bindElementToTypeAhead(){
        //$('#product_search').typeahead().data('typeahead').source = options;
        $(elem).typeahead().data('typeahead').source = options;
    }

    function isFunctionLegit(fn){
        return fn && typeof fn === 'function';
    }

    function setTerms(terms){
        if(isFunctionLegit((terms))){
            options = terms();
            return;
        }

        // check if it is an array
        options = terms;
    }

    function repopulateAutoCompleteWithAllOptions(text) {
        debugger;
        var terms = options;
        text = text.trim();
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
})();

//$("#ordersSearchTextBox").on('keypress', (function (e) {
//        if (e.which == 32) { // space
//            // if user presses spaces and autocomplete is visible this will allow them to ignore autocomplete
//            // and hit search without having to pick up the mouse
//            if ($('.typeahead').is(':visible') && $('#ordersSearchTextBox').is(':focus')) {
//                $('.typeahead').hide();
//            } else if ($.trim(viewModel.fullTextOrderSearch().text()) != '') {
//                // else if we have some text provided, fill autocomplete options
//                if (viewModel.fullTextOrderSearch().text()) {
//                    if (!viewModel.fullTextOrderSearch().hasSetStatusFromDropDown()) {
//                        viewModel.fullTextOrderSearch().addStatusOptionsToAutoComplete();
//                    } else {
//                        viewModel.fullTextOrderSearch().repopulateAutoCompleteWithAllOptions();
//                    }
//                }
//            } else {
//                // if no text was provided, do not provided autocomplete options
//                $('#ordersSearchTextBox').typeahead().data('typeahead').source = [];
//            }
//        }
//        else if (e.which == 13) { // enter
//
//            // if the dropdown is not shown, search orders
//            if (!$('.typeahead').is(':visible') && $('#ordersSearchTextBox').is(':focus')) {
//                e.preventDefault();
//                viewModel.fullTextOrderSearch().hasChanged(true);
//                viewModel.searchOrders();
//
//            }
//        }
//        else if (e.which == 8) { // backspace
//            viewModel.fullTextOrderSearch().repopulateAutoCompleteWithAllOptions();
//        }
//
//        return e;
//    }));
//
//
//    self.repopulateAutoCompleteWithAllOptions = function (options) {
//        debugger;
//        var typeAheadOptions = [];
//        if (options) {
//            typeAheadOptions = options;
//        }
//
//        $.when(self.getTypeAheadTerms()).then(function() {
//            //var terms = self.getTypeAheadTerms();
//
//            var terms = self.typeAheadTerms;
//            var text = self.text();
//            text = text.trim();
//            if (text != '') {
//                text = text + ' ';
//            }
//
//            for (var term in terms) {
//                typeAheadOptions.push(text + terms[term]);
//            }
//
//            $('#ordersSearchTextBox').typeahead().data('typeahead').source = typeAheadOptions; //self.getAllAutoCompleteOptions();
//        });
//
//    }
//
//	    self.getTypeAheadTerms = function () {
//
//        var typeAheadTermsCompleted = $.Deferred();
//        if (!self.hasTypeAheadTermsBeenCalled) {
//            var url = '/Dashboard/GetTypeAheadTerms';
//            var callData = { isServiceProviderView: viewModel.isServiceProviderView() ? 'TRUE' : 'FALSE' };
//            var promise = viewModel.dataContext.get(url, callData);
//            promise.done(function(data) {
//                self.typeAheadTerms = data;
//                self.hasTypeAheadTermsBeenCalled = true;
//                typeAheadTermsCompleted.resolve();
//            });
//
//
//        } else {
//            typeAheadTermsCompleted.resolve();
//        }
//
//        return typeAheadTermsCompleted;
//    };