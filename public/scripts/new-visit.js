const fakeVisit = {
  fullName: "חיים רפאלי",
  testBarcode: "40132164",
  visitId: "31628"
};

function fakeVisitSuccess() {
  alertModal.display({
    modalId: "visitSuccessModal",
    primaryLabel: "חזרה לתפריט",
    secondaryLabel: "צור ביקור נוסף",
    icon: "success",
    primaryAction: () => (location.href = "/menu"),
    secondaryAction: () => (location.href = "/findPatient"),
    onInit: () => {
      $("#patientFullNameLabel").html(fakeVisit.fullName);
      $("#testBarcodeLabel").html(fakeVisit.testBarcode);
      $("#visitIdLabel").html(fakeVisit.visitId);
    }
  });
}



$(() => {
  webcam.init();
  mobileStream.init({
    resultInput:'[name=test_barcode]',
    openButton: '.mobile-stream-btn'
  });

});
