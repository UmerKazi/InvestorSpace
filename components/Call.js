import { useCallback, useEffect, useRef, useState } from 'react';
import { Button, Box } from '@mui/material';
import { TextField, Typography, ListItem, IconButton, ListItemText, List } from '@mui/material';
import DailyIframe from '@daily-co/daily-js';
import { writeText } from 'clipboard-polyfill';
import ExpiryTimer from './ExpiryTimer';
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, getMeetingData, getMeetingTopics } from '../firebase';
const CALL_OPTIONS = {
  showLeaveButton: true,
  iframeStyle: {
    height: '100%',
    width: '100%',
    aspectRatio: 16 / 9,
    minwidth: '400px',
    maxWidth: '920px',
    border: '0',
    borderRadius: '15px',
  },
};

export function Call({ room, setRoom, callFrame, setCallFrame, expiry }) {
  const callRef = useRef(null);
  const [pageLoad, setPageLoad] = useState(false);
  const [meetingID, setMeetingID] = useState("");
  const [numberOfTopics, setNumberOfTopics] = useState(0);
  const [meetingTopics, setMeetingTopics] = useState([]);
  const [meetingName, setMeetingName] = useState([]);
  const [user, loading, error] = useAuthState(auth);

  const createAndJoinCall = useCallback(() => {
    const newCallFrame = DailyIframe.createFrame(
      callRef?.current,
      CALL_OPTIONS
    );

    setCallFrame(newCallFrame);

    newCallFrame.join({ url: room });

    const leaveCall = () => {
      setRoom(null);
      setCallFrame(null);
      callFrame.destroy();
    };

    newCallFrame.on('left-meeting', leaveCall);
  }, [room, setCallFrame]);

  /**
   * Initiate Daily iframe creation on component render if it doesn't already exist
   */
  useEffect(() => {
    if (callFrame) {
      return;
    } else {
      createAndJoinCall();
    }
  }, [callFrame, createAndJoinCall]);

  useEffect(() => {
    if (typeof window !== "undefined" && pageLoad == false) {
        setMeetingID(localStorage.getItem("meeting"));
        setPageLoad(true);
    }
}, [pageLoad])

  useEffect(() => {
    if (user && pageLoad == true) {
        getMeetingData(meetingID).then(res => {
            if (res[0].meetingTopics) {
                setNumberOfTopics(res[0].meetingTopics.length);
                setMeetingName(res[0].meetingName);
            }
        });
    }
}, [user, pageLoad])

  useEffect(() => {
    if (pageLoad == true) {
        if (numberOfTopics !== 0) {
            getMeetingTopics(meetingID).then((res) => {
                for (let i = 0; i < numberOfTopics; i++) {
                    setMeetingTopics((oldValue) => [...oldValue, res[i]]);
                }
            })
        }
    }
  }, [numberOfTopics, pageLoad]);

  return (
    <>
    <Typography
      variant="h4"
      style={{
          fontFamily: 'futura',
          paddingTop: '10px',
          paddingBottom: '10px',
          textAlign: 'center'
      }}
    >
        {meetingName}
    </Typography>
    <br/>
    <br/>
    <Box style={{ textAlign: 'center', backgroundColor: 'black', padding: '5%', borderRadius: '15px', boxShadow: '0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)', }}>
        {/* Daily iframe container */}
        <div ref={callRef} />
    </Box>
    <br/>
    <br/>
    <List sx={{ width: '60%', margin: '0 auto' }}>
          <Typography
              variant="h4"
              style={{
                  fontFamily: 'futura',
                  paddingTop: '10px',
                  paddingBottom: '10px',
                  textAlign: 'center'
              }}
          >
              Meeting Topics
          </Typography>
          <br />
          {meetingTopics?.map((meeting, index) => (
              <>
                <ListItem
                    style={{
                        borderRadius: '15px',
                        boxShadow: '0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)',
                        marginTop: '10px',
                        marginBottom: '10px',
                        height: '70px',
                        textAlign: 'center'
                    }}
                    key={meeting}
                >
                    <ListItemText key={meeting} primary={meeting.name} secondary={meeting.duration} />
                </ListItem>
                <Box
                    style={{
                        borderRadius: '15px',
                        boxShadow: '0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)',
                        marginTop: '10px',
                        marginBottom: '10px',
                        padding: '40px',
                        textAlign: 'left'
                    }}
                >
                    <Typography
                        style={{
                            textAlign: 'left',
                            fontFamily: 'futura'
                        }}
                    >
                        Description:
                    </Typography>
                    <br />
                    <Typography>
                        {meeting.description}
                    </Typography>
                    <br />
                </Box>
              </>
          ))}
          <br />
          <br />
      </List>
  </>
  );
}

export default Call;