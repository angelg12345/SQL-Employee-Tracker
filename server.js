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