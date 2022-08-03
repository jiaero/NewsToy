const MYAPI = ""
const inputEl = document.getElementById("searchValue");
const articlesEl = document.querySelector(".articles");
const resultBoxs = document.querySelector(".resultBox");

let timerId;
let inputVal;
let saveInputVal = [];
let newsArticle = [];
let clippedArticle = [];

function hideHistory() {
    resultBoxs.classList.add("hidden");
}

function getValue(e){
    if(e.key === "Enter") {
        inputVal = inputEl.value;
        console.log(inputVal);
        fetchData(inputVal);
        saveInputVal.push(inputVal);
        console.log(saveInputVal);
        editHistory();
    }
}

function removeFirstText() {
    if (saveInputVal.length > 5) {
        saveInputVal.shift()
        console.log(saveInputVal);
    }
}

function editHistory() {
    if (inputVal === undefined) { return; 
    } else {
        resultBoxs.innerText = '';
        removeFirstText();
        for (let i = 0; i < saveInputVal.length; i++) {
            newDiv = document.createElement("div");
            newDiv.innerText = saveInputVal[i];
            newDiv.classList.add('word');
            newDiv.onclick = function(){
                p = this.parentElement;
                p.removeChild(this);
            }
            resultBoxs.appendChild(newDiv);
        }
    }
}

function showHistory () {
    if(saveInputVal.length === 0){
        return;
    }
    resultBoxs.classList.remove("hidden");}

function fetchData(name) {
    fetch(`https://api.nytimes.com/svc/search/v2/articlesearch.json?q=${name}&api-key=${MYAPI}`)
    .then((response) => response.json())
    .then((data) => { 
        console.log(data);
        newsArticle.push(...data.response.docs)
        createArticleEl();
    })
}
        
function createArticleEl() {
    
    for (let i = 0; i < newsArticle.length; i++){
        
        const userInfo = document.createElement("div");
        userInfo.innerHTML = 
        `
        <div class="articleBoxs">
        <a class="headlineColor" href="${newsArticle[i].web_url}">
        <div class="headline">${newsArticle[i].headline.main}</div></a>
        <div class="pub_date">${newsArticle[i].pub_date}</div>
        <button class="clipbtn">Clip this 📩</button>
        <a href="${newsArticle[i].web_url}"><button>See Detail 💬</button></a>
        </div>
        `
        articlesEl.appendChild(userInfo);
    }
    clipAdd();
    checkClipList();
}

function clipAdd(){
    const articlesEl = document.querySelector(".articles");
    articlesEl.addEventListener("click", (e) => {
    clippedArticle.push(e.target.parentNode);
    })
}

function checkClipList() {
    const clipBtnEl = document.querySelector("#clip_btn"); 
    clipBtnEl.addEventListener("click",()=>{
        
        const articlesEl = document.querySelector(".articles");

        // reset
        for(let i =0; i < articlesEl.children.length; i++){
            articlesEl.children[i].innerHTML = "";
            // clipBtnEl.innerText = " Back ✨";
        }
        
        for(let i =0; i < clippedArticle.length; i++){
            articlesEl.appendChild(clippedArticle[i]);
        }

    });
}

inputEl.addEventListener('keypress',getValue);
inputEl.addEventListener('focus', showHistory);
inputEl.addEventListener('blur', hideHistory);