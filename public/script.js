var UserSession = function() {
    
  function getState() {
      var storageState = localStorage.getItem('state')
      return storageState ? JSON.parse(storageState) : {};
  }

  const currentState = getState()

  function setState(user) {
      var newState = { ...currentState, ...user }
      localStorage.setItem('state', JSON.stringify(newState));
  }

  function clearState() {
      localStorage.setItem('state', "{}");
  }

  function getUserObj() {
      return currentState.user ? currentState.user : {}
  }

  function _route() {
      const pathname = location.pathname.split('/')[1]
      const routeUnauthorized = () => !currentState.user && (location.href = "/login")
      const routeAuthorized = () => currentState.user ? (location.href = "/") : clearState();

      switch (pathname) {
        case 'welcome':
              routeAuthorized()
              break;
          case 'login':
              routeAuthorized()
              break;
          default:
              routeUnauthorized()
              break;
      }
  }

  function _init() {
      _route()
  }

  _init()

  return {
      authenticate: function (user) {
          setState(user)
      },

      deauthenticate: function () {
          clearState()
          location.href = "/login";
      },

      obj: getUserObj(),

      isAuthenticated: (function() {
          for(var _ in getUserObj()) return true; 
          return false;
      })(),

      fetch: function (key = null) {
          if (key != null && currentState != null) return currentState[key]
          return currentState
      }
  };
}();

class RequestObject {
  constructor(type = "GET", body = "", contentType = "application/json", dataType = 'text') {
      this.type = type.toLowerCase()
      this.dataType = dataType
      this.contentType = contentType
      this.data = body;
      
      UserSession.isAuthenticated && (this.headers = {"Authorization" : `bearer ${UserSession.fetch('token').value}`})
  }
}

function request(url, obj) {
  var requestObj = {...{url:url},...obj}
  return new Promise(function(resolve, reject) {
      $.ajax(requestObj)
      .done((data) => {
          try {
              var parsed = JSON.parse(data)
              resolve(parsed)
          } catch (e) {
              resolve(data)
          }
          
      })
      .fail((ajax,_,status) => {
          status == "Unauthorized" && UserSession.deauthenticate()
          reject(ajax.responseText,ajax,status)
      })
  })
}

function requestFile(url, obj, filename) {
  return new Promise((resolve, reject) => {
      xhttp = new XMLHttpRequest();
      xhttp.onreadystatechange = function() {
          var a;
          if (xhttp.readyState === 4 && xhttp.status === 200) {
              function download() {
                  a = document.createElement('a');
                  a.href = window.URL.createObjectURL(xhttp.response);
                  a.download = filename;
                  a.style.display = 'none';
                  document.body.appendChild(a);
                  a.click();
              }
  
              resolve({
                  urlObject: window.URL.createObjectURL(xhttp.response),
                  resonse: xhttp.response,
                  download: download
              })
          } else if(xhttp.readyState === 4 && xhttp.status != 200) {
              reject(false)
          }
      };
      xhttp.open("get", url);
      xhttp.setRequestHeader("Content-Type", "application/json");
      for (var header in obj.headers) {
          xhttp.setRequestHeader(header, obj.headers[header]);
      }
      xhttp.responseType = 'blob';
      xhttp.send();
  })
}

$(() => {
  $("#logoutBtn").on("click", e => {
      Swal.fire({
          title: "אתה בטוח שתרצה לצאת?",
          icon: "warning",
          showCancelButton: true,
          confirmButtonText: "כן, צא מהמערכת",
          cancelButtonText: "ביטול"
      }).then(function (result) {
          if (result.value) {
              UserSession.deauthenticate();
          }
      });
  });

});





