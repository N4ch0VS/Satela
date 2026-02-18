// Cargar datos guardados o inicializar valores por defecto
let logData = JSON.parse(localStorage.getItem('satela_registry')) || {
    altitud: Array(15).fill(null),
    velocidad: Array(15).fill(null),
    temp: "--",
    presion: "--",
    humedad: "--"
};
if (logData.estado) {
    delete logData.estado;
    localStorage.setItem('satela_registry', JSON.stringify(logData));
}

// Guardar datos en localStorage
function guardarEnMemoria() {
    localStorage.setItem('satela_registry', JSON.stringify(logData));
}

// Mostrar notificacion toast
function showToast(message, type) {
    const container = document.getElementById('toastContainer');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    const icon = type === 'success' ? '✔' : '✖';
    toast.innerHTML = `<span>${icon}</span> <span>${message}</span>`;

    container.appendChild(toast);

    // Desaparecer a los 3 segundos
    setTimeout(() => {
        toast.style.opacity = '0';
        setTimeout(() => toast.remove(), 500);
    }, 3000);
}

// Datos del equipo
const teamMembers = [
    { 
        img: "https://satela.qzz.io/Imagenes/Sofia.jpg", 
        title: "Sofía Rojas", 
        text: " ", 
        email: "sg.rojas@alumno.etec.um.edu.ar",
    },
    { 
        img: "https://satela.qzz.io/Imagenes/Nacho.jpg", 
        title: "Juan Ignacio Calderón", 
        text: "", 
        email: "jil.calderon@alumno.etec.um.edu.ar" 
    },
    { 
        img: "https://satela.qzz.io/Imagenes/Logo%20Satela.png", 
        title: "Gastón García", 
        text: "", 
        email: "gal.garcia@alumno.etec.um.edu.ar" 
    },
    { 
        img: "https://satela.qzz.io/Imagenes/Santy.jpg", 
        title: "Santiago Juárez", 
        text: "", 
        email: "sc.juarez@alumno.etec.um.edu.ar" 
    },
    { 
        img: "https://satela.qzz.io/Imagenes/Logo%20Satela.png", 
        title: "Agustín Cerroni", 
        text: "", 
        email: "a.cerroni@alumno.etec.um.edu.ar" 
    }
];

// Generar tarjetas del equipo
const container = document.getElementById("team-container");
if(container) {
    teamMembers.forEach((member, index) => {
        const card = document.createElement("div");
        card.classList.add("team-card");
        const imgUrl = member.img || 'https://satela.qzz.io/Imagenes/Logo%20Satela.png'; 
        card.innerHTML = `
            <img src="${imgUrl}" alt="${member.title}" onerror="this.src='https://satela.qzz.io/Imagenes/Logo%20Satela.png'">
            <h3>${member.title}</h3>
        `;
        card.onclick = () => openPopup(index);
        container.appendChild(card);
    });
}

// Cambiar entre pestañas (Datos / Equipo)
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

// Popup del equipo
const popupBg = document.getElementById("popupBg");
const popupImg = document.getElementById("popupImg");
const popupTitle = document.getElementById("popupTitle");
const popupText = document.getElementById("popupText");
const popupEmail = document.getElementById("popupEmail");
const popupBanner = document.getElementById("popupBanner");

// Abrir popup con datos del miembro
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

// Cerrar popup
function closePopup() { if(popupBg) popupBg.style.display = "none"; }
if(popupBg) popupBg.onclick = (e) => { if (e.target === popupBg) closePopup(); };

// Cambiar tema (oscuro / claro)
function toggleTheme(event) {
    if(event) { event.preventDefault(); event.stopPropagation(); }
    document.body.classList.toggle('dark-mode');
    const isDark = document.body.classList.contains('dark-mode');
    localStorage.setItem('dark-theme', isDark);
}

// Configuracion base de graficos
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

// Iniciar grafico pequeño de altitud
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

// Iniciar grafico pequeño de velocidad
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

// Configuracion para graficos grandes (con eje X visible)
const bigChartConfig = JSON.parse(JSON.stringify(chartConfig)); 
bigChartConfig.options.scales.x.display = true; 
bigChartConfig.options.scales.y.grid.color = 'rgba(100, 100, 100, 0.2)';

// Iniciar grafico grande de altitud
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

// Iniciar grafico grande de velocidad
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

// Control del modal de graficos
const chartModalBg = document.getElementById('chartModalBg');
const canvasBigAlt = document.getElementById('bigChartAltitud');
const canvasBigVel = document.getElementById('bigChartVelocidad');
const chartModalTitle = document.getElementById('chartModalTitle');

// Abrir modal segun tipo de grafico
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

// Cerrar modal de graficos
function closeChartModal() { if(chartModalBg) chartModalBg.style.display = 'none'; }
if(chartModalBg) chartModalBg.onclick = (e) => { if(e.target === chartModalBg) closeChartModal(); }

// Actualizar datos del grafico con nuevo valor
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

// Estado de conexion
const estadoWidget = document.getElementById('widget-estado');
const estadoText = document.getElementById('Estado');
let connectionTimeout = null;

// Actualizar LED de estado (verde/rojo)
function setConnectionStatus(isConnected) {
    if(!estadoWidget || !estadoText) return;

    if (isConnected) {
        estadoWidget.classList.add('connected');
        estadoWidget.classList.remove('disconnected');
        if (estadoText.innerText === "Desconectado") {
            estadoText.innerText = "Conectado";
        }
    } else {
        estadoWidget.classList.add('disconnected');
        estadoWidget.classList.remove('connected');
        estadoText.innerText = "Desconectado";
    }
}

// Señalizar actividad (reinicia temporizador de desconexion)
function signalActivity() {
    setConnectionStatus(true);
    if (connectionTimeout) clearTimeout(connectionTimeout);

    // Si pasan 5 segundos sin datos, se marca como desconectado
    connectionTimeout = setTimeout(() => {
        setConnectionStatus(false);
        showToast("Señal perdida (Tiempo de espera)", "error");
    }, 5000);
    }

// Inicializacion al cargar la pagina
window.onload = () => {
    // Aplicar tema guardado
    if (localStorage.getItem('dark-theme') === 'true') document.body.classList.add('dark-mode');

    // Cargar ultimos datos guardados
    if(document.getElementById('dato-temp')) document.getElementById('dato-temp').innerText = logData.temp + " °C";
    if(document.getElementById('dato-presion')) document.getElementById('dato-presion').innerText = logData.presion;
    if(document.getElementById('dato-humedad')) document.getElementById('dato-humedad').innerText = logData.humedad + " %";
    
    const lastAlt = logData.altitud[14]; 
    const lastVel = logData.velocidad[14];
    if(document.getElementById('dato-altitud')) document.getElementById('dato-altitud').innerText = (lastAlt !== null ? lastAlt : "--") + " m";
    if(document.getElementById('dato-velocidad')) document.getElementById('dato-velocidad').innerText = (lastVel !== null ? lastVel : "--");
    setConnectionStatus(false);
};

// Conexion MQTT al broker
const brokerUrl = 'wss://broker.hivemq.com:8884/mqtt';
const client = mqtt.connect(brokerUrl);

// Al conectarse al broker
client.on('connect', () => {
    showToast("Conectado a MQTT", "success");
    client.subscribe('satela/#');
});

// Al perder conexion
client.on('offline', () => {
    setConnectionStatus(false);
    showToast("Conexion perdida", "error");
});

// Procesar mensajes recibidos por topico
client.on('message', (topic, message) => {
    signalActivity(); 

    const valorStr = message.toString();
    const valorNum = parseFloat(valorStr);

    // Altitud
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

    // Temperatura
    if (topic === 'satela/temp') {
        logData.temp = valorStr;
        guardarEnMemoria();
        document.getElementById('dato-temp').innerText = valorStr + " °C";
    }

    // Presion
    if (topic === 'satela/presion') {
        logData.presion = valorStr;
        guardarEnMemoria();
        document.getElementById('dato-presion').innerText = valorStr;
    }

    // Humedad
    if (topic === 'satela/humedad') {
        logData.humedad = valorStr;
        guardarEnMemoria();
        document.getElementById('dato-humedad').innerText = valorStr + " %";
    }

    // Estado de mision
    if (topic === 'satela/estado') {
        if(estadoText) estadoText.innerText = valorStr;
        if(valorStr.toLowerCase() === "desconectado") {
            setConnectionStatus(false);
            if(connectionTimeout) clearTimeout(connectionTimeout); 
        }
    }

    // Velocidad
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