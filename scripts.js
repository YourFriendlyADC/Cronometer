// Variables para controlar el cronómetro y laps
let startTime1 = 0;
let pausedTime1 = 0;
let startTime2 = 0;
let pausedTime2 = 0;
let interval;
let laps = [];
let isRunning = false;

// Elementos del DOM
const timerDisplay1 = document.getElementById('timer-1');
const timerDisplay2 = document.getElementById('timer-2');
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
  const elapsed1 = now - (startTime1 + pausedTime1);
  const elapsed2 = now - (startTime2 + pausedTime2);
  timerDisplay1.textContent = formatTime(elapsed1);
  timerDisplay2.textContent = formatTime(elapsed2);
}

// Evento para el botón "Iniciar/Parar"
startStopButton.addEventListener('click', () => {
  if (!isRunning) {
    if (pausedTime1 === 0) {
      startTime1 = Date.now();
      startTime2 = Date.now();
    } else {
      startTime1 = Date.now() - pausedTime1;
      pausedTime1 = 0; // Reset pausedTime when resuming
      startTime2 = Date.now() - pausedTime2;
      pausedTime2 = 0;
    }
    clearInterval(interval);
    interval = setInterval(updateTimer, 1);
    startStopButton.textContent = 'Parar';
    isRunning = true;
  } else {
    pausedTime1 = Date.now() - startTime1 + pausedTime1; // Guardar el tiempo pausado
    pausedTime2 = Date.now() - startTime2 + pausedTime2; // Guardar el tiempo pausado
    clearInterval(interval);
    startStopButton.textContent = 'Continuar';
    isRunning = false;
  }
});

// Evento para el botón "Lap"
lapButton.addEventListener('click', () => {
  if (isRunning) {
    laps.push({ time: Date.now() - startTime1});
    updateLaps(); // Llama a la función para actualizar los laps en pantalla
    startTime1 = Date.now();
  }
});

// Evento para el botón "Resetear"
resetButton.addEventListener('click', () => {
  clearInterval(interval);
  timerDisplay1.textContent = '00:00:00:000';
  timerDisplay2.textContent = '00:00:00:000';
  laps = [];
  updateLaps(); // Llama a la función para actualizar los laps en pantalla
  startStopButton.textContent = 'Iniciar';
  isRunning = false;
  startTime1 = 0;
  pausedTime1 = 0;
  startTime2 = 0;
  pausedTime2 = 0;
});

// Elemento del DOM para mostrar los laps en pantalla
const lapsDisplay = document.getElementById('laps');

// Función para actualizar los laps en pantalla
function updateLaps() {
  lapsDisplay.innerHTML = laps.map((lap, index) => `<p>Lap ${index + 1}: ${formatTime(lap.time)}</p>`).join('');
}

// Evento para el botón "Exportar"
exportLink.addEventListener('click', () => {
  const csvContent = "Tiempo (HH:MM:SS:MS),Tiempo en Segundos\n" +
    laps.map(lap => `${formatTime(lap.time)},${lap.time / 1000}`).join('\n');
  
  const blob = new Blob([csvContent], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  exportLink.href = url;
  exportLink.download = 'laps.csv';
});
