// ==========================================
// 1. GESTIÓN DE MEMORIA (Datos Persistentes)
// ==========================================
// NOTA: No guardamos 'estado' aquí para que sea un indicador en tiempo real.
let logData = JSON.parse(localStorage.getItem('satela_registry')) || {
    altitud: Array(15).fill(null),
    velocidad: Array(15).fill(null),
    temp: "--",
    presion: "--",
    humedad: "--"
};

function guardarEnMemoria() {
    localStorage.setItem('satela_registry', JSON.stringify(logData));
}

// ==========================================
// 2. DATOS DEL EQUIPO (Tarjetas de Contacto)
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

// Generar las tarjetas en el HTML automáticamente
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
        // Al hacer click, abrimos el popup
        card.onclick = () => openPopup(index);
        container.appendChild(card);
    });
}

// ==========================================
// 3. INTERFAZ DE USUARIO (Menú, Popups, Tema)
// ==========================================

// Cambiar entre pestaña DATOS y CANSAT
function switchTab(tabName, event) {
    if(event) event.preventDefault();
    
    // Mostrar/Ocultar secciones
    document.getElementById('view-datos').style.display = tabName === 'datos' ? 'block' : 'none';
    document.getElementById('view-cansat').style.display = tabName === 'cansat' ? 'block' : 'none';
    
    // Actualizar clase 'active' en el menú
    const links = document.querySelectorAll('.nav-link');
    links.forEach(link => link.classList.remove('active'));
    if(event) event.target.classList.add('active');

    // Cambiar color de la barra de navegación (Azul en Cansat)
    const navbar = document.getElementById('mainNavbar');
    if (tabName === 'cansat') {
        navbar.classList.add('navy-nav');
    } else {
        navbar.classList.remove('navy-nav');
    }
}

// Lógica del Popup de Alumnos
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
    
    // Fondo del banner (imagen o gradiente)
    if (member.banner) {
        popupBanner.style.backgroundImage = `url(${member.banner})`;
    } else {
        popupBanner.style.backgroundImage = 'linear-gradient(to right, #001a33, #004e92)';
    }
    popupBg.style.display = "flex";
}

function closePopup() {
    popupBg.style.display = "none";
}

// Cerrar al hacer click fuera de la tarjeta
if(popupBg) {
    popupBg.onclick = (e) => { 
        if (e.target === popupBg) closePopup(); 
    };
}

// Modo Oscuro
function toggleTheme(event) {
    if(event) {
        event.preventDefault();
        event.stopPropagation();
    }
    document.body.classList.toggle('dark-mode');
    
    // Guardar preferencia
    const isDark = document.body.classList.contains('dark-mode');
    localStorage.setItem('dark-theme', isDark);
}

// ==========================================
// 4. CONFIGURACIÓN DE GRÁFICOS (Chart.js)
// ==========================================

const chartConfig = {
    type: 'line',
    options: {
        responsive: true,
        maintainAspectRatio: false,
        animation: false, // Desactivar animación para rendimiento en tiempo real
        plugins: { legend: { display: false } },
        scales: {
            x: { display: false },
            y: { 
                grid: { color: 'rgba(200, 200, 200, 0.1)' },
                ticks: { color: '#888', font: { size: 10 } }
            }
        },
        elements: {
            line: { tension: 0, borderWidth: 2 }, // Líneas rectas (puntos conectados)
            point: { radius: 3, hoverRadius: 5, backgroundColor: '#fff' }
        }
    }
};

let chartAltitud, chartVelocidad;
let bigChartAltitud, bigChartVelocidad;

// --- Inicializar Gráficos Pequeños (Widgets) ---
// Usamos los datos guardados en 'logData' para que no aparezcan vacíos

if(document.getElementById('chartAltitud')) {
    const ctxAlt = document.getElementById('chartAltitud').getContext('2d');
    chartAltitud = new Chart(ctxAlt, {
        ...chartConfig,
        data: {
            labels: Array(15).fill(''),
            datasets: [{
                data: [...logData.altitud], // Cargar historial
                borderColor: '#007bff',
                pointBackgroundColor: '#007bff',
                backgroundColor: 'rgba(0, 123, 255, 0.1)',
                fill: true
            }]
        }
    });
}

if(document.getElementById('chartVelocidad')) {
    const ctxVel = document.getElementById('chartVelocidad').getContext('2d');
    chartVelocidad = new Chart(ctxVel, {
        ...chartConfig,
        data: {
            labels: Array(15).fill(''),
            datasets: [{
                data: [...logData.velocidad], // Cargar historial
                borderColor: '#ff9800',
                pointBackgroundColor: '#ff9800',
                backgroundColor: 'rgba(255, 152, 0, 0.1)',
                fill: true
            }]
        }
    });
}

// --- Inicializar Gráficos Grandes (Modal) ---
const bigChartConfig = JSON.parse(JSON.stringify(chartConfig)); 
bigChartConfig.options.scales.x.display = true; // Mostrar eje X en los grandes
bigChartConfig.options.scales.y.grid.color = 'rgba(100, 100, 100, 0.2)';

if(document.getElementById('bigChartAltitud')) {
    const ctxBigAlt = document.getElementById('bigChartAltitud').getContext('2d');
    bigChartAltitud = new Chart(ctxBigAlt, {
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
    const ctxBigVel = document.getElementById('bigChartVelocidad').getContext('2d');
    bigChartVelocidad = new Chart(ctxBigVel, {
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

// --- Lógica del Modal de Gráficos ---
const chartModalBg = document.getElementById('chartModalBg');
const canvasBigAlt = document.getElementById('bigChartAltitud');
const canvasBigVel = document.getElementById('bigChartVelocidad');
const chartModalTitle = document.getElementById('chartModalTitle');

function openChartModal(type) {
    if(!chartModalBg) return;
    chartModalBg.style.display = 'flex';
    
    // Mostrar solo el gráfico correspondiente
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

function closeChartModal() {
    if(chartModalBg) chartModalBg.style.display = 'none';
}

if(chartModalBg) {
    chartModalBg.onclick = function(e) {
        if(e.target === chartModalBg) closeChartModal();
    }
}

// Función auxiliar para actualizar gráficos en tiempo real
function updateChart(chart, value) {
    if(!chart) return;
    const data = chart.data.datasets[0].data;
    const labels = chart.data.labels;

    // Desplazar datos (FIFO)
    data.shift();
    data.push(value);
    labels.shift();
    labels.push('');
    
    chart.update();
}


// ==========================================
// 5. CARGA INICIAL (Al abrir la página)
// ==========================================
window.onload = () => {
    // 1. Cargar Tema (Oscuro/Claro)
    if (localStorage.getItem('dark-theme') === 'true') {
        document.body.classList.add('dark-mode');
    }

    // 2. Cargar últimos valores de Sensores desde Memoria
    if(document.getElementById('dato-temp')) document.getElementById('dato-temp').innerText = logData.temp + " °C";
    if(document.getElementById('dato-presion')) document.getElementById('dato-presion').innerText = logData.presion;
    if(document.getElementById('dato-humedad')) document.getElementById('dato-humedad').innerText = logData.humedad + " %";
    
    // 3. Cargar últimos valores de Gráficos en el texto
    const lastAlt = logData.altitud[14]; 
    const lastVel = logData.velocidad[14];
    
    if(document.getElementById('dato-altitud')) document.getElementById('dato-altitud').innerText = (lastAlt !== null ? lastAlt : "--") + " m";
    if(document.getElementById('dato-velocidad')) document.getElementById('dato-velocidad').innerText = (lastVel !== null ? lastVel : "--");
    
    // IMPORTANTE: Inicializamos el estado en "Desconectado" (Luz Roja)
    // No cargamos el texto de misión guardado para evitar confusión.
    setConnectionStatus(false);
};


// ==========================================
// 6. LÓGICA DE CONEXIÓN Y MQTT
// ==========================================

const estadoWidget = document.getElementById('widget-estado');
const estadoText = document.getElementById('Estado');

// Función visual: Controla el LED (Borde y Punto)
// NO cambia el texto de la misión, solo el indicador de conexión.
function setConnectionStatus(isConnected) {
    if(!estadoWidget) return;

    if (isConnected) {
        estadoWidget.classList.add('connected');
        estadoWidget.classList.remove('disconnected');
    } else {
        estadoWidget.classList.add('disconnected');
        estadoWidget.classList.remove('connected');
    }
}

// Conexión al Broker
const brokerUrl = 'wss://broker.hivemq.com:8884/mqtt';
console.log("Conectando a hivemq..."); 
const client = mqtt.connect(brokerUrl);

// Evento: Conectado (Luz Verde)
client.on('connect', () => {
    console.log(">> Conectado a HiveMQ");
    setConnectionStatus(true); 
    client.subscribe('satela/#');
});

// Evento: Desconectado (Luz Roja)
client.on('offline', () => {
    console.log(">> Offline");
    setConnectionStatus(false); 
});

client.on('close', () => {
    setConnectionStatus(false);
});

// Evento: Mensaje Recibido
client.on('message', (topic, message) => {
    const valorStr = message.toString();
    const valorNum = parseFloat(valorStr);

    // --- ALTITUD ---
    if (topic === 'satela/altitud') {
        document.getElementById('dato-altitud').innerText = valorStr + " m";
        if(!isNaN(valorNum)) {
            // Guardar en memoria y actualizar gráficos
            logData.altitud.push(valorNum);
            if(logData.altitud.length > 15) logData.altitud.shift(); 
            guardarEnMemoria();
            
            updateChart(chartAltitud, valorNum);
            updateChart(bigChartAltitud, valorNum);
        }
    }

    // --- TEMPERATURA ---
    if (topic === 'satela/temp') {
        logData.temp = valorStr;
        guardarEnMemoria();
        
        const el = document.getElementById('dato-temp');
        if(el) {
            el.innerText = valorStr + " °C";
            // Alerta visual simple si supera 40 grados
            el.style.color = valorNum > 40 ? '#ff4444' : ''; 
        }
    }

    // --- PRESIÓN ---
    if (topic === 'satela/presion') {
        logData.presion = valorStr;
        guardarEnMemoria();
        document.getElementById('dato-presion').innerText = valorStr;
    }

    // --- HUMEDAD ---
    if (topic === 'satela/humedad') {
        logData.humedad = valorStr;
        guardarEnMemoria();
        document.getElementById('dato-humedad').innerText = valorStr + " %";
    }

    // --- ESTADO DE MISIÓN (Texto) ---
    if (topic === 'satela/estado') {
        if(estadoText) estadoText.innerText = valorStr;
    }

    // --- VELOCIDAD ---
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