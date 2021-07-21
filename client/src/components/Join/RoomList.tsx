import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Avatar from '@material-ui/core/Avatar';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import Paper from '@material-ui/core/Paper';
import { ListSubheader } from '@material-ui/core';

type userType = {
  userName: string,
  roomNumber: number;
}

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    maxWidth: 700,
    backgroundColor: theme.palette.background.paper,
  },
  avatar: {
    marginRight: theme.spacing(3),
    backgroundColor: theme.palette.secondary.main,
  },
  listItemRoot: {
    marginLeft: theme.spacing(3),
    marginRight: theme.spacing(3),
  }
}));

const generateList = (numberOfItems: number) => {
  var tempList: Array<userType> = []
  for (let i = 0; i < numberOfItems; i++) {
    tempList.push({
      userName: `Test User ${i + 1}`,
      roomNumber: i + 1,
    })
  }
  return tempList;
}

const ListHeader = (
  <ListSubheader color='primary' >
    Available Rooms
  </ListSubheader>
)

export default function RoomList() {
  const classes = useStyles();

  return (
    <Paper elevation={6} style={{maxHeight: 700, maxWidth: 500, overflow: 'auto'}}>
      <List className={classes.root} subheader={ListHeader}>
        {generateList(10).map((user) => (
          <ListItem className={classes.listItemRoot} key={user.roomNumber}>
            <ListItemAvatar >
              <Avatar className={classes.avatar}>
                <AccountCircleIcon />
              </Avatar>
            </ListItemAvatar>
            <ListItemText primary={user.userName} secondary={`Room Number: ${user.roomNumber}`} />
          </ListItem>
        ))}
      </List>
    </Paper>
  );
}