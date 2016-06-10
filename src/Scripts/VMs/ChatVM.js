function ChatVM() {
    var self = this;

    //observables
    self.ContactChannels = ko.observableArray([]);
    self.GroupChannels = ko.observableArray([]);
    self.messageToAdd = ko.observable("");
    self.SelectedChanelName = ko.observable("");
    self.CurrentUser = ko.observable(new CurrentUserVM());
    self.Login = ko.observable(new LoginVM(self));

    //computed
    self.SelectedChanel = ko.computed(function() {
        var selectedChanel = ko.utils.arrayFirst(self.ContactChannels(),
            function(chanel) {
                return chanel.Name() === self.SelectedChanelName();
            });
        if (!selectedChanel) {
            selectedChanel = ko.utils.arrayFirst(self.GroupChannels(),
                function(chanel) {
                    return chanel.Name() === self.SelectedChanelName();
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
                for (i in data) {
                    var chanel = new ChanelVM({ Name: data[i].name, AvatarUri: "Content/Images/sample.jpg", IsOffline: false, AllRead: false });
                    self.ContactChannels.push(chanel);
                }
            });
    }

    self.FetchGroups = function () {
        Chat.getJson("/groups/my")
            .done(function (data) {
                for (i in data) {
                    var chanel = new ChanelVM({ ConversationId: data[i].id, Name: data[i].name, AvatarUri: "Content/Images/sample.jpg", IsOffline: false, AllRead: false });
                    self.GroupChannels.push(chanel);
                }

            });
    }

    self.FetchLast20Messages = function () {
        Chat.getJson("/messages/last", { "id": self.SelectedChanel().ConversationId() })
        .done(function (data) {
            for (i in data) {
                var message = new MesseageVM({Content: data[i].message });
                self.SelectedChanel().Messeges().push(message);
            }
        });
    }

    self.Send = function () {
        if (self.messageToAdd() != "") {
            Chat.postJson("/messages/send", {
                "conversationId": self.SelectedChanel().ConversationId(),
                "message": self.messageToAdd()
            })
            .done(function () {
                self.messageToAdd("");
            }); 
        }
    }

    self.sendMessage = function () {
        self.Send();
        self.FetchLast20Messages();
    }

    self.ChangeChanel = function(chanel) {
        self.SelectedChanelName(chanel.Name());
        self.FetchLast20Messages();
    }

    self.clickedCog = function () {
        alert("Kliknięte ustawienia!");
    }

    self.clickedOff = function () {
        alert("Kliknięte wylogowywanie!");
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

    self.FetchFriends();
    self.FetchGroups();

    //test initialize data
    var chanel1 = new ChanelVM({ Name: "Kontakt 1", AvatarUri: "Content/Images/sample.jpg", IsOffline: false, AllRead: false });
    self.ContactChannels.push(chanel1);

    var s = self.ContactChannels()[0].Name();
    self.SelectedChanelName(s);
}