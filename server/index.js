const express = require("express")
const app = express();
const server = require("http").Server(app);
const io = require("socket.io")(server);
const cron = require('node-cron');
const moment = require('moment-timezone');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const path = require('path');
const fs = require('fs');

const {
  dbModels: {
    getModel,
    createModel,
    updateModel,
    getModelFromString,
  },
  getJwtToken,
} = require('./helpers');

const {
  __JWTKEY,
  __STARTINGCREDITS,
  __SALTROUNDS,
  __PORT,
  __MONGO_CONNECTION,
} = require('./config.js');

mongoose.connect(__MONGO_CONNECTION, { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
  console.log('CONNECTED MONGO!');
  console.log('Listening on: ' + __PORT);
});

io.on("connection", function (socket) {
  socket.on("message", function (data) {
    console.log(data);
  });
});

process.env.TZ = 'America/Buenos_Aires';

//PARA CREAR LOS CRONES DESPUES!!
// for (let subasta of subastas) {
//   const date = moment(subasta.dateString).tz("America/Buenos_Aires");
//   const cronStamp = `${date.minutes()} ${date.hours()} ${date.date()} ${date.month() + 1} *`;
//   cron.schedule(cronStamp, () => {
//     app.get("/lala", function (req, res) {
//       return res.status(200).send();
//     });
//   });
// }

server.listen(__PORT);
app.use(require('body-parser').json());
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method"
  );
  res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, DELETE");
  res.header("Allow", "GET, POST, OPTIONS, PUT, DELETE");
  res.header("Content-Type", "application/json");
  next();
});

app.get("/getSubastas", async (req, res) => {
  let subastas = await getModel('subastas');
  subastas.filter(subasta => (Date.parse(subasta.dateString) > Date.now()) || subasta.status === 'PENDING')
  return res.status(200).send(subastas);
});

app.post("/raiseSubasta", (req, res) => {
  jwt.verify(req.body.jwtToken, __JWTKEY, async (err) => {
    if (err) {
      console.log('ERROR: Could not connect to the protected route');
      res.sendStatus(403);
    } else {
      const { userAmount, email, name } = req.body;
      console.log('--- Body ----');
      console.log(req.body);
      try {
        const user = await getModel('users', { email });
        const subasta = await getModel('subastas', { _id: req.body.id });

        const subastaData = {
          amount: Number.parseInt(userAmount) + Number.parseInt(subasta.amount),
          winnerId: user._id
        };

        const creditsUsed = (user.creditsUsed || 0) +  Number.parseInt(userAmount);
        const userData = { creditsUsed };

        // 1) Update subasta in mongo
        updateModel('subastas', { _id: req.body.id }, subastaData);
        // 2) Update
        updateModel('users', { email }, userData);
        // 3) Update in all the fronts
        io.sockets.emit(`raise-${req.body.id}`, amount, email, name);
        res.status(200).send({ creditsUsed });
      } catch (error) {
        res.status(500).send();
      }
    }
  })
});

app.get("/newSorteo", async (req, res) => {
  await createModel('subastas', {
    title: "Subasta 1",
    dateString: "2019-12-25T18:09:00",
    amount: 3748,
    status: "PENDING"
  });
  res.status(200).send();
});

app.get("/getSorteos", async (req, res) => {
  const sorteos = await getModel('sorteos');
  res.status(200).send(sorteos);
});

app.get("/getUserData", async (req, res) => {
  const email = req.query.email;
  const password = req.query.password;

  if (!email) return res.status(500).send();

  const userData = await getModel('users', { email });

  if (!userData) return res.status(404).send();

  const jwtToken = await getJwtToken(email);

  const { name, surname, credits, creditsUsed, googleData, sorteos, subastas } = userData;
  if (userData) {
    const responseData = {
      name,
      surname,
      email,
      credits,
      creditsUsed,
      googleData,
      sorteos,
      subastas,
      jwtToken,
    };

    if (password) {// Normal Login
      bcrypt.compare(password, userData.password, function (err, passIsCorrect) {
        if (passIsCorrect) {
          return res.status(200).send(responseData);
        } else {
          return res.status(401).send();
        }
      });
    } else {// Google login
      return res.status(200).send(responseData);
    }
  } else {
    return res.status(404).send();
  }
});

app.post("/suscribeToSorteo", (req, res) => {
  jwt.verify(req.body.jwtToken, __JWTKEY, async (err) => {
    if (err) {
      console.error(err);
      console.log('ERROR: Could not connect to the protected route');
      res.sendStatus(403);
    } else {
      const { email, sorteoId } = req.body;
      const user = await getModel('users', { email });
      const sorteos = user.sorteos || {};
      const sorteo = await getModel('sorteos', { _id: sorteoId });
      sorteos[sorteoId] = sorteo;

      let status;
      try {
        await updateModel('users', { email }, { sorteos });
        status = 200;
      } catch (error) {
        console.error(error);
        res.status(500).send();
        status = 500;
      }

      res.status(status).send();
    }
  })
});

app.post("/unSuscribeToSorteo", async (req, res) => {
  jwt.verify(req.body.jwtToken, __JWTKEY, async (err, authorizedData) => {
    if (err) {
      console.log('ERROR: Could not connect to the protected route');
      res.sendStatus(403);
    } else {
      const { email, sorteoId } = req.body;
      const userModel = getModelFromString('users');

      let status;
      try {
        const updated = await userModel.updateOne({ email }, { $unset: { [`sorteos.${sorteoId}`]: "" } });

        if (updated.nModified === 0) {
          status = 204;
        } else {
          status = 200;
        }
      } catch (error) {
        console.error(error);
        status = 500;
      }

      res.status(status).send();
    }
  })
});

app.post("/createAccount", async (req, res) => {
  // QUEDA PENDIENTE INVESTIGAR COMO MANTENER LA SESION INICIADA SIN GOOGLE!!!
  // NODE SESSIONS.
  const { email, password } = req.body;

  bcrypt.genSalt(__SALTROUNDS, function (err, salt) {
    bcrypt.hash(password, salt, async (err, hash) => {
      const data = {
        email,
        password: hash,
        credits: __STARTINGCREDITS,
      }

      if (createModel('users', data)) {
        const jwtToken = await getJwtToken(email);

        res.status(200).send({
          ...data,
          jwtToken,
          email: data.email,
          credits: data.credits,
        });
      } else {
        res.status(204).send();
      }
    });
  });
});

app.post("/createAccountFromGoogle", async (req, res) => {
  const { email, name, surname, googleData } = req.body;

  const data = {
    email,
    name,
    surname,
    googleData,
    credits: __STARTINGCREDITS,
  }

  if (createModel('users', data)) {
    const jwtToken = await getJwtToken(email);

    res.status(200).send({
      ...data,
      jwtToken,
      email: data.email,
      credits: data.credits,
      googleData: data.googleData,
    });
  } else {
    res.status(204).send();
  }
});

app.post("/updateUser", (req, res) => {
  jwt.verify(req.body.jwtToken, __JWTKEY, async (err) => {
    if (err) {
      console.log('ERROR: Could not connect to the protected route');
      res.sendStatus(403);
    } else {
      const { queryEmail, name, surname, email } = req.body;
      let status;
      try {
        updateModel('users', { email: queryEmail }, { name, surname, email });
        status = 200;
      } catch (error) {
        console.error(error);
        status = 500;
      }

      res.status(status).send();
    }
  })
});

app.post("/process-payment", (req, res) => {
  console.log(req.body);
});

app.get('/', function (req, res) {
  res.header('Content-Type', 'text/html; charset=utf-8');
  const buildPath = path.resolve(`${__dirname}/../web/build`);
  // No me funciono el buildPath por eso tuve que crear la ruta * para traer todos los recursos.
  // app.use(express.static(buildPath));
  res.sendFile(`${buildPath}/index.html`);
});

app.get('*', function (req, res) {
  const buildPath = path.resolve(`${__dirname}/../web/build`);
  const extension = path.extname(req.url);
  const name = req.url.split('/').pop();
  const filePath = buildPath + req.url;
  const file = fs.readFileSync(filePath)

  try {
    switch (extension) {
      case '.js':
        res.setHeader("Content-Type", 'application/javascript');
        res.write(file);
        return res.end();
      case '.css':
        res.setHeader("Content-Type", 'text/css');
        res.write(file);
        return res.end();
      case '.png':
        res.setHeader("Content-Type", 'image/png');
        res.write(file);
        return res.end();
      case '.jpg':
        res.setHeader("Content-Type", 'image/jpeg');
        res.write(file);
        return res.end();
      case '.html':
        res.setHeader("Content-Type", 'text/html; charset=utf-8');
        res.write(file);
        return res.end();
      default:
        fs.exists(filePath, function (exists) {
          if (exists) {
            res.setHeader("Content-Type", 'text/plain');
            res.write(fs.readFileSync(filePath));
            return res.end();
          }

          return res.status(404).send();
        });

        break;
    }
  } catch (error) {
    console.error(error);
    return res.status(404).send();
  }
});