let idUlogovanog=localStorage.getItem('user_id');
let url = new URL(window.location.href);
let user_id = url.searchParams.get("id");
let errors=document.getElementById('errors');
let usersAll=[];
let commList=[];
console.log(idUlogovanog);
let gallery=[];
window.onload=function(){
    if (user_id!==idUlogovanog) {
        let add_img=document.getElementById('add-img');
        add_img.style="display:none";
    }
	getImages();
	profileUser();
    galleryUser();
    getUsers();
    getComments();
}
function getImages(){
    
        let xhr=new XMLHttpRequest();
    xhr.onreadystatechange=function(){
        if (xhr.readyState==4) {
            let images=JSON.parse(xhr.response);
            console.log(images);
            if (images[0] != undefined) {
            for (var i = 0; i < images.length; i++) {
                var item = {
                        id: images[i].id,
                        imageURL: images[i].imageURL,
                        userId: images[i].userId,
                        private: images[i].private,
                        time: images[i].time,
                        timestamp: images[i].timestamp,
                        type: images[i].type
                    }
                    
                    gallery.push(item);
            }
            sortFeeds();
        }
        }
    }
    xhr.open('GET','http://localhost:3000/images?userId='+user_id,true);
    xhr.send();
    
    
}
function sortFeeds(){
    gallery.sort(function(x, y){
        return y.timestamp - x.timestamp;
    });
    displayFeeds();
}
function displayFeeds(){
	let row=document.getElementById('galerryImg');
	for (var i = 0; i < gallery.length; i++) {
        if (user_id!==idUlogovanog) {
            if (gallery[i].private=='false') {
                let div='<div class="col-md-4 foto"><a href="image.html?id='+gallery[i].id+'"><img src="uploads/images/'+gallery[i].imageURL+'"></a></div>';
                row.innerHTML+=div;
            }
        }else{
            let div='<div class="col-md-4 foto"><a href="image.html?id='+gallery[i].id+'"><img src="uploads/images/'+gallery[i].imageURL+'"></a></div>';
                row.innerHTML+=div;
        }
		
	}
}
function profileUser(){
    let link=document.getElementById('profilePage');
    link.setAttribute('href','users.html?id='+idUlogovanog);
}
function logout() {
    localStorage.removeItem('user_id');
    document.location.replace('index.html');
}
function addImage(){
    let imageStatus=document.getElementById('imageStatus');
    let d=new Date();
    let date=d.getDay()+'.'+(d.getMonth()+1)+'.'+d.getFullYear()+' '+d.getHours()+':'+d.getMinutes();
    let image=imageStatus.files[0];
    let checkbox = document.getElementById('private');
    let private = false;
    if(checkbox.checked == true) {
        private = true;
    }
    if(image != undefined) {
        let data='imageURL='+image.name+'&userId='+idUlogovanog+'&private='+private+'&time='+date+'&timestamp='+getTimestamp()+'&type=img';
        let xhr=new XMLHttpRequest();
        xhr.onreadystatechange=function(){
            if (xhr.readyState==4) {
                let imageStat=JSON.parse(xhr.response);
                if(imageStat.success != '') {
                    console.log()
                    alert('New image status created.');
                    setTimeout(refreshPage, 1000);
                }
                
            }
        }
        xhr.open('POST','http://localhost:3000/images');
        xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
        xhr.send(data);
    }else {
        alert('Please choose image.');
    }
    

}
function getTimestamp() {
    return new Date().getTime();
}
function refreshPage() {
    location.reload();
}
function galleryUser(){
    let link=document.getElementById('gallery');
    link.setAttribute('href','gallery.html?id='+idUlogovanog);
}
function addComment() {
    console.log(idUlogovanog);
    var valid = true;
    let d=new Date();
    let date=d.getDay()+'.'+(d.getMonth()+1)+'.'+d.getFullYear()+' '+d.getHours()+':'+d.getMinutes();
    var comment_content = document.getElementById('new-comment').value;
    if(comment_content.length > 140) {
        errors.innerHTML += '<div class="error-msg">Comment must contain maximum 20 characters.</div>';
        valid = false;
    }
    if(valid) {
        errors.innerHTML = '';
        success.innerHTML = '';
        let data='userId='+user_id+'&comment='+comment_content+'&comGalId='+idUlogovanog+'&time='+date+'&timestamp='+getTimestamp();
        let http = new XMLHttpRequest();
        http.onreadystatechange = function() {
            if(http.readyState == 4 ) {
                let comment = JSON.parse(http.responseText);
                console.log(comment);
                    success.innerHTML = '<div class="success-msg">New comment added.</div>';
                    setTimeout(refreshPage, 1000);
                
            }
        }
        
        http.open('POST', 'http://localhost:3000/galleryComments', true);
        http.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
        http.send(data);
    }
}
function getComments(){
    let xhr=new XMLHttpRequest();
    xhr.onreadystatechange=function(){
        if (xhr.readyState==4) {
            let comments=JSON.parse(xhr.response);
            console.log(comments);
            if (comments[0] != undefined) {
                for (var i = 0; i < comments.length; i++) {
                    var comm = {
                        id: comments[i].id,
                        userId: comments[i].userId,
                        comment: comments[i].comment,
                        comGalId: comments[i].comGalId,
                        time: comments[i].time,
                        timestamp: comments[i].timestamp
                    }
                    commList.push(comm);
                }
               
                displayComments(commList);
            }
                     
        }
    }
    
    xhr.open('GET','http://localhost:3000/galleryComments?userId='+user_id,true);
    xhr.send();
}
function displayComments(commList){
    console.log(commList);
    let comments_container=document.getElementById('comments');

    for (var i = 0; i < commList.length; i++) {
        
        for (var j = 0; j < usersAll.length; j++) {
            if(commList[i].comGalId == usersAll[j].id) {
                
                
                comments_container.innerHTML += '<p class="coment-author"><img class="comment-author-image" src="uploads/image/'+usersAll[j].image+'" />';
                
                comments_container.innerHTML += '<a href="users.html?id=' + usersAll[j].id + '"><p class="comment-author-name">' + usersAll[j].name +'</p></a><p>';
            }
        }
        comments_container.innerHTML += '<p class="comment-content">' + commList[i].comment + '</p>';
        comments_container.innerHTML += '<p class="comment-time">' + commList[i].time + '</p>';
        
        if (commList[i].comGalId==idUlogovanog) {
            comments_container.innerHTML +='<button onclick="deleteComment('+commList[i].id+')">Delete</button><hr>';
        }else{
           comments_container.innerHTML +='<hr>'; 
        }
    }


}
function getUsers(){
    
    let xhr=new XMLHttpRequest();
    xhr.onreadystatechange=function(){
        if (xhr.readyState==4) {
            let users=JSON.parse(xhr.response);
            console.log(users);
            for (var i = 0; i < users.length; i++) {
                let item = {
                        id: users[i].id,
                        name: users[i].firstName + ' ' + users[i].lastName,
                        birthday: users[i].day+'.'+users[i].month+'.'+users[i].year,
                        image: users[i].imageSrc
                }
                    usersAll.push(item);
            }
        }   
    }
    xhr.open('GET','http://localhost:3000/users',true);
    xhr.send();
}
function deleteComment(id_com){
    let xhr=new XMLHttpRequest();
    xhr.onreadystatechange=function(){
        if (xhr.readyState==4) {
            console.log(JSON.parse(xhr.response));
            setTimeout(refreshPage, 1000);
        }
        
    }
    xhr.open('DELETE','http://localhost:3000/galleryComments/'+id_com,true);
    xhr.send();
    
}
function search(){
    console.log('stigo');
    var search=document.querySelector('input[name="search"]').value;
    let output=document.getElementById('output');
    output.innerHTML='';
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function () {
        if (xhr.readyState == 4) {
           var users=JSON.parse(xhr.response);
           for (var i = 0; i < users.length; i++) {
            output.innerHTML+='<a href="users.html?id='+users[i].id+'">'+users[i].firstName+' '+users[i].lastName+'</a><br>';
           
           
            }


        }
    }
    xhr.open('GET', 'http://localhost:3000/users?q='+search, true);
    xhr.send();
}

