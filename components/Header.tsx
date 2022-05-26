import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import Link from 'next/link';
import { getAuth, onAuthStateChanged, logout, getUserPhoto } from '../firebase';
import { useRouter } from 'next/router';

const Header = () => {
    const router = useRouter();
    const [isLoggedIn, setIsLoggedIn] = React.useState(false);
    const [userPfp, setUserPfp] = React.useState('');
    React.useEffect(() => {
        const auth = getAuth();
        const user = auth.currentUser;
        onAuthStateChanged(auth, (user) => {
            setIsLoggedIn(!!user);
            if (user && userPfp == '') {
                getUserPhoto(user?.uid).then((res) => setUserPfp(res[0]));
            }
        });
    }, []);

    const [anchorElNav, setAnchorElNav] = React.useState<null | HTMLElement>(null);
    const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(null);

    const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorElNav(event.currentTarget);
    };
    const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorElUser(event.currentTarget);
    };

    const handleCloseNavMenu = () => {
        setAnchorElNav(null);
    };

    const handleCloseUserMenu = () => {
        setAnchorElUser(null);
    };

    const logOut = () => {
        handleCloseUserMenu();
        logout();
        router.push("/", undefined, { shallow: true });
    }

    return (
        <AppBar position="static" style={{ backgroundColor: 'black', marginBottom: '40px' }}>
            <Container maxWidth="xl">
                <Toolbar disableGutters>
                    <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'flex' } }}>
                        {isLoggedIn && (
                            <>
                                <IconButton
                                    size="large"
                                    aria-label="account of current user"
                                    aria-controls="menu-appbar"
                                    aria-haspopup="true"
                                    onClick={handleOpenNavMenu}
                                    color="inherit"
                                >
                                    <MenuIcon />
                                </IconButton>
                                <Menu
                                    id="menu-appbar"
                                    anchorEl={anchorElNav}
                                    anchorOrigin={{
                                        vertical: 'bottom',
                                        horizontal: 'left',
                                    }}
                                    keepMounted
                                    transformOrigin={{
                                        vertical: 'top',
                                        horizontal: 'left',
                                    }}
                                    open={Boolean(anchorElNav)}
                                    onClose={handleCloseNavMenu}
                                    sx={{
                                        display: { xs: 'block', md: 'block' },
                                    }}
                                >
                                    <Link href="/dashboard">
                                        <MenuItem onClick={handleCloseNavMenu}>
                                            <Typography textAlign="center">Join Meeting</Typography>
                                        </MenuItem>
                                    </Link>
                                    <Link href="/dashboard">
                                        <MenuItem onClick={handleCloseNavMenu}>
                                            <Typography textAlign="center">Create New Meeting</Typography>
                                        </MenuItem>
                                    </Link>
                                </Menu>
                            </>
                        )}
                        {!isLoggedIn && (
                            <>
                                <IconButton
                                    size="large"
                                    aria-label="account of current user"
                                    aria-controls="menu-appbar"
                                    aria-haspopup="true"
                                    onClick={handleOpenNavMenu}
                                    sx={{ color: 'black' }}
                                >
                                    <MenuIcon />
                                </IconButton>
                                <Menu
                                    id="menu-appbar"
                                    anchorEl={anchorElNav}
                                    anchorOrigin={{
                                        vertical: 'bottom',
                                        horizontal: 'left',
                                    }}
                                    keepMounted
                                    transformOrigin={{
                                        vertical: 'top',
                                        horizontal: 'left',
                                    }}
                                    open={Boolean(anchorElNav)}
                                    onClose={handleCloseNavMenu}
                                    sx={{
                                        display: { xs: 'block', md: 'block' },
                                        color: 'black',
                                    }}
                                >
                                    <Link href="/dashboard">
                                        <MenuItem onClick={handleCloseNavMenu}>
                                            <Typography textAlign="center"></Typography>
                                        </MenuItem>
                                    </Link>
                                </Menu>
                            </>
                        )}

                    </Box>
                    <Link href="/">
                        <Typography
                            variant="h5"
                            noWrap
                            component="a"
                            sx={{
                                display: { xs: 'flex', md: 'flex' },
                                flexGrow: 1,
                                fontFamily: 'futura',
                                fontWeight: 700,
                                color: 'green',
                                textDecoration: 'none',
                                cursor: 'pointer'
                            }}
                        >
                            <span style={{ color: 'white' }}>Investor</span>Space
                        </Typography>
                    </Link>
                    {isLoggedIn && (
                        <Box sx={{ flexGrow: 0 }}>
                            <Tooltip title="Open settings">
                                <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                                    <Avatar alt="Profile Picture" src={userPfp} />
                                </IconButton>
                            </Tooltip>
                            <Menu
                                sx={{ mt: '45px' }}
                                id="menu-appbar"
                                anchorEl={anchorElUser}
                                anchorOrigin={{
                                    vertical: 'top',
                                    horizontal: 'right',
                                }}
                                keepMounted
                                transformOrigin={{
                                    vertical: 'top',
                                    horizontal: 'right',
                                }}
                                open={Boolean(anchorElUser)}
                                onClose={handleCloseUserMenu}
                            >
                                <MenuItem onClick={logOut}>
                                    <Typography textAlign="center">Log Out</Typography>
                                </MenuItem>
                            </Menu>
                        </Box>
                    )}
                    {!isLoggedIn && (
                        <Box sx={{ flexGrow: 0 }}>
                            <Link href="/signin">
                                <Button
                                    variant="contained"
                                    sx={{
                                        backgroundColor: 'green',
                                        fontFamily: 'futura',
                                        fontSize: '12px',
                                        borderRadius: '100px',
                                        '&:hover': {
                                            backgroundColor: 'white',
                                            color: 'green'
                                        }
                                    }}
                                >
                                    Sign In
                                </Button>
                            </Link>
                        </Box>
                    )}
                </Toolbar>
            </Container>
        </AppBar>
    );
};
export default Header;