App = {
    loading: false,
    contracts: {},    

    load: async () => {

        await App.loadWeb3()
        await App.loadAccount()
        await App.loadContract()
        await App.render()
        //load app
        console.log("app loading")
    },

    loadWeb3: async () => {
        if (typeof web3 !== 'undefined') {
          App.web3Provider = web3.currentProvider
          web3 = new Web3(web3.currentProvider)
        } else {
          window.alert("Please connect to Metamask.")
        }
        // Modern dapp browsers...
        if (window.ethereum) {
          window.web3 = new Web3(ethereum)
          try {
            // Request account access if needed
            await ethereum.enable()
            // Acccounts now exposed
            web3.eth.sendTransaction({/* ... */})
          } catch (error) {
            // User denied account access...
          }
        }
        // Legacy dapp browsers...
        else if (window.web3) {
          App.web3Provider = web3.currentProvider
          window.web3 = new Web3(web3.currentProvider)
          // Acccounts always exposed
          web3.eth.sendTransaction({/* ... */})
        }
        // Non-dapp browsers...
        else {
          console.log('Non-Ethereum browser detected. You should consider trying MetaMask!')
        }
    },

    loadAccount: async () => {
        App.account = web3.eth.accounts[0];
        console.log(App.account);
    },

    loadContract: async () => {
        // create a js version of the smart contract
        const noteList = await $.getJSON("NoteList.json");
        App.contracts.NoteList = TruffleContract(noteList)
        App.contracts.NoteList.setProvider(App.web3Provider)

        // getting the smart contracts with values from the blockchain
        App.noteList = await App.contracts.NoteList.deployed()
        //console.log(noteList)
    },

    render: async () => {
        //prevent repeated rendering
        if (App.loading) {
            return
        }

        // Update app loading state
        App.setLoading(true)

        // render account
        $('#account').html(App.account)

        // render tasks
        await App.renderTasks()

        // update loading state
        App.setLoading(false)

    },

    renderTasks: async () => {
        // Load the total task count from the blockchain
        const taskCount = await App.noteList.taskCount()
        const $taskTemplate = $('.taskTemplate')

        // Render out each task with a new task template
        for (var i = 1; i <= taskCount; i++) {
        // Fetch the task data from the blockchain
        const task = await App.noteList.tasks(i)
        const taskId = task[0].toNumber()
        const taskContent = task[1]
        const taskCompleted = task[2]

        // Create the html for the task
        const $newTaskTemplate = $taskTemplate.clone()
        $newTaskTemplate.find('.content').html(taskContent)
        $newTaskTemplate.find('input')
                        .prop('name', taskId)
                        .prop('checked', taskCompleted)
                        .on('click', App.toggleCompleted)

        // Put the task in the correct list
        if (taskCompleted) {
            $('#completedTaskList').append($newTaskTemplate)
        } else {
            $('#taskList').append($newTaskTemplate)
        }

        // Show the task
        $newTaskTemplate.show()
        }
    },

    

    createTask: async () => {
        App.setLoading(true)
        const content = $('#newTask').val()
        await App.noteList.createTask(content)

        window.location.reload()
    },

    toggleCompleted: async (e) => {
        App.setLoading(true)
        const taskId = e.target.name
        await App.NoteList.toggleCompleted(taskId)
        window.location.reload()
      },

    setLoading: (boolean) => {
        App.loading = boolean
        const loader = $('#loader')
        const content = $('#content')
        if (boolean) {
          loader.show()
          content.hide()
        } else {
          loader.hide()
          content.show()
        }
    }
    
}

$(() => {
    $(window).load(() => {
        App.load()
    })
})
