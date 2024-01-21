
/**
 * Add Transaction
 * check transaction type
 * store transaction to local storage base in her type
 */


// Enum fro transaction Type
const TransactionType = {
    INCOME: "income",
    EXPENSE:"expense"
}



// Selectors
const form = document.querySelector("form")
const incomeExpenseError = document.querySelector(".income-expense-error")
const sourceInputError = document.querySelector(".source-input-error")
const amountInputError = document.querySelector(".amount-input-error")
const incomeExpenseRadioBtn = document.querySelectorAll('input[type="radio"')
const radioButtons = document.querySelectorAll('input[name="income-expense"]')
const sourceInput = document.getElementById("source")
const amountInput = document.getElementById("amount")
const addBtn = document.getElementById("addBtn")
const incomesTotalStatistics = document.getElementById("incomes-total")
const expenseTotalStatistics = document.getElementById("expenses-total")
const balanceStatistics = document.getElementById("balance")
const incomeSectionContent =document.querySelector(".income-section-content")
const expenseSectionContent = document.querySelector(".expense-section-content")






let incomes = (getData(TransactionType.INCOME))? getData(TransactionType.INCOME):[]
let expenses=(getData(TransactionType.EXPENSE))? getData(TransactionType.EXPENSE):[]


// Event listener for radio button change
radioButtons.forEach(element => 
    {
        element.addEventListener("change",checkTransaction
           
        )
    }
    
);

// Event listener for the "Add" button
addBtn.addEventListener("click", () => {
    checkAmount()
    checkSource()
    checkTransaction()
    addTransaction()
    
    })

renderTransactionHistory()



function formatFullDate() {
    let date = new Date()
    let year = date.getFullYear();
    let month = date.getMonth()+1;
    let day =date.getDate()
    let hours = date.getHours()
    let minutes = date.getMinutes()
    let secondes = date.getSeconds()
    
    let ampm = (hours < 12) ? "AM" : "PM"
    
    let fullDate= hours+":"+minutes+":"+secondes+" "+ampm+" "+month+"/"+day+"/"+year
    return fullDate;
}


// Model

function createTransaction(source, amount) {
    
    let id = Date.now()
    let currentTime= formatFullDate()
    let transaction = {
        id: id,
        source: source,
        amount: amount,
        create_time:currentTime

    }

    return transaction;

}



function getData(transactionType) {
    
    const data = localStorage.getItem(transactionType)
    return data ?JSON.parse(data):[]

}



function saveTransaction(transactionType, transaction) {
    let transactionStr = JSON.stringify(transaction)
    localStorage.setItem(transactionType, transactionStr);


    
}






// Controller
function addTransaction() {

    const transactionType = getTransactionType()
        
            if (sourceInput.value !== "" && amountInput.value !=="" && transactionType!==undefined) {
                
                const transaction = createTransaction(sourceInput.value, amountInput.value)

                if (transactionType === TransactionType.INCOME) {
                    incomes.push(transaction);
                    saveTransaction(transactionType, incomes)
                } else {
                    expenses.push(transaction)
                    saveTransaction(transactionType, expenses)
                }
                emptyInput()
                renderTransactionHistory()
            }

}







function checkSource() {


    displayError(sourceInput,sourceInputError)

    sourceInput.addEventListener("change", () => {
        
        displayError(sourceInput,sourceInputError)

    })
}

function displayError(input,inputErrorMessage) {
    let errorIcon = input.nextElementSibling
        let inputArea = input.parentElement
    if (input.value === "") {
        inputErrorMessage.classList.remove("error")
        errorIcon.classList.remove("error")
        inputArea.classList.add("input-area-error")
    } else {
        inputErrorMessage.classList.add("error")
        errorIcon.classList.add("error")
        inputArea.classList.remove("input-area-error")
    }

}

function checkAmount() {


    displayError(amountInput,amountInputError)
   
    amountInput.addEventListener("change", () => {
       
        displayError(amountInput,amountInputError)
    })
}

function checkTransaction() {
    
    let trType = getTransactionType()

    console.log( incomeExpenseError.classList)
    if (!trType) {
        incomeExpenseError.classList.remove("error")
    } else {
        incomeExpenseError.classList.add("error")
    }
}








function emptyInput() {
    
    sourceInput.value = ""
    amountInput.value = ""

    radioButtons.forEach((radio) => {
        radio.checked =false
    })
    
}



function getTransactionType() {

    let selectTransactionType;
    for (let radio of radioButtons) {
        if (radio.checked) {
         selectTransactionType = radio.value
            
        }
       
    }
    return selectTransactionType;





   
}



function getTotalIncomes() {
    let incomesTotal = incomes.reduce((total, income) => {
        return total+ Number(income.amount)
    },0)
    return incomesTotal;
}


function getExpensesTotal() {
   let expensesTotal = expenses.reduce((total, income) => {
        return total + Number(income.amount);
    },0)
    return expensesTotal;
}

function calcBalance() {

    let balance = getTotalIncomes() - getExpensesTotal(); 
        return balance;
    

}






function updateStatistic() {
    incomesTotalStatistics.innerText = "Incomes: " + getTotalIncomes() + " TND"
    expenseTotalStatistics.innerText = "Expenses: " + getExpensesTotal() + " TND"
    balanceStatistics.innerText = "Balance: " + calcBalance() + " TND";
}



// View
function renderTransactionHistory() {
    incomeSectionContent.innerHTML = ""
    expenseSectionContent.innerHTML=""
    incomes.forEach((income) => {
        incomeSectionContent.innerHTML+= createTransactionComponent(income,"income")
    })
    const incomesDeleteButtons = document.querySelectorAll('.del-btn-income');
    incomesDeleteButtons.forEach((delBtn) => {
        delBtn.addEventListener("click", () => {
            removeIncomeTransaction(delBtn.parentElement.parentElement.id)
            updateStatistic()
            renderTransactionHistory()
        })
    
    })

    expenses.forEach((expense) => {
        
        expenseSectionContent.innerHTML += createTransactionComponent(expense,"expense")
            
        
    })
    const expensesDeleteButtons = document.querySelectorAll(".del-btn-expense")

    expensesDeleteButtons.forEach((del) => {

        del.addEventListener("click", (event) => {
            removeExpenseTransaction(del.parentElement.parentElement.id)
            updateStatistic()
            renderTransactionHistory()
        })
       
    }, false)
    
    updateStatistic()
}


function createTransactionComponent(transaction,transactionType) {

    let component = `
    <div id=${transaction.id} class="transaction-component ${transactionType}-trans">
    <div class="transaction-component-left">
      <p class="transaction-source">${transaction.source}</p>
      <p class="transaction-date">${transaction.create_time}</p>
    </div>
    <div class="transaction-component-right">
      <p class="transaction-amount">${transaction.amount} TND</p>
      <button id="del-btn" type="button" class= del-btn-${transactionType}> <i class="fa-solid fa-trash-can"></i></button>
    </div>
    </div >
`
    return component;
    
}






















function removeExpenseTransaction(transactionId) {
    
    expenses= expenses.filter((expense) => expense.id != transactionId)
    saveTransaction("expense", expenses)
    

}


function removeIncomeTransaction(transactionId) {
    
     incomes = incomes.filter((income) => income.id != transactionId)
    saveTransaction("income",incomes)

}



