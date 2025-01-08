/* IMPORTAÇÔES */

import { tasksArray, syncTasks } from "./app.js";

/* VARIÁVEIS */

var barGraphicsDiv = document.getElementById('barGraphics');
var graphicsElement = document.getElementById('graphics');
var drawInGraphics = graphicsElement.getContext('2d');
var selectGraphics = document.getElementById('selectGraphics');

/* FUNÇÔES */

function arcCircle(centerX, centerY, radius, startAngle, endAngle, color) {
    let currentAngle = startAngle;

    function drawStep() {
        if (Number(currentAngle.toFixed(2)) > endAngle) return; // Sai quando o ângulo final for alcançado

        drawInGraphics.fillStyle = color;
        drawInGraphics.beginPath();
        drawInGraphics.moveTo(centerX, centerY);
        drawInGraphics.arc(centerX, centerY, radius, startAngle * Math.PI, currentAngle * Math.PI);
        drawInGraphics.lineTo(centerX, centerY);
        drawInGraphics.closePath();
        drawInGraphics.fill();

        currentAngle += 0.1; // Incrementa o ângulo
        setTimeout(drawStep, 50); // Próxima execução em 10ms
    }

    drawStep(); // Inicia o desenho
}

function returnGraphicsPercentage(taskType) {
    if (selectGraphics.value == "Gráfico de Pizza") {
        return (2 * taskType) / tasksArray.length;
    } else {
        return (100 * taskType) / tasksArray.length;
    }
}


function constructPizzaGraphics(radius, taskUnfinishedPercent, taskNotStartedPercent) {
    var centerX = graphicsElement.width / 2;
    var centerY = graphicsElement.height / 2;

    arcCircle(centerX, centerY, radius, 0, taskNotStartedPercent, 'red');
    arcCircle(centerX, centerY, radius, taskNotStartedPercent, taskNotStartedPercent + taskUnfinishedPercent, 'white');
    arcCircle(centerX, centerY, radius, taskUnfinishedPercent + taskNotStartedPercent,  2, 'green');
}

function createGraphicBar(percent, color) {
    var div = document.createElement('div');
    div.classList.add('graphicBar');
    div.style.backgroundColor = `${color}`;
    barGraphicsDiv.appendChild(div);
    div.style.height = `0%`;
    setTimeout(() => {
        div.style.height = `${percent}%`;
    }, 1);  
}

function detectTasks(content) {
    var numberOfTasks = 0;

    const regex = /<taskProgress>(.*?)<\/taskProgress>/; // Captura o conteúdo dentro de <taskProgress>

    for (var i = 0; i < tasksArray.length; i++) {
        const match = tasksArray[i].match(regex); // Verifica se há uma correspondência

        var taskStatus = match[1];

        if (taskStatus == content) {
            numberOfTasks++;
        } else if (taskStatus == content) {
            numberOfTasks++;
        }
    }

    return numberOfTasks;
}

function resetGraphics() {
    if (selectGraphics.value == "Gráfico de Pizza") {
        drawInGraphics.clearRect(0, 0, graphicsElement.width, graphicsElement.height);
        graphicsElement.style.display = 'block';
        barGraphicsDiv.style.display = 'none';
    } else {
        graphicsElement.style.display = 'none';
        barGraphicsDiv.style.display = 'flex';

        if (barGraphicsDiv.childNodes.length > 0) {
            while (barGraphicsDiv.childNodes.length > 0) {
                barGraphicsDiv.removeChild(barGraphicsDiv.firstChild);
            }
        }
    }
}

function constructBarGraphics (taskUnfinishedPercent, taskNotStartedPercent) {
    createGraphicBar(taskUnfinishedPercent, 'white');
    createGraphicBar(taskNotStartedPercent, 'red');
    createGraphicBar(100 - taskNotStartedPercent - taskUnfinishedPercent, 'green');
}

function buildGraphics(radius) {
    resetGraphics();
    
    var taskUnfinished = detectTasks('Em andamento');
    var taskNotStarted = detectTasks('Pendente');

    var taskUnfinishedPercent = returnGraphicsPercentage(taskUnfinished);
    var taskNotStartedPercent =  returnGraphicsPercentage(taskNotStarted);

    if (selectGraphics.value == "Gráfico de Pizza") {
        constructPizzaGraphics(radius, taskUnfinishedPercent, taskNotStartedPercent);
    } else {
        constructBarGraphics(taskUnfinishedPercent, taskNotStartedPercent);
    }
}

export function constructGraphics(radius) {
    var graphicsDiv = document.getElementById('graphicsDiv');

    if (tasksArray.length > 0) {
        graphicsDiv.removeAttribute('style');
        if (typeof(radius) != 'number') {
            radius = 100;
        }
        if (radius > 100) {
            radius = 100;
        }
        if (selectGraphics) {
            buildGraphics(radius);
        }
    } else {
        noTasksWarning();
    }
}

function noTasksWarning() {
    graphicsDiv.style.display = 'none';
    var noTaskGraphicWarningText = document.getElementById('noTaskGraphicWarning');
    if (noTaskGraphicWarningText == undefined) {
        graphicsDiv.parentElement.innerHTML += `
        <p id="noTaskGraphicWarning">Não há tarefas para produzir um gráfico. Crie tarefas para visualizar gráficos sobre tais.</p>
        `;
    }
}

export function resizeGraphics(info) {
    var width = info.target.innerWidth;

    if (width > 500) {
        width = 500;
    }
    
    graphicsElement.setAttribute('width', width / 2);
    graphicsElement.setAttribute('height', width / 2);
    constructGraphics(width / 4);
}

function main() {
    syncTasks();
    constructGraphics();
    selectGraphics.addEventListener('change', constructGraphics);
    window.addEventListener('resize', resizeGraphics);
}

/* ORDEM DE EXECUÇÂO DO CODE */

main();