import { Box, Button, ListItemButton, ListItemIcon, TextField, Typography } from "@mui/material";
import { useRouter } from "next/router";
import React, { useEffect } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, getMeetingData, getUserData, getUserMeetings, getUserName } from "../../firebase";
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
import PersonIcon from '@mui/icons-material/Person';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';

export default function Details() {
    const router = useRouter();
    const [user, loading, error] = useAuthState(auth);
    const meetingID = localStorage.getItem('meeting');
    const [valuesLoaded, setValuesLoaded] = React.useState<boolean>(false);
    const [meetingName, setMeetingName] = React.useState<string>("");
    const [organizer, setOrganizer] = React.useState<string>("");
    const [organizerName, setOrganizerName] = React.useState<string>("");
    const [meetingTime, setMeetingTime] = React.useState<string>("");
    const [attendees, setAttendees] = React.useState<Array<string>>(["none"]);
    const [attendeesNames, setAttendeesNames] = React.useState<Array<string>>([]);
    const [isCreator, setIsCreator] = React.useState<boolean>(true);
    useEffect(() => {
        if (user) {
            getMeetingData(meetingID).then(res => {
                setMeetingName(res[0].meetingName);
                setOrganizer(res[0].organizer);
                setOrganizerName(res[0].organizerName);
                setMeetingTime(res[0].time);
                setAttendees(res[0].attendees);
                if (res[0].organizer == user?.uid) {
                    setIsCreator(false);
                }
            })
        }
    }, [user])
    useEffect(() => {
        if (meetingName !== "" && organizer !== "" && organizerName !== "" && meetingTime !== "" && attendees !== ["none"] && valuesLoaded == false) {
            if (attendees !== []) {
                for (let i = 0; i < attendees.length; i++) {
                    getUserName(attendees[i]).then((res) => {
                        setAttendeesNames((oldArray) => [...oldArray, res[0]]);
                    });
                }
            }
            setValuesLoaded(true);
        }
    }, [meetingName, organizer, organizerName, meetingTime, attendees])
    return (
        <main>
            {valuesLoaded && (
                <Box
                    style={{
                        margin: '0 auto',
                        borderRadius: '15px',
                        boxShadow: '0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)',
                        backgroundColor: 'white',
                        textAlign: 'center',
                        maxWidth: '1300px'

                    }}
                >
                    <br />
                    <Typography
                        variant="h4"
                        style={{
                            fontFamily: 'futura',
                            paddingTop: '30px',
                            paddingBottom: '25px'
                        }}
                    >
                        Meeting Details
                    </Typography>
                    <br />
                    <br />
                    <TextField
                        id="meetingName"
                        label="Meeting Name"
                        variant="outlined"
                        color="success"
                        type={meetingName}
                        value={meetingName}
                        disabled={isCreator}
                        style={{ width: '60%' }}
                    />
                    <br />
                    <br />
                    <TextField
                        id="organizer"
                        label="Organizer"
                        variant="outlined"
                        color="success"
                        type={organizerName}
                        value={organizerName}
                        disabled={isCreator}
                        style={{ width: '60%' }}
                    />
                    <br />
                    <br />
                    <TextField
                        id="meetingTime"
                        label="Meeting Time"
                        variant="outlined"
                        color="success"
                        type={meetingTime}
                        value={meetingTime}
                        disabled={isCreator}
                        style={{ width: '60%' }}
                    />
                    <br />
                    <br />
                    {!isCreator && (
                        <>
                            <Button style={{ backgroundColor: 'green', color: 'white', width: '60%', height: '50px' }}>Save</Button>
                            <br />
                            <br />
                        </>
                    )}
                    <List sx={{ width: '60%', margin: '0 auto' }}>
                        <Typography
                            variant="h5"
                            style={{
                                fontFamily: 'futura',
                                paddingTop: '10px',
                                paddingBottom: '10px'
                            }}
                        >
                            Attendees
                        </Typography>
                        <br />
                        {attendeesNames.map((displayName) => (
                            <>
                                {!isCreator && (
                                    <ListItem
                                        key={displayName}
                                        style={{
                                            borderRadius: '15px',
                                            boxShadow: '0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)',
                                            marginTop: '10px',
                                            marginBottom: '10px',
                                            height: '70px'
                                        }}
                                        secondaryAction={
                                            <IconButton edge="end" aria-label="delete">
                                                <DeleteIcon />
                                            </IconButton>
                                        }
                                    >
                                        <ListItemAvatar>
                                            <Avatar style={{ backgroundColor: 'green' }}>
                                                <PersonIcon />
                                            </Avatar>
                                        </ListItemAvatar>
                                        <ListItemText primary={displayName} />
                                    </ListItem>
                                )}
                                {isCreator && (
                                    <ListItem
                                        key={displayName}
                                        style={{
                                            borderRadius: '15px',
                                            boxShadow: '0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)',
                                            marginTop: '10px',
                                            marginBottom: '10px',
                                            height: '70px'
                                        }}
                                    >
                                        <ListItemAvatar>
                                            <Avatar style={{ backgroundColor: 'green' }}>
                                                <PersonIcon />
                                            </Avatar>
                                        </ListItemAvatar>
                                        <ListItemText primary={displayName} />
                                    </ListItem>
                                )}

                            </>
                        ))}
                    </List>
                    <br />
                    <br />

                    <List sx={{ width: '60%', margin: '0 auto' }}>
                        <Typography
                            variant="h5"
                            style={{
                                fontFamily: 'futura',
                                paddingTop: '10px',
                                paddingBottom: '10px'
                            }}
                        >
                            Meeting Topics
                        </Typography>
                        <ListItem
                            style={{
                                borderRadius: '15px',
                                boxShadow: '0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)',
                                marginTop: '10px',
                                marginBottom: '10px',
                                height: '70px',
                                textAlign: 'center'
                            }}
                            secondaryAction={
                                <IconButton edge="end" aria-label="delete">
                                    <DeleteIcon />
                                </IconButton>
                            }
                        >
                            <IconButton edge="end" aria-label="drop-down">
                                <ArrowDropDownIcon fontSize="large" />
                            </IconButton>
                            <ListItemText primary="Discuss Funding Opportunity" secondary="5 min" />
                        </ListItem>
                        <Box
                            style={{
                                borderRadius: '15px',
                                boxShadow: '0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)',
                                marginTop: '10px',
                                marginBottom: '10px',
                            }}
                        >
                            Hello
                        </Box>
                    </List>
                </Box>
            )
            }
        </main >
    );
}