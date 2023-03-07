export type PlayerMoveRequeestType = {
    roomNumber: number,
    playedText: String,
    position: number,
    playedGameGrid: Array<{ position: number, player: string }>,
}