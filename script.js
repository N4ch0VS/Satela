// ==========================================
// 1. GESTIÓN DE MEMORIA (Solo Telemetría)
// ==========================================
// Limpiamos cualquier "estado" que haya quedado guardado por error antes
let logData = JSON.parse(localStorage.getItem('satela_registry')) || {
    altitud: Array(15).fill(null),
    velocidad: Array(15).fill(null),
    temp: "--",
    presion: "--",
    humedad: "--"
};

// Asegurarnos de que NO existe propiedad de estado en la memoria
if (logData.estado) {
    delete logData.estado;
    localStorage.setItem('satela_registry', JSON.stringify(logData));
}

function guardarEnMemoria() {
    // Solo guardamos números, nunca el estado de conexión
    localStorage.setItem('satela_registry', JSON.stringify(logData));
}

// ==========================================
// 2. SISTEMA DE NOTIFICACIONES (NUEVO)
// ==========================================
function showToast(message, type) {
    const container = document.getElementById('toastContainer');
    if (!container) return;

    // Crear elemento
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    
    // Icono según tipo
    const icon = type === 'success' ? '✔' : '✖';
    toast.innerHTML = `<span>${icon}</span> <span>${message}</span>`;

    // Agregar al HTML
    container.appendChild(toast);

    // Eliminar del DOM después de que termine la animación (3.5s)
    setTimeout(() => {
        toast.remove();
    }, 3500);
}

// ==========================================
// 3. DATOS DEL EQUIPO
// ==========================================
const teamMembers = [
    { 
        img: "https://gato-gag253.github.io/Satela/Imagenes/Sofia.jpg", 
        title: "Sofía Rojas", 
        text: "", 
        email: "sg.rojas@alumno.etec.um.edu.ar",
    },
    { 
        img: "https://gato-gag253.github.io/Satela/Imagenes/Nacho.jpg", 
        title: "Juan Ignacio Calderón", 
        text: "", 
        email: "jil.calderon@alumno.etec.um.edu.ar" 
    },
    { 
        img: "https://gato-gag253.github.io/Satela/Imagenes/Logo%20Satela.png", 
        title: "Gastón García", 
        text: "", 
        email: "gal.garcia@alumno.etec.um.edu.ar" 
    },
    { 
        img: "https://gato-gag253.github.io/Satela/Imagenes/Santy.jpg", 
        title: "Santiago Juárez", 
        text: "", 
        email: "sc.juarez@alumno.etec.um.edu.ar" 
    },
    { 
        img: "https://gato-gag253.github.io/Satela/Imagenes/Logo%20Satela.png", 
        title: "Agustín Cerroni", 
        text: "Responsable de logística y recuperación.", 
        email: "a.cerroni@alumno.etec.um.edu.ar" 
    }
];

const container = document.getElementById("team-container");
if(container) {
    teamMembers.forEach((member, index) => {
        const card = document.createElement("div");
        card.classList.add("team-card");
        const imgUrl = member.img || 'tu-logo.png'; 
        card.innerHTML = `
            <img src="${imgUrl}" alt="${member.title}" onerror="this.src='tu-logo.png'">
            <h3>${member.title}</h3>
        `;
        card.onclick = () => openPopup(index);
        container.appendChild(card);
    });
}

// ==========================================
// 4. INTERFAZ Y NAVEGACIÓN
// ==========================================
function switchTab(tabName, event) {
    if(event) event.preventDefault();
    document.getElementById('view-datos').style.display = tabName === 'datos' ? 'block' : 'none';
    document.getElementById('view-cansat').style.display = tabName === 'cansat' ? 'block' : 'none';
    
    const links = document.querySelectorAll('.nav-link');
    links.forEach(link => link.classList.remove('active'));
    if(event) event.target.classList.add('active');

    const navbar = document.getElementById('mainNavbar');
    if (tabName === 'cansat') {
        navbar.classList.add('navy-nav');
    } else {
        navbar.classList.remove('navy-nav');
    }
}

// Popup
const popupBg = document.getElementById("popupBg");
const popupImg = document.getElementById("popupImg");
const popupTitle = document.getElementById("popupTitle");
const popupText = document.getElementById("popupText");
const popupEmail = document.getElementById("popupEmail");
const popupBanner = document.getElementById("popupBanner");

function openPopup(index) {
    const member = teamMembers[index];
    popupImg.src = member.img;
    popupTitle.textContent = member.title;
    popupText.textContent = member.text;
    popupEmail.textContent = member.email;
    popupEmail.href = "mailto:" + member.email;
    
    if (member.banner) {
        popupBanner.style.backgroundImage = `url(${member.banner})`;
    } else {
        popupBanner.style.backgroundImage = 'linear-gradient(to right, #001a33, #004e92)';
    }
    popupBg.style.display = "flex";
}
function closePopup() { if(popupBg) popupBg.style.display = "none"; }
if(popupBg) popupBg.onclick = (e) => { if (e.target === popupBg) closePopup(); };

// Modo Oscuro
function toggleTheme(event) {
    if(event) {
        event.preventDefault();
        event.stopPropagation();
    }
    document.body.classList.toggle('dark-mode');
    const isDark = document.body.classList.contains('dark-mode');
    localStorage.setItem('dark-theme', isDark);
}

// ==========================================
// 5. GRÁFICOS (Chart.js)
// ==========================================
const chartConfig = {
    type: 'line',
    options: {
        responsive: true,
        maintainAspectRatio: false,
        animation: false, 
        plugins: { legend: { display: false } },
        scales: {
            x: { display: false },
            y: { 
                grid: { color: 'rgba(200, 200, 200, 0.1)' },
                ticks: { color: '#888', font: { size: 10 } }
            }
        },
        elements: {
            line: { tension: 0, borderWidth: 2 },
            point: { radius: 3, hoverRadius: 5, backgroundColor: '#fff' }
        }
    }
};

let chartAltitud, chartVelocidad, bigChartAltitud, bigChartVelocidad;

// Gráficos Pequeños
if(document.getElementById('chartAltitud')) {
    chartAltitud = new Chart(document.getElementById('chartAltitud').getContext('2d'), {
        ...chartConfig,
        data: {
            labels: Array(15).fill(''),
            datasets: [{
                data: [...logData.altitud],
                borderColor: '#007bff',
                pointBackgroundColor: '#007bff',
                backgroundColor: 'rgba(0, 123, 255, 0.1)',
                fill: true
            }]
        }
    });
}

if(document.getElementById('chartVelocidad')) {
    chartVelocidad = new Chart(document.getElementById('chartVelocidad').getContext('2d'), {
        ...chartConfig,
        data: {
            labels: Array(15).fill(''),
            datasets: [{
                data: [...logData.velocidad],
                borderColor: '#ff9800',
                pointBackgroundColor: '#ff9800',
                backgroundColor: 'rgba(255, 152, 0, 0.1)',
                fill: true
            }]
        }
    });
}

// Gráficos Grandes
const bigChartConfig = JSON.parse(JSON.stringify(chartConfig)); 
bigChartConfig.options.scales.x.display = true; 
bigChartConfig.options.scales.y.grid.color = 'rgba(100, 100, 100, 0.2)';

if(document.getElementById('bigChartAltitud')) {
    bigChartAltitud = new Chart(document.getElementById('bigChartAltitud').getContext('2d'), {
        ...bigChartConfig,
        data: {
            labels: Array(15).fill(''),
            datasets: [{
                label: 'Altitud (m)',
                data: [...logData.altitud],
                borderColor: '#007bff',
                backgroundColor: 'rgba(0, 123, 255, 0.2)',
                fill: true,
                pointRadius: 4
            }]
        }
    });
}

if(document.getElementById('bigChartVelocidad')) {
    bigChartVelocidad = new Chart(document.getElementById('bigChartVelocidad').getContext('2d'), {
        ...bigChartConfig,
        data: {
            labels: Array(15).fill(''),
            datasets: [{
                label: 'Velocidad (m/s)',
                data: [...logData.velocidad],
                borderColor: '#ff9800',
                backgroundColor: 'rgba(255, 152, 0, 0.2)',
                fill: true,
                pointRadius: 4
            }]
        }
    });
}

// Modal Gráficos
const chartModalBg = document.getElementById('chartModalBg');
const canvasBigAlt = document.getElementById('bigChartAltitud');
const canvasBigVel = document.getElementById('bigChartVelocidad');
const chartModalTitle = document.getElementById('chartModalTitle');

function openChartModal(type) {
    if(!chartModalBg) return;
    chartModalBg.style.display = 'flex';
    if (type === 'altitud') {
        if(chartModalTitle) chartModalTitle.innerText = "HISTORIAL DE ALTITUD EN TIEMPO REAL";
        if(canvasBigAlt) canvasBigAlt.style.display = 'block';
        if(canvasBigVel) canvasBigVel.style.display = 'none';
    } else {
        if(chartModalTitle) chartModalTitle.innerText = "HISTORIAL DE VELOCIDAD EN TIEMPO REAL";
        if(canvasBigAlt) canvasBigAlt.style.display = 'none';
        if(canvasBigVel) canvasBigVel.style.display = 'block';
    }
}
function closeChartModal() { if(chartModalBg) chartModalBg.style.display = 'none'; }
if(chartModalBg) chartModalBg.onclick = (e) => { if(e.target === chartModalBg) closeChartModal(); }

function updateChart(chart, value) {
    if(!chart) return;
    const data = chart.data.datasets[0].data;
    const labels = chart.data.labels;
    data.shift();
    data.push(value);
    labels.shift();
    labels.push('');
    chart.update();
}

// ==========================================
// 6. CARGA INICIAL (OnLoad)
// ==========================================
const estadoWidget = document.getElementById('widget-estado');
const estadoText = document.getElementById('Estado');

// Función que fuerza el estado visual
function setConnectionStatus(isConnected) {
    if(!estadoWidget) return;
    
    if (isConnected) {
        // Conectado: Verde
        estadoWidget.classList.add('connected');
        estadoWidget.classList.remove('disconnected');
    } else {
        // Desconectado: Rojo
        estadoWidget.classList.add('disconnected');
        estadoWidget.classList.remove('connected');
        
        // OPCIONAL: Si quieres que el texto cambie automáticamente a "Desconectado" 
        // cuando se pierde la señal, descomenta la siguiente línea:
        if(estadoText) estadoText.innerText = "Desconectado";
    }
}

window.onload = () => {
    // 1. Cargar Tema
    if (localStorage.getItem('dark-theme') === 'true') {
        document.body.classList.add('dark-mode');
    }

    // 2. Cargar Textos de Memoria
    if(document.getElementById('dato-temp')) document.getElementById('dato-temp').innerText = logData.temp + " °C";
    if(document.getElementById('dato-presion')) document.getElementById('dato-presion').innerText = logData.presion;
    if(document.getElementById('dato-humedad')) document.getElementById('dato-humedad').innerText = logData.humedad + " %";
    
    // 3. Cargar Gráficos en Texto
    const lastAlt = logData.altitud[14]; 
    const lastVel = logData.velocidad[14];
    
    if(document.getElementById('dato-altitud')) document.getElementById('dato-altitud').innerText = (lastAlt !== null ? lastAlt : "--") + " m";
    if(document.getElementById('dato-velocidad')) document.getElementById('dato-velocidad').innerText = (lastVel !== null ? lastVel : "--");

    // 4. FORZAR ESTADO DESCONECTADO AL INICIAR
    // Esto asegura que nunca aparezca verde al recargar si no hay conexión real.
    setConnectionStatus(false); 
};

// ==========================================
// 7. MQTT Y CONEXIÓN
// ==========================================
const brokerUrl = 'wss://broker.hivemq.com:8884/mqtt';
console.log("Iniciando conexión MQTT..."); 

const client = mqtt.connect(brokerUrl);

// --- EVENTOS DE CONEXIÓN ---

client.on('connect', () => {
    console.log(">> Conectado a HiveMQ");
    
    // 1. Cambiar LED a Verde
    setConnectionStatus(true);
    
    // 2. Mostrar Notificación Verde
    showToast("Conectado al Servidor", "success");

    client.subscribe('satela/#');
});

client.on('offline', () => {
    console.log(">> Offline");
    
    // 1. Cambiar LED a Rojo
    setConnectionStatus(false);
    
    // 2. Mostrar Notificación Roja
    showToast("Conexión Perdida", "error");
});

client.on('error', (err) => {
    console.error("Error MQTT:", err);
    setConnectionStatus(false);
    showToast("Error de Conexión", "error");
});

// --- RECEPCIÓN DE MENSAJES ---

client.on('message', (topic, message) => {
    const valorStr = message.toString();
    const valorNum = parseFloat(valorStr);

    // ALTITUD
    if (topic === 'satela/altitud') {
        document.getElementById('dato-altitud').innerText = valorStr + " m";
        if(!isNaN(valorNum)) {
            logData.altitud.push(valorNum);
            if(logData.altitud.length > 15) logData.altitud.shift(); 
            guardarEnMemoria();
            updateChart(chartAltitud, valorNum);
            updateChart(bigChartAltitud, valorNum);
        }
    }

    // TEMPERATURA
    if (topic === 'satela/temp') {
        logData.temp = valorStr;
        guardarEnMemoria();
        const el = document.getElementById('dato-temp');
        if(el) {
            el.innerText = valorStr + " °C";
            el.style.color = valorNum > 40 ? '#ff4444' : ''; 
        }
    }

    // PRESIÓN
    if (topic === 'satela/presion') {
        logData.presion = valorStr;
        guardarEnMemoria();
        document.getElementById('dato-presion').innerText = valorStr;
    }

    // HUMEDAD
    if (topic === 'satela/humedad') {
        logData.humedad = valorStr;
        guardarEnMemoria();
        document.getElementById('dato-humedad').innerText = valorStr + " %";
    }

    // ESTADO DE MISIÓN (Texto)
    if (topic === 'satela/estado') {
        // Solo actualizamos el texto visualmente. NO GUARDAMOS NADA.
        if(estadoText) estadoText.innerText = valorStr;
    }

    // VELOCIDAD
    if (topic === 'satela/velocidad') {
        document.getElementById('dato-velocidad').innerText = valorStr;
        if(!isNaN(valorNum)) {
            logData.velocidad.push(valorNum);
            if(logData.velocidad.length > 15) logData.velocidad.shift();
            guardarEnMemoria();
            updateChart(chartVelocidad, valorNum);
            updateChart(bigChartVelocidad, valorNum);
        }
    }
});