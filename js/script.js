let points = localStorage.getItem("points") || 0;

const pointsDisplay = document.getElementById("points-count");

document.getElementById("yap-btn").onclick = () => {
    points++;
    localStorage.setItem("points", points);
    pointsDisplay = points;
}