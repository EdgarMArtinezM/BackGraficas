const express = require("express");
const { createServer } = require("http");
const { Server } = require("socket.io");

const app = express();
const httpServer = createServer(app);

var LAST_HUM = 50;
var LAST_TEMP = 17.5;

const TEMP_LIMITS = [10, 25];
const HUM_LIMITS = [30, 70];

const io = new Server(httpServer, { cors: {
    origin: "http://localhost:4200",
    allowedHeaders: ["my-custom-header"],
    credentials: true
} });

io.on('connection', function(socket) {
    console.log("socket connected", socket.id);
    setInterval(() => {
        getDataAndSend();
    }, 60000);
});

httpServer.listen(3000,()=>{
    console.log("Escuchando en el puerto 3000")
});

function getDataAndSend() {
    io.emit('iot/sensors', {
        sensor: "HUM",
        value: generateData("HUM")
    });
    io.emit('iot/sensors', {
        sensor: "TEMP",
        value: generateData("TEMP")
    });
}

function generateData(type) {
    var sig = Math.random() > .5 ? 1 : -1;
    var value = sig * parseFloat(Math.random().toFixed(1));
    if (type == "TEMP") {
        if (LAST_TEMP + value >= TEMP_LIMITS[0] && LAST_TEMP + value <= TEMP_LIMITS[1]) LAST_TEMP += value;
        else LAST_TEMP -= value;
        return LAST_TEMP;
    }
    if (type == "HUM") {
        if (LAST_HUM + value >= HUM_LIMITS[0] && LAST_HUM + value <= HUM_LIMITS[1]) LAST_HUM += value;
        else LAST_HUM -= value;
        return LAST_HUM;
    }
    return 0;
}

