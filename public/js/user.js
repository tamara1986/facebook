// Fetch user id from get parameter
let url = new URL(window.location.href);
let user_id = url.searchParams.get("id");
let user_image = document.getElementById('user-image');
let username = document.getElementById('username');
let feed_list = document.getElementById('feed-list');
let idUlogovanog=localStorage.getItem('user_id');
let statuses=[];
let usersAll=[];
let userProfile;
console.log(user_id);

// Load user data
window.onload=function(){
    let xhr=new XMLHttpRequest();
    xhr.onreadystatechange=function(){
        if (xhr.readyState==4) {
            let user=JSON.parse(xhr.response);
            var item = {
                        id: user[0].id,
                        name: user[0].firstName + ' ' + user[0].lastName,
                        gender: user[0].gender,
                        birthday: user[0].day+'.'+user[0].month+'.'+user[0].year,
                        image: user[0].imageSrc
                    }
                    userProfile=item;
                    
                    displayInformation(item);
        }
        
    }
    xhr.open('GET','http://localhost:3000/users?id='+user_id,true);
    xhr.send();
    getUsers();
    getStatuses();
    getImages();
    profileUser();
    galleryUser();
}
console.log(statuses);
console.log(usersAll);

function displayInformation(item){
    let content="";
    let galeryUser=document.getElementById('galeryOfUser');
    let img=document.getElementById('profileImage');
    img.setAttribute("src","uploads/image/"+item.image);
    let information=document.getElementById('information');
    content+='<p>Name</p><p><b>'+item.name+'</b></p><p>Gender</p><p><b>'+item.gender+'</b></p><p>Birthday</p><p><b>'+item.birthday+'</b></p>';
    information.innerHTML+=content;
    galeryUser.innerHTML='<a style="color:black;" href="gallery.html?id=' + item.id + '">Gallery of '+item.name+'</a>';
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
function getImages(){
    let xhr=new XMLHttpRequest();
    xhr.onreadystatechange=function(){
        if (xhr.readyState==4) {
            let images=JSON.parse(xhr.response);
            console.log(images);
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
                    
                    statuses.push(item);
            }
            sortFeeds();
        }
    }
    xhr.open('GET','http://localhost:3000/images?userId='+user_id,true);
    xhr.send();
}
function getStatuses(){
    let xhr=new XMLHttpRequest();
    xhr.onreadystatechange=function(){
        if (xhr.readyState==4) {
            let posts=JSON.parse(xhr.response);
            console.log(posts);
            for (var i = 0; i < posts.length; i++) {
                var item = {
                        id: posts[i].id,
                        body: posts[i].body,
                        userId: posts[i].userId,
                        time: posts[i].time,
                        timestamp: posts[i].timestamp,
                        type: posts[i].type
                    }
                    console.log(item);
                    statuses.push(item);            
        }
            sortFeeds();
        }
        
    }
    xhr.open('GET','http://localhost:3000/posts',true);
    xhr.send();
}

function sortFeeds(){
    statuses.sort(function(x, y){
        return y.timestamp - x.timestamp;
    });
    console.log(statuses);
    displayFeeds();
}
function displayFeeds(){
var feed_content = '';
    for (var i = 0; i < statuses.length; i++) {
        
            if (statuses[i].type=="status") {
                if (userProfile.id==statuses[i].userId) {
                    feed_content +='<div class="feed-content clearfix">'
                    feed_content += '<div class="feed-photo"><img src="uploads/image/'+userProfile.image+'"></div>'
                    feed_content += '<div class="feed-author"><a href="users.html?id=' + userProfile.id + '">';
                    feed_content += '<p>' + userProfile.name + '</p></a>';
                    feed_content += '<p class="feed-status">' + statuses[i].body + '</p>';
                    feed_content += '<p class="feed-status">' + statuses[i].time + '</p>';
                    if (userProfile.id==idUlogovanog) {
                        feed_content +='<button id="deletePost"" onclick="deleteStatus('+statuses[i].id+')">Delete</button></div></div>';
                    }else{
                        feed_content +='</div></div>';
                    }
                }
                
            }else{
                if (userProfile.id==statuses[i].userId && statuses[i].private=="false") {
                    feed_content +='<div class="feed-content clearfix">'
                    feed_content += '<div class="feed-photo"><img src="uploads/image/'+userProfile.image+'" ></div>'
                    feed_content += '<div class="feed-author"><a href="users.html?id='+ userProfile.id + '">';
                    feed_content += '<p>' + userProfile.name + '</p></a>';
                    feed_content += '<div class="feed-image-status"><a href="image.html?id='+statuses[i].id+'"><img src="uploads/images/'+statuses[i].imageURL+'" ></a></div>';
                    feed_content += '<p class="feed-status">' +statuses[i].time + '</p>';
                    if (userProfile.id==idUlogovanog) {
                        feed_content +='<button id="deletePost"" onclick="deleteStatus('+statuses[i].id+')">Delete</button></div></div>';
                    }else{
                        feed_content +='</div></div>';
                    }
                }
                
            }

        
    }
    feed_list.innerHTML=feed_content;
    
}
function deleteStatus(id_status){
    let xhr=new XMLHttpRequest();
    xhr.onreadystatechange=function(){
        if (xhr.readyState==4) {
            console.log(JSON.parse(xhr.response));
            setTimeout(refreshPage, 1000);
        }
        
    }
    xhr.open('DELETE','http://localhost:3000/comments/'+id_status,true);
    xhr.send();
}

function profileUser(){
    let link=document.getElementById('profilePage');
    link.setAttribute('href','users.html?id='+idUlogovanog);
}
function logout() {
    localStorage.removeItem('user_id');
    document.location.replace('index.html');
}
function refreshPage() {
    location.reload();
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


