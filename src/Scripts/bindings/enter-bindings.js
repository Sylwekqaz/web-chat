ko.bindingHandlers.enterkey = {
    init: function (element, valueAccessor, allBindingsAccessor, viewModel) {
        var inputSelector = 'input,textarea,select';

        $(element)
            .keydown(function(e) {
                if (e.keyCode === 13 && e.ctrlKey) {
                    $(element)
                        .val(function(i, val) {
                            return val + "\n";
                        });
                }
            })
            .keypress(function(e) {
                if (e.keyCode === 13 && !e.ctrlKey) {
                    valueAccessor()(e); // call user function
                    return false;
                }
            });


    }
};