const inputSlider=document.querySelector(".slider");
const lengthDisplay=document.querySelector(".plength");
const passwordDisplay=document.querySelector(".display");
const copyMessage=document.querySelector(".copyMsg");
const uppercaseCheck=document.querySelector("#uppercase");
const lowercaseCheck=document.querySelector("#lowercase");
const numberCheck=document.querySelector("#numbers");
const symbolCheck=document.querySelector("#symbols");
const allCheckbox=document.querySelectorAll('input[type=checkbox]');
const indicate=document.querySelector(".indicator");
const generateBtn=document.querySelector(".gen-button");
const cpMesg=document.querySelector(".cpMsg");
const symbols="!@#{[~]}$%?><;:^&*()";
let password="";
let passwordLength=10;
let checkCount=0;

handleSlider();
  function handleSlider(){
    inputSlider.value=passwordLength;
    lengthDisplay.innerText=passwordLength;
  }

  function setIndicator(color){
    indicate.style.backgroundColor=color;
    //shadow
  }

  function getRandomInteger(min,max){
    return Math.floor(Math.random()*(max-min))+min;
  }

  function genrateRandomNumber(){
    return getRandomInteger(0,9);
  }
  function generateUppercase(){
    return String.fromCharCode(getRandomInteger(65,91));
  }
  function generateLowercase(){
    return String.fromCharCode(getRandomInteger(97,123));
  }

  function generateSymbol(){
    const randNum=getRandomInteger(0,symbols.length);
    return symbols.charAt(randNum);
  }

  function calcStrength(){
    //according to us
    let hasUpper=false;
    let hasLower=false;
    let hasNum=false;
    let hasSym=false;

    if(uppercaseCheck.checked)
    hasUpper=true;

    if(lowercaseCheck.checked)
    hasLower=true;
   
    if(numberCheck.checked)
    hasNum=true;

    if(symbolCheck.checked)
    hasSym=true;

    if(hasUpper && hasLower && (hasNum || hasSym) && passwordLength>=8){
      setIndicator("#0f0");
    }
    else if((hasLower || hasUpper) && (hasNum || hasSym) && passwordLength>=6){
      setIndicator("#ff0");
    }
    else{
      setIndicator("#f00");
    }
  }

  async function copyContent(){
  try {
    await navigator.clipboard.writeText(passwordDisplay.value);
    cpMesg.innerText="copied";
  }
  catch(e){
    cpMesg.innerText="Failed";
  }
  cpMesg.style.display="flex";

  setTimeout(() =>{
    cpMesg.style.display="none";
  }, 2000);
  }

  function shufflePassword(array){
    //fisher yatch method
    for(let i=array.length-1;i>0;i--){
      const j=Math.floor(Math.random()*(i+1));
      const temp=array[i];
      array[i]=array[j];
      array[j]=temp;
    }
    str= "";
    array.forEach((el)=>(str+=el));
    return str;
  }

  function handleCheckBoxChange(){
    checkCount=0;
    allCheckbox.forEach((Checkbox)=>{
    if(Checkbox.checked){
      checkCount++;
    }
  });
  //special case
  if(passwordLength<checkCount){
    passwordLength=checkCount;
    handleSlider();
  }
}

allCheckbox.forEach((Checkbox)=> {
  Checkbox.addEventListener('change',handleCheckBoxChange);
})

  inputSlider.addEventListener('input',(e)=>{
      passwordLength=e.target.value;
      handleSlider();
  })

  copyMessage.addEventListener('click',()=>{
    if(passwordDisplay.value)
        copyContent();
  })

generateBtn.addEventListener('click',()=> {
  if(checkCount==0){
    return;
  }
if(passwordLength<checkCount){
  passwordLength=checkCount;
  handleSlider();
}
//remove old password
password="";
let funcArr=[];
if(uppercaseCheck.checked)
   funcArr.push(generateUppercase);

if(lowercaseCheck.checked)
   funcArr.push(generateLowercase);

if(numberCheck.checked)
     funcArr.push(genrateRandomNumber);

if(symbolCheck.checked)
     funcArr.push(generateSymbol);

//compulsory addition
for(let i=0;i<funcArr.length;i++){
  password+=funcArr[i]();
}

//remaining addition
for(let i=0;i<passwordLength-funcArr.length;i++){
  let ranIndex= getRandomInteger(0,funcArr.length);
  password+=funcArr[ranIndex]();
}

//shuffle password
password=shufflePassword(Array.from(password));
//show in UI
passwordDisplay.value=password;
//calc. strength
calcStrength();
})
