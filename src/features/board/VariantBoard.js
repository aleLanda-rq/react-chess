import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import storeParser from 'app/storeParser';
import Capablanca80Board from 'features/board/Capablanca80Board';
import Chess960Board from 'features/board/Chess960Board';
import ClassicalBoard from 'features/board/ClassicalBoard';
import * as variantConst from 'features/mode/variantConst';
import WsAction from 'features/ws/WsAction';

const VariantBoard = ({props}) => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(WsAction.connect(props)).then(() => WsAction.startOff());
  }, [props, dispatch]);

  const variantBoard = () => {
    if (storeParser.activeVariant() === variantConst.CAPABLANCA_80) {
      return <Capablanca80Board props={props} />;
    } else if (storeParser.activeVariant() === variantConst.CHESS_960) {
      return <Chess960Board props={props} />;
    }

    return <ClassicalBoard props={props} />;
  }

  return variantBoard();
}

export default VariantBoard;
