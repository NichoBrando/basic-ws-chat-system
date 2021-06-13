import { useEffect, useRef, useState } from "react";
import { List, Paper, ListItem, ListItemText, IconButton, ListItemAvatar, TextField  } from "@material-ui/core";
import styles from './styles';
import { withStyles } from "@material-ui/styles";
import SendIcon from '@material-ui/icons/Send';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';

const App = ({classes}) => {

  const [name, setName] = useState('');
  const [chat, setChat] = useState([]);
  const [message, setMessage] = useState('');
  const wsRef = useRef({});

  useEffect(() => {
    wsRef.current = new WebSocket('ws://localhost:3001');
  }, []);

  const updateChat = (data) => {
    setChat([...chat, data]);
  }
  
  wsRef.current.onmessage = (event) => {
    updateChat(JSON.parse(event.data));
  }

  const sendMessage = () => {
    if(!name || !message){
      return;
    }
    try{
      wsRef.current.send(JSON.stringify({sender: name, message}));
    }
    catch(err){
      return;
    }
  };

  return (
      <Paper className={classes.paper}>
        <List className={classes.messageList}>
          {
            chat.map((item, index) => (
              <ListItem key={index}>
                <ListItemAvatar>
                  <AccountCircleIcon />
                </ListItemAvatar>
                <ListItemText primary={item.sender} secondary={item.message}/>
              </ListItem>
            ))
          }
        </List>
        <div className={classes.newMessage}>
          <TextField
              label="Name"
              value={name} 
              onChange={({target}) => setName(target.value)} 
            />
            <TextField
              className={classes.messageField}
              label="Message"
              value={message} 
              onChange={({target}) => setMessage(target.value)} 
              fullWidth
              style={{margin: '0 20px'}}
            />
            <IconButton onClick={sendMessage}>
              <SendIcon />
            </IconButton>
        </div>
      </Paper>
  );
}

export default withStyles(styles)(App);