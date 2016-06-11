function ChanelVM(data) {
    var self = this;

    self.Id = ko.observable(data.id);
    self.Name = ko.observable(data.name);

    self.ConversationId = ko.observable(data.ConversationId);
    self.IsOffline = ko.observable(true);
    self.Messeges = ko.observableArray([]);

    //computed
    self.AvatarUri = ko.observable("Content/Images/sample.jpg"); //todo add gravatar
    self.AllRead = ko.observable(false); //todo add task to check regularity 

    

    //test initialize data
    self.Messeges.push(new MesseageVM({ Content: self.Name() }));
}