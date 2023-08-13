// Variables para controlar el cronómetro y laps
let startTime = 0;
let pausedTime = 0;
let interval;
let laps = [];
let isRunning = false;

// Elementos del DOM
const timerDisplay = document.getElementById('timer');
const startStopButton = document.getElementById('startStop');
const lapButton = document.getElementById('lap');
const resetButton = document.getElementById('reset');
const exportLink = document.getElementById('export');

// Función para formatear el tiempo en formato HH:MM:SS:ms --> Horas:Minutos:Segundos:Milisegundos
function formatTime(ms) {
  const date = new Date(ms);
  const hours = date.getUTCHours().toString().padStart(2, '0');
  const minutes = date.getUTCMinutes().toString().padStart(2, '0');
  const seconds = date.getUTCSeconds().toString().padStart(2, '0');
  const milliseconds = date.getUTCMilliseconds().toString().padStart(3, '0');
  
  return `${hours}:${minutes}:${seconds}:${milliseconds}`;
}

// Función para actualizar el cronómetro
function updateTimer() {
  const now = Date.now();
  const elapsed = now - (startTime + pausedTime);
  timerDisplay.textContent = formatTime(elapsed);
}

// Evento para el botón "Iniciar/Parar"
startStopButton.addEventListener('click', () => {
  if (!isRunning) {
    console.log('pausado');
    startTime = Date.now() - pausedTime;
    clearInterval(interval);
    interval = setInterval(updateTimer, 1);
    startStopButton.textContent = 'Parar';
    isRunning = true;
  } else {
    console.log('pausedTime, ' + pausedTime);
    pausedTime = Date.now() - startTime; // Guardar el tiempo pausado
    console.log('pausedTime, ' + pausedTime);
    clearInterval(interval);
    startStopButton.textContent = 'Continuar';
    isRunning = false;
  }
});

// Evento para el botón "Lap"
lapButton.addEventListener('click', () => {
  if (isRunning) {
    laps.push({ time: Date.now() - startTime });
    updateLaps(); // Llama a la función para actualizar los laps en pantalla
  }
});

// Evento para el botón "Resetear"
resetButton.addEventListener('click', () => {
  clearInterval(interval);
  timerDisplay.textContent = '00:00:00:000';
  laps = [];
  updateLaps(); // Llama a la función para actualizar los laps en pantalla
  startStopButton.textContent = 'Iniciar';
  isRunning = false;
});

// Elemento del DOM para mostrar los laps en pantalla
const lapsDisplay = document.getElementById('laps');

// Función para actualizar los laps en pantalla
function updateLaps() {
  lapsDisplay.innerHTML = laps.map((lap, index) => `<p>Lap ${index + 1}: ${formatTime(lap.time)}</p>`).join('');
}

// Evento para el botón "Exportar"
exportLink.addEventListener('click', () => {
  const csvContent = "Tiempo (HH:MM:SS:MS),Tiempo en Milisegundos\n" +
    laps.map(lap => `${formatTime(lap.time)},${lap.time / 1}`).join('\n');
  
  const blob = new Blob([csvContent], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  exportLink.href = url;
  exportLink.download = 'laps.csv';
});
