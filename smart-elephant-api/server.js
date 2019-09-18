const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app =  express();

app.use(bodyParser.json());
app.use(cors());

const dataBase = {
  users: [
      {
      id: '123',
      name: 'salif',
      email: 'salif@gmail.com',
      password: '123',
      entries: 0,
      joined: new Date()
    },
      {
      id: '234',
      name: 'madou',
      email: 'madou@gmail.com',
      password: '234',
      entries: 0,
      joined: new Date()
    },
      {
      id: '567',
      name: 'issa',
      email: 'issa@gmail.com',
      password: '567',
      entries: 0,
      joined: new Date()
    }
  ]
  // login:[
  //   {
  //     id: '123',
  //     hash: '',
  //     email: 'salif@gmail.com'
  //   }
  // ]
};
app.get('/', (req, res) =>{
  res.json(dataBase.users);
})

app.post('/register', (req, res) => {

  const {name, email, password } = req.body;
  dataBase.users.push({
    id: '890',
    name: name,
    email: email,
    password: password,
    entries: 0,
    joined: new Date()
  })
  res.json(dataBase.users[dataBase.users.length-1]);
});

app.post('/signin', (req, res) => {
  if(req.body.email === dataBase.users[0].email){
    res.json('succes');
  } else {
    res.status(400).json('error during login ')
  }
})

app.get('/profile/:id', (req, res) => {
  const { id } = req.params;
  let found = false;
  dataBase.users.forEach(user => {
    if (user.id === id ){
      found = true;
      return res.json(user);
    }
  })
  if(!found){
     res.status(404).json('no such user');
  }
})

app.put('/image', (req, res) => {
  const { id } = req.body;
  let found = false;
  dataBase.users.forEach(user => {
    if (user.id === id ){
      found = true;
      user.entries++
      return res.json(user.entries);
    }
  })
  if(!found){
     res.status(404).json('no such user');
  }
})

app.listen(300, () => {
  console.log('app listening on port 300');
})

//--> res = all works
//signin --> POST = succes, fails
//register --> POST = user
//profile/: userId --> GET user
//image --> PUT --> uer
