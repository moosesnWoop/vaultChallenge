'reach 0.1';

const TIMER = 20;

const commonInteract = {
  showTime : Fun([UInt], Null)
};
const aliceInteract = {
  ...commonInteract,
  amt: UInt, 
  getChoice: Fun([], Bool) 
};
const bobInteract = {
  ...commonInteract,
  acceptTerms: Fun([UInt], Bool)
};


export const main = Reach.App(() => {
  const A = Participant('Alice', aliceInteract);
  const B = Participant('Bob', bobInteract);
  init();
  // The first one to publish deploys the contract
  A.only(() => {const deployAmt = declassify(interact.amt)});
  A.publish(deployAmt).pay(deployAmt); //publish and pay the amt
  commit();
  // The second one to publish always attaches
  B.only(() => {const terms = declassify(interact.acceptTerms(deployAmt))});
  B.publish(terms);
  commit();
  // write your program here
  each([A,B], () =>{
      interact.showTime(TIMER);
  });

  A.only(() => {const checkAlice = declassify(interact.getChoice())});//we have to get the choice of Alice this is post showTimer counter
  A.publish(checkAlice);

  if(checkAlice){ //this automatically checks.
    transfer(deployAmt).to(A); //if true, sent the deployAmt to Alice
  }else{
    transfer(deployAmt).to(B); // if false, send to bob - i.e. if no response
  }

  commit();

  exit();
});
