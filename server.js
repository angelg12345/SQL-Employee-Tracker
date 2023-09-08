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
    const query = `
    SELECT 
        employee.employee_id, 
        employee.first_name, 
        employee.last_name, 
        role.title AS role_title, 
        role.salary, 
        department.department_name, 
        CONCAT(manager.first_name, ' ', manager.last_name) AS manager_name
    FROM 
        employee
    LEFT JOIN role ON employee.role_id = role.role_id
    LEFT JOIN department ON role.department_id = department.department_id
    LEFT JOIN employee AS manager ON employee.manager_id = manager.employee_id
`;

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

const addEmployee = () => {
    inquirer.prompt([
        {
            name: 'firstName',
            type: 'input',
            message: 'Enter the employee\'s first name:'
        },
        {
            name: 'lastName',
            type: 'input',
            message: 'Enter the employee\'s last name:'
        },
        {
            name: 'roleId',
            type: 'input',
            message: 'Enter the employee\'s role ID:'
        },
        {
            name: 'managerId',
            type: 'input',
            message: 'Enter the employee\'s manager ID(if applicable):'
        },
    ]).then((answers) => {
        const query = 'INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)';
        connection.query(query, [answers.firstName, answers.lastName, answers.roleId, answers.managerId], (err, res) => {
            if (err) throw err;
            console.log('Employee added successfully!');
            startApp();
        });
    });
};

const updateEmployee = () => {
   
    let employees;
    let roles;

  
    connection.query('SELECT employee_id, first_name, last_name FROM employee', (err, empResults) => {
        if (err) throw err;
        employees = empResults;

      
        connection.query('SELECT role_id, title FROM role', (err, roleResults) => {
            if (err) throw err;
            roles = roleResults;

          
            inquirer.prompt([
                {
                    name: 'employeeId',
                    type: 'list',
                    message: 'Select the employee to update:',
                    choices: employees.map(employee => ({
                        name: `${employee.first_name} ${employee.last_name}`,
                        value: employee.employee_id
                    }))
                },
                {
                    name: 'roleId',
                    type: 'list',
                    message: 'Select the new role for the employee:',
                    choices: roles.map(role => ({
                        name: role.title,
                        value: role.role_id
                    }))
                }
            ]).then((answers) => {
                const query = 'UPDATE employee SET role_id = ? WHERE employee_id = ?';
                connection.query(query, [answers.roleId, answers.employeeId], (err, res) => {
                    if (err) throw err;
                    console.log('Employee role updated successfully!');
                    startApp()
                });
            });
        });
    });
};
    
    