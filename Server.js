const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const cors = require("cors");
const app = express();
const PORT = process.env.PORT || 8081;

var corsOptions = {
    origin: "http://localhost:3000",
}

app.use(cors(corsOptions));

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.post("/feedback", (req, res) => {
    const newFeedback = req.body;

    console.log(newFeedback);
    let db = new sqlite3.Database("db1/feedback");

    const insertQuery = "INSERT INTO feedback(name, mobile, rating, recommendation, comments, accepted) VALUES(?, ?, ?, ?, ?, '')";
    
    const Values = [
        newFeedback.name,
        newFeedback.mobile,
        newFeedback.rating,
        newFeedback.recommendation,
        newFeedback.comments,
    ];

    db.run(insertQuery, Values, (err) => {
        if(err) {
            res.json({
                message: err.message,
            });
        } else {
            res.json({
                message: "Successfully inserted feedback",
            });
        }
    });
    db.close();
})

app.get("/feedback", (req, res) => {
    let db = new sqlite3.Database("db1/feedback");

    const selectQuery = "SELECT id, name, mobile, rating, recommendation, comments, accepted from feedback";

    db.all(selectQuery, [], (err,rows) => {
        if(err) {
            res.json({
                message: err.message,
            });
        } else {
            const feedback = rows.map((singleRow) => {
                return{
                    id: singleRow.id,
                    name: singleRow.name,
                    mobile: singleRow.mobile,
                    rating: singleRow.rating,
                    recommendation: singleRow.recommendation,
                    comments: singleRow.comments,
                    accepted: singleRow.accepted,
                };
            });
            res.json(feedback);
        }
    });
    db.close();
});

app.put ("/feedback", (req, res) => {
    const updatedFeedback = req.body;

    let db = new sqlite3.Database("db1/feedback");

    const updatedData = [updatedFeedback.accepted, updatedFeedback.name]
    const id = updatedFeedback.id;

    const updatedQuery = "UPDATE feedback SET accepted = ?, name = ? WHERE id = ?";
    const values = [...updatedData, id];

    db.run(updatedQuery, values, (err) => {
        if(err) {
            res.json({
                message: err.message,
            });
        } else {
            res.json({
                message: "Successfully updated data",
            });
        }
    });
    db.close();
});

app.delete("/feedback", (req, res) => {
    // const deleteFeedback = req.body
    console.log(parseInt(req.query.id));
    const id = parseInt(req.query.id);

    let db = new sqlite3.Database("db1/feedback");

    // const id = deleteFeedback;
    const values = id

    const deleteQuery = "DELETE FROM feedback WHERE id = ?";

    db.run(deleteQuery, values, (err) => {
        if(err) {
            res.json({
                message: err.message,
            });
        } else {
            res.json({
                message: "Successfully deleted"
            });
        }
    });
    db.close();

})

app.listen(PORT, () => {
    console.log(`Start Listening, use ${PORT}..`)
})