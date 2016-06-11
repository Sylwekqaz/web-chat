function FriendVM(data) {
    ChanelVM.apply(this, [data]);
    var self = this;
    self.Email = ko.observable(data.email);
    //self.IsOffline = ko.observable(true);

    //computed


    //functions

}