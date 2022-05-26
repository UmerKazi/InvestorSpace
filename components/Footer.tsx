import { Typography } from "@mui/material";
import React from "react";

export default function Footer() {
    return (
        <footer style={{ backgroundColor: 'black', textAlign: 'center', marginTop: '50px' }}>
            <Typography
                style={{
                    fontFamily: 'futura',
                    color: 'white',
                    fontWeight: 500,
                    paddingTop: '50px',
                    paddingBottom: '50px',
                    fontSize: '18px'
                }}
            >
                Made with <a style={{ marginRight: '5px' }}>💚 </a> by <a href="https://kazi.cc" style={{ textDecoration: 'underline' }}>Umer Kazi</a>
            </Typography>
        </footer>
    );
}