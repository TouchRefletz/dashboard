/* VARIAVEIS */

var addTasksContainer = document.getElementById("addTasksContainer");
var tasksDiv = document.getElementById('tasksDiv');
var editTaskButtons = document.getElementsByClassName('editTask');
var deleteTaskButtons = document.getElementsByClassName('deleteTask');
var addTaskButton = document.getElementById('addTaskButton');
var closeTaskMenuButton = document.getElementById("closeTaskMenuButton");
var searchButton = document.getElementById('searchButton');
var searchInput = document.getElementById('search');
var filterButton = document.getElementById("filterButton");
var filterContainer = document.getElementById('filterContainer');
var chooseFilterButton = document.getElementById("chooseFilterButton");
var selectFilter = document.getElementById('selectFilter');
var graphics = document.getElementById('graphics');
if (graphics) {
    var drawInGraphics = graphics.getContext('2d');
}
var selectGraphics = document.getElementById('selectGraphics');
var barGraphicsDiv = document.getElementById('barGraphics');
var changeSearchButton = document.getElementById('changeSearch');
var searchContainer = document.getElementById('containerSearch');
var tasksTitle = document.getElementById('tasksTitle');
var divActionButtons = document.getElementById('divActionButtons');
var menu = document.getElementsByTagName('menu')[0];

var tasks = ``;
var tasksArray = [];
var editTaskBoolean = false;
var taskIdFromButton = '';
var tasksXML = '';
var tasksId = [];

var searching = false;

/* FUNÇÔES */

function saveTasks() {
    tasks = ``;
    tasks += `<tasks>`
    tasksArray.forEach(task => {
            tasks += task;
    })
    tasks += `</tasks>`
    localStorage.setItem('tasks',tasks.toString())
    loadTasks();
}

function search() {
    searching = true;
    loadTasks();
    var array = document.getElementById('tasks').getElementsByClassName('task');
    var searchText = searchInput.value.toLowerCase();
    for (var i = 0; i < array.length; i++) {
        var titleText = array[i].getElementsByClassName(selectFilter.value)[0].innerHTML.toLowerCase();

        if (!titleText.includes(searchText)) {
            document.getElementById('tasks').removeChild(array[i]);
        }
    }
    searching = false;
}

function activateSearch() {
    if (searchInput.value == '') {
        loadTasks();
    } else {
        search();
    }
}

function syncTasks() {
    tasks = localStorage.getItem('tasks');
    if (tasks != null) {
        const parser = new DOMParser(); // Transformador de XML
        const xmlDoc = parser.parseFromString(tasks, "text/xml");
        tasksXML = xmlDoc.documentElement;

        const tasksElements = tasksXML.querySelectorAll('task');
        const taskArray = Array.from(tasksElements).map(task => task.outerHTML);
        tasksId = Array.from(tasksElements).map(task => Number(task.id));
        tasksArray = taskArray;
    }
}

function loadTasks() {
    if (editTaskBoolean) {
        addTaskButton.removeEventListener('click', callEditButton);
        addTaskButton.addEventListener('click', createTask);
    }

    syncTasks();
    
    addTaskButton.addEventListener('click', createTask);
    closeTaskMenuButton.addEventListener('click', closeTaskMenu);
    searchButton.addEventListener('click', search);
    filterButton.addEventListener('click', filter);
    chooseFilterButton.addEventListener('click', closeFilterMenu);
    searchInput.addEventListener('input', activateSearch);
    changeSearchButton.addEventListener('click', changeSearch);

    structureTasksInHtml();
    activateEditButtons();
    activateDeleteButtons();

    var showAddTaskMenuButton = document.getElementById("showAddTaskMenuButton");
    showAddTaskMenuButton.addEventListener("click", openTaskManagerMenu);
}

function structureTasksInHtml() {
    var tasks = tasksXML.getElementsByTagName('task');
    var tasksMainDiv = tasksXML.getElementsByTagName('tasks');

    tasksDiv.innerHTML = '';

    if (tasksMainDiv == undefined) {
        return;
    } else {
        var finalResult = document.createElement('div');
        finalResult.id = 'tasks';

        if (tasks.length > 0) {
            for (var i = 0; i < tasks.length; i++) {
                var taskDiv = document.createElement('div');
                taskDiv.id = tasks[i].id;
                taskDiv.classList.add('task');

                var taskTitle = tasks[i].getElementsByTagName("taskTitle")[0];
                var taskDescription = tasks[i].getElementsByTagName("taskDescription")[0];
                var taskDate = tasks[i].getElementsByTagName("taskDate")[0];
                var taskProgress = tasks[i].getElementsByTagName("taskProgress")[0];
                var taskPriority = tasks[i].getElementsByTagName("taskPriority")[0];
                var buttons = tasks[i].getElementsByTagName("button");

                var AllTaskInfo = document.createElement('div');
                AllTaskInfo.classList.add('taskAllInformationsDiv');

                var titleDiv = document.createElement('div');
                titleDiv.classList.add('taskNameDiv');
                if (taskTitle != undefined) {
                    var e = document.createElement('h1');
                    e.classList.add('taskTitle');
                    e.innerHTML = taskTitle.innerHTML;
                    titleDiv.appendChild(e);
                }
                if (taskDescription != undefined) {
                    var e = document.createElement('p');
                    e.classList.add('taskDescription');
                    e.innerHTML = taskDescription.innerHTML;
                    titleDiv.appendChild(e);
                }
                AllTaskInfo.appendChild(titleDiv);

                var taskInformationDiv = document.createElement('div');
                taskInformationDiv.classList.add('taskInformationDiv');
                if (taskDate != undefined) {
                    var e = document.createElement('p');
                    e.classList.add('taskDate');
                    e.innerHTML = taskDate.innerHTML;
                    taskInformationDiv.appendChild(e);
                }
                if (taskProgress != undefined) {
                    var e = document.createElement('p');
                    e.classList.add('taskProgress');
                    e.innerHTML = taskProgress.innerHTML;
                    taskInformationDiv.appendChild(e);
                }
                if (taskPriority != undefined) {
                    var e = document.createElement('p');
                    e.classList.add('taskPriority');
                    e.innerHTML = taskPriority.innerHTML;
                    taskInformationDiv.appendChild(e);
                }
                AllTaskInfo.appendChild(taskInformationDiv);

                taskDiv.appendChild(AllTaskInfo);

                var buttonsDiv = document.createElement('div');
                buttonsDiv.classList.add('taskButtonsDiv');
                buttonsDiv.innerHTML = `
                <button id="${tasks[i].id}_edit" class="editTask">
                <!-- fonte: https://www.flaticon.com/br/icones-gratis/editar -->
                <img src="imgs/edit.png" alt="Ícone de editar"></button>

                <button id="${tasks[i].id}_delete" class="deleteTask">
                <!-- fonte: https://www.flaticon.com/br/icones-gratis/excluir -->
                <img src="imgs/delete.png" alt="Ícone de deletar"></button>`;
                taskDiv.appendChild(buttonsDiv);

                finalResult.appendChild(taskDiv);
            }
        }

        finalResult.innerHTML += `<addTask id="showAddTaskMenuButton">+</addTask>`;

        tasksDiv.appendChild(finalResult);

        if (!searching) {
            var arr = document.getElementsByClassName('task');
            for(var i = 0; i < arr.length; i++) {
                arr[i].style.animation = 'popupOpen .3s ease-in-out';
            }
        }
    }
}

function addButtons(buttons) {
    var bDiv = document.createElement('div');
    for (let index = 0; index < buttons.length; index++) {
        const element = buttons[index];
        bDiv.appendChild(element);
    }
    return bDiv;
}

function changeSearch() {
    var width = window.innerWidth;
    if (searchContainer.classList.contains('hidden')) {
        searchContainer.classList.remove('hidden');
        divActionButtons.classList.remove('hidden');
        divActionButtons.style.display = 'flex';
        searchContainer.style.display = 'flex';

        if (width <= 530) {
            if (width <= 330) {
                if (width <= 230) {
                    if (menu.style.display == 'none') {
                        pageContent.style.marginTop = '450px';
                    } else {
                        pageContent.style.marginTop = '550px';
                    }
                } else {
                    pageContent.style.marginTop = '300px';
                }
            } else {
                pageContent.style.marginTop = '350px';
            }
        } else {
            pageContent.style.marginTop = '300px';
        }
    } else {
        searchContainer.style.animation = 'popupClose .6s ease-in-out';
        divActionButtons.style.animation = 'popupClose .6s ease-in-out';

        setTimeout(() => {
            searchContainer.classList.add('hidden');
            divActionButtons.classList.add('hidden');
            searchContainer.removeAttribute('style');
            divActionButtons.removeAttribute('style');
            if (width <= 530) {
                if (width <= 330) {
                    if (width <= 230) {
                        if (menu.style.display == 'none') {
                            pageContent.style.marginTop = '350px';
                        } else {
                            pageContent.style.marginTop = '450px';
                        }
                    } else {
                        pageContent.style.marginTop = '200px';
                    }
                } else {
                    pageContent.style.marginTop = '250px';
                }
            } else {
                pageContent.style.marginTop = '200px';
            }
        }, 300);
    }
}

function closeFilterMenu() {
    filterContainer.style.animation = 'popupClose .6s ease-in-out';

    setTimeout(() => {
        filterContainer.removeAttribute('style');

        filterContainer.classList.add('hidden');
        filterContainer.style.display = '';
        searchInput.placeholder = `Pesquisar tarefa por ${selectFilter.selectedOptions[0].innerHTML}`;
    }, 300)
}

function filter() {
    filterContainer.classList.remove('hidden');
    filterContainer.style.display = 'flex';
}

function activateEditButtons() {
    editTaskButtons = document.getElementsByClassName('editTask');
    for (var i = 0; i < editTaskButtons.length; i++) {
        addEditTaskEventListener(editTaskButtons[i]);
    }
}

function activateDeleteButtons() {
    deleteTaskButtons = document.getElementsByClassName('deleteTask');
    for (var i = 0; i < deleteTaskButtons.length; i++) {
        addDeleteTaskEventListener(deleteTaskButtons[i]);
    }
}

function addEditTaskEventListener(button) {
    button.addEventListener('click', () => {
        var taskFromButton = button.parentElement.parentElement;
        taskIdFromButton = button.parentElement.parentElement.id;
        openTaskManagerMenu();

        addTaskButton.removeEventListener('click', createTask);
        addTaskButton.addEventListener('click', callEditButton);

        taskFromButton.style.animation = 'popupClose .6s ease-in-out';

        setTimeout(() => {
            document.getElementById('tasks').removeChild(taskFromButton);

            for (var i = 0; i < tasksArray.length; i++) {
                if (tasksArray[i].includes(taskIdFromButton)) {
                    tasksArray.splice(i, 1);
                }
            }
        }, 300)
    });
}

function addDeleteTaskEventListener(button) {
    button.addEventListener('click', () => {
        var taskFromButton = button.parentElement.parentElement;
        taskIdFromButton = button.parentElement.parentElement.id;

        taskFromButton.style.animation = 'popupClose .6s ease-in-out';

        setTimeout(() => {
            document.getElementById('tasks').removeChild(taskFromButton);

            for (var i = 0; i < tasksArray.length; i++) {
                if (tasksArray[i].includes(taskIdFromButton)) {
                    tasksArray.splice(i, 1);
                }
            }
    
            saveTasks();
        }, 300)
    });
}

function callEditButton() {
    editTaskBoolean = true;
    createTask(taskIdFromButton);
    editTaskBoolean = false;
    taskIdFromButton = '';
}

function openTaskManagerMenu() {
    addTasksContainer.classList.remove("hidden"); /* mostra a div */
    addTasksContainer.style.display = 'flex';
}

function randomizeNumber() {
    return Math.floor(Math.random() * 10**8);
}

function taskVerification(taskTitle, taskDate, taskDescription) {
    if (taskTitle.value == '') {
        alert('O título não pode ser vazio! Insira um título para criar a tarefa.');
        return;
    }

    if (taskDate.value == '') {
        alert('O prazo para a tarefa não pode ser vazio! Insira um prazo para criar a tarefa.');
        return;
    }

    if (taskDescription.value == '') {
        taskDescription.value = "Nenhuma descrição foi informada.";
    }
}

function createTask() {
    if (taskIdFromButton == '') {
        taskIdFromButton = randomizeNumber();
    }

    var taskTitle = document.getElementById("taskTitle");
    var taskDescription = document.getElementById("taskDescription");
    var taskDate = document.getElementById("taskDate");
    var taskPriority = document.getElementById('taskPriority');
    var taskProgress = document.getElementById('taskProgress');

    taskVerification(taskTitle, taskDate, taskDescription);

    var time = taskDate.value;
    time = time.split('T')
    timeArray = time[0].replaceAll('-','/').split('/')
    time[0] = `${timeArray[2]}/${timeArray[1]}/${timeArray[0]}`
    time = `${time[0]}, ${time[1]}`

    var task = `
    <task id="${taskIdFromButton}">
        <taskTitle>${taskTitle.value}</taskTitle>
        <taskDescription>${taskDescription.value}</taskDescription>
        <taskDate>${time}</taskDate>
        <taskPriority>${taskPriority.value}</taskPriority>
        <taskProgress>${taskProgress.value}</taskProgress>
    </task>
    `

    tasksArray.push(task);
    closeTaskMenu();
    saveTasks();
    taskIdFromButton = '';
}

function closeTaskMenu() {
    addTasksContainer.style.animation = 'popupClose .6s ease-in-out';
    setTimeout(() => {
        addTasksContainer.style.animation = '';
        addTasksContainer.style.display = 'none';
        addTasksContainer.classList.add("hidden"); /* esconde a div */
    }, 300);
}

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


function constructPizzaGraphics(radius) {
    graphics.style.display = 'block';
    barGraphicsDiv.style.display = 'none';

    var centerX = graphics.width / 2;
    var centerY = graphics.height / 2;

    var taskUnfinished = 0;
    var taskNotStarted = 0;

    for (var i = 0; i < tasksArray.length; i++) {
        const regex = /<taskProgress>(.*?)<\/taskProgress>/; // Captura o conteúdo dentro de <taskProgress>
        const match = tasksArray[i].match(regex); // Verifica se há uma correspondência
        
        var taskStatus = match[1];

        if (taskStatus == 'Em andamento') {
            taskUnfinished++;
        } else if (taskStatus == 'Pendente') {
            taskNotStarted++;
        }
    }

    var taskUnfinishedPercent = (2 * taskUnfinished) / tasksArray.length;
    var taskNotStartedPercent = (2 * taskNotStarted) / tasksArray.length;

    taskUnfinishedPercent = taskUnfinishedPercent;
    taskNotStartedPercent = taskNotStartedPercent;

    drawInGraphics.clearRect(0, 0, graphics.width, graphics.height);

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

function constructBarGraphics() {
    drawInGraphics.clearRect(0, 0, graphics.width, graphics.height);
    graphics.style.display = 'none';
    barGraphicsDiv.style.display = 'flex';

    var taskUnfinished = 0;
    var taskNotStarted = 0;

    for (var i = 0; i < tasksArray.length; i++) {
        const regex = /<taskProgress>(.*?)<\/taskProgress>/; // Captura o conteúdo dentro de <taskProgress>
        const match = tasksArray[i].match(regex); // Verifica se há uma correspondência

        var taskStatus = match[1];

        if (taskStatus == 'Em andamento') {
            taskUnfinished++;
        } else if (taskStatus == 'Pendente') {
            taskNotStarted++;
        }
    }

    var taskUnfinishedPercent = (100 * taskUnfinished) / tasksArray.length;
    var taskNotStartedPercent = (100 * taskNotStarted) / tasksArray.length;

    if (barGraphicsDiv.childNodes.length > 0) {
        while (barGraphicsDiv.childNodes.length > 0) {
            barGraphicsDiv.removeChild(barGraphicsDiv.firstChild);
        }
    }

    createGraphicBar(taskUnfinishedPercent, 'white');
    createGraphicBar(taskNotStartedPercent, 'red');
    createGraphicBar(100 - taskNotStartedPercent - taskUnfinishedPercent, 'green');
}

function constructGraphics(radius) {
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
            if (selectGraphics.value == "Gráfico de Pizza") {
                constructPizzaGraphics(radius);
            } else {
                constructBarGraphics();
            }
        }
    } else {
        graphicsDiv.style.display = 'none';
        var noTaskGraphicWarningText = document.getElementById('noTaskGraphicWarning');
        if (noTaskGraphicWarningText == undefined) {
            graphicsDiv.parentElement.innerHTML += `
            <p id="noTaskGraphicWarning">Não há tarefas para produzir um gráfico. Crie tarefas para visualizar gráficos sobre tais.</p>
            `
        }
    }
}

function resizeGraphics(info) {
    var width = info.target.innerWidth;

    if (width > 500) {
        width = 500;
    }
    
    graphics.setAttribute('width', width / 2);
    graphics.setAttribute('height', width / 2);
    constructGraphics(width / 4);
}

function createMenuButton(headerContent) {
    var button = document.createElement('button');
    button.innerHTML = `
    <!-- fonte: https://www.flaticon.com/br/icones-gratis/menu-aberto -->
    <img src="imgs/menu.png" alt="Ícone de menu">
    `
    button.id = 'menuButton';
    button.classList.add('button');
    button.addEventListener("click", changeMenuState);
    headerContent.insertBefore(button, document.getElementsByTagName('menu')[0]);
}

function changeMenuState() {
    var menu = document.getElementsByTagName('menu')[0];
    var pageContent = document.getElementById('pageContent');

    if (menu.style.display == 'none') {
        menu.removeAttribute('style');
        pageContent.style.marginTop = '450px';
    } else {
        if (!searchContainer.classList.contains('hidden')) {
            pageContent.style.marginTop = '300px';
        } else {
            pageContent.removeAttribute('style');
        }
        menu.style.display = 'none';
    }
}

function changePageWithWidth(info) {
    var width;

    if (info == undefined) {
        width = window.innerWidth;
    } else {
        width = info.target.innerWidth;
    }
    
    if (width <= 530) {
        if (width >= 330) {
            pageContent.style.marginTop = '250px';
        }
    } else {
        pageContent.style.marginTop = '200px';
    }

    changeMenu(info);
    changeSearchStyle(info);
}

function changeSearchStyle(info) {
    var width;

    if (info == undefined) {
        width = window.innerWidth;
    } else {
        width = info.target.innerWidth;
    }

    if (width <= 430) {
        divActionButtons.style.position = 'static';
        divActionButtons.style.marginBottom = '30px';
        searchInput.style.textAlign = 'center';
    } else {
        divActionButtons.removeAttribute('style');
        searchInput.removeAttribute('style');
    }
}

function changeMenu(info) {
    var width;

    if (info == undefined) {
        width = window.innerWidth;
    } else {
        width = info.target.innerWidth;
    }

    var headerContent = menu.parentElement;
    var button = document.getElementById('menuButton');

    if (width <= 230) {
        menu.style.display = 'none';
        
        if (button == undefined) {
            createMenuButton(headerContent);
        }
    } else {
        if (button != undefined) {
            headerContent.removeChild(button);
        }
        menu.removeAttribute('style');
    }
}

/* COMEÇO DA EXECUÇÂO DO CODE */

syncTasks();

if (tasksDiv) {
    loadTasks();
}

if (window.location.pathname == '/graphics.html') {
    constructGraphics();
    selectGraphics.addEventListener('change', constructGraphics);
    window.addEventListener('resize', resizeGraphics);
}

changePageWithWidth();

window.addEventListener('resize', changePageWithWidth);







