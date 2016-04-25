(function ($) {
    "use strict";

    var App = function () {
        var o = this; // Create reference to this instance
        $(document).ready(function () {
            o.initialize();
        }); // Initialize app when document is ready

    };
    var p = App.prototype;

    // =========================================================================
    // INIT
    // =========================================================================

//    var initializeSmoothScroll = function () {
//        $('a[href*="#"]:not([href="#"])').click(function () {
//            if (location.pathname.replace(/^\//, '') == this.pathname.replace(/^\//, '') && location.hostname === this.hostname) {
//                var target = $(this.hash);
//                target = target.length ? target : $('[name=' + this.hash.slice(1) + ']');
//                if (target.length) {
//                    $('html, body').animate({
//                        scrollTop: (target.offset().top - 60)
//                    }, 1000);
//                    return false;
//                }
//            }
//        });
//    }



    p.initialize = function () {
        // Init events
        //initializeSmoothScroll();
    };

    p.applyBindings = function (model) {
        ko.applyBindings(model);
    }

    p.handleRedirections = function (xhr) {
        if (xhr.status === 430) {
            window.location = xhr.responseJSON.redirectionUrl;
            return true;
        }
        return false;
    };

    p.handleUnauthorized = function (xhr) {
//        if (xhr.status === 401) {
//            $('#login-modal').modal('show');
//            return true;
//        }
        return false;
    };

    p.handleApiErrors = function (xhr, callbacks) {
        if (xhr.status === 400) {
            for (let callback of callbacks) {
                var isHandled = callback($.parseJSON(xhr.responseText).error);
                if (isHandled) {
                    return true;
                }
            }   
        }
        return false;
    };

    p.handleTimeout = function (textStatus) {
        if (textStatus === "timeout") {
            alert('Przekroczono czas oczekiwania. Spróbuj wykonać operację ponownie.');
            //toastr.error('Przekroczono czas oczekiwania. Spróbuj wykonać operację ponownie.'); todo
            return true;
        }
        return false;
    };

    p.UrlRoot = function() {
        return "http://chatbackend-chat22.rhcloud.com:80";
        //return "http://localhost:8080/chatbackend";
    };

    p.postJson = function (url, paramsObj, successMessage, async) {
        if (typeof async === "undefined") {
            async = true;
        }

        var apiErrorsCallbacks = [];

        var request = $.ajax({
            method: "POST",
            url: p.UrlRoot() + url,
            timeout: 15000,
            contentType: "application/json; charset=utf-8",
            async: async,
            data: JSON.stringify(paramsObj)
        }).fail(function (xhr, textStatus) {
            var isHandled = p.handleRedirections(xhr)
                || p.handleUnauthorized(xhr)
                || p.handleTimeout(textStatus)
                || p.handleApiErrors(xhr,apiErrorsCallbacks);
            if (!isHandled) {
                //toastr.error("Nieoczekiwany błąd. Odśwież stronę i spróbuj ponownie."); todo
                alert("Nieoczekiwany błąd. Odśwież stronę i spróbuj ponownie.");
            }

        }).done(function () {
            if (successMessage) {
                alert(successMessage);
                //toastr.success(successMessage); todo
            }
        });

        request.apiError = function (callback) {
            apiErrorsCallbacks.push(callback);
            return this;
        }


        return request;
    };


    

    // =========================================================================
    // DEFINE NAMESPACE
    // =========================================================================

    window.Chat = new App;

}(jQuery)); // pass in (jQuery):