const inquirer = require('inquirer')
const fs = require('fs')
require('console.table')

const mysql = require('mysql2')

const db = mysql.createConnection(
    {
        host: 'localhost',
        user: 'root',
        password: 'SolluxCaptor18*',
        database: 'employees_db'
    },
    console.log(`Connection established with employees_db`)
)

inquirer
    .prompt([
        {
            type: 'list',
            message: 'I want to:',
            choices: [
                'View Tables',
                'Edit Tables'
            ],
            name: 'usageType'
        }
    ])
    .then((choice) => {
        const chose = choice.usageType
        console.log(chose)
        if (chose == 'View Tables') {
        
            inquirer
                .prompt([
                    {
                        type: 'list',
                        message: 'I want to view:',
                        choices: [
                            'Employees',
                            'Roles',
                            'Departments'
                        ],
                        name: 'selectTable'
                    }
                ])
                .then((input) => {
                    //Viewing Tables
                    const i = input.selectTable
    
                    if (i == 'Employees') {
    
                        db.query('SELECT * FROM employee', function(err, result) {
                            console.table(result)
                        })
                    } else if (i == 'Roles') {
    
                        db.query('SELECT * FROM role', function(err, result) {
                            console.table(result)
                        })
                    } else if (i == 'Departments') {
    
                        db.query('SELECT * FROM department', function(err, result) {
                            console.table(result)
                        })
                    }
                })
        } else if (chose == 'Edit Tables') {
            inquirer.prompt([
                {
                    type: 'confirm',
                    message: 'WARN: Choosing this option can edit critical information. Would you like to continue?',
                    name: 'editWarn'
                }
            ])
            .then((value) => {
                const val = value.editWarn
                if (val !== true) {
                    console.log('bye!')
                    return
                }
                    inquirer
                        .prompt([
                            {
                                type: 'list',
                                message: 'I want to edit the table of: ',
                                choices: [
                                    'Employees',
                                    'Roles',
                                    'Departments'
                                ],
                                name: 'selectEdit'
                            }
                        ])
                        .then((edit) => {
                            const ed = edit.selectEdit

                            if (ed == 'Employees') {

                                inquirer
                                    .prompt([
                                        {
                                            type: 'list',
                                            choices: [
                                                'Add an Employee',
                                                'Update an Employee'
                                            ],
                                            message: 'I want to:',
                                            name: 'empEdit'
                                        }
                                    ])
                                    .then((emp) => {
                                        eEdit = emp.empEdit
                                        if (eEdit !== 'Update an Employee') {
                                            let empArr = []
                                            //TODO: Allow reading of sql content
                                            db.query('SELECT id FROM employee', function(err, result) {
                                                result.forEach((e) => {
                                                    const id = e
                                                    console.log(id)
                                                    empArr.push(id)
                                                })
                                            })
                                            inquirer
                                            .prompt([
                                                {
                                                    type: 'input',
                                                    message: `Employee's First name:`,
                                                    name: 'first'
                                                },
                                                {
                                                    type: 'input',
                                                    message: `Employee's Last name:`,
                                                    name: 'last'
                                                }
                                                //TODO:
                                                    //choose role

                                                    //choose manager
                                                ])
                                                    .then((res) => {
                                                        fName = res.first
                                                        lName = res.last

                                                        console.log(fName, lName)
                                                    })
                                        } else {
                                            db.query('SELECT first_name, last_name FROM employee', function(err, result) {
                                                console.table(result)
                                                result.forEach((row) => {
                                                    console.log(row)
                                                })
                                            })
                                        }
                                        
                                        //get employees from employee_db

                                        //prompt user to select employees
                                            //then selected employee data can be changed
                                    })
                            } else if (ed == 'Roles') {

                                inquirer
                                    .prompt([
                                        {
                                            type: 'list',
                                            message: 'I want to:',
                                            choices: [
                                                'Add a Role',
                                                'Exit Program'
                                            ],
                                            name: 'roleEdit'
                                        }
                                    ])
                                        .then((role) => {
                                            reddit = role.roleEdit
                                            if (reddit !== 'Add a Role') {
                                                console.log('Bye!')
                                                return
                                            }
                                            inquirer
                                            .prompt([
                                                {
                                                    type: 'input',
                                                    message: 'New role name:',
                                                    name: 'roleName'
                                                }
                                            ])
                                            .then((role) => {
                                                        //TODO: create new role in sql from input
                                                        rName = role.roleName
                                                        
                                                        console.log(rName)
                                                    })
                                        })
                            } else if (ed == 'Departments') {

                                inquirer
                                .prompt([
                                    {
                                        type: 'list',
                                        message: 'I want to:',
                                        choices: [
                                            'Add a Department',
                                            'Exit Program'
                                        ],
                                        name: 'deptEdit'
                                    }
                                ])
                                .then((dept) => {
                                    dEdit = dept.deptEdit
                                    if (dEdit !== 'Add a Department') {
                                        console.log('Bye!')
                                        return
                                    }
                                    inquirer
                                    .prompt([
                                        {
                                            type: 'input',
                                            message: 'New department name:',
                                            name: 'name'
                                        }
                                    ])
                                    .then((text) => {
                                                //TODO: create new department in sql from input
                                                deptName = text.name

                                                console.log(deptName)
                                            })
                                })
                            }

                        })
            })
        }
    })