var isMobile = "ontouchstart" in window;

var localizations = (async function () {
  var elements = document.querySelectorAll("[trns]");
  var inputs = document.querySelectorAll("input");
  var selects = document.querySelectorAll("select");

  var lang = localStorage.getItem("lang") ? localStorage.getItem("lang") : "HE";

  var langRequest = await fetch(`/translations/${lang}.json`);
  var langResults = await langRequest.json();

  document.querySelector("html").setAttribute("dir", langResults.dir);

  const translateValue = (value) => {
    var text = langResults.values[value];
    return text ? text : value;
  };

  elements.forEach((item) => {
    item.textContent = translateValue(item.textContent.trim());
  });

  [...selects, ...inputs].forEach((input) => {
    input.setAttribute(
      "placeholder",
      translateValue(input.getAttribute("placeholder"))
    );
  });

  function _init() {
    $(".form-loader").remove();
    $(".container").show();
    var selectLang = document.querySelector(".floating-lang");
    if (selectLang) {
      selectLang.value = lang;
      selectLang.addEventListener("change", (e) => {
        localStorage.setItem("lang", e.target.value);
        location.reload();
      });
    }

    window["_translations"] = langResults;
    initSelect2();
  }

  _init();
})();








