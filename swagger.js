const swaggerAutogen = require("swagger-autogen")();

const doc = {
  info: {
    title: "Wantudy API",
    description: "Description",
  },
  host: "13.209.66.117:8080",
  schemes: ["http"],
};

const outputFile = "./swagger-output.json";
const endpointsFiles = [
  "./server.js"
];

swaggerAutogen(outputFile, endpointsFiles, doc);