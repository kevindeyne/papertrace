const docList = document.getElementById("document-list");
const docDetail = document.getElementById("document-detail");
const ocrDetails = document.getElementById("ocr-details");
const imgDetails = document.getElementById("img-details");

let db;
let initProgress = 1;
const maxProgress = 5;

const db_name = "papertrace-document-store";
const docs_table_name = "docs";

function levenshteinDistance(n,e){let r,t,f,i,l,o,u,h,a,c,g,s=n.length,v=e.length;if(0===s)return v;if(0===v)return s;for(s>v&&(r=n,n=e,e=r),o=new Int8Array(s+1),t=0;t<=s;t++)o[t]=t;for(t=1;t<=v;t++){for(i=t,g=e[t-1],f=1;f<=s;f++)g===n[f-1]?l=o[f-1]:(u=i+1,h=o[f]+1,a=u-(u-h&h-u>>7),c=o[f-1]+1,l=a-(a-c&c-a>>7)),o[f-1]=i,i=l;o[s]=i}return 1-o[s]/s}

/*addRecordButton.addEventListener("click", async function () {
  console.log("add record");
  db.add(docs_table_name, {"id": generateUUID(), "txt": "hello-w0rld"}, generateUUID());
});

clearButton.addEventListener("click", function () {
  console.log("clear all");
  db.clear(docs_table_name);
});

searchButton.addEventListener("click", function () {
  const searchValue = searchInput.value;
  console.log("search for: " + searchValue);
  db.getAll(docs_table_name).then(function(resultArray) {
    records.replaceChildren();

    data = [];
    for(item of resultArray) {
      item.ldis = levenshteinDistance(item.id, searchValue);
      if(item.ldis != 0) {
        data.push(item);
      }
    }

    data.sort((a, b) => b.ldis - a.ldis);

    for(item of data) {
      const li = document.createElement('li');
      li.textContent = item.id;
      records.appendChild(li);
    }
  });
});*/

async function init_db() {
	updateProgressBar("Initializing - Opening IndexedDB");
	//support check
	if (!('indexedDB' in window)) {
		alert("This browser doesn't support IndexedDB.");
		return;
	}

	db = await idb.openDB(db_name, 1, {
		upgrade(db) {
			if (!db.objectStoreNames.contains(docs_table_name)) {
				db.createObjectStore(docs_table_name, { autoIncrement: true });
			}
		}
	});
	load_all();
}
init_db();

function buildDocumentListing(item, key) {
	// Create the main div element
	let documentDiv = document.createElement("div");
	documentDiv.setAttribute("docId", key);
	documentDiv.classList.add("document");

	// Create the img element and set the src attribute
	let imgElement = document.createElement("img");
	imgElement.setAttribute("src", item.img);

	// Create the description div element
	let descriptionDiv = document.createElement("div");
	descriptionDiv.classList.add("description");

	let nameParagraph = document.createElement("p");
	nameParagraph.innerHTML = "<strong>" + item.name + "</strong>";

	// Create the Date added paragraph and span elements
	let dateAddedParagraph = document.createElement("p");
	dateAddedParagraph.innerHTML = "Date added: <span>" + item.added + "</span>";

	// Create the Category paragraph and span elements
	let categoryParagraph = document.createElement("p");
	categoryParagraph.innerHTML = "Category: <span>" + "PENDING" + "</span>";

	documentDiv.appendChild(imgElement);
	descriptionDiv.appendChild(nameParagraph);
	descriptionDiv.appendChild(dateAddedParagraph);
	descriptionDiv.appendChild(categoryParagraph);
	documentDiv.appendChild(descriptionDiv);

	documentDiv.addEventListener("click", function () { clickOnDocumentListing(key); });

	docList.appendChild(documentDiv);
}

async function load_all() {
	updateProgressBar("Initializing - Loading previous data");
	docList.replaceChildren();
	const keys = await db.getAllKeys(docs_table_name);
	updateProgressBar("Initializing - Visualizing previous data");
	for(const key of keys) {
		const item = await db.get(docs_table_name, key);
		buildDocumentListing(item, key);
	}
	updateProgressBar("Initializing - Completion");
	hideLoader();
}

let activeDocumentId = null;

async function clickOnDocumentListing(key) {
	activeDocumentId = key;
	hide(docList);

	const item = await db.get(docs_table_name, key);
	imgDetails.src = item.img;
	ocrDetails.textContent = item.ocr;
	show(docDetail);
}

async function deleteDocument() {
    await db.delete(docs_table_name, activeDocumentId);
	document.querySelector("#document-list [docid='"+activeDocumentId+"']").remove();
	activeDocumentId = null;
	backToListing();
}

function backToListing() {
  show(docList);
  hide(docDetail);
}

function updateProgressBar(msg) {
	initProgress++;
	showLoader("<div>"+msg+" ...</div><div id=\"loader-wrapper\"><div id=\"loader-progress\" style=\"width:"+ ((initProgress/maxProgress)*100) +"%\"></div></div>");
}

function showLoader(msg) {
	loader.innerHTML = msg;
	show(loader);
}

function hideLoader() {
	hide(loader);
}

function show(elem) {
	elem.style = "display: block;";
}

function hide(elem) {
	elem.style = "display: none;";
}