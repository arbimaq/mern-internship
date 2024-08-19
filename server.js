const exp = require("constants");
const express = require("express");
const { request } = require("http");
const { type } = require("os");
const app = express();

const PORT = 8080;

app.use(express.json());
app.use(express.urlencoded({extended:false}));
app.use(express.text());

function specialwords(data)
{
    const notallowed = "!@#$%^&*()_+[]{}|;':\",./<>?`~\\-=";
    for (let i =0; i<data.length; i++){
        if (notallowed.includes(data[i])){
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

app.listen(PORT, ()=>console.log(`Running on the port number: ${PORT}`));

app.get('/getallrepos', (request,response)=>{
    response.send(repo_data);
})

app.get('/getrepodetail',(request,response)=>{
    let name = request.query.name;
    if (name){
        if (specialwords(name)){
            response.status(400).send("Please avoid using special characters");
        }
        else{
            let specificRepo = repo_data.find(repo => repo.repo_name === name);
                if (specificRepo == undefined){
                    response.status(404).send("No repo matchin provided name exists");
                }
                else{
                    response.status(200).send(specificRepo);
                }
        }
    }
    else{
        response.status(400).send("Please provide a repo name");
    }
})

app.post('/create-repo',(request,response)=>{
    const data = request.body;
    repo_data.push(data);
    response.status(201).send("Repo Created")
})