const express = require('express');
const { createGroup, findAllGroups, addUserToGroup, removeUserFromGroup, getAllRecentPosts } = require('../controller/groups');
const logger = require('../logger');

const apiGroups = express.Router();

apiGroups.post('/', (req, res) =>
  !req.body.title && !req.body.description
    ? res.status(400).send({
      success: false,
      message: 'Title or description is incorrect'
    })
    : createGroup(req.body, req.user)
      .then(group => res.status(201).send({
        success: true,
        profile: group,
        message: 'Group has been created'
      }))
      .catch(err => {
        logger.error(`💥 Failed to create group : ${err.stack}`);
        return res.status(500).send({
          success: false,
          message: `${err.name} : ${err.message}`
        });
      })
);

apiGroups.post('/user', (req, res) =>
  !req.body.groupId && !req.body.userId
    ? res.status(400).send({
      success: false,
      message: 'userId and groupId is incorrect',
    })
    : addUserToGroup(req.body)
      .then(() => {
        res.status(201).send({
          success: true,
          message: `user ${req.body.userId} succesfully joined group ${req.body.groupId}`,
        });
      })
      .catch(err => {
        logger.error(`💥 Failed to add user in groups : ${err.stack}`);
        return res.status(500).send({
          success: false,
          message: `${err.name} : ${err.message}`,
        });
      })
);

apiGroups.delete('/user', (req, res) =>
  !req.body.groupId && !req.body.userId
    ? res.status(400).send({
      success: false,
      message: 'userId and groupId is incorrect',
    })
    : removeUserFromGroup(req.body)
      .then(() => {
        res.status(201).send({
          success: true,
          message: `user ${req.body.userId} was removed from group ${req.body.groupId}`,
        });
      })
      .catch(err => {
        logger.error(`💥 Failed to remove user in groups : ${err.stack}`);
        return res.status(500).send({
          success: false,
          message: `${err.name} : ${err.message}`,
        });
      })
);


apiGroups.get('/', (req, res) =>
  findAllGroups().then(groups => res.status(200).send({
    success: true,
    profile: groups,
    message: 'The list of groups'
  })).catch(err => {
    logger.error(`💥 Failed to get list of groups : ${err.stack}`);
    return res.status(500).send({
      success: false,
      message: `${err.name} : ${err.message}`
    });
  })
);

apiGroups.get('/posts', (req, res) =>
  getAllRecentPosts(req.user).then(groups => res.status(200).send({
    success: true,
    profile: groups,
    message: 'The list of posts'
  })).catch(err => {
    logger.error(`💥 Failed to get list of posts : ${err.stack}`);
    return res.status(500).send({
      success: false,
      message: `${err.name} : ${err.message}`
    });
  })
);

module.exports = { apiGroups };
