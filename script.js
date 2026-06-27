const background = document.getElementById("background");
const details = document.getElementById("details");
const days = document.getElementById("days");
const hours = document.getElementById("hours");
const minutes = document.getElementById("minutes");
const seconds = document.getElementById("seconds");

let Countdown;
let launches = [];
let currentLaunch = 0;

console.log("bfr fetch");

async function getNextLaunch() {
    try {
        const response = await fetch(
            "https://ll.thespacedevs.com/2.3.0/launches/upcoming/?limit=4&hide_recent_previous=true"

        );
        const data = await response.json();
        console.log(data);

        launches = data.results;
        currentLaunch = 0;

        setLaunch(currentLaunch);

    } catch (err) {
        details.textContent = "Unable to fetch launch data. ";
        console.error(err);
    }
}

function setLaunch(i) {
    const launch = launches[i];

    Countdown = new Date(launch.net);
    details.textContent = `${launch.name}\nby${launch.launch_service_provider.name}`;

}

function updateCountdown() {

    if (!Countdown) return;

    const now = new Date();
    console.log("now", now);

    let diff = Countdown - now;
    console.log("diff", diff);
    if (diff <= 0) {
        currentLaunch++;
        setLaunch(currentLaunch);
        return;

    }
    const d = Math.floor(diff / (1000 * 60 * 60 * 24));
    diff = diff % (1000 * 60 * 60 * 24);
    console.log("d", d);

    const h = Math.floor(diff / (1000 * 60 * 60))
    diff = diff % (1000 * 60 * 60);
    console.log("h", h);

    const m = Math.floor(diff / (1000 * 60));
    diff = diff % (1000 * 60);
    console.log("m", m);

    const s = Math.floor(diff / 1000);
    console.log("s", s);

    days.textContent = `${d}D`;
    hours.textContent = `${h}h`;
    minutes.textContent = `${m}m`;
    seconds.textContent = `${s}s`;
}

async function init() {
    await getNextLaunch();
    updateCountdown();

    setInterval(getNextLaunch, 600000);
    setInterval(updateCountdown, 1000);
}
init();