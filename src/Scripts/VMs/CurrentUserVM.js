function CurrentUserVM(root) {
    var self = this;

    //obserwables
    self.IsLogged = ko.observable(false);

    self.Id = ko.observable();
    self.Name = ko.observable();
    self.AvatarUri = ko.observable("");
    self.Email = ko.observable("");


    //functions
    self.SetAuthToken = function (token) {
        Chat.SetAuthToken(token);
        self.SaveToken(token);
        self.GetUserData();
    }

    self.RestoreToken = function() {
        Chat.SetAuthToken(window.localStorage.AuthToken);
        self.GetUserData();
    }

    self.SaveToken = function(token) {
        window.localStorage.AuthToken = token;
    }


    self.Logout = function () {
        Chat.getJson("/user/logout")
            .done(function (response) {
                self.Clear();
            });
    }

    self.EnableHandlingUnauthorized = function () {
        Chat.setUnauthorizedCallback(function(xhr) {
            self.Clear();
            return true;
        });
    }

    self.Clear = function () {
        self.IsLogged(false);
        self.Id("");
        self.Name("");
        self.Email("");
        self.AvatarUri("");
        self.SaveToken("");

        //todo clear other shit when detect user was logged out
    }

    /* self.EnableSyncToken = function() {
         window.addEventListener('storage', function(e) {  
             if ("AuthToken" === e.key) {
                 e.newValue
             }
         });
     }*/

    self.GetUserData = function() {
        Chat.getJson("/user/whoami")
            .done(function(response) {
                self.IsLogged(true);
                self.Id(response.id);
                self.Name(response.name);
                self.Email(response.email);
                self.AvatarUri("Content/Images/sample.jpg"); //todo
            });
    }

    

    //ctor
    self.EnableHandlingUnauthorized();
    self.RestoreToken();
}