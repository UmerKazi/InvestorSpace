import type { NextPage } from 'next'
import { Box, Typography, Grid, Button } from '@mui/material'
import Head from 'next/head'
import Image from 'next/image'
import Coin from '../assets/coin.png'
import Hero from '../assets/hero.png'
import Link from 'next/link'
import { useEffect } from 'react'
import { useRouter } from 'next/router'
import { useAuthState } from 'react-firebase-hooks/auth'
import { auth } from '../firebase'
import Script from 'next/script'

const Home: NextPage = () => {
  const router = useRouter();
  const [user, loading, error] = useAuthState(auth);
  useEffect(() => {
    if (user) router.push("/dashboard", undefined, { shallow: true });
  }, [user]);
  return (
    <main style={{ display: 'flex', justifyContent: 'center' }}>
      <Script crossOrigin='true' src="https://unpkg.com/@daily-co/daily-js" />
      <br />
      <br />
      <br />
      <Box
        sx={{
          margin: '0 auto',
          borderRadius: '15px',
          boxShadow: '0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)',
          backgroundColor: 'white',
          maxWidth: '1300px'
        }}
      >
        <Grid container sx={{ padding: { sm: '10px', md: '50px' }, marginTop: '10px', marginBottom: '10px' }} spacing={2} >
          <Grid item id="text" md={6} style={{ textAlign: 'center', paddingBottom: '50px' }} order={{ xs: 2, md: 1 }} >
            <Box sx={{ paddingTop: { md: '10vh', sm: '0vh' } }}>
              <Typography
                id="headline"
                variant="h2"
                sx={{
                  fontFamily: 'futura',
                  fontWeight: '700',
                  paddingLeft: '20px',
                  paddingRight: '20px',
                  paddingTop: '20px',
                  textAlign: 'left'
                }}
              >
                The Only Space For <a style={{ color: 'green' }}>Success</a>
              </Typography>
              <br />
              <Typography
                id="subheading"
                variant="subtitle1"
                style={{
                  paddingLeft: '20px',
                  paddingRight: '20px',
                  textAlign: 'left'
                }}
              >
                InvestorSpace does it all, from scheduling, meeting, and documenting important investor meetings, to creating simple to use post-event documentation archives for stakeholders to collaboratively access. So the question remains; what are you waiting for?
              </Typography>
              <br />
              <br />
              <Link href="/signup">
                <Button
                  variant="contained"
                  sx={{
                    backgroundColor: 'green',
                    fontFamily: 'futura',
                    width: '90%',
                    height: '50px',
                    borderRadius: '100px',
                    '&:hover': {
                      backgroundColor: 'black'
                    }
                  }}
                >
                  Get Started Today!
                </Button>
              </Link>
            </Box>
          </Grid>
          <Grid item id="coin" md={6} style={{ textAlign: 'center', width: '100%' }} order={{ xs: 1, md: 2 }}>
            <Image src={Coin} alt="coin" />
          </Grid>
        </Grid >
      </Box >
      <br />
      <br />
      <br />
      <br />
    </main >
  )
}

export default Home
