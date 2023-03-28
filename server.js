const fs = require('fs/promises')
const http = require('http');
const path = require('path');
const hostname = '127.0.0.1';

const serviceObj = require("./services");
const bannerObj = require("./banner");
const carouselObj = require("./carousel");

function getRequestData(request) {
    if (request.url === '/services') {
        return JSON.stringify(serviceObj);
    }
    else if (request.url === '/banner') {
        return JSON.stringify(bannerObj);
    }
    else if (request.url === '/carousel') {
        return JSON.stringify(carouselObj);
    }
    else if (request.url === '/bookHotel') {
        return JSON.stringify(carouselObj);
    }
    else
        console.log("Can't find data");
}

const ourServer = http.createServer((request, response) => {
    try {
        response.setHeader("Access-Control-Allow-Origin", "*");
        response.setHeader("Access-Control-Allow-Headers", "*");
        const formData = [];
        request.on("data", (chunk) => {
            formData.push(chunk);
        });
        request.on("end", () => {
            let totalFormData = Buffer.concat(formData).toString();
            if (totalFormData.length > 0) {
                async function formDetails() {
                    const dataFromFile = await fs.readFile("./form-data.txt", "utf8");
                    let arr = [];
                    if (dataFromFile) {
                        arr = JSON.parse(dataFromFile);
                        arr.push(totalFormData);
                        console.log("formData", arr);
                    }
                    else {
                        arr.push(totalFormData);
                        console.log("formData", arr);
                    }
                    await fs.writeFile("./form-data.txt", JSON.stringify(arr));
                }
                formDetails();
            }
        });
        response.end(getRequestData(request));
    }
    catch (err) {
        console.log(err);
    }
});

let port = 8081
ourServer.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
})