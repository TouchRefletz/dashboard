function importJs(scriptSrc) {
    var script = document.createElement('script');
    script.src = scriptSrc;
    document.body.appendChild(script);
}

importJs('js/app.js');