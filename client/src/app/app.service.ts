import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AppService {

  constructor(private socket: Socket, private http: HttpClient) { }

  public getRoomStats(): Promise<any> {
    return new Promise(resolve => {
      this.http.get(`http://localhost:3000/getRoomStats`).subscribe(data => {
        resolve(data);
      });
    });
  }

  createNewRoom(): any {
    this.socket.emit('create-room', { 'test': 9909 });
    const observable = new Observable(observer => {
      this.socket.on('new-room', (data: any) => {
        observer.next(data);
      });
    });
    return observable;
  };

  joinNewRoom(roomNumber: number): any {
    console.log('send join room', roomNumber);
    this.socket.emit('join-room', { 'roomNumber': roomNumber });
  };

  startGame(): any {
    const observable = new Observable(observer => {
      this.socket.on('start-game', (data: any) => {
        observer.next(data);
      });
    });
    return observable;
  }

  gameResult(): any {
    const observable = new Observable(observer => {
      this.socket.on('game-result', (data: any) => {
        observer.next(data);
      });
    });
    return observable;
  }

  getRoomsAvailable(): any {
    const observable = new Observable(observer => {
      this.socket.on('rooms-available', (data: any) => {
        observer.next(data);
      });
    });
    return observable;
  }

  sendPlayerMove(params: any): any {
    this.socket.emit('send-move', params);
  }

  receivePlayerMove(): any {
    const observable = new Observable(observer => {
      this.socket.on('receive-move', (data: any) => {
        observer.next(data);
      });
    });
    return observable;
  }

  playerLeft(): any {
    const observable = new Observable(observer => {
      this.socket.on('room-disconnect', (data: any) => {
        observer.next(data);
      });
    });
    return observable;
  }
}
