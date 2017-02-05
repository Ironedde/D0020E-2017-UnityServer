var http = require('http');
var ndo = require('./network_data_object').NetworkDataObject;

var io = require('socket.io').listen(3001);
console.log("starting server");


var achivement1 = {
  'Id': "test-achivement1",
  'UserId': 'test-user',
  'Completed': 10,
  'Needed': 100,
  'Information': "info1"
};
var achivement2 = {
  'Id': "test-acivement2",
  'UserId': 'test-user',
  'Completed': 20,
  'Needed': 100,
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
  'SpriteId': 1
};
var badge2 = {
  'Id': "test-badge2",
  'UserId': 'test-user',
  'Completed': 40,
  'Maximum': 100,
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

var Leaderboard = ndo.define(io, 'Leaderboard', {
  get: function(id, callback) {
    callback({
      'Id': id,
      'Title': 'Swag',
      'LeaderboardUsers': [leaderboard_user]
    });
  },
  list: function(d, callback) {
    callback(['test-leaderboard']);
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

var tool = {
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
      'Warning': "Warning!",
      'Tools': [tool]
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
      'IsBonus': false,
      'Tools': [],
      'UserId': null,
      'Hints': [],
      'SubTasks': []
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
      'TotalScore': 20,
      'TotalLevel': 5,
      'Badges': [badge1,badge2],
      'Achievements': [achivement1,achivement2]
    });
  },
  list: function(d, callback) {
    callback(['test-user']);
  }
});

io.on('connection', function(socket) {
  User.serve(socket);
  SubTask.serve(socket);
  Achievement.serve(socket);
  Badge.serve(socket);
  Task.serve(socket);
});
