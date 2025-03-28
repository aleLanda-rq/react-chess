import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import CloseIcon from '@mui/icons-material/Close';
import {
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  MenuItem,
  TextField
} from '@mui/material';
import * as variantConst from 'features/mode/variantConst';
import * as nav from 'features/nav/navSlice';
import Ws from 'features/ws/Ws';

const CreateInboxCodeDialog = () => {
  const state = useSelector(state => state);
  const dispatch = useDispatch();

  return (
    <Dialog open={state.nav.dialogs.createInboxCode.open} maxWidth="sm" fullWidth={true}>
      <DialogTitle>
        Create Inbox
        <IconButton onClick={() => dispatch(nav.createInboxCodeDialog({ open: false }))}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      {state.nav.dialogs.createInboxCode.inbox?.hash ? <CopyCode /> : <CreateCode />}
    </Dialog>
  );
}

const CreateCode = () => {
  const [fields, setFields] = React.useState({
    variant: variantConst.CLASSICAL,
    fen: '',
    startPos: '',
  });

  const handleVariantChange = (event: Event) => {
    setFields({
      ...fields,
      variant: event.target.value
    });
  };

  const handleFenChange = (event: Event) => {
    setFields({
      ...fields,
      fen: event.target.value
    });
  };

  const handleStartPosChange = (event: Event) => {
    setFields({
      ...fields,
      startPos: event.target.value
    });
  };

  const handleCreateCode = (event) => {
    event.preventDefault();
    let settings = {};
    if (fields.fen) {
      settings.fen = fields.fen;
    }
    if (fields.startPos) {
      settings.startPos = fields.startPos;
    }
    Ws.inboxCreate(fields.variant, JSON.stringify(settings));
  }

  return (
    <DialogContent>
      <form onSubmit={handleCreateCode}>
        <TextField
          select
          required
          fullWidth
          name="variant"
          label="Variant"
          variant="filled"
          defaultValue={variantConst.CLASSICAL}
          margin="normal"
          onChange={handleVariantChange}
          >
          <MenuItem key={0} value="classical">
            Classical
          </MenuItem>
          <MenuItem key={1} value="960">
            Fischer Random 960
          </MenuItem>
          <MenuItem key={2} value="capablanca">
            Capablanca
          </MenuItem>
        </TextField>
        {
          fields.variant === variantConst.CHESS_960
            ? <TextField
              fullWidth
              required
              name="startPos"
              label="Start position"
              variant="filled"
              helperText="Examples: RNBQKBNR, RBBKRQNN, NRKNBBQR, etc."
              onChange={handleStartPosChange}
            />
            : null
        }
        <TextField
          fullWidth
          name="fen"
          label="From FEN position"
          variant="filled"
          margin="normal"
          onChange={handleFenChange}
        />
        <Button
          fullWidth
          type="submit"
          variant="outlined"
          sx={{ mt: 2 }}
        >
          Create Inbox
        </Button>
      </form>
    </DialogContent>
  );
}

const CopyCode = () => {
  const state = useSelector(state => state);
  const dispatch = useDispatch();

  return (
    <DialogContent>
      <TextField
        fullWidth
        type="text"
        name="sharecode"
        label="Share this code with a friend"
        margin="normal"
        value={state.nav.dialogs.createInboxCode.inbox.hash}
      />
      <Button
        fullWidth
        variant="outlined"
        onClick={() => {
          navigator.clipboard.writeText(state.nav.dialogs.createInboxCode.inbox.hash);
          dispatch(nav.createInboxCodeDialog({ open: false }));
      }}>
        Copy Inbox Code
      </Button>
    </DialogContent>
  );
}

export default CreateInboxCodeDialog;
