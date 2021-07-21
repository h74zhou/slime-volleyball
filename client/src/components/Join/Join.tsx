import React, { useState } from 'react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import SportsVolleyballIcon from '@material-ui/icons/SportsVolleyball';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import { Link } from 'react-router-dom';

import RoomList from './RoomList';

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
    width: '100%', // Fix IE 11 issue.
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
    <Grid container component="main" className={classes.root}>
      <CssBaseline />
      <Grid item xs={false} sm={4} md={7} style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
        <RoomList/>
      </Grid>
      <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
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
              id="username"
              label="User Name"
              name="username"
              autoComplete="username"
              autoFocus
              onChange={(e) => setName(e.target.value)}
            />
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              name="room"
              label="Room Number"
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
      </Grid>
    </Grid>
  );
}

export default Join;