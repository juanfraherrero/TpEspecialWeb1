"use strict";

document.addEventListener("DOMContentLoaded", initPage)

function initPage() {
    const url = "https://62180ad01a1ba20cba97626d.mockapi.io/api/v1/CommentsUsers"
    
    let btnMoreComment = document.querySelector(".divButton");
    let btnDeleteAll = document.querySelector(".divButton .clearComments");
    let btnSend = document.querySelector(".sendForm");
    let containerForComments = document.querySelector("table tbody");
    let containerForMessagesToUser = document.querySelector(".loadingComments");


    
    function clearMessage5s(){
        setTimeout(() => {
            containerForMessagesToUser.innerHTML = "";                                        
        }, 5000);
    };
    function clearComments(){
        containerForComments.innerHTML = "";    //clear all the comments
    }
    //not finish yet
    function editfunc(event){
        let button = event.srcElement;
        let tr = button.parentNode.parentNode;
        console.log(tr)
        
    }
    async function deleteRowsQuietly(array){
        for (const row of array) {
            let id = row.id;
            try{
                let response = await fetch( url + `/${id}`, {"method": "DELETE"});
            }catch(error){
                console.log(error);
            }
        }
    }   
    function deleteAll(array){
        containerForMessagesToUser.innerHTML = "Deleting Comments... this could take a moment";
        deleteRowsQuietly(array).then(()=>{
            indice = 0;
            fetchComments();
        })
    }
    async function deleteRow(id){
        try{
            let response = await fetch( url + `/${id}`, {"method": "DELETE"});
            if(response.status === 200){
                indice = 0;                         //restore the index
                fetchComments();
            }else{
                containerForMessagesToUser.innerHTML = "Deleted Unsuccesfully, retry";
                clearMessage5s();                
            }
        }catch(error){
            console.log(error)
        }
    }
    function deletefunc(event){
        let button = event.srcElement;          //the button delete
        let tr = button.parentNode.parentNode;  //the row that we want to delete
        let idRow = tr.id;
        deleteRow(idRow);
    }
    function showFailedUrl(){
        //column
        let tdComment = document.createElement("td");   
        tdComment.colSpan = "3";
        tdComment.className = "text errorRow";
        tdComment.innerHTML = "error failed url!";
        
        //row
        let row = document.createElement("tr");
        row.appendChild(tdComment);
        
        //add row to the DOM
        containerForComments.appendChild(row);
        
        
    }
    async function fetchComments(){
        try {
            clearComments();
            containerForMessagesToUser.innerHTML = "Loading Comments";
            
            let response = await fetch(url); //fetch the url
            if (response.ok){
                let json = await response.json();   //get the array of json with the comments
                containerForMessagesToUser.innerHTML = "";
                loadThreeComments(json);    //show the first three comments
                arrComments = await json;
            }
            else{
                showFailedUrl();    //error failed url!
            }
        }catch(error){
            console.log(error);
        }

    }
    function loadThreeComments(array){        
        for (let cont = 0; cont < 3; cont++) {      //create three rows with his comment
            if (indice < (array.length)){      //verify we don't exceed the maximum comments

                //create the first column content, information of the user
                let divName = document.createElement("div");                                    //<div></div>
                divName.className = "name";                                                     //<div class="name"></div>
                divName.innerHTML  = array[indice].name + "<br>" + array[indice].surname;       //<div class="name">"name" <br> "surname"</div>
                
                let divMembership = document.createElement("div");                              //<div></div>
                divMembership.className = "membershipType";                                     //<div class="mebershipType"></div>
                divMembership.innerHTML  = array[indice].membership;                            //<div class="mebershipType">"membership"</div>
                
                let divDate = document.createElement("div");                                    //same with the date
                divDate.className = "time";
                divDate.innerHTML  = array[indice].date;
                
                //create the first column
                let tdInfoUser = document.createElement("td");
                tdInfoUser.className = "infoUserColumn firstColumn"
                tdInfoUser.appendChild(divName);
                tdInfoUser.appendChild(divMembership);
                tdInfoUser.appendChild(divDate);
                
                
                //create the second columns, the coment
                let tdComment = document.createElement("td");   
                tdComment.className = "text secondColumn";
                tdComment.innerHTML = array[indice].comment;
                
                //create the third columns, the buttons edit and delete
                
                let btnEdit = document.createElement("button");
                btnEdit.className = "edit";
                btnEdit.innerHTML = "edit";
                btnEdit.addEventListener("click", editfunc)     //we add a listener to the button edit
                
                let btnDelete = document.createElement("button");
                btnDelete.className = "delete";
                btnDelete.innerHTML = "delete";
                btnDelete.addEventListener("click", deletefunc)     //we add a listener to the button delete
                
                let tdOptions = document.createElement("td");   
                tdOptions.className = "optionsColumn thirdColumn";
                tdOptions.appendChild(btnEdit);
                tdOptions.appendChild(btnDelete);
    
                //create the row and insert the columns td
                let row = document.createElement("tr");
                row.id = parseInt(array[indice].id) ;       //set the id as in the API
                row.appendChild(tdInfoUser);
                row.appendChild(tdComment);
                row.appendChild(tdOptions);
    
                //add row to the DOM
                containerForComments.appendChild(row);
    
                //incrementamos el indice
                indice++;
            }else if(indice !=  0 || arguments[1] ){    //if we are not in the first position or if we are in the first position but we press the morecomments button
                containerForMessagesToUser.innerHTML = "there are no more comments";
                clearMessage5s();
            }
        }
    }
    //For the form and adding comments
    let containerName = document.querySelector(".addComment .name");
    let containerSurname = document.querySelector(".addComment .surname");
    let containerMembership = document.querySelector(".addComment select");
    let containerText = document.querySelector(".addComment textarea");
    
    function clearForm(){
        containerName.value ="";
        containerSurname.value="";
        containerMembership.value="";
        containerText.value="";
    }
    function createjson(){
        let name = containerName.value;
        let surname = containerSurname.value;
        let membership = containerMembership.value;
        let text = containerText.value;
        let date = new Date();
        date = `${date.getFullYear()}/${date.getMonth()}/${date.getDay()}`;
    
        //transformar

        let object = {
            "name": name,
            "surname":surname,
            "membership":membership,
            "comment": text,
            "date":date 
        }
        return object;

    }
    async function postComment(event){
        event.preventDefault();
        let comment = createjson();
        try{
            let response = await fetch(url, {
                "method":"POST",
                "headers":{"Content-type":"application/json"},
                "body": JSON.stringify(comment)
            })
            if (response.status === 201){
                containerForMessagesToUser.innerHTML = "Comment added succesfully";
                clearMessage5s();
            }else{
                showFailedUrl();
            }
        }catch(error){
            console.log(error);
        }
    }

    let arrComments = [];       //create array of comments for local store
    let indice = 0;             //indice is the index where we store the last comment showed in the screen
    arrComments = fetchComments(); //fetch all coment in the API https://62180ad01a1ba20cba97626d.mockapi.io/api/v1/CommentsUsers    
    
    btnMoreComment.addEventListener("click", () => {loadThreeComments(arrComments, true)});
    btnDeleteAll.addEventListener("click", () => {deleteAll(arrComments)});
    btnSend.addEventListener("click", (event)=> {
        postComment(event).then(()=>{
            indice = 0;
            fetchComments();
            clearForm();
        })
    });

}
