var http = require('http');
var ndo = require('./network_data_object').NetworkDataObject;

var app = require('./Webclient/app');
var server = http.createServer(app);

var io = require('socket.io');
io = io.listen(server);
io.set('log level',0);
server.listen(3001);
console.log("starting server");


var achivement1 = {
  'Id': "test-achivement1",
  'UserId': 'test-user',
  'Completed': 10,
  'Needed': 100,
  'Title': "Super cool achievement",
  'Information': "info1"
};
var achivement2 = {
  'Id': "test-acivement2",
  'UserId': 'test-user',
  'Completed': 20,
  'Needed': 100,
  'Title': "Super cool achievement number 2",
  'Information': "info1"
};
var Achievement = ndo.define(io, 'Achievement', {
  get: function(id, callback) {
    callback({
      'Id': id,
      'UserId': 'test-user',
      'Completed': 0,
      'Needed': 100,
      'Information': "info"
    });
  },
  list: function(d, callback) {
    callback(['test-achivement1', 'test-achivement2']);
  }
});
var badge1 = {
  'Id': "test-badge1",
  'UserId': 'test-user',
  'Completed': 30,
  'Maximum': 100,
  'Title': "Super badge",
  'Information': "Just another badge",
  'SpriteId': 1
};
var badge2 = {
  'Id': "test-badge2",
  'UserId': 'test-user',
  'Completed': 40,
  'Maximum': 100,
  'Title': "Super badge number 2",
  'Information': "Just another badge number 2",
  'SpriteId': 4
};
var Badge = ndo.define(io, 'Badge', {
  get: function(id, callback) {
    callback({
      'Id': id,
      'UserId': 'test-user',
      'Completed': 0,
      'Maximum': 100,
      'SpriteId': 4
    });
  },
  list: function(d, callback) {
    callback(['test-badge1', 'test-badge2']);
  }
});

var leaderboard_user = {
  'id': 'test-leaderboard-user',
  'Xp': 100,
  'Position': 1
};


var subtask1 = {
  'Id': "123",
  'RawStatus': 0,
  'Title': "subtaskTitle",
  'IsBonus': true,
  'Xp': 30,
  'Information': "Lite info om denna subtask",
  'Warning': "DO NOT TOUCH THE CAT",
  'Tools': [tool1, tool1]
}


var test_leaderboard = {
  'Id': 'test-leaderboard',
  'Title': 'swag1',
  'LeaderboardUsers': [leaderboard_user, leaderboard_user, leaderboard_user]
};

var Leaderboard = ndo.define(io, 'Leaderboard', {
  get: function(id, callback) {
    callback({
      'Id': id,
      'Title': 'Swag',
      'LeaderboardUsers': [leaderboard_user, leaderboard_user, leaderboard_user]
    });
  },
  list: function(d, callback) {
    callback(['test-leaderboard', 'test-leaderboard', 'test-leaderboard']);
  }
});

var LeaderboardUser = ndo.define(io, 'LeaderboardUser', {
  get: function(id, callback) {
    callback(leaderboard_user);
  },
  list: function(d, callback) {
    callback(['test-leaderboard-user']);
  }
});

var tool1 = {
  'Id': "fisktool",
  'Name': "A tool"
};
var SubTask = ndo.define(io, 'SubTask', {
  get: function(id, callback) {
    callback({
      'Id': id,
      'RawStatus': 0,
      'Title': "A subtask",
      'IsBonus': false,
      'Xp': 60,
      'Information': "Info about subtask",
      'Warning': "Warning! dsadas",
      'Tools': [tool1, tool1, tool1]
    });
  },
  list: function(d, callback) {
    callback(['test-subtask']);
  }
});
var vector = {
  'X': 300.0,
  'Y': 200.0,
  'Z': 100.0
};
var Task = ndo.define(io, 'Task', {
  get: function(id, callback) {
    callback({
      'Id': id,
      'RawStatus': 1,
      'Title': 'A Task',
      'Description': 'A description for a Task',
      'TotalXp': 60,
      'RawLocation': vector,
      'Tools': [tool1, tool1],
      'UserId': null,
      'Hints': [],
      'SubTasks': [subtask1, subtask1, subtask1]
    });
  },
  list: function(d, callback) {
    callback(['test-task']);
  }
});

var User = ndo.define(io, 'User', {
  get: function(id, callback) {
    callback({
      'Id': id,
      'UserIcon': 1,
      'Name': 'Swag user',
      'DailyScore': 10,
      'TotalScore': 27,
      'TotalLevel': 5,
      'Badges': [badge1,badge2],
      'Achievements': [achivement1,achivement2]
    });
  },
  list: function(d, callback) {
    callback(['test-user']);
  }
});

var Tools = ndo.define(io, 'Tools', {
  get: function(id, callback) {
    callback({
      'Id': "fisk",
      'Name': "Verktyg 1"
    });
  },
  list: function(d, callback) {
    callback(['fisk']);
  }
});

var streams = {};
var RemoteSupportStream = ndo.define(io, 'RemoteSupportStream', {
  update: function(data, callback) {
    streams[data.Id] = data;
    if(data.Image != null) {
      RemoteSupportStream.update(data);
    }
  },
  list: function(q, callback) {
    callback(Object.keys(streams).filter(function(v) { return streams[v].Streaming; }));
  },
  get: function(id, callback) {
    RemoteSupportStream.subscribe(this, id);
    if(callback) callback(streams[id]);
  },
  delete: function(id, callback) {

    this.leave("RemoteSupportStream." + id);
  }
});

var mice = {};
var RemoteSupportMouse = ndo.define(io, 'RemoteSupportMouse', {
  update: function(data, callback) {
    mice[data.Id] = data;
    RemoteSupportMouse.update(data);
  },
  get: function(id, callback) {
    RemoteSupportMouse.subscribe(this, id);
    callback(mice[id]);
  }
});

io.on('connection', function(socket) {
  User.serve(socket);
  SubTask.serve(socket);
  Achievement.serve(socket);
  Badge.serve(socket);
  Task.serve(socket);
  Leaderboard.serve(socket);
  Tools.serve(socket);
  RemoteSupportStream.serve(socket);
  RemoteSupportMouse.serve(socket);
});