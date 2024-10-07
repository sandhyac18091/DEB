let expense=[];
let category=[];

//Retrieves the DOM elements by their id
function addExpense(){
    let descriptionInput=document.getElementById('description');
    let expenseInput=document.getElementById('expense');
    let amountInput=document.getElementById('amount');
    let categoryInput=document.getElementById('category')

    //trim
    let description=descriptionInput.value.trim();
    let expense=Number(expenseInput.value.trim());
    let category=Number(categoryInput.value.trim());

    //if condition
    if (description !== '' && !isNaN(amount) && amount > 0 && !isNaN(category) && category >= 1 && category <= 3) {
        expense.push(expense);
        category.push(category);
        let track=document.createElement('li')
        track.textContent=`${description} - $${amount}`;
        
        //switch case
        switch (category) {
            case 1:
                track.classList.add(category-food);
                break;
            case 1:
                track.classList.add(category-Transport);
                break;
        
            case 1:
                track.classList.add(category-Entertainment);
                break;
        }
    }

}
