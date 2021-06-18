import boardActionTypes from '../constants/boardActionTypes';
import Ascii from '../utils/Ascii';
import Pgn from '../utils/Pgn';

const initialState = {
  turn: Pgn.symbol.WHITE,
  picked: null,
  fen: null,
  history: [ Ascii.board ]
};

const reducer = (state = initialState, action) => {
  const newTurn = state.turn === Pgn.symbol.WHITE ? Pgn.symbol.BLACK : Pgn.symbol.WHITE;
  const newHistory = JSON.parse(JSON.stringify(state.history));
  const newAscii = JSON.parse(JSON.stringify(state.history[state.history.length - 1]));
  switch (action.type) {
    case boardActionTypes.START:
      return Object.assign({}, initialState);
    case boardActionTypes.PICK_PIECE:
      return {
        ...state,
        picked: {
          i: action.payload.i,
          j: action.payload.j,
          piece: state.history[state.history.length - 1][action.payload.i][action.payload.j]
        }
      };
    case boardActionTypes.LEAVE_PIECE:
      newAscii[state.picked.i][state.picked.j] = ' . ';
      newAscii[action.payload.i][action.payload.j] = state.picked.piece;
      newHistory.push(newAscii);
      return {
        turn: newTurn,
        picked: null,
        fen: Ascii.toFen(newHistory[newHistory.length - 1]) + ` ${newTurn}`,
        history: newHistory
      };
    case boardActionTypes.UNDO_MOVE:
      newHistory.pop();
      return {
        turn: newTurn,
        picked: null,
        fen: null,
        history: newHistory
      };
    case boardActionTypes.BROWSE_HISTORY:
      return {
        ...state,
        picked: null,
        fen: null
      };
    default:
      return state;
  }
};

export default reducer;
