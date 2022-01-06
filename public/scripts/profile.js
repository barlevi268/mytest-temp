var userName = $("#userName");
var test = 'fddfdf';
var recordedTests = [{name: 1, test: 1},{name: 2, test: 2},];
var awaitingResult = [{name: 1, test: 1},{name: 2, test: 2},];
function logOut() {
    UserSession.deauthenticate();
}

$(() => {
    $('#resultTmpl').tmpl(recordedTests).appendTo('#recordedTests');
    $('#resultTmpl').tmpl(awaitingResult).appendTo('#awaitingResult');
    userName.html('first name');
});
