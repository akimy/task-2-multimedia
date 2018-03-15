const player = document.querySelector('.video-instance');
const scene = document.querySelector('.scene');
const interface = document.querySelector('.interface');
const rectAvColor = document.querySelector('.av-color__rect');
const [width, height] = [window.innerWidth, window.innerHeight];

const constraints = { audio: true, video: { width, height } };
navigator.mediaDevices.getUserMedia(constraints)
    .then((stream) => { player.src = URL.createObjectURL(stream) })


const ctx = scene.getContext('2d');
const ctxI = interface.getContext('2d');
[scene.width, scene.height] = [width, height];
[interface.width, interface.height] = [width, height];

const rgb = {r: 0, g: 0, b: 0};

function drawScene() {
    let count = 0;
    const imageData = ctx.getImageData(0, 0, width, height)
    const length = imageData.data.length;
    for (let i = 0; i < length; i+= 20) {
        ++count;
        rgb.r += imageData.data[i];
        rgb.g += imageData.data[i+1];
        rgb.b += imageData.data[i+2];

        const rand =  (0.5 - Math.random());
        imageData.data[i] = imageData.data[i] + rand * 255;
        imageData.data[i + 1] = imageData.data[i + 1] + rand * 255;
        imageData.data[i + 2] = imageData.data[i + 2] + rand * 255;
    }
    ctx.putImageData(imageData, 0, 0);
    rgb.r = ~~(rgb.r/count);
    rgb.g = ~~(rgb.g/count);
    rgb.b = ~~(rgb.b/count);
    
    ctx.drawImage(player, 0, 0); 
    requestAnimationFrame(drawScene); 
} 

function componentToHex(c) {
    var hex = c.toString(16);
    return hex.length == 1 ? "0" + hex : hex;
}

function rgbToHex(r, g, b) {
    return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
}

function drawInterface() {
    ctxI.font = "20px OCR-A";
    ctxI.fillStyle = "white";
    ctxI.clearRect(0, 0, 500, 200);
    const hexColor = rgbToHex(rgb.r, rgb.g, rgb.b);
    ctxI.fillText(`AVARAGE_COLOR: ${hexColor}`,10,50);
    ctxI.fillText(`CURR_TIME: ${new Date().getTime()}`, 10, 75);
    ctxI.fillText(`T_4_HUMAN: ${new Date().toDateString()}`, 10, 100);
    rectAvColor.style.fill = hexColor;
    requestAnimationFrame(drawInterface); 
}

drawScene();
drawInterface();