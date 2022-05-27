import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Button, TextField, Box } from '@mui/material';
import Field from './Field';
import CreateRoomButton from './CreateRoomButton';
import { DriveEta } from '@mui/icons-material';

export const Home = ({ setRoom, setExpiry, isConfigured }) => {
  const roomRef = useRef(null);
  const [isValidRoom, setIsValidRoom] = useState(false);
  const [pageLoad, setPageLoad] = useState(false);
  const [meetingID, setMeetingID] = useState("");
  const [meetingURL, setMeetingURL] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined" && pageLoad == false) {
        setMeetingID(localStorage.getItem("meeting"));
        setPageLoad(true);
    }
}, [pageLoad])

  useEffect(() => {
    if (pageLoad == true) {
      setMeetingURL("https://investorspace.daily.co/" + meetingID.substring(1));
    }
  }, [meetingID])

  /**
   * Set the roomUrl in local state to trigger Daily iframe creation in <Call />
   */
  const joinCall = useCallback(() => {
    const roomUrl = meetingURL;
    setRoom(roomUrl);
  }, [meetingURL]);

  return (
    <div>
      {pageLoad && (
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

            }}
          >
          <br/>
          <br/>
          <Button onClick={joinCall} style={{backgroundColor: 'green', color: 'white', margin: '0 auto', width: '80%', height: '50px'}}>
            Enter Meeting
          </Button>
          <br/>
          <br/>
          <br/>
        </Box>
        )}
      </div>
  );
};

export default Home;