function ChatVM() {
    var self = this;

    //observables
    self.ContactChannels = ko.observableArray([]);
    self.GroupChannels = ko.observableArray([]);
    self.messageToAdd = ko.observable("");
    self.SelectedChanelName = ko.observable("");
    self.LoggedUser = {
        AvatarUri: ko.observable(""),
        name: ko.observable(""),
        email: ko.observable("")
    };

    //computed
    self.SelectedChanel = ko.computed(function () {
        var selectedChanel = ko.utils.arrayFirst(self.ContactChannels(), function (chanel) {
            return chanel.Name() === self.SelectedChanelName();
        });
        if (!selectedChanel) {
            selectedChanel = ko.utils.arrayFirst(self.GroupChannels(), function (chanel) {
                return chanel.Name() === self.SelectedChanelName();
            });
        }
        return selectedChanel;
    });

    //functions
    self.sendMessage = function () {
        if (self.messageToAdd() != "") {
            var message = new MesseageVM({ Content: self.messageToAdd() });
            self.SelectedChanel().Messeges.push(message);
            self.messageToAdd("");
        }
    }

    self.ChangeChanel = function (chanel) {
        self.SelectedChanelName(chanel.Name());
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


    //test initialize data
    var chanel1 = new ChanelVM({ Name: "Kontakt 1", AvatarUri: "Content/Images/sample.jpg", IsOffline: false, AllRead: false });
    var chanel2 = new ChanelVM({ Name: "Kontakt 2", AvatarUri: "Content/Images/sample.jpg", IsOffline: false, AllRead: true });
    var chanel3 = new ChanelVM({ Name: "Kontakt 3", AvatarUri: "Content/Images/sample.jpg", IsOffline: true, AllRead: false });
    var chanel4 = new ChanelVM({ Name: "Kontakt 4", AvatarUri: "Content/Images/sample.jpg", IsOffline: true, AllRead: true });
    var chanel5 = new ChanelVM({ Name: "Kontakt 5", AvatarUri: "Content/Images/sample.jpg", IsOffline: true, AllRead: true });
    self.ContactChannels.push(chanel1);
    self.ContactChannels.push(chanel2);
    self.ContactChannels.push(chanel3);
    self.ContactChannels.push(chanel4);
    self.ContactChannels.push(chanel5);

    var chanel6 = new ChanelVM({ Name: "Grupa 1", AvatarUri: "Content/Images/sample.jpg", IsOffline: false, AllRead: false });
    var chanel7 = new ChanelVM({ Name: "Grupa 2", AvatarUri: "Content/Images/sample.jpg", IsOffline: true, AllRead: false });
    var chanel8 = new ChanelVM({ Name: "Grupa 3", AvatarUri: "Content/Images/sample.jpg", IsOffline: true, AllRead: true });
    var chanel9 = new ChanelVM({ Name: "Grupa 4", AvatarUri: "Content/Images/sample.jpg", IsOffline: true, AllRead: true });
    var chanel10 = new ChanelVM({ Name: "Grupa 5", AvatarUri: "Content/Images/sample.jpg", IsOffline: true, AllRead: true });
    self.GroupChannels.push(chanel6);
    self.GroupChannels.push(chanel7);
    self.GroupChannels.push(chanel8);
    self.GroupChannels.push(chanel9);
    self.GroupChannels.push(chanel10);

    self.SelectedChanelName("Kontakt 1");

    self.LoggedUser.AvatarUri = "Content/Images/sample.jpg";
    self.LoggedUser.name = "Kotek Przykladowy";
    self.LoggedUser.email = "kotek@plotek.pl";
}