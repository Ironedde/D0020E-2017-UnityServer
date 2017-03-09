# Dummy Server - pserver.js
Usage: `node pserver.js <port>`

If no port is given, it will default to 3077. If multiple arguments are given, the last port will be used. A web based client can be found at `http://<hostname>:<port>/client` and a list of all connected clients (with locations) can be found at `http://<hostname>:<port>/positions`

## Dummy Client - pclient.js
Usage: `node pclient.js <hostname>`

The client won’t work without _at least_ one server given. The client may connect to the same server multiple times for testing of server concurrency. 

## TODO: Säg hur man kan förbättra med exempelvis bounding rectangles

## TODO: Beskriv