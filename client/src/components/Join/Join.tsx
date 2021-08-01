import React, { useState } from 'react';
import SportsVolleyballIcon from '@material-ui/icons/SportsVolleyball';
import { Link } from 'react-router-dom';
import { Avatar, Button, CssBaseline, TextField, Paper, Grid, makeStyles, Typography, Container, Box } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  root: {
    height: '100vh',
  },
  image: {
    backgroundImage: 'url(https://source.unsplash.com/random)',
    backgroundRepeat: 'no-repeat',
    backgroundColor:
      theme.palette.type === 'light' ? theme.palette.grey[50] : theme.palette.grey[900],
    backgroundSize: 'cover',
    backgroundPosition: 'center',
  },
  paper: {
    margin: theme.spacing(8, 4),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: '50%', // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

const Join = () => {
  const [name, setName] = useState<string | null>('');
  const [room, setRoom] = useState<string | null>('');

  const classes = useStyles();

  const shouldDisableEnterButton = ((name && name.length > 0) && (room && room.length > 0)) ? false : true

  return (
    <div>
      <CssBaseline />
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <SportsVolleyballIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Welcome to Slime Volleyball
        </Typography>
          <form className={classes.form} noValidate>
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="playername"
              label="Player Name"
              name="playername"
              autoComplete="playername"
              autoFocus
              onChange={(e) => setName(e.target.value)}
            />
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              name="room"
              label="Room Name"
              type="room"
              id="room"
              autoComplete="current-room"
              onChange={(e) => setRoom(e.target.value)}
            />
            <Link onClick={e => shouldDisableEnterButton ? e.preventDefault() : null} to={`/game?name=${name}&room=${room}`} style={{ textDecoration: 'none' }}>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                className={classes.submit}
                disabled={shouldDisableEnterButton}
              >
                Enter Game Room
              </Button>
            </Link>
          </form>
        </div>
    </div>
  );
}

export default Join;