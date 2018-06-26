const assert = require('assert');
const ganache = require('ganache-cli');
const Web3 = require('web3');
const { interface, bytecode} = require('../compile');

const provider = ganache.provider();
const web3 = new Web3(provider);

let accounts;
let inbox;

beforeEach(async () => {
accounts = await web3.eth.getAccounts();

inbox = await new web3.eth.Contract(JSON.parse(interface))
.deploy({ data: bytecode, arguments: ['Hi there!']})
.send({ from: accounts[0], gas: '1000000'});

 inbox.setProvider(provider);

  });


describe('Inbox',() => {
  it('deploys a contract',() => {
assert.ok(inbox.options.address);
  });

  it('has a default message',async () => {
const message = await inbox.methods.message().call();
assert.equal(message, 'Hi there!');
  });

  it('has can change the message',async () => {
  await inbox.methods.setMessage('bye').send({ from: accounts[0] })
  const message = await inbox.methods.message().call();
  assert.equal(message, 'bye');
  });

});
