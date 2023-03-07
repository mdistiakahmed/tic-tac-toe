const RoomService = require('../services/roomService');


const roomStatus = async (request, response) => {
    const result = await RoomService.findAllRooms();

    response.status(200).json(result);
};


module.exports = { roomStatus };