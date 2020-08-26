'use strict';
//const rootFolder = `GetImageLarge.php?file=`;

let GetQueryStringParams = (sParam) =>
	{
	    var sPageURL = window.location.search.substring(1);
	    var sURLVariables = sPageURL.split('&');
	    for (var i = 0; i < sURLVariables.length; i++) 
	    {
	        var sParameterName = sURLVariables[i].split('=');
			if(sParameterName[0] =='')			
				return 0;
			else if (sParameterName[0] == sParam) 
	        {
	            return sParameterName[1];
	        }
	    }
    }
let archivecode = GetQueryStringParams("archivecode");    
let folderName = GetQueryStringParams("FolderName");
alert(folderName + archivecode);

const rootFolder = NodePath + `scan2/get-img/?FolderName=` + folderName + `&archivecode=` + archivecode + `&fileName=`;
//const rootFolder = `GetImageLarge.php?Folder=`+ folderName + `&file=`;
let bDiapLoaded = false;
let jpgHeight;
let jpgWidth; 
//let viewportW = 700;
//let viewportH = 500;  
//const fileName = "./img/tibet-3.jpg"; 
//const fileName = "./img/01.jpg"; 
    //autofit();
let ipos = {
        x: 0,
        y: 0,
        xRight: 0,
        yRight: 0
    };
let shift = {
                    x: 0,
                    y: 0
                };
let xDelta;
let yDelta; 
let ImageW;
let ImageH;
// const ContW = 700;
// const ContH = 500;
let ContW;
let ContH;
let diffW;
let diffH;
let scale;
let leftLimit;
let rightLimit;
let topLimit;
let bottomLimit;
let degrot=0;
let bStop=false;
const scene = document.querySelector('.scene');
    
let leftScene;
let topScene;
// scene.style.left = leftScene + `px`;
// scene.style.top = topScene+ `px`;
let fileWidth;
let fileHeight;
//let Picfiles = [];
const setup = document.querySelector('.setup');
//setup.setAttribute('src',fileName);
   
let move;
let filePath;
let arrayFiles = [];
let objImg = new Set;
let startPage=0;
let finPage=0;
const diapStep = 200;
let k1=0.23;
//=================================Из Основного файла====================================		
let LoadFiles =(() => {
              //alert('LF');  
              ContW = scene.clientWidth;
              ContH = scene.clientHeight;
              ImageW = setup.clientWidth;
              ImageH = setup.clientHeight; 
              leftScene = parseInt(window.getComputedStyle(scene, null).getPropertyValue("left"));
              topScene =  parseInt(window.getComputedStyle(scene, null).getPropertyValue("top"));
              //leftScene = parseInt(scene.style.left, 10);
              //topScene = parseInt(scene.style.top, 10);
              //alert(leftScene + ` --- `+ topScene); 
            // Создаем экземпляр класса XMLHttpRequest
            const request = new XMLHttpRequest();
        // Указываем путь до файла на сервере, который будет обрабатывать наш запрос 
            //const url = "ReadFiles2.php";
            const url = NodePath + `scan2/get-files?FolderName=` + folderName + `&archivecode=` + archivecode;
         //let fond1 = document.querySelector('.numer1').value;
        // Так же как и в GET составляем строку с данными, но уже без пути к файлу 
        const params = "FolderName=" + folderName + "&archivecode=" + archivecode;
        //const params = "foldername=" + '0';
         //alert(params)
        /* Указываем что соединение	у нас будет POST, говорим что путь к файлу в переменной url, и что запрос у нас
        асинхронный, по умолчанию так и есть не стоит его указывать, еще есть 4-й параметр пароль авторизации, но этот
            параметр тоже необязателен.*/ 
            request.open("GET", url, true);
        // alert('LF1');
        //В заголовке говорим что тип передаваемых данных закодирован. 
            request.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
            request.addEventListener("readystatechange", () => {
                //alert('LF2');
                if(request.readyState === 4 && request.status === 200) {       
                    if(request.responseText ==0)
                                {
                                    alert('Несовпадение');
                                }
                                else
                                {
                                    alert('OK');
                                    let lblTotpages = document.querySelector('#totPages');    
                                    let text =JSON.parse(request.responseText);
                                    //console.log(text);
                                    // for (let i=0;i<text.length;i++){
                                    //     //Picfiles.push(text[i].file);
                                    //     //alert(Picfiles[i]);
                                    //     //objImg = Object.assign({}, {name: text[i].file, numer: i+1});
                                    //     objImg = Object.assign({}, {name: text[i], numer: i+1});
                                    //     arrayFiles.push(objImg);
                                    //     //imgdiv(text[i].file,Number(i),text.length);
                                    //     //imgdiv(objImg,text.length,i);
                                    //     //arrayFiles = arrayFiles.map(function(it) {return it.}) 
                                    // }
                                    arrayFiles = text;
                                    lblTotpages.textContent = arrayFiles.length;
                                    setDiaps(arrayFiles.length);
                                    //console.log(arrayFiles);
                                    //alert(arrayFiles.length); 
                                    //LoadFirstImg(arrayFiles[0].name,arrayFiles[0].numer);
                                }
            }
        });
        //	Вот здесь мы и передаем строку с данными, которую формировали выше. И собственно выполняем запрос. 
        request.send(params);
                })();
let secDiap = document.querySelector(`.diap`);               
let setDiaps = (totpages) =>{
        let totDiaps = Math.ceil(totpages/diapStep);
        //alert(totDiaps);
        for (let i=1; i <= totDiaps; i++) {
            let optItem = document.createElement('option');
            optItem.textContent = `${(i-1)*diapStep + 1} - ${(i-1)*diapStep + diapStep} `;
            optItem.value = i;
            secDiap.appendChild(optItem);
        }
};
         
let LoadFirstImg = (startInd) => {
            let imgLarge1 = document.querySelector('.setup');
            //alert(arrayFiles[startInd]);
            imgLarge1.src = rootFolder+arrayFiles[startInd];
            filePath = rootFolder+arrayFiles[startInd];
            autofit(filePath);
            const curPage = document.querySelector('#curPage');
            curPage.textContent = startInd+1;
            let vgroupIm=document.querySelectorAll('.small');
            let vgroup=document.querySelector('.vgroup');
            vgroup.scrollTop = 0;
            //console.log(vgroupIm);
                for(let i = 0;i < vgroupIm.length;i++) {
                //     alert();
                     vgroupIm[i].style = `border: none;`;
                 }
                 vgroupIm[0].style = `border: 0.2vw solid red;`;  
        };

let LoadSetImg = (setPage) => {
        let imgLarge1 = document.querySelector('.setup');
            imgLarge1.src = rootFolder+arrayFiles[setPage];
            filePath = rootFolder+arrayFiles[setPage];
            autofit(filePath);
            const curPage = document.querySelector('#curPage');
            curPage.textContent = setPage+1;
            let vgroupIm=document.querySelectorAll('.small');
            //let vgroupIm=document.querySelectorAll('.small');
            let vgroup=document.querySelector('.vgroup');
            //vgroup.scrollTop = 133*(setPage-startPage);
            //console.log(vgroupIm);
            for(let i = 0;i < vgroupIm.length;i++) {
                //     alert();
                     vgroupIm[i].style = `border: none;`;
                 }
            vgroupIm[setPage - startPage].style = `border: 0.2vw solid red;`;
            vgroupIm[setPage - startPage].scrollIntoView({block: "center", behavior: "smooth"}); 
    };  
    let cnt =document.querySelector('#counter');
    let divCont = document.querySelector(`.content`);       
    let proc = document.querySelector(`.prosent`);
    
    let imgdiv = (arr,totalImg=0,cnt1=0,idx) => {
            //alert((url,countImg,totPage));
            let el=document.querySelector('.vgroup');
            //let img=new Image();
            //el.style.width=img.width+'px';
            //el.style.height=(img.height+20)+'px';	
            //el.innerHTML='<img src = ' + url +' style="margin:0" width="'+img.width+'" height="'+img.height+'" />';
            let aItem = document.createElement('a');
            let img1 = document.createElement('img'); 
            el.appendChild(aItem);
            // aItem.setAttribute('href','GetImageLarge.php?file='+url);
            aItem.classList.add('asmall');
            aItem.href = rootFolder+arr;
            aItem.textContent = idx; 
            //alert(idx);
            aItem.appendChild(img1);
            img1.src = rootFolder+arr;
            img1.classList.add('small');
            img1.onload = function() {
                //alert(idx);
                cnt.textContent=idx;
                //procent = totalImg/100;
                let cnt2 = cnt1/totalImg*100;
                cnt2 = Math.floor(cnt2);
                proc.textContent = `Загрузка...${cnt2}%`;
                if(idx == totalImg )
                  { 
                   //alert("loaded");
                   cnt2 = 0;
                   proc.textContent = ``;
                   divCont.style = `display: none;`;
                   bDiapLoaded = true;
                 }
            };
            //img1.alt = arr.name;
            //img1.alt = countImg;
            // img1.setAttribute('alt', url);
            //img1.setAttribute('height', '100');
            //img1.setAttribute('width', '100');
            ImgClick(img1,img1.src,idx);      
            }

    let ImgClick = (img3, src3,imgNum) => {
        let imgLarge = document.querySelector('.setup');
        filePath = src3;   
        img3.addEventListener("click", function (evt) {
            evt.preventDefault();
            filePath = src3; 
            autofit(src3);
            // scale = 1;
            imgLarge.src = src3;
            const curPage = document.querySelector('#curPage');
            curPage.textContent = imgNum; 
            let vgroupIm=document.querySelectorAll('.small');
                for(let i = 0;i < vgroupIm.length;i++) {
                //     alert();
                     vgroupIm[i].style = `border: none;`;
                 }
                img3.style = `border: 0.2vw solid red;`; 
            // imgLarge.style.transform = "scale(1)";
            // imgLarge.style.top = '0';
            // imgLarge.style.left = '0';
       });
    };
//LoadFiles();

let inpPage = document.querySelector('.inPag');
inpPage.addEventListener('keydown', function(evt) {
            //evt.preventDefault();
            if (evt.keyCode === 13) {
            let setPage = parseInt(inpPage.value);
            if (setPage == ``) {
                    alert(`Выберите страницу`);
                    return;
                    }
            if (setPage > arrayFiles.length) {
                    alert(`Страница не в диапазоне`);
                    return;
                    }   
            startPage = (Math.floor(setPage/diapStep))*diapStep;
                
            finPage = startPage + diapStep;
            if (finPage > arrayFiles.length) {
                    finPage = arrayFiles.length;
                }
                let vgroup=document.querySelector('.vgroup');
                //vgroup.removeChild();
                let curDiap = Math.floor(setPage/diapStep) + 1;
                const selDiap = secDiap.getElementsByTagName('option');
                for (let i = 0; i < selDiap.length; i++) {
                    if (selDiap[i].value == curDiap) {
                        selDiap[i].selected = true;
                        }
                    };
                while (vgroup.firstChild) {
                    vgroup.removeChild(vgroup.firstChild);
                                    }
                for (let i=startPage; i < finPage;i++){
                        imgdiv(arrayFiles[i],finPage,i-startPage, i+1);
                                    }
                divCont.style = `display: block;`;              
                LoadSetImg (setPage-1); 
                //let vgroup=document.querySelector('.vgroup');
                //let vgroupH = parseInt(window.getComputedStyle(vgroup, null).getPropertyValue("height"));
            }
});

let btnArrowRight = document.querySelector(`.arrow-right`);

btnArrowRight.addEventListener('click', function (evt) {
    evt.preventDefault();
    const curPage = document.querySelector('#curPage');
    let currentPage = curPage.textContent;
    let nextPage = parseInt(currentPage) + 1;
    let imgLarge = document.querySelector('.setup');
    if (nextPage > finPage) {
       alert(`Это последняя страница диапазона`);
       return;
        };
    let src3 = rootFolder + arrayFiles[nextPage-1];
    //alert(src3);
    autofit(src3);
    imgLarge.src = src3;
            //const curPage1 = document.querySelector('#curPage');
    curPage.textContent = nextPage; 
    let vgroupIm=document.querySelectorAll('.small');
    let vga = document.querySelectorAll('.asmall');
    let vgroup=document.querySelector('.vgroup');
    let vgroupH = parseInt(window.getComputedStyle(vgroup, null).getPropertyValue("height"));
    //vgroup.scrollTop = k1*vgroupH*(nextPage-startPage -1);
    let offTop = vgroup.offsetTop;
    //alert(offTop);
    for(let i = 0;i < vgroupIm.length;i++) {
                //     alert();
                     vgroupIm[i].style = `border: none;`;
                     //vgroupIm[i].style.transform = `translateY(-115px)`;
                 }
    vgroupIm[nextPage - startPage-1].style = `border: 0.2vw solid red;`; 
    vgroupIm[nextPage - startPage-1].scrollIntoView({block: "center", behavior: "smooth"});
}   
    ); 

let btnArrowLeft = document.querySelector(`.arrow-left`);
btnArrowLeft.addEventListener('click', function (evt) {
    evt.preventDefault();
    const curPage = document.querySelector('#curPage');
    let currentPage = curPage.textContent;
    let prevPage = parseInt(currentPage) - 1;
    //fileName = "./img/tibet-3.jpg";
    //alert(prevPage);
    
    let imgLarge = document.querySelector('.setup');
    if (prevPage <= startPage) {
       alert(`Это первая страница диапазона`);
       return;
        };
    
    let src3 = rootFolder + arrayFiles[prevPage-1];
    //alert(src3);
    autofit(src3);
    imgLarge.src = src3;
            //const curPage1 = document.querySelector('#curPage');
    curPage.textContent = prevPage; 
    let vgroupIm=document.querySelectorAll('.small');
    let vga = document.querySelectorAll('.asmall');
    let vgroup=document.querySelector('.vgroup');
    let vgroupH = parseInt(window.getComputedStyle(vgroup, null).getPropertyValue("height"));
    //vgroup.scrollTop = k1*vgroupH*(prevPage-startPage -1);
    for(let i = 0;i < vgroupIm.length;i++) {
                //     alert();
                     vgroupIm[i].style = `border: none;`;
                     //vgroupIm[i].style.transform = `translateY(-115px)`;
                 }
    vgroupIm[prevPage - startPage-1].style = `border: 0.2vw solid red;`; 
    vgroupIm[prevPage - startPage-1].scrollIntoView({block: "center", behavior: "smooth"}); 
        }
    );    

secDiap.addEventListener(`change`, function(evt){
    //alert(evt.target.value);
    //createDiaps(totpages);
    divCont.style = `display: block;`;
    startPage = (evt.target.value - 1)*diapStep;
    finPage = startPage + diapStep; 
    if (finPage >= arrayFiles.length) {
        finPage = arrayFiles.length;
    }
    let vgroup=document.querySelector('.vgroup');
                //vgroup.removeChild();
    while (vgroup.firstChild) {
                    vgroup.removeChild(vgroup.firstChild);
                }
    for (let i=startPage; i< finPage;i++){

              if (i >= arrayFiles.length) {
                  break
                  }
                    //alert(arrayFiles[i]);
                    imgdiv(arrayFiles[i],finPage,i - startPage, i+1);
       }
       LoadFirstImg(startPage); 
       bDiapLoaded = false;
})   
 //===================================Конец Основного файла================   
//=====================================Из Шаблона================================================

    document.addEventListener('mousemove', function (moveEvt) {
                moveEvt.preventDefault();
                move = {
                    x: moveEvt.clientX - (leftScene + (ContW - jpgWidth)/2),
                    y: moveEvt.clientY - (topScene + (ContH - jpgHeight)/2)
                };
                // document.querySelector('#x').textContent = 'MoveX : '+ move.x;
                // document.querySelector('#y').textContent = 'MoveY : '+ move.y;
                });    

    setup.addEventListener('mousedown', function (evt)
        {
           evt.preventDefault();
           if(evt.which == 3 ){
                //alert('Вы кликнули правой клавишей');
                degrot +=90;
                if (degrot >=360) degrot = 0;
                //setup.style.transformOrigin = '460px 300px';
                ipos.x = 0;
                ipos.y = 0;
                //scale = 1;
                setTransform(ipos.x,ipos.y,scale,degrot);
           };
           var startCoords = {
               x: evt.clientX,
               y: evt.clientY
           };
           var onMouseMove = function (moveEvt) {
                moveEvt.preventDefault();
                xDelta = startCoords.x - moveEvt.clientX;
                yDelta = startCoords.y - moveEvt.clientY;
                shift = {
                    x: -xDelta,
                    y: -yDelta
                };
                startCoords = {
                    x: moveEvt.clientX,
                    y: moveEvt.clientY
                };
                ipos.x += shift.x;
                ipos.y += shift.y;
                diffW = ContW - jpgWidth*scale;
                diffH = ContH - jpgHeight*scale;
        switch (degrot){
                    case 0:
                        diffW = diffW;
                        diffH = diffH;
                        if (diffH > 0) {
                            topLimit = diffH/2;
                            bottomLimit = -diffH/2; 
                        }
                        else 
                        {
                            topLimit = -diffH/2;
                            bottomLimit = diffH/2;
                        };
                        if (diffW < 0) {
                            leftLimit = -diffW/2;
                            rightLimit = diffW/2;
                        }
                        else {
                            leftLimit = diffW/2;
                            rightLimit = -diffW/2;
                        }
                    break;

                    case 90:
                        //diffH = diffW - leftScene;
                        diffH = (ContH - jpgWidth*scale)/2;
                        diffW = (ContW - jpgHeight*scale)/2;
                        if (diffW > 0) {
                            leftLimit = diffW;
                            rightLimit = -diffW;
                        }
                        else 
                        {
                            leftLimit = -diffW;
                            rightLimit = diffW;
                        };

                        if (diffH < 0) {
                            topLimit = -diffH;
                            bottomLimit = diffH;
                        }
                        else {
                            topLimit = diffH;
                            bottomLimit = -diffH;
                        }
                        break;
                    case 180:
                        diffW = diffW;
                        diffH = diffH;
                        if (diffH > 0) {
                            topLimit = diffH/2;
                            bottomLimit = -diffH/2; 
                        }
                        else 
                        {
                            topLimit = -diffH/2;
                            bottomLimit = diffH/2;
                        };
                        if (diffW < 0) {
                            leftLimit = -diffW/2;
                            rightLimit = diffW/2;
                        }
                        else {
                            leftLimit = diffW/2;
                            rightLimit = -diffW/2;
                        }
                        break; 
                    case 270:
                        //diffH = diffW - leftScene;
                        diffH = (ContH - jpgWidth*scale)/2;
                        diffW = (ContW - jpgHeight*scale)/2;
                        if (diffW > 0) {
                            leftLimit = diffW;
                            rightLimit = -diffW;
                        }
                        else 
                        {
                            leftLimit = -diffW;
                            rightLimit = diffW;
                        };
                        if (diffH < 0) {
                            topLimit = -diffH;
                            bottomLimit = diffH;
                        }
                        else {
                            topLimit = diffH;
                            bottomLimit = -diffH;
                        }
                    break;
                }                       
                    // let z=ipos.x;
                    if (ipos.x >= leftLimit )                                   
                         ipos.x = leftLimit;
                    if (ipos.x  <  rightLimit) 
                         ipos.x = rightLimit;
                    if (ipos.y >= topLimit )                                   
                        ipos.y = topLimit;
                    if (ipos.y < bottomLimit) 
                        ipos.y = bottomLimit;
                // document.querySelector('#x').textContent = 'clientX : '+ moveEvt.clientX;
                // document.querySelector('#y').textContent = 'clientY : '+ moveEvt.clientY;
                // document.querySelector('#xx').textContent = 'ipos.x  : '+ ipos.x ;
                // document.querySelector('#yy').textContent = 'ipos.y : '+ ipos.y;
                //setup.style.transform = "translate(" + ipos.x + "px, " + ipos.y + "px)";
                setTransform(ipos.x,ipos.y,scale,degrot);
           };

           var onMouseUp = function (upEvt) {
               upEvt.preventDefault();
               //alert('ok');
               document.removeEventListener('mousemove', onMouseMove);
               document.removeEventListener('mouseup', onMouseUp);
           }
           document.addEventListener('mousemove', onMouseMove);
           document.addEventListener('mouseup', onMouseUp);
        }); 
        
setup.addEventListener('wheel', function (evt) {
    evt.preventDefault();
    let delta = evt["deltaY"];
    //alert(delta);
    delta = (delta < 0 ? 1 : delta ? -1 : 0) * 0.5;
    //alert(delta);
    if(delta < 0){
        if (scale > 0.9 ) {
        scale = scale/1.25;
        zoomOut(move.x,move.y,0.8);
        }
     }
    else{
        if (scale <=40 && scale >= 0.79/1.25) {
        scale = scale*1.25;
        scaleAtPoint(move.x,move.y,1.25);
    }
}
    setTransform(ipos.x,ipos.y,scale,degrot);
   // document.querySelector('#scale').textContent = 'scale : '+ scale;
})

let setTransform = (x,y,sc,rot) => {
    setup.style.transform = "translate(" + x + "px, " + y + "px) scale(" + sc + ") rotate(" + rot + "deg)";
}

let scaleAtPoint = (x,y,sc) => {
    let ax;
    let by;
    //alert(jpgHeight +'---'+jpgWidth);
    ax = x - jpgWidth/2;
    by = y - jpgHeight/2;
    ipos.x = ax - (ax - ipos.x) * sc;
    ipos.y = by - (by - ipos.y) * sc; 
    ipos.xRight = ipos.x;
    ipos.yRight = ipos.y;
    if (scale <= 1) {
        ipos.x = 0;
        ipos.y = 0;}
}     

let zoomOut = (x,y,sc) => {
    let ax;
    let by;
    ax = x - jpgWidth/2;
    by = y - jpgHeight/2;
    ipos.x = ax - (ax - ipos.x) * sc;
    ipos.y = by - (by - ipos.y) * sc;
    if (scale <= 1) {
        ipos.x = 0;
        ipos.y = 0;}
}
let btnZoomIn = document.querySelector('.zoom-in');
    btnZoomIn.addEventListener('click', function (evt) {
    evt.preventDefault();
    if (scale <=40 && scale >= 0.79/1.25) {
        scale = scale*1.25;
        //scaleAtPoint(move.x,move.y,1.25);
    }
    setTransform(ipos.x,ipos.y,scale,degrot);
        }
    );
let btnZoomOut = document.querySelector('.zoom-out');
    btnZoomOut.addEventListener('click', function (evt) {
    evt.preventDefault();
    if (scale > 0.9 ) {
        scale = scale/1.25;
       // zoomOut(move.x,move.y,0.8);
    }
    setTransform(ipos.x,ipos.y,scale,degrot);
        }
    );    

let btnAutoFit = document.querySelector('.autofit');
    btnAutoFit.addEventListener('click', function (evt) {
    evt.preventDefault();
    const curPage = document.querySelector('#curPage');
    let currentPage = curPage.textContent;
    let numFile = parseInt(currentPage);
    let filePath1 = rootFolder + arrayFiles[numFile-1];
    //scale = 1;
    autofit(filePath1);
        }
    );   

let autofit = (fileName) => {
    let img = new Image();     
    img.src = fileName;
    img.onload = function() {
    //autofit();
    fileWidth = img.width;
    fileHeight = img.height;
    let aspect =fileWidth/fileHeight;
        //alert(fileHeight);
        if (fileWidth/ContW > fileHeight/ContH) {
          setup.style.width = ContW + 'px';
          setup.style.height = ContW/aspect + 'px';	  
        } 
        else {
          setup.style.height = ContH + 'px'; 
          setup.style.width = ContH*aspect + 'px'; 
        }
    ipos.x = 0;
    ipos.y = 0;
    scale = 1;
    degrot = 0; 
    //setup.setAttribute('src',fileName); 
    jpgWidth = setup.width;
    //jpgWidth = 700;
    jpgHeight = setup.height;
    //alert(jpgHeight +'---'+jpgWidth);
    setup.style.transformOrigin = jpgWidth/2 + 'px ' + jpgHeight/2 + 'px';
    //alert(jpgHeight +'---'+jpgWidth); 
    setTransform(ipos.x,ipos.y,scale,degrot);
}   
 }   

 let btnRotate = document.querySelector(`.rotate`);

 btnRotate.addEventListener('click', function (evt) {
    evt.preventDefault();
    degrot +=90;
    if (degrot > 270) degrot = 0;
                //setup.style.transformOrigin = '460px 300px';
        ipos.x = 0;
        ipos.y = 0;
                //scale = 1;
        setTransform(ipos.x,ipos.y,scale,degrot);   
        }
    );  
 
document.oncontextmenu = function (){return false};

//=======================================Конец шаблона===========================================
      