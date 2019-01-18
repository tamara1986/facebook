

let user_id=localStorage.getItem('user_id');
let feed_list=document.getElementById('feed-list');
let statuses=[];
let usersAll=[];




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
function displayInformation(item){
	let content="";
	let img=document.getElementById('profileImage');
	img.setAttribute("src","uploads/image/"+item.image);
	let information=document.getElementById('information');
	content+='<p>Name</p><p><b>'+item.name+'</b></p><p>Gender</p><p><b>'+item.gender+'</b></p><p>Birthday</p><p><b>'+item.birthday+'</b></p>';
	information.innerHTML+=content;
}

function getUsers(){
	
	let xhr=new XMLHttpRequest();
	xhr.onreadystatechange=function(){
		if (xhr.readyState==4) {
			let users=JSON.parse(xhr.response);
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


function addStatus(){
	let status=document.getElementById('status');
	let d=new Date();
	let date=d.getDay()+'.'+(d.getMonth()+1)+'.'+d.getFullYear()+' '+d.getHours()+':'+d.getMinutes();
	console.log('date');
	let data='body='+status.value+'&userId='+user_id+'&time='+date+'&timestamp='+getTimestamp()+'&type=status';
	let xhr=new XMLHttpRequest();
	xhr.onreadystatechange=function(){
		if (xhr.readyState==4) {
			let post=JSON.parse(xhr.response);
			if(post.success != '') {
                    alert('New status created.');
                    setTimeout(refreshPage, 1000);
                }
			
		}
	}
	xhr.open('POST','http://localhost:3000/posts',true);
	xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
	xhr.send(data);

}
function getStatuses(usersAll){
	let xhr=new XMLHttpRequest();
	xhr.onreadystatechange=function(){
		if (xhr.readyState==4) {
			let posts=JSON.parse(xhr.response);
			for (var i = 0; i < posts.length; i++) {
				var item = {
                        id: posts[i].id,
                        body: posts[i].body,
                        userId: posts[i].userId,
                        time: posts[i].time,
                        timestamp: posts[i].timestamp,
                        type: posts[i].type
                    }
                    statuses.push(item);			
                }
			sortFeeds();
		}
		
	}
	xhr.open('GET','http://localhost:3000/posts',true);
	xhr.send();
}
function getImages(usersAll){
	let xhr=new XMLHttpRequest();
	xhr.onreadystatechange=function(){
		if (xhr.readyState==4) {
			let images=JSON.parse(xhr.response);
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
	xhr.open('GET','http://localhost:3000/images',true);
	xhr.send();
}

function displayFeeds(){
var feed_content = '';
    for (var i = 0; i < statuses.length; i++) {
    	for (var j = 0; j < usersAll.length; j++) {
			if (statuses[i].type=="status") {
				if (usersAll[j].id==statuses[i].userId) {
					feed_content +='<div class="feed-content clearfix">'
					feed_content += '<div class="feed-photo"><img src="uploads/image/'+usersAll[j].image+'"></div>'
					feed_content += '<div class="feed-author"><a href="users.html?id=' + usersAll[j].id + '">';
					feed_content += '<p>' + usersAll[j].name + '</p></a>';
					feed_content += '<p class="feed-status">' + statuses[i].body + '</p>';
				    feed_content += '<p class="feed-status">' + statuses[i].time + '</p>';
				    if (statuses[i].userId==user_id) {
				    	feed_content += '<button id="deletePost" onclick="deletePost('+statuses[i].id+')">Delete</button></div></div>';
				    }else{
				    	feed_content +='</div></div>';
				    }
				    

				}
				
			}else{
				if (usersAll[j].id==statuses[i].userId && statuses[i].private=="false") {
					feed_content +='<div class="feed-content clearfix">'
					feed_content += '<div class="feed-photo"><img src="uploads/image/'+usersAll[j].image+'" ></div>'
					feed_content += '<div class="feed-author"><a href="users.html?id='+ usersAll[j].id + '">';
					feed_content += '<p>' + usersAll[j].name + '</p></a>';
					feed_content += '<div class="feed-image-status"><a href="image.html?id='+statuses[i].id+'"><img src="uploads/images/'+statuses[i].imageURL+'" ></a></div>';
				  	feed_content += '<p class="feed-status">' +statuses[i].time + '</p>';
				  	if (statuses[i].userId==user_id){
				  		feed_content += '<button id="deletePost" onclick="deletePost('+statuses[i].id+')"> Delete</button></div></div>';
				  	}else{
				  		feed_content +='</div></div>';
				  	}
				  	
				}
				
			}

		}
	}
	feed_list.innerHTML=feed_content;
	
}

function addImage(){
	let imageStatus=document.getElementById('imageStatus');
	let d=new Date();
	let date=d.getDay()+'.'+(d.getMonth()+1)+'.'+d.getFullYear()+' '+d.getHours()+':'+d.getMinutes();
	let image=imageStatus.files[0];
	let checkbox = document.getElementById('private');
	let private = false;
    
    if(image != undefined) {
    	let data='imageURL='+image.name+'&userId='+user_id+'&private='+private+'&time='+date+'&timestamp='+getTimestamp()+'&type=img';
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
function logout() {
    localStorage.removeItem('user_id');
    document.location.replace('index.html');
}
function getTimestamp() {
    return new Date().getTime();
}
function refreshPage() {
    location.reload();
}

function sortFeeds(){
	statuses.sort(function(x, y){
        return y.timestamp - x.timestamp;
    });
    displayFeeds();
}
function profileUser(){
    let link=document.getElementById('profilePage');
    link.setAttribute('href','users.html?id='+user_id);
}
function deletePost(id_status){
	console.log(statuses[0]);
	for (var i = 0; i < statuses.length; i++) {
		if(statuses[i].id==id_status && statuses[i].type=="status"){
			if (statuses[i].userId==user_id) {
					let xhr=new XMLHttpRequest();
					xhr.onreadystatechange=function(){
						if (xhr.readyState==4) {
							console.log(JSON.parse(xhr.response));
							setTimeout(refreshPage, 1000);
						}
						
					}
					xhr.open('DELETE','http://localhost:3000/posts/'+id_status,true);
					xhr.send();
			}
		}
		if(statuses[i].id==id_status && statuses[i].type=="img"){
			if (statuses[i].userId==user_id) {
					let xhr=new XMLHttpRequest();
					xhr.onreadystatechange=function(){
						if (xhr.readyState==4) {
							console.log(JSON.parse(xhr.response));
							setTimeout(refreshPage, 1000);
						}
						
					}
					xhr.open('DELETE','http://localhost:3000/images/'+id_status,true);
					xhr.send();
			}
		} 
	}
}
function galleryUser(){
    let link=document.getElementById('gallery');
    link.setAttribute('href','gallery.html?id='+user_id);
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



