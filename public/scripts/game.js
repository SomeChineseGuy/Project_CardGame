  $(document).ready(function(){


    const shuffleText = $('#shuffleAnim').text();
    const shuffTemp = Handlebars.compile(shuffleText);
    function renderShuffle(){
      $('#shuffleAnimation').empty()
                           .append(shuffTemp());
    }
    const templateText = $('#handTemp').text();
    const pageTemplate = Handlebars.compile(templateText);
    function renderPage (stateData) {
      $('#hand-container').empty()
                          .append(pageTemplate(stateData));
    }


  function endTurn() { /*$('.play').prop('disabled', true)*/}
  function endStart() { /*$('.play.start').prop('disabled', true)*/}
  function startTurn() {/*$('.play').prop('disabled', false)*/}

    // function endTurn() { $('.play').prop('disabled', true); }
    // function endStart() { /*$('.play.start').prop('disabled', true)*/ }
    // function startTurn() { $('.play').prop('disabled', false); }



    Handlebars.registerHelper('times', function(n, block) {
      var accum = '';
      for(var i = 0; i < n; ++i)      { accum += block.fn(i); }
      return accum;
    });

    const socket = io('/game');

    socket.on('connect', () => {
      socket.emit('add user', '/game#' + socket.id);
      renderShuffle();
    });
    socket.on('game ready', () => {
      setTimeout(() => { $('#shuffleAnimation').empty(); }, 5000);

    });
    // });
    socket.on('start game', (stateData) => {
      renderPage(stateData);
    });
    socket.on('firstTurn', () => endStart());
    socket.on('waitTurn', () => {
      $('body').append("<p class='waiting'>Waiting for Opponent</p>");
    });
    socket.on('startTurn', () => {
      $('p.waiting').remove();
    });
    socket.on('new state', (stateData) => {
      renderPage(stateData);


    });

    socket.on('winner', () => {
      alert('you win!');
      setTimeout(()=> window.location = '/', 1000);
    });

    socket.on('loser', () => {
      alert('Sorry you lose');
      setTimeout(() => window.location = '/', 1000);
    });

    socket.on('selectCard', (message) => {
      alert(message);
    });


    $(document).on('click', '.draw', (e) => {
      console.log('click');
      endStart();
      e.preventDefault();
      socket.emit('draw', '/game#' + socket.id);
    });

    $(document).on('click', '.takeTop', (e) => {
      endStart();
      e.preventDefault();
      socket.emit('takeTop', '/game#' + socket.id);
    });
    $(document).on('click', '.takeAll', (e) => {
      endStart();
      e.preventDefault();
      socket.emit('takeAll', '/game#' + socket.id);
    });

    $(document).on('click', '.discard', (e) => {
      e.preventDefault();
      const selectedID = $('.cardSelected').data("idIdx");
      socket.emit('discard', '/game#' + socket.id, selectedID);
    });

    $(document).on('click', '.dropSet', (e) => {
      e.preventDefault();
      socket.emit('dropSet', '/game#' + socket.id);
    });
    $(document).on('click', '.attachOne', (e) => {
      e.preventDefault();
      socket.emit('attachOne', '/game#' + socket.id);
    });

    $(document).on('click', '.pHand', (e) => {
      $('.pHand').removeClass('cardSelected');
      $(e.target).addClass('cardSelected');
    })


});


