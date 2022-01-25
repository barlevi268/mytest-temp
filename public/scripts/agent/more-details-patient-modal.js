var viewContent =  $('#viewContent');
var viewImage =  $('#viewImage');
var viewVideo =  $('#viewVideo');
var blockVideo =  $('#blockVideo');
var videojsID = videojs('videojsID');
function backContentImage() {
    viewImage.toggleClass('d-none');
    viewContent.toggleClass('d-none');
}
function backContentVideo(isVideoDispose = true) {
    viewVideo.toggleClass('d-none');
    viewContent.toggleClass('d-none')
    if (isVideoDispose && moreDetailsPatientModal) {
        moreDetailsPatientModal.videoDispose();
    }
}


function init() {
    $('#dropdownResultTestMenuNegative').on('click', async (e) => setResultTestValue(e) )
    $('#dropdownResultTestMenuPositive').on('click', async (e) => setResultTestValue(e) )
    $('#dropdownResultTestMenuDisqualification').on('click', async (e) => setResultTestValue(e) )
    $('#photoID').on('click', async () => {
        $('#imageID').attr('src', $('#photoID').attr('data-src'));
        backContentImage()
    });
    $('#outcomeDocumentation').on('click', async () => {
        $('#imageID').attr('src', $('#photoID').attr('data-src'));
        backContentImage()
    });
    $('#testDocumentation').on('click', async () => {
        backContentVideo(false)
        videojsID.src({type: 'video/mp4', src: $('#testDocumentation').attr('data-src')});
    });
}

function setResultTestValue(e) {
    let primaryAction = $('button.primary-action')
    let value= e.target.outerText;
    if (value) {
        $('#dropdownResultTestMenu').html(value)
        $('input[name="dropdownResultTest"]').val(value)
        primaryAction.prop('disabled', false);
        return;
    }
    primaryAction.prop('disabled', true);
}

var moreDetailsPatientModal = {
    init: function (itemPatient) {
        moreDetailsPatientModal.reset();
        $('button.primary-action').prop('disabled', true);
        $('input[name=patientID]').val(itemPatient.id);
        $('#patientName').html(itemPatient.patientName);
        $('#statusChecked').html(itemPatient.statusChecked);
        $('#phone').html(itemPatient.phone);
        $('#IDPassport').html(itemPatient.IDPassport);
        let photoID = $('#photoID');
        photoID.html(itemPatient.photoID);
        $('#serialTest').html(itemPatient.serialTest);
        $('#testStatus').html(itemPatient.testStatus);
        let testDocumentation = $('#testDocumentation');
        testDocumentation.html(itemPatient.testDocumentation);
        $('#result').html(itemPatient.result);
        let outcomeDocumentation = $('#outcomeDocumentation');
        outcomeDocumentation.html(itemPatient.outcomeDocumentation);
        photoID.attr("data-src", itemPatient.photoIDLink);
        testDocumentation.attr("data-src", itemPatient.testDocumentationLink);
        outcomeDocumentation.attr("data-src", itemPatient.outcomeDocumentationLink);
    },
    reset: function () {
        viewContent.removeClass('d-none');
        viewImage.addClass('d-none');
        viewVideo.addClass('d-none');
    },
    close: function () {
        moreDetailsPatientModal.reset();
        moreDetailsPatientModal.videoDispose();
    },
    videoDispose: function () {
        if (videojsID && videojsID.dispose) {
            videojsID.pause();
        }
    }
}

$(() => {

    init();
    window["moreDetailsPatientModal"] = moreDetailsPatientModal
});
