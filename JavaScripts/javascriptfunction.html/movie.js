let movies=[];
let prio=[];

function addMovie(){
    let moviedatas=document.getElementById('input1');
    let prioritiesdata=document.getElementById('input2');
    let movielistdata=document.getElementById('movielist');

    let moviedata=moviedatas.value.trim();
    let prioritiesdatavalue=Number(prioritiesdata.value.trim());

    if(moviedata !== '' && !isNaN(prioritiesdatavalue) && prioritiesdatavalue>=1 && prioritiesdatavalue<=3){
        movies.push(moviedata);
        prio.push(prioritiesdatavalue);

        let li=document.createElement('li');
        li.textContent=moviedata;
        movielistdata.appendChild(li);

        switch(prioritiesdatavalue){
            case 1:
                li.classList.add('priority-high');
                break;
            case 2:
                li.classList.add('priority-medium');
                break;
            case 3:
                li.classList.add('priority-low');
                break;
        }


        let watchedbtn=document.createElement('button');
        watchedbtn.textContent='Watched';
        watchedbtn.onclick=function(){
            li.classList.toggle('watched')
        }
        li.appendChild(watchedbtn);


        let editbtn=document.createElement('button');
        editbtn.textContent='Edit movie';
        editbtn.onclick=function(){
            let editmovie=prompt('Edit the Movie');
            if(editmovie!==null && editmovie.trim()!==''){
                let editmovieInp=movies.indexOf(moviedata);
                movies[editmovieInp]=editmovie;
                li.firstChild.textContent = editmovie;
                moviedata=editmovie;
            }
        }
        li.appendChild(editbtn);

        let removebtn=document.createElement('button');
        removebtn.textContent='Remove movie';
        removebtn.onclick=function(){
            movielistdata.removeChild(li);
            let editmovieInp=movies.indexOf(moviedatas);
            movies.splice(editmovieInp,1);
            prio.splice(editmovieInp,1);
        }
        li.appendChild(removebtn);
        movielistdata.appendChild(li);
        moviedatas.value ='';
        prioritiesdata.value = '';
    } else {
        alert('Please enter a valid task and priority between 1 and 3');
    }

}
