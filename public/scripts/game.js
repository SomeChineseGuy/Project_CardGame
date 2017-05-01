  $(document).ready(function(){


  // READ


    const templateText = $('#handTemp').text()
    const pageTemplate = Handlebars.compile(templateText);
    console.log(pageTemplate);
    function renderPage (stateData) {
      $('#hand-container').empty()
                          .append(pageTemplate(stateData));
    }

  function endTurn() { $('.play').prop('disabled', true)}
  function endStart() { $('.play .start').prop('disabled', true)}
  function startTurn() {$('.play .start').prop('disabled', false)}


  Handlebars.registerHelper('times', function(n, block) {
    var accum = '';
    for(var i = 0; i < n; ++i)
        accum += block.fn(i);
    return accum;
  });

  const socket = io('/game');

  socket.on('connect', () => {
    socket.emit('add user', '/game#' + socket.id);
  });
  socket.on('game ready', () => {
    $('body').append("<p class='getready'>Game starting</p>");
    setTimeout(() => {$('.getready').empty();}, 5000);
  });
    // });
  socket.on('start game', (stateData) => {
    renderPage(stateData);
    console.log(stateData);
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
    socket.emit('draw', '/game#' + socket.id);
  });

  $('.takeTop').on('click', (e) => {
    e.preventDefault();
    endStart();
    socket.emit('takeTop', '/game#'+socket.id);
  });
  $('.takeAll').on('click', (e) => {
    e.preventDefault();
    endStart();
    socket.emit('takeAll', '/game#'+socket.id);
  });
  $('.discard').on('click', (e) => {
    e.preventDefault();
    $()
    socket.emit('takeAll', '/game#'+socket.id);
  });
  $('.dropSet').on('click', () => {
    e.preventDefault();
    socket.emit('takeAll', '/game#'+socket.id);
  });
});