function ChanelVM(data) {
    var self = this;

    self.Messeges = ko.observableArray();
    self.Name = ko.observable(data.Name);
    self.AvatarUri = ko.observable(data.AvatarUri);
    self.IsOffline = ko.observable(data.IsOffline);
    self.AllRead = ko.observable(data.AllRead);

    self.ConversationId = ko.observable(data.ConversationId);

    //test initialize data
    self.Messeges.push(new MesseageVM({ Content: data.Name }));
}