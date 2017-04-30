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


var myHand = [[0, 3], [7, 2], [7, 3], [5, 2], [3, 2]];
const myHandP = document.querySelector('.my-hand');
myHand.forEach((card) => {
  const cardSpan = document.createElement('span');
  cardSpan.classList.add('card-front');
  cardSpan.setAttribute('data-suit-idx', card[1]);
  cardSpan.setAttribute('data-rank-idx', card[0]);
  myHandP.append(cardSpan);
});



