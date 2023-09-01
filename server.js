const mysql = require('mysql2');
const inquirer = require('inquirer');
const express = require('express');
const cTable = require('console.table');
const { error } = require('console');
require('dotenv').config();


const connection = mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: process.env.DB_PASSWORD,
    database: 'employeeTrackerDB'
});

connection.connect((err) => {
    if (err) throw err;
    console.log(`Connected as id ${connection.threadID} \n`)
    startApp()
});

function startApp() {
    inquirer.prompt([
        {
            type: 'list',
            name: 'menu',
            message: 'What would you like to do?',
            choices: [
                'View all departments',
                'View all roles',
                'View all employees',
                'Add a department',
                'Add a role',
                'Add an employee',
                'Update an employee role',
                'Exit'
            ]
        }
    ]).then((answer) => {
        switch (answer.menu) {
            case 'View all departments':
                viewDepartments();
                break;
            case 'View all roles':
                viewRoles();
                break;
            case 'View all employees':
                viewEmployees();
                break;
            case 'Add a department':
                addDepartment();
                break;
            case 'Add a role':
                addRole();
                break;
            case 'Add an employee':
                addEmployee();
                break
            case 'Update an employee role':
                updateEmployee();
                break; 
            case 'Exit':
                connection.end();
                break;
        }
    });
}

function viewDepartments(){
    const query = 'SELECT * FROM department';
    connection.query(query, (err, results) => {
        if (err) throw err;
        console.table(results);
        startApp();
    });
}

const viewRoles = () => {
    const query = `
        SELECT role.role_id, role.title, role.salary, department.department_name
        FROM role
        INNER JOIN department ON role.department_id = department.department_id
    `;
    connection.query(query, (err, results) => {
        if (err) throw err;
        console.table(results);
        startApp();
    });
};


function viewEmployees() {
    const query = 'SELECT * FROM employee';
    connection.query(query, (err, results) => {
        if (err) throw err;
        console.table(results);
        startApp();
    });
}

function addDepartment(){
    inquirer.prompt([
        {
            type: 'input',
            name: 'departmentName',
            message: 'Enter the name of the department:'
        }
    ]).then((answer) => {
        connection.query('INSERT INTO department (department_name) VALUES (?)', [answer.departmentName], (err, res) => {
            if (err) throw err;
            console.log('Department added successfully!');
            startApp();
        });
    });
}

function addRole(){
    connection.query('SELECT * FROM department', (err, departments) => {
        if (err) throw err;
        inquirer.prompt([
            {
                type: 'input',
                name: 'title',
                message: 'Enter the name of the role:'
            },
            {
                type: 'input',
                name: 'salary',
                message: 'Enter the salary for the role:'
            },
            {
                type: 'list',
                name: 'departmentID',
                message: 'Select the department for the role:',
                choices: departments.map(department => ({ name: department.department_name, value: department.department_id}))
            }
        ]).then((answer) => {
            connection.query('INSERT INTO role (title, salary, department_id) VALUES(?, ?, ?)',
            [answer.title, answer.salary, answer.departmentID],
            (err, res) => {
                if (err) throw err;
                console.log('role added successfully!');
                startApp();
            });
        })
    })
}