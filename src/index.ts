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

  const nodeDiv = document.createElement("div");
  nodeDiv.className = "inp-group";

  const nodeBthDel = document.createElement("button");
  nodeBthDel.innerText = "Remove";
  nodeBthDel.className = "btn-remove";
  nodeBthDel.addEventListener("click", () => {
    nodeDiv.remove();
    nameIsChange();
  });

  nodeDiv.appendChild(nodename);
  nodeDiv.appendChild(nodeam);
  nodeDiv.appendChild(nodeBthDel);

  nodeList.appendChild(nodeDiv);
}

function newQrInp() {
  inputBlockGenerate();
  nameIsChange();
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

  for (const inpg of nodeList.childNodes) {
    const name = inpg.firstChild as HTMLInputElement;
    const am = inpg.firstChild.nextSibling as HTMLInputElement;
    if (phoneNum.value && name.value && am.value) {
      const nodeCover = document.createElement("div");
      nodeCover.className = "qr-child-cover";
      const node = document.createElement("div");
      node.className = "qr-child";
      const genDat = generate(phoneNum.value, am.value);

      try {
        const nameDiv = document.createElement("div");
        nameDiv.className = "qr-label";
        nameDiv.innerHTML = `${name.value} - ${(+am.value).toFixed(2)} บาท`;

        const img = document.createElement("img");
        img.src = await qrcode.toDataURL(genDat);

        const spacerDiv = document.createElement("div");
        spacerDiv.innerHTML = "\n";

        node.appendChild(nameDiv);
        node.appendChild(img);
        node.appendChild(spacerDiv);
      } catch (err) {
        console.error(err);
      }
      nodeCover.appendChild(node);
      outputDiv.appendChild(nodeCover);
    }
  }

  copyQr();
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
}

init();
