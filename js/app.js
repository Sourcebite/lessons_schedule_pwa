;(function() {

  var app = {
    currentVersion: 0
  };

  if ('serviceWorker' in navigator) {
    navigator.serviceWorker
      .register('./service-worker.js')
      .then(function() { console.log('Service Worker Registered'); });
  }

  app.updateSchedule = function(newSchedule) {
    console.log('updateSchedule', newSchedule.version <= app.currentVersion);
    if(newSchedule.version <= app.currentVersion) {
      return;
    }
    app.currentVersion  = newSchedule.version;
  };

  function requestSchedule() {
    var url = '/schedule.json';

    if ('caches' in window) {
      caches.match(url).then(function(response) {
        if (response) {
          response.json().then(function(jsonResponse) {
            app.updateSchedule(jsonResponse);
          });
        }
      });
    }

    fetch(url, {mode: 'no-cors'})
      .then(function(response) {
        if(response) {
          response.json().then(function(jsonResponse) {
            app.updateSchedule(jsonResponse);
          });
        }
      })
      .catch(function() {
        console.log('Offline');
      });
  }

  //window.requestInterval = setInterval(requestSchedule, 2000);
})();