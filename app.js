import express from "express";
import pg from "pg";
import path, { dirname } from "path";
import { fileURLToPath } from "url";

const app = express();
const port = 3000;
const __dirname = dirname(fileURLToPath(import.meta.url));
const db = new pg.Client({
    user: "postgres",
    database: "world",
    host: "localhost",
    password: "kjm40329",
    port: 5432
});
let states;

app.use("/css", express.static(path.join(__dirname, "node_modules/bootstrap/dist/css")));
app.use("/js", express.static(path.join(__dirname, "node_modules/bootstrap/dist/js")));
app.use("/js", express.static(path.join(__dirname, "node_modules/jquery/dist")));
app.use(express.static("public"));
app.use(express.urlencoded({extended: true}));

db.connect();

app.get("/", async (req, res) => {
    states = (await db.query("SELECT * FROM states")).rows;
    const data = {
        "states": states
    };
    res.render("index.ejs", data);
});

app.post("/state", async (req, res) => {
    let state_name = req.body["state_name"];
    let state_code = req.body["state_code"];

    if(state_code && state_name) {
        await db.query("INSERT INTO states (state_name, state_code) VALUES ($1, $2)", [state_name, state_code]);
    }
    res.redirect("/");
});

app.listen(port, (err) => {
    if (err) throw err;
    console.log(`Server listening on port ${port}`);
});