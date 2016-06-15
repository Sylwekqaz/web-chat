function FriendVM(root, data) {
    ChanelVM.apply(this, [root, data]);
    var self = this;
    self.Email = ko.observable(data.email);
    self.IsFriendChanel(true);

    //computed
    self.AvatarUri = ko.pureComputed(function() {
        return gravatar(self.Email(), { size: 60, backup: "identicon" });
    }); //override chanel property

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