const mysql = require('mysql2');
const inquirer = require('inquirer');
const express = require('express');
const cTable = require('console.table');
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

function viewRoles() {
    const query = 'SELECT * FROM role';
    connection.query(query, (err, results) => {
        if (err) throw err;
        console.table(results);
        startApp();
    });
}

