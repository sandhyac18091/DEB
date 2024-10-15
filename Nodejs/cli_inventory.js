const readline=require('readline');
const rl=readline.createInterface({
    input: process.stdin,
    output: process.stdout
});
const inventory=new Map();

function askCommand(){
    console.log('Welcome to inventory management system!');
    console.log('Availabel commands:add,remove,search,update,summary,exit');
    rl.question("\Enter a command:",function(command){
        switch(command.trim().toLocaleLowerCase()){
            case 'add':
                additemPrompt();
                break;
            case 'remove':
                removeitemPrompt();
                break;
            case 'search':
                searchitemPrompt();
                break;

            case 'update':
                updateitemPrompt();
                break;
            case 'summary':
                printSummary();
                askCommand();
                break;
            case 'exit':
                rl.close();
                break;
            default:
                    console.log("invalid command:enter a valid choice!");
                    askCommand();
                    break;
        }
    });
}
//function to add item
function additemPrompt(){
    rl.question("\Enter an item id:",function(id){
        rl.question("enter an item name:",function(name){
            rl.question("Enter item category:",function(category){
                rl.question("Enter item quantity:",function(quantity){
                    additem(id,name,category,parseInt(quantity));
                    askCommand();
                });
            });

        });
    });
}
function additem(id,name,category,quantity){
    if(inventory.has(id)){
        console.log(`Error item with id ${id} alreadyn exists`);
    }else{
        inventory.set(id,{name,category,quantity});
        console.log(`Item with id ${id} added to inventory!`)
    }
}
//function to remove item
function removeitemPrompt(){
    rl.question("Enter an id to remove",function(id){
        removeitem(id);
        askCommand();
    })
}
function removeitem(id){
    if(inventory.has(id)){
        inventory.delete(id);
        console.log(`Item with ID ${id} removed!`);
    }else{
        console.log(`Error: No item with ID ${id} found!`);
    }
}
function searchitemPrompt(){
    rl.question("Enter search term:",function(searchTerm){
        searchitems(searchTerm);
        askCommand();

    });
}
function searchitems(searchTerm){
    const result=[];
    for(const[id,item] of inventory){
        if(id.includes(searchTerm)||item.name.includes(searchTerm)||item.category.includes(searchTerm)||item.quantity.includes(searchTerm)){
            result.push({id,...item});
        }
    }
    if(result.length>0){
        console.log('search result:',result);
    }else{
        console.log('No items found!')
    }
}
function updateitemPrompt(){
    rl.question("Enter an item id: ", function(id){
        rl.question("Enter item name: ", function(newname){
            rl.question("Enter item category: ", function(newcategory){
                rl.question("Enter item quantity (or leave blank): ", function(newquantity){
                    let quantity = newquantity ? parseInt(newquantity) : undefined;
                    updateitem(id, newname, newcategory, quantity);
                    askCommand();
                });
            });
        });
    });
}

function updateitem(id,newname,newcategory,newquantity){
    if(inventory.has(id)){
        const item =inventory.get(id);
        item.name=newname || item.name;
        item.category=newcategory || item.category;
        item.quantity=newquantity !== undefined ? newquantity : item.quantity;
        inventory.set(id,item);
        console.log(`item with id ${id} updated!`);
    }else{
        console.log(`item with id ${id} not found!`);
    }
}
function printSummary(){
    if(inventory.size>0){
        console.log('inventory summary:');
        for(const [id,item]of inventory){
            console.log(`id:${id},name:${item.name},category:${item.category},quantity:${item.quantity}`);
        }
    }else{
        console.log('No items found!')
    }
}
askCommand();