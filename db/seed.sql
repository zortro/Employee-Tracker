INSERT INTO department (id, name)
VALUES
(1, "Front End"),
(2, "Back End"),
(3, "Deli"),
(4, "Food Court"),
(5, "Pharmacy"),
(6, "Produce");

INSERT INTO role (id, title, salary, department_id)
VALUES
(1, "Front End Supervisor", 26.00, 1),
(2, "Back End Supervisor", 26.00, 2),
(3, "Deli Supervisor", 26.00, 3),
(4, "Food Court Supervisor", 26.00, 4),
(5, "Pharmacy Supervisor", 26.00, 5),
(6, "Produce Supervisor", 26.00, 6),
(7, "Stocker", 16.00, 2),
(8, "Forklift Operator", 19.25, 2),
(9, "Cart Pusher", 16.20, 1),
(10, "Cashier", 18.15, 1),
(11, "Front End Stocker", 16.20, 1),
(12, "Meat Specialist", 17.50, 3),
(13, "Butcher", 20.25, 3),
(14, "Cook", 16.20, 4),
(15, "Pharmacist", 60.60, 5),
(16, "Optician", 16.75, 5),
(17, "Fruit Guy", 200.00, 6);

INSERT INTO employee (id, first_name, last_name, role_id, manager_id)
VALUES
(1, "Lillian", "Ochoa", 10 , 2),
(2, "Jared", "Lenno", 1, 3),
(3, "Boss", "Man", 2, null);
