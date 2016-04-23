function ChatVM() {
    var self = this;

    //observables
    self.Chanels = ko.observableArray([]);
    self.messageToAdd = ko.observable("");
    self.SelectedChanelName = ko.observable("");

    self.PageTemplate = ko.observable("login-template"); // ENUM: chat-main-template, login-template, register-template

    //computed
    self.SelectedChanel = ko.computed(function() {
        var selectedChanel = ko.utils.arrayFirst(self.Chanels(), function(chanel) {
            return chanel.Name() === self.SelectedChanelName();
        });

        return selectedChanel;
    });

    //functions
    self.sendMessage = function() {
        if (self.messageToAdd() != "") {
            var message = new MesseageVM({ Content: self.messageToAdd() });
            self.SelectedChanel().Messeges.push(message);
            self.messageToAdd("");
        }
    }

    self.ChangeChanel = function (chanel) {
        self.SelectedChanelName(chanel.Name());
    }


    //test initialize data
    var chanel1 = new ChanelVM({ Name: "Team A" });
    var chanel2 = new ChanelVM({ Name: "Bash" });
    var chanel3 = new ChanelVM({ Name: "Spam here" });
    self.Chanels.push(chanel1);
    self.Chanels.push(chanel2);
    self.Chanels.push(chanel3);
    self.SelectedChanelName("Team A");

}