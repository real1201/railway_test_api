const bcrypt = require("bcrypt");
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define("User", {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: {
        args: true,
        msg: "Name already taken.",
      },
      validate: {
        min: (value) => {
          if (value.length <= 2) {
            throw new Error("Invalid name.");
          }
        },
        notNull: {
          args: true,
          msg: "Name cannot be empty.",
        },
      },
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: {
        args: true,
        msg: "Email already taken.",
      },
      validate: {
        isEmail: {
          args: true,
          msg: "Invalid email address.",
        },
        notNull: {
          args: true,
          msg: "Email cannot be empty.",
        },
      },
    },
    password: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        is: {
          // /^(?=.*[A-Z])+^(?=.*[a-z])+^(?=.*[0-9])+^(?=.*[~`!@#$%^&*()--+={}\[\]|\\:;"'<>,.?/_₹])/
          // Uppercase    Lowercace     Numbers         Special Symbles  8 Characters long
          args: [
            /^(?!.*\s)(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[~`!@#$%^&*()--+={}\[\]|\\:;"'<>,.?/_₹]).{8,100}$/,
          ], //
          msg: "Password must be [8 characters long, atleast 1 uppercase/lowercase and special characters]",
        },
        notNull: {
          args: true,
          msg: "Password cannot be empty.",
        },
      },
    },
    role: {
      type: DataTypes.ENUM("user", "admin"),
      notNull: false,
      defaultValue: "user",
    },
    comparePassword: {
      type: DataTypes.VIRTUAL,
      allowNull: false,

      validate: {
        notNull: {
          args: true,
          msg: "Compare password is required.",
        },
        isMatch(value) {
          if (value !== this.password) {
            // console.log(value, this.password);
            throw new Error("Password did not match.");
          } else {
            const passwordHash = bcrypt.hashSync(this.password, 10);
            const cpasswordHash = bcrypt.hashSync(value, 10);
            this.setDataValue("password", passwordHash);
            this.setDataValue("comparePassword", cpasswordHash);
          }
        },
      },
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: sequelize.literal("CURRENT_TIMESTAMP"),
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: sequelize.literal("CURRENT_TIMESTAMP"),
    },
  });
  return User;
};
