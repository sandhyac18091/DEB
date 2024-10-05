try{
    //code that might trow an error
    let result=riskyOperation();
    console.log(result);
}
catch(error){
    //code to handle the error
    console.log('An error occured:'+error.message);
}
finally{
    //code that runs regardless of an error
    console.log('This will always run!')
}
function riskyOperation(){
    let obj;
    obj.property; //this will throw an error
}