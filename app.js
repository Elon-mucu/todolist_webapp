import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.3/firebase-app.js";
import { getAuth, onAuthStateChanged, signInWithEmailAndPassword, signOut } from "https://www.gstatic.com/firebasejs/10.12.3/firebase-auth.js";
import { getFirestore, collection, addDoc, getDocs, deleteDoc, doc, query, where } from "https://www.gstatic.com/firebasejs/10.12.3/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyDGI0gynje9rsK3rcTrLpI8KJsiLbB1fTc",
    authDomain: "my-todo-app-9539c.firebaseapp.com",
    databaseURL: "https://my-todo-app-9539c-default-rtdb.firebaseio.com",
    projectId: "my-todo-app-9539c",
    storageBucket: "my-todo-app-9539c.appspot.com",
    messagingSenderId: "911488076702",
    appId: "1:911488076702:web:a54ca02bb3230f252b648f",
    measurementId: "G-1GRFGVDLY9"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

document.addEventListener('DOMContentLoaded', function() {
    const authSection = document.getElementById('auth-section');
    const mainSection = document.getElementById('main-section');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const loginBtn = document.getElementById('login-btn');
    const menuBtn = document.getElementById('menu-btn');
    const sidebar = document.getElementById('sidebar');
    const allTasksBtn = document.getElementById('all-tasks-btn');
    const addTaskBtn = document.getElementById('add-task-btn');
    const logoutBtn = document.getElementById('logout-btn');
    const tasksList = document.getElementById('tasks-list');
    const addTaskFab = document.getElementById('add-task-fab');
    const addTaskModal = document.getElementById('add-task-modal');
    const newTaskInput = document.getElementById('new-task-input');
    const cancelBtn = document.getElementById('cancel-btn');
    const addBtn = document.getElementById('add-btn');

    // Handle auth state changes
    onAuthStateChanged(auth, (user) => {
        if (user) {
            authSection.classList.add('hidden');
            mainSection.classList.remove('hidden');
            loadTasks();
        } else {
            authSection.classList.remove('hidden');
            mainSection.classList.add('hidden');
        }
    });

    loginBtn.addEventListener('click', () => {
        const email = emailInput.value;
        const password = passwordInput.value;
        signInWithEmailAndPassword(auth, email, password)
            .catch(error => {
                alert(error.message);
            });
    });

    logoutBtn.addEventListener('click', () => {
        signOut(auth).catch(error => {
            alert(error.message);
        });
    });

    menuBtn.addEventListener('click', () => {
        sidebar.classList.toggle('hidden');
    });

    allTasksBtn.addEventListener('click', () => {
        sidebar.classList.add('hidden');
        loadTasks();
    });

    addTaskBtn.addEventListener('click', () => {
        sidebar.classList.add('hidden');
        addTaskModal.classList.remove('hidden');
    });

    addTaskFab.addEventListener('click', () => {
        addTaskModal.classList.remove('hidden');
    });

    cancelBtn.addEventListener('click', () => {
        addTaskModal.classList.add('hidden');
    });

    addBtn.addEventListener('click', () => {
        const newTask = newTaskInput.value;
        if (newTask) {
            addDoc(collection(db, 'tasks'), {
                task: newTask,
                uid: auth.currentUser.uid
            }).then(() => {
                newTaskInput.value = '';
                addTaskModal.classList.add('hidden');
                loadTasks();
            }).catch(error => {
                alert(error.message);
            });
        }
    });

    function loadTasks() {
        tasksList.innerHTML = '';
        const userId = auth.currentUser.uid;
        const q = query(collection(db, 'tasks'), where('uid', '==', userId));
        getDocs(q).then(snapshot => {
            snapshot.forEach(taskDoc => {
                const task = taskDoc.data().task;
                const li = document.createElement('li');
                li.textContent = task;
                const deleteBtn = document.createElement('button');
                deleteBtn.textContent = 'Delete';
                deleteBtn.addEventListener('click', () => {
                    deleteDoc(doc(db, 'tasks', taskDoc.id)).then(() => {
                        loadTasks();
                    }).catch(error => {
                        alert(error.message);
                    });
                });
                li.appendChild(deleteBtn);
                tasksList.appendChild(li);
            });
        }).catch(error => {
            alert(error.message);
        });
    }
});
