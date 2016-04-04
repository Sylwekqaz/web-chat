function ChanelVM(data) {
    var self = this;

    self.Messeges = ko.observableArray();
    self.Name = ko.observable(data.Name);

    //test initialize data
    self.Messeges.push(new MesseageVM({ Content: data.Name }));
}