let url = new URL(window.location.href);
let image_id = url.searchParams.get("id");
let image=[];
let idUlogovanog=localStorage.getItem('user_id');
let errors=document.getElementById('errors');
let imgUser=[];
let commList=[];
let usersAll=[];

window.onload=function(){
	getUsers()
	getImages();
	profileUser();
	getComments();
    galleryUser();
	
	
	

}
function getImages(){
	let xhr=new XMLHttpRequest();
    xhr.onreadystatechange=function(){
        if (xhr.readyState==4) {
            let images=JSON.parse(xhr.response);
            console.log(images);
            if (images[0] != undefined) {
                var item = {
                        id: images[0].id,
                        imageURL: images[0].imageURL,
                        userId: images[0].userId,
                        private: images[0].private,
                        time: images[0].time,
                        timestamp: images[0].timestamp,
                        type: images[0].type
                    }
                    image.push(item);
                    displayImage(item);
                    getUser(item);

                    
            }
        }
    }
    xhr.open('GET','http://localhost:3000/images?id='+image_id,true);
    xhr.send();
}

function displayImage(item){
	console.log(image);
	let img=document.getElementById('image');
	let slika='<img src="uploads/images/'+item.imageURL+'">';
	img.innerHTML=slika;
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
        let data='userId='+image[0].userId+'&imageId='+image[0].id+'&comment='+comment_content+'&comUserId='+idUlogovanog+'&time='+date+'&timestamp='+getTimestamp();
        let http = new XMLHttpRequest();
        http.onreadystatechange = function() {
            if(http.readyState == 4 ) {
                let comment = JSON.parse(http.responseText);
                console.log(comment);
                    success.innerHTML = '<div class="success-msg">New comment added.</div>';
                    setTimeout(refreshPage, 1000);
                
            }
        }
        
        http.open('POST', 'http://localhost:3000/comments', true);
        http.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
        http.send(data);
    }
}
function getUser(item){
	let xhr=new XMLHttpRequest();
    xhr.onreadystatechange=function(){
        if (xhr.readyState==4) {
            let imageUser=JSON.parse(xhr.response);
            console.log(imageUser);
            if (imageUser[0] != undefined) {
                var user = {
                        id: imageUser[0].id,
                        firstName: imageUser[0].firstName,
                        lastName: imageUser[0].lastName,
                        imageSrc: imageUser[0].imageSrc
                    }
                    imgUser.push(user);
                    displayImgUser(user); 

                    
            }
        }
    }
    
    xhr.open('GET','http://localhost:3000/users?id='+item.userId,true);
    xhr.send();
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
                        imageId: comments[i].imageId,
                        comment: comments[i].comment,
                        comUserId: comments[i].comUserId,
                        time: comments[i].time,
                        timestamp: comments[i].timestamp
                    }
                    commList.push(comm);
                }
               
                displayComments(commList);
            }
                     
        }
    }
    
    xhr.open('GET','http://localhost:3000/comments?imageId='+image_id,true);
    xhr.send();
}
function displayComments(){
	let comments_container=document.getElementById('comments');

	for (var i = 0; i < commList.length; i++) {
		
		for (var j = 0; j < usersAll.length; j++) {
			if(commList[i].comUserId == usersAll[j].id) {
				
                
                comments_container.innerHTML += '<p class="coment-author"><img class="comment-author-image" src="uploads/image/'+usersAll[j].image+'" />';
                
                comments_container.innerHTML += '<a href="users.html?id=' + usersAll[j].id + '"><p class="comment-author-name">' + usersAll[j].name +'</p></a><p>';
            }
		}
		comments_container.innerHTML += '<p class="comment-content">' + commList[i].comment + '</p>';
        comments_container.innerHTML += '<p class="comment-datetime">' + commList[i].time + '</p>';
        console.log(commList[i],idUlogovanog);
        if (commList[i].comUserId==idUlogovanog) {
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
    xhr.open('DELETE','http://localhost:3000/comments/'+id_com,true);
    xhr.send();
    
}
function getTimestamp() {
    return new Date().getTime();
}
function refreshPage() {
    location.reload();
}
function profileUser(){
    let link=document.getElementById('profilePage');
    link.setAttribute('href','users.html?id='+idUlogovanog);
}
function displayImgUser(user){
	let div=document.getElementById('img_user');
	let data='<div><img src="uploads/image/'+user.imageSrc+'"></div><a href="users.html?id='+user.id+'"><p>'+user.firstName+' '+user.lastName+'</p></a>';
    data+="<div><p style='margin-bottom:0'>Comments</p></div><hr>"
	div.innerHTML=data;

}
function logout() {
    localStorage.removeItem('user_id');
    document.location.replace('index.html');
}
function galleryUser(){
    let link=document.getElementById('gallery');
    link.setAttribute('href','gallery.html?id='+idUlogovanog);
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
