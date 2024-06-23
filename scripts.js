let port;
let reader;
const connectButton = document.getElementById('connectButton');

connectButton.addEventListener('click', async () => {
    if ('serial' in navigator) {
        try {
            port = await navigator.serial.requestPort();
            await port.open({ baudRate: 9600 });

            const textDecoder = new TextDecoderStream();
            const readableStreamClosed = port.readable.pipeTo(textDecoder.writable);
            reader = textDecoder.readable.getReader();

            readLoop();
        } catch (error) {
            console.error('Error:', error);
            alert('No se pudo conectar al Arduino. Verifica que esté conectado correctamente.');
        }
    } else {
        alert('Web Serial API no es compatible con este navegador.');
    }
});

async function readLoop() {
    while (true) {
        const { value, done } = await reader.read();
        if (done) {
            reader.releaseLock();
            break;
        }
        updateSensorData(value);
    }
}

function updateSensorData(data) {
    const temperatureElement = document.getElementById('temperature');
    const humidityElement = document.getElementById('humidity');
    const soilMoistureElement = document.getElementById('soil-moisture');

    const tempMatch = data.match(/Temperature:([\d.]+)/);
    const humMatch = data.match(/Humidity:([\d.]+)/);
    const soilMatch = data.match(/SoilMoisture:(\d+)/);

    if (tempMatch) {
        temperatureElement.textContent = tempMatch[1];
    }
    if (humMatch) {
        humidityElement.textContent = humMatch[1];
    }
    if (soilMatch) {
        soilMoistureElement.textContent = soilMatch[1];
    }
}
