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
    var names = [addTaskButton, closeTaskMenuButton, searchButton, filterButton, chooseFilterButton, searchInput, changeSearchButton, timerButton, startTimerButton, closeTimerButton, timerFocusMode, timerTiredModeButton, changeLightButton, exportTasksButton, closeExportTasksMenuButton];

    var listeners = ["click", "click", "click", "click", "click", "input", "click", "click", "click", "click", "click", "click", "click", "click", "click"];

    var functions = [createTask,closeTaskMenu,search,filter, closeFilterMenu,activateSearch,changeSearch,showTimerMenu,startTimer,closeTimer,timerFocus,timerTiredMode,changeModeFromButton,exportTasks,closeExportTasksMenu];
    
    addEventListenerToButton(names, functions, listeners);
}

function addEventListenerToButton(names, functions, listeners) {
    for (var i = 0; i < names.length; i++) {
        names[i].addEventListener(listeners[i], functions[i]);
    }
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
    var finalResult = values.map((value) => convertXMLValue(convert, value));
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

function convertXMLValue(parentelement, elementName) {
    return parentelement.getElementsByTagName(elementName)[0].innerHTML;
}

function makeJsonArray(jsons, convert) {
    for (let i = 0; i < convert.length; i++) {
        var json = {
            title: convertXMLValue(convert[i], 'tasktitle'),
            description: convertXMLValue(convert[i], 'taskdescription'),
            date: convertXMLValue(convert[i], 'taskdate'),
            priority: convertXMLValue(convert[i], 'taskpriority'),
            progress: convertXMLValue(convert[i], 'taskprogress')      
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