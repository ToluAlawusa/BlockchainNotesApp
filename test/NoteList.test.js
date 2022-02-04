const NoteList = artifacts.require("./NoteList.sol");

contract('NoteList', (accounts) => {
    before(async () => {
        this.noteList = await NoteList.deployed()
    })

    it('deploys successfully', async () => {
        const address = await this.noteList.address
        assert.notEqual(address, 0x0)
        assert.notEqual(address, '')
        assert.notEqual(address, null)
        assert.notEqual(address, undefined)
    })

    it('lists tasks', async () => {
        const taskCount = await this.noteList.taskCount()
        const task = await this.noteList.tasks(taskCount)
        assert.equal(task.id.toNumber(), taskCount.toNumber())
        assert.equal(task.content, 'Check out google.com')
        assert.equal(task.completed, false)
        assert.equal(taskCount.toNumber(), 1)
    })

    it('creates tasks', async () => {
        const result = await this.noteList.createTask('A new task')
        const taskCount = await this.noteList.taskCount()
        assert.equal(taskCount, 2)
        const event = result.logs[0].args
        assert.equal(event.id.toNumber(), 2)
        assert.equal(event.content, 'A new task')
        assert.equal(event.completed, false)
    })

    it('toggles task completion', async () => {
        const result = await this.noteList.toggleCompleted(1)
        const task = await this.noteList.tasks(1)
        assert.equal(task.completed, true)
        const event = result.logs[0].args
        assert.equal(event.id.toNumber(), 1)
        assert.equal(event.completed, true)
    })
})