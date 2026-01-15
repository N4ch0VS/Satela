// ==========================================
// 1. GESTIÓN DE MEMORIA (Solo Telemetría)
// ==========================================
// Limpiamos cualquier rastro de "estado" para que no persista al recargar
let logData = JSON.parse(localStorage.getItem('satela_registry')) || {
    altitud: Array(15).fill(null),
    velocidad: Array(15).fill(null),
    temp: "--",
    presion: "--",
    humedad: "--"
};

// LIMPIEZA DE SEGURIDAD:
// Si por error se guardó el estado antes, lo borramos de la memoria ahora mismo.
if (logData.estado) {
    delete logData.estado;
    localStorage.setItem('satela_registry', JSON.stringify(logData));
}

function guardarEnMemoria() {
    localStorage.setItem('satela_registry', JSON.stringify(logData));
}

// ==========================================
// 2. SISTEMA DE NOTIFICACIONES (TOAST)
// ==========================================
function showToast(message, type) {
    const container = document.getElementById('toastContainer');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    const icon = type === 'success' ? '✔' : '✖';
    toast.innerHTML = `<span>${icon}</span> <span>${message}</span>`;

    container.appendChild(toast);

    // Desaparece a los 3 segundos
    setTimeout(() => {
        toast.style.opacity = '0';
        setTimeout(() => toast.remove(), 500);
    }, 3000);
}

// ==========================================
// 3. DATOS DEL EQUIPO Y UI
// ==========================================
const teamMembers = [
    { 
        img: "https://gato-gag253.github.io/Satela/Imagenes/Sofia.jpg", 
        title: "Sofía Rojas", 
        text: "Especialista en comunicaciones y telemetría.", 
        email: "sg.rojas@alumno.etec.um.edu.ar",
    },
    { 
        img: "https://gato-gag253.github.io/Satela/Imagenes/Nacho.jpg", 
        title: "Juan Ignacio Calderón", 
        text: "Encargado del diseño estructural del CanSat.", 
        email: "jil.calderon@alumno.etec.um.edu.ar" 
    },
    { 
        img: "https://gato-gag253.github.io/Satela/Imagenes/Logo%20Satela.png", 
        title: "Gastón García", 
        text: "Desarrollador de software y sistemas embebidos.", 
        email: "gal.garcia@alumno.etec.um.edu.ar" 
    },
    { 
        img: "https://gato-gag253.github.io/Satela/Imagenes/Santy.jpg", 
        title: "Santiago Juárez", 
        text: "Analista de datos y control de misión.", 
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

// Navegación
function switchTab(tabName, event) {
    if(event) event.preventDefault();
    document.getElementById('view-datos').style.display = tabName === 'datos' ? 'block' : 'none';
    document.getElementById('view-cansat').style.display = tabName === 'cansat' ? 'block' : 'none';
    const links = document.querySelectorAll('.nav-link');
    links.forEach(link => link.classList.remove('active'));
    if(event) event.target.classList.add('active');
    const navbar = document.getElementById('mainNavbar');
    if (tabName === 'cansat') navbar.classList.add('navy-nav');
    else navbar.classList.remove('navy-nav');
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
    if (member.banner) popupBanner.style.backgroundImage = `url(${member.banner})`;
    else popupBanner.style.backgroundImage = 'linear-gradient(to right, #001a33, #004e92)';
    popupBg.style.display = "flex";
}
function closePopup() { if(popupBg) popupBg.style.display = "none"; }
if(popupBg) popupBg.onclick = (e) => { if (e.target === popupBg) closePopup(); };

// Tema
function toggleTheme(event) {
    if(event) { event.preventDefault(); event.stopPropagation(); }
    document.body.classList.toggle('dark-mode');
    const isDark = document.body.classList.contains('dark-mode');
    localStorage.setItem('dark-theme', isDark);
}

// ==========================================
// 4. GRÁFICOS (Chart.js)
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

// Inicializar Gráficos Pequeños
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

// Inicializar Gráficos Grandes
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

// Modal Control
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
// 5. LÓGICA DE CONEXIÓN (WATCHDOG)
// ==========================================
const estadoWidget = document.getElementById('widget-estado');
const estadoText = document.getElementById('Estado');
let connectionTimeout = null; // Variable para el temporizador

// Función Visual (Solo cambia colores)
function setConnectionStatus(isConnected) {
    if(!estadoWidget || !estadoText) return;

    if (isConnected) {
        // ACTIVO (VERDE)
        estadoWidget.classList.add('connected');
        estadoWidget.classList.remove('disconnected');
        
        // Si el texto decía "Desconectado", lo actualizamos a "Conectado"
        if (estadoText.innerText === "Desconectado") {
            estadoText.innerText = "Conectado";
        }
    } else {
        // INACTIVO (ROJO)
        estadoWidget.classList.add('disconnected');
        estadoWidget.classList.remove('connected');
        estadoText.innerText = "Desconectado";
    }
}

// Función que se llama cada vez que llega UN DATO
function signalActivity() {
    // 1. Ponemos Verde
    setConnectionStatus(true);

    // 2. Reiniciamos el temporizador de desconexión
    if (connectionTimeout) clearTimeout(connectionTimeout);

    // 3. Si pasan 5 segundos sin datos, se pone rojo automáticamente
    connectionTimeout = setTimeout(() => {
        setConnectionStatus(false);
        showToast("Señal perdida (Tiempo de espera)", "error");
    }, 5000); // 5000ms = 5 segundos
}

// ==========================================
// 6. MQTT Y CARGA INICIAL
// ==========================================

// Carga Inicial
window.onload = () => {
    // Tema
    if (localStorage.getItem('dark-theme') === 'true') document.body.classList.add('dark-mode');
    
    // Cargar datos numéricos (NO ESTADO)
    if(document.getElementById('dato-temp')) document.getElementById('dato-temp').innerText = logData.temp + " °C";
    if(document.getElementById('dato-presion')) document.getElementById('dato-presion').innerText = logData.presion;
    if(document.getElementById('dato-humedad')) document.getElementById('dato-humedad').innerText = logData.humedad + " %";
    
    const lastAlt = logData.altitud[14]; 
    const lastVel = logData.velocidad[14];
    if(document.getElementById('dato-altitud')) document.getElementById('dato-altitud').innerText = (lastAlt !== null ? lastAlt : "--") + " m";
    if(document.getElementById('dato-velocidad')) document.getElementById('dato-velocidad').innerText = (lastVel !== null ? lastVel : "--");

    // IMPORTANTE: Empezamos siempre desconectados
    setConnectionStatus(false);
};

// Conexión MQTT
const brokerUrl = 'wss://broker.hivemq.com:8884/mqtt';
const client = mqtt.connect(brokerUrl);

client.on('connect', () => {
    console.log(">> Conectado al Broker (Esperando datos...)");
    // NOTA: No ponemos setConnectionStatus(true) aquí. 
    // Solo mostramos notificación de que tenemos internet.
    showToast("Conectado al Broker MQTT", "success");
    client.subscribe('satela/#');
});

client.on('offline', () => {
    setConnectionStatus(false);
    showToast("Sin conexión a internet", "error");
});

client.on('message', (topic, message) => {
    // ¡LLEGÓ UN MENSAJE! Esto confirma que el cohete está vivo.
    signalActivity(); 

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
        document.getElementById('dato-temp').innerText = valorStr + " °C";
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

    // ESTADO (Mensaje de texto del cohete)
    if (topic === 'satela/estado') {
        if(estadoText) estadoText.innerText = valorStr;
        // Si el cohete manda explícitamente "Desconectado", forzamos rojo
        if(valorStr.toLowerCase() === "desconectado") {
            setConnectionStatus(false);
            if(connectionTimeout) clearTimeout(connectionTimeout); // Cancelamos el timer
        }
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