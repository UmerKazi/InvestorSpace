import { Box, Button, FormControl, InputAdornment, InputLabel, OutlinedInput, TextField, Typography } from "@mui/material";
import React, { useEffect } from "react";
import { getAuth, auth, registerWithEmailAndPassword, signUpWithGoogle } from '../firebase.js';
import { useAuthState } from 'react-firebase-hooks/auth';
import IconButton from '@mui/material/IconButton';
import { Visibility, VisibilityOff } from "@mui/icons-material";
import Divider from '@mui/material/Divider';
import GoogleIcon from '@mui/icons-material/Google';
import { useRouter } from "next/router";
import Link from "next/link";

export default function SignUp() {
    const [formValues, setFormValues] = React.useState({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        showPassword: false,
    });

    const validation = (values: any) => {
        const firstName = values.firstName;
        const lastName = values.lastName;
        const email = values.email;
        const password = values.password;
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;
        let errorMessage = "";
        if (firstName.length <= 1) {
            errorMessage = "Your First Name Must Be Longer Than 1 Character!";
        } else if (lastName.length <= 1) {
            errorMessage = "Your Last Name Must Be Longer Than 1 Character!";
        } else if (!regex.test(email)) {
            errorMessage = "Invalid Email, Please Try Again!";
        } else if (password.length <= 6) {
            errorMessage = "Your Password Must Be Longer Than 6 Characters!";
        }
        return errorMessage;
    }

    const handleChange = (prop: string) => (event: { target: { value: any; }; }) => {
        setFormValues({ ...formValues, [prop]: event.target.value });
    };

    const handleClickShowPassword = () => {
        setFormValues({
            ...formValues,
            showPassword: !formValues.showPassword,
        });
    };

    const handleMouseDownPassword = (event: { preventDefault: () => void; }) => {
        event.preventDefault();
    };

    const fb = getAuth();
    const router = useRouter();
    const [user, loading, error] = useAuthState(auth);
    const [signUpError, setSignUpError] = React.useState("");
    const [globalError, setGlobalError] = React.useState(false);

    useEffect(() => {
        if (loading) return;
        if (user) router.push("/dashboard", undefined, { shallow: true });
    }, [user, loading]);

    const [isSubmit, setIsSubmit] = React.useState(false);

    const register = () => {
        registerWithEmailAndPassword(formValues.email, formValues.password, formValues.firstName, formValues.lastName);
    };

    const handleSubmit = (e: { preventDefault: () => void; }) => {
        e.preventDefault();
        setSignUpError(validation(formValues));
        if (signUpError !== "") {
            setGlobalError(true);
        }
        if (signUpError == "") {
            setIsSubmit(true);
        }
    }

    useEffect(() => {
        if (isSubmit && signUpError == "") {
            register();
        }
    })
    return (
        <main>
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
                    variant="h3"
                    style={{
                        fontFamily: 'futura',
                        paddingTop: '50px',
                        paddingBottom: '50px'
                    }}
                >
                    Get Started Today!
                </Typography>
                <Box
                    component="form"
                    noValidate
                    autoComplete="off"
                    style={{
                        maxWidth: '800px',
                        margin: '0 auto'
                    }}
                >
                    <TextField
                        id="first-name"
                        label="First Name"
                        variant="outlined"
                        color="success"
                        type={formValues.firstName}
                        value={formValues.firstName}
                        onChange={handleChange('firstName')}
                        style={{ width: '80%' }}
                    />
                    <br />
                    <br />
                    <TextField
                        id="last-name"
                        label="Last Name"
                        variant="outlined"
                        color="success"
                        type={formValues.lastName}
                        value={formValues.lastName}
                        onChange={handleChange('lastName')}
                        style={{ width: '80%' }}
                    />
                    <br />
                    <br />
                    <TextField
                        id="email"
                        label="Email"
                        variant="outlined"
                        color="success"
                        type={formValues.email}
                        value={formValues.email}
                        onChange={handleChange('email')}
                        style={{ width: '80%' }}
                    />
                    <br />
                    <br />
                    <FormControl sx={{ width: '80%' }} variant="outlined">
                        <InputLabel htmlFor="outlined-adornment-password" color="success">Password</InputLabel>
                        <OutlinedInput
                            id="outlined-adornment-password"
                            type={formValues.showPassword ? 'text' : 'password'}
                            value={formValues.password}
                            onChange={handleChange('password')}
                            color="success"
                            endAdornment={
                                <InputAdornment position="end">
                                    <IconButton
                                        aria-label="toggle password visibility"
                                        onClick={handleClickShowPassword}
                                        onMouseDown={handleMouseDownPassword}
                                        edge="end"
                                    >
                                        {formValues.showPassword ? <VisibilityOff /> : <Visibility />}
                                    </IconButton>
                                </InputAdornment>
                            }
                            label="Password"
                        />
                    </FormControl>
                    <br />
                    <br />
                    {globalError && (
                        <>
                            <p style={{ color: 'darkred', paddingRight: '10px', paddingLeft: '10px' }}>
                                {signUpError}
                            </p>
                        </>
                    )}

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
                        onClick={handleSubmit}
                    >
                        Continue
                    </Button>
                    <br />
                    <br />
                    <br />
                    <Divider style={{ width: '80%', margin: '0 auto' }}>OR</Divider>
                    <br />
                    <br />
                    <Button
                        variant="outlined"
                        sx={{
                            width: '80%',
                            height: '50px',
                            borderRadius: '200px',
                            color: 'black',
                            borderColor: 'black',
                            '&:hover': {
                                borderColor: 'green',
                                color: 'green'
                            },
                            marginBottom: '20px'
                        }}
                        onClick={signUpWithGoogle}
                    >
                        <GoogleIcon style={{ marginRight: '10px' }} /> Sign Up With Google
                    </Button>
                    <br />
                    <br />
                    <Link href="/signin">
                        <Typography
                            style={{
                                color: 'green',
                                textDecoration: 'underline',
                                cursor: 'pointer'
                            }}
                        >
                            Already have an account? Sign In!
                        </Typography>
                    </Link>
                </Box>
                <br />
                <br />
            </Box>
        </main>
    );
}