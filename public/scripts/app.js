$(() => {
  $.ajax({
    method: "GET",
    url: "/api/users"
  }).done((users) => {
    for(user of users) {
      $("<div>").text(user.name).appendTo($("body"));
    }
  });;
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