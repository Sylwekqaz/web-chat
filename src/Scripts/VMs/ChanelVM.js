function ChanelVM(data) {
    var self = this;

    self.Id = ko.observable(data.id);
    self.Name = ko.observable(data.name);

    self.ConversationId = ko.observable();
    self.IsOffline = ko.observable(true);
    self.Messeges = ko.observableArray([]);
    self.MessageToAdd = ko.observable("");


    //computed
    self.AvatarUri = ko.observable("Content/Images/sample.jpg"); //todo add gravatar
    self.AllRead = ko.observable(false); //todo add task to check regularity 

    //function
    self.GetNewMesseges = function() {
        if (!self.ConversationId()) {
            return;
        }
        Chat.getJson("/messages/last/" + self.ConversationId())
            .done(function(data) {
                for (i of data) {
                    var message = new MesseageVM(i);
                    self.AddMessegeIfNotExist(message);
                }
                self.SortMesseges();
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

    self.GetConversationId = function() {
        Chat.getJson("/conversations/" + self.Id())
            .done(function(data) {
                self.ConversationId(data.id);
                self.GetNewMesseges();
            });
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
                self.MessageToAdd("");
                self.GetNewMesseges();
            });

    }


    //ctor
    self.GetConversationId();
}