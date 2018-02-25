//Import User Model Schema
const User = require('../models/user');
//Import Journal Model Schema
const Journal = require('../models/journal');
//Import Json Web Token
const jwt = require('jsonwebtoken');
//Import Configuration for Database
const config = require('../config/database');

module.exports = (router) => {

  router.post('/newJournal', (req, res) => {
    if (!req.body.title) {
      res.json({
        success: false,
        message: 'Journal title is required'
      });
    } else {
      if (!req.body.body) {
        res.json({
          success: false,
          message: 'Journal body is required'
        });
      } else {
        if (!req.body.createdBy) {
          res.json({
            success: false,
            message: 'Journal creator is required'
          });
        } else {
          const journal = new Journal({
            title: req.body.title,
            body: req.body.body,
            createdBy: req.body.createdBy
          });
          journal.save((err) => {
            if (err) {
              if (err.errors) {
                if (err.errors.title) {
                  res.json({
                    success: false,
                    message: err.errors.title.message
                  });
                } else {
                  if (err.errors.body) {
                    res.json({
                      success: false,
                      message: err.errors.body.message
                    });
                  } else {
                    res.json({
                      success: false,
                      message: err.errmsg
                    });
                  }
                }
              } else {
                res.json({
                  success: false,
                  message: err
                });
              }
            } else {
              res.json({
                success: true,
                message: 'Journal saved!'
              });
            }
          });
        }
      }
    }
  });

  router.get('/allJournals', (req, res) => {
    Journal.find({}, (err, journals) => {
      if (err) {
        res.json({
          success: false,
          message: err
        });
      } else {
        if (!journals) {
          res.json({
            success: false,
            message: 'No journals found.'
          });
        } else {
          res.json({
            success: true,
            journals: journals
          });
        }
      }
    }).sort({
      '_id': -1
    });
  });

  router.get('/singleJournal/:id', (req, res) => {
    if (!req.params.id) {
      res.json({
        success: false,
        message: 'No journal ID was provided'
      })
    } else {
      Journal.findOne({
        _id: req.params.id
      }, (err, journal) => {
        if (err) {
          res.json({
            success: false,
            message: 'Not a valid journal ID'
          });
        } else {
          if (!journal) {
            res.json({
              success: false,
              message: 'Journal not found.'
            });
          } else {
            User.findOne({
              _id: req.decoded.userId
            }, (err, user) => {
              if (err) {
                res.json({
                  success: false,
                  message: err
                });
              } else {
                if (!user) {
                  res.json({
                    success: false,
                    message: 'Unable to authenticate user'
                  });
                } else {
                  if (user.username !== journal.createdBy) {
                    res.json({
                      success: false,
                      message: 'You are not authorized to edit this journal.'
                    });
                  } else {
                    res.json({
                      success: true,
                      journal: journal
                    });
                  }
                }
              }
            });
          }
        }
      });
    }
  });

  router.put('/updateJournal', (req, res) => {
    if (!req.body._id) {
      res.json({
        success: false,
        message: 'No journal ID provided'
      });
    } else {
      Journal.findOne({
        _id: req.body._id
      }, (err, journal) => {
        if (err) {
          res.json({
            success: false,
            message: 'Not a valid journal ID'
          });
        } else {
          if (!journal) {
            res.json({
              success: false,
              message: 'Journal ID was not found'
            });
          } else {
            User.findOne({
              _id: req.decoded.userId
            }, (err, user) => {
              if (err) {
                res.json({
                  success: false,
                  message: err
                });
              } else {
                if (!user) {
                  res.json({
                    success: false,
                    message: 'Unable to authenticate user.'
                  });
                } else {
                  if (user.username !== journal.createdBy) {
                    res.json({
                      success: false,
                      message: 'You are not authorized to edit this journal entry.'
                    });
                  } else {
                    journal.title = req.body.title,
                      journal.body = req.body.body
                    journal.save((err) => {
                      if (err) {
                        res.json({
                          success: false,
                          message: err
                        });
                      } else {
                        res.json({
                          success: true,
                          message: 'Journal updated!'
                        });
                      }
                    });
                  }
                }
              }
            });
          }
        }
      });
    }
  });

  router.delete('/deleteJournal/:id', (req, res) => {
    if (!req.params.id) {
      res.json({
        success: false,
        message: 'No ID provided'
      });
    } else {
      Journal.findOne({
        _id: req.params.id
      }, (err, journal) => {
        if (err) {
          res.json({
            success: false,
            message: 'Invalid ID'
          });
        } else {
          if (!journal) {
            res.json({
              success: false,
              message: 'Journal was not found'
            });
          } else {
            User.findOne({
              _id: req.decoded.userId
            }, (err, user) => {
              if (err) {
                res.json({
                  success: false,
                  message: err
                });
              } else {
                if (!user) {
                  res.json({
                    success: false,
                    message: 'Unable to authenticate user'
                  });
                } else {
                  if (user.username !== journal.createdBy) {
                    res.json({
                      success: false,
                      message: 'You are not authorized to delete this journal entry'
                    });
                  } else {
                    journal.remove((err) => {
                      if (err) {
                        res.json({
                          success: false,
                          message: err
                        });
                      } else {
                        res.json({
                          success: true,
                          message: 'Journal Deleted!'
                        });
                      }
                    });
                  }
                }
              }
            });
          }
        }
      });
    }
  });

  router.put('/likeJournal', (req, res) => {
    if (!req.body.id) {
      res.json({
        success: false,
        message: 'No ID was provided '
      });
    } else {
      Journal.findOne({
        _id: req.body.id
      }, (err, journal) => {
        if (err) {
          res.json({
            success: false,
            message: 'Invalid journal ID'
          });
        } else {
          if (!journal) {
            res.json({
              success: false,
              message: 'That journal was not found'
            });
          } else {
            User.findOne({
              _id: req.decoded.userId
            }, (err, user) => {
              if (err) {
                res.json({
                  success: false,
                  message: 'Something went wrong.'
                });
              } else {
                if (!user) {
                  res.json({
                    success: false,
                    message: 'Could not authenticate user'
                  });
                } else {
                  if (user.username === journal.createdBy) {
                    res.json({
                      success: false,
                      message: 'Cannot like your own post'
                    });
                  } else {
                    if (journal.likedBy.includes(user.username)) {
                      res.json({
                        success: false,
                        message: 'You already liked this post.'
                      });
                    } else {
                      if (journal.dislikedBy.includes(user.username)) {
                        journal.dislikes--;
                        const arrayIndex = journal.dislikedBy.indexOf(user.username);
                        journal.dislikedBy.splice(arrayIndex, 1);
                        journal.likes++;
                        journal.likedBy.push(user.username);
                        journal.save((err) => {
                          if (err) {
                            res.json({
                              success: false,
                              message: 'Something went wrong'
                            });
                          } else {
                            res.json({
                              success: true,
                              message: 'Journal liked!'
                            });
                          }
                        });
                      } else {
                        journal.likes++;
                        journal.likedBy.push(user.username);
                        journal.save((err) => {
                          if (err) {
                            res.json({
                              success: false,
                              message: 'Something went wrong'
                            });
                          } else {
                            res.json({
                              success: true,
                              message: 'Journal liked!'
                            });
                          }
                        });
                      }
                    }
                  }
                }
              }
            });
          }
        }
      });
    }
  });

  router.put('/dislikeJournal', (req, res) => {
    if (!req.body.id) {
      res.json({
        success: false,
        message: 'No ID was provided '
      });
    } else {
      Journal.findOne({
        _id: req.body.id
      }, (err, journal) => {
        if (err) {
          res.json({
            success: false,
            message: 'Invalid journal ID'
          });
        } else {
          if (!journal) {
            res.json({
              success: false,
              message: 'That journal was not found'
            });
          } else {
            User.findOne({
              _id: req.decoded.userId
            }, (err, user) => {
              if (err) {
                res.json({
                  success: false,
                  message: 'Something went wrong.'
                });
              } else {
                if (!user) {
                  res.json({
                    success: false,
                    message: 'Could not authenticate user'
                  });
                } else {
                  if (user.username === journal.createdBy) {
                    res.json({
                      success: false,
                      message: 'Cannot dislike your own post'
                    });
                  } else {
                    if (journal.dislikedBy.includes(user.username)) {
                      res.json({
                        success: false,
                        message: 'You already disliked this post.'
                      });
                    } else {
                      if (journal.likedBy.includes(user.username)) {
                        journal.likes--;
                        const arrayIndex = journal.likedBy.indexOf(user.username);
                        journal.likedBy.splice(arrayIndex, 1);
                        journal.dislikes++;
                        journal.dislikedBy.push(user.username);
                        journal.save((err) => {
                          if (err) {
                            res.json({
                              success: false,
                              message: 'Something went wrong'
                            });
                          } else {
                            res.json({
                              success: true,
                              message: 'Journal disliked!'
                            });
                          }
                        });
                      } else {
                        journal.dislikes++;
                        journal.dislikedBy.push(user.username);
                        journal.save((err) => {
                          if (err) {
                            res.json({
                              success: false,
                              message: 'Something went wrong'
                            });
                          } else {
                            res.json({
                              success: true,
                              message: 'Journal disliked!'
                            });
                          }
                        });
                      }
                    }
                  }
                }
              }
            });
          }
        }
      });
    }
  });

  router.post('/comment', (req, res) => {
    if (!req.body.comment) {
      res.json({
        success: false,
        message: 'No comment provided'
      });
    } else {
      if (!req.body.id) {
        res.json({
          success: false,
          message: 'No id was provided'
        });
      } else {
        Journal.findOne({
          _id: req.body.id
        }, (err, journal) => {
          if (err) {
            res.json({
              success: false,
              message: 'Invalid journal id'
            });
          } else {
            if (!journal) {
              res.json({
                success: false,
                message: 'Journal not found'
              });
            } else {
              User.findOne({
                _id: req.decoded.userId
              }, (err, user) => {
                if (err) {
                  res.json({
                    success: false,
                    message: 'Something went wrong'
                  });
                } else {
                  if (!user) {
                    res.json({
                      success: false,
                      message: 'User not found'
                    });
                  } else {
                    journal.comments.push({
                      comment: req.body.comment,
                      commentator: user.username
                    });
                    journal.save((err) => {
                      if (err) {
                        res.json({
                          success: false,
                          message: 'Something went wrong'
                        });
                      } else {
                        res.json({
                          success: true,
                          message: 'Comment saved'
                        });
                      }
                    });
                  }
                }
              });
            }
          }
        });
      }
    }
  });

  return router;
}