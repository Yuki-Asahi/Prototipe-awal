// Variabel global
let components = [];
let wires = [];
let selectedComponent = null;
let isDragging = false;
let isWiring = false;
let wireStartComponent = null;
let wireStartPoint = null;
let offsetX, offsetY;
let nextId = 1;
let scale = 1;
let panX = 0;
let panY = 0;
let currentMode = 'normal';
let simulationSpeed = 1;
let isSimulating = false;

// Path gambar CDN dan fallback base64
const componentImages = {
  battery: 'https://aradzie.github.io/jecs/assets/components/voltage-source.svg',
  resistor: 'https://aradzie.github.io/jecs/assets/components/resistor.svg',
  led: 'https://aradzie.github.io/jecs/assets/components/diode-led.svg',
  switch: 'https://aradzie.github.io/jecs/assets/components/switch.svg',
  ground: 'https://aradzie.github.io/jecs/assets/components/ground.svg',
  capacitor: 'https://aradzie.github.io/jecs/assets/components/capacitor.svg',
  inductor: 'https://aradzie.github.io/jecs/assets/components/inductor.svg',
  diode: 'https://aradzie.github.io/jecs/assets/components/diode.svg',
  acSource: 'https://aradzie.github.io/jecs/assets/components/ac-source.svg',
  voltmeter: 'https://aradzie.github.io/jecs/assets/components/voltmeter.svg',
  ammeter: 'https://aradzie.github.io/jecs/assets/components/ammeter.svg'
};
const componentImagesBase64 = {
  battery: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI4MCIgaGVpZ2h0PSI0MCIgdmlld0JveD0iMCAwIDgwIDQwIj48cmVjdCB3aWR0aD0iODAiIGhlaWdodD0iNDAiIGZpbGw9IiNmZmYiIHN0cm9rZT0iIzAwMCIgc3Ryb2tlLXdpZHRoPSIyIi8+PHRleHQgeD0iMjAiIHk9IjI1IiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTIiPkJhdHRlcnk8L3RleHQ+PGxpbmUgeDE9IjAiIHkxPSIyMCIgeDI9IjEwIiB5Mj0iMjAiIHN0cm9rZT0iIzAwMCIgc3Ryb2tlLXdpZHRoPSIyIi8+PGxpbmUgeDE9IjUiIHkxPSIxNSIgeDI9IjUiIHkyPSIyNSIgc3Ryb2tlPSIjMDAwIiBzdHJva2Utd2lkdGg9IjIiLz48bGluZSB4MT0iNzAiIHkxPSIyMCIgeDI9IjgwIiB5Mj0iMjAiIHN0cm9rZT0iIzAwMCIgc3Ryb2tlLXdpZHRoPSIyIi8+PC9zdmc+',
  resistor: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI4MCIgaGVpZ2h0PSI0MCIgdmlld0JveD0iMCAwIDgwIDQwIj48cmVjdCB4PSIyMCIgeT0iMTAiIHdpZHRoPSI0MCIgaGVpZ2h0PSIyMCIgZmlsbD0iI2ZmZiIgc3Ryb2tlPSIjMDAwIiBzdHJva2Utd2lkdGg9IjIiLz48bGluZSB4MT0iMCIgeTE9IjIwIiB4Mj0iMjAiIHkyPSIyMCIgc3Ryb2tlPSIjMDAwIiBzdHJva2Utd2lkdGg9IjIiLz48bGluZSB4MT0iNjAiIHkxPSIyMCIgeDI9IjgwIiB5Mj0iMjAiIHN0cm9rZT0iIzAwMCIgc3Ryb2tlLXdpZHRoPSIyIi8+PHRleHQgeD0iMjUiIHk9IjI1IiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTIiPlJlc2lzdG9yPC90ZXh0Pjwvc3ZnPg==',
  led: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI4MCIgaGVpZ2h0PSI0MCIgdmlld0JveD0iMCAwIDgwIDQwIj48cG9seWdvbiBwb2ludHM9IjIwLDEwIDYwLDIwIDIwLDMwIiBmaWxsPSIjZmZmIiBzdHJva2U9IiMwMDAiIHN0cm9rZS13aWR0aD0iMiIvPjxsaW5lIHgxPSIwIiB5MT0iMjAiIHgyPSIyMCIgeTI9IjIwIiBzdHJva2U9IiMwMDAiIHN0cm9rZS13aWR0aD0iMiIvPjxsaW5lIHgxPSI2MCIgeTE9IjIwIiB4Mj0iODAiIHkyPSIyMCIgc3Ryb2tlPSIjMDAwIiBzdHJva2Utd2lkdGg9IjIiLz48dGV4dCB4PSIyNSIgeT0iMjUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxMiI+TEVEXC90ZXh0Pjwvc3ZnPg==',
  // ... tambahkan base64 lain sesuai kebutuhan
};

// Nilai default komponen
const defaultValues = {
  battery: { voltage: 9, resistance: 0 },
  resistor: { resistance: 470 },
  led: { color: 'red', forwardVoltage: 1.8, resistance: 100 },
  switch: { state: 'open', resistance: 0.01 },
  ground: { resistance: 0 },
  capacitor: { capacitance: 1e-6 },
  inductor: { inductance: 1e-3 },
  diode: { forwardVoltage: 0.7, resistance: 1 },
  acSource: { amplitude: 5, frequency: 60 },
  voltmeter: { value: 0 },
  ammeter: { value: 0 }
};

// Inisialisasi canvas
let canvas, ctx;
document.addEventListener('DOMContentLoaded', function() {
  canvas = document.getElementById('circuit-canvas');
  if (!canvas) {
    canvas = document.createElement('div');
    canvas.id = 'circuit-canvas';
    canvas.className = 'canvas-container';
    document.body.appendChild(canvas);
  }
  addComponentStyles();
  setupEventListeners();
  createSimulationModal();
  createDefaultComponentButtons();
  createSeriesCircuit();
  updateStatusMessage('Simulator rangkaian elektronik siap digunakan.');
});

// Fungsi render komponen dengan fallback base64
function renderComponent(component) {
  let componentElement = document.getElementById(component.id);
  if (!componentElement) {
    componentElement = document.createElement('div');
    componentElement.id = component.id;
    componentElement.className = 'component';
    componentElement.setAttribute('data-type', component.type);
    const img = document.createElement('img');
    img.src = componentImages[component.type];
    img.onerror = function() {
      img.src = componentImagesBase64[component.type] || createPlaceholderImage(component.type);
    };
    img.alt = component.type;
    componentElement.appendChild(img);
    const valueLabel = document.createElement('div');
    valueLabel.className = 'component-value';
    componentElement.appendChild(valueLabel);
    addConnectionPoints(component, componentElement);
    canvas.appendChild(componentElement);
  }
  componentElement.style.left = `${component.x}px`;
  componentElement.style.top = `${component.y}px`;
  componentElement.style.transform = `scale(${scale})`;
  // label
  const valueLabel = componentElement.querySelector('.component-value');
  if (valueLabel) {
    switch (component.type) {
      case 'battery': valueLabel.textContent = `${component.voltage}V`; break;
      case 'resistor': valueLabel.textContent = `${component.resistance}Ω`; break;
      case 'led': valueLabel.textContent = `LED ${component.color}`; break;
      case 'switch': valueLabel.textContent = component.state === 'closed' ? 'ON' : 'OFF'; break;
      case 'ground': valueLabel.textContent = 'GND'; break;
      case 'capacitor': valueLabel.textContent = `${component.capacitance}F`; break;
      case 'inductor': valueLabel.textContent = `${component.inductance}H`; break;
      case 'diode': valueLabel.textContent = `${component.forwardVoltage}V`; break;
      case 'acSource': valueLabel.textContent = `${component.amplitude}V ${component.frequency}Hz`; break;
      case 'voltmeter': valueLabel.textContent = `${component.value.toFixed(2)}V`; break;
      case 'ammeter': valueLabel.textContent = `${component.value.toFixed(2)}A`; break;
    }
  }
}

// Fungsi fallback placeholder
function createPlaceholderImage(type) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="80" height="40"><rect width="80" height="40" fill="#eee"/><text x="40" y="25" font-family="Arial" font-size="12" text-anchor="middle">${type}</text></svg>`;
  return 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svg)));
}

// Fungsi lain (addComponent, addConnectionPoints, addWire, renderWire, dsb) tetap sama dengan struktur asli Anda, cukup pastikan semua pemanggilan renderComponent otomatis menangani fallback gambar seperti di atas.

// Fungsi untuk menambahkan style
function addComponentStyles() {
  const style = document.createElement('style');
  style.textContent = `
    .component { position: absolute; cursor: move; user-select: none; width: 80px; height: 40px; z-index: 10; }
    .component.selected { outline: 2px solid #3498db; }
    .component img { width: 100%; height: 100%; object-fit: contain; }
    .component-value { position: absolute; bottom: -20px; left: 0; width: 100%; text-align: center; font-size: 12px; }
    .connection-point { position: absolute; width: 12px; height: 12px; background-color: #3498db; border: 2px solid #2980b9; border-radius: 50%; margin-left: -6px; margin-top: -6px; cursor: pointer; z-index: 20; }
    .connection-point:hover { background-color: #2ecc71; }
    .connection-point.active { background-color: #e74c3c; border-color: #c0392b; }
    .point-label { position: absolute; font-size: 10px; color: white; top: -18px; left: 0; width: 100%; text-align: center; }
    .wire { position: absolute; height: 3px; background-color: #2c3e50; transform-origin: 0 0; z-index: 5; }
    .canvas-container { position: relative; width: 100%; height: 600px; border: 1px solid #ccc; overflow: hidden; background-color: #f8f9fa; }
  `;
  document.head.appendChild(style);
}

// Fungsi setupEventListeners, createSimulationModal, createDefaultComponentButtons, addComponent, addConnectionPoints, addWire, renderWire, deleteWire, deleteComponent, selectComponent, handleCanvasMouseDown, handleCanvasMouseMove, handleCanvasMouseUp, handleCanvasWheel, createSeriesCircuit, createParallelCircuit, createMixedCircuit, clearCircuit, updateStatusMessage, updateCircuitStats, saveCircuit, loadCircuit, simulateCircuit, calculateCircuit, displaySimulationResults, updateBatteryProperties, updateResistorProperties, updateLedProperties, updateSwitchProperties, updateCapacitorProperties, updateInductorProperties, updateDiodeProperties, updateAcSourceProperties, checkLedState, formatCapacitance, formatInductance, updateWireVisualization, closeSimulationModal, setupComponentPropertyListeners, dsb. tetap seperti pada struktur Anda, pastikan renderComponent selalu menggunakan mekanisme fallback gambar di atas.


  
  // Inisialisasi canvas visualisasi
  const vizCanvas = document.getElementById('circuit-visualization');
  if (vizCanvas) {
    ctx = vizCanvas.getContext('2d');
  }

  // Cek apakah tombol komponen ada
  const componentButtons = document.querySelectorAll('.component-btn');
  if (componentButtons.length === 0) {
    console.warn('Component buttons not found. Some functionality may be limited.');
  } else {
    // Event listener untuk tombol komponen
    componentButtons.forEach(button => {
      button.addEventListener('click', function() {
        const type = this.getAttribute('data-type');
        if (type === 'wire') {
          setMode('wiring');
        } else if (type === 'delete') {
          setMode('delete');
        } else {
          setMode('normal');
          addComponent(type);
        }
      });
    });
  }
  // Fungsi untuk memastikan canvas ada dan siap digunakan
function ensureCanvasExists() {
  if (!canvas) {
    canvas = document.getElementById('circuit-canvas');
    if (!canvas) {
      console.log('Creating canvas element...');
      canvas = document.createElement('div');
      canvas.id = 'circuit-canvas';
      canvas.className = 'canvas-container';
      document.body.appendChild(canvas);
    }
  }
  return canvas;
}

// Fungsi render komponen dengan fallback gambar
function renderComponent(component) {
  let componentElement = document.getElementById(component.id);
  if (!componentElement) {
    componentElement = document.createElement('div');
    componentElement.id = component.id;
    componentElement.className = 'component';
    componentElement.setAttribute('data-type', component.type);

    const img = document.createElement('img');
    img.src = componentImages[component.type];
    img.onerror = function () {
      console.error(`Failed to load image for component ${component.type}: ${img.src}`);
      img.src = componentImagesBase64[component.type] || createPlaceholderImage(component.type);
    };
    img.alt = component.type;
    componentElement.appendChild(img);

    const valueLabel = document.createElement('div');
    valueLabel.className = 'component-value';
    componentElement.appendChild(valueLabel);

    addConnectionPoints(component, componentElement);
    canvas.appendChild(componentElement);
  }

  componentElement.style.left = `${component.x}px`;
  componentElement.style.top = `${component.y}px`;
  componentElement.style.transform = `scale(${scale})`;

  const valueLabel = componentElement.querySelector('.component-value');
  if (valueLabel) {
    switch (component.type) {
      case 'battery': valueLabel.textContent = `${component.voltage}V`; break;
      case 'resistor': valueLabel.textContent = `${component.resistance}Ω`; break;
      case 'led': valueLabel.textContent = `LED ${component.color}`; break;
      default: valueLabel.textContent = component.type;
    }
  }
}

// Tambahkan fallback placeholder untuk gambar
function createPlaceholderImage(type) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="80" height="40"><rect width="80" height="40" fill="#eee"/><text x="40" y="25" font-family="Arial" font-size="12" text-anchor="middle">${type}</text></svg>`;
  return 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svg)));
}

// Pastikan canvas ada saat DOMContentLoaded
document.addEventListener('DOMContentLoaded', function () {
  canvas = ensureCanvasExists();
  addComponentStyles();
  setupEventListeners();
  createSeriesCircuit();
  updateStatusMessage('Simulator rangkaian elektronik siap digunakan.');
});

  // Event listener untuk template rangkaian
  const seriesCircuitBtn = document.getElementById('series-circuit');
  const parallelCircuitBtn = document.getElementById('parallel-circuit');
  const mixedCircuitBtn = document.getElementById('mixed-circuit');
  const clearBtn = document.getElementById('clear-btn');
  
  if (seriesCircuitBtn) seriesCircuitBtn.addEventListener('click', createSeriesCircuit);
  if (parallelCircuitBtn) parallelCircuitBtn.addEventListener('click', createParallelCircuit);
  if (mixedCircuitBtn) mixedCircuitBtn.addEventListener('click', createMixedCircuit);
  if (clearBtn) clearBtn.addEventListener('click', clearCircuit);

  // Event listener untuk aksi
  const simulateBtn = document.getElementById('simulate-btn');
  const saveBtn = document.getElementById('save-btn');
  const loadBtn = document.getElementById('load-btn');
  
  if (simulateBtn) simulateBtn.addEventListener('click', simulateCircuit);
  if (saveBtn) saveBtn.addEventListener('click', saveCircuit);
  if (loadBtn) loadBtn.addEventListener('click', loadCircuit);

  // Event listener untuk properti komponen
  const updateBatteryBtn = document.getElementById('update-battery');
  const updateResistorBtn = document.getElementById('update-resistor');
  const updateLedBtn = document.getElementById('update-led');
  const updateSwitchBtn = document.getElementById('update-switch');
  
  if (updateBatteryBtn) updateBatteryBtn.addEventListener('click', updateBatteryProperties);
  if (updateResistorBtn) updateResistorBtn.addEventListener('click', updateResistorProperties);
  if (updateLedBtn) updateLedBtn.addEventListener('click', updateLedProperties);
  if (updateSwitchBtn) updateSwitchBtn.addEventListener('click', updateSwitchProperties);

  // Event listener untuk properti komponen tambahan
  const updateCapacitorBtn = document.getElementById('update-capacitor');
  if (updateCapacitorBtn) {
    updateCapacitorBtn.addEventListener('click', updateCapacitorProperties);
  }

  const updateInductorBtn = document.getElementById('update-inductor');
  if (updateInductorBtn) {
    updateInductorBtn.addEventListener('click', updateInductorProperties);
  }

  const updateDiodeBtn = document.getElementById('update-diode');
  if (updateDiodeBtn) {
    updateDiodeBtn.addEventListener('click', updateDiodeProperties);
  }

  const updateAcSourceBtn = document.getElementById('update-acSource');
  if (updateAcSourceBtn) {
    updateAcSourceBtn.addEventListener('click', updateAcSourceProperties);
  }

  // Event listener untuk canvas
  if (canvas) {
    canvas.addEventListener('mousedown', handleCanvasMouseDown);
    canvas.addEventListener('mousemove', handleCanvasMouseMove);
    canvas.addEventListener('mouseup', handleCanvasMouseUp);
    canvas.addEventListener('wheel', handleCanvasWheel);
  }

  // Inisialisasi dengan rangkaian sederhana
  createSeriesCircuit();
  
  // Tampilkan pesan status
  const statusMessage = document.getElementById('status-message');
  if (statusMessage) {
    statusMessage.textContent = 'Simulator rangkaian elektronik siap digunakan.';
  } else {
    console.warn('Status message element not found.');
  };

// Fungsi untuk mengatur mode
function setMode(mode) {
  currentMode = mode;
  const modeIndicator = document.getElementById('mode-indicator');
  if (modeIndicator) {
    modeIndicator.textContent = `Mode: ${mode.charAt(0).toUpperCase() + mode.slice(1)}`;
  }
  
  if (canvas) {
    if (mode === 'wiring') {
      canvas.style.cursor = 'crosshair';
      updateStatusMessage('Mode Kabel: Klik pada titik koneksi pertama, lalu klik pada titik koneksi kedua.');
    } else if (mode === 'delete') {
      canvas.style.cursor = 'no-drop';
      updateStatusMessage('Mode Hapus: Klik pada komponen atau kabel untuk menghapusnya.');
    } else {
      canvas.style.cursor = 'default';
      updateStatusMessage('Mode Normal: Tambahkan dan atur komponen.');
    }
  }

  // Reset state
  isWiring = false;
  wireStartComponent = null;
  wireStartPoint = null;
}

// Fungsi untuk menambahkan komponen
function addComponent(type) {
  // Validasi tipe komponen
  if (!componentImages[type]) {
    console.error(`Invalid component type: ${type}`);
    return;
  }

  const id = `component-${nextId++}`;
  const component = {
    id,
    type,
    x: 100,
    y: 100,
    ...JSON.parse(JSON.stringify(defaultValues[type])), // Deep copy default values
    connectionPoints: []
  };
  
  components.push(component);
  renderComponent(component);
  
  // Pilih komponen yang baru ditambahkan
  selectComponent(component);
  updateStatusMessage(`Komponen ${type} ditambahkan. Klik dan seret untuk memindahkan.`);
  updateCircuitStats();
}

// Fungsi untuk merender komponen
function renderComponent(component) {
  if (!component) {
    console.error('Cannot render undefined component');
    return;
  }

  let componentElement = document.getElementById(component.id);
  
  if (!componentElement) {
    componentElement = document.createElement('div');
    componentElement.id = component.id;
    componentElement.className = 'component';
    componentElement.setAttribute('data-type', component.type);
    
    const img = document.createElement('img');
    img.src = componentImages[component.type];
    img.alt = component.type;
    
    // Tambahkan event listener untuk menangani error loading gambar
    img.onerror = function() {
      console.error(`Failed to load image for component ${component.type}: ${img.src}`);
      // Gunakan gambar placeholder sebagai fallback
      img.src = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI4MCIgaGVpZ2h0PSI0MCIgdmlld0JveD0iMCAwIDgwIDQwIj48cmVjdCB3aWR0aD0iODAiIGhlaWdodD0iNDAiIGZpbGw9IiNlZWUiLz48dGV4dCB4PSI0MCIgeT0iMjAiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxMiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZG9taW5hbnQtYmFzZWxpbmU9Im1pZGRsZSI+Q29tcG9uZW50PC90ZXh0Pjwvc3ZnPg==';
    };
    
    img.onload = function() {
      console.log(`Image loaded successfully for component ${component.type}`);
    };
    
    componentElement.appendChild(img);
    
    const valueLabel = document.createElement('div');
    valueLabel.className = 'component-value';
    componentElement.appendChild(valueLabel);
    
    // Tambahkan titik koneksi
    addConnectionPoints(component, componentElement);
    
    if (canvas) {
      canvas.appendChild(componentElement);
    } else {
      console.error('Canvas element not found, cannot append component');
    }
  }
  
  // Posisikan komponen
  componentElement.style.left = `${component.x}px`;
  componentElement.style.top = `${component.y}px`;
  componentElement.style.transform = `scale(${scale})`;
  
  // Update label nilai
  const valueLabel = componentElement.querySelector('.component-value');
  if (valueLabel) {
    switch (component.type) {
      case 'battery':
        valueLabel.textContent = `${component.voltage}V`;
        break;
      case 'resistor':
        valueLabel.textContent = `${component.resistance}Ω`;
        break;
      case 'led':
        valueLabel.textContent = `LED ${component.color}`;
        // Update visual LED berdasarkan warna
        const ledImg = componentElement.querySelector('img');
        if (ledImg) {
          ledImg.className = ''; // Reset class
          if (isSimulating) {
            const isOn = checkLedState(component);
            if (isOn) {
              ledImg.classList.add(`led-${component.color}`);
            }
          }
        }
        break;
      case 'switch':
        valueLabel.textContent = component.state === 'closed' ? 'ON' : 'OFF';
        break;
      case 'ground':
        valueLabel.textContent = 'GND';
        break;
      case 'capacitor':
        valueLabel.textContent = formatCapacitance(component.capacitance);
        break;
      case 'inductor':
        valueLabel.textContent = formatInductance(component.inductance);
        break;
      case 'diode':
        valueLabel.textContent = `${component.forwardVoltage}V`;
        break;
      case 'acSource':
        valueLabel.textContent = `${component.amplitude}V ${component.frequency}Hz`;
        break;
      case 'voltmeter':
        valueLabel.textContent = `${component.value.toFixed(2)}V`;
        break;
      case 'ammeter':
        valueLabel.textContent = `${component.value.toFixed(2)}A`;
        break;
    }
  }
}

// Fungsi untuk menambahkan titik koneksi pada komponen
function addConnectionPoints(component, element) {
  // Hapus titik koneksi yang ada
  component.connectionPoints = [];
  
  // Definisikan titik koneksi berdasarkan jenis komponen
  let points = [];
  // Ukuran standar untuk komponen
  const imgWidth = 80;
  const imgHeight = 40;
  
  switch (component.type) {
    case 'battery':
      points = [
        { id: `${component.id}-p1`, x: 0, y: imgHeight/2, label: '+' },
        { id: `${component.id}-p2`, x: imgWidth, y: imgHeight/2, label: '-' }
      ];
      break;
    case 'resistor':
      points = [
        { id: `${component.id}-p1`, x: 0, y: imgHeight/2, label: '1' },
        { id: `${component.id}-p2`, x: imgWidth, y: imgHeight/2, label: '2' }
      ];
      break;
    case 'led':
      points = [
        { id: `${component.id}-p1`, x: 0, y: imgHeight/2, label: '+' },
        { id: `${component.id}-p2`, x: imgWidth, y: imgHeight/2, label: '-' }
      ];
      break;
    case 'switch':
      points = [
        { id: `${component.id}-p1`, x: 0, y: imgHeight/2, label: '1' },
        { id: `${component.id}-p2`, x: imgWidth, y: imgHeight/2, label: '2' }
      ];
      break;
    case 'ground':
      points = [
        { id: `${component.id}-p1`, x: imgWidth/2, y: 0, label: 'G' }
      ];
      break;
    case 'capacitor':
      points = [
        { id: `${component.id}-p1`, x: 0, y: imgHeight/2, label: '1' },
        { id: `${component.id}-p2`, x: imgWidth, y: imgHeight/2, label: '2' }
      ];
      break;
    case 'inductor':
      points = [
        { id: `${component.id}-p1`, x: 0, y: imgHeight/2, label: '1' },
        { id: `${component.id}-p2`, x: imgWidth, y: imgHeight/2, label: '2' }
      ];
      break;
    case 'diode':
      points = [
        { id: `${component.id}-p1`, x: 0, y: imgHeight/2, label: '+' },
        { id: `${component.id}-p2`, x: imgWidth, y: imgHeight/2, label: '-' }
      ];
      break;
    case 'acSource':
      points = [
        { id: `${component.id}-p1`, x: 0, y: imgHeight/2, label: '~' },
        { id: `${component.id}-p2`, x: imgWidth, y: imgHeight/2, label: '~' }
      ];
      break;
    case 'voltmeter':
      points = [
        { id: `${component.id}-p1`, x: 0, y: imgHeight/2, label: '+' },
        { id: `${component.id}-p2`, x: imgWidth, y: imgHeight/2, label: '-' }
      ];
      break;
    case 'ammeter':
      points = [
        { id: `${component.id}-p1`, x: 0, y: imgHeight/2, label: '+' },
        { id: `${component.id}-p2`, x: imgWidth, y: imgHeight/2, label: '-' }
      ];
      break;
  }
  
  // Tambahkan titik koneksi ke DOM
  points.forEach(point => {
    const connectionPoint = document.createElement('div');
    connectionPoint.id = point.id;
    connectionPoint.className = 'connection-point';
    connectionPoint.style.left = `${point.x}px`;
    connectionPoint.style.top = `${point.y}px`;
    connectionPoint.setAttribute('data-label', point.label);
    
    // Tambahkan indikator visual untuk titik koneksi
    const pointLabel = document.createElement('span');
    pointLabel.className = 'point-label';
    pointLabel.textContent = point.label;
    connectionPoint.appendChild(pointLabel);
    
    // Event listener untuk titik koneksi
    connectionPoint.addEventListener('click', function(e) {
      e.stopPropagation();
      if (currentMode === 'wiring') {
        handleConnectionPointClick(component, point);
      }
    });
    
    element.appendChild(connectionPoint);
    
    // Simpan informasi titik koneksi
    component.connectionPoints.push({
      id: point.id,
      x: point.x,
      y: point.y,
      label: point.label
    });
  });
}

// Fungsi untuk menangani klik pada titik koneksi
function handleConnectionPointClick(component, point) {
  if (!isWiring) {
    // Mulai menggambar kabel
    isWiring = true;
    wireStartComponent = component;
    wireStartPoint = point;
    
    // Tandai titik koneksi aktif
    const connectionPoint = document.getElementById(point.id);
    if (connectionPoint) {
      connectionPoint.classList.add('active');
    }
    
    updateStatusMessage('Pilih titik koneksi kedua untuk menyelesaikan kabel.');
  } else {
    // Selesai menggambar kabel
    if (wireStartComponent !== component) {
      addWire(wireStartComponent, wireStartPoint, component, point);
      updateStatusMessage('Kabel ditambahkan. Klik pada titik koneksi lain untuk menambahkan kabel baru.');
    } else {
      updateStatusMessage('Tidak dapat menghubungkan ke komponen yang sama. Pilih komponen lain.');
    }
    
    // Hapus tanda aktif pada titik koneksi
    const startConnectionPoint = document.getElementById(wireStartPoint.id);
    if (startConnectionPoint) {
      startConnectionPoint.classList.remove('active');
    }
    
    // Reset state
    isWiring = false;
    wireStartComponent = null;
    wireStartPoint = null;
  }
}

// Fungsi untuk menambahkan kabel
function addWire(startComponent, startPoint, endComponent, endPoint) {
  const wireId = `wire-${nextId++}`;
  const wire = {
    id: wireId,
    startComponentId: startComponent.id,
    startPointId: startPoint.id,
    endComponentId: endComponent.id,
    endPointId: endPoint.id
  };
  
  wires.push(wire);
  renderWire(wire);
  updateCircuitStats();
}

// Fungsi untuk merender kabel
function renderWire(wire) {
  let wireElement = document.getElementById(wire.id);
  
  if (!wireElement) {
    wireElement = document.createElement('div');
    wireElement.id = wire.id;
    wireElement.className = 'wire';
    
    wireElement.addEventListener('click', function(e) {
      e.stopPropagation();
      if (currentMode === 'delete') {
        deleteWire(wire);
      }
    });
    
    if (canvas) {
      canvas.appendChild(wireElement);
    } else {
      console.error('Canvas element not found, cannot append wire');
      return;
    }
  }
  
  // Dapatkan posisi titik koneksi
  const startComponent = components.find(c => c.id === wire.startComponentId);
  const endComponent = components.find(c => c.id === wire.endComponentId);
  
  if (!startComponent || !endComponent) {
    console.error('Start or end component not found for wire', wire);
    return;
  }
  
  const startPoint = startComponent.connectionPoints.find(p => p.id === wire.startPointId);
  const endPoint = endComponent.connectionPoints.find(p => p.id === wire.endPointId);
  
  if (!startPoint || !endPoint) {
    console.error('Start or end point not found for wire', wire);
    return;
  }
  
  // Hitung posisi absolut titik koneksi
  const startX = startComponent.x + startPoint.x;
  const startY = startComponent.y + startPoint.y;
  const endX = endComponent.x + endPoint.x;
  const endY = endComponent.y + endPoint.y;
  
  // Hitung panjang dan sudut kabel
  const dx = endX - startX;
  const dy = endY - startY;
  const length = Math.sqrt(dx * dx + dy * dy);
  const angle = Math.atan2(dy, dx) * 180 / Math.PI;
  
  // Posisikan dan putar kabel
  wireElement.style.width = `${length}px`;
  wireElement.style.left = `${startX}px`;
  wireElement.style.top = `${startY}px`;
  wireElement.style.transform = `rotate(${angle}deg) scale(${scale})`;
  
  // Tambahkan atribut data untuk memudahkan debugging
  wireElement.setAttribute('data-start', `${startComponent.id}:${startPoint.label}`);
  wireElement.setAttribute('data-end', `${endComponent.id}:${endPoint.label}`);
}

// Fungsi untuk menghapus kabel
function deleteWire(wire) {
  const wireElement = document.getElementById(wire.id);
  if (wireElement && canvas) {
    canvas.removeChild(wireElement);
  }
  
  wires = wires.filter(w => w.id !== wire.id);
  updateStatusMessage('Kabel dihapus.');
  updateCircuitStats();
}

// Fungsi untuk menghapus komponen
function deleteComponent(component) {
  // Hapus komponen dari DOM
  const componentElement = document.getElementById(component.id);
  if (componentElement && canvas) {
    canvas.removeChild(componentElement);
  }
  
  // Hapus kabel yang terhubung dengan komponen
  const connectedWires = wires.filter(w =>
    w.startComponentId === component.id || w.endComponentId === component.id
  );
  connectedWires.forEach(wire => {
    deleteWire(wire);
  });
  
  // Hapus komponen dari array
  components = components.filter(c => c.id !== component.id);
  
  // Reset seleksi jika komponen yang dihapus adalah yang dipilih
  if (selectedComponent && selectedComponent.id === component.id) {
    selectComponent(null);
  }
  
  updateStatusMessage('Komponen dihapus.');
  updateCircuitStats();
}

// Fungsi untuk memilih komponen
function selectComponent(component) {
  // Hapus seleksi sebelumnya
  if (selectedComponent) {
    const prevElement = document.getElementById(selectedComponent.id);
    if (prevElement) {
      prevElement.classList.remove('selected');
    }
  }
  
  selectedComponent = component;
  
  // Sembunyikan semua panel properti
  const noSelection = document.getElementById('no-selection');
  const batteryProperties = document.getElementById('battery-properties');
  const resistorProperties = document.getElementById('resistor-properties');
  const ledProperties = document.getElementById('led-properties');
  const switchProperties = document.getElementById('switch-properties');
  
  if (noSelection) noSelection.style.display = 'none';
  if (batteryProperties) batteryProperties.style.display = 'none';
  if (resistorProperties) resistorProperties.style.display = 'none';
  if (ledProperties) ledProperties.style.display = 'none';
  if (switchProperties) switchProperties.style.display = 'none';
  
  // Sembunyikan panel properti komponen tambahan
  const capacitorProperties = document.getElementById('capacitor-properties');
  if (capacitorProperties) capacitorProperties.style.display = 'none';
  
  const inductorProperties = document.getElementById('inductor-properties');
  if (inductorProperties) inductorProperties.style.display = 'none';
  
  const diodeProperties = document.getElementById('diode-properties');
  if (diodeProperties) diodeProperties.style.display = 'none';
  
  const acSourceProperties = document.getElementById('acSource-properties');
  if (acSourceProperties) acSourceProperties.style.display = 'none';
  
  if (component) {
    // Tampilkan outline pada komponen yang dipilih
    const element = document.getElementById(component.id);
    if (element) {
      element.classList.add('selected');
    }
    
    // Tampilkan panel properti yang sesuai
    switch (component.type) {
      case 'battery':
        if (batteryProperties) {
          batteryProperties.style.display = 'block';
          const voltageInput = document.getElementById('battery-voltage');
          const voltageSlider = document.getElementById('battery-voltage-slider');
          if (voltageInput) voltageInput.value = component.voltage;
          if (voltageSlider) voltageSlider.value = component.voltage;
        }
        break;
      case 'resistor':
        if (resistorProperties) {
          resistorProperties.style.display = 'block';
          const resistanceInput = document.getElementById('resistor-resistance');
          const resistanceSlider = document.getElementById('resistor-resistance-slider');
          if (resistanceInput) resistanceInput.value = component.resistance;
          if (resistanceSlider) resistanceSlider.value = Math.min(1000, component.resistance);
        }
        break;
      case 'led':
        if (ledProperties) {
          ledProperties.style.display = 'block';
          const colorSelect = document.getElementById('led-color');
          const voltageInput = document.getElementById('led-voltage');
          if (colorSelect) colorSelect.value = component.color;
          if (voltageInput) voltageInput.value = component.forwardVoltage;
        }
        break;
      case 'switch':
        if (switchProperties) {
          switchProperties.style.display = 'block';
          const stateSelect = document.getElementById('switch-state');
          const stateToggle = document.getElementById('switch-state-toggle');
          if (stateSelect) stateSelect.value = component.state;
          if (stateToggle) stateToggle.checked = component.state === 'closed';
        }
        break;
      case 'capacitor':
        if (capacitorProperties) {
          capacitorProperties.style.display = 'block';
          const capacitanceInput = document.getElementById('capacitor-capacitance');
          const capacitanceSlider = document.getElementById('capacitor-capacitance-slider');
          if (capacitanceInput) capacitanceInput.value = component.capacitance;
          // Konversi nilai kapasitansi ke nilai slider
          if (capacitanceSlider) {
            const sliderValue = 50 + 10 * Math.log10(component.capacitance / 1e-6);
            capacitanceSlider.value = Math.min(100, Math.max(0, sliderValue));
          }
        }
        break;
      case 'inductor':
        if (inductorProperties) {
          inductorProperties.style.display = 'block';
          const inductanceInput = document.getElementById('inductor-inductance');
          const inductanceSlider = document.getElementById('inductor-inductance-slider');
          if (inductanceInput) inductanceInput.value = component.inductance;
          // Konversi nilai induktansi ke nilai slider
          if (inductanceSlider) {
            const sliderValue = 50 + 10 * Math.log10(component.inductance / 1e-3);
            inductanceSlider.value = Math.min(100, Math.max(0, sliderValue));
          }
        }
        break;
      case 'diode':
        if (diodeProperties) {
          diodeProperties.style.display = 'block';
          const voltageInput = document.getElementById('diode-voltage');
          if (voltageInput) voltageInput.value = component.forwardVoltage;
        }
        break;
      case 'acSource':
        if (acSourceProperties) {
          acSourceProperties.style.display = 'block';
          const amplitudeInput = document.getElementById('acSource-amplitude');
          const frequencyInput = document.getElementById('acSource-frequency');
          if (amplitudeInput) amplitudeInput.value = component.amplitude;
          if (frequencyInput) frequencyInput.value = component.frequency;
        }
        break;
    }
  } else {
    // Tampilkan panel "tidak ada seleksi"
    if (noSelection) noSelection.style.display = 'block';
  }
}

// Fungsi untuk menangani event mouse down pada canvas
function handleCanvasMouseDown(e) {
  // Cek apakah klik pada komponen
  let target = e.target;
  while (target !== canvas && !target.classList.contains('component')) {
    target = target.parentElement;
    if (!target) return; // Jika target menjadi null, keluar dari loop
  }
  
  if (target.classList.contains('component')) {
    const componentId = target.id;
    const component = components.find(c => c.id === componentId);
    
    if (!component) {
      console.error('Component not found:', componentId);
      return;
    }
    
    if (currentMode === 'delete') {
      deleteComponent(component);
      return;
    }
    
    // Mulai drag
    isDragging = true;
    selectComponent(component);
    
    // Hitung offset untuk drag
    const rect = target.getBoundingClientRect();
    offsetX = e.clientX - rect.left;
    offsetY = e.clientY - rect.top;
  } else if (target === canvas) {
    // Klik pada canvas kosong
    selectComponent(null);
  }
}

// Fungsi untuk menangani event mouse move pada canvas
function handleCanvasMouseMove(e) {
  if (isDragging && selectedComponent) {
    // Pindahkan komponen
    selectedComponent.x = e.clientX - offsetX;
    selectedComponent.y = e.clientY - offsetY;
    
    // Update posisi komponen di DOM
    const componentElement = document.getElementById(selectedComponent.id);
    if (componentElement) {
      componentElement.style.left = `${selectedComponent.x}px`;
      componentElement.style.top = `${selectedComponent.y}px`;
    }
    
    // Update kabel yang terhubung
    const connectedWires = wires.filter(w =>
      w.startComponentId === selectedComponent.id || w.endComponentId === selectedComponent.id
    );
    connectedWires.forEach(wire => {
      renderWire(wire);
    });
  }
}

// Fungsi untuk menangani event mouse up pada canvas
function handleCanvasMouseUp() {
  isDragging = false;
}

// Fungsi untuk menangani event wheel pada canvas
function handleCanvasWheel(e) {
  e.preventDefault();
  
  // Zoom in/out
  const zoomFactor = e.deltaY > 0 ? 0.9 : 1.1;
  scale *= zoomFactor;
  
  // Batasi skala
  scale = Math.min(Math.max(0.5, scale), 2);
  
  // Update skala komponen
  components.forEach(component => {
    const element = document.getElementById(component.id);
    if (element) {
      element.style.transform = `scale(${scale})`;
    }
  });
  
  // Update skala kabel
  wires.forEach(wire => {
    renderWire(wire);
  });
}

// Fungsi untuk membuat rangkaian seri
function createSeriesCircuit() {
  clearCircuit();
  
  // Tambahkan komponen
  const battery = {
    id: `component-${nextId++}`,
    type: 'battery',
    x: 100,
    y: 150,
    ...JSON.parse(JSON.stringify(defaultValues.battery)),
    connectionPoints: []
  };
  
  const resistor1 = {
    id: `component-${nextId++}`,
    type: 'resistor',
    x: 250,
    y: 150,
    ...JSON.parse(JSON.stringify(defaultValues.resistor)),
    connectionPoints: []
  };
  
  const resistor2 = {
    id: `component-${nextId++}`,
    type: 'resistor',
    x: 400,
    y: 150,
    ...JSON.parse(JSON.stringify(defaultValues.resistor)),
    connectionPoints: []
  };
  
  const ground = {
    id: `component-${nextId++}`,
    type: 'ground',
    x: 250,
    y: 250,
    ...JSON.parse(JSON.stringify(defaultValues.ground)),
    connectionPoints: []
  };
  
  components.push(battery, resistor1, resistor2, ground);
  
  // Render komponen
  components.forEach(component => {
    renderComponent(component);
  });
  
  // Tunggu komponen dirender sebelum menambahkan kabel
  setTimeout(() => {
    // Hubungkan komponen dengan kabel
    if (battery.connectionPoints.length > 0 && resistor1.connectionPoints.length > 0) {
      addWire(
        battery, battery.connectionPoints[0],
        resistor1, resistor1.connectionPoints[0]
      );
    }
    
    if (resistor1.connectionPoints.length > 1 && resistor2.connectionPoints.length > 0) {
      addWire(
        resistor1, resistor1.connectionPoints[1],
        resistor2, resistor2.connectionPoints[0]
      );
    }
    
    if (resistor2.connectionPoints.length > 1 && battery.connectionPoints.length > 1) {
      addWire(
        resistor2, resistor2.connectionPoints[1],
        battery, battery.connectionPoints[1]
      );
    }
    
    if (battery.connectionPoints.length > 1 && ground.connectionPoints.length > 0) {
      addWire(
        battery, battery.connectionPoints[1],
        ground, ground.connectionPoints[0]
      );
    }
  }, 100);
  
  updateStatusMessage('Rangkaian seri dibuat.');
}

// Fungsi untuk membuat rangkaian paralel
function createParallelCircuit() {
  clearCircuit();
  
  // Tambahkan komponen
  const battery = {
    id: `component-${nextId++}`,
    type: 'battery',
    x: 100,
    y: 150,
    ...JSON.parse(JSON.stringify(defaultValues.battery)),
    connectionPoints: []
  };
  
  const resistor1 = {
    id: `component-${nextId++}`,
    type: 'resistor',
    x: 250,
    y: 100,
    ...JSON.parse(JSON.stringify(defaultValues.resistor)),
    connectionPoints: []
  };
  
  const resistor2 = {
    id: `component-${nextId++}`,
    type: 'resistor',
    x: 250,
    y: 200,
    ...JSON.parse(JSON.stringify(defaultValues.resistor)),
    connectionPoints: []
  };
  
  const ground = {
    id: `component-${nextId++}`,
    type: 'ground',
    x: 400,
    y: 150,
    ...JSON.parse(JSON.stringify(defaultValues.ground)),
    connectionPoints: []
  };
  
  components.push(battery, resistor1, resistor2, ground);
  
  // Render komponen
  components.forEach(component => {
    renderComponent(component);
  });
  
  // Tunggu komponen dirender sebelum menambahkan kabel
  setTimeout(() => {
    // Hubungkan komponen dengan kabel
    if (battery.connectionPoints.length > 0 && resistor1.connectionPoints.length > 0) {
      addWire(
        battery, battery.connectionPoints[0],
        resistor1, resistor1.connectionPoints[0]
      );
    }
    
    if (battery.connectionPoints.length > 0 && resistor2.connectionPoints.length > 0) {
      addWire(
        battery, battery.connectionPoints[0],
        resistor2, resistor2.connectionPoints[0]
      );
    }
    
    if (resistor1.connectionPoints.length > 1 && ground.connectionPoints.length > 0) {
      addWire(
        resistor1, resistor1.connectionPoints[1],
        ground, ground.connectionPoints[0]
      );
    }
    
    if (resistor2.connectionPoints.length > 1 && ground.connectionPoints.length > 0) {
      addWire(
        resistor2, resistor2.connectionPoints[1],
        ground, ground.connectionPoints[0]
      );
    }
    
    if (battery.connectionPoints.length > 1 && ground.connectionPoints.length > 0) {
      addWire(
        battery, battery.connectionPoints[1],
        ground, ground.connectionPoints[0]
      );
    }
  }, 100);
  
  updateStatusMessage('Rangkaian paralel dibuat.');
}

// Fungsi untuk membuat rangkaian campuran
function createMixedCircuit() {
  clearCircuit();
  
  // Tambahkan komponen
  const battery = {
    id: `component-${nextId++}`,
    type: 'battery',
    x: 100,
    y: 150,
    ...JSON.parse(JSON.stringify(defaultValues.battery)),
    connectionPoints: []
  };
  
  const resistor1 = {
    id: `component-${nextId++}`,
    type: 'resistor',
    x: 250,
    y: 100,
    ...JSON.parse(JSON.stringify(defaultValues.resistor)),
    connectionPoints: []
  };
  
  const resistor2 = {
    id: `component-${nextId++}`,
    type: 'resistor',
    x: 250,
    y: 200,
    ...JSON.parse(JSON.stringify(defaultValues.resistor)),
    connectionPoints: []
  };
  
  const resistor3 = {
    id: `component-${nextId++}`,
    type: 'resistor',
    x: 400,
    y: 150,
    ...JSON.parse(JSON.stringify(defaultValues.resistor)),
    connectionPoints: []
  };
  
  const ground = {
    id: `component-${nextId++}`,
    type: 'ground',
    x: 550,
    y: 150,
    ...JSON.parse(JSON.stringify(defaultValues.ground)),
    connectionPoints: []
  };
  
  components.push(battery, resistor1, resistor2, resistor3, ground);
  
  // Render komponen
  components.forEach(component => {
    renderComponent(component);
  });
  
  // Tunggu komponen dirender sebelum menambahkan kabel
  setTimeout(() => {
    // Hubungkan komponen dengan kabel
    if (battery.connectionPoints.length > 0 && resistor1.connectionPoints.length > 0) {
      addWire(
        battery, battery.connectionPoints[0],
        resistor1, resistor1.connectionPoints[0]
      );
    }
    
    if (battery.connectionPoints.length > 0 && resistor2.connectionPoints.length > 0) {
      addWire(
        battery, battery.connectionPoints[0],
        resistor2, resistor2.connectionPoints[0]
      );
    }
    
    if (resistor1.connectionPoints.length > 1 && resistor3.connectionPoints.length > 0) {
      addWire(
        resistor1, resistor1.connectionPoints[1],
        resistor3, resistor3.connectionPoints[0]
      );
    }
    
    if (resistor2.connectionPoints.length > 1 && resistor3.connectionPoints.length > 0) {
      addWire(
        resistor2, resistor2.connectionPoints[1],
        resistor3, resistor3.connectionPoints[0]
      );
    }
    
    if (resistor3.connectionPoints.length > 1 && ground.connectionPoints.length > 0) {
      addWire(
        resistor3, resistor3.connectionPoints[1],
        ground, ground.connectionPoints[0]
      );
    }
    
    if (battery.connectionPoints.length > 1 && ground.connectionPoints.length > 0) {
      addWire(
        battery, battery.connectionPoints[1],
        ground, ground.connectionPoints[0]
      );
    }
  }, 100);
  
  updateStatusMessage('Rangkaian campuran dibuat.');
}

// Fungsi untuk membersihkan rangkaian
function clearCircuit() {
  // Hapus semua komponen dari DOM
  components.forEach(component => {
    const element = document.getElementById(component.id);
    if (element && canvas) {
      canvas.removeChild(element);
    }
  });
  
  // Hapus semua kabel dari DOM
  wires.forEach(wire => {
    const element = document.getElementById(wire.id);
    if (element && canvas) {
      canvas.removeChild(element);
    }
  });
  
  // Reset array
  components = [];
  wires = [];
  selectedComponent = null;
  
  updateStatusMessage('Rangkaian dibersihkan.');
  updateCircuitStats();
}

// Fungsi untuk update properti baterai
function updateBatteryProperties() {
  if (selectedComponent && selectedComponent.type === 'battery') {
    const voltageInput = document.getElementById('battery-voltage');
    if (!voltageInput) {
      console.error('Battery voltage input not found');
      return;
    }
    
    const voltage = parseFloat(voltageInput.value);
    
    if (!isNaN(voltage)) {
      selectedComponent.voltage = voltage;
      renderComponent(selectedComponent);
      updateStatusMessage(`Tegangan baterai diperbarui: ${voltage}V.`);
    }
  }
}

// Fungsi untuk update properti resistor
function updateResistorProperties() {
  if (selectedComponent && selectedComponent.type === 'resistor') {
    const resistanceInput = document.getElementById('resistor-resistance');
    if (!resistanceInput) {
      console.error('Resistor resistance input not found');
      return;
    }
    
    const resistance = parseFloat(resistanceInput.value);
    
    if (!isNaN(resistance) && resistance > 0) {
      selectedComponent.resistance = resistance;
      renderComponent(selectedComponent);
      updateStatusMessage(`Resistansi resistor diperbarui: ${resistance}Ω.`);
    }
  }
}

// Fungsi untuk update properti LED
function updateLedProperties() {
  if (selectedComponent && selectedComponent.type === 'led') {
    const colorSelect = document.getElementById('led-color');
    const voltageInput = document.getElementById('led-voltage');
    
    if (!colorSelect || !voltageInput) {
      console.error('LED property inputs not found');
      return;
    }
    
    const color = colorSelect.value;
    const forwardVoltage = parseFloat(voltageInput.value);
    
    if (!isNaN(forwardVoltage) && forwardVoltage > 0) {
      selectedComponent.color = color;
      selectedComponent.forwardVoltage = forwardVoltage;
      renderComponent(selectedComponent);
      updateStatusMessage(`Properti LED diperbarui.`);
    }
  }
}

// Fungsi untuk update properti switch
function updateSwitchProperties() {
  if (selectedComponent && selectedComponent.type === 'switch') {
    const stateSelect = document.getElementById('switch-state');
    if (!stateSelect) {
      console.error('Switch state select not found');
      return;
    }
    
    const state = stateSelect.value;
    
    selectedComponent.state = state;
    renderComponent(selectedComponent);
    updateStatusMessage(`Status switch diperbarui: ${state}.`);
  }
}

// Fungsi untuk update properti kapasitor
function updateCapacitorProperties() {
  if (selectedComponent && selectedComponent.type === 'capacitor') {
    const capacitanceInput = document.getElementById('capacitor-capacitance');
    if (!capacitanceInput) {
      console.error('Capacitor capacitance input not found');
      return;
    }
    
    const capacitance = parseFloat(capacitanceInput.value);
    
    if (!isNaN(capacitance) && capacitance > 0) {
      selectedComponent.capacitance = capacitance;
      renderComponent(selectedComponent);
      updateStatusMessage(`Kapasitansi kapasitor diperbarui: ${formatCapacitance(capacitance)}.`);
    }
  }
}

// Fungsi untuk update properti induktor
function updateInductorProperties() {
  if (selectedComponent && selectedComponent.type === 'inductor') {
    const inductanceInput = document.getElementById('inductor-inductance');
    if (!inductanceInput) {
      console.error('Inductor inductance input not found');
      return;
    }
    
    const inductance = parseFloat(inductanceInput.value);
    
    if (!isNaN(inductance) && inductance > 0) {
      selectedComponent.inductance = inductance;
      renderComponent(selectedComponent);
      updateStatusMessage(`Induktansi induktor diperbarui: ${formatInductance(inductance)}.`);
    }
  }
}

// Fungsi untuk update properti dioda
function updateDiodeProperties() {
  if (selectedComponent && selectedComponent.type === 'diode') {
    const voltageInput = document.getElementById('diode-voltage');
    if (!voltageInput) {
      console.error('Diode voltage input not found');
      return;
    }
    
    const forwardVoltage = parseFloat(voltageInput.value);
    
    if (!isNaN(forwardVoltage) && forwardVoltage > 0) {
      selectedComponent.forwardVoltage = forwardVoltage;
      renderComponent(selectedComponent);
      updateStatusMessage(`Tegangan forward dioda diperbarui: ${forwardVoltage}V.`);
    }
  }
}

// Fungsi untuk update properti sumber AC
function updateAcSourceProperties() {
  if (selectedComponent && selectedComponent.type === 'acSource') {
    const amplitudeInput = document.getElementById('acSource-amplitude');
    const frequencyInput = document.getElementById('acSource-frequency');
    
    if (!amplitudeInput || !frequencyInput) {
      console.error('AC source property inputs not found');
      return;
    }
    
    const amplitude = parseFloat(amplitudeInput.value);
    const frequency = parseFloat(frequencyInput.value);
    
    if (!isNaN(amplitude) && !isNaN(frequency) && amplitude > 0 && frequency > 0) {
      selectedComponent.amplitude = amplitude;
      selectedComponent.frequency = frequency;
      renderComponent(selectedComponent);
      updateStatusMessage(`Properti sumber AC diperbarui.`);
    }
  }
}

// Fungsi untuk simulasi rangkaian
function simulateCircuit() {
  if (components.length === 0) {
    alert('Tidak ada rangkaian untuk disimulasikan.');
    return;
  }
  
  isSimulating = true;
  updateStatusMessage('Simulasi dimulai...');
  
  // Implementasi simulasi rangkaian
  // Ini adalah implementasi sederhana, untuk simulasi yang lebih kompleks
  // diperlukan algoritma analisis rangkaian yang lebih canggih
  
  // Contoh: Hitung tegangan dan arus untuk rangkaian sederhana
  const results = calculateCircuit();
  
  // Tampilkan hasil simulasi
  displaySimulationResults(results);
  
  // Update visualisasi komponen
  components.forEach(component => {
    renderComponent(component);
  });
  
  // Update visualisasi kabel
  wires.forEach(wire => {
    updateWireVisualization(wire);
  });
}

// Fungsi untuk menghitung rangkaian
function calculateCircuit() {
  // Implementasi sederhana untuk rangkaian seri
  // Untuk rangkaian yang lebih kompleks, diperlukan algoritma seperti nodal analysis atau mesh analysis
  
  const results = {
    voltages: {},
    currents: {}
  };
  
  // Cari baterai
  const batteries = components.filter(c => c.type === 'battery');
  
  if (batteries.length === 0) {
    return results;
  }
  
  // Cari resistor
  const resistors = components.filter(c => c.type === 'resistor');
  
  // Cari LED
  const leds = components.filter(c => c.type === 'led');
  
  // Cari switch
  const switches = components.filter(c => c.type === 'switch');
  
  // Hitung total resistansi untuk rangkaian seri sederhana
  let totalResistance = 0;
  
  resistors.forEach(resistor => {
    totalResistance += resistor.resistance;
  });
  
  leds.forEach(led => {
    totalResistance += led.resistance;
  });
  
  switches.forEach(switchComp => {
    if (switchComp.state === 'closed') {
      totalResistance += switchComp.resistance;
    } else {
      // Switch terbuka, resistansi tak terhingga
      totalResistance = Infinity;
    }
  });
  
  // Hitung arus
  let totalVoltage = 0;
  batteries.forEach(battery => {
    totalVoltage += battery.voltage;
  });
  
  const current = totalResistance === Infinity ? 0 : totalVoltage / totalResistance;
  
  // Simpan hasil
  batteries.forEach(battery => {
    results.voltages[battery.id] = battery.voltage;
    results.currents[battery.id] = current;
  });
  
  resistors.forEach(resistor => {
    results.voltages[resistor.id] = current * resistor.resistance;
    results.currents[resistor.id] = current;
  });
  
  leds.forEach(led => {
    // Cek apakah LED menyala
    const ledVoltage = current * led.resistance;
    const isOn = ledVoltage >= led.forwardVoltage;
    
    results.voltages[led.id] = isOn ? led.forwardVoltage : ledVoltage;
    results.currents[led.id] = current;
    
    // Update status LED
    led.isOn = isOn;
  });
  
  switches.forEach(switchComp => {
    if (switchComp.state === 'closed') {
      results.voltages[switchComp.id] = current * switchComp.resistance;
      results.currents[switchComp.id] = current;
    } else {
      results.voltages[switchComp.id] = totalVoltage;
      results.currents[switchComp.id] = 0;
    }
  });
  
  return results;
}

// Fungsi untuk menampilkan hasil simulasi
function displaySimulationResults(results) {
  // Tampilkan modal hasil simulasi
  const modal = document.getElementById('simulation-modal');
  const resultsContainer = document.getElementById('simulation-results');
  
  if (!modal || !resultsContainer) {
    console.error('Simulation modal elements not found');
    alert('Hasil simulasi: ' + JSON.stringify(results));
    return;
  }
  
  // Bersihkan hasil sebelumnya
  resultsContainer.innerHTML = '';
  
  // Tambahkan hasil baru
  const voltagesHeader = document.createElement('h4');
  voltagesHeader.textContent = 'Tegangan:';
  resultsContainer.appendChild(voltagesHeader);
  
  for (const id in results.voltages) {
    const component = components.find(c => c.id === id);
    if (component) {
      const resultItem = document.createElement('div');
      resultItem.className = 'result-item';
      resultItem.textContent = `${component.type} ${id}: ${results.voltages[id].toFixed(2)}V`;
      resultsContainer.appendChild(resultItem);
    }
  }
  
  const currentsHeader = document.createElement('h4');
  currentsHeader.textContent = 'Arus:';
  resultsContainer.appendChild(currentsHeader);
  
  for (const id in results.currents) {
    const component = components.find(c => c.id === id);
    if (component) {
      const resultItem = document.createElement('div');
      resultItem.className = 'result-item';
      resultItem.textContent = `${component.type} ${id}: ${results.currents[id].toFixed(3)}A`;
      resultsContainer.appendChild(resultItem);
    }
  }
  
  // Tampilkan modal
  modal.style.display = 'flex';
}

// Fungsi untuk menutup modal simulasi
function closeSimulationModal() {
  const modal = document.getElementById('simulation-modal');
  if (modal) {
    modal.style.display = 'none';
  }
  
  isSimulating = false;
  updateStatusMessage('Simulasi selesai.');
}

// Fungsi untuk update visualisasi kabel
function updateWireVisualization(wire) {
  const wireElement = document.getElementById(wire.id);
  if (!wireElement) return;
  
  // Dapatkan komponen dan titik koneksi
  const startComponent = components.find(c => c.id === wire.startComponentId);
  const endComponent = components.find(c => c.id === wire.endComponentId);
  
  if (!startComponent || !endComponent) return;
  
  // Cek apakah ada arus yang mengalir
  const results = calculateCircuit();
  const current = results.currents[startComponent.id] || results.currents[endComponent.id] || 0;
  
  if (current > 0) {
    wireElement.classList.add('current-flow');
    // Sesuaikan kecepatan animasi berdasarkan arus
    wireElement.style.animationDuration = `${1 / (current * simulationSpeed)}s`;
  } else {
    wireElement.classList.remove('current-flow');
  }
}

// Fungsi untuk memeriksa status LED
function checkLedState(led) {
  // Implementasi sederhana untuk memeriksa apakah LED menyala
  // Dalam implementasi yang lebih kompleks, ini akan menjadi bagian dari simulasi
  
  // Cari kabel yang terhubung ke LED
  const connectedWires = wires.filter(w =>
    w.startComponentId === led.id || w.endComponentId === led.id
  );
  
  if (connectedWires.length < 2) return false;
  
  // Cari baterai yang terhubung ke LED
  let batteryConnected = false;
  let correctPolarity = false;
  
  connectedWires.forEach(wire => {
    const otherComponentId = wire.startComponentId === led.id ? wire.endComponentId : wire.startComponentId;
    const otherComponent = components.find(c => c.id === otherComponentId);
    
    if (otherComponent && otherComponent.type === 'battery') {
      batteryConnected = true;
      
      // Cek polaritas
      const ledPoint = led.connectionPoints.find(p => p.id === (wire.startComponentId === led.id ? wire.startPointId : wire.endPointId));
      const batteryPoint = otherComponent.connectionPoints.find(p => p.id === (wire.startComponentId === otherComponent.id ? wire.startPointId : wire.endPointId));
      
      if (ledPoint && batteryPoint) {
        correctPolarity = (ledPoint.label === '+' && batteryPoint.label === '+') || (ledPoint.label === '-' && batteryPoint.label === '-');
      }
    }
  });
  
  return batteryConnected && correctPolarity;
}

// Fungsi untuk memformat nilai kapasitansi
function formatCapacitance(capacitance) {
  if (capacitance >= 1) {
    return `${capacitance}F`;
  } else if (capacitance >= 1e-3) {
    return `${(capacitance * 1e3).toFixed(2)}mF`;
  } else if (capacitance >= 1e-6) {
    return `${(capacitance * 1e6).toFixed(2)}μF`;
  } else if (capacitance >= 1e-9) {
    return `${(capacitance * 1e9).toFixed(2)}nF`;
  } else {
    return `${(capacitance * 1e12).toFixed(2)}pF`;
  }
}

// Fungsi untuk memformat nilai induktansi
function formatInductance(inductance) {
  if (inductance >= 1) {
    return `${inductance}H`;
  } else if (inductance >= 1e-3) {
    return `${(inductance * 1e3).toFixed(2)}mH`;
  } else if (inductance >= 1e-6) {
    return `${(inductance * 1e6).toFixed(2)}μH`;
  } else {
    return `${(inductance * 1e9).toFixed(2)}nH`;
  }
}

// Fungsi untuk update statistik rangkaian
function updateCircuitStats() {
  const statsElement = document.getElementById('circuit-stats');
  if (!statsElement) return;
  
  statsElement.textContent = `Komponen: ${components.length}, Kabel: ${wires.length}`;
}

// Fungsi untuk menyimpan rangkaian
function saveCircuit() {
  const circuitData = {
    components,
    wires
  };
  
  const jsonData = JSON.stringify(circuitData);
  const blob = new Blob([jsonData], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  
  const a = document.createElement('a');
  a.href = url;
  a.download = 'circuit.json';
  a.click();
  
  URL.revokeObjectURL(url);
  
  updateStatusMessage('Rangkaian disimpan.');
}

// Fungsi untuk memuat rangkaian
function loadCircuit() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    
    input.onchange = function(e) {
      const file = e.target.files[0];
      if (!file) return;
      
      const reader = new FileReader();
      reader.onload = function(e) {
        try {
          const circuitData = JSON.parse(e.target.result);
          
          // Bersihkan rangkaian saat ini
          clearCircuit();
          
          // Muat komponen
          if (circuitData.components) {
            components = circuitData.components;
            components.forEach(component => {
              renderComponent(component);
            });
          }
          
          // Muat kabel
          if (circuitData.wires) {
            wires = circuitData.wires;
            wires.forEach(wire => {
              renderWire(wire);
            });
          }
          
          // Update nextId
          const maxComponentId = Math.max(...components.map(c => parseInt(c.id.split('-')[1] || '0')), 0);
          const maxWireId = Math.max(...wires.map(w => parseInt(w.id.split('-')[1] || '0')), 0);
          nextId = Math.max(maxComponentId, maxWireId) + 1;
          
          updateStatusMessage('Rangkaian dimuat.');
          updateCircuitStats();
        } catch (error) {
          console.error('Error loading circuit:', error);
          alert('Error loading circuit file: ' + error.message);
        }
      };
      
      reader.readAsText(file);
    };
    
    input.click();
  }
  
  // Fungsi untuk menampilkan pesan status
  function updateStatusMessage(message) {
    const statusMessage = document.getElementById('status-message');
    if (statusMessage) {
      statusMessage.textContent = message;
    } else {
      console.log('Status:', message);
    }
  }
  
  // Fungsi untuk memastikan gambar dimuat dengan benar
  function preloadComponentImages() {
    // Buat objek untuk menyimpan gambar yang sudah dimuat
    const preloadedImages = {};
    
    // Muat semua gambar komponen sebelum digunakan
    for (const type in componentImages) {
      preloadedImages[type] = new Image();
      preloadedImages[type].src = componentImages[type];
      
      // Tambahkan fallback jika gambar gagal dimuat
      preloadedImages[type].onerror = function() {
        console.error(`Gagal memuat gambar untuk komponen ${type}: ${this.src}`);
        this.src = createPlaceholderImage(type);
      };
    }
    
    return preloadedImages;
  }
  
  // Fungsi untuk membuat gambar placeholder sebagai fallback
  function createPlaceholderImage(type) {
    // Buat SVG placeholder untuk komponen
    const svg = `
      <svg xmlns="http://www.w3.org/2000/svg" width="80" height="40" viewBox="0 0 80 40">
        <rect width="80" height="40" fill="#f0f0f0" stroke="#999" stroke-width="2"/>
        <text x="40" y="25" font-family="Arial" font-size="12" text-anchor="middle">${type}</text>
      </svg>
    `;
    
    // Konversi SVG ke data URL
    return 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svg)));
  }
  
  // Inisialisasi gambar yang sudah dimuat
  const preloadedImages = preloadComponentImages();
  
  // Tambahkan CSS inline untuk memastikan komponen ditampilkan dengan benar
  function addComponentStyles() {
    const style = document.createElement('style');
    style.textContent = `
      .component {
        position: absolute;
        cursor: move;
        user-select: none;
        transition: transform 0.1s ease-out;
        background-color: transparent;
        width: 80px;
        height: 40px;
        z-index: 10;
      }
      
      .component.selected {
        outline: 2px solid #3498db;
        box-shadow: 0 0 10px rgba(52, 152, 219, 0.5);
      }
      
      .component img {
        width: 100%;
        height: 100%;
        object-fit: contain;
        pointer-events: none;
        transition: filter 0.3s;
      }
      
      .component-value {
        position: absolute;
        bottom: -20px;
        left: 0;
        width: 100%;
        text-align: center;
        font-size: 12px;
        background-color: rgba(255, 255, 255, 0.8);
        padding: 2px;
        border-radius: 3px;
        color: #2c3e50;
      }
      
      .connection-point {
        position: absolute;
        width: 12px;
        height: 12px;
        background-color: #3498db;
        border: 2px solid #2980b9;
        border-radius: 50%;
        margin-left: -6px;
        margin-top: -6px;
        cursor: pointer;
        z-index: 20;
        transition: transform 0.2s, background-color 0.2s;
      }
      
      .connection-point:hover {
        transform: scale(1.5);
        background-color: #2ecc71;
      }
      
      .connection-point.active {
        background-color: #e74c3c;
        border-color: #c0392b;
      }
      
      .point-label {
        position: absolute;
        font-size: 10px;
        color: white;
        top: -18px;
        left: 0;
        width: 100%;
        text-align: center;
        pointer-events: none;
        text-shadow: 0 0 2px rgba(0,0,0,0.5);
      }
      
      .wire {
        position: absolute;
        height: 3px;
        background-color: #2c3e50;
        transform-origin: 0 0;
        z-index: 5;
        transition: background-color 0.3s;
      }
      
      .wire.current-flow {
        background-image: linear-gradient(90deg, #3498db 50%, #2c3e50 50%);
        background-size: 20px 100%;
        animation: flowAnimation 0.5s linear infinite;
      }
      
      @keyframes flowAnimation {
        from { background-position: 0 0; }
        to { background-position: 20px 0; }
      }
      
      .led-red {
        filter: brightness(1.2) drop-shadow(0 0 5px rgba(255, 0, 0, 0.7));
      }
      
      .led-green {
        filter: brightness(1.2) drop-shadow(0 0 5px rgba(0, 255, 0, 0.7));
      }
      
      .led-blue {
        filter: brightness(1.2) drop-shadow(0 0 5px rgba(0, 0, 255, 0.7));
      }
      
      .led-yellow {
        filter: brightness(1.2) drop-shadow(0 0 5px rgba(255, 255, 0, 0.7));
      }
      
      .canvas-container {
        position: relative;
        width: 100%;
        height: 600px;
        border: 1px solid #ccc;
        overflow: hidden;
        background-color: #f8f9fa;
        background-image: 
          linear-gradient(rgba(0,0,0,0.1) 1px, transparent 1px),
          linear-gradient(90deg, rgba(0,0,0,0.1) 1px, transparent 1px);
        background-size: 20px 20px;
      }
      
      .simulation-modal {
        display: none;
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.5);
        z-index: 100;
        justify-content: center;
        align-items: center;
      }
      
      .modal-content {
        background-color: white;
        padding: 20px;
        border-radius: 5px;
        max-width: 600px;
        width: 80%;
        max-height: 80%;
        overflow-y: auto;
      }
      
      .close-btn {
        float: right;
        cursor: pointer;
        font-size: 20px;
        font-weight: bold;
      }
      
      .result-item {
        margin: 5px 0;
        padding: 5px;
        border-bottom: 1px solid #eee;
      }
    `;
    document.head.appendChild(style);
  }
  
  // Fungsi untuk memastikan canvas ada dan siap digunakan
  function ensureCanvasExists() {
    if (!canvas) {
      canvas = document.getElementById('circuit-canvas');
      
      if (!canvas) {
        console.log('Creating canvas element...');
        canvas = document.createElement('div');
        canvas.id = 'circuit-canvas';
        canvas.className = 'canvas-container';
        
        // Tambahkan canvas ke dalam dokumen
        const contentArea = document.querySelector('.content-area') || document.body;
        contentArea.appendChild(canvas);
        
        // Tambahkan event listener
        canvas.addEventListener('mousedown', handleCanvasMouseDown);
        canvas.addEventListener('mousemove', handleCanvasMouseMove);
        canvas.addEventListener('mouseup', handleCanvasMouseUp);
        canvas.addEventListener('wheel', handleCanvasWheel);
      }
    }
    
    return canvas;
  }
  
  // Fungsi untuk membuat modal simulasi jika belum ada
  function createSimulationModal() {
    let modal = document.getElementById('simulation-modal');
    
    if (!modal) {
      modal = document.createElement('div');
      modal.id = 'simulation-modal';
      modal.className = 'simulation-modal';
      
      const modalContent = document.createElement('div');
      modalContent.className = 'modal-content';
      
      const closeBtn = document.createElement('span');
      closeBtn.className = 'close-btn';
      closeBtn.innerHTML = '&times;';
      closeBtn.onclick = closeSimulationModal;
      
      const modalTitle = document.createElement('h3');
      modalTitle.textContent = 'Hasil Simulasi';
      
      const resultsContainer = document.createElement('div');
      resultsContainer.id = 'simulation-results';
      
      modalContent.appendChild(closeBtn);
      modalContent.appendChild(modalTitle);
      modalContent.appendChild(resultsContainer);
      modal.appendChild(modalContent);
      
      document.body.appendChild(modal);
    }
    
    return modal;
  }
  
  // Fungsi untuk membuat tombol komponen default jika tidak ada di HTML
  function createDefaultComponentButtons() {
    const buttonContainer = document.createElement('div');
    buttonContainer.className = 'component-buttons';
    buttonContainer.style.cssText = 'display: flex; flex-wrap: wrap; gap: 5px; margin-bottom: 10px;';
    
    const components = [
      { type: 'battery', label: 'Baterai' },
      { type: 'resistor', label: 'Resistor' },
      { type: 'led', label: 'LED' },
      { type: 'switch', label: 'Switch' },
      { type: 'ground', label: 'Ground' },
      { type: 'capacitor', label: 'Kapasitor' },
      { type: 'inductor', label: 'Induktor' },
      { type: 'diode', label: 'Dioda' },
      { type: 'acSource', label: 'Sumber AC' },
      { type: 'voltmeter', label: 'Voltmeter' },
      { type: 'ammeter', label: 'Ammeter' },
      { type: 'wire', label: 'Kabel' },
      { type: 'delete', label: 'Hapus' }
    ];
    
    components.forEach(comp => {
      const button = document.createElement('button');
      button.className = 'component-btn';
      button.setAttribute('data-type', comp.type);
      button.textContent = comp.label;
      button.style.cssText = 'padding: 5px 10px; cursor: pointer;';
      
      button.addEventListener('click', function() {
        const type = this.getAttribute('data-type');
        if (type === 'wire') {
          setMode('wiring');
        } else if (type === 'delete') {
          setMode('delete');
        } else {
          setMode('normal');
          addComponent(type);
        }
      });
      
      buttonContainer.appendChild(button);
    });
    
    // Tambahkan tombol template rangkaian
    const templateContainer = document.createElement('div');
    templateContainer.className = 'template-buttons';
    templateContainer.style.cssText = 'display: flex; gap: 5px; margin: 10px 0;';
    
    const templates = [
      { id: 'series-circuit', label: 'Rangkaian Seri' },
      { id: 'parallel-circuit', label: 'Rangkaian Paralel' },
      { id: 'mixed-circuit', label: 'Rangkaian Campuran' },
      { id: 'clear-btn', label: 'Bersihkan' }
    ];
    
    templates.forEach(template => {
      const button = document.createElement('button');
      button.id = template.id;
      button.textContent = template.label;
      button.style.cssText = 'padding: 5px 10px; cursor: pointer;';
      templateContainer.appendChild(button);
    });
    
    // Tambahkan tombol aksi
    const actionContainer = document.createElement('div');
    actionContainer.className = 'action-buttons';
    actionContainer.style.cssText = 'display: flex; gap: 5px; margin: 10px 0;';
    
    const actions = [
      { id: 'simulate-btn', label: 'Simulasi' },
      { id: 'save-btn', label: 'Simpan' },
      { id: 'load-btn', label: 'Muat' }
    ];
    
    actions.forEach(action => {
      const button = document.createElement('button');
      button.id = action.id;
      button.textContent = action.label;
      button.style.cssText = 'padding: 5px 10px; cursor: pointer;';
      actionContainer.appendChild(button);
    });
    
    // Tambahkan status dan mode indicator
    const statusContainer = document.createElement('div');
    statusContainer.style.cssText = 'margin: 10px 0; display: flex; justify-content: space-between;';
    
    const statusMessage = document.createElement('div');
    statusMessage.id = 'status-message';
    statusMessage.textContent = 'Simulator rangkaian elektronik siap digunakan.';
    
    const modeIndicator = document.createElement('div');
    modeIndicator.id = 'mode-indicator';
    modeIndicator.textContent = 'Mode: Normal';
    
    statusContainer.appendChild(statusMessage);
    statusContainer.appendChild(modeIndicator);
    
    // Tambahkan statistik rangkaian
    const statsElement = document.createElement('div');
    statsElement.id = 'circuit-stats';
    statsElement.textContent = 'Komponen: 0, Kabel: 0';
    statsElement.style.cssText = 'margin-top: 10px; font-size: 12px; color: #666;';
    
    // Tambahkan semua elemen ke dokumen
    const container = document.createElement('div');
    container.className = 'circuit-simulator-container';
    container.style.cssText = 'font-family: Arial, sans-serif; max-width: 1200px; margin: 0 auto; padding: 20px;';
    
    container.appendChild(buttonContainer);
    container.appendChild(templateContainer);
    container.appendChild(actionContainer);
    container.appendChild(statusContainer);
    container.appendChild(canvas);
    container.appendChild(statsElement);
    
    // Tambahkan container ke dokumen
    const targetElement = document.querySelector('.content-area') || document.body;
    targetElement.appendChild(container);
    
    // Setup event listeners untuk tombol template dan aksi
    document.getElementById('series-circuit').addEventListener('click', createSeriesCircuit);
    document.getElementById('parallel-circuit').addEventListener('click', createParallelCircuit);
    document.getElementById('mixed-circuit').addEventListener('click', createMixedCircuit);
    document.getElementById('clear-btn').addEventListener('click', clearCircuit);
    document.getElementById('simulate-btn').addEventListener('click', simulateCircuit);
    document.getElementById('save-btn').addEventListener('click', saveCircuit);
    document.getElementById('load-btn').addEventListener('click', loadCircuit);
  }
  
  // Fungsi untuk setup event listener
  function setupEventListeners() {
    // Event listener untuk template rangkaian
    const seriesCircuitBtn = document.getElementById('series-circuit');
    const parallelCircuitBtn = document.getElementById('parallel-circuit');
    const mixedCircuitBtn = document.getElementById('mixed-circuit');
    const clearBtn = document.getElementById('clear-btn');
    
    if (seriesCircuitBtn) seriesCircuitBtn.addEventListener('click', createSeriesCircuit);
    if (parallelCircuitBtn) parallelCircuitBtn.addEventListener('click', createParallelCircuit);
    if (mixedCircuitBtn) mixedCircuitBtn.addEventListener('click', createMixedCircuit);
    if (clearBtn) clearBtn.addEventListener('click', clearCircuit);
  
    // Event listener untuk aksi
    const simulateBtn = document.getElementById('simulate-btn');
    const saveBtn = document.getElementById('save-btn');
    const loadBtn = document.getElementById('load-btn');
    
    if (simulateBtn) simulateBtn.addEventListener('click', simulateCircuit);
    if (saveBtn) saveBtn.addEventListener('click', saveCircuit);
    if (loadBtn) loadBtn.addEventListener('click', loadCircuit);
  
    // Event listener untuk properti komponen
    setupComponentPropertyListeners();
  
    // Tambahkan event listener untuk modal simulasi
    const closeModalBtn = document.querySelector('.close-btn');
    if (closeModalBtn) {
      closeModalBtn.addEventListener('click', closeSimulationModal);
    }
  }
  
  // Fungsi untuk setup event listener properti komponen
  function setupComponentPropertyListeners() {
    const updateBatteryBtn = document.getElementById('update-battery');
    const updateResistorBtn = document.getElementById('update-resistor');
    const updateLedBtn = document.getElementById('update-led');
    const updateSwitchBtn = document.getElementById('update-switch');
    
    if (updateBatteryBtn) updateBatteryBtn.addEventListener('click', updateBatteryProperties);
    if (updateResistorBtn) updateResistorBtn.addEventListener('click', updateResistorProperties);
    if (updateLedBtn) updateLedBtn.addEventListener('click', updateLedProperties);
    if (updateSwitchBtn) updateSwitchBtn.addEventListener('click', updateSwitchProperties);
  
    // Event listener untuk properti komponen tambahan
    const updateCapacitorBtn = document.getElementById('update-capacitor');
    if (updateCapacitorBtn) {
      updateCapacitorBtn.addEventListener('click', updateCapacitorProperties);
    }
  
    const updateInductorBtn = document.getElementById('update-inductor');
    if (updateInductorBtn) {
      updateInductorBtn.addEventListener('click', updateInductorProperties);
    }
  
    const updateDiodeBtn = document.getElementById('update-diode');
    if (updateDiodeBtn) {
      updateDiodeBtn.addEventListener('click', updateDiodeProperties);
    }
  
    const updateAcSourceBtn = document.getElementById('update-acSource');
    if (updateAcSourceBtn) {
      updateAcSourceBtn.addEventListener('click', updateAcSourceProperties);
    }
  }
  
  // Modifikasi inisialisasi dokumen untuk menambahkan fungsi baru
  document.addEventListener('DOMContentLoaded', function() {
    // Tambahkan styles untuk komponen
    addComponentStyles();
    
    // Pastikan canvas ada
    canvas = ensureCanvasExists();
    
    // Buat modal simulasi
    createSimulationModal();
    
    // Inisialisasi canvas visualisasi
    const vizCanvas = document.getElementById('circuit-visualization');
    if (vizCanvas) {
      ctx = vizCanvas.getContext('2d');
    }
  
    // Cek apakah tombol komponen ada
    const componentButtons = document.querySelectorAll('.component-btn');
    if (componentButtons.length === 0) {
      console.warn('Component buttons not found. Creating default component buttons...');
      createDefaultComponentButtons();
    } else {
      // Event listener untuk tombol komponen
      componentButtons.forEach(button => {
        button.addEventListener('click', function() {
          const type = this.getAttribute('data-type');
          if (type === 'wire') {
            setMode('wiring');
          } else if (type === 'delete') {
            setMode('delete');
          } else {
            setMode('normal');
            addComponent(type);
          }
        });
      });
    }
  
    // Tambahkan event listener untuk template rangkaian dan aksi lainnya
    setupEventListeners();
    
    // Inisialisasi dengan rangkaian sederhana
    createSeriesCircuit();
    
    // Tampilkan pesan status
    updateStatusMessage('Simulator rangkaian elektronik siap digunakan.');
  });
  