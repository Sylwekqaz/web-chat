function ChatVM() {
    var self = this;

    //observables
    self.Friends = ko.observableArray([]);
    self.Groups = ko.observableArray([]);
    self.SelectedChanelId = ko.observable("");
    self.Users = ko.observableArray([]);

    self.CurrentUser = ko.observable(new CurrentUserVM());
    self.Login = ko.observable(new LoginVM(self));


    //functions
    self.GetUserById = function(id) {
        var user = ko.utils.arrayFirst(self.Users(),
            function(c) {
                return c.Id() === id;
            });
        return user;
    }

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
                for (friend of data) {
                    var match = self.GetChanelById(friend.id);
                    if (!match) {
                        self.Friends.push(new FriendVM(self, friend));
                    }
                    var user = self.GetUserById(friend.id);
                    if (!user) {
                        self.Users.push(new UserVM(self, friend));
                    }
                }
            });
    }

    self.FetchGroups = function() {
        Chat.getJson("/groups/my")
            .done(function(data) {
                for (group of data) {
                    var match = self.GetChanelById(group.id);
                    if (!match) {
                        self.Groups.push(new GroupVM(self, group));
                    }
                    for (var user of group.users) {
                        var exist = self.GetUserById(user.id);
                        if (!exist) {
                            self.Users.push(new UserVM(self, user));
                        }
                    }

                }
            });
    }

    self.ChangeChanel = function (chanel,event) {
        if (event) {
            if (event.target.classList.contains("glyphicon")) {
                return;
            }
        }
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
                var shouldPlayNotification = false;
                for (var undearId of data) {
                    if (self.SelectedChanel()) {
                        if (undearId === self.SelectedChanel().ConversationId()) {
                            self.SelectedChanel().GetNewMesseges();
                            shouldPlayNotification = true;
                            continue;
                        }
                    }

                    var unreadChanel = self.GetChanelByConversationId(undearId);
                    if (unreadChanel == null) {
                        self.FetchFriends();
                        self.FetchGroups();
                        return;
                    }
                    if (unreadChanel.AllRead()) {
                        shouldPlayNotification = true;
                        unreadChanel.AllRead(false);
                    }
                }
                if (shouldPlayNotification) { 
                    ion.sound.play("new-messege");
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

    self.CheckOnlineTask = function() {
        self.CheckFriendsOnlineStatus();
    }

    self.CheckUnreadTask = function() {
        self.CheckUnreadMesseges();
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

    self.RemoveFriend = function(friend) {
        bootbox.confirm("Czy jesteś pewny, twoja decyzja może mieć negatywny wpływ na twoje życie towarzyskie",
            function(result) {
                if (result) {
                    Chat.deleteJson("/friends/delete/" + friend.Id())
                        .done(function() {
                            self.Friends.remove(friend);
                        });
                }
            });
    }

    self.AddFriendToGroup = function(friend) {
        Chat.postJson("/groups/invite",
            {
                "groupId": self.SelectedChanelId(),
                "userIds": [friend.Id()]
            })
            .done(function() {
                self.FetchGroups();
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
    var checkOnlineTask = null;
    var checkUnreadTask = null;
    self.CurrentUser()
        .IsLogged.subscribe(function(newValue) {
            if (newValue) {
                self.InitializeChat();
                clearInterval(checkOnlineTask); //lets be sure that we dont owerwrite taskId and allow to memory leak
                clearInterval(checkUnreadTask); //lets be sure that we dont owerwrite taskId and allow to memory leak
                checkOnlineTask = setInterval(self.CheckOnlineTask, 5000);
                checkUnreadTask = setInterval(self.CheckUnreadTask, 1000);
                self.CheckOnlineTask();
                self.CheckUnreadTask();
            } else {
                clearInterval(checkOnlineTask);
                clearInterval(checkUnreadTask);
                self.Friends.removeAll();
                self.Groups.removeAll();
                self.Users.removeAll();
                self.SelectedChanelId("");
            }
        });
}