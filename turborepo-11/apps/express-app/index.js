const express = require('express');

const app = express();
app.get('/', (req, res) => res.send('🚀 Express API running in Turborepo!'));

app.listen(3001, () => console.log('API running on port 3001'));