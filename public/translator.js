var initLocalizations = async function() {
  var labels = document.querySelectorAll('trns')
  var inputs = document.querySelectorAll('input')
  var lang = localStorage.getItem('lang') ? localStorage.getItem('lang') : 'HE'
  var langRequest = await fetch(`/translations/${lang}`)
  var langResults = await langRequest.json()
  labels.forEach(label => {
    var value = label.textContent
  })
}