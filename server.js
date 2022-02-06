const inquirer = require('inquirer')
const mysql = require('mysql2')
const fs = require('fs')

//inquirer prompt
inquirer
    //questions 
    .prompt([
        //choices to choose
        {
            type: 'list',
            message: 'What would you like to do?',
            choices: [
                { name: 'View all departments', value: 0 }, 
                { name: 'View roles', value: 1}, 
                { name: 'View all employees', value: 2 }, 
                new inquirer.Separator(),
                { name: 'Add a new department', value: 3}, 
                { name: 'Add a new role', value: 4 }, 
                { name: 'Add a new employee', value: 5 }, 
                new inquirer.Separator(),
                { name: 'Update an employee', value: 6 },
                new inquirer.Separator()
            ],
            name: 'choice'
            
        }
    ])
    //then
    .then((response) => {

        const db = mysql.createConnection({
                host: 'localhost',
                user: 'root',
                password: 'SolluxCaptor18*',
                database: 'test'
            },
            console.log(`--- Connection established with management_db`)
        )

        //if view all departments
        if (response.choice === 0) {
            console.log('I checked the department out...')
            //table is formatted showing department names and ids
            db.execute(
                'SELECT * FROM management_db', (err, res) => {
                    if (err) {throw err}
                    res.json(result)
                }
            )

        //else if view roles
        } else if (response.choice === 1) {
            console.log('I checked the roles...')
            console.log('Nothing to see here.')
            //table is formatted with job title, role id, department role belongs to, and salary

        //else if view all employees
        } else if (response.choice === 2) {
            console.log('I checked on my employees...')
            console.log('Working hard, or hardly working?')
            //table is formatted with employee id, first name, last name, job title, department, salary, and managers employees report to

        //else if add department = true
        } else if (response.choice === 3) {
            console.log('I began making a new department...')
            //prompt user for department name
            //add to db

        //else if add role = true
        } else if (response.choice === 4) {
            console.log('I decided to make a new role...')
            //prompt user for role name, salary and department for the role
            //add to db
            
        //else if add employee = true
        } else if (response.choice === 5) {
            console.log('Who hired this guy?')
            //prompt user for employee's first name, last name and role
            db.query(
                'SELECT * FROM department', (err, res) => {
                    if (err) {throw err}
                    res.json(result)
                    //add to db
                    fs.appendFile('./employees/emp-list.json')
                }
            )

        //else if update employee = true
        } else if (response.choice === 6) {
            console.log('I think this guy deserves a promotion...')
            //prompt to select employee
            //prompt to re input employee data

        }
    })

    


    //append data to ./db/seeds.sql