function ChatVM() {
    var self = this;

    self.Messeges = ko.observableArray([]);

    self.messageToAdd = ko.observable("");

    self.sendMessage = function () {
        if (self.messageToAdd() != "") {
            self.Messeges.push(self.messageToAdd());
            self.messageToAdd("");
        }
    }

}