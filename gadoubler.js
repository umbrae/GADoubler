var GADoubler = (function() {
  function hasDoubled(el) {
    if (el.originalNumber && el.originalNumber * 2 == el.textContent) {
      return true;
    }
    return false;
  }

  function makeDoubled(el) {
    el.originalNumber = parseInt(el.textContent.replace(/,/g, ''), 10);
    el.textContent = el.originalNumber * 2;
  }

  // counter double
  function listenToCounter() {
    var observer = new MutationObserver(function(mutations) {
      mutations.forEach(function(mutation) {
        if (mutation.type == "characterData") {
          if (hasDoubled(mutation.target)) {
            return;
          }

          makeDoubled(mutation.target);
        }
      });    
    });

    observer.observe(document.querySelector('#ID-overviewCounterValue'), {
      characterData: true,
      subtree: true
    });
  }

  function listenToTables() {
    var tables = document.querySelectorAll('div[id^="ID-overviewPanel"] table');

    var observer = new MutationObserver(function(mutations) {
      mutations.forEach(function(mutation) {
        tds = mutation.target.querySelectorAll('td');
        [].forEach.call(tds, function(td) {
          if (parseInt(td.textContent.match(/^\s*[0-9,]+\s*$/))) {
            if (!hasDoubled(td)) {
              makeDoubled(td);
            }
          }
        })
      });
    });

    [].forEach.call(tables, function(table) {
      observer.observe(table, {
        childList: true,
        subtree: true
      });
    });
  }

  function init() {
    if (location.hash.indexOf('realtime') !== -1) {
      // wait patiently for google's async loading of live events to occur
      var realtimeLoadCheck = window.setInterval(function() {
        if (!document.querySelector('#ID-overviewCounterValue')) {
          return;
        }

        listenToCounter();
        listenToTables();
        window.clearInterval(realtimeLoadCheck);
      }, 500);
    }
  }

  return {
    init: init
  };

}())

GADoubler.init();