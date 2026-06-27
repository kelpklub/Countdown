const background = document.getElementById("background");
const details = document.getElementById("details");
const days = document.getElementById("days");
const hours = document.getElementById("hours");
const minutes = document.getElementById("minutes");
const seconds = document.getElementById("seconds");
let Countdown;
console.log("bfr fetch");
async function getNextLaunch() {
    try {
        const response = await fetch(
            "https://ll.thespacedevs.com/2.3.0/launches/upcoming/?limit=1"

        );
        const data = await response.json();
        console.log(data.results[0].name);
        const launch = data.results[0];
        Countdown = new Date(launch.net);
        details.textContent = `${launch.name} \n by ${launch.launch_service_provider.name}`;
    } catch (err) {
        details.textContent = "Unable to fetch launch data. ";
        console.error(err);
    }
}

getNextLaunch();