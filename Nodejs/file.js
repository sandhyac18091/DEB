const filesystem=require('fs');
//callback function
filesystem.readFile('example.txt','utf-8',(err,data)=>{ 
    if(err) throw err;
    console.log(data);
})