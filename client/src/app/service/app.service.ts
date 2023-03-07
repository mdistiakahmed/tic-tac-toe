import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { AvailableRoomResponseType, CreateRoomResponseType, GameResultResponseType, GameStartResponseType, ReceiveMoveResponseType } from '../types/ResponseType';
import { PlayerMoveRequeestType } from '../types/RequestType';

const STATUS_URL = 'http://localhost:3000/api/v1/room-status';

@Injectable({
  providedIn: 'root'
})
export class AppService {


  constructor(private socket: Socket, private http: HttpClient) { }

  public getRoomStats(): Promise<any> {
    return new Promise(resolve => {
      this.http.get(STATUS_URL).subscribe(data => {
        resolve(data);
      });
    });
  }


  createNewRoom(): Observable<CreateRoomResponseType> {
    this.socket.emit('create-room');
    const observable = new Observable<CreateRoomResponseType>(observer => {
      this.socket.on('new-room', (data: CreateRoomResponseType) => {
        observer.next(data);
      });
    });
    return observable;
  };

  joinNewRoom(roomNumber: number) {
    console.log('send join room', roomNumber);
    this.socket.emit('join-room', { 'roomNumber': roomNumber });
  };

  startGame(): Observable<GameStartResponseType> {
    const observable = new Observable<GameStartResponseType>(observer => {
      this.socket.on('start-game', (data: GameStartResponseType) => {
        observer.next(data);
      });
    });
    return observable;
  }

  gameResult(): Observable<GameResultResponseType> {
    const observable = new Observable<GameResultResponseType>(observer => {
      this.socket.on('game-result', (data: GameResultResponseType) => {
        observer.next(data);
      });
    });
    return observable;
  }

  getRoomsAvailable(): Observable<AvailableRoomResponseType> {
    const observable = new Observable<AvailableRoomResponseType>(observer => {
      this.socket.on('rooms-available', (data: AvailableRoomResponseType) => {
        observer.next(data);
      });
    });
    return observable;
  }

  sendPlayerMove(params: PlayerMoveRequeestType) {
    this.socket.emit('send-move', params);
  }

  receivePlayerMove(): Observable<ReceiveMoveResponseType> {
    const observable = new Observable<ReceiveMoveResponseType>(observer => {
      this.socket.on('receive-move', (data: ReceiveMoveResponseType) => {
        observer.next(data);
      });
    });
    return observable;
  }

  playerLeft(): Observable<{ id: number }> {
    const observable = new Observable<{ id: number }>(observer => {
      this.socket.on('room-disconnect', (data: { id: number }) => {
        observer.next(data);
      });
    });
    return observable;
  }
}
