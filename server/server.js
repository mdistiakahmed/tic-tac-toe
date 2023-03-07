const Express = require("express")();
const Http = require("http").Server(Express);
const Socketio = require("socket.io")(Http);
const cors = require('cors');


winCombination = [
    [1, 2, 3], [4, 5, 6], [7, 8, 9],
    [1, 4, 7], [2, 5, 8], [3, 6, 9],
    [1, 5, 9], [7, 5, 3]
];


let totalRoomCount = 1;
let fullRooms = [];
let emptyRooms = [];

Express.use(cors());


Express.get('/getRoomStats', (request, response) => {
    response.status(200).json({
        'totalRoomCount': totalRoomCount,
        'fullRooms': fullRooms,
        'emptyRooms': emptyRooms
    });

})

Socketio.on("connection", socket => {
    socket.on('create-room', (data) => {
        emptyRooms.push(totalRoomCount);
        socket.join("room-" + totalRoomCount);

        Socketio.emit('rooms-available', {
            'totalRoomCount': totalRoomCount,
            'fullRooms': fullRooms,
            'emptyRooms': emptyRooms
        });

        Socketio.sockets.in("room-" + totalRoomCount).emit('new-room', {
            'totalRoomCount': totalRoomCount,
            'fullRooms': fullRooms,
            'emptyRooms': emptyRooms,
            'roomNumber': totalRoomCount
        });

        totalRoomCount++;
    });

    socket.on('join-room', (data) => {
        const roomNumber = data.roomNumber;
        emptyRooms = emptyRooms.filter(e => e !== roomNumber);
        fullRooms.push(roomNumber);
        socket.join("room-" + roomNumber);

        Socketio.sockets.in("room-" + roomNumber).emit('start-game', {
            'totalRoomCount': totalRoomCount,
            'fullRooms': fullRooms,
            'emptyRooms': emptyRooms,
            'roomNumber': roomNumber
        });
    });

    socket.on('send-move', (data) => {
        const playedGameGrid = data.playedGameGrid;
        const roomNumber = data.roomNumber;
        let winner = null;

        winCombination.forEach(singleCombination => {
            if (playedGameGrid[singleCombination[0]] !== undefined && playedGameGrid[singleCombination[0]] !== null &&
                playedGameGrid[singleCombination[1]] !== undefined && playedGameGrid[singleCombination[1]] !== null &&
                playedGameGrid[singleCombination[2]] !== undefined && playedGameGrid[singleCombination[2]] !== null &&
                playedGameGrid[singleCombination[0]]['player'] === playedGameGrid[singleCombination[1]]['player'] &&
                playedGameGrid[singleCombination[1]]['player'] === playedGameGrid[singleCombination[2]]['player']
            ) {
                winner = playedGameGrid[singleCombination[0]]['player'] + ' Wins !';
            }
        });

        if (!winner) {
            const allMarkedPlaces = playedGameGrid.map(e => e && e.position).filter(x => x != null);
            console.log(allMarkedPlaces.length);
            if (allMarkedPlaces.length === 9) {
                winner = 'Game Draw';
            }
        }
        socket.broadcast.to("room-" + roomNumber).emit('receive-move', {
            'position': data.position,
            'playedText': data.playedText,
        });

        if (winner !== null) {
            Socketio.sockets.in("room-" + roomNumber).emit('game-result', {
                'winner': winner
            });
        }


    });


    socket.on('disconnecting', () => {
        const rooms = socket.rooms;
        const roomsArray = Array.from(rooms);

        const roomNumber = roomsArray.length > 1 ? (roomsArray[1]).split('-')[1] : null;
        if (roomNumber !== null) {
            fullRooms = fullRooms.filter(id => id !== roomNumber);
            emptyRooms = emptyRooms.filter(id => id !== roomNumber);
            Socketio.sockets.in("room-" + roomNumber).emit('room-disconnect', { id: socket.id });
        }
    });
});

Http.listen(3000, () => console.log("Server running on port 3000"));