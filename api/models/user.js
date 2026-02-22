const { Model, DataTypes } = require('sequelize');
const bcrypt = require('bcrypt');

module.exports = (sequelize) => {
  class User extends Model { }
  
  User.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    designation: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    firstName: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'A first name is required'
        },
        notEmpty: {
          msg: 'Please provide a first name.'
        }
      }
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'A last name is required.'
        },
        notEmpty: {
          msg: 'Please provide a last name.'
        }
      }
    },
    emailAddress: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: {
        msg: 'The email address you entered already exists.'
      },
      validate: {
        notNull: {
          msg: 'An email address is required'
        },
        notEmpty: {
          msg: 'Please provide an email address.'
        },
        isEmail: {
          msg: 'Please enter a valid email address.'
        }
      }
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'A password is required'
        },
        notEmpty: {
          msg: 'Please provide a password.'
        }
      }
    },
    affiliation: {
      type: DataTypes.STRING,
      allowNull: true, // Optional field
      validate: {
        len: {
          args: [0, 100],
          msg: 'Affiliation must be 100 characters or less.'
        }
      }
    },
    areasOfInterest: {
      type: DataTypes.STRING,
      allowNull: true, // Optional field
      validate: {
        len: {
          args: [0, 255],
          msg: 'Areas of interest must be 255 characters or less.'
        }
      }
    },
    homepage: {
      type: DataTypes.STRING,
      allowNull: true, // Optional field
      validate: {
        isUrl: {
          msg: 'Please enter a valid URL.'
        }
      }
    }
  }, {
  sequelize,
  hooks: {
    beforeCreate: (user) => {
      if (user.password) {
        user.password = bcrypt.hashSync(user.password, 10);
      }
    },
    beforeUpdate: (user) => {
      if (user.changed('password') && user.password) {
        user.password = bcrypt.hashSync(user.password, 10);
      }
    }
  }
}
);

  return User;
};
