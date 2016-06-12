function ChatVM() {
    var self = this;

    //observables
    self.Friends = ko.observableArray([]);
    self.Groups = ko.observableArray([]);
    self.SelectedChanelId = ko.observable("");

    self.CurrentUser = ko.observable(new CurrentUserVM());
    self.Login = ko.observable(new LoginVM(self));

    //computed
    self.SelectedChanel = ko.computed(function() {
        var selectedChanel = ko.utils.arrayFirst(self.Friends(),
            function(chanel) {
                return chanel.Id() === self.SelectedChanelId();
            });
        if (!selectedChanel) {
            selectedChanel = ko.utils.arrayFirst(self.Groups(),
                function(chanel) {
                    return chanel.Id() === self.SelectedChanelId();
                });
        }
        return selectedChanel;
    }); 

    self.PageTemplate = ko.pureComputed(function() {
        if (!self.CurrentUser().IsLogged()) {
            return "login-template";
        }
        return "chat-main-template";
    }); // ENUM: chat-main-template, login-template


    //functions

    self.FetchFriends = function () {
        Chat.getJson("/friends/my")
            .done(function (data) {
                self.Friends.removeAll();
                for (i of data) {
                    var chanel = new FriendVM(i);
                    self.Friends.push(chanel);
                }
            });
    }

    self.FetchGroups = function () {
        Chat.getJson("/groups/my")
            .done(function (data) {
                self.Groups.removeAll();
                for (i of data) {
                    var chanel = new FriendVM(i);
                    self.Groups.push(chanel);
                }
            });
    }

    self.ChangeChanel = function(chanel) {
        self.SelectedChanelId(chanel.Id());
    }

    self.InitializeChat = function() {
        self.FetchFriends();
        self.FetchGroups();
    }

    //dummy actions for not implemented actions
    self.clickedCog = function () {
        alert("Kliknięte ustawienia!");
    }

    self.clickedDropdown1 = function () {
        alert("Zrobiłem coś!");
    }

    self.clickedDropdown2 = function () {
        alert("Zrobiłem coś innego!");
    }

    self.clickedAdd = function() {
        alert("Kliknięte dodawanie!");
    }

    //ctor
    self.CurrentUser()
        .IsLogged.subscribe(function(newValue) {
            if (newValue) {
                self.InitializeChat();
            } else {
                self.Friends.removeAll();
                self.Groups.removeAll();
            }
        });
}