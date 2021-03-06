const express = require('express');
// const router = express.Router();
const router = express.Router();
const auth = require('./checkAuth');
const ObjectID = require('mongodb').ObjectID;

const col = 'task';
let db = null;

// GET ALL TASK BY PROJECT
router.get('/project/:id', auth, function (req, res) {
    db = req.db;
    const id = req.params.id;
    db.collection(col).find({ project_id: ObjectID(id) }).toArray(function (err, docArr) {
        if (err) throw err;
        res.send(docArr);
    });
});

// GET TASK BY ID
router.get('/detail/:id', auth, function (req, res) {
    db = req.db;
    const id = req.params.id;
    db.collection(col).find({ _id: ObjectID(id) }).toArray(function (err, docArr) {
        if (err) throw err;
        res.send(docArr);
    });
})

// POST CREATE TASK
router.post('/create', auth, function (req, res) {
    db = req.db;
    const postCreateData = req.body;
    const taskDueDate = isEmpty(postCreateData.dueDate) ? new Date() : new Date(postCreateData.dueDate);
    const userId = isEmpty(postCreateData.user_id) ? null : ObjectID(postCreateData.user_id);
    if (!isEmpty(postCreateData.name) && !isEmpty(postCreateData.project_id)) {
        db.collection(col).insert({
            name: postCreateData.name,
            description: postCreateData.description,
            dueDate: taskDueDate,
            comments: [],
            project_id: ObjectID(postCreateData.project_id),
            user_id: userId,
            status: 'pending'
        }, function (err, result) {
            if (err) throw err;
            res.send(result.ops[0]._id);
        });
    } else {
        res.send('Task name and project_id are required');
    }
});

// DELETE TASK
router.delete('/delete/:task_id', auth, function (req, res) {
    db = req.db;
    const id = req.params.task_id;
    db.collection(col).remove({ _id: ObjectID(id) }, function (err, result) {
        if (err) throw err;
        res.send(result);
    });
});



// SET COMPLETE TASK
router.put('/complete/:task_id', auth, function (req, res) {
    db = req.db;
    const id = req.params.task_id;
    db.collection(col).update({ _id: ObjectID(id) }, { $set: { status: "completed" } }, function (err, result) {
        if (err) throw err;
        res.send(result);
    });
});

// SET PENDING TASK
router.put('/pending/:task_id', auth, function (req, res) {
    db = req.db;
    const id = req.params.task_id;
    db.collection(col).update({ _id: ObjectID(id) }, { $set: { status: "pending" } }, function (err, result) {
        if (err) throw err;
        res.send(result);
    });
});


// GET ALL TASK LIST
router.get('/', auth, function (req, res) {
    db = req.db;
    db.collection(col).find({}).toArray(function (err, docArr) {
        if (err) throw err;
        res.send(docArr);
    });
});

// UPDATE TASK
router.put('/', auth, function (req, res) {
    db = req.db;
    const task = req.body;
    const task_id = task._id;
    const task_name = task.name;
    db.collection(col).update({ _id: ObjectID(task_id) }, { $set: { name: task_name } }, function (err, result) {
        if (err) throw err;
        res.send(result);
    });
});


function isEmpty(str) {
    return (!str || 0 === str.length);
}

module.exports = router;