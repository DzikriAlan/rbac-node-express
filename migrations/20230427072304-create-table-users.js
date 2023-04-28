'use strict';

/** @type {import('sequelize-cli').Migration} */
var { roles } = require('../utils/roles')
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('users', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
      },
      email: {
        type: Sequelize.STRING,
        required: true,
        lowercase: true,
        unique: true
      },
      password: {
        type: Sequelize.STRING,
        required: true
      },
      role: {
        type: Sequelize.ENUM(roles.admin, roles.moderator, roles.client),
        defaultValue: roles.client,
        allowNull: false
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false
      }
    })
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('users')
  }
};
