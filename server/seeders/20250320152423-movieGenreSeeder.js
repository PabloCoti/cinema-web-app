'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('MovieGenres', [
      {
        name: 'Romance',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Acción',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Terror',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Horror',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Infantil',
        createdAt: new Date(),
        updatedAt: new Date()
      },
    ])
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('MovieGenres', null, {});
  }
};
