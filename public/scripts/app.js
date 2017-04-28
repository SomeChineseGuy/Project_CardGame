$(() => {

  // AJAX
  function ajax(url, method, data){
    return $.ajax({url, method, data});
  }

  // READ
  const templateText = $('#hand-template').text();
  const pageTemplate = Handlebars.compile(templateText);
  function renderPage(sourceJSON) {
    $('#hand-container').empty()
                        .append(pageTemplate(sourceJSON));
  }

  function loadJSON(){
     ajax('/json','GET').then(renderPage);
  }

  loadJSON();

});
