function UserVM(root, data) {
    var self = this;
    self.Id = ko.observable(data.id);
    self.Email = ko.observable(data.email);
    self.Name = ko.observable(data.name);

    //computed
    self.AvatarUri = ko.pureComputed(function() {
        return gravatar(self.Email(), { size: 60, backup: "identicon" });
    }); //override chanel property

}