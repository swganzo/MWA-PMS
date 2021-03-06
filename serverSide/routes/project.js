const express = require('express');
// const router = express.Router();
const router = express.Router();
const auth = require('./checkAuth');
const ObjectID = require('mongodb').ObjectID;

const user = 'user';
const task = 'task';
let db = null;

// GET PROJECT DETAIL
router.get('/detail/:user_id/:project_id', auth, function (req, res) {
    db = req.db;
    const id = req.params.project_id;
    const user_id = req.params.user_id;
    db.collection(user).find({ _id: ObjectID(user_id), "projects.id": ObjectID(id) }).project({ "projects.$.id": 1, _id: 0 }).toArray(function (err, docArr) {
        if (err) throw err;
        res.send(docArr);
    });
});

// POST CREATE PROJECT
router.post('/create', auth, function (req, res) {
    db = req.db;
    const postCreateProject = req.body;
    const user_id = ObjectID(postCreateProject.user_id);
    const idddd = new ObjectID();
    if (!isEmpty(postCreateProject.name)) {
        db.collection(user).update({ _id: user_id }, {
            $push: {
                projects: {
                    id: idddd,
                    name: postCreateProject.name,
                    isAdmin: true
                }
            }
        }, function (err, result) {
            if (err) throw err;
            res.send(idddd);
        });
    } else {
        res.send('Project name is required');
    }
});

// PUT ADD USER TO PROJECT
router.put('/adduser/:user_id', auth, function (req, res) {
    db = req.db;
    const user_id = req.params.user_id;
    const putAddProject = req.body;
    const proj_id = putAddProject.project_id;
    const proj_name = putAddProject.name;
    db.collection(user).update({ _id: ObjectID(user_id) }, {
        $push: {
            projects: {
                id: ObjectID(proj_id),
                name: proj_name,
                isAdmin: false
            }
        }
    }, function (err, result) {
        if (err) throw err;
        res.send(result);
    });
});

// PUT REMOVE USER FROM PROJECT
router.put('/deluser/:user_id/:project_id', auth, function (req, res) {
    db = req.db;
    const user_id = req.params.user_id;
    const proj_id = req.params.project_id;
    db.collection(user).update({ _id: ObjectID(user_id) }, {
        $pull: {
            projects: {
                id: ObjectID(proj_id),
            }
        }
    }, function (err, result) {
        if (err) throw err;
        res.send(result);
    });
});

// GET PROJECT LIST
router.get('/:user_id', auth, function (req, res) {
    db = req.db;
    const user_id = req.params.user_id;
    db.collection(user).find({ _id: ObjectID(user_id) }).sort({ 'projects.id': -1 }).project({ projects: 1, _id: 0 }).toArray(function (err, docArr) {
        if (err) throw err;
        res.send(docArr);
    });
});

function isEmpty(str) {
    return (!str || 0 === str.length);
}

module.exports = router;