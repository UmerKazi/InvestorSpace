import { Box, Button, ListItemButton, ListItemIcon, Modal, TextField, Typography } from "@mui/material";
import { useRouter } from "next/router";
import React, { useEffect } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, getMeetingData, getUserName, getUserPhoto, removeAttendee, createMeetingTopic, updateMeetingDetails, getMeetingTopics, deleteMeetingTopic, updateMeetingTopic, deleteMeeting, leaveMeeting } from "../../firebase";
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
import EditIcon from '@mui/icons-material/Edit';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';
import Link from "next/link";

export default function Details() {
    const router = useRouter();
    const [temp, setTemp] = React.useState("");
    const [user, loading, error] = useAuthState(auth);
    const [pageLoad, setPageLoad] = React.useState<Boolean>(false);
    const [meetingID, setMeetingID] = React.useState<String | null>("");
    const [meetingIDPage, setMeetingIDPage] = React.useState<string>('');
    const [userPfp, setUserPfp] = React.useState<Array<string>>([]);
    const [meetingTopicsLoaded, setMeetingTopicsLoaded] = React.useState<boolean>(false);
    const [valuesLoaded, setValuesLoaded] = React.useState<boolean>(false);
    const [numberOfTopics, setNumberOfTopics] = React.useState<number>(0);
    const [meetingName, setMeetingName] = React.useState<string>("");
    const handleChangeMeetingName = (event: React.ChangeEvent<HTMLInputElement>) => {
        setMeetingName(event.target.value);
    };
    const [organizer, setOrganizer] = React.useState<string>("");
    const [organizerName, setOrganizerName] = React.useState<string>("");
    const [meetingTime, setMeetingTime] = React.useState<string>("");
    const handleChangeMeetingTime = (event: React.ChangeEvent<HTMLInputElement>) => {
        setMeetingTime(event.target.value);
    };
    const [attendees, setAttendees] = React.useState<Array<string>>(["none"]);
    const [meetingTopics, setMeetingTopics] = React.useState<Array<any>>([]);
    const [attendeesNames, setAttendeesNames] = React.useState<Array<any>>([]);
    const [isCreator, setIsCreator] = React.useState<boolean>(true);
    const [topicName, setTopicName] = React.useState<string>("");
    const handleChangeTopicName = (event: React.ChangeEvent<HTMLInputElement>) => {
        setTopicName(event.target.value);
    };
    const [topicDescription, setTopicDescription] = React.useState<string>("");
    const handleChangeTopicDescription = (event: React.ChangeEvent<HTMLInputElement>) => {
        setTopicDescription(event.target.value);
    };
    const [topicDuration, setTopicDuration] = React.useState<string>("");
    const handleChangeTopicDuration = (event: React.ChangeEvent<HTMLInputElement>) => {
        setTopicDuration(event.target.value);
    };
    const [openCreateMeetingTopic, setOpenCreateMeetingTopic] = React.useState(false);
    const handleOpenCreateMeetingTopic = () => setOpenCreateMeetingTopic(true);
    const handleCloseCreateMeetingTopic = () => setOpenCreateMeetingTopic(false);
    const [openEditMeetingTopic, setOpenEditMeetingTopic] = React.useState(false);
    const handleOpenEditMeetingTopic = (meetingTopicID: string, index: number) => {
        setTemp(meetingTopicID);
        setTopicName(meetingTopics[index].name);
        setTopicDescription(meetingTopics[index].description);
        setTopicDuration(meetingTopics[index].duration);
        setOpenEditMeetingTopic(true);
    };
    const handleCloseEditMeetingTopic = () => {
        setTopicName("");
        setTopicDescription("");
        setTopicDuration("");
        setOpenEditMeetingTopic(false);
    }
    const handleUpdateMeetingDetails = () => {
        updateMeetingDetails(meetingID, meetingName, meetingTime);
        localStorage.setItem("meetingTopicAdded", "true");
        router.push("/dashboard");
    }
    const [createMeetingError, setCreateMeetingError] = React.useState<string>("");
    const handleCreateNewMeetingTopic = () => {
        if (topicName == "" || topicDescription == "" || topicDuration == "") {
            setCreateMeetingError("Please Fill Out All Form Fields");
            localStorage.setItem("meetingTopicAdded", "true");
        }
        if (topicName !== "" && topicDescription !== "" && topicDuration !== "") {
            createMeetingTopic(meetingID, topicName, topicDescription, topicDuration);
            setTopicName("");
            setTopicDescription("");
            setTopicDuration("");
            handleCloseCreateMeetingTopic();
            localStorage.setItem("meetingTopicAdded", "true");
        }

    }
    const handleDeleteMeetingTopic = (meetingTopicID: string) => {
        deleteMeetingTopic(meetingID, meetingTopicID);
        localStorage.setItem("meetingTopicAdded", "true");
    }
    const handleDeleteAttendee = (attendeeID: string) => {
        removeAttendee(meetingID, attendeeID);
        localStorage.setItem("meetingTopicAdded", "true");
    }
    const handleUpdateMeetingTopic = (meetingTopicID: string) => {
        updateMeetingTopic(meetingTopicID, topicName, topicDescription, topicDuration);
        setTopicName("");
        setTopicDescription("");
        setTopicDuration("");
        localStorage.setItem("meetingTopicAdded", "true");
    }
    const handleDeleteMeeting = () => {
        deleteMeeting(meetingID);
        router.push("/dashboard");
    }
    const handleLeaveMeeting = () => {
        leaveMeeting(meetingID, user?.uid);
        router.push("/dashboard");
    }
    useEffect(() => {
        if (typeof window !== "undefined" && pageLoad == false) {
            setMeetingID(localStorage.getItem("meeting"));
            setPageLoad(true);
        }
    }, [pageLoad])
    useEffect(() => {
        if (user && pageLoad == true) {
            getMeetingData(meetingID).then(res => {
                setMeetingName(res[0].meetingName);
                setOrganizer(res[0].organizer);
                setOrganizerName(res[0].organizerName);
                setMeetingTime(res[0].time);
                setAttendees(res[0].attendees);
                setMeetingIDPage(res[0].meetingID);
                if (res[0].organizer == user?.uid) {
                    setIsCreator(false);
                }
                if (res[0].meetingTopics) {
                    setNumberOfTopics(res[0].meetingTopics.length);
                }
            });
        }
    }, [user, pageLoad])
    useEffect(() => {
        if (meetingName !== "" && organizer !== "" && organizerName !== "" && meetingTime !== "" && attendees !== ["none"] && valuesLoaded == false && pageLoad == true) {
            if (numberOfTopics !== 0) {
                getMeetingTopics(meetingID).then((res) => {
                    for (let i = 0; i < numberOfTopics; i++) {
                        setMeetingTopics((oldValue) => [...oldValue, res[i]]);
                    }
                })
                setMeetingTopicsLoaded(true);
            }
            if (attendees !== []) {
                setAttendeesNames([]);
                for (let i = 0; i < attendees.length; i++) {
                    getUserName(attendees[i]).then((name) => {
                        getUserPhoto(attendees[i]).then((photo) => {
                            setAttendeesNames((oldArray) => [...oldArray, { "name": name[0], 'photo': photo[0] }]);
                        })
                    });

                }
            }
            setValuesLoaded(true);
        }
    }, [meetingName, organizer, organizerName, meetingTime, attendees, numberOfTopics, valuesLoaded, pageLoad]);
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
                    {/* <IconButton>
                        <KeyboardBackspaceIcon style={{ color: 'green', margin: '50px', float: 'left' }} fontSize="large" />
                    </IconButton> */}
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
                        onChange={handleChangeMeetingName}
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
                        disabled={true}
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
                        onChange={handleChangeMeetingTime}
                        disabled={isCreator}
                        style={{ width: '60%' }}
                    />
                    <br />
                    <br />
                    <TextField
                        id="meetingID"
                        label="Meeting ID"
                        variant="outlined"
                        color="success"
                        type={meetingIDPage}
                        value={meetingIDPage}
                        style={{ width: '60%' }}
                        InputProps={{ endAdornment: <Button style={{ backgroundColor: 'green', borderRadius: '10px', color: 'white' }} onClick={() => { navigator.clipboard.writeText(meetingIDPage) }}>Copy</Button> }}
                    />
                    <br />
                    <br />
                    {!isCreator && (
                        <>
                            <Button style={{ backgroundColor: 'green', color: 'white', width: '60%', height: '50px' }} onClick={handleUpdateMeetingDetails}>Save</Button>
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
                        {attendeesNames.map((displayName, index) => (
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
                                            <Link href="/dashboard">
                                                <IconButton edge="end" aria-label="delete" onClick={() => handleDeleteAttendee(attendees[index])}>
                                                    <DeleteIcon />
                                                </IconButton>
                                            </Link>
                                        }
                                    >
                                        <ListItemAvatar>
                                            <Avatar src={displayName.photo}>
                                            </Avatar>
                                        </ListItemAvatar>
                                        <ListItemText primary={displayName.name} />
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
                                            <Avatar src={displayName.photo}>
                                            </Avatar>
                                        </ListItemAvatar>
                                        <ListItemText primary={displayName.name} />
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
                        <br />
                        {meetingTopics?.map((meeting, index) => (
                            <>
                                {!isCreator && (
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
                                            secondaryAction={
                                                <Link href="/dashboard">
                                                    <IconButton edge="end" aria-label="delete" onClick={() => handleDeleteMeetingTopic(meeting.meetingTopicID)}>
                                                        <DeleteIcon />
                                                    </IconButton>
                                                </Link>
                                            }
                                            key={meeting}
                                        >
                                            <IconButton edge="end" aria-label="drop-down" onClick={() => handleOpenEditMeetingTopic(meeting.meetingTopicID, index)}>
                                                <EditIcon fontSize="medium" />
                                            </IconButton>
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
                                            {/* <Typography
                                                style={{
                                                    textAlign: 'left',
                                                    fontFamily: 'futura'
                                                }}
                                            >
                                                Attachments:
                                            </Typography>
                                            <br /> */}
                                        </Box>
                                    </>
                                )}

                                {isCreator && (
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
                                            <Typography
                                                style={{
                                                    textAlign: 'left',
                                                    fontFamily: 'futura'
                                                }}
                                            >
                                                Attachments:
                                            </Typography>
                                            <br />
                                        </Box>
                                    </>
                                )}

                            </>
                        ))}
                        <br />
                        {!isCreator && (
                            <Button
                                style={{
                                    width: '100%',
                                    backgroundColor: 'green',
                                    color: 'white',
                                    borderRadius: '15px',
                                    height: '50px'
                                }}
                                onClick={handleOpenCreateMeetingTopic}
                            >
                                Create New Topic
                            </Button>
                        )}
                        <br />
                        <br />
                    </List>
                    {!isCreator && (
                        <>
                            <br />
                            <br />
                            <Button style={{ color: 'red' }} onClick={handleDeleteMeeting}>Delete Meeting</Button>
                            <br />
                            <br />
                            <br />
                        </>
                    )}
                    {isCreator && (
                        <>
                            <br />
                            <br />
                            <Button style={{ color: 'red' }} onClick={handleLeaveMeeting}>Leave Meeting</Button>
                            <br />
                            <br />
                            <br />
                        </>
                    )}
                </Box>
            )
            }
            <Modal
                open={openCreateMeetingTopic}
                onClose={handleCloseCreateMeetingTopic}
                aria-labelledby="create-new-meeting-topic"
                aria-describedby="create-new-meeting-topic-desc"
            >
                <Box
                    style={{
                        backgroundColor: 'white',
                        position: 'absolute' as 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        textAlign: 'center',
                        borderRadius: '15px',
                    }}
                    sx={{
                        width: { xs: '390px', sm: "600px" }
                    }}
                >
                    <Typography
                        variant="h4"
                        style={{
                            fontFamily: 'futura',
                            paddingTop: '30px',
                            paddingBottom: '30px'
                        }}
                    >
                        New Meeting Topic
                    </Typography>
                    <Box
                        component="form"
                        noValidate
                        autoComplete="off"
                        style={{
                            margin: '0 auto'
                        }}
                    >
                        <TextField
                            id="topicName"
                            label="Topic Name"
                            variant="outlined"
                            color="success"
                            required
                            type={topicName}
                            value={topicName}
                            onChange={handleChangeTopicName}
                            style={{ width: '80%' }}
                        />
                        <br />
                        <br />
                        <TextField
                            id="topicDescription"
                            label="Description"
                            variant="outlined"
                            color="success"
                            multiline
                            required
                            rows={4}
                            type={topicDescription}
                            value={topicDescription}
                            onChange={handleChangeTopicDescription}
                            style={{ width: '80%' }}
                        />
                        <br />
                        <br />
                        <TextField
                            id="topicDuration"
                            label="Duration"
                            variant="outlined"
                            color="success"
                            required
                            type={topicDuration}
                            value={topicDuration}
                            onChange={handleChangeTopicDuration}
                            style={{ width: '80%' }}
                        />
                        <br />
                        <br />
                        {createMeetingError !== "" && (
                            <Typography style={{ color: 'red', fontFamily: 'futura' }}>
                                {createMeetingError}
                                <br />
                                <br />
                            </Typography>
                        )}
                        <Link href="/dashboard">
                            <Button
                                variant="contained"
                                sx={{
                                    width: '80%',
                                    height: '50px',
                                    backgroundColor: 'green',
                                    '&:hover': {
                                        backgroundColor: 'black'
                                    },
                                    borderRadius: '15px'
                                }}
                                onClick={handleCreateNewMeetingTopic}
                            >
                                Continue
                            </Button>
                        </Link>
                        <br />
                        <br />
                        <br />
                    </Box>
                </Box>
            </Modal>
            <Modal
                open={openEditMeetingTopic}
                onClose={handleCloseEditMeetingTopic}
                aria-labelledby="edit-new-meeting-topic"
                aria-describedby="edit-new-meeting-topic-desc"
            >
                <Box
                    style={{
                        backgroundColor: 'white',
                        position: 'absolute' as 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        textAlign: 'center',
                        borderRadius: '15px',
                    }}
                    sx={{
                        width: { xs: '390px', sm: "600px" }
                    }}
                >
                    <Typography
                        variant="h4"
                        style={{
                            fontFamily: 'futura',
                            paddingTop: '30px',
                            paddingBottom: '30px'
                        }}
                    >
                        Edit Meeting Topic
                    </Typography>
                    <Box
                        component="form"
                        noValidate
                        autoComplete="off"
                        style={{
                            margin: '0 auto'
                        }}
                    >
                        <TextField
                            id="topicName"
                            label="Topic Name"
                            variant="outlined"
                            color="success"
                            type={topicName}
                            value={topicName}
                            onChange={handleChangeTopicName}
                            style={{ width: '80%' }}
                        />
                        <br />
                        <br />
                        <TextField
                            id="topicDescription"
                            label="Description"
                            variant="outlined"
                            color="success"
                            multiline
                            rows={4}
                            type={topicDescription}
                            value={topicDescription}
                            onChange={handleChangeTopicDescription}
                            style={{ width: '80%' }}
                        />
                        <br />
                        <br />
                        <TextField
                            id="topicDuration"
                            label="Duration"
                            variant="outlined"
                            color="success"
                            type={topicDuration}
                            value={topicDuration}
                            onChange={handleChangeTopicDuration}
                            style={{ width: '80%' }}
                        />
                        <br />
                        <br />
                        <Link href="/dashboard">
                            <Button
                                variant="contained"
                                sx={{
                                    width: '80%',
                                    height: '50px',
                                    backgroundColor: 'green',
                                    '&:hover': {
                                        backgroundColor: 'black'
                                    },
                                    borderRadius: '15px'
                                }}
                                onClick={() => handleUpdateMeetingTopic(temp)}
                            >
                                Continue
                            </Button>
                        </Link>
                        <br />
                        <br />
                        <br />
                    </Box>
                </Box>
            </Modal>
        </main >
    );
}