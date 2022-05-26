import React, { useEffect, useState } from 'react';
import { onAuthStateChanged, auth, updateUserName, getUserPhoto, storePfp, getPfpUrl, updateUserPfp, getUserName } from '../firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import { Box } from '@mui/system';
import { useRouter } from 'next/router';
import { Button, TextField, Divider, Typography } from '@mui/material';
import { FormControl, Select, InputLabel, MenuItem } from '@mui/material';

export default function Settings() {
    const [user] = useAuthState(auth);
    const router = useRouter();
    const delay = (ms: number) => new Promise(res => setTimeout(res, ms));
    const [userPfp, setUserPfp] = useState<any>('https://t4.ftcdn.net/jpg/00/64/67/63/360_F_64676383_LdbmhiNM6Ypzb3FM4PPuFP9rHe7ri8Ju.jpg');
    const [userDisplayName, setUserDisplayName] = useState<string>('');
    const handleChangeDisplayName = (event: React.ChangeEvent<HTMLInputElement>) => {
        setUserDisplayName(event.target.value);
    };
    const handleSubmit = () => {
        updateUserName(userDisplayName);
        router.push("/dashboard");
    }
    const photoHandler = (event) => {
        const photo = event.target.files[0];
        storePfp(photo);
        delay(5000);
        getPfpUrl().then((response) => {
            updateUserPfp(response[0]);
        })
    }
    useEffect(() => {
        onAuthStateChanged(auth, (user) => {
            getUserPhoto(user?.uid).then(res => setUserPfp(res));
            getUserName(user?.uid).then(res => setUserDisplayName(res[0]));
        });
    }, [user])
    return (
        <main style={{ marginTop: '30px' }}>
            <Box
                style={{
                    borderRadius: '10px',
                    boxShadow: '0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)',
                    margin: '0 auto',
                    textAlign: 'center',
                    maxWidth: '1300px'
                }}
            >
                <br />
                <Box
                    component="img"
                    src={userPfp}
                    style={{
                        backgroundColor: 'grey',
                        borderRadius: '50px',
                        width: '100px',
                        height: '100px',
                        marginTop: '30px'
                    }}
                />
                <br />
                <Button
                    component="label"
                    style={{
                        backgroundColor: 'green',
                        color: 'white',
                        borderRadius: '10px'
                    }}
                >
                    Edit
                    <input
                        type="file"
                        accept='image/*'
                        hidden
                        onChange={photoHandler}
                    />
                </Button>
                <br />
                <br />
                <Divider variant="middle" style={{ maxWidth: '1000px', margin: '0 auto' }}><Typography>Account Details</Typography></Divider>
                <TextField
                    id="display-name"
                    label="Display Name"
                    variant='outlined'
                    type={userDisplayName}
                    value={userDisplayName}
                    color="success"
                    onChange={handleChangeDisplayName}
                    style={{ width: '40%', marginTop: '30px' }}
                />
                <br />
                <br />
                <br />
                <Button variant="contained" style={{ width: '40%', marginBottom: '100px', height: '50px', backgroundColor: 'green', color: 'white', borderRadius: '15px' }} onClick={handleSubmit}>
                    Save
                </Button>
                <br />
                <br />
                <br />
                <br />

            </Box>
        </main>
    )
}