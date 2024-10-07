function checkAge(age){
    if(age<18){
        throw new Error("you must be 18 years or older!")
    }else{
        console.log("You are allowed")
    }
}
try{
    checkAge(16);
}catch(erro){
    console.log('error is'+error.message);
}finally{
    console.log('This always executes!');
}