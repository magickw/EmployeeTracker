const express = require('express');
// Import and require mysql2
const mysql = require('mysql2');

//initial port
const PORT = process.env.PORT || 3001;
const app = express();

// Express middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Connect to database
const db = mysql.createConnection(
  {
    host: 'localhost',
    // MySQL username,
    user: 'root',
    // MySQL password
    password: '',
    database: 'company_db'
  },
  console.log(`Connected to the company_db database.`)
);

db.connect(function(err) {
  if (err) throw err
  introPrompt();
});

//Introducing prompts//
function introPrompt() {
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
    
          case "Add Role?":
              addRole();
            break;
    
          case "Add Department?":
              addDepartment();
            break;
          case "Exit":
            db.end();
            break;
  
          }
  });
}
//----------------------------------------------------------------------View-----------------------------------------------------------------------------//
//View All Employees
function viewAllEmployees() {
  console.log("View all employees\n");
  var query =
  `SELECT employee.first_name, employee.last_name, role.title, role.salary, department.name, CONCAT(employee.first_name, ' ' , employee.last_name) AS Manager 
  FROM employee 
  INNER JOIN role
  ON role.id = employee.role_id
  INNER JOIN department
  ON department.id = role.department_id
  LEFT JOIN employee
  ON employee.manager_id = employee.id`

  db.query(query, 
    function(err, res) {
      if (err) throw err
      console.table(res)
      //Run the introducing prompts again
      introPrompt();
    });
}

//View All Employees by Role
function viewEmployeesByRole() {
  console.log("View All Employees By Roles\n");
  var query =
  `SELECT employee.first_name, employee.last_name, role.title AS Title
  FROM employee
  JOIN role
  ON employee.role_id = role.id`

  db.query(query, 
    function(err, res) {
      if (err) throw err
      console.table(res)
      introPrompt();
    });
}

//View All Employees By Department
function viewEmployeesByDepartment() {
  console.log("View All Employees By Departments\n");
  var query =
  `SELECT employee.first_name, employee.last_name, department.name AS Department
  FROM employee
  JOIN role
  ON employee.role_id = role.id
  JOIN department
  ON role.department_id = department.id
  ORDER BY employee.id`

  db.query(query, 
    function(err, res) {
      if (err) throw err
      console.table(res)
      introPrompt();
    });
}

//----------------------------------------------------------------------Add-----------------------------------------------------------------------------//
// Select Role Title for Add Employee prompt
async function selectRole() {
  var query = `SELECT title FROM role`;
  const rows = await db.query(query);
  //Creates a role array
  let roleArr = [];
  //The for...of statement creates a loop iterating over iterable objects
  for(const row of rows) {
      roles.push(row.title);
  }

  return roleArr;
}

async function selectManager() {
  var query = `SELECT * FROM employee WHERE manager_id IS NULL`;
  const rows = await db.query(query);
  //Creates a enploy array
  let employeeArr = [];
  for(const employee of rows) {
      employeeNames.push(employee.first_name + " " + employee.last_name);
  }
  return employeeArr;
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
        choices: selectRole()
      }
  ]).then(function (answers) {
    //Index starting from 0
    var roleId = selectRole().indexOf(answers.role) + 1
    var managerId = selectManager().indexOf(answers.choice) + 1
    var query = `INSERT INTO employee SET ?`;
    db.query(query, 
    {
        first_name: answers.firstName,
        last_name: answers.lastName,
        manager_id: managerId,
        role_id: roleId
        
    }, function(err){
        if (err) throw err
        console.table(answers);
        console.log( "The employeed is added successfully!\n");
        introPrompt();
    })

})
}

//Add Role
function addRole() {
  var query = `SELECT role.title AS Title, role.salary AS Salary FROM role`;
  db.query(query, function(err, res) {
    inquirer.prompt([
        {
          name: "Title",
          type: "input",
          message: "What is the roles Title?"
        },
        {
          name: "Salary",
          type: "input",
          message: "What is the Salary?"

        } 
    ]).then(function(res) {
        var query = `INSERT INTO employee SET ?`;
        db.query(query, 
            {
              title: res.Title,
              salary: res.Salary,
            },
            function(err) {
                if (err) throw err
                console.table(res);
                console.log( "The Role is added successfully!\n");
                introPrompt();
            }
        )

    });
  });
  }

  
//----------------------------------------------------------------------Update-----------------------------------------------------------------------------//
//7. Update Employee

function updateEmployee() {
  console.log("Update Employee\n");
  var query =
  `SELECT employee.last_name, role.title
  FROM employee
  JOIN role
  ON employee.role_id = role.id`

  db.query(query, function(err, res) {
  // console.log(res)
   if (err) throw err
   console.log(res)
  inquirer.prompt([
        {
          
      function(err){
          if (err) throw err
          console.table(val)
          introPrompt();
      })

  });
});

}
