const express = require("express")
const app = express()
const bodyParser = require("body-parser")
const mysql = require("mysql2")
const cors = require("cors")
//
app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:true}))
//
const connection = mysql.createConnection({
    host:"localhost",
    password:"",
    user:"root",
    database:"hackathon1"
})
connection.connect((err) => {
    if (err) {
        console.error("Lỗi kết nối cơ sở dữ liệu: ", err);
    } else {
        console.log("Kết nối cơ sở dữ liệu thành công");
    }
});
//lấy dữ liệu từ db
let listTasks = []
const query = "SELECT * FROM todolist";
connection.query(query,(err,results)=>{
    listTasks = results
})

//GET
app.get("/todo",(req,res)=>{
res.status(200).json(listTasks)
})
app.post("/todo", async (req, res) => {
    try {
        console.log(req.body, "vvv");
        const { name, detail, status } = req.body;
        const query = `INSERT INTO todolist (id, name, detail, status) VALUES (NULL, ?, ?, ?)`;
        const values = [name, detail, status];

        const insertResult = await new Promise((resolve, reject) => {
            connection.query(query, values, (err, results) => {
                if (err) {
                    console.log(err);
                    reject(err);
                } else {
                    resolve(results);
                }
            });
        });
        const selectQuery = "SELECT * FROM todolist";
        const updatedResults = await new Promise((resolve, reject) => {
            connection.query(selectQuery, (err, results) => {
                if (err) {
                    console.log(err);
                    reject(err);
                } else {
                    resolve(results);
                }
            });
        });
        const listTasks = updatedResults;
        res.status(200).json(listTasks);
    } catch (error) {
        console.log(error);
        res.status(500).json({
            error: "Ko thêm đc",
        });
    }
});
//DELETE
app.delete("/todo/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const query = "DELETE FROM todolist WHERE id = ?";
        const values = [id];

        await new Promise((resolve, reject) => {
            connection.query(query, values, (err, results) => {
                if (err) {
                    console.log(err);
                    reject(err);
                } else {
                    resolve(results);
                }
            });
        });

        const selectQuery = "SELECT * FROM todolist";
        const updatedResults = await new Promise((resolve, reject) => {
            connection.query(selectQuery, (err, results) => {
                if (err) {
                    console.log(err);
                    reject(err);
                } else {
                    resolve(results);
                }
            });
        });

        const listTasks = updatedResults;
        res.status(200).json(listTasks);
    } catch (error) {
        console.log(error);
        res.status(500).json({
            error: "Ko xóa đc bên db",
        });
    }
});
//PUT
app.put("/todo/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const { name } = req.body;
        const query = "UPDATE todolist SET name = ? WHERE id = ?";
        const values = [name, id];

        await new Promise((resolve, reject) => {
            connection.query(query, values, (err, results) => {
                if (err) {
                    console.log(err);
                    reject(err);
                } else {
                    resolve(results);
                }
            });
        });

        const selectQuery = "SELECT * FROM todolist";
        const updatedResults = await new Promise((resolve, reject) => {
            connection.query(selectQuery, (err, results) => {
                if (err) {
                    console.log(err);
                    reject(err);
                } else {
                    resolve(results);
                }
            });
        });

        const listTasks = updatedResults;
        res.status(200).json(listTasks);
    } catch (error) {
        console.log(error);
        res.status(500).json({
            error: "Lỗi cập nhật",
        });
    }
});
// PUT2
app.put("/todo/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const { name, detail, status } = req.body;
        const query =
            "UPDATE todolist SET name = ?, detail = ?, status = ? WHERE id = ?";
        const values = [name, detail, status, id];

        await new Promise((resolve, reject) => {
            connection.query(query, values, (err, results) => {
                if (err) {
                    console.log(err);
                    reject(err);
                } else {
                    resolve(results);
                }
            });
        });

        const selectQuery = "SELECT * FROM todolist WHERE id = ?";
        const selectValues = [id];

        const updatedTask = await new Promise((resolve, reject) => {
            connection.query(selectQuery, selectValues, (err, results) => {
                if (err) {
                    console.log(err);
                    reject(err);
                } else {
                    resolve(results[0]);
                }
            });
        });

        res.status(200).json(updatedTask);
    } catch (error) {
        console.log(error);
        res.status(500).json({
            error: "Lỗi thay đổi",
        });
    }
});

//
app.listen(3000,(req,res)=>{
    console.log("Server đang chạy tốt");
})