const { Client }  = require('pg');
const express = require('express');
const app = express();
app.use(express.json());

const client = new Client({
    user: 'postgres',
    host: '35.204.222.86',
    database: 'postgres',
    password: '1903',
    port: 5432,
  });

app.get("/getBook", async  (req, res) => {
    let result = {}
    try{
    const vale = await readAll();
    res.send(vale);
    result.success = true;
    }    
    catch(e){
        result.success = false;
    }
    finally{
        res.header("content-type", "application/json")
        res.send(JSON.stringify(result))//stringe donusturuldu angular da direkt json olarak alabilirsin.   
    }
})
app.get("/getBookById",async (req,res) => {
    let result = {}
    try{
    const reqJson = req.body;    
    const vale = await getBookById(reqJson.entryid);
    res.send(vale);
    result.success = true;
    }    
    catch(e){
        result.success = false;
    }
    finally{
        res.header("content-type", "application/json")
        res.send(JSON.stringify(result))//stringe donusturuldu angular da direkt json olarak alabilirsin.   
    }
})

app.post("/addBook", async (req,res) => {
        let result = {}
        const reqJson = req.body;
        try {
        await createVal(reqJson.guestname,reqJson.content,parseInt( reqJson.entryid));
        result.success = true;
        }
        catch(e){
            result.success =false;
        }
        finally{
            res.header("content-type", "application/json")
            res.send(JSON.stringify(result))
        }
})

app.delete("/deleteBook", async (req,res) => {

    let result = {}
    const reqJson = req.body;
    try {
    
    await deleteVal(reqJson.entryid);
    result.success = true;
    }
    catch(e){
        result.success =false;
    }
    finally{
        res.header("content-type", "application/json")
        res.send(JSON.stringify(result))
    }

})


  app.listen(4000, () => console.log("server is running"));
  start();
  async function start(){
      await connect();
  }

  async function connect(){
      try{
          await client.connect();
      }
      catch(e){
          console.error(`faild to connected ${e}`);
      }
  }
  async function readAll(){
      try{
          const result = await client.query("select * from guestbook");
          return result.rows;

      }
      catch(e){
          return [];
      }
  }
  async function getBookById(entryid){
      try{
          const result = await client.query("select * from guestbook where entryid = ($1)",[entryid]);
          return result.rows;
      }
      catch(e){
          return[];
      }
  }
  async function createVal(guestname , content, entryid){
        try{
            await client.query("insert into guestbook values ($1,$2,$3)",[guestname,content,entryid]); // bak bi
            return true;
        }
        catch(e){
            return false;
        }
  }
  async function deleteVal(entryid){
      try{
          await client.query("delete from guestbook where entryid = $1",[entryid]);
          return true;
      }
      catch(e){
          return false;
      }
  }