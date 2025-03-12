document.body.style.backgroundColor = "#121212";
document.body.style.display = "flex";
document.body.style.flexDirection = "column";
document.body.style.justifyContent = "center";
document.body.style.alignItems = "center";
document.body.style.height = "100vh";
document.body.style.margin = "0";
document.body.style.fontFamily = "Arial, sans-serif";

// Crear el título de manera separada
const title = document.createElement("h1");
title.innerText = "Simulación de Colisiones";
title.style.fontSize = "28px";
title.style.fontWeight = "bold";
title.style.color = "#FFD700";
title.style.textShadow = "2px 2px 4px #FF4500";
title.style.marginBottom = "20px";
document.body.appendChild(title);

const theCanvas = document.createElement("canvas");
const ctx = theCanvas.getContext("2d");

theCanvas.width = 900;
theCanvas.height = 600;
theCanvas.style.border = "5px solid #FFD700";
theCanvas.style.borderRadius = "15px";
theCanvas.style.boxShadow = "0 0 20px rgba(255, 215, 0, 0.8)";
theCanvas.style.background = "#1E1E1E";
theCanvas.style.cursor = "pointer";
document.body.appendChild(theCanvas);

function getRandomColor() {
    return `rgb(${Math.random() * 256}, ${Math.random() * 256}, ${Math.random() * 256})`;
}

const collisionSound = new Audio("colision1.mp3");

class Circle {
    constructor(x, y, radius, speed) {
        this.posX = x;
        this.posY = y;
        this.radius = radius;
        this.fillColor = getRandomColor();
        this.dx = (Math.random() > 0.5 ? 1 : -1) * speed;
        this.dy = (Math.random() > 0.5 ? 1 : -1) * speed;
    }
    draw(context) {
        context.beginPath();
        context.fillStyle = this.fillColor;
        context.arc(this.posX, this.posY, this.radius, 0, Math.PI * 2, false);
        context.fill();
        context.closePath();
    }
    update(context) {
        this.draw(context);
        if ((this.posX + this.radius) >= theCanvas.width || (this.posX - this.radius) <= 0) this.dx = -this.dx;
        if ((this.posY + this.radius) >= theCanvas.height || (this.posY - this.radius) <= 0) this.dy = -this.dy;
        this.posX += this.dx;
        this.posY += this.dy;
    }
}

function detectCollisions(circles) {
    for (let i = 0; i < circles.length; i++) {
        for (let j = i + 1; j < circles.length; j++) {
            let dx = circles[i].posX - circles[j].posX;
            let dy = circles[i].posY - circles[j].posY;
            let distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < circles[i].radius + circles[j].radius) {
                let tempDx = circles[i].dx;
                let tempDy = circles[i].dy;
                circles[i].dx = circles[j].dx;
                circles[i].dy = circles[j].dy;
                circles[j].dx = tempDx;
                circles[j].dy = tempDy;
                
                circles[i].fillColor = getRandomColor();
                circles[j].fillColor = getRandomColor();
                
                collisionSound.cloneNode(true).play();
            }
        }
    }
}

let circles = [];
let counter = document.createElement("div");
counter.innerText = `Círculos: ${circles.length}`;
counter.style.color = "white";
counter.style.fontSize = "20px";
counter.style.marginTop = "10px";
document.body.appendChild(counter);

const inputField = document.createElement("input");
inputField.type = "number";
inputField.min = "1";
inputField.value = "5";
inputField.style.margin = "10px";
inputField.style.padding = "10px";
inputField.style.fontSize = "16px";
inputField.style.borderRadius = "10px";
inputField.style.border = "2px solid #FFD700";
inputField.style.backgroundColor = "#2C2C2C";
inputField.style.color = "#FFD700";
document.body.appendChild(inputField);

const generateButton = document.createElement("button");
generateButton.innerText = "Generar Círculos";
generateButton.style.margin = "10px";
generateButton.style.padding = "15px 30px";
generateButton.style.fontSize = "18px";
generateButton.style.backgroundColor = "#FF4500";
generateButton.style.color = "#fff";
generateButton.style.border = "none";
generateButton.style.borderRadius = "10px";
generateButton.style.cursor = "pointer";
generateButton.style.boxShadow = "0 0 10px rgba(255, 69, 0, 0.8)";
document.body.appendChild(generateButton);

generateButton.addEventListener("click", () => {
    let numCircles = parseInt(inputField.value) || 1;
    for (let i = 0; i < numCircles; i++) {
        let radius = Math.floor(Math.random() * 30) + 10;
        let x = Math.random() * (theCanvas.width - 2 * radius) + radius;
        let y = Math.random() * (theCanvas.height - 2 * radius) + radius;
        let speed = 3;
        circles.push(new Circle(x, y, radius, speed));
    }
    counter.innerText = `Círculos: ${circles.length}`;
});

let animationRunning = true;
const pauseButton = document.createElement("button");
pauseButton.innerText = "Pausa";
pauseButton.style.margin = "10px";
pauseButton.style.padding = "15px 30px";
pauseButton.style.fontSize = "18px";
pauseButton.style.backgroundColor = "#FFD700";
pauseButton.style.color = "#121212";
pauseButton.style.border = "none";
pauseButton.style.borderRadius = "10px";
pauseButton.style.cursor = "pointer";
pauseButton.style.boxShadow = "0 0 10px rgba(255, 215, 0, 0.8)";
document.body.appendChild(pauseButton);

pauseButton.addEventListener("click", () => {
    animationRunning = !animationRunning;
    pauseButton.innerText = animationRunning ? "Pausa" : "Reanudar";
});

theCanvas.addEventListener("click", () => {
    let radius = Math.floor(Math.random() * 30) + 10;
    let x = Math.random() * (theCanvas.width - 2 * radius) + radius;
    let y = Math.random() * (theCanvas.height - 2 * radius) + radius;
    let speed = 3;
    circles.push(new Circle(x, y, radius, speed));
    counter.innerText = `Círculos: ${circles.length}`;
});

function updateCircles() {
    if (!animationRunning) return;
    requestAnimationFrame(updateCircles);
    ctx.clearRect(0, 0, theCanvas.width, theCanvas.height);
    detectCollisions(circles);
    circles.forEach(circle => circle.update(ctx));
}

updateCircles();