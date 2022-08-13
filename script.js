const transactionsHistory = []
let balance = 0
let currentTransaction;

const showBalance = document.querySelector('.balance h1')
showBalance.innerHTML = formatCurrency(balance)

const transactionsContainer = document.querySelector('.transactions .container')

const modal = document.querySelector('.modal')
let transactionTypeModal = document.querySelector('.transaction-type')

let transactionValueModal = document.querySelector('#transaction-value') 
let transactionDescriptionModal = document.querySelector('#transaction-description')  

const reportModal = document.querySelector('.report-modal')
let reportMessage = document.querySelector('.report-message')

const deposit = document.querySelector('.deposit').addEventListener('click', () => {
  modalFunctions()
  currentTransaction = 'deposit'
  transactionTypeModal.innerHTML = 'Digite o valor do depósito:'
})
  
const pay = document.querySelector('.pay').addEventListener('click', () => {
  modalFunctions()
  currentTransaction = 'pay'
  transactionTypeModal.innerHTML = 'Digite o valor que irá sair:'
})

function modalFunctions() {
  modal.style.display = "flex"
  transactionValueModal.select()
  hasNegativeNumber()
  clearInputFields()
  hasWarningMessages()
}

const report = document.querySelector('.report').addEventListener('click', () => {
  reportModal.style.display = 'flex'
  inboundAndOutboundReport()
})

const closeModals = document.querySelectorAll('.close-modal')
closeModals.forEach(modal => {
  modal.addEventListener('click', () => {
    modal.parentElement.style.display = 'none'
  })
})

modal.addEventListener('click', (e) => {
  if(e.target.className == "modal") {
    modal.style.display = "none"
  }
})

const confirmTransaction = document.querySelector('.confirm-transaction').addEventListener('click', (e) => {
  e.preventDefault()

  let transactionValue = transactionValueModal.value 
  let transactionDescription = transactionDescriptionModal.value  

  if (transactionValue < 0) {
    document.querySelector('.negative-values').style.display = 'block'
  } else {

    if(currentTransaction == 'deposit') {
      transactionValue = transactionValue
    } else {
      transactionValue = -transactionValue
    }
  
    if(transactionValue !== "" & transactionDescription !== "") {
      
      getDate()
      
      transactionsHistory.unshift({
        transactionType: currentTransaction,
        transactionValue: Number(transactionValue),
        transactionDescription: transactionDescription,
        transactionDate: formatDate
      })
  
      setItemsStorage(transactionsHistory)
     
    
      clearInputFields()
      updateTransactionsHistory()
    
      modal.style.display = "none"
  
    } else {
      document.querySelector('.empty-fields').style.display = 'block'
    }

  }

})

function updateTransactionsHistory() { 
  transactionsContainer.innerHTML = ""
  let html, transactionSignal, transactionClassColor

  getItemsStorage().forEach(transaction => {  

  if(transaction.transactionType == 'deposit') {
    transactionSignal = '+'
    transactionClassColor = 'green'
  } else {
    transactionSignal = '-'
    transactionClassColor = 'red'
  }

  html = `
    <div class="transaction">
      <div class="description">
        <p>${transaction.transactionDescription}</p>
      </div>
      <div class="infos">
        <p class="${transactionClassColor}">${transactionSignal} 
        ${formatCurrency(Math.abs(transaction.transactionValue))}
        </p>
        <p>${transaction.transactionDate}</p>
      </div>
    </div>
  `

    transactionsContainer.innerHTML += html
  })

  updateBalance()
}

function getDate() {
  const date = new Date()
  const day = date.getDate().toString().padStart(2, '0')
  const month = (date.getMonth() + 1).toString().padStart(2, '0')
  const year = date.getFullYear().toString().padStart(4, '0')

  return formatDate = `${day}/${month}/${year}`
}

function formatCurrency(value) {
  return `${value.toLocaleString('pt-BR', { 
    style: 'currency', 
    currency: 'BRL' 
    })
  }`
}

function updateBalance() {
  balance = 0;

  transactionsHistory.map(transaction => {
    balance += transaction.transactionValue
    showBalance.innerHTML = formatCurrency(balance)
  })
  
  if(balance < 0) {
    showBalance.style.color = '#BB3333'
  } else {
    showBalance.style.color = '#FFF'
  }
}

function hasNegativeNumber() {
  transactionValueModal.addEventListener('change', () => {
    if (transactionValueModal.value >= 0) {
      document.querySelector('.negative-values').style.display = 'none'
    }
  })
}

function clearInputFields() {
  transactionValueModal.value = ""
  transactionDescriptionModal.value = ""
}

function hasWarningMessages() {
  document.querySelector('.empty-fields').style.display = 'none'
  document.querySelector('.negative-values').style.display = 'none'
}

function inboundAndOutboundReport() {
  let reportBalance = 0
  let inbound = 0
  let outbound = 0

  transactionsHistory.map(transaction => {
    if(transaction.transactionType == 'deposit') {
      inbound += transaction.transactionValue
    } else {
      outbound += transaction.transactionValue
    }
  })

  reportBalance = inbound - Math.abs(outbound)
  console.log(reportBalance)

  document.querySelector('.inbound').innerHTML = formatCurrency(inbound)
  document.querySelector('.outbound').innerHTML = formatCurrency(Math.abs(outbound))
  document.querySelector('.report-balance').innerHTML = formatCurrency(reportBalance)

  if(reportBalance >= 0) {
    reportMessage.innerHTML = "Parabéns! Você gasta menos do que recebe."
    reportMessage.style.color = "#00ff7f"
  } else {
    reportMessage.innerHTML = "Cuidado! Você está gastando mais do que recebe."
    reportMessage.style.color = "#BB3333"
  }
  
}

function setItemsStorage(object) {
  localStorage.setItem('transactions', JSON.stringify(object))
}

function getItemsStorage () {
  const storage = localStorage.getItem('transactions')
  const transactionsJSON = JSON.parse(storage) || []

  return transactionsJSON
}

function initApp() {
  getItemsStorage().map(transaction => {
    transactionsHistory.push(transaction)
  })
  
  updateTransactionsHistory()
}

initApp()






