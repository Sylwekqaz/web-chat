function FriendVM(root, data) {
    ChanelVM.apply(this, [root, data]);
    var self = this;
    self.Email = ko.observable(data.email);
    //self.IsOffline = ko.observable(true);

    //computed


    //functions

}