const signup=document.querySelectorAll(".up");
const signin=document.querySelectorAll(".in");

const togglein=document.getElementById('toggle-in');
const toggleup=document.getElementById('toggle-up');

const buttonin=document.getElementById('btn-in');
const buttonup=document.getElementById('btn-up');

const signWindow=document.getElementsByClassName('sign-up');
const todoWindow=document.getElementsByClassName('todo');

const todoInput = document.getElementById('todo');
const addTodoBtn = document.querySelector('.todo .but');
let todoList = document.querySelector('.todo ul');

const logOut=document.getElementById('logOut-but');



togglein.addEventListener('click',()=>{
    signin.forEach(el=>{
        el.classList.remove("toggle");
    })
    signup.forEach(el=>{
        el.classList.add("toggle");
    })
})

toggleup.addEventListener('click',()=>{
    signup.forEach(el=>{
        el.classList.remove("toggle");
    })
    signin.forEach(el=>{
        el.classList.add("toggle");
    })
})

async function loggedin(){
    const response= await axios.get('http://localhost:3000/',{
        headers:{
            token:localStorage.getItem('token')
        }
    })
    const todos=response.data;

    todoList.innerHTML="";
    signWindow[0].classList.add('toggle');
    todoWindow[0].classList.remove('toggle');
    
    //Write logic to display the todo list
    for(let i=0;i<todos.length;i++){
        const li=document.createElement('li');
        li.textContent=todos[i].todo;

        const delBtn=document.createElement('button');
        delBtn.textContent='Delete';

        delBtn.addEventListener('click',async ()=>{
            
            const text=li.textContent;
            const response= await axios.delete('http://localhost:3000/delete', {
                data: { todo: text },
                headers: {
                    token: localStorage.getItem('token')
                }
            });
            li.remove();
        })

        li.appendChild(delBtn);
        todoList.appendChild(li);

        todoInput.value="";
    }
}

loggedin();

//Signed up button click

buttonup.addEventListener('click',async ()=>{
    const username=document.getElementById("username").value;
    const password=document.getElementById("password").value;
    const response= await axios.post('http://localhost:3000/signup',{
        username:username,
        password:password
    })
    if(response.data.unique){
        //go to todo list
        localStorage.setItem("token",response.data.token);
        signWindow[0].classList.add('toggle');
        todoWindow[0].classList.remove('toggle');

    }else{
        alert("Username already in use");
        document.getElementById("username").value = "";
        document.getElementById("password").value = "";
    }

    // console.log("done");


})

//Signed in button click

buttonin.addEventListener('click',async ()=>{
    const username=document.getElementById("username").value;
    const password=document.getElementById("password").value;
    const response= await axios.post('http://localhost:3000/signin',{
        username:username,
        password:password
    })
    if(!response.data.passCorrect){
        alert("Username or password is wrong");
        document.getElementById("username").value = "";
        document.getElementById("password").value = "";
        return ;
    }
    localStorage.setItem("token",response.data.token);
    const todos=response.data.todo;
    
    signWindow[0].classList.add('toggle');
    todoWindow[0].classList.remove('toggle');

    for(let i=0;i<todos.length;i++){
        const li=document.createElement('li');
        li.textContent=todos[i].todo;

        const delBtn=document.createElement('button');
        delBtn.textContent='Delete';

        delBtn.addEventListener('click',async ()=>{
            
            const text=li.textContent;
            li.remove();
            const response= await axios.delete('http://localhost:3000/delete', {
                data: { todo: text },
                headers: {
                    token: localStorage.getItem('token')
                }
            });
            
        })

        li.appendChild(delBtn);
        todoList.appendChild(li);

        todoInput.value="";
    }

})


addTodoBtn.addEventListener('click', async () => {
    const value = todoInput.value.trim();
    if (value === "") return;

    // Create todo item
    const li = document.createElement('li');

    li.textContent = value;

    // Create delete button
    const delBtn = document.createElement('button');
    delBtn.textContent = "Delete";
    

    // Delete logic
    delBtn.addEventListener('click', async () => {
        
        const text=li.textContent;
        li.remove();
        const response= await axios.delete('http://localhost:3000/delete', {
            data: { todo: text },
            headers: {
                token: localStorage.getItem('token')
            }
        });
        
    });

    li.appendChild(delBtn);
    todoList.appendChild(li);

    todoInput.value = "";

    //send todo to backend

    const response = await axios.post(
        'http://localhost:3000/todo',
        { todo: value },
        {
            headers: {
                token: localStorage.getItem('token'),
            }
        }
    )
});


//Logout logic

logOut.addEventListener('click',()=>{
    localStorage.removeItem('token');
    location.reload();
})



