function GroupVM(root, data) {
    ChanelVM.apply(this, [root, data]);
    var self = this;

    self.IsGroupChanel(true);

    //computed
    self.ConversationId = ko.pureComputed(function () {
        return self.Id();
    });

    //functions
    self.Rename = function() {
        bootbox.prompt("Podaj nazwę grupy",
            function(newName) {
                if (newName != null) {
                    Chat.postJson("/groups/rename",
                        {
                            "groupId": self.Id(),
                            "newName": newName
                        })
                        .done(function() {
                            self.Name(newName);
                        });
                }
            });
    }
    //ctor
    self.IsOffline(false); // by default chanel is online always 

}