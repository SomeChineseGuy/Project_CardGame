exports.seed = function(knex, Promise) {
  return knex('users').del()
    .then(function () {
      return Promise.all([
        knex('users').insert({id: 1, name: 'Player 1', email: 'edurne.berastegi@gmail.com', password: '', locale: 'en', phone:'6044419955'}),
        knex('users').insert({id: 2, name: 'Player 2', email: 'edurne.berastegi@gmail.com', password: '', locale: 'es', phone:'6044419955'}),
      ]);
    });
};
