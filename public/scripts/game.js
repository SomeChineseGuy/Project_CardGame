  $(document).ready(function(){


  // READ


  function endTurn() { $('.play').prop('disabled', true)}
  function endStart() { $('.play .start').prop('disabled', true)}
  function startTurn() {$('.play .start').prop('disabled', false)}


  const socket = io('/game1');

  socket.on('connect', () => {
    socket.emit('add user', '/game1#' + socket.id);
  });
  socket.on('game ready', () => {
    $('body').append("<p class='getready'>Game starting</p>");
    setTimeout(() => {$('.getready').empty();}, 5000);
  });
    // });
  socket.on('start game', (stateData) => {
    // const templateText = $('#handTemp').text();
    const templateText = `{{#each hand}}
    <span class=“card-front” data-rank-idx=“{{this.rank}}” data-suit-idx=“{{this.suit}}“> test </span>
    {{/each}}`;
    const pageTemplate = Handlebars.compile(templateText);
    console.log(stateData);
    $('#hand').empty()
              .append(pageTemplate(stateData));

  });

  socket.on('waitTurn', () => endTurn());
  socket.on('turnStart', () => startTurn());
  socket.on('new state', (newState) => console.log(newState));
  socket.on('winner', () => {
    alert('you win!');
    setTimeout(()=> window.location = '/', 2000);
  });


  $('.draw').on('click', (e) => {
    console.log('click');
    e.preventDefault();
    // endStart();
    socket.emit('draw', '/game1#' + socket.id);
  });

  $('.takeTop').on('click', (e) => {
    e.preventDefault();
    endStart();
    socket.emit('takeTop', '/game1#'+socket.id);
  });
  $('.takeAll').on('click', (e) => {
    e.preventDefault();
    endStart();
    socket.emit('takeAll', '/game1#'+socket.id);
  });
  $('.discard').on('click', (e) => {
    e.preventDefault();
    $()
    socket.emit('takeAll', '/game1#'+socket.id);
  });
  $('.dropSet').on('click', () => {
    e.preventDefault();
    socket.emit('takeAll', '/game1#'+socket.id);
  });
});