
exports.seed = function(knex, Promise) {
  return knex('games').del()
    .then(function () {
      return Promise.all([
        knex('games').insert({id: 1, name: 'Rummy'}),
        knex('games').insert({id: 2, name: 'Cups'})
      ]);
    });
};
