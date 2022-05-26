import { useCallback, useEffect, useRef, useState } from 'react';
import Button from '@mui/material';
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

  const handleCopyClick = useCallback(() => {
    writeText(room);
    setIsLinkCopied(true);
    setTimeout(() => setIsLinkCopied(false), 5000);
  }, [room, isLinkCopied]);

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
    if (callFrame) return;

    createAndJoinCall();
  }, [callFrame, createAndJoinCall]);

  return (
    <div>
      <div className="call-container">
        {/* Daily iframe container */}
        <div ref={callRef} className="call" />
        <div>
          <h1>Copy and share the URL to invite others</h1>
          <p>
            <label htmlFor="copy-url"></label>
            <TextField
              type="text"
              id="copy-url"
              placeholder="Copy this room URL"
              value={room}
              pattern="^(https:\/\/)?[\w.-]+(\.(daily\.(co)))+[\/\/]+[\w.-]+$"
            />
            <Button onClick={handleCopyClick}>
              {isLinkCopied ? 'Copied!' : `Copy room URL`}
            </Button>
          </p>
          <div>
            {expiry && (
              <div>
                Room expires in:
                <ExpiryTimer expiry={expiry} />
              </div>
            )}
          </div>
        </div>
        <style jsx>{`
          .call-container {
            display: flex;
            align-items: center;
            gap: var(--spacing-md);
          }
          .call-container :global(.call) {
            width: 100%;
          }
          .call-container :global(.button) {
            margin-top: var(--spacing-md);
          }
          .call-container :global(.card) {
            max-width: 300px;
            max-height: 400px;
          }
          .call-container :global(.card-footer) {
            align-items: center;
            gap: var(--spacing-xxs);
          }
          .call-container :global(.countdown) {
            position: static;
            border-radius: var(--radius-sm);
          }
          @media only screen and (max-width: 750px) {
            .call-container {
              flex-direction: column;
            }
          }
        `}</style>
      </div>
    </div>
  );
}

export default Call;