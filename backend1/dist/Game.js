"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Game = void 0;
const chess_js_1 = require("chess.js");
const messages_1 = require("./messages");
class Game {
    constructor(player1, player2) {
        this.player1 = player1;
        this.player2 = player2;
        this.board = new chess_js_1.Chess();
        this.startTime = new Date();
        this.player1.send(JSON.stringify({
            type: messages_1.INIT_GAME,
            payload: {
                color: "white"
            }
        }));
        this.player2.send(JSON.stringify({
            type: messages_1.INIT_GAME,
            payload: {
                color: "black"
            }
        }));
    }
    makeMove(socket, move) {
        if (socket === this.player1) {
            try {
                this.board.move(move);
            }
            catch (error) {
                console.log(error);
                return;
            }
            if (this.board.isGameOver()) {
                const winner = this.board.turn() === "w" ? "black" : "white";
                this.player1.send(JSON.stringify({ type: messages_1.GAME_OVER, payload: { winner } }));
                this.player2.send(JSON.stringify({ type: messages_1.GAME_OVER, payload: { winner } }));
                return;
            }
            this.player2.send(JSON.stringify({ type: messages_1.MOVE, payload: move }));
        }
        else if (socket === this.player2) {
            try {
                this.board.move(move);
            }
            catch (error) {
                console.log(error);
                return;
            }
            if (this.board.isGameOver()) {
                const winner = this.board.turn() === "w" ? "black" : "white";
                this.player1.send(JSON.stringify({ type: messages_1.GAME_OVER, payload: { winner } }));
                this.player2.send(JSON.stringify({ type: messages_1.GAME_OVER, payload: { winner } }));
                return;
            }
            this.player1.send(JSON.stringify({ type: messages_1.MOVE, payload: move }));
        }
    }
}
exports.Game = Game;
