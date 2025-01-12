function importJs(scriptSrc) {
    var script = document.createElement('script');
    script.src = scriptSrc;
    document.body.appendChild(script);
}

importJs('js/tasksVariables.js');
importJs('js/searchVariables.js');
importJs('js/graphicsVariables.js');
importJs('js/timerVariables.js');
importJs('js/modeVariables.js');
importJs('js/menuVariables.js');

importJs('js/app.js');