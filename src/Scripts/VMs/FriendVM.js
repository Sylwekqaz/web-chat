function FriendVM(root, data) {
    ChanelVM.apply(this, [root, data]);
    var self = this;
    self.Email = ko.observable(data.email);
    //self.IsOffline = ko.observable(true);

    //computed


    //functions
    self.GetConversationId = function () {
        Chat.getJson("/conversations/" + self.Id())
            .done(function (data) {
                self.ConversationId(data.id);
            });
    }

    //ctor
    self.GetConversationId();
}