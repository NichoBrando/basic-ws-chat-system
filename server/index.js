const yup = require('yup');
const express = require('express');
const app = express();
const expressWs = require('express-ws')(app);

const messageSchema = yup.object().shape({
  sender: yup.string().trim().required(),
  message: yup.string().trim().required()
});

app.ws('/', function(ws, req) {
  ws.on('message', function(msg) {
    messageSchema.isValid(JSON.parse(msg)).then((isValid) => {
      if(isValid){
        const clients = expressWs.getWss('/').clients;
        clients.forEach((client) => {
          client.send(msg);
        })
      }
    })
  });
});

app.listen(3001);