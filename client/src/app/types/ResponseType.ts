export type ReceiveMoveResponseType = {
    position: number,
    playedText: string,
}

export type AvailableRoomResponseType = {
    emptyRooms: number[],
}

export type GameResultResponseType = {
    winner: string,
}

export type GameStartResponseType = {
    roomNumber: number,
}

export type CreateRoomResponseType = {
    roomNumber: number,
}

export type RoomStatusResponseType = {
    totalRoomCount: number,
    emptyRooms: number[],
    fullRooms: number[]
}