const express = require('express')
const inquirer = require('inquirer')
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

const PORT = process.env.PORT || 3001;
const app = express()

app.use(express.urlencoded({ extended: false }))
app.use(express.json())

app.get('/employees', (req, res) => {
    db.query('SELECT * FROM employee', (err, employees) => {
        if (err) {
            res.status(404).end()
        }
        res.json(employees)
    })
})

app.get('/roles', (req, res) => {
    db.query('SELECT * FROM role', (err, roles) => {
        if (err) {
            res.status(404).end()
        }
        res.json(roles)
    })
})

app.get('/departments', (req, res) => {
    db.query('SELECT * FROM department', (err, departments) => {
        if (err) {
            res.status(404).end()
        }
        res.json(departments)
    })
})

function empDb() {
    inquirer
        .prompt([
            {
                type: 'list',
                message: 'I want to:',
                choices: [
                    'View Tables',
                    'Edit Tables',
                    'Exit Application'
                ],
                name: 'viewOrEdit'
            }
        ])
        .then((mode) => {
            if (mode.viewOrEdit !== 'Exit Application' && mode.viewOrEdit !== 'Edit Tables') {
                viewTables()
                return
            } else if (mode.viewOrEdit !== 'Exit Application' && mode.viewOrEdit !== 'View Tables') {

                inquirer
                .prompt([
                    {
                        type:'confirm',
                        message: 'WARN: Editing tables can NOT be undone. Would you like to proceed?',
                        name: 'warn'
                    }
                ])
                .then((bool) => {
                    if (bool.warn !== true) {
                        console.log('You will now be taken to view mode.')
                        viewTables()
                        return
                    }
                    console.warn('WARN: Edit mode has been enabled.')
                    editTables()
                })
                return
            }
            exit()
        })
}

function viewTables() {
    inquirer
        .prompt([
            {
                type: 'list',
                message: 'I want to view:',
                choices: [
                    'Employees',
                    'Roles',
                    'Departments',
                    'Go back'
                ],
                name: 'chooseView'
            }
        ])
        .then((view) => {

            switch (view.chooseView) {
                case "Employees":
                        db.query('SELECT * FROM employee', function(err, emp) {
                            console.table(emp)
                        })
                        viewLoop()
                    break
                case "Roles":
                        db.query('SELECT * FROM role', function(err, role) {
                            console.table(role)
                        })
                        viewLoop()
                    break
                case 'Departments':
                        db.query('SELECT * FROM department', function(err, department) {
                            console.table(department)
                        })
                        viewLoop()
                    break
                case 'Go back':
                    empDb()
                    break
            }
        })
}

function editTables() {
    inquirer
        .prompt([
            {
                type: 'list',
                message: 'I want to:',
                choices: [
                    'Edit employees',
                    'Add new roles',
                    'Add new departments',
                    'Go back'
                ],
                name: 'editChoice'
            }
        ])
        .then((edit) => {
            switch (edit.editChoice) {
                case 'Edit employees':
                        editEmp()
                    break
                case 'Add new roles':
                        newRole()
                    break
                case 'Add new departments':
                        newDepartment()
                    break
                case 'Go back':
                    empDb()
                    break
            }
        })
}

function newRole() {
    db.query('SELECT * FROM department', function(err, department) {
        
        inquirer
        .prompt([
            {
                type: 'input',
                message: `Enter the new name of the role you want to add(be sure to NOT include spacing. Ex: 'Example_Title'):`,
                name: 'roleName'
            },
            {
                type: 'input',
                message: 'Enter the salary for the new role:',
                name: 'roleSalary'
            },
            {
                type: 'list',
                choices: department,
                name: 'departmentId'
            }
        ])
        .then((input) => {
            if (/\s/.test(input.roleName)) {
                console.log('Err(066): Your name contains spacing!')
                newRole()
                return
            } else if (isNaN(input.roleSalary)) {
                console.log('Err(420): Invalid salary value!')
            } else {
                db.query('SELECT id FROM department WHERE name = ?', input.departmentId, function (err, ids) {
                    let departmentIdIndividual
                    ids.forEach((id) => {
                        departmentIdIndividual = id.id
                    })
                    console.log(departmentIdIndividual)

                    db.query(`INSERT INTO role (title, salary, department_id)
                    VALUES
                    ("${input.roleName}", ${input.roleSalary}, ${departmentIdIndividual})`, function (err, depart) {
                        console.table(depart)
                    })
                })
            }
            editLoop()
        })
    })
}

function newDepartment() {
    inquirer
        .prompt([
            {
                type: 'input',
                message: 'Enter the name of the department you want to add (be sure this name does NOT contain spacing):',
                name: 'nameDepartment'
            }
        ])
        .then((input) => {
            if (/\s/.test(input.nameDepartment)) {
                console.log('Err(066): Your name contains spacing!')
                newDepartment()
                return
            } else {
                db.query(`INSERT INTO department (name)
                VALUES
                ("${input.nameDepartment}")`, function (err, newDept) {
                    console.table(newDept)
                })
            }
            editLoop()
        })
}

function editEmp() {
    inquirer
    .prompt([
        {
            type: 'list',
            message: 'I want to:',
            choices: [
                'Add an employee',
                'Update an employee',

            ],
            name: 'addOrUpdate'
        }
    ])
    .then((edit) => {
        if (edit.addOrUpdate == 'Update an employee') {
            db.query(`SELECT * FROM employee`, function(err, employees) {
                const empArr = []
                employees.forEach((employee) => {
                    const name = `${employee.first_name} ${employee.last_name}`
        
                    empArr.push(name)
                })
                inquirer
                .prompt([
                    {
                        type: 'list',
                        message: 'Select the employee profile you would like to edit:',
                        choices: empArr,
                        name: 'select'
                    }
                ])
                .then((empChoice) => {
                    let splitName = empChoice.select.split(' ')
                    let firstName = splitName.slice(0,1)
                    let lastName = splitName.slice(1)
        
                    inquirer
                    .prompt([
                        {
                            type: 'list',
                            message: 'I want to:',
                            choices: [
                                `Update role`,
                                `Change manager value`
                            ],
                            name: 'roleManager'
                        }
                    ])
                    .then((change) => {
                        
                        if (change.roleManager == 'Update role') {
                            db.query('SELECT * FROM role', function (err, rows) {
                                const roleArr = []
                                rows.forEach((row) => {
                                    const titleId = `${row.id} ${row.title}`
                                    
                                    roleArr.push(titleId)
                                })
                                    if (change.roleManager == 'Update role') {
                                        inquirer
                                        .prompt([
                                            {
                                                type: 'list',
                                                message: 'What is their new role?',
                                                choices: roleArr,
                                                name: 'roleName'
                                            }
                                        ])
                                        .then((newRole) => {
                                            const split = newRole.roleName.split(' ')
                                            const rName = split.slice(1)
                                        
                                        db.query(`SELECT id FROM role WHERE title = ?`, rName, function(err, rows) {
                                            let idNum = ''
    
                                            rows.forEach((row) => {
                                                idNum = row.id
    
                                            })
                                            db.query(`UPDATE employee SET role_id = ? WHERE last_name = "${lastName}"`, idNum, function(err, newRole) {
                                                console.log(`Successfully updated ${firstName} ${lastName}'s profile`)
                                            })
                                        })
                                        editLoop()
                                        return
                                    })
                                }
                            })
                        } else {
                            inquirer
                                .prompt([
                                    {
                                        type: 'confirm',
                                        message: `is ${firstName} a manager?`,
                                        name: 'managerBool'
                                    }
                                ])
                                .then((truth) => {
                                    const unnecessarilyLongNameForThisObject = truth.managerBool

                                    db.query(`UPDATE employee SET is_manager = ? WHERE last_name = "${lastName}"`, unnecessarilyLongNameForThisObject, function(err, truth) {
                                        console.log(`Changed ${firstName} ${lastName}'s manager value.`)
                                        return
                                    })
                                    editLoop()
                                    return
                                })
                        }
                    })
                })
            })
        } else if (edit.addOrUpdate == 'Add an employee') {
            const managerArr = []
            db.query('SELECT * FROM employee WHERE is_manager = true', function(err, managers) {
                managers.forEach((manager) => {
                    const managerName = `${manager.first_name} ${manager.last_name}`

                    managerArr.push(managerName)
                })
                db.query('SELECT * FROM role', function(err, roles) {
                    const roleArr = []
                roles.forEach((role) => {
                    const roleName = `${role.title}`

                    roleArr.push(roleName)
                })
                inquirer
                .prompt([
                    {
                        type: 'input',
                        message: `Employee's first name:`,
                        name: 'firstName'
                    },
                    {
                        type: 'input',
                        message: `Employee's last name:`,
                        name: 'lastName'
                    },
                    {
                        type: 'confirm',
                        message: 'is this employee a manager?',
                        name: 'confirmManager'
                    },
                    {
                        type: 'list',
                        message: `What is this employee's role?`,
                        choices: roleArr,
                        name: 'roleChoice'
                    },
                    {
                        type: 'list',
                        message: `Who is this employee's manager?`,
                        choices: managerArr,
                        name: 'managerChoice'
                    }
                ])
                .then((newEmployee) => {
                    const newFirst = newEmployee.firstName
                    const newLast = newEmployee.lastName
                    const isManager = newEmployee.confirmManager
                    const roleChoice = newEmployee.roleChoice
                    const managerChoice = newEmployee.managerChoice

                    const split = managerChoice.split(' ')
                    const mgrFirst = split.slice(1)

                    let roleId
                    let manId
                    
                    db.query('SELECT id FROM employee WHERE is_manager = true AND first_name = ?', mgrFirst, function (err, managerId) {
                        managers.forEach((manager) => {
                            manId = manager.id
                        })

                        db.query('SELECT id FROM role WHERE title = ?', roleChoice, function(err, ids) {
                            ids.forEach((id) => {
                                roleId = id.id
                            })
                            
                            db.query(`INSERT INTO employee (first_name, last_name, is_manager, role_id, manager_id)
                            VALUES
                            ("${newFirst}", "${newLast}", ${isManager}, ${roleId}, ${manId})`)
                            db.query('SELECT * FROM employee', function (err, rows) {
                                console.table(rows)
                            })
                        })
                    })
                    editLoop()
                    return
                })
            })
        })
        }
    })
}

function exit() {
    console.log('Bye!')
    process.exit()
}

function viewLoop() {
    inquirer
        .prompt([
            {
                type: 'list',
                message: 'I want to:',
                choices: [
                    'View another table',
                    'Exit the program'
                ],
                name: 'end'
            }
        ])
        .then((loopView) => {
            if (loopView.end !== 'View another table') {
                exit()
            }
            viewTables()
        })
}

function editLoop() {
    inquirer.prompt([
        {
            type: 'list',
            message: 'I want to:',
            choices: [
                'Edit another table',
                'Exit the program'
            ],
            name: 'end'
        }
    ])
    .then((loopEdit) => {
        if (loopEdit.end !== 'Edit another table') {
            exit()
        }
        editTables()
    })
}

empDb()

app.listen(PORT, () => {
    console.log(`SERVER RUNNING ON PORT ${PORT}`)
})
