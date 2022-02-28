INSERT INTO department (name)
VALUES
("Front_End"),
("Back_End"),
("Deli"),
("Food_Court"),
("Pharmacy"),
("Produce");

INSERT INTO role (title, salary, department_id)
VALUES
("Front_End_Supervisor", 26.00, 1),
("Back_End_Supervisor", 26.00, 2),
("Deli_Supervisor", 26.00, 3),
("Food_Court_Supervisor", 26.00, 4),
("Pharmacy_Supervisor", 26.00, 5),
("Produce_Supervisor", 26.00, 6),
("Stocker", 16.00, 2),
("Forklift_Operator", 19.25, 2),
("Cart_Pusher", 16.20, 1),
("Cashier", 18.15, 1),
("Front_End_Stocker", 16.20, 1),
("Meat_Specialist", 17.50, 3),
("Butcher", 20.25, 3),
("Cook", 16.20, 4),
("Pharmacist", 60.60, 5),
("Optician", 16.75, 5),
("Store_Guy", 200.00, 6);

INSERT INTO employee (first_name, last_name, is_manager, role_id, manager_id)
VALUES
("Lillian", "Ochoa", false, 10, 1),
("Jared", "Lenno", true, 1, 3),
("Boss", "Man", true, 2, null);
