const picture = document.getElementById("picture");

const details = document.getElementById("details");
const days = document.getElementById("days");
const hours = document.getElementById("hours");
const minutes = document.getElementById("minutes");
const seconds = document.getElementById("seconds");

const flag = document.getElementById("countryflag");
const logo = document.getElementById("agencylogo");

const canvas = document.getElementById("stars");
const ctx = canvas.getContext("2d");

const config = {
    starnum: 300,
    speedmin: 0.05,
    speedmax: 0.2,
    radiusmin: 0.3,
    radiusmax: 1.5,
    alphamin: 0.3,
    alphamax: 0.8,
    glowintensity: 8
};

const starColors = [
    "#ffffff",
    "#ffe9c4",
    "#b5d0ff",
    "#f7f7a8",
    "#c4e1ff",
    "#ffd700",
    "#ffb347"
];

let width = window.innerWidth;
let height = window.innerHeight;
canvas.width = width;
canvas.height = height;
let stars = [];
let animationFrameId;

let Countdown;
let launches = [];
let currentLaunch = 0;
let Countrycode = "";

flag.width = 160;
flag.border = 1;
logo.width = 160;
logo.border = 1;

console.log("before fetch");

async function getNextLaunch() {
    try {
        const response = await fetch(
            "https://ll.thespacedevs.com/2.3.0/launches/upcoming/?limit=4&hide_recent_previous=true"

        );
        const data = await response.json();
        console.log(response.status);

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
    picture.style.backgroundImage = `url("${launch.image.image_url}")`;
    Countdown = new Date(launch.net);
    Countrycode = launch.pad.country.alpha_2_code;
    flag.src = `https://flagcdn.com/w160/${Countrycode.toLowerCase()}.png`;
    flag.alt = `Flag Of ${launch.pad.country.name}`;
    console.log("Countrycode", Countrycode);
    details.textContent = `${launch.name}\nby ${launch.launch_service_provider.name}`;
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

function initstars() {
    for (let i = 0; i < config.starnum; i++) {
        stars.push({
            x: Math.random() * width,
            y: Math.random() * height,
            radius: 2,
            alpha: 1,
            vx: Math.random() * 2,
            vy: Math.random() * 2
        });
    }
}

function animatestars() {
    ctx.clearRect(0, 0, width, height);
    for (const star of stars) {
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,255,255,${star.alpha})`;
        ctx.shadowColor = "#ffff";
        ctx.shadowBlur = config.glowintensity;
        ctx.fill();

        star.x += star.vx;
        star.y += star.vy;

    }
    requestAnimationFrame(animatestars);

}
async function init() {
    initstars();
    await getNextLaunch();
    updateCountdown();
    setInterval(getNextLaunch, 600000);
    setInterval(updateCountdown, 1000);
}
init();
animatestars();