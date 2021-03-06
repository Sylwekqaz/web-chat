﻿function ChanelVM(root, data) {
    var self = this;

    self.Id = ko.observable(data.id);
    self.Name = ko.observable(data.name);

    self.ConversationId = ko.observable();
    self.IsOffline = ko.observable(true);
    self.Messeges = ko.observableArray([]);
    self.MessageToAdd = ko.observable("");
    self.AllRead = ko.observable(true);
    self.IsFriendChanel = ko.observable(false);
    self.IsGroupChanel = ko.observable(false);

    //computed
    self.AvatarUri = ko.observable("Content/Images/sample.jpg"); //todo add gravatar

    self.CanAddCurrentChanelToGroupChanel = ko.pureComputed(function() {
        var selectedChanel = root.SelectedChanel();
        var can = selectedChanel != null && selectedChanel.IsGroupChanel();
        can = can && self.IsFriendChanel();
        // check if curren user is member of selected chanel
        return can;
    });

    //function
    self.GetNewMesseges = function () {
        if (!self.ConversationId()) {
            return;
        }
        Chat.getJson("/messages/last/" + self.ConversationId())
            .done(function(data) {
                for (i of data) {
                    var message = new MesseageVM(root, self, i);
                    self.AddMessegeIfNotExist(message);
                }
                self.SortMesseges();
                self.scrollBottom();
            });
    }

    self.PendingHistoryRequest = ko.observable(false);
    self.GetHistory = function (data,event) {
        if (!self.ConversationId()) {
            return;
        }
        if (self.PendingHistoryRequest()) {
            return;
        }
        self.PendingHistoryRequest(true);
        var elem = event.target;
        var oldScroll = elem.scrollHeight;
        Chat.getJson("/messages/before/" + self.ConversationId()+"/"+self.Messeges()[0].Id())
            .done(function(data) {
                for (i of data) {
                    var message = new MesseageVM(root, self, i);
                    self.AddMessegeIfNotExist(message);
                }
                self.SortMesseges();
                var scrollDiff = elem.scrollHeight - oldScroll;
                elem.scrollTop += scrollDiff;
                self.PendingHistoryRequest(false);
            });
    }

    self.AddMessegeIfNotExist = function(message) {
        var match = ko.utils.arrayFirst(self.Messeges(),
            function(item) {
                return message.Id() === item.Id();
            });

        if (!match) {
            self.Messeges.push(message);
        }
        return !match;
    }

    self.SortMesseges = function() {
        self.Messeges.sort(function(left, right) {
            return left.Date() === right.Date() ? 0 : (left.Date() < right.Date() ? -1 : 1);
        });
    }

    self.Send = function() {
        if (self.MessageToAdd() === "") {
            return;
        }
        if (!self.ConversationId()) {
            return;
        }
        Chat.postJson("/messages/send",
            {
                "conversationId": self.ConversationId(),
                "message": self.MessageToAdd()
            })
            .done(function() {
                self.GetNewMesseges();
            });
        self.MessageToAdd("");

    }

    self.scrollBottom = function () {
        $('#messages-section').scrollTop($('#messages-section')[0].scrollHeight);
    }
}