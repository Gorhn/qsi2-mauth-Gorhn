const omit = require('lodash.omit');
const { Users, Groups } = require('../model');

const createUser = ({ firstName, lastName, email, password }) =>
  Users.create({
    email,
    firstName: firstName || '',
    lastName: lastName || '',
    hash: password
  }).then(user =>
    omit(
      user.get({
        plain: true
      }),
      Users.excludeAttributes
    )
  );

const loginUser = ({ email, password }) =>
  Users.findOne({
    where: {
      email
    }
  }).then(user =>
    user && !user.deletedAt
      ? Promise.all([
          omit(
            user.get({
              plain: true
            }),
            Users.excludeAttributes
          ),
          user.comparePassword(password)
        ])
      : Promise.reject(new Error('UNKOWN OR DELETED USER'))
  );

const getUser = ({ id }) =>
  Users.findOne({
    where: {
      id
    }
  }).then(user =>
    user && !user.deletedAt
      ? omit(
          user.get({
            plain: true
          }),
          Users.excludeAttributes
        )
      : Promise.reject(new Error('UNKOWN OR DELETED USER'))
  );


const updateUser = (id, { firstname, lastname }) =>
  Users.update(
    { firstName: firstname || '', lastName: lastname || ''},
    { returning: true, where: {id} }
  ).then(value => {
    const user = value[1][0].dataValues;
    return user && !user.deletedAt
      ? omit(user)
      : Promise.reject(new Error('UNKOWN OR DELETED USER'))
  });

const deleteUser = ({ id }) => 
Users.destroy(
  { returning: true, where: {id} }
).then(value =>  {
  omit(value[0].dataValues);
});


module.exports = {
  createUser,
  getUser,
  loginUser,
  updateUser,
  deleteUser
};
