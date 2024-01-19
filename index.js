const http = require("http");
const fs = require("fs");
var requests = require('requests');



const homeFile = fs.readFileSync("home.html", "utf-8");
const replaceVal = (tempval,orgValue)=>{
    let temperature = tempval.replace("{%tempval%}",orgValue.main.temp);
    temperature = temperature.replace("{%location%}",orgValue.name);
    temperature = temperature.replace("{%country%}",orgValue.sys.country);
    temperature = temperature.replace("{%tempmin%}",orgValue.main.temp_min);
    temperature = temperature.replace("{%tempmax%}",orgValue.main.temp_max);
    temperature = temperature.replace("{%temperStatus%}",orgValue.weather.main);

    return temperature;

}
const server = http.createServer((req, res) => {
    if (req.url == "/")
        requests('https://api.openweathermap.org/data/2.5/weather?q=mahesana&appid=74f22a06b8bb8349495c14e4e74f1930&units=metric')
            .on('data',(chunk)=> {

                const objData = JSON.parse(chunk); // Converting JSON to Object
                const arrData = [objData];
                //console.log(arrData[0].main.temp);

                const realTimeData = arrData.map((val)=>replaceVal(homeFile,val)).join("");

                //console.log(realTimeData);
                res.write(realTimeData);
            })
           
            .on('end',(err)=> {
                if (err) return console.log('connection closed due to errors', err);

                res.end();
            });

})

server.listen(8000,"127.0.0.1");

// // Map method se sari API ki value val me aagyi
// homeFile me sari html aagyi and val value se replace krna hai