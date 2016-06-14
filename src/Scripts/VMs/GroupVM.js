function GroupVM(root, data) {
    ChanelVM.apply(this, [root, data]);
    var self = this;

    //computed
    self.ConversationId = ko.pureComputed(function () {
        return self.Id();
    });

    //functions

    //ctor
    self.IsOffline(false); // by default chanel is online always 

}