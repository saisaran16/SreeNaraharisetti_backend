const http = require('http');
const path = require('path');
const fs= require("fs");
const { emitWarning } = require('process');
const cors = require('cors')
const {MongoClient} = require('mongodb');


const server = http.createServer((req, res)=> {
    console.log(req.url)
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST')
    if(req.url == "/") {
        fs.readFile(path.join(__dirname, 'public', 'portfolio.html'), 
        (err, content)=> {
            if(err) throw err;
            res.writeHead(200, {'Content-Type': 'text/html'}); 
            res.end(content, 'utf-8');
        })
    }
    else if (req.url == "/api") {
    
        async function main(){
            /**
             * Connection URI. Update <username>, <password>, and <your-cluster-url> to reflect your cluster.
             * See https://docs.mongodb.com/ecosystem/drivers/node/ for more details
             */
            const uri ="mongodb+srv://saisaran:finalproject@finalproject.ma0dztc.mongodb.net/StudentsInfo?retryWrites=true&w=majority";
         
        
            const client = new MongoClient(uri);
         
            try {
                // Connect to the MongoDB cluster
                await client.connect();
         
                // Make the appropriate DB calls
                //await  listDatabases(client);
                await findsomedata(client);
         
            } catch (e) {
                console.error(e);
            } finally {
                await client.close();
            }
        }
        
        main().catch(console.error);
        
        
        async function findsomedata(client ){
            const cursor = client.db("StudentsInfo").collection("Students").find({});
            const results = await cursor.toArray();
            //console.log(results);
            const js= (JSON.stringify(results));
            console.log(js);
            res.writeHead(200, { 'Content-Type': 'application/json' })
            res.end(js);
        
        };
        
    }
    else {
        fs.readFile(path.join(__dirname, 'public', '404.html'), 
        (err, content)=> {
            if(err) throw err;
            res.writeHead(200, {'Content-Type': 'text/html'});
            res.end(content, 'utf-8');
        })
    }
        


});

const PORT = process.env.PORT || 3336;
server.listen(PORT, ()=> console.log(`The server is running at ${PORT}`));