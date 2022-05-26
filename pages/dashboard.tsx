import { Button, Box, Typography, Grid, Modal, TextField } from "@mui/material";
import { useRouter } from "next/router";
import React from "react";
import { useEffect } from "react";
import { useAuthState } from 'react-firebase-hooks/auth';
import { logout, auth, createMeeting, joinMeeting, getUserMeetings, setDisplayName } from "../firebase";
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { DataGrid, GridColDef, GridValueGetterParams } from '@mui/x-data-grid';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Link from "next/link";

export default function Dashboard(this: any) {
    const router = useRouter();
    const [user, loading, error] = useAuthState(auth);
    const [meetingsLoaded, setMeetingsLoaded] = React.useState(false);
    const [openCreateMeeting, setOpenCreateMeeting] = React.useState(false);
    const handleOpenCreateMeeting = () => setOpenCreateMeeting(true);
    const handleCloseCreateMeeting = () => setOpenCreateMeeting(false);
    const [openJoinMeeting, setOpenJoinMeeting] = React.useState(false);
    const handleOpenJoinMeeting = () => setOpenJoinMeeting(true);
    const handleCloseJoinMeeting = () => setOpenJoinMeeting(false);
    const [openEditMeeting, setOpenEditMeeting] = React.useState(false);
    const handleOpenEditMeeting = () => setOpenEditMeeting(true);
    const handleCloseEditMeeting = () => setOpenEditMeeting(false);
    const [formValues, setFormValues] = React.useState({
        meetingName: "",
        meetingID: "",
    });
    const [time, setTime] = React.useState<Date | null>(null);
    const handleChange = (prop: string) => (event: { target: { value: any; }; }) => {
        setFormValues({ ...formValues, [prop]: event.target.value });
    };
    const handleCreateNewMeeting = () => {
        createMeeting(user?.uid, formValues.meetingName, time?.toString().split(" GMT")[0]);
        setTime(null);
        setFormValues({ ...formValues, meetingName: "" });
        handleCloseCreateMeeting();
        setMeetingsLoaded(false);
    }
    const handleJoinMeeting = () => {
        joinMeeting(formValues.meetingID, user?.uid);
        setFormValues({ ...formValues, meetingID: "" });
        handleCloseJoinMeeting();
        setMeetingsLoaded(false);
    }

    const [rows, setRows] = React.useState<Array<any>>([]);

    const storeMeetingID = (meetingID: string) => {
        localStorage.setItem("meeting", meetingID);
    }
    const getMeetings = () => {
        getUserMeetings(user?.uid).then((res) => {
            setRows(res.map((item) => {
                return {
                    meetingName: item.meetingName,
                    organizer: item.organizerName,
                    meetingTime: item.time,
                    edit:
                        <Link href={'/details/' + item.meetingID}>
                            <Button
                                variant="contained"
                                sx={{
                                    backgroundColor: 'green',
                                    '&:hover': {
                                        backgroundColor: 'darkgreen'
                                    }
                                }}
                                onClick={() => storeMeetingID(item.meetingID)}
                            >
                                Details
                            </Button>
                        </Link>,
                    join:
                        <Link href={'/join/' + item.meetingID}>
                            <Button
                                variant="contained"
                                sx={{
                                    backgroundColor: 'green',
                                    '&:hover': {
                                        backgroundColor: 'darkgreen'
                                    }
                                }}
                                onClick={() => storeMeetingID(item.meetingID)}
                            >
                                Join
                            </Button>
                        </Link>,
                }
            }));
        })

    }
    useEffect(() => {
        if (!user) router.push("/", undefined, { shallow: true });
        if (user && !meetingsLoaded) {
            if (localStorage.getItem("meetingTopicAdded") == "true") {
                router.push("/details/" + localStorage.getItem("meeting"));
                localStorage.setItem("meetingTopicAdded", "false");
            }
            getMeetings();
            setMeetingsLoaded(true);
        }
    }, [user, meetingsLoaded]);
    return (
        <main>
            <br />
            <br />
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
                {user?.displayName && (
                    <Typography
                        variant="h3"
                        style={{
                            fontFamily: 'futura',
                            paddingTop: '30px',
                            paddingBottom: '30px'
                        }}
                    >
                        Welcome {user?.displayName}!
                    </Typography>
                )}
                {(user?.displayName == "" || user?.displayName == " " || !user?.displayName) && (
                    <Typography
                        variant="h3"
                        style={{
                            fontFamily: 'futura',
                            paddingTop: '30px',
                            paddingBottom: '30px'
                        }}
                    >
                        Welcome!
                    </Typography>
                )}
            </Box>
            <br />
            <br />
            <Grid container style={{ maxWidth: '1300px', margin: '0 auto' }} justifyContent="center">
                <Grid item>
                    <Button
                        sx={{
                            width: { md: '640px', xs: '380px' },
                            margin: '5px',
                            backgroundColor: 'green',
                            borderRadius: '15px',
                            color: 'white',
                            height: '80px',
                            fontFamily: 'futura',
                            fontSize: '18px',
                            '&:hover': {
                                backgroundColor: 'darkgreen'
                            }
                        }}
                        onClick={handleOpenJoinMeeting}
                    >
                        Join Meeting
                    </Button>
                </Grid>
                <Grid item>
                    <Button
                        sx={{
                            width: { md: '640px', xs: '380px' },
                            margin: '5px',
                            backgroundColor: 'green',
                            borderRadius: '15px',
                            color: 'white',
                            height: '80px',
                            fontFamily: 'futura',
                            fontSize: '18px',
                            '&:hover': {
                                backgroundColor: 'darkgreen'
                            }
                        }}
                        onClick={handleOpenCreateMeeting}
                    >
                        Create New Meeting
                    </Button>
                </Grid>
            </Grid>
            <br />
            <br />
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
                <Typography
                    variant="h4"
                    style={{
                        fontFamily: 'futura',
                        paddingTop: '30px',
                        paddingBottom: '30px'
                    }}
                >
                    My Meetings
                </Typography>
            </Box>
            <br />
            <br />
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
                <TableContainer component={Paper} style={{ borderRadius: '15px' }}>
                    <Table sx={{ minWidth: 650 }} aria-label="simple table">
                        <TableHead>
                            <TableRow>
                                <TableCell style={{ fontFamily: 'futura', fontSize: '18px' }} align="center">Meeting&nbsp;Name</TableCell>
                                <TableCell align="center" style={{ fontFamily: 'futura', fontSize: '18px' }}>Organizer</TableCell>
                                <TableCell align="center" style={{ fontFamily: 'futura', fontSize: '18px' }}>Meeting&nbsp;Time</TableCell>
                                <TableCell align="center" style={{ fontFamily: 'futura', fontSize: '18px' }}>Details</TableCell>
                                <TableCell align="center" style={{ fontFamily: 'futura', fontSize: '18px' }}>Join</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {rows.map((row) => (
                                <TableRow
                                    key={row.meetingName}
                                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                >
                                    <TableCell component="th" scope="row" align="center">
                                        {row.meetingName}
                                    </TableCell>
                                    <TableCell align="center">{row.organizer}</TableCell>
                                    <TableCell align="center">{row.meetingTime}</TableCell>
                                    <TableCell align="center">{row.edit}</TableCell>
                                    <TableCell align="center">{row.join}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Box>

            <Modal
                open={openCreateMeeting}
                onClose={handleCloseCreateMeeting}
                aria-labelledby="create-new-meeting"
                aria-describedby="create-new-meeting-desc"
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
                        Create New Meeting
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
                            id="meetingName"
                            label="Meeting Name"
                            variant="outlined"
                            color="success"
                            type={formValues.meetingName}
                            value={formValues.meetingName}
                            onChange={handleChange('meetingName')}
                            style={{ width: '80%' }}
                        />
                        <br />
                        <br />
                        <LocalizationProvider dateAdapter={AdapterDateFns}>
                            <DateTimePicker
                                renderInput={(props) => <TextField {...props} color="success" style={{ width: '80%' }} />}
                                label="Date and Time"
                                value={time}
                                onChange={(newValue) => {
                                    setTime(newValue);
                                }}
                                minDateTime={new Date()}
                            />
                        </LocalizationProvider>
                        <br />
                        <br />
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
                            onClick={handleCreateNewMeeting}
                        >
                            Continue
                        </Button>
                        <br />
                        <br />
                        <br />
                    </Box>
                </Box>
            </Modal>
            <Modal
                open={openEditMeeting}
                onClose={handleCloseEditMeeting}
                aria-labelledby="edit-meeting"
                aria-describedby="edit-meeting-desc"
            >
                <Box
                    style={{
                        backgroundColor: 'white',
                        position: 'absolute' as 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        textAlign: 'center',
                        borderRadius: '15px'
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
                        Join Meeting
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
                            id="meetingID"
                            label="Meeting ID"
                            variant="outlined"
                            color="success"
                            type={formValues.meetingID}
                            value={formValues.meetingID}
                            onChange={handleChange('meetingID')}
                            style={{ width: '80%' }}
                        />
                        <br />
                        <br />
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
                            onClick={handleJoinMeeting}
                        >
                            Continue
                        </Button>
                        <br />
                        <br />
                        <br />
                    </Box>
                </Box>
            </Modal>
            <Modal
                open={openJoinMeeting}
                onClose={handleCloseJoinMeeting}
                aria-labelledby="create-new-meeting"
                aria-describedby="create-new-meeting-desc"
            >
                <Box
                    style={{
                        backgroundColor: 'white',
                        position: 'absolute' as 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        textAlign: 'center',
                        borderRadius: '15px'
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
                        Join Meeting
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
                            id="meetingID"
                            label="Meeting ID"
                            variant="outlined"
                            color="success"
                            type={formValues.meetingID}
                            value={formValues.meetingID}
                            onChange={handleChange('meetingID')}
                            style={{ width: '80%' }}
                        />
                        <br />
                        <br />
                        <Button
                            variant="contained"
                            sx={{
                                width: '80%',
                                height: '50px',
                                backgroundColor: 'green',
                                '&:hover': {
                                    backgroundColor: 'black'
                                },
                                borderRadius: '200px'
                            }}
                            onClick={handleJoinMeeting}
                        >
                            Continue
                        </Button>
                        <br />
                        <br />
                        <br />
                    </Box>
                </Box>
            </Modal>
            <br />
            <br />
        </main>
    );
}