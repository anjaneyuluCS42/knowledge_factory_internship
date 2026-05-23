const form = document.querySelector(".search-form");
const globe = document.querySelector(".globe");

form.addEventListener("submit", () => {

    globe.style.animation = "rotateGlobe 1s linear infinite";

    setTimeout(() => {
        globe.style.animation = "rotateGlobe 5s linear infinite";
    }, 4000);
});
