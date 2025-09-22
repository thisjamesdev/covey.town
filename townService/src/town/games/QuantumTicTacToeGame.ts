import {
  GameMove,
  QuantumTicTacToeGameState,
  QuantumTicTacToeMove,
} from '../../types/CoveyTownSocket';
import Game from './Game';
import TicTacToeGame from './TicTacToeGame';
import Player from '../../lib/Player';

/**
 * A QuantumTicTacToeGame is a Game that implements the rules of the Tic-Tac-Toe variant described at https://www.smbc-comics.com/comic/tic.
 * This class acts as a controller for three underlying TicTacToeGame instances, orchestrating the "quantum" rules by taking
 * the role of the monitor.
 */
export default class QuantumTicTacToeGame extends Game<
  QuantumTicTacToeGameState,
  QuantumTicTacToeMove
> {
  private _games: { A: TicTacToeGame; B: TicTacToeGame; C: TicTacToeGame };

  private _xScore: number;

  private _oScore: number;

  private _moveCount: number;

  public constructor() {
    // TODO: implement me
    super({
      moves: [],
      x: undefined,
      o: undefined,
      xScore: 0,
      oScore: 0,
      publiclyVisible: {
        A: Array(3)
          .fill(null)
          .map(() => Array(3).fill(false)), // I looked up how to fill an array
        B: Array(3)
          .fill(null)
          .map(() => Array(3).fill(false)),
        C: Array(3)
          .fill(null)
          .map(() => Array(3).fill(false)),
      },
      status: 'WAITING_TO_START',
    });

    this._games = {
      A: new TicTacToeGame(),
      B: new TicTacToeGame(),
      C: new TicTacToeGame(),
    };
    this._xScore = this.state.xScore;
    this._oScore = this.state.oScore;
    this._moveCount = this.state.moves.length;
  }

  protected _join(player: Player): void {
    // TODO: implement me
    if (this.state.x === player.id || this.state.o === player.id) {
      throw new InvalidParametersError(PLAYER_ALREADY_IN_GAME_MESSAGE);
    }
    if (!this.state.x) {
      this.state = {
        ...this.state,
        x: player.id,
      };
      this._games.A.state.x = player.id;
      this._games.B.state.x = player.id;
      this._games.C.state.x = player.id;
    } else if (!this.state.o) {
      this.state = {
        ...this.state,
        o: player.id,
      };
      this._games.A.state.o = player.id;
      this._games.B.state.o = player.id;
      this._games.C.state.o = player.id;
    } else {
      throw new InvalidParametersError(GAME_FULL_MESSAGE);
    }
    if (this.state.x && this.state.o) {
      this.state = {
        ...this.state,
        status: 'IN_PROGRESS',
      };
      this._games.A.state.status = 'IN_PROGRESS';
      this._games.B.state.status = 'IN_PROGRESS';
      this._games.C.state.status = 'IN_PROGRESS';
    }
  }

  protected _leave(player: Player): void {
    // TODO: implement me
  }

  /**
   * Checks that the given move is "valid": that the it's the right
   * player's turn, that the game is actually in-progress, etc.
   * @see TicTacToeGame#_validateMove
   */
  private _validateMove(move: GameMove<QuantumTicTacToeMove>): void {
    // TODO: implement me
    for (const m of this.state.moves) {
      if (m.col === move.move.col && m.row === move.move.row) {
        throw new InvalidParametersError(BOARD_POSITION_NOT_EMPTY_MESSAGE);
      }
    }
    if (move.move.gamePiece === 'X' && this.state.moves.length % 2 === 1) {
      throw new InvalidParametersError(MOVE_NOT_YOUR_TURN_MESSAGE);
    } else if (move.move.gamePiece === 'O' && this.state.moves.length % 2 === 0) {
      throw new InvalidParametersError(MOVE_NOT_YOUR_TURN_MESSAGE);
    }
    if (this.state.status !== 'IN_PROGRESS') {
      throw new InvalidParametersError(GAME_NOT_IN_PROGRESS_MESSAGE);
    }
  }

  public applyMove(move: GameMove<QuantumTicTacToeMove>): void {
    this._validateMove(move);

    // TODO: implement the guts of this method
    let gamePiece: 'X' | 'O';
    if (move.playerID === this.state.x) {
      gamePiece = 'X';
    } else {
      gamePiece = 'O';
    }
    const ticTacMove = {
      playerID: move.playerID,
      gameID: move.gameID,
      move: {
        gamePiece,
        row: move.move.row,
        col: move.move.col,
      },
    };
    this._games[move.move.board].applyMove(ticTacMove);
    this.state = {
      ...this.state,
      moves: [
        ...this.state.moves,
        {
          ...move.move,
          board: move.move.board,
        },
      ],
    };

    this._checkForWins();
    this._checkForGameEnding();
  }

  /**
   * Checks all three sub-games for any new three-in-a-row conditions.
   * Awards points and marks boards as "won" so they can't be played on.
   */
  private _checkForWins(): void {
    // TODO: implement me
  }

  /**
   * A Quantum Tic-Tac-Toe game ends when no more moves are possible.
   * This happens when all squares on all boards are either occupied or part of a won board.
   */
  private _checkForGameEnding(): void {
    // TODO: implement me
  }
}
