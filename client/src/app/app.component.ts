import { Component, ViewChild, OnInit, ElementRef } from '@angular/core';
import { NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { AppService } from './app.service';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  title = 'Tic Tac Toe';
  gameGrid = [[1, 2, 3], [4, 5, 6], [7, 8, 9]];
  playedGameGrid = <Array<{ position: number, player: string }>>[];
  movesPlayed: number = 0;
  displayPlayerTurn: boolean = true;
  myTurn: boolean = true;
  whoWillStart: boolean = true;


  @ViewChild('content') content: ElementRef | undefined;
  modalOption: NgbModalOptions = {};

  totalRooms: number = 1;
  emptyRooms = <Array<number>>[];
  roomNumber: number = 0;
  playedText: string = '';
  whoseTurn = 'X';

  constructor(
    private modalService: NgbModal,
    private appService: AppService,

  ) {
    this.gameGrid = [[1, 2, 3], [4, 5, 6], [7, 8, 9]];
  }



  ngOnInit() {

    this.appService.getRoomStats().then(response => {
      this.totalRooms = response['totalRoomCount'];
      this.emptyRooms = response['emptyRooms'];
    });

    this.appService.getRoomsAvailable().subscribe((response: { totalRoomCount: number, emptyRooms: number[]; }) => {
      this.totalRooms = response['totalRoomCount'];
      this.emptyRooms = response['emptyRooms'];
    });

    this.appService.receivePlayerMove().subscribe((response: any) => {
      this.opponentMove(response);
    });

    this.appService.gameResult().subscribe((response: any) => {
      alert(response['winner']);
      this.resetGame();
    });

    this.appService.playerLeft().subscribe(() => {
      alert('Player Left');
      window.location.reload();
    });


  }

  public ngAfterViewInit() {
    this.modalOption.backdrop = 'static';
    this.modalOption.keyboard = false;
    this.modalOption.size = 'lg';
    const localModalRef = this.modalService.open(this.content, this.modalOption);

    this.appService.startGame().subscribe((response: { [x: string]: number; }) => {
      localModalRef.close();
      this.roomNumber = response['roomNumber'];
    });

  }

  opponentMove(params: any) {
    this.displayPlayerTurn = !this.displayPlayerTurn ? true : false;
    this.playedGameGrid[params['position']] = {
      position: params['position'],
      player: params['playedText']
    };
    this.myTurn = true;
  }


  renderPlayedText(number: any) {
    if (this.playedGameGrid[number] === undefined) {
      return '';
    } else {
      this.playedText = this.playedGameGrid[number]['player'];
      return this.playedText;
    }

  }

  play(num: any) {
    if (!this.myTurn) {
      return;
    }
    this.movesPlayed += 1;
    this.playedGameGrid[num] = {
      position: num,
      player: this.whoseTurn
    };

    this.appService.sendPlayerMove({
      'roomNumber': this.roomNumber,
      'playedText': this.whoseTurn,
      'position': num,
      'playedGameGrid': this.playedGameGrid,
      'movesPlayed': this.movesPlayed
    });

    this.myTurn = false;
    this.displayPlayerTurn = !this.displayPlayerTurn ? true : false;
  }

  joinRoom(roomNumber: number) {
    this.myTurn = false;
    this.whoWillStart = false;
    this.whoseTurn = 'O';
    this.appService.joinNewRoom(roomNumber);
  }

  createRoom() {
    this.myTurn = true;
    this.whoseTurn = 'X';
    this.whoWillStart = true;
    this.appService.createNewRoom().subscribe((response: { roomNumber: number; }) => {
      this.roomNumber = response.roomNumber;
    });
  }

  resetGame() {
    this.playedGameGrid = [];
    this.movesPlayed = 0;
    if (this.whoWillStart) {
      this.myTurn = true;
      this.displayPlayerTurn = true;
      this.whoseTurn = 'X';
    } else {
      this.displayPlayerTurn = true;
      this.whoseTurn = 'O';
    }
  }

}
