function MesseageVM(root, chanel, data) {
    var self = this;

    self.Id = ko.observable(data.id);
    self.Message = ko.observable(data.message);
    self.UserId = ko.observable(data.userId);
    self.Date = ko.observable(moment(data.date));

    //computed
    self.IsOwnMessege = ko.pureComputed(function() {
        return self.UserId() === root.CurrentUser().Id();
    });

    self.User = ko.pureComputed(function () {
        var user = root.GetUserById(self.UserId());
        if (!user) {
            user = new UserVM(root, {
                "email": "",
                "id": self.UserId(),
                "name": ""
            }); //return empty user to simplify view logic 
            root.FetchFriends();
            root.FetchGroups();
        }

        return user;
    });

    self.TooltipMessege = ko.pureComputed(function () {
        

        return self.User().Name() + " " + self.Date().fromNow();
    });
}