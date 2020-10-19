const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const port = process.env.PORT || 4000;
const router = require('./api/router');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + '/public'));

router(app);
app.listen(port, () => console.log('listening on port: ' + port));

