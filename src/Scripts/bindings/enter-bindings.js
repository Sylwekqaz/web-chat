ko.bindingHandlers.enterkey = {
    init: function (element, valueAccessor, allBindingsAccessor, viewModel) {
        var inputSelector = 'input,textarea,select';
        $(document).on('keypress', inputSelector, function (e) {
            var allBindings = allBindingsAccessor();
            $(element).on('keypress', 'input, textarea, select', function (e) {
                var keyCode = e.which || e.keyCode;
                if (keyCode !== 13) {
                    alert('a');
                    return true;
                }

                var target = e.target;
                target.blur();

                allBindings.enterkey.call(viewModel, viewModel, target, element);
                alert('b');
                return false;
            });
        });
    }
};