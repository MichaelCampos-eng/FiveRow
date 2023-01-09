import { Component, OnInit } from '@angular/core';
type coordinates = [number, number];
type MetaData = [string, number];

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss']
})
export class BoardComponent implements OnInit {
  squares: (MetaData|undefined)[][];
  valids: coordinates[];
  xIsNext: boolean;
  start: boolean;
  winner: string | null;
  playerO: number;
  playerX: number;

  constructor() {}

  ngOnInit() {
    this.newGame();
  }

  newGame() {
    this.squares = [...Array(10)].map(e => Array(4));
    this.valids = [];
    this.winner = null;
    this.xIsNext = true;
    this.start = true;
    this.playerO = 0;
    this.playerX = 0;
  }

  get player() {
    return this.xIsNext ? 'X' : 'O';
  }

  makeMove(idx: number, idy: number) {
    if (!this.squares[idx][idy] 
      && (this.valids.some(a => a[0] === idx && a[1] === idy)) || this.start) {

      this.squares[idx].splice(idy, 1, [this.player, 0]);
      // Check surrounding for potential points and exploration
      for (let i = -1; i < 2; i++){
        for (let j = -1; j < 2; j++){
          if (!(i == 0 && j == 0)) {
            var count: number = this.numConsecutive(i, j, idx, idy);
            var points: number = this.computePoints(count);
            this.glow(count, points, i, j, idx, idy);
            this.explore(i+idx, j+idy);
            this.playerX += this.xIsNext ? points : 0;
            this.playerO += this.xIsNext ? 0 : points;
          }
        }
      }
      this.xIsNext = !this.xIsNext;
      this.start = false;
    }
    this.winner = this.checkWinner();
  }

  glow(count: number, colorInd:number, i: number, j: number, idx: number, idy: number) {
    if (count > 2) {
      while (count > 0) {
        var square: MetaData | undefined = this.squares[idx][idy];
        if (square != undefined) {
          square[1] = colorInd;
        } 
        idx += i;
        idy += j;
        count -= 1;
      }
    }
  }

  computePoints(count: number) {
    return Math.floor(count/3) * Math.pow(2, count-3) * Math.pow(-1, Math.floor(count/6));
  }

  // Returns number of consecutive like squares 
  numConsecutive(transX: number, transY: number, idx: number, idy: number) {
    var count: number = 0;
    while (this.bounded(idx, idy)) {
      var square: MetaData | undefined = this.squares[idx][idy];
      if (square == undefined) {
        break;
      }
      if (square != undefined && square[0] != this.player) {
        break;
      } 
      count += 1;
      idx = idx + transX;
      idy = idy + transY;
    }
    return count;
  }

  checkWinner() {
    for (let i = 0; i < this.squares.length; i++) {
      if (this.squares[i].includes(undefined)) {
        return null;
      }
    }
    if (this.playerX > this.playerO) {
      return 'X';
    }
    return 'O';
  }

  explore(idx: number, idy: number) {
    if (this.bounded(idx, idy) && !this.squares[idx][idy]) {
      this.valids.push([idx, idy]);
    }
  }

  bounded(idx: number, idy: number) {
    return idx >= 0 && idy >= 0 && idx < this.squares.length && idy < this.squares[idx].length; 
  }
}