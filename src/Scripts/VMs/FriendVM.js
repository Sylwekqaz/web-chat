function FriendVM(root, data) {
    ChanelVM.apply(this, [root, data]);
    var self = this;
    self.Email = ko.observable(data.email);
    //self.IsOffline = ko.observable(true);

    //computed
    self.AvatarUri = ko.pureComputed(function() {
        return gravatar(self.Email(), { size: 60, backup: "identicon" });
    }); //override chanel property

    //functions

}