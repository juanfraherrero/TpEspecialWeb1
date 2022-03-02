"use strict";

document.addEventListener("DOMContentLoaded", initPage)

function initPage() {
    const url = "https://62180ad01a1ba20cba97626d.mockapi.io/api/v1/CommentsUsers"
    
    let btnMoreComment = document.querySelector(".divButton");
    let btnDeleteAll = document.querySelector(".divButton .clearComments");
    let btnSend = document.querySelector(".sendForm");    
    let btnCancel = document.querySelector("form .cancel");    
    let btnConfirm = document.querySelector("form .confirm");    
    let containerForComments = document.querySelector("table tbody");
    let containerForMessagesToUser = document.querySelector(".loadingComments");
    let titleAddComment = document.querySelector("body .addComment");
    let idForEditComment = 0;
    //For the form
    let containerName = document.querySelector(".addComment .name");
    let containerSurname = document.querySelector(".addComment .surname");
    let containerMembership = document.querySelector(".addComment select");
    let containerText = document.querySelector(".addComment textarea");
    
    //show a failedUrl in the comment table
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
    //clear the h3 titlle in 5 seconds
    function clearMessage5s(){
        setTimeout(() => {
            containerForMessagesToUser.innerHTML = "";                                        
        }, 5000);
    };
    //clear all the table of comments, (local)
    function clearComments(){
        containerForComments.innerHTML = "";    //clear all the comments
    }
    //reset the form with empty values
    function clearForm(){
        containerName.value ="";
        containerSurname.value="";
        containerMembership.value="Membership Type";
        containerText.value="";
    }
    //toggle buttons between edit a comment and confirm or cancel the edition
    function toggleElements(){
        btnMoreComment.classList.toggle("hide");
        btnCancel.classList.toggle("hide");
        btnConfirm.classList.toggle("hide");
        btnSend.classList.toggle("hide");
    }
    //show in the form the content of the object, the object is a comment
    function showInfoComment(object){
        let name = object.name;     
        let surname = object.surname;
        let membership = object.membership;
        let comment= object.comment;
        idForEditComment = object.id;
        //we show in the form the info to modify
        containerName.value = name;     
        containerSurname.value = surname;
        containerMembership.value = membership;
        containerText.value = comment;   
    }
    //fetch the specified comment (by the id) to modify
    async function loadContentForm(id){
        try {
            let response = await fetch(`${url}/${id}`);
            if (response.ok){
                let json = await response.json();
                showInfoComment(json);
            }
            else{
                showFailedUrl();
            } 

        }catch(error){
            console.log(error);
        }
    }
    //the function when we press the edit specific comment, it have 2 actions, when is the first time we press it or the second press that is when we want to go back without pressing cancel
    function editfunc(event){  
        if (titleAddComment.innerHTML === "edit comment"){
            titleAddComment.innerHTML = "add comment";
            clearForm();
        }else{
            titleAddComment.innerHTML = "edit comment";
            let idComment = event.srcElement.parentNode.parentNode.id;
            loadContentForm(idComment);
        }
        toggleElements();   //hide button more comment and the title add comment
    }
    //delete all the comment in the API, one by one
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
    //procces of deleting all the comment, show a message to the user to notify that will take sime time, after deleting all the comments in API we reload the Comment Table  
    function deleteAll(array){
        containerForMessagesToUser.innerHTML = "Deleting Comments... this could take a moment";
        deleteRowsQuietly(array).then(()=>{
            indice = 0;
            fetchComments();
        })
    }
    //delete the comment with id "id" then we reload the comment table
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
    //delete the comment who was press
    function deletefunc(event){
        let idRow = event.srcElement.parentNode.parentNode.id;  //the id of the row to delete
        deleteRow(idRow);
    }
    //fetch all the comments in the API (array of json comments) update the local array of comments, in the middle we load three comment in the comment table 
    async function fetchComments(){
        try {
            clearComments();
            containerForMessagesToUser.innerHTML = "Loading Comments";  //message to user

            let response = await fetch(url);    //fetch the url
            if (response.ok){
                let json = await response.json();           //get the array of json with the comments
                containerForMessagesToUser.innerHTML = "";  //once we get the comment we delete the message to the user
                loadThreeComments(json);
                arrComments = await json;
            }
            else{
                showFailedUrl();    //error failed url!
            }
        }catch(error){
            console.log(error);
        }

    }
    //create the html tags to generate a comment
    function createComment(array){
        //create the first column content, information of the user
        let divName = document.createElement("div");                                    //<div></div>
        divName.className = "name";                                                     //<div class="name"></div>
        divName.innerHTML  = array[indice].name + "<br>" + array[indice].surname;       //<div class="name">"name" <br> "surname"</div>
        
        let divMembership = document.createElement("div");                              //<div></div>
        divMembership.className = "membershipType";                                     //<div class="mebershipType"></div>
        divMembership.innerHTML  = array[indice].membership;                            //<div class="mebershipType">"membership"</div>
        
        let divDate = document.createElement("div");                                    //same as the above elements
        divDate.className = "time";
        divDate.innerHTML  = array[indice].date;
        
        //create the first column
        let tdInfoUser = document.createElement("td");                                  //<td></td>
        tdInfoUser.className = "infoUserColumn firstColumn"                             //<td class="infoUserColumn firstColumn"></td>
        tdInfoUser.appendChild(divName);                                                //we are adding to the td the three above divs 
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
        btnEdit.addEventListener("click", editfunc)         //we add a listener to the button edit
        
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
        row.id = parseInt(array[indice].id) ;               //set the id the same id as in the API
        row.appendChild(tdInfoUser);
        row.appendChild(tdComment);
        row.appendChild(tdOptions);

        return row;
    }
    //load three comments in the comment table, the comments must be in the local araComment
    function loadThreeComments(array){        
        for (let cont = 0; cont < 3; cont++) {      //create three rows for each comment
            if (indice < (array.length)){           //verify we don't exceed the maximum comments
                let rowComment = createComment(array);
                containerForComments.appendChild(rowComment);   //add row (comment) to the DOM
                indice++;                                       
            }else if(indice !=  0 || arguments[1] ){    //if we are not in the first position or if we are in the first position but we press the morecomments button
                containerForMessagesToUser.innerHTML = "there are no more comments";
                clearMessage5s();
            }
        }
    }
    //create a object with the info of the form
    function createjson(){
        let name = containerName.value;
        let surname = containerSurname.value;
        let membership = containerMembership.value;
        let text = containerText.value;
        let date = new Date();
        //transform date
        date = `${date.getFullYear()}/${date.getMonth()}/${date.getDay()}`;
        //create the object json
        let object = {
            "name": name,
            "surname":surname,
            "membership":membership,
            "comment": text,
            "date":date 
        }
        return object;
    }
    //create a json with the info in the form and post it in the API
    async function postComment(){
        let comment = createjson();
        try{
            let response = await fetch(url, {
                "method":"POST",
                "headers":{"Content-type":"application/json"},
                "body": JSON.stringify(comment)
            });
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
    //restore the elements as if we never press the edit a specific comment
    function restoreEdit(event) {
        event.preventDefault();
        titleAddComment.innerHTML = "add comment";
        toggleElements();
        clearForm();
    }
    //create a json with the info in the form and update the comment in the API, then we restore the elemnts
    async function putComment(){
        let comment = createjson();
        try{
            let response = await fetch(`${url}/${idForEditComment}`, {
                "method":"PUT",
                "headers":{"Content-type":"application/json"},
                "body": JSON.stringify(comment)
            })
            if (response.status === 200){
                titleAddComment.innerHTML = "add comment";
                toggleElements();
                clearForm();
                indice = 0;
                fetchComments();

            }else{
                showFailedUrl();
            }
        }catch(error){
            console.log(error);
        }
    }

    let arrComments = [];               //create array of comments for local store
    let indice = 0;                     //indice is the index where we store the last comment showed in the screen
    fetchComments();                    //fetch all comments in the API https://62180ad01a1ba20cba97626d.mockapi.io/api/v1/CommentsUsers    
    

    //events listeners for fixed button in the html
    btnMoreComment.addEventListener("click", () => {loadThreeComments(arrComments, true)});
    btnDeleteAll.addEventListener("click", () => {deleteAll(arrComments)});
    btnSend.addEventListener("click", (event)=> {
        event.preventDefault();
        postComment().then(()=>{
            indice = 0;
            fetchComments();
            clearForm();
        })
    });
    btnConfirm.addEventListener("click", (event) => {
        event.preventDefault();
        putComment();
    });
    btnCancel.addEventListener("click", restoreEdit);

}
