var UserSession = function() {
    
  function getState() {
      var storageState = localStorage.getItem('state')
      return storageState ? JSON.parse(storageState) : {};
  }
  let currentState = getState()

  function setState(user) {
      currentState = { ...currentState, ...user }
      localStorage.setItem('state', JSON.stringify(currentState));
  }

  function clearState() {
      localStorage.setItem('state', "{}");
  }

  function clearStateUser() {
    const testkitSerial = currentState && currentState.testkitSerial ? currentState.testkitSerial : undefined;
    localStorage.setItem('state', JSON.stringify({testkitSerial}));
  }

  function clearStateByName(name) {
    currentState = { ...currentState, [name]: undefined }
    localStorage.setItem('state', JSON.stringify(currentState));
  }

  function getUserObj() {
      return currentState.user ? currentState.user : {}
  }

  function _route() {
    const urlParams = new URLSearchParams(window.location.search);
    const testkitSerial = urlParams.get('testkitSerial');
    if (testkitSerial) {
      setState({testkitSerial: testkitSerial});
      location.href = "/pre-registration";
    }
    const pathname = location.pathname.split('/')[1]
    const routeUnauthorized = () => !currentState.user && (location.href = "/login")
    const routeUnauthorizedAgent = () => (!currentState.user || !currentState.user.type || currentState.user.type !== "agent") &&  (location.href = "/login")
    const routeAuthorized = () => currentState.user ? (location.href = "profile") : clearStateUser();

    switch (pathname) {
      case '':
      case 'welcome':
      case 'login':
      case 'pre-registration':
      case 'register':
        routeAuthorized()
        break;
      case 'agent':
      case 'vouchers':
        routeUnauthorizedAgent();
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
          clearStateUser();
          location.href = "/login";
      },
      state: function () {
        return currentState;
      },
      clearStateByName: function (name) {
        return clearStateByName(name)
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
  constructor(method = "GET", body = "", contentType = "application/json", dataType = 'text', processData = true) {
    this.method = method
    this.dataType = dataType
    this.contentType = contentType
    this.data = body
    this.cache = false
    this.processData = processData
    this.enctype = 'multipart/form-data'

    UserSession.isAuthenticated && (this.headers = { "Authorization": `bearer ${UserSession.fetch('token')}` })
  }
}

function request(url, obj) {
  var requestObj = { ...{ url: url }, ...obj }
  return new Promise(function (resolve, reject) {
    $.ajax(requestObj)
      .done((data) => {
        try {
          var parsed = JSON.parse(data)
          resolve(parsed)
        } catch (e) {
          resolve(data)
        }

      })
      .fail((ajax, _, status) => {
        status == "Unauthorized" && UserSession.deauthenticate()
        reject(ajax.responseText, ajax, status)
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

async function getProfile() {
  var requestObj = new RequestObject("GET", "", "application/json", "json", true);
  await request(`https://teremsrl.com/api/profile`, requestObj)
    .then((response) => {
      window['currentUser'] = response.data;
      $("#userName").html(`${currentUser.userData.first_name} ${currentUser.userData.last_name}`)
    })
    .catch((error) => {
      Swal.error('?????????? ???????????? ????????????')
      logOut()
    })
}

function logOut() {
  UserSession.deauthenticate();
}

$(() => {
    $("#logoutBtn").on("click", e => {
        Swal.fire({
            title: "?????? ???????? ?????????? ?????????",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "????, ???? ??????????????",
            cancelButtonText: "??????????"
        }).then(function (result) {
            result.value && logOut()
        });
    });

});





