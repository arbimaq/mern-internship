const exp = require("constants");
const cookieParser = require("cookie-parser");
const express = require("express");
const { request} = require("http");
const { type } = require("os");
const app = express();

const PORT = 8080;

app.use(express.json());
app.use(express.urlencoded({extended:false}));
app.use(express.text());
app.use(cookieParser());

const USERNAME = "Shurahbeel";
const PASSWORD = "password";

const authMiddleware = (req,res,next)=>{
    if (req.cookies.auth === "loggedin") {
        next();
    } else {
        res.status(401).send("Unauthorized Access. Please Login");
    }
}

const repovalidation = (req,res,next)=>{
    const data = req.body;
    if (specialwords(data.repo_name) || specialwords(data.repo_author) || specialwords(data.details)) 
        {
        res.status(400).send("Please avoid special characters in Name, Author, and Details"); 
        } 
    else if (typeof data.year_created !== "number" || typeof data.commits !== "number") 
        {
        res.status(400).send("Please use numbers when providing commits and year created"); 
        }
    else if (!data.repo_name || !data.repo_author || !data.details || !data.year_created || !data.commits)
    {
        res.status(401).send("Missing Required Fields"); 
    }

    next();
}

function specialwords(data) {
    const notallowed = "!@#$%^&*()_+[]{}|;':\",./<>?`~\\-=";
    for (let i = 0; i < data.length; i++) {
        if (notallowed.includes(data[i])) {
            return true;
        }
    }
    return false;
}

const repo_data = [
    {
        "repo_name": "Hackathon prep",
        "details": "this repo comprises code regarding hackathon 2024",
        "repo_author": "Shurahbeel Peerzada",
        "commits": 214,
        "year_created": 2024,
    },
    {
        "repo_name": "Machine Learning Models",
        "details": "This repository contains machine learning models and datasets.",
        "repo_author": "Alexis Jordan",
        "commits": 150,
        "year_created": 2023
    },
    {
        "repo_name": "Weather App",
        "details": "A weather forecasting application using React and Node.js.",
        "repo_author": "Liam Patterson",
        "commits": 75,
        "year_created": 2022
    },
    {
        "repo_name": "E-commerce Backend",
        "details": "Backend code for an e-commerce platform built with Django.",
        "repo_author": "Emily Martinez",
        "commits": 340,
        "year_created": 2021
    },
    {
        "repo_name": "Portfolio Website",
        "details": "Personal portfolio website showcasing projects and blogs.",
        "repo_author": "Shurahbeel Peerzada",
        "commits": 90,
        "year_created": 2024
    },
    {
        "repo_name": "Data Visualization Tool",
        "details": "A tool for visualizing complex data sets using D3.js.",
        "repo_author": "Nina West",
        "commits": 125,
        "year_created": 2023
    }
]

app.listen(PORT, () => console.log(`Running on port number: ${PORT}`));

app.post('/login', (req, res) => {
    const { username, password } = req.body;
    if((username == "") && (password == ""))
    {
        res.status(400).send("Missing Username and Password")
    }
    else{
        if (username === USERNAME && password === PASSWORD) {
            res.cookie('auth', 'loggedin', { httpOnly: true});
            res.status(200).send("User Successfully Logged in");
        } 
        else 
        {
            res.status(401).send("Incorrect Credentials Entered");
        }
    }

});

app.get('/getallrepos',authMiddleware ,(req, res) => {
        res.status(200).send(repo_data); 
});

app.get('/getrepodetail',authMiddleware ,(req, res) => {
        let name = req.query.name;
        if (name) {
            if (specialwords(name)) {
                res.status(400).send("Please avoid using special characters");
            } else {
                let specificRepo = repo_data.find(repo => repo.repo_name === name);
                if (specificRepo === undefined) {
                    res.status(404).send("No repo matching the provided name exists");
                } else {
                    res.status(200).send(specificRepo);
                }
            }
        } else {
            res.status(400).send("Please provide a repo name");
        } 
});

app.post('/create-repo',authMiddleware,repovalidation,(req, res) => {
    const data = req.body;
    repo_data.push(data);
    res.status(201).send("Repo Created");
});
