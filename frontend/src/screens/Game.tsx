import { useEffect, useState } from "react";
import { Button } from "../components/Button"
import { ChessBoard } from "../components/ChessBoard"
import { useSocket } from "../hooks/useSocket"
import { Chess } from "chess.js";



export const INIT_GAME = "init_game";
export const MOVE = "move";
export const GAME_OVER = "game_over"
export const Game = () => {
    const socket = useSocket();
    const [chess, setChess] = useState(new Chess())
    const [board, setBoard] = useState(chess.board())
    const [start,setStarted] = useState(false)
    useEffect(() => {
        if (!socket) return;
        socket.onmessage = (event) => {
            const message = JSON.parse(event.data);
            console.log(message);
            switch (message.type) {
                case INIT_GAME:
                    console.log("Game Initialised");
                    setBoard(chess.board())
                    setStarted(true)
                    break;
                case MOVE:
                    const move = message.payload;
                    chess.move(move);
                    setBoard(chess.board())
                    console.log("MOVE MADE");
                    break;
                case GAME_OVER:
                    console.log("Game Over")
                    break;
            }
        }
    }, [socket])
    if (!socket) return <div>Connecting....</div>
    return (
        <div className="justify-center flex">
            <div className="pt-8 max-w-screen-lg flex w-full">
                <div className="grid grid-cols-6 gap-4 w-full">
                    <div className=" col-span-4  w-full">
                        <ChessBoard setBoard={setBoard} chess={chess} board={board} socket={socket} />
                    </div>
                    <div className="col-span-2 bg-green-200 w-full flex justify-center">
                        <div className="pt-8">
                        {!start && <Button onClick={() => {
                            socket.send(JSON.stringify({
                                type: INIT_GAME
                            }))
                        }
                        }>
                            Play
                        </Button>}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}