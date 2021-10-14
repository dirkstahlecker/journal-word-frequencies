"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const path_1 = __importDefault(require("path"));
const express_fileupload_1 = __importDefault(require("express-fileupload"));
const parser_1 = require("./parser");
// import bodyParser from 'body-parser';
//tslint:disable
const Sequelize = require('sequelize');
// tslint:enable
const queries_1 = require("./queries");
const app = (0, express_1.default)();
/////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////
// Don't touch the following - Heroku gets very finnicky about it
// Serve static files from the React app
app.use(express_1.default.static(path_1.default.join(__dirname, 'client/build')));
app.use(express_1.default.json()); // to support JSON-encoded bodies
app.use(express_1.default.urlencoded()); // to support URL-encoded bodies
app.use((0, express_fileupload_1.default)());
// app.use(bodyParser.json())
// app.use(
//   bodyParser.urlencoded({
//     extended: true,
//   })
// )
/////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////
///////////////////
// Database
// app.get('/api/getNames', getNames);
app.get('/api/displayName/all', queries_1.getAllDisplayNamesEndpoint);
app.get('/api/displayName/:dName', queries_1.getFullNamesForDisplayNameEndpoint);
app.get('/api/fullNames/all', queries_1.getAllFullNamesEndpoint);
app.post('/api/displayName/add', queries_1.newDisplayNameEndpoint);
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