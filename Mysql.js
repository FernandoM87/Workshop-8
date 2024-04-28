// server.js

const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');

const app = express();

// MySQL Connection
const getDb = () => {
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '', // your MySQL password
  database: 'school' // your database name
});

connection.connect((err) => {
  if (err) throw err;
  console.log('Connected to MySQL database');
});

return connection;
}

app.use(bodyParser.json());

const dbQueryCallback = (resolve, reject, single = false) => (err, result) => {
    if (err) {
        reject(err)
    }

    if(single && result.length > 0) {
        result = result[0]
    }
    else if(single && result.length === 0) {
        result = null
    }

    resolve(result)
}

module.exports.getStudents = async () => {
  const db = getDb()

  const students = await new Promise((resolve, reject)=> {
    db.query('SELECT * FROM students', dbQueryCallback(resolve, reject));
  });
  
  return students
};

module.exports.getStudentById = async (id) => {
  const db = getDb()

  const student = await new Promise((resolve, reject)=> {
    db.query(`SELECT * FROM students WHERE student_id = ${id}`, dbQueryCallback(resolve, reject, true));
  });
  
  return student

}

module.exports.getCourses = async () => {
  const db = getDb()

  const courses = await new Promise((resolve, reject)=> {
    db.query('SELECT * FROM courses', dbQueryCallback(resolve, reject));
  });
  
  return courses

}

module.exports.getCourseByStudentId = async (studentId) => {
  const db = getDb()

  const courses = await new Promise((resolve, reject)=> {
    db.query(`SELECT * FROM courses WHERE student_id = ${studentId}`, dbQueryCallback(resolve, reject));
  });
  
  return courses

}

module.exports.getCourseById = async (id) => {
  const db = getDb()

  const student = await new Promise((resolve, reject)=> {
    db.query(`SELECT * FROM courses WHERE course_id = ${id}`, dbQueryCallback(resolve, reject, true));
  });
  
  return student
}

module.exports.addCourses = async (course) => {
  const db = getDb()

  const result = await new Promise((resolve, reject)=> {
    db.query(`INSERT INTO courses SET ?`, course, dbQueryCallback(resolve, reject, true));
  });
  
  return result

}

module.exports.updateCourses = async (course) => {
  const db = getDb()

  const result = await new Promise((resolve, reject)=> {
    db.query(`UPDATE courses SET ? WHERE course_id = ${course.course_id}`, course, dbQueryCallback(resolve, reject, true));
  });
  
  return result


}


// Create a student
/* app.post('/students', (req, res) => {
  const { name, email } = req.body;
  const INSERT_STUDENT_QUERY = `INSERT INTO students (name, email) VALUES (?, ?)`;
  connection.query(INSERT_STUDENT_QUERY, [name, email], (err, results) => {
    if (err) throw err;
    res.status(201).send('Student created successfully');
  });
}); */

// Read all students
/* app.get('/students', (req, res) => {
  const SELECT_STUDENTS_QUERY = `SELECT * FROM students`;
  connection.query(SELECT_STUDENTS_QUERY, (err, results) => {
    if (err) throw err;
    res.json(results);
  });
});
 */
// Update a student
/* app.put('/students/:id', (req, res) => {
  const studentId = req.params.id;
  const { name, email } = req.body;
  const UPDATE_STUDENT_QUERY = `UPDATE students SET name = ?, email = ? WHERE student_id = ?`;
  connection.query(UPDATE_STUDENT_QUERY, [name, email, studentId], (err, results) => {
    if (err) throw err;
    res.send('Student updated successfully');
  });
});

// Delete a student
app.delete('/students/:id', (req, res) => {
  const studentId = req.params.id;
  const DELETE_STUDENT_QUERY = `DELETE FROM students WHERE student_id = ?`;
  connection.query(DELETE_STUDENT_QUERY, [studentId], (err, results) => {
    if (err) throw err;
    res.send('Student deleted successfully');
  });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
}); */
