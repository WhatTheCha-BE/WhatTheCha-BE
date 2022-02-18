const express = require('express');
const app = express();

const cors = require('cors')

const port = 5000;


app.use(express.urlencoded({ extened: false }));
app.use(express.json());

app.listen(port, () => {
    console.log(`listening at http://localhost:${port}`);
});
