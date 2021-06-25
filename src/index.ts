import qrcode from "qrcode";
import { generate } from "./qr-gen";

const LOCAL_STORAGE_NAME_LIST = "meehoi-qr-web-name";
const LOCAL_STORAGE_NAME_PHONE = "meehoi-qr-web-phone";

const nodeList = document.getElementById("list");

function nameIsChange() {
  const b = [];
  for (const inpg of nodeList.childNodes) {
    const name = (inpg.firstChild as HTMLInputElement).value;
    b.push(name);
  }
  localStorage.setItem(LOCAL_STORAGE_NAME_LIST, JSON.stringify(b));
}

function shouldDisable() {
  if (nodeList.firstChild?.lastChild)
    (nodeList.firstChild.lastChild as HTMLButtonElement).disabled =
      nodeList.childNodes.length == 1;
}

function inputBlockGenerate(nameValue: string = "") {
  const nodename = document.createElement("input");
  nodename.type = "text";
  nodename.className = "inp-name";
  nodename.placeholder = "ชื่อ";
  nodename.value = nameValue;

  nodename.addEventListener("input", nameIsChange);

  const nodeam = document.createElement("input");
  nodeam.type = "number";
  nodeam.className = "inp-amount";
  nodeam.placeholder = "จำนวน";
  nodeam.min = "0";

  const nodeDiv = document.createElement("div");
  nodeDiv.className = "inp-group";

  const nodeBthDel = document.createElement("button");
  nodeBthDel.innerHTML = `<svg viewBox="0 0 24 24"><path fill="currentColor" d="M9,3V4H4V6H5V19A2,2 0 0,0 7,21H17A2,2 0 0,0 19,19V6H20V4H15V3H9M7,6H17V19H7V6M9,8V17H11V8H9M13,8V17H15V8H13Z" /></svg>`;
  nodeBthDel.className = "btn-remove";
  nodeBthDel.setAttribute("aria-label", "remove");
  nodeBthDel.addEventListener("click", () => {
    nodeDiv.remove();
    nameIsChange();
    shouldDisable();
  });

  nodeDiv.appendChild(nodename);
  nodeDiv.appendChild(nodeam);
  nodeDiv.appendChild(nodeBthDel);

  nodeList.appendChild(nodeDiv);
}

function newQrInp() {
  inputBlockGenerate();
  nameIsChange();
  shouldDisable();
}

const phoneNum = document.getElementById("phone-num") as HTMLInputElement;

phoneNum.addEventListener("input", (e) => {
  localStorage.setItem(
    LOCAL_STORAGE_NAME_PHONE,
    (e.target as HTMLInputElement).value
  );
});

const outputDiv = document.getElementById("output");

async function generateAll() {
  while (outputDiv.firstChild) {
    outputDiv.firstChild.remove();
  }
  outputDiv.className = "output-dogrid";

  for (const inpg of nodeList.childNodes) {
    const name = inpg.firstChild as HTMLInputElement;
    const am = inpg.firstChild.nextSibling as HTMLInputElement;
    if (am.value) am.value = Math.abs(+am.value).toFixed(2);
    if (!(phoneNum.value && name.value && am.value)) break;

    const nodeCover = document.createElement("div");
    nodeCover.className = "qr-child-cover";
    const node = document.createElement("div");
    node.className = "qr-child";
    const genDat = generate(phoneNum.value, am.value);

    const nameDiv = document.createElement("div");
    nameDiv.className = "qr-label";
    nameDiv.innerText = `${name.value} - ${(+am.value).toLocaleString("th-TH", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })} บาท`;
    node.appendChild(nameDiv);

    try {
      const img = document.createElement("img");
      img.src = await qrcode.toDataURL(genDat, {
        color: {
          dark: "#000000D9",
        },
      });
      node.appendChild(img);
    } catch (err) {
      console.error(err);
    }

    nodeCover.appendChild(node);

    const spacerDiv1 = document.createElement("div");
    spacerDiv1.innerText = "\n";
    spacerDiv1.className = "hidden";
    const spacerDiv2 = document.createElement("div");
    spacerDiv2.innerText = "\n";
    spacerDiv2.className = "hidden";
    const hr = document.createElement("hr");
    hr.className = "hidden";
    nodeCover.appendChild(spacerDiv1);
    nodeCover.appendChild(hr);
    nodeCover.appendChild(spacerDiv2);

    outputDiv.appendChild(nodeCover);
  }

  if (outputDiv.childNodes.length > 0) {
    copyQr();
    return;
  }

  outputDiv.className = "";
  const placeholderDiv = document.createElement("div");
  placeholderDiv.innerText = ":)";
  placeholderDiv.className = "output-placeholder";
  outputDiv.appendChild(placeholderDiv);
}

function copyQr() {
  const range = document.createRange();
  range.selectNode(outputDiv);
  window.getSelection().removeAllRanges();
  window.getSelection().addRange(range);
  document.execCommand("copy");
  window.getSelection().removeAllRanges();
}

document.getElementById("btn-add").addEventListener("click", newQrInp);

document.getElementById("btn-submit").addEventListener("click", generateAll);

document.getElementById("btn-copy").addEventListener("click", copyQr);

function init() {
  const stroList = localStorage.getItem(LOCAL_STORAGE_NAME_LIST);
  const stroPhone = localStorage.getItem(LOCAL_STORAGE_NAME_PHONE);
  phoneNum.value = stroPhone || "";

  if (!stroList) {
    newQrInp();
    return;
  }

  for (const name of JSON.parse(stroList) as string[]) {
    inputBlockGenerate(name);
  }
  shouldDisable();
}

init();
