import React, { useCallback, useRef, useState } from 'react';
import { Button, TextField, Box } from '@mui/material';
import Field from './Field';
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
    <Box
        style={{
            position: 'absolute',
            top: '50%', 
            right: '50%',
            transform: 'translate(50%,-50%)',
            borderRadius: '15px',
            boxShadow: '0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)',
            backgroundColor: 'white',
            textAlign: 'center',
            maxWidth: '1300px',
            minWidth: '400px',
            height: '120px'

        }}
    >
      <br/>
      <br/>
        <CreateRoomButton
          isConfigured={isConfigured}
          isValidRoom={isValidRoom}
          setRoom={setRoom}
          setExpiry={setExpiry}
        />
    </Box>
  );
};

export default Home;