const Room = require('../models/Room');


class RoomService {

    static winCombination = [
        [1, 2, 3], [4, 5, 6], [7, 8, 9],
        [1, 4, 7], [2, 5, 8], [3, 6, 9],
        [1, 5, 9], [7, 5, 3]
    ];

    static async findAllRooms() {
        const allRooms = await Room.find();
        const emptyRooms = allRooms.filter(r => r.isFull === false).map(r => r.roomId);
        const fullRooms = allRooms.filter(r => r.isFull === true).map(r => r.roomId);

        return {
            totalRoomCount: allRooms.length,
            emptyRooms,
            fullRooms
        }
    }

    static async createNewRoom() {
        const { totalRoomCount, emptyRooms, fullRooms } = await RoomService.findAllRooms();

        let roomId = 1;
        if (totalRoomCount > 0) {
            roomId = Math.max(...emptyRooms, ...fullRooms) + 1;
        }

        await Room.create({ roomId, isFull: false });
        emptyRooms.push(roomId);

        return {
            totalRoomCount: totalRoomCount + 1,
            emptyRooms,
            fullRooms,
            roomId
        };
    }

    static async JoinInSingleRoom(roomNumber) {
        const updatedRoom = await Room.findOneAndUpdate({ roomId: roomNumber }, { isFull: true }, {
            new: true
        });

        return { roomId: updatedRoom.roomId };
    }

    static async DisconnectRoom(roomNumber) {
        await Room.deleteOne({ roomId: roomNumber })
    }

    static checkIfWinOrDraw(playedGameGrid) {
        let winner = null;

        this.winCombination.forEach(singleCombination => {
            if (playedGameGrid[singleCombination[0]] &&
                playedGameGrid[singleCombination[1]] &&
                playedGameGrid[singleCombination[2]] &&
                playedGameGrid[singleCombination[0]]['player'] === playedGameGrid[singleCombination[1]]['player'] &&
                playedGameGrid[singleCombination[1]]['player'] === playedGameGrid[singleCombination[2]]['player']
            ) {
                winner = playedGameGrid[singleCombination[0]]['player'] + ' Wins !';
            }
        });

        if (!winner) {
            const allMarkedPlaces = playedGameGrid.map(e => e && e.position).filter(x => x != null);
            if (allMarkedPlaces.length === 9) {
                winner = 'Game Draw';
            }
        }

        return winner;
    }

}


module.exports = RoomService;