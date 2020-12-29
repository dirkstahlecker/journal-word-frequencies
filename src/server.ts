import express from 'express';
import path from 'path';
import bodyParser from 'body-parser';
import fileUpload from 'express-fileupload';

const app = express();

/////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////
// Don't touch the following - Heroku gets very finnicky about it

// Serve static files from the React app
app.use(express.static(path.join(__dirname, 'client/build')));
app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
}));
app.use(express.json());       // to support JSON-encoded bodies
app.use(express.urlencoded()); // to support URL-encoded bodies
app.use(fileUpload());

/////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////


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

  console.log(req.files.file);
});

// // The "catchall" handler: for any request that doesn't
// // match one above, send back React's index.html file.
// app.get('*', (req, res) => {
//     res.sendFile(path.join(__dirname+'/client/build/index.html'));
//   });



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