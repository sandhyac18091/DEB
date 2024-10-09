const readline=require('readline'); //import readline module
const rl=readline.createInterface({
    input:process.stdin,
    output:process.stdout
});

function asKName(){
    rl.question("What is your name?",function(name){
        console.log(`Hello, ${name}!`);
        asKFavoriteLanguage();
    });
}
function asKFavoriteLanguage(){
    rl.question("what is your favorite programming language?",function(language){
        console.log(`${
            language} is a great choice`);
        rl.close();
    });

}
//start prompt
console.log('Welcome to simple interface using readline!');
asKName();