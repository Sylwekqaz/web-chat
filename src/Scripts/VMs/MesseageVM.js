function MesseageVM(data) {
    var self = this;

    self.Id = ko.observable(data.id);
    self.Message = ko.observable(data.message);
    self.UserId = ko.observable(data.userId);
    self.Date = ko.observable(moment(data.date));
}