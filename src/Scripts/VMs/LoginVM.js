function LoginVM(root) {
    var self = this;

    //observables
    self.Username = ko.observable("").extend({ required: true, minLength: 2 });
    self.Mail = ko.observable("").extend({ required: true, email: true });
    self.Password = ko.observable("").extend({ required: true, minLength: 3 });
    self.ConfirmPassword = ko.observable("").extend({ required: true, equal: self.Password });

    self.IsRegisteringMode = ko.observable(false);

    //computed
    self.IsModelValid = ko.computed(function() {
        var isValid = self.Username.isValid() && self.Password.isValid();
        if (self.IsRegisteringMode()) {
            isValid = isValid && self.Mail.isValid() && self.ConfirmPassword.isValid();
        }

        return isValid;
    });

    //functions
    self.ToggleRegisterMode = function() {
        self.IsRegisteringMode(!self.IsRegisteringMode());
    }

    self.FormSubbmit = function() {
        if (!self.IsModelValid()) {
            return;
        }
        self.IsRegisteringMode() ? self.Register() : self.Login();
    };

    self.Login = function() {
        Chat.postJson("/user/login",
            {
                "name": self.Username(),
                "password": self.Password()
            })
            .done(function() {
                alert("Zalogowano");
                root.PageTemplate("chat-main-template");
            })
            .apiError(function (error) {
                console.log(error);
                if (error.name === "USER_NOT_EXISTS") {
                    console.log(error);
                    self.Username.setError("Brak użytkownika o podanym loginie");
                    self.Username.isModified(true);
                    return true;
                }
                return false;
            })
            .apiError(function(error) {
                if (error.name === "INVALID_PASSWORD") {
                    self.Password.setError("Błędne hasło");
                    self.Password.isModified(true);
                    return true;
                }
                return false;
            });
    }

    self.Register = function() {

    }
}