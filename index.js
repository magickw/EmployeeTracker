//Dependencies
const inquirer = require('inquirer');
const express = require('express');
// Import and require mysql2
const mysql = require('mysql2');
//For Figletfont spec
const figlet = require('figlet');
//For console table printing
const { printTable } = require('console-table-printer');
const { from } = require('mute-stream');

const roleArr = [];
const managersArr = [];
// let roles;
// let departments;
// let managers;
// let employees;

//initial port
const PORT = process.env.PORT || 3001;
const app = express();

// Express middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

//FIGfont spec, run 'npm install figlet' to install
figlet('EMPLOYEE TRACKER', (err, result) =>{
  console.log(err||result);
  console.log("------------------------------------- Made by Baofeng Guo ------------------------------------\n");
});



// Connect to database
const db = mysql.createConnection(
  {
    host: 'localhost',
    // MySQL username,
    user: 'root',
    // MySQL password
    password: 'password',
    database: 'company_db'
  },
  console.log(`Connected to the company_db database.`)
);

db.connect(function(err) {
  if (err) throw err
  //runs menu prompts
  menuPrompt();
  // getRoles();
  // getDepartments();
  // getManagers();
  // getEmployees();
});

//Menue prompts//
function menuPrompt() {
  inquirer.prompt([
  {
  type: "list",
  message: "What would you like to do?",
  name: "choice",
  choices: [
            "View All Employees", 
            "View All Employees by Role",
            "View All Emplyees by Deparment",
            //"View All Employees by Manager" 
            "Add Employee",
            "Add Role",
            "Add Department",
            "Update Employee",
            "Delete Role",
            // "Delete Employee",
            // "Delete Department",
            "Exit"
          ]
  }
]).then(function(val) {
      switch (val.choice) {
          case "View All Employees":
            viewAllEmployees();
          break;
  
        case "View All Employees by Role":
          viewEmployeesByRole();
          break;

        case "View All Emplyees by Deparment":
          viewEmployeesByDepartment();
          break;

        // case "View All Employees by Managers":
        //     viewEmployeesByManager();
        //   break;
        case "Add Employee":
              addEmployee();
            break;

        case "Update Employee":
              updateEmployee();
            break;
    
          case "Add Role":
              addRole();
            break;
    
          case "Add Department":
              addDepartment();
            break;

          case "Delete Role":
              deleteRole();
           break;

          // case "Delete Employee":
          //      deleteRole();
          //   break;

          // case "Delete Department":
          //     deleteDepartment();
          //  break;
            
          case "Exit":
            db.end();
            break;
  
          }
  });
}

function getRoles(){
  db.query(`SELECT id, title FROM role`, (err, res) => {
    if (err) throw err;
    roles = res;
  })
};

function getDepartments(){
  db.query(`SELECT id, name FROM department`, (err, res) => {
    if (err) throw err;
    departments = res;
  })
};

function getManagers(){
  db.query(`SELECT id, first_name, CONCAT_WS(' ', first_name, last_name) AS Managers FROM employee`, (err, res) => {
    if (err) throw err;
    managers = res;
  })
};

function getEmployees(){
  db.query(`SELECT id, CONCAT_WS(' ', first_name, last_name) AS Employees FROM employee`, (err, res) => {
    if (err) throw err;
    managers = res;
  })
};

//----------------------------------------------------------------------View-----------------------------------------------------------------------------//

//View All Employees
function viewAllEmployees() {
  console.log("View all employees\n");
  db.query(`SELECT employee.id AS ID, employee.first_name AS First_Name, employee.last_name AS Last_Name, role.title AS Title, role.salary AS Salary, department.name AS Department, CONCAT(e.first_name, ' ' , e.last_name) AS Manager 
  FROM employee 
  INNER JOIN role ON role.id = employee.role_id
  INNER JOIN department ON department.id = role.department_id
  LEFT JOIN employee e ON employee.manager_id = e.id
  ORDER BY employee.id`, (err, res) => {
      if (err) throw err
      // console.table(res);
      printTable(res);
      //Run the menu prompts again
      menuPrompt();
    });
}

//View All Employees by Role
function viewEmployeesByRole() {
  console.log("View All Employees By Role\n");
  db.query(`SELECT employee.first_name AS First_Name, employee.last_name AS Last_Name, role.title AS Title
  FROM employee
  JOIN role
  ON employee.role_id = role.id`, (err, res) => {
      if (err) throw err
      // console.table(res);
      printTable(res);
      menuPrompt();
    });
}

//View All Employees By Department
function viewEmployeesByDepartment() {
  console.log("View All Employees By Department\n");
  db.query(`SELECT employee.first_name AS First_Name, employee.last_name AS Last_Name, department.name AS Department
  FROM employee
  JOIN role
  ON employee.role_id = role.id
  JOIN department
  ON role.department_id = department.id
  ORDER BY employee.id`, 
  (err, res) => {
      if (err) throw err
      // console.table(res);
      printTable(res);
      menuPrompt();
    });
}
//----------------------------------------------------------------------Get-----------------------------------------------------------------------------//
// function getRole () {
//   roleArray = [];
//   db.query(`SELECT id, title FROM role`, function (err, results) {
//       results.forEach(role => {
//           let title = role.id + " - " + role.title
//           roleArray.push(title);
//       });
//   });
// }
// function getDepartment () {
//   departmentArray = [];
//   db.query(`SELECT id, department_name FROM department`, function (err, results) {
//       results.forEach(department => {
//           let newDep = department.id + " - " + department.department_name
//           departmentArray.push(newDep);
//       });
//   });
// }


//----------------------------------------------------------------------Add-----------------------------------------------------------------------------//
// Select Role Title for Add Employee prompt

function selectRole() {
  var query = `SELECT * FROM role`;
  db.query(query,  (err, res) => {
    if (err) throw err
    for (var i = 0; i < res.length; i++) {
      roleArr.push(res[i].title);
    }

  })
  return roleArr;
}

// Select Manager for Add Employee prompt
function selectManager() {
  //Because the managers can't be their managers to themselves, whenever manager_id is null, the corresponding employee is a manager
  var query = `SELECT first_name, last_name FROM employee WHERE manager_id IS NULL`;
  db.query(query,  (err, res) => {
    if (err) throw err
    for (var i = 0; i < res.length; i++) {
      managersArr.push(res[i].first_name);
    }

  })
  return managersArr;
}

//Add an Employee
function addEmployee() { 
  inquirer.prompt([
      {
        name: "firstname",
        type: "input",
        message: "What is the employee's first name?",
        default: "John",
        validate: addFirstName => {
          if (addFirstName) {
              return true;
          } else {
              console.log("Please enter a first name");
              return false;
          }
        }
      },
      {
        name: "lastname",
        type: "input",
        message: "What is the employee's last name?",
        default: "Smith",
        validate: addLastName => {
        if (addLastName) {
            return true;
        } else {
            console.log("Please enter a last name");
            return false;
          }
        }
      },
      {
        name: "role",
        type: "list",
        message: "What is the employee's role? ",
        choices: selectRole(),
      }
  ]).then(function (res) {
    //Index starting from 0
    var firstName = res.firstname;
    var lastName = res.lastname;
    var roleId = selectRole().indexOf(res.role) + 1;
    var managerId = selectManager().indexOf(res.choice) + 1;
    var query =`INSERT INTO employee (first_name, last_name, manager_id, role_id) VALUES ("${firstName}", "${lastName}", "${managerId}", "${roleId}")`;
    db.query(query, (err, res) => {
        if (err) throw err
        console.table(res);
        console.log( `1 new employeed is added successfully!\n`);
        menuPrompt();
    })

})
}

//Add Role
function addRole() {
    inquirer.prompt([
        {
          name: "title",
          type: "input",
          message: "What is the role's title?",
          default: "CTO",
        },
        {
          name: "salary",
          type: "input",
          message: "What is the role's salary?",
          default: 2500000,

        },
        {
          type: "input",
          message: "What is the department ID for this role?",
          name: "departmentId",
          validate: addDepartmentId => {
            if (addDepartmentId) {
                return true;
            } else {
                console.log("Please enter a deparment ID.");
                return false;
              }
            }
        } 
    ]).then(function(res) {
        console.log(res);
        var title = res.title;
        var salary = res.salary;
        var departmentId = res.departmentId;
        var query = `INSERT INTO role (title, salary, department_id) VALUES ("${title}", "${salary}", "${departmentId}")`;
        db.query(query, (err, res) => {
                if (err) throw err
                // console.table(res);
                // printTable(res);
                console.log( "One new role is added successfully!\n");
                getRoles();
                console.log(roles);
                menuPrompt();
            }
        )

    })
  }

  //Add Department
function addDepartment() {
  inquirer.prompt([
      {
        name: "department",
        type: "input",
        message: "What dpartment would you like to add?"
      }
  ]).then(function(res) {
    var department = res.department;
    var query = `INSERT INTO department (name) VALUES ("${department}")`;
    db.query(query, (err, res) =>{
            if (err) throw err
            // console.table(res);
            console.log( "One new department is added successfully!\n");
            getDepartments(res);
            menuPrompt();
          }
      )
  })
}

//----------------------------------------------------------------------Update-----------------------------------------------------------------------------//
// Update Employee

function updateEmployee() {
    db.query(`
    SELECT id, first_name, last_name
    FROM employee`, (err, res) => {
    // console.log(res)
     if (err) throw err
     console.log(res)
    inquirer.prompt([
          {
            name: "lastName",
            type: "rawlist",
            choices: function() {
              var lastName = [];
              for (var i = 0; i < res.length; i++) {
                lastName.push(res[i].last_name);
              }
              return lastName;
            },
            message: "What is the Employee's last name? ",
          },
          {
            name: "role",
            type: "rawlist",
            message: "What is the Employees new title? ",
            choices: selectRole()
          },
      ]).then(function(res) {
        var roleId = selectRole().indexOf(res.role) + 1
        db.query(`UPDATE employee SET WHERE ?`, 
        {
          last_name: res.lastName
           
        }, 
        {
          role_id: roleId
           
        }, 
        function(err){
            if (err) throw err
            console.table(res)
            console.log( "The Employee is updated successfully!\n");
            menuPrompt();

          })
  
        });
      });
    
      }

// "Delete Employee",

// "Delete Role",
function deleteRole() {
    inquirer.prompt([
      {
      name: "Role",
      type: "list",
      message: "Select the role you want to delete",
      choices: selectRole(),
      }
    ]).then((res) => {
      var role_Id = selectRole().indexOf(res.Role) + 1;
      var query = `DELETE FROM role WHERE id="${role_Id}"`;
      db.query(query, (err, res) => {
        if (err) throw err;
        console.log("A role is deleted");
        menuPrompt();
        });
    });
};

// "Delete Department",