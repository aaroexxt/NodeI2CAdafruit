const driver = require("./controller.js");

const device = new driver(26, process.argv[2] == "true");

device.begin();