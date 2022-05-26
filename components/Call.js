import { useCallback, useEffect, useRef, useState } from 'react';
import { Button, Box } from '@mui/material';
import { TextField } from '@mui/material';
import DailyIframe from '@daily-co/daily-js';
import { writeText } from 'clipboard-polyfill';
import ExpiryTimer from './ExpiryTimer';

const CALL_OPTIONS = {
  showLeaveButton: true,
  iframeStyle: {
    height: '100%',
    width: '100%',
    aspectRatio: 16 / 9,
    minwidth: '400px',
    maxWidth: '920px',
    border: '0',
    borderRadius: '12px',
  },
};

export function Call({ room, setRoom, callFrame, setCallFrame, expiry }) {
  const callRef = useRef(null);
  const [isLinkCopied, setIsLinkCopied] = useState(false);

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

  return (
    <Box style={{ textAlign: 'center', backgroundColor: 'black', padding: '5%', borderRadius: '15px', boxShadow: '0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)', }}>
        {/* Daily iframe container */}
        <div ref={callRef} />
    </Box>
  );
}

export default Call;