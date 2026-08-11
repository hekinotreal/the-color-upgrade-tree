window.addEventListener('error', function (e) {
    console.log('PRELOAD-ERROR: ' + e.message + ' | file=' + e.filename + ':' + e.lineno + ':' + e.colno + '\nSTACK: ' + (e.error && e.error.stack))
})
