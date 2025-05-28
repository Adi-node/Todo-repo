const jwt=require('jsonwebtoken');
const jWT_SECRET="fadsj8565164523480340jdkjfldk";
const express=require('express');
const app=express();
const cors=require('cors');

app.use(express.json());
app.use(cors());
let users=[];

function findun(x){
    for(let i=0;i<users.length;i++){
        if(users[i].username==x){
            return true;
        }
    }
    return false;
}
//middleware
function verify(req,res,next){
    const token=req.headers.token;
    const verified=jwt.verify(token,jWT_SECRET);
    const username=verified.username;
        // let founduser=null;
    for(let i=0;i<users.length;i++){
        if(users[i].username==username){
            req.founduser=users[i];
            next();
        }
    }
    
    // console.log('token is verified');
}

app.get('/',verify,(req,res)=>{
    const founduser=req.founduser;
    res.json(founduser.todos);
    // console.log('got the token');
})

app.post('/todo',verify,(req,res)=>{
    const todo=req.body.todo;
    const founduser=req.founduser;

    founduser.todos.push({
        todo:todo
    })

    // console.log(users);
    res.json({ success: true, todos: founduser.todos });
})


app.post('/signup',(req,res)=>{
    const username=req.body.username;
    const password=req.body.password;
    if(findun(username)){
        res.json({
            unique:false
        })
    }else{
        users.push({
            username:username,
            password:password,
            todos:[]
        })
        const token=jwt.sign({username:username},jWT_SECRET);
        res.json({
            token:token,
            unique:true
        })
    }
    
})

app.post('/signin',(req,res)=>{
    const username=req.body.username;
    const password=req.body.password;
    let founduser=null;
    // console.log(username+"/n"+password);
    for(let i=0;i<users.length;i++){
        if(users[i].username==username && users[i].password===password){
            founduser=users[i];
            const token=jwt.sign({username:username},jWT_SECRET);
            res.json({
                token:token,
                todo:founduser.todos,
                passCorrect:true
            })
            return ;
        }
    }
    res.json({
        passCorrect: false
    })


})

app.delete('/delete', verify, (req, res) => {
    const founduser = req.founduser;
    const todo = req.body.todo;
    let cleanTodo = todo.replace('Delete', '').trim();
    // console.log(todo);
    for (let i = 0; i < founduser.todos.length; i++) {
        if (founduser.todos[i].todo === cleanTodo) {
            founduser.todos.splice(i, 1); 
            break;
        }
    }
});

app.listen(3000);