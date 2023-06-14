#!/usr/bin/env node
//const tz = require ('moment-timezone')
import mt from 'moment-timezone';
const args = process.argv.slice(2)

// console.log('args',process.argv,args)
//process.abort()
function showhelp() {
    console.log("Usage: galosh.js [options] -[n|s] LATITUDE -[e|w] LONGITUDE -z TIME_ZONE")
    console.log("-h            Show this help message and exit.")
    console.log("-n, -s        Latitude: N positive; S negative.")
    console.log("-e, -w        Longitude: E positive; W negative.")
    console.log("-z            Time zone: uses tz.guess() from moment-timezone by default.")
    console.log("-d 0-6        Day to retrieve weather: 0 is today; defaults to 1.")
    console.log("-j            Echo pretty JSON from open-meteo API and exit.")
}

//showhelp()

let exitCode = 1;

if (args.length == 0) {
    console.log("no arguments")
}
let counter = 0;
let latitude;
let longitude;
let timezone = mt.tz.guess();
let day = 1
let prettyprint = false
for (const arg of args) {
    if (arg === '-h') {
        showhelp();
        exitCode = 0

    }
    if (arg == `-n`) {
        latitude = parseFloat(args[counter + 1])
    }
    if (arg == `-s`) {
        latitude = -parseFloat(args[counter + 1])
    }
    if (arg == `-e`) {
        longitude = +parseFloat(args[counter + 1])
    }
    if (arg == `-w`) {
        longitude = -parseFloat(args[counter + 1])
    }
    if (arg == `-z`) {
        timezone = args[counter + 1]
    }
    if (arg == `-d`) {
        day = +args[counter + 1]
        if (day > 6 || day < 0) {
            console.log("day must be a number from 0 to 6")
            exitCode = 1
        }
    }
    if (arg == `-j`) {
        prettyprint = true
    }

    counter++;
}
// getweather(latitude, longitude, timezone, day, prettyprint)
console.log({latitude,longitude,timezone,day})

function getweather(latitude, longitude, timezone, day, prettyprint) {
    // get start and end dates
    const start_date = mt().add(day, "day").format('YYYY-MM-DD')
    const end_date = mt().add(day, "day").format('YYYY-MM-DD')

    fetch(`https://api.open-meteo.com/v1/forecast?start_date=${start_date}&end_date=${end_date}&latitude=${latitude}&longitude=${longitude}&hourly=temperature_2m&current_weather=true&timezone=${timezone}`)
        .then(
            (result) => {
                result.json()
                    .then(
                        (data) => {
                            if (prettyprint) {
                                console.log(JSON.stringify(data, null, 2))
                            }
                            else {
                                console.log(data)
                            }
                            process.exit(0)
                        }
                    )
                    .catch((error) => {
                        console.log(error)
                        process.exit(1)
                    })
            }
        ).catch((error) => {
            console.log(error)
            process.exit(1)
        })
}

