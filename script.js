let classList = [];
let userList = [];

document.getElementById('userSubmitBtn').addEventListener('click', createUser);
document.getElementById('classSubmitBtn').addEventListener('click', createClass);
document.getElementById('classDeleteBtn').addEventListener('click', deleteClass);

function createUser() {

    let name = document.getElementById('name');
    let password = document.getElementById('password');
    let isTeacher = document.getElementById('isTeacher').checked;

    userList.push({name, password, isTeacher});
};

function createClass() {
    
    let className = document.getElementById('className');
    let courseNumber = document.getElementById('courseNumber');
    let classDescrip = document.getElementById('classDescrip');

    classList.push({className, courseNumber, classDescrip});
};

function deleteClass(courseNumber) {  
    
    let index = classList.indexOf(classList.find(_class => _class.courseNumber == courseNumber));

    classList.splice(index, 1);
};