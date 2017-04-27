exports.up = function(knex, Promise) {
  return Promise.all([
    knex.schema.createTable('games', function (table) {
      table.increments();
      table.string('name');
    }),

    knex.schema.createTable('matches', function (table) {
      table.increments();
      table.integer('winner_id')
           .notNullable()
           .references('id')
           .inTable('users')
           .onDelete('CASCADE')
           .index();
      table.integer('game_id')
           .notNullable()
           .references('id')
           .inTable('games')
           .onDelete('CASCADE')
           .index();
    }),

    knex.schema.createTable('sessions', function (table) {
      table.integer('user_id')
           .notNullable()
           .references('id')
           .inTable('users')
           .onDelete('CASCADE')
           .index();
      table.integer('match_id')
           .notNullable()
           .references('id')
           .inTable('matches')
           .onDelete('CASCADE')
           .index();
    }),

    knex.schema.table('users', (table) => {
      table.string('email');
      table.string('password');
    })

  ]);
};

exports.down = function(knex, Promise) {
  return Promise.all([
    knex.schema.dropTable('games'),
    knex.schema.dropTable('matches'),
    knex.schema.dropTable('sessions'),
    knex.schema.table('users', (table) => {
      table.dropColumn('email');
      table.dropColumn('password');
    })
  ]);
};
