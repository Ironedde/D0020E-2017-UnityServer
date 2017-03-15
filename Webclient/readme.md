# So how does this webRTC thing work?

Alright, we made a webRTC application together with the other group to make video support possible.

Att the moment it works like this:

1. The mobile client connects to the server (../server.js) through the unity mobile application.

2. The "admin" client then connects to index page where they are greeted by a list of users (socket ids).
  * Connecting to a user in the list (choose wisely, both admins and mobile are shown) will subscribe you to their feed. This meens that if they send data using "RemoteSupportStream.update" then you will get it.
  * On the other hand, when drawing on the canvas on top of the image that you recived, you're mouse down will be sent to their side of the connection.

All this is implemented using Socket.IO and node.js as a "relay system" where the server will akt as a middle man. This meens that the system is not realy using webRTC at the moment, the reason being that we & the other group ran into som problems with unity and webRTC.
