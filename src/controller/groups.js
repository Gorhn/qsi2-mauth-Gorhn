const col = require('sequelize').col;

const { Groups, Users } = require('../model');

const createGroup = ({title, description, metadata}, {id}) =>
  Groups.create({
    title,
    description,
    metadata,
    ownerId: id
  });

const findAllGroups = () => Groups.findAll();

const getAllRecentPosts = ({id}) => Groups.findAll({
  include: [{
    model: Users,
    where: { userId: col('user.id') }
  }]
}).then(group => console.log(group));

const addUserToGroup = ({groupId, userId}) =>
  Groups.findOne({
    where: { id: groupId }
  }).then(group =>
    group ? group.addUser(userId) : Promise.reject(new Error('Group not found'))
  );

const removeUserFromGroup = ({ groupId, userId }) =>
  Groups.findOne({
    where: { id: groupId },
  }).then(group =>
    group
      ? group.removeUser(userId)
      : Promise.reject(new Error('Group not found'))
  );

module.exports = { createGroup, findAllGroups, addUserToGroup, removeUserFromGroup, getAllRecentPosts };

