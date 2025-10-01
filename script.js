
(function(){
  function loadOrders(){
    const s = localStorage.getItem("ordersLst");
    if(!s) return [
      { id:1, name:"", numberOfPages:450, levelOfEduc:"", price:0, Cost:0, receivedDate:new Date(""), submissionDate:new Date(""), profit:0 },
      { id:2, name:"", numberOfPages:1500, levelOfEduc:"", price:0, Cost:0, receivedDate:new Date(""), submissionDate:new Date(""), profit:0 },
      { id:3, name:"", numberOfPages:1800, levelOfEduc:"", price:0, Cost:0, receivedDate:new Date(""), submissionDate:new Date(""), profit:0 }
    ];
    try{
      const arr = JSON.parse(s);
      return arr.map(o=>({...o,receivedDate:o.receivedDate?new Date(o.receivedDate):null,submissionDate:o.submissionDate?new Date(o.submissionDate):null}));
    }catch(e){
      return [];
    }
  }
  function saveOrders(lst){
    localStorage.setItem("ordersLst", JSON.stringify(lst));
  }
  let ordersLst = loadOrders();

  const searchInput = document.getElementById("searchInput");
  const tbody = document.getElementById("ordersBody");
  const totalProfitEl = document.getElementById("totalProfit");
  let selectedRow = null;

  function formatDate(d){
    if(!d) return "";
    const dd = new Date(d);
    if(isNaN(dd)) return "";
    return dd.toLocaleDateString();
  }

  function generateTable(){
    if(!tbody || !totalProfitEl) return;
    tbody.innerHTML = "";
    let totalProfit = 0;
    ordersLst.forEach((order)=>{
      const tr = document.createElement("tr");
      tr.dataset.id = String(order.id);
      tr.innerHTML = `
        <th scope="row">${order.id}</th>
        <td>${order.name ?? ""}</td>
        <td>${order.numberOfPages ?? ""}</td>
        <td>${order.levelOfEduc ?? ""}</td>
        <td>${order.price ?? ""}</td>
        <td>${order.Cost ?? ""}</td>
        <td>${formatDate(order.receivedDate)}</td>
        <td>${formatDate(order.submissionDate)}</td>
        <td class="text-success fw-semibold">${order.profit ?? 0}</td>
      `;
      tbody.appendChild(tr);
      totalProfit += Number(order.profit)||0;
    });
    totalProfitEl.textContent = String(totalProfit);
    filterRows(searchInput?.value ?? "");
  }

  function filterRows(term){
    if(!tbody) return;
    const t = (term||"").toLowerCase();
    for(const row of tbody.querySelectorAll("tr")){
      const txt = row.innerText.toLowerCase();
      row.style.display = txt.includes(t) ? "" : "none";
    }
    recalcTotal();
  }

  function recalcTotal(){
    if(!tbody || !totalProfitEl) return;
    let total = 0;
    for(const row of tbody.querySelectorAll("tr")){
      if(row.style.display !== "none"){
        const cell = row.cells[8];
        if(cell){
          const v = parseFloat(cell.textContent.trim());
          if(!isNaN(v)) total += v;
        }
      }
    }
    totalProfitEl.textContent = String(total);
  }

  if(tbody){
    generateTable();
    tbody.addEventListener("click",(e)=>{
      const tr = e.target.closest("tr");
      if(!tr) return;
      tbody.querySelectorAll("tr").forEach(r=>r.classList.remove("selected"));
      tr.classList.add("selected");
      selectedRow = tr;
    });
  }

  if(searchInput){
    searchInput.addEventListener("input",(e)=>filterRows(e.target.value));
  }

  window.refreshFun = function(){
    if(searchInput){
      searchInput.value = "";
      searchInput.placeholder = "Search name, type...";
      filterRows("");
    }
  };

  const deleteBtn = document.getElementById("deleteBtn");
  if(deleteBtn){
    deleteBtn.addEventListener("click",()=>{
      if(!selectedRow){ alert("Please select a row to delete."); return; }
      const id = parseInt(selectedRow.dataset.id,10);
      const idx = ordersLst.findIndex(o=>o.id===id);
      if(idx!==-1){
        ordersLst.splice(idx,1);
        saveOrders(ordersLst);
        selectedRow = null;
        generateTable();
      }
    });
  }

  const cancelBtn = document.getElementById("cancelBtn");
  if(cancelBtn){
    cancelBtn.addEventListener("click",(e)=>{
      e.preventDefault();
      if(tbody){
        tbody.querySelectorAll("tr").forEach(r=>r.classList.remove("selected"));
        selectedRow = null;
      }
      window.location.href = "index.html";
    });
  }

  function getVal(id){ const el=document.getElementById(id); return el?el.value:""; }
  function toNumber(v){ const n = parseFloat(v); return isNaN(n)?0:n; }

  const addBtn = document.getElementById("addDataButton");
  if(addBtn){
    addBtn.addEventListener("click",function(e){
      e.preventDefault();
      const name = getVal("fullName").trim();
      const numberOfPages = parseInt(getVal("numberOfPages"))||0;
      const levelOfEduc = getVal("educationLevel") || getVal("level");
      const price = toNumber(getVal("price"));
      const Cost = toNumber(getVal("Cost"));
      const profitField = getVal("netProfit");
      const profit = profitField!=="" ? toNumber(profitField) : Math.max(price-Cost,0);
      const receivedDate = getVal("receivedDate");
      const submissionDate = getVal("submissionDate");
      const newOrder = {
        id: ordersLst.length ? ordersLst[ordersLst.length-1].id + 1 : 1,
        name,
        numberOfPages,
        levelOfEduc,
        price,
        Cost,
        receivedDate: receivedDate? new Date(receivedDate): null,
        submissionDate: submissionDate? new Date(submissionDate): null,
        profit
      };
      ordersLst.push(newOrder);
      saveOrders(ordersLst);
      window.location.href = "index.html";
    });
  }

  function findActionButton(label){
    const btns = document.querySelectorAll("button");
    for(const b of btns){
      const t = (b.textContent||"").trim().toLowerCase();
      if(t===label.toLowerCase()) return b;
      if(t.includes(label.toLowerCase())) return b;
    }
    return null;
  }

  const editBtn = findActionButton("Edit");
  if(editBtn && tbody){
    editBtn.addEventListener("click",(ev)=>{
      try {
        if(!selectedRow){ 
          alert("Please select a row to edit."); 
          return; 
        }
        const id = parseInt(selectedRow.dataset.id,10);
        localStorage.setItem("editOrderId", String(id));
       
        window.location.href = "page4.html";
      } catch(e){
        console.error("Edit button error:", e);
      }
    }, {capture:true});
  }


  if(document.title && document.title.toLowerCase().includes("update")){
    const idStr = localStorage.getItem("editOrderId");
    const id = idStr ? parseInt(idStr,10) : NaN;
    const order = ordersLst.find(o=>o.id===id);
    const fullName = document.getElementById("fullName");
    if(order && fullName){
      const set = (id,val)=>{ const el=document.getElementById(id); if(el!=null) el.value = val??""; };
      set("fullName", order.name);
      if(document.getElementById("educationLevel")) document.getElementById("educationLevel").value = order.levelOfEduc||"";
      if(document.getElementById("level")){
        const levels = document.querySelectorAll("#level");
        if(levels.length>=2) levels[1].value = order.levelOfEduc||"";
      }
      if (document.getElementById("Cost")) set("Cost", order.Cost);
      else if (document.getElementById("writerCost")) set("writerCost", order.Cost);
      set("price", order.price);
      set("Cost", order.Cost);
      set("netProfit", order.profit);
      if(order.receivedDate){
        const d = new Date(order.receivedDate);
        const s = d.toISOString().slice(0,10);
        set("receivedDate", s);
      }
      if(order.submissionDate){
        const d = new Date(order.submissionDate);
        const s = d.toISOString().slice(0,10);
        set("submissionDate", s);
      }
    }
    const form = document.querySelector("form");
    if(form){
      form.addEventListener("submit",function(e){
        e.preventDefault();
        const idx = ordersLst.findIndex(o=>o.id===id);
        if(idx!==-1){
          const name = getVal("fullName").trim();
          const levelOfEduc = getVal("educationLevel") || getVal("level");
          const numberOfPages = parseInt(getVal("numberOfPages"))||0;
          const price = toNumber(getVal("price"));
          const Cost = toNumber(getVal("Cost"));
          const profitField = getVal("netProfit");
          const profit = profitField!=="" ? toNumber(profitField) : Math.max(price-Cost,0);
          const receivedDate = getVal("receivedDate");
          const submissionDate = getVal("submissionDate");
          ordersLst[idx] = {
            ...ordersLst[idx],
            name,
            numberOfPages,
            levelOfEduc,
            price,
            Cost,
            receivedDate: receivedDate? new Date(receivedDate): null,
            submissionDate: submissionDate? new Date(submissionDate): null,
            profit
          };
          saveOrders(ordersLst);
          localStorage.removeItem("editOrderId");
          window.location.href = "index.html";
        }
      });
    }
  }
})();
function updateRowNumbers() {
  const rows = document.querySelectorAll("#ordersBody tr");
  rows.forEach((row, index) => {
    const th = row.querySelector("th");
    if (th) th.textContent = index + 1;
  });
}
window.updateRowNumbers = updateRowNumbers;

function generateTable() {

  if (typeof updateRowNumbers === "function") updateRowNumbers();
}


deleteBtn?.addEventListener("click", (e)=>{
  e.preventDefault();
  generateTable();
  updateRowNumbers(); 
});
