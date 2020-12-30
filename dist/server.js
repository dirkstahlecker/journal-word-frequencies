"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const path_1 = __importDefault(require("path"));
const express_fileupload_1 = __importDefault(require("express-fileupload"));
const parser_1 = require("./parser");
const body_parser_1 = __importDefault(require("body-parser"));
//tslint:disable
const Sequelize = require('sequelize');
// tslint:enable
const queries_1 = require("./queries");
const app = express_1.default();
/////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////
// Don't touch the following - Heroku gets very finnicky about it
// Serve static files from the React app
app.use(express_1.default.static(path_1.default.join(__dirname, 'client/build')));
app.use(express_1.default.json()); // to support JSON-encoded bodies
app.use(express_1.default.urlencoded()); // to support URL-encoded bodies
app.use(express_fileupload_1.default());
app.use(body_parser_1.default.json());
app.use(body_parser_1.default.urlencoded({
    extended: true,
}));
/////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////
///////////////////
// Database
app.get('/getNames', queries_1.getNames);
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
    console.log("/test");
    res.json({ message: "Journal Word Frequencies" });
});
app.post('/journal/upload', (req, res) => {
    console.log('/journal/upload');
    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).send('No files were uploaded.');
    }
    // need to convert the data to text
    const fileText = req.files.file.data.toString('utf8');
    console.log(fileText);
    parser_1.Parser.parse(fileText);
});
/////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////
// Don't touch the following - Heroku gets very finnicky about it
const root = path_1.default.join(__dirname, '..', 'client', 'build');
app.use(express_1.default.static(root));
app.get("*", (req, res) => {
    res.sendFile('index.html', { root });
});
const port = process.env.PORT || 5000;
app.listen(port, () => {
    console.log(`server started on port ${port}`);
});
/////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////
//# sourceMappingURL=server.js.map