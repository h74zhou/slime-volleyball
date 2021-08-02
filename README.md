# Online Slime VolleyBall

Welcome to my online slime volleyball game! This is a web app that allows 2 players to play slime volleyball together in real-time! Users can battle each other within dedicated rooms and see who is truly the slime volleyball champion!

### Login

When you first arrive onto the web app, you will see a login page. You can enter your name and the room number and then press join. Please note that you cannot join a room that already has 2 players. You can also not use the same name as the other person in the room.

<img src="/images/JoinRoom.png">

If you are the only person in the room at the moment, you'll be greeted with a "waiting for opponent" page:

![Waiting](/images/WaitingGIF.gif)

### Gameplay

Once another player joins this room, you'll be able to start the game! The goal of the game is to make sure the ball does not drop on your side of the field. If it does, one point gets added to the opponent's score. The first player to score 5 points wins the game! 

![GamePlay](/images/slimeGIF.gif)

Once a winner is decided, a new button will appear to allow you to restart the game with your friend, without leaving the room! 

<img src="/images/WInGame.png">

### Tech Stack

The frontend UI was built using [React](https://reactjs.org/) and [Canvas API](https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API). The physics engine for this game was developed from scratch using first principles. The collision angle calculations were derived using `Math.tan`, `Math.cos` and existing velocity for the slime and volleyball. The backend was built with [Express](https://expressjs.com/) and packaged by [Node](https://nodejs.org/en/). [SocketIO](https://socket.io/) was used to sync the player and ball movements, enabling real-time gameplay!
