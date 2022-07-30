import {loadStdlib} from '@reach-sh/stdlib';
import * as backend from './build/index.main.mjs';

const stdlib = loadStdlib(process.env);
console.log(`The consensus network is ${stdlib.connector}`);

const  accBob =  await stdlib.newTestAccount(stdlib.parseCurrency(100)); //General attacher
const accAlice = await stdlib.newTestAccount(stdlib.parseCurrency(10000)); //Deployer has 10k 

const getBal = async (who) => stdlib.formatCurrency(await stdlib.balanceOf(who)); // this is how we can get the balance of each account

console.log('Hello, Alice and Bob!');
console.log(`Alice's balance is ${await getBal(accAlice)}`);
console.log(`Bob's balance is ${await getBal(accBob)}`);

console.log('Launching...');
const ctcAlice = accAlice.contract(backend);
const ctcBob = accBob.contract(backend, ctcAlice.getInfo());


const choiceArray = ["I'm not here, take my money", "I'm still here, you're not taking my money"];

const commonInteract = () => ({
  showTime: (t) => { 
    //parseInt

    console.log(parseInt(t)) }
});

console.log('Starting backends...');
await Promise.all([
  backend.Alice(ctcAlice, {
    ...stdlib.hasRandom,
    ...commonInteract(),
    amt: stdlib.parseCurrency(5000), //we set the amt to be deployer, at a later stage change this to ask.ask
    getChoice: () => {
    const choice = Math.floor(Math.random() * 2); //this is how we get a 'random' choice between one and zero, using floor to keep numbers whole. 
    console.log(`Alice's choice is ${choiceArray[choice]}`); //we have an array of answers for either 1 or 0 - then we bring in the result of choice within the array.
    return (choice == 0 ? false : true);
    }
  }),
  backend.Bob(ctcBob, 
    {
    ...stdlib.hasRandom,
    ...commonInteract(),
    acceptTerms: (num) => {
      console.log(`Bob accepts the terms of the vault for ${stdlib.formatCurrency(num)}`);
      return true;      
    }
    
  }),
]);

console.log(`Alice's balance is ${await getBal(accAlice)}`);
console.log(`Bob's balance is ${await getBal(accBob)}`);
console.log("Goodbye, Alice and Bob!");
