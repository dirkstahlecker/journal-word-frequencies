import express from 'express';
import path from 'path';
import fileUpload from 'express-fileupload';
import { Client } from 'pg';
import { Parser } from './parser';
import { AnyOperator } from 'sequelize/types';
import bodyParser from 'body-parser';
//tslint:disable
const Sequelize = require('sequelize');
// tslint:enable
import {getNames} from "./queries";

const app = express();

/////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////
// Don't touch the following - Heroku gets very finnicky about it

// Serve static files from the React app
app.use(express.static(path.join(__dirname, 'client/build')));
app.use(express.json());       // to support JSON-encoded bodies
app.use(express.urlencoded()); // to support URL-encoded bodies
app.use(fileUpload());

app.use(bodyParser.json())
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
)

/////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////




///////////////////
// Database


app.get('/getNames', getNames);

console.log("Database URL: ");
console.log(process.env.DATABASE_URL);


// const sequelize = new Sequelize('postgres://localhost:5432/dbname')

// sequelize.authenticate()
// .then(() => {
//   console.log('Connection has been established successfully.');
// })
// .catch((err: any) => {
//   console.error('Unable to connect to the database:', err);
// });


// const client = new Client({
//   connectionString: process.env.DATABASE_URL || 'postgres://localhost:5000/journal-word-frequencies',
//   ssl: true
// });

// client.connect();

// client.query('SELECT table_schema,table_name FROM information_schema.tables;', (err, res) => {
//   if (err)
//   {
//     throw err;
//   }

//   console.log("DATABASE STUFF:");
//   for (const row of res.rows)
//   {
//     console.log(JSON.stringify(row));
//   }
//   client.end();
// });
///////////////////




app.get("/test", (req, res) => {
  console.log("/test")
  res.json({message: "Journal Word Frequencies"});
})

app.post('/journal/upload', (req, res) => {
  console.log('/journal/upload');

  if (!req.files || Object.keys(req.files).length === 0)
  {
    return res.status(400).send('No files were uploaded.');
  }

  // need to convert the data to text
  const fileText: string = (req.files.file as any).data.toString('utf8');
  console.log(fileText);

  Parser.parse(fileText);
});


/////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////
// Don't touch the following - Heroku gets very finnicky about it

const root = path.join(__dirname, '..', 'client', 'build')
app.use(express.static(root));
app.get("*", (req, res) => {
    res.sendFile('index.html', { root });
})

const port = process.env.PORT || 5000;
app.listen(port, () => {
	console.log(`server started on port ${port}`)
});

/////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////