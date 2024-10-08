let expense = [];
let categories = [];

function addExpense() {

    let descInput = document.getElementById('decription');
    let expAmntInp = document.getElementById('amount');
    let catgryInp = document.getElementById('category');
    let expnslist = document.getElementById('expenselist');

    let description = descInput.value.trim();
    let amount = Number(expAmntInp.value.trim());
    let category = Number(catgryInp.value.trim()) ;

    if (description != '' && amount != NaN && category >= 1 && category <= 3) {

        let expense = description + '-' + amount;
        expense.push(expense);
        categories.push(category);

        let li = document.createElement('li');
        li.textContent = expense;

        switch (category) {

            case 1:
                li.classList.add('expns-food');
                break;
            case 2:
                li.classList.add('expns-transport');
                break;
            case 3:
                li.classList.add('expns-entertainment');
                break;
        }
        expnslist.appendChild(li);

        const compltButton = document.createElement('button');
        compltButton.textContent = 'Complete';
        compltButton.onclick = function(){
            li.classList.toggle('completed')
        }
        li.appendChild(compltButton)

        const editButton = document.createElement('button');
        editButton.textContent = 'Edit';
        editButton.onclick = function(){

            let newdscrptn = prompt('Edit the description',description)
            let expnsIndex = expense.indexOf(description);
            expense[expnsIndex] = newdscrptn;
            li.firstChild.textContent = newdscrptn;
            description = newdscrptn;
        }
        li.appendChild(editButton)

        const removeButton = document.createElement('button');
        removeButton.textContent = 'Remove';
        removeButton.onclick = function(){

            expnslist.removeChild(li);
            let expnsIndex = expense.indexOf(expense);
            expense.splice(expnsIndex,1);
            priorities.splice(expnsIndex,1);

        }
        li.appendChild(removeButton)
    }
}