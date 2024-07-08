const express = require('express');
const admin = require('firebase-admin');
const bodyParser = require('body-parser');
const cors = require('cors');

// Firebase Admin SDK initialization
const serviceAccount = require('C:/Users/USER/todo_webapp/servicekey.json');
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://my-todo-app-9539c-default-rtdb.firebaseio.com'
});

const db = admin.firestore();
const app = express();
app.use(bodyParser.json());
app.use(cors());

// User login endpoint
app.post('/login', async (req, res) => {
  const { email } = req.body;
  try {
    // Sign in with email and password
    const userRecord = await admin.auth().getUserByEmail(email);
    const idToken = await admin.auth().createCustomToken(userRecord.uid);
    
    res.status(200).send({ token: idToken });
  } catch (error) {
    console.error(error);
    res.status(400).send({ error: 'Invalid login credentials' });
  }
});

// Add task endpoint
app.post('/tasks', async (req, res) => {
  const { userId, task } = req.body;
  try {
    await db.collection('tasks').add({ userId, task });
    res.status(200).send({ message: 'Task added successfully' });
  } catch (error) {
    console.error(error);
    res.status(400).send({ error: 'Failed to add task' });
  }
});

// Get tasks endpoint
app.get('/tasks/:userId', async (req, res) => {
  const { userId } = req.params;
  try {
    const snapshot = await db.collection('tasks').where('userId', '==', userId).get();
    const tasks = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.status(200).send(tasks);
  } catch (error) {
    console.error(error);
    res.status(400).send({ error: 'Failed to get tasks' });
  }
});

// Delete task endpoint
app.delete('/tasks/:taskId', async (req, res) => {
  const { taskId } = req.params;
  try {
    await db.collection('tasks').doc(taskId).delete();
    res.status(200).send({ message: 'Task deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(400).send({ error: 'Failed to delete task' });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
