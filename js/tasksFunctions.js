function saveTasks() {
    tasks = `<tasks>${tasksArray.join('')}</tasks>`;
    saveTasksXML();
}

function saveTasksXML() {
    localStorage.setItem('tasks',tasks.toString());
    loadTasks();
}

function syncTasks() {
    tasks = localStorage.getItem('tasks');
    if (tasks != null) {
        pullTasksFromLocalStorage();
    }
}

function convertContentWithDomParser(content, type) {
    const parser = new DOMParser();
    const result = parser.parseFromString(content, type);
    return result.documentElement;
}

function refreshTasksLocally() {
    const tasksElements = tasksXML.querySelectorAll('task');
    const taskArray = Array.from(tasksElements).map(task => task.outerHTML);
    tasksId = Array.from(tasksElements).map(task => Number(task.id));
    tasksArray = taskArray;
}

function pullTasksFromLocalStorage() {
    tasksXML = convertContentWithDomParser(tasks, 'text/xml');
    refreshTasksLocally();
}

function resetAddTaskButton() {
    if (editTaskBoolean) {
        addTaskButton.removeEventListener('click', callEditButton);
        addTaskButton.addEventListener('click', createTask);
    }
}

function addEventListenersToButtons() {
    addTaskButton.addEventListener("click", createTask);
    closeTaskMenuButton.addEventListener("click", closeTaskMenu);
    searchButton.addEventListener("click", search);
    filterButton.addEventListener("click", filter);
    chooseFilterButton.addEventListener("click", closeFilterMenu);
    searchInput.addEventListener("input", activateSearch);
    changeSearchButton.addEventListener("click", changeSearch);
    timerButton.addEventListener("click", showTimerMenu);
    startTimerButton.addEventListener("click", startTimer);
    closeTimerButton.addEventListener("click", closeTimer);
    timerFocusMode.addEventListener("click", timerFocus);
    timerTiredModeButton.addEventListener("click", timerTiredMode);
    changeLightButton.addEventListener("click", changeModeFromButton);
    exportTasksButton.addEventListener("click", exportTasks);
    closeExportTasksMenuButton.addEventListener("click", closeExportTasksMenu);
}

function addCreateTaskButtonToHTML() {
    var showAddTaskMenuButton = document.getElementById("showAddTaskMenuButton");
    showAddTaskMenuButton.addEventListener("click", openTaskManagerMenu);
}

function loadTasks() {
    resetAddTaskButton();
    syncFavoriteMode();
    syncTasks();
    addEventListenersToButtons();
    structureTasksInHtml();
    activateEditButtons();
    activateDeleteButtons();
    setUpTimerButtons();
    addCreateTaskButtonToHTML();
}

function showMenu(element) {
    element.style.display = 'flex';
    element.classList.remove('hidden');
}

function exportTasks() {
    showMenu(exportTasksContainer);
    constructExportTasks();
}

function constructExportTasks() {
    var tasksHTML = convertContentWithDomParser(tasksArray.toString(), "text/html");
    var convert = tasksHTML.getElementsByTagName('body')[0].getElementsByTagName('task');

    makeJsonTasks(convert);
    makeCSVTasks(convert);
}

function makeJsonTasks(convert) {
    var jsons = [];
    makeJsonArray(jsons, convert);
    tasksJSON.innerHTML = JSON.stringify(jsons);
}

function makeCSVTasks(convert) {
    var csvs = ["title, description, date, priority, progress <br>"];
    makeCSVArray(csvs, convert);
    tasksCSV.innerHTML = csvs.join('');
}

function makeCSVLine(values, convert) {
    var finalResult = values.map((value) => findValueInIteration(convert, value));
    return `${finalResult.join(',')}<br>`;
}

function convertXMLtoCSV(convert) {
    var values = ['tasktitle','taskdescription','taskdate','taskpriority','taskprogress'];
    return makeCSVLine(values, convert);
}

function makeCSVArray(csvs, convert) {
    for (let i = 0; i < convert.length; i++) {
        var csv = convertXMLtoCSV(convert[i]);
        csvs.push(csv);
    }
}

function findValueInIteration(parentelement, elementName) {
    return parentelement.getElementsByTagName(elementName)[0].innerHTML;
}

function findElementInInteration(parentelement, elementName) {
    return parentelement.getElementsByTagName(elementName)[0];
}

function makeJsonArray(jsons, convert) {
    for (let i = 0; i < convert.length; i++) {
        var json = {
            title: findValueInIteration(convert[i], 'tasktitle'),
            description: findValueInIteration(convert[i], 'taskdescription'),
            date: findValueInIteration(convert[i], 'taskdate'),
            priority: findValueInIteration(convert[i], 'taskpriority'),
            progress: findValueInIteration(convert[i], 'taskprogress')      
        }
        jsons.push(json);
    }
}

function closeMenu(element) {
    element.style.animation = 'popupClose .6s ease-in-out';
    setTimeout(() => {
        element.removeAttribute('style');
        element.classList.add('hidden');
    }, 300);
}

function closeExportTasksMenu() {
    closeMenu(exportTasksContainer);
}

function createTaskElement(element, htmlType, type, parentElement) {
    if (element != undefined) {
        var e = document.createElement(htmlType);
        e.classList.add(type);
        e.innerHTML = element.innerHTML;
        parentElement.appendChild(e);
    }
}

function createHTMLTaskDivWithClass(className) {
    return Object.assign(document.createElement('div'), { className });
}

function createHTMLTaskDivWithId(id) {
    let div = document.createElement('div');
    div.id = id;
    return div;
}

function createTasks(taskTitle, taskDescription, taskDate, taskProgress, taskPriority, titleDiv, taskInformationDiv) {
    createTaskElement(taskTitle, 'h1', 'taskTitle', titleDiv);
    createTaskElement(taskDescription, 'p', 'taskDescription', titleDiv);
    createTaskElement(taskDate, 'p', 'taskDate', taskInformationDiv);
    createTaskElement(taskProgress, 'p', 'taskProgress', taskInformationDiv);
    createTaskElement(taskPriority, 'p', 'taskPriority', taskInformationDiv);
}

function constructTaskHtml(AllTaskInfo, taskDiv, titleDiv, taskInformationDiv, buttonsDiv, finalResult) {
    AllTaskInfo.appendChild(titleDiv);
    AllTaskInfo.appendChild(taskInformationDiv);
    taskDiv.appendChild(AllTaskInfo);
    taskDiv.appendChild(buttonsDiv);
    finalResult.appendChild(taskDiv);
} 

function constructTaskButtons(buttonsDiv, nowTaskId) {
    buttonsDiv.innerHTML = `
    <button id="${nowTaskId}_edit" class="editTask">
    <!-- fonte: https://www.flaticon.com/br/icones-gratis/editar -->
    <img src="imgs/edit.png" alt="Ícone de editar"></button>

    <button id="${nowTaskId}_delete" class="deleteTask">
    <!-- fonte: https://www.flaticon.com/br/icones-gratis/excluir -->
    <img src="imgs/delete.png" alt="Ícone de deletar"></button>`;
}

function constructTaskStructure(nowTask, finalResult) {
    var taskTitle = findElementInInteration(nowTask, 'taskTitle');
    var taskDescription = findElementInInteration(nowTask, 'taskDescription');
    var taskDate = findElementInInteration(nowTask, 'taskDate');
    var taskProgress = findElementInInteration(nowTask, 'taskPriority');
    var taskPriority = findElementInInteration(nowTask, 'taskProgress'); 

    var taskDiv = createHTMLTaskDivWithClass('task');
    var AllTaskInfo = createHTMLTaskDivWithClass('taskAllInformationsDiv');
    var titleDiv = createHTMLTaskDivWithClass('taskNameDiv');
    var taskInformationDiv = createHTMLTaskDivWithClass('taskInformationDiv');
    var buttonsDiv = createHTMLTaskDivWithClass('taskButtonsDiv');

    taskDiv.id = nowTask.id;

    createTasks(taskTitle, taskDescription, taskDate, taskProgress, taskPriority, titleDiv, taskInformationDiv);
    constructTaskButtons(buttonsDiv, nowTask.id);
    constructTaskHtml(AllTaskInfo, taskDiv, titleDiv, taskInformationDiv, buttonsDiv, finalResult);
}

function resetTasksDiv() {
    tasksDiv.innerHTML = '';
}

function startTasksConstruction(tasksMainDiv, finalResult, tasks) {
    if (tasksMainDiv != undefined) {
        if (tasks.length > 0) {
            for (var i = 0; i < tasks.length; i++) {
                constructTaskStructure(tasks[i], finalResult);
            }
        }
    }
}

function sendResultToHTML(finalResult) {
    finalResult.innerHTML += `<addTask id="showAddTaskMenuButton">+</addTask>`;

    tasksDiv.appendChild(finalResult);
}

function constructTasks() {
    var tasks = tasksXML.getElementsByTagName('task');
    var tasksMainDiv = tasks != null ? tasksXML.getElementsByTagName('tasks') : null;
    var finalResult = createHTMLTaskDivWithId("tasks");

    startTasksConstruction(tasksMainDiv, finalResult, tasks);
    sendResultToHTML(finalResult);
}

function fixTaskAnimationWhileSearching() {
    if (!searching) {
        var arr = document.getElementsByClassName('task');
        for(var i = 0; i < arr.length; i++) {
            arr[i].style.animation = 'popupOpen .3s ease-in-out';
        }
    }
}

function structureTasksInHtml() {
    syncTasks();

    constructTasks();

    fixTaskAnimationWhileSearching();
}