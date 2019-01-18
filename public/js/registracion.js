
let firstName=document.getElementById('firstName');
let lastName=document.getElementById('lastName');
let username=document.getElementById("username");
let email=document.getElementById('email');
let password=document.getElementById("password");
let imageFile=document.getElementById('image');
let month=document.getElementById('month').options;
let day=document.getElementById('day').options;
let year=document.getElementById('year');
let gender=document.getElementsByName("gender");
let errors=document.getElementById('errors');
let success=document.getElementById('success');
errors.innerHTML='';
success.innerHTML='';

window.onload=function(){
	getDay();
	getYear();
}
function getDay(){
	let day=document.getElementById('day');
	for (var i = 1; i <= 31; i++) {
		let option=document.createElement('option');
		let atribute=option.setAttribute("value", i);
		option.innerHTML=i;
		day.appendChild(option);
	}
}
function getYear(){
	let year=document.getElementById('year');
	for (var j = 1905; j <= 2018; j++) {
		let option=document.createElement('option');
		let atribute=option.setAttribute("value",j);
		option.innerHTML=j;
		year.appendChild(option);
	}
}

document.querySelector('#signUp').addEventListener('submit',function(e){
	e.preventDefault();
	var monthSel=month.selectedIndex;
	var daySel=day.selectedIndex;
	var yearSel = year.options[year.selectedIndex].value;
	var genderSel;
	for (var i = 0; i < gender.length; i++) {
		if (gender[i].checked) {
			genderSel=gender[i].value;
		}
	}
	
	
	let format=/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/;
	let valid=true;

    if (firstName.value=='' || lastName.value=='' || username.value=='' || password.value=='' || email.value=='') {
        errors.innerHTML='<div class="error-msg">You have to fill all the fields</div>';
        valid=false;
    }

	if (format.test(username.value)) {
		errors.innerHTML='<div class="error-msg">Username can\'t contain special characters.</div>';
		valid=false;
	}
	if (format.test(password.value)) {
		errors.innerHTML='<div class="error-msg">Username can\'t contain special characters.</div>';
		valid=false;
	}
	if(username.value.length < 5 || username.value.length > 12) {
        errors.innerHTML += '<div class="error-msg">Username must contain between 5 and 12 characters.</div>';
        valid = false;
    }

    if(password.value.length < 5 || password.value.length > 12) {
        errors.innerHTML += '<div class="error-msg">Password must contain between 5 and 12 characters.</div>';
        valid = false;
    }
    if (valid) {

    	let data='firstName='+firstName.value+'&lastName='+lastName.value+'&username='+username.value+'&email='+email.value+'&password='+password.value+'&month='+monthSel+'&day='+daySel+'&year='+yearSel+'&gender='+genderSel+'&imageSrc='+imageFile.files[0].name;
		let xhr=new XMLHttpRequest();
		xhr.onreadystatechange=function(){
			if (xhr.readyState==4) {
				let myObj=JSON.parse(xhr.response);
				success.innerHTML = '<div class="success-msg">New user registered.</div>';
			}
		}
		xhr.open('POST','http://localhost:3000/users');
		xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
		xhr.send(data);

    }
 	
    console.log(imageFile.files[0].name);
    // var obj=window.URL.createObjectURL(imageFile);
    // console.log(obj);
    // window.URL.revokeObjectURL(obj);
    // console.log(window.URL.revokeObjectURL(obj));
	
	
	
});
document.querySelector('#loginForm').addEventListener('submit',function(e){
	e.preventDefault();
	let emailLog=document.getElementById('emailLog');
	let passwordLog=document.getElementById('passwordLog');
	let xhr=new XMLHttpRequest();
		xhr.onreadystatechange=function(){
			if (xhr.readyState==4) {
				let user=JSON.parse(xhr.response);
				if (user[0].email==emailLog.value && user[0].password==passwordLog.value) {
					localStorage.setItem('user_id', user[0].id);
				}
				if(user[0].id != null) {
	                document.location.replace('home.html');
	            } else {
	                alert('Wrong username and password combination.');
	            }
				
				
			}
		}
		xhr.open('GET','http://localhost:3000/users?email='+emailLog.value+'&password='+passwordLog.value);
		xhr.send();
});





