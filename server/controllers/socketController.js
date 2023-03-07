const RoomService = require('../services/roomService');



class Socket {
    constructor(io) {
        this.io = io;
    }

    socketEvents() {
        this.io.on("connection", socket => {

            socket.on('create-room', async () => {
                const { emptyRooms, roomId } = await RoomService.createNewRoom();
                socket.join("room-" + roomId);

                this.io.emit('rooms-available', {
                    'emptyRooms': emptyRooms
                });

                this.io.sockets.in("room-" + roomId).emit('new-room', {
                    'emptyRooms': emptyRooms,
                    'roomNumber': roomId
                });
            });

            socket.on('join-room', async (data) => {
                const { roomId } = await RoomService.JoinInSingleRoom(data.roomNumber);
                socket.join("room-" + roomId);

                this.io.sockets.in("room-" + roomId).emit('start-game', {
                    'roomNumber': roomId
                });
            });

            socket.on('send-move', (data) => {
                const playedGameGrid = data.playedGameGrid;
                const roomNumber = data.roomNumber;
                let winner = RoomService.checkIfWinOrDraw(playedGameGrid);

                socket.broadcast.to("room-" + roomNumber).emit('receive-move', {
                    'position': data.position,
                    'playedText': data.playedText,
                });

                if (winner !== null) {
                    this.io.sockets.in("room-" + roomNumber).emit('game-result', {
                        'winner': winner
                    });
                }
            });


            socket.on('disconnecting', async () => {
                const rooms = socket.rooms;
                const roomsArray = Array.from(rooms);
                const roomNumber = roomsArray.length > 1 ? (roomsArray[1]).split('-')[1] : null;
                if (roomNumber !== null) {
                    await RoomService.DisconnectRoom(roomNumber);
                    this.io.sockets.in("room-" + roomNumber).emit('room-disconnect', { id: socket.id });
                }
            });
        });
    }
}

module.exports = Socket;