'use strict';
//alert(NodePath);
let UpdateVisits = async (tablename) => {  
// Создаем экземпляр класса XMLHttpRequest
const request = new XMLHttpRequest();

// Указываем путь до файла на сервере, который будет обрабатывать наш запрос 
// Так же как и в GET составляем строку с данными, но уже без пути к файлу 
//const url = "http://localhost:3333/scan2/get-fonds?archivecode=" + archivecode+ "&fond=" + fond1 + "&fondname=" + fondname;
const url = NodePath + `scan2/get-updateseq`;      
const params = "tablename=" + tablename;
//alert(fond1)
/* Указываем что соединение	у нас будет POST, говорим что путь к файлу в переменной url, и что запрос у нас
асинхронный, по умолчанию так и есть не стоит его указывать, еще есть 4-й параметр пароль авторизации, но этот
параметр тоже необязателен.*/ 
request.open("POST", url, true);
// alert('LF1');
//В заголовке говорим что тип передаваемых данных закодирован. 
request.setRequestHeader("Content-type", "application/x-www-form-urlencoded");

request.addEventListener("readystatechange", () => {
        
    //alert('LF2');
    if(request.readyState === 4 && request.status === 200) {       
    //console.log(request.responseText);
    //alert(request.responseText);
        if(request.responseText == 0 )
                    {
                        alert('Данные не найдены');
                                                    
                        //$("#err").empty();
                        //$( "#err" ).append( "Неверный логин или пароль" );
                        //$("div.#err").append("Неверный логин или пароль");
                    }
                    else
                    {

                        alert('OK');
                        //text =JSON.parse(request.responseText);
                        //let n =text[0][FondName];
                        
                        //el.textContent = `Кол-во посещений: ` + text.recordset[0].CurVal;                
                    }
}
});

//	Вот здесь мы и передаем строку с данными, которую формировали выше. И собственно выполняем запрос. 
await request.send(params);
};

let GetVisits = async (tablename,el) => {  
// Создаем экземпляр класса XMLHttpRequest
const request = new XMLHttpRequest();

// Указываем путь до файла на сервере, который будет обрабатывать наш запрос 
// Так же как и в GET составляем строку с данными, но уже без пути к файлу 
//const url = "http://localhost:3333/scan2/get-fonds?archivecode=" + archivecode+ "&fond=" + fond1 + "&fondname=" + fondname;
const url = NodePath + `scan2/get-nextseq`;      
const params = "tablename=" + tablename;
//alert(fond1)
/* Указываем что соединение	у нас будет POST, говорим что путь к файлу в переменной url, и что запрос у нас
асинхронный, по умолчанию так и есть не стоит его указывать, еще есть 4-й параметр пароль авторизации, но этот
параметр тоже необязателен.*/ 
request.open("POST", url, true);
// alert('LF1');
//В заголовке говорим что тип передаваемых данных закодирован. 
request.setRequestHeader("Content-type", "application/x-www-form-urlencoded");

request.addEventListener("readystatechange", () => {
        
    //alert('LF2');
    if(request.readyState === 4 && request.status === 200) {       
    //console.log(request.responseText);
    //alert(request.responseText);
        if(request.responseText == 0 )
                    {
                        alert('Данные не найдены');
                                                    
                        //$("#err").empty();
                        //$( "#err" ).append( "Неверный логин или пароль" );
                        //$("div.#err").append("Неверный логин или пароль");
                    }
                    else
                    {

                        //alert('OK');
                        text =JSON.parse(request.responseText);
                        //let n =text[0][FondName];
                        
                        el.textContent = `Кол-во посещений: ` + text.recordset[0].CurVal;                
                    }
}
});

//	Вот здесь мы и передаем строку с данными, которую формировали выше. И собственно выполняем запрос. 
   request.send(params);
};
let lbl1 = document.querySelector(`.lblLeft`);
let lbl2 = document.querySelector(`.lblCenter`);
let lbl3 = document.querySelector(`.lblRight`);
// let fn1 = async () => {
//     await GetVisits(`P1`,lbl1);
//     await GetVisits(`P7`,lbl2);
//     await GetVisits(`P5`,lbl3);
// };
// fn1();
// let fn2 = async () => {
    
//     await GetVisits(`P7`,lbl2);
    
// };
// let fn3 = async () => {
    
//     await GetVisits(`P5`,lbl3);
// };
//setTimeout(() => {  alert("World!"); }, 2000);
setTimeout(() => { GetVisits(`P1`,lbl1); }, 500);
setTimeout(() => { GetVisits(`P7`,lbl2); }, 1000);
setTimeout(() => { GetVisits(`P5`,lbl3); }, 1500);
// GetVisits(`P1`,lbl1);
// GetVisits(`P7`,lbl2);
// GetVisits(`P5`,lbl3);
let select = document.querySelector(`.variants3`);
let select1 = document.querySelector(`.variants1`);
let select2 = document.querySelector(`.variants2`);
let ClearSel = () => {

//let res2 = document.querySelector('.result');
let option = select.querySelectorAll(`.opt`);
if (option.length==0) {return;};

 for (let i=0; i < option.length;i++){
    option[i].remove();
    alert(i);
 }

return;
};

let createSel = (() =>{
    //let select = document.querySelector(`.variants3`);
    ClearSel();
    let option1 = document.createElement('option');
    select.appendChild(option1);
    option1.textContent= `----------------`;
    option1.classList.add('opt');
    option1.value = 0;
    //select.option1.selected = true;
    //alert(select[0].value);
    let option2 = document.createElement('option');
    select.appendChild(option2);
    option2.textContent= `ОХД до 1917 года`;
    option2.classList.add('opt');
    option2.value = 1;
    let option3 = document.createElement('option');
    select.appendChild(option3);
    option3.textContent= `ОХД ЛСМ`;
    option3.classList.add('opt');
    option3.value = 6;
    //select[0].selected = true;
})();


// window.onload = function() {
    
// };
let text; 
let arhiveCode;
//let bArchiveCode = false;
let arhiveAll = document.querySelector('.variants3');
arhiveAll.addEventListener("change", function(evt){
    evt.preventDefault();
    arhiveCode = arhiveAll.value;
    //bArchiveCode = true;
    //alert(arhiveCode);
})

select1.addEventListener("change", function(evt){
    evt.preventDefault();
    arhiveCode = select1.value;
    //bArchiveCode = true;
    //alert(arhiveCode);
})

select2.addEventListener("change", function(evt){
    evt.preventDefault();
    arhiveCode = select2.value;
    //bArchiveCode = true;
    //alert(arhiveCode);
})

let link = document.querySelector(".login-link");
let sb1 = document.querySelector(".sb1");
let sb2 = document.querySelector(".sb2");
let popup = document.querySelector(".modal-login");
let close = popup.querySelector(".modal-close");
sb2.addEventListener("click", function (evt) {
    evt.preventDefault();
    
    arhiveCode = select2.value;
    //alert(arhiveCode);
    if (arhiveCode == 0) {
        alert(`Выберите код ОХД`);
        return;
    }
    //alert(arhiveCode);
    UpdateVisits(`P7`);
    location.href = `../docexists/docexists.html?archivecode=${arhiveCode}`;
});
sb1.addEventListener("click", function (evt) {
    evt.preventDefault();
    
    arhiveCode = select1.value;
    //alert(arhiveCode);
    if (arhiveCode == 0) {
        alert(`Выберите код ОХД`);
        return;
    }
    //alert(arhiveCode);
    UpdateVisits(`P1`);
    location.href = `../search/search1.html?archivecode=${arhiveCode}`;
});

link.addEventListener("click", function (evt) {
    evt.preventDefault();
    
    arhiveCode = arhiveAll.value;
    //alert(arhiveCode);
    if (arhiveCode == 0) {
        alert(`Выберите код ОХД`);
        return;
    }
    let chbox1 = document.querySelector(`#chb1`);

    if (!chbox1.checked) {
        UpdateVisits(`P5`);
        location.href = `../fond/fond9.html?archivecode=${arhiveCode}`;
        return;
    }
    popup.classList.add("modal-show");

});

 close.addEventListener("click", function (evt) {
    evt.preventDefault();
    popup.classList.remove("modal-show");
    popup.classList.remove("modal-error");
});

window.addEventListener("keydown", function (evt) {
    if (evt.keyCode === 27) {
        evt.preventDefault();
        if (popup.classList.contains("modal-show")) {
            popup.classList.remove("modal-show");
            popup.classList.remove("modal-error");
        }
    }
});

const auth = () => {
    //var log = $("#myForm #login").val();
    //var pwd = $("#myForm #pass").val();
    
    let log = document.querySelector('.login-icon-user').value;
    let pwd = document.querySelector('.login-icon-password').value;
       // alert(pwd);

// Создаем экземпляр класса XMLHttpRequest
const request = new XMLHttpRequest();

// Указываем путь до файла на сервере, который будет обрабатывать наш запрос 
const url = NodePath + `scan2/login?archivecode=` + arhiveCode;

// Так же как и в GET составляем строку с данными, но уже без пути к файлу 
const params = "login=" + log+ "&pass=" + pwd;

/* Указываем что соединение	у нас будет POST, говорим что путь к файлу в переменной url, и что запрос у нас
асинхронный, по умолчанию так и есть не стоит его указывать, еще есть 4-й параметр пароль авторизации, но этот
параметр тоже необязателен.*/ 
request.open("POST", url, true);

//В заголовке говорим что тип передаваемых данных закодирован. 
request.setRequestHeader("Content-type", "application/x-www-form-urlencoded");

request.addEventListener("readystatechange", () => {

if(request.readyState === 4 && request.status === 200) {       
//console.log(request.responseText);
//alert(request.responseText);
if(request.responseText ==0)
                {
                    alert('Несовпадение');
                    //$("#err").empty();
                    //$( "#err" ).append( "Неверный логин или пароль" );
                    //$("div.#err").append("Неверный логин или пароль");
                }
                else
                {
                    alert('OK');
                    //$("#err").empty();
                    //alert(arhiveCode);
                    //text =JSON.parse(request.responseText);
                    text =request.responseText;
                    //alert(text);
                   //location.href = `orderdocs.html?archivecode=${arhiveCode}`;
                   location.href = `../orderdocs/orderdocs.html?scandocsid=${text}&archivecode=${arhiveCode}`;
                }
}
});

//	Вот здесь мы и передаем строку с данными, которую формировали выше. И собственно выполняем запрос. 
request.send(params);
//select.options[0].selected = true;
//select[0].selected = true;
};