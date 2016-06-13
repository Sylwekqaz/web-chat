function ChatVM() {
    var self = this;

    //observables
    self.Friends = ko.observableArray([]);
    self.Groups = ko.observableArray([]);
    self.SelectedChanelId = ko.observable("");

    self.CurrentUser = ko.observable(new CurrentUserVM());
    self.Login = ko.observable(new LoginVM(self));


    //functions
    self.GetChanelById = function(id) {
        var chanel = ko.utils.arrayFirst(self.Friends(),
            function(c) {
                return c.Id() === id;
            });
        if (!chanel) {
            chanel = ko.utils.arrayFirst(self.Groups(),
                function(c) {
                    return c.Id() === id;
                });
        }
        return chanel;
    }

    self.GetChanelByConversationId = function(id) {
        var chanel = ko.utils.arrayFirst(self.Friends(),
            function(c) {
                return c.ConversationId() === id;
            });
        if (!chanel) {
            chanel = ko.utils.arrayFirst(self.Groups(),
                function(c) {
                    return c.ConversationId() === id;
                });
        }
        return chanel;
    }

    self.FetchFriends = function() {
        Chat.getJson("/friends/my")
            .done(function(data) {
                for (i of data) {
                    var match = self.GetChanelById(i.id);
                    if (!match) {
                        self.Friends.push(new FriendVM(self, i));
                    }
                }
            });
    }

    self.FetchGroups = function() {
        Chat.getJson("/groups/my")
            .done(function(data) {
                for (i of data) {
                    var match = self.GetChanelById(i.id);
                    if (!match) {
                        self.Groups.push(new GroupVM(self, i));
                    }
                }
            });
    }

    self.ChangeChanel = function(chanel) {
        self.SelectedChanelId(chanel.Id());
        self.SelectedChanel().GetNewMesseges();
        self.SelectedChanel().AllRead(true);
    }

    self.InitializeChat = function() {
        self.FetchFriends();
        self.FetchGroups();
    }

    self.CheckUnreadMesseges = function() {
        Chat.getJson("/messages/unread")
            .done(function(data) {
                for (var undearId of data) {
                    if (undearId === self.SelectedChanel().ConversationId()) {
                        continue;
                    }
                    var unreadChanel = self.GetChanelByConversationId(undearId);
                    unreadChanel.AllRead(false);
                }
            });
    }

    self.CheckFriendsOnlineStatus = function() {
        self.Friends()
            .forEach(function(friend) {
                Chat.getJson("/friends/online/" + friend.Id())
                    .done(function(data) {
                        friend.IsOffline(!data.online);
                    });
            });
    }

    self.LoopTask = function () {
        self.FetchFriends();
        self.FetchGroups();
        self.CheckUnreadMesseges();
        self.CheckFriendsOnlineStatus();
    }

    self.ShowAddFriendModal = function() {
        bootbox.dialog({
                title: "Dodaj znajomego",
                message: $('#add-friend-template').html(),
                buttons: {
                    success: {
                        label: "Save",
                        className: "btn-success",
                        callback: function () {
                            self.AddFriend($(".friend-select").val());
                        }
                    }
                }
            }
        );

        $(".friend-select").select2({
            ajax: {
                url: "http://chatbackend-chat22.rhcloud.com/user/search",
                dataType: "json",
                type: "POST",
                contentType: "application/json; charset=utf-8",
                headers: {
                    "X-Auth-Token": window.localStorage.AuthToken,
                },
                processResults: function (data, params) {
                    return {
                        results: $.map(data,
                                function(obj) {
                                    return { id: obj.id, text: obj.name };
                                })
                            .filter(function(element) {
                                return !self.GetChanelById(element.id);
                            }),
                    };
                },
                delay: 250,
                data: function (params) {
                    return JSON.stringify({
                        "email": params.term,
                        "name": params.term
                    });
                }
            }
        });
    }

    self.ShowAddGroupModal = function () {
        bootbox.prompt("Podaj nazwę grupy",
            function(newGroupname) {
                if (newGroupname != null) {
                    Chat.getJson("/groups/create ")
                        .done(function(response) {
                            Chat.postJson("/groups/rename",
                                {
                                    "groupId": response.id,
                                    "newName": newGroupname
                                })
                                .done(function() {
                                    self.FetchGroups();
                                });
                        });
                }
            });
    }

    self.AddFriend = function(id) {
        Chat.postJson("/friends/add/" + id)
            .done(function() {
                self.FetchFriends();
            });
    }


    //computed
    self.SelectedChanel = ko.computed(function() {
        return self.GetChanelById(self.SelectedChanelId());
    });

    self.PageTemplate = ko.pureComputed(function() {
        if (!self.CurrentUser().IsLogged()) {
            return "login-template";
        }
        return "chat-main-template";
    }); // ENUM: chat-main-template, login-template


    //ctor
    var loopTask = null;
    self.CurrentUser()
        .IsLogged.subscribe(function(newValue) {
            if (newValue) {
                self.InitializeChat();
                clearInterval(loopTask); //lets be sure that we dont owerwrite taskId and allow to memory leak
                loopTask = setInterval(self.LoopTask, 10000);
            } else {
                clearInterval(loopTask);
                self.Friends.removeAll();
                self.Groups.removeAll();
                self.SelectedChanelId("");
            }
        });
}