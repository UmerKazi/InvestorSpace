import React, { useCallback, useRef, useState } from 'react';
import Button from '@mui/material';
import Field from './Field';
import TextField from '@mui/material';
import CreateRoomButton from './CreateRoomButton';
export const Home = ({ setRoom, setExpiry, isConfigured }) => {
  const roomRef = useRef(null);
  const [isValidRoom, setIsValidRoom] = useState(false);

  /**
   * If the room is valid, setIsValidRoom and enable the join button
   */
  const checkValidity = useCallback(
    (e) => {
      if (e?.target?.checkValidity()) {
        setIsValidRoom(true);
      }
    },
    [isValidRoom]
  );

  /**
   * Set the roomUrl in local state to trigger Daily iframe creation in <Call />
   */
  const joinCall = useCallback(() => {
    const roomUrl = roomRef?.current?.value;
    setRoom(roomUrl);
  }, [roomRef]);

  return (
    <div>
      <div>
        Start demo with a new unique room, or paste in your own room URL
      </div>
      <div>
        <CreateRoomButton
          isConfigured={isConfigured}
          isValidRoom={isValidRoom}
          setRoom={setRoom}
          setExpiry={setExpiry}
        />
        <Field label="Or enter room to join">
          <TextField
            ref={roomRef}
            type="text"
            placeholder="Enter room URL..."
            pattern="^(https:\/\/)?[\w.-]+(\.(daily\.(co)))+[\/\/]+[\w.-]+$"
            onChange={checkValidity}
          />
        </Field>
        <div>
          <Button onClick={joinCall} disabled={!isValidRoom}>
            Join room
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Home;