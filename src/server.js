const express = require('express')
const app = express()
require('dotenv').config();
const Router = require('./routes/api')
const port = process.env.PORT || 8888;
const hostname = process.env.HOST_NAME || 'localhost';
const cors = require('cors');
const cookieParser = require('cookie-parser');
const http = require('http');
const server = http.createServer(app);
// const { setupSocket, } = require('./socket');
const fs = require('fs');
const path = require('path');
app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization']
}));
// const uploadDir = path.join(__dirname, 'uploads');
// if (!fs.existsSync(uploadDir)) {
//     fs.mkdirSync(uploadDir);
// }
app.use(express.json({ limit: '50mb' }))
app.use(express.urlencoded({ limit: '50mb', extended: true }))

app.use(cookieParser())
// configViewEngine(app);
//khai bao route
// app.use('/', webRoutes);

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use('/', Router)
// app.use('/', routerPass)
app.use((req, res) => {
    return res.send('404 not found')
})
// setupSocket(server);
app.listen(port, hostname, () => {
    console.log(`✅ Server running at http://${hostname}:${port}`);
});