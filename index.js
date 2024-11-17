document.addEventListener("DOMContentLoaded", () => {
  const entryList = document.getElementById("entry-list");
  const totalIncomeDisplay = document.getElementById("total-income");
  const totalExpensesDisplay = document.getElementById("total-expenses");
  const netBalanceDisplay = document.getElementById("net-balance");
  const descriptionInput = document.getElementById("description");
  const amountInput = document.getElementById("amount");
  const typeSelect = document.getElementById("type");
  const addButton = document.getElementById("add-btn");
  const resetButton = document.getElementById("reset-btn");
  const filterRadios = document.querySelectorAll('input[name="filter"]');

  let entries = JSON.parse(localStorage.getItem("entries")) || [];

  function updateDisplay() {
    entryList.innerHTML = "";
    let totalIncome = 0;
    let totalExpenses = 0;

    entries.forEach((entry, index) => {
      const li = document.createElement("li");
      li.innerHTML = `
              <span>${entry.description} - $${entry.amount}</span>
              <button class="edit" data-index="${index}">Edit</button>
              <button class="delete" data-index="${index}">Delete</button>
          `;
      entryList.appendChild(li);

      if (entry.type === "income") {
        totalIncome += parseFloat(entry.amount);
      } else {
        totalExpenses += parseFloat(entry.amount);
      }
    });

    totalIncomeDisplay.textContent = totalIncome.toFixed(2);
    totalExpensesDisplay.textContent = totalExpenses.toFixed(2);
    netBalanceDisplay.textContent = (totalIncome - totalExpenses).toFixed(2);
  }

  function filterEntries() {
    const filterValue = Array.from(filterRadios).find(
      (radio) => radio.checked
    ).value;
    entryList.innerHTML = "";
    let totalIncome = 0;
    let totalExpenses = 0;

    const filteredEntries =
      filterValue === "all"
        ? entries
        : entries.filter((entry) => entry.type === filterValue);

    filteredEntries.forEach((entry, index) => {
      const li = document.createElement("li");
      li.innerHTML = `
              <span>${entry.description} - $${entry.amount}</span>
              <button class="edit" data-index="${index}">Edit</button>
              <button class="delete" data-index="${index}">Delete</button>
          `;
      entryList.appendChild(li);

      if (entry.type === "income") {
        totalIncome += parseFloat(entry.amount);
      } else {
        totalExpenses += parseFloat(entry.amount);
      }
    });

    totalIncomeDisplay.textContent = totalIncome.toFixed(2);
    totalExpensesDisplay.textContent = totalExpenses.toFixed(2);
    netBalanceDisplay.textContent = (totalIncome - totalExpenses).toFixed(2);
  }

  function addEntry() {
    const description = descriptionInput.value.trim();
    const amount = parseFloat(amountInput.value.trim());
    const type = typeSelect.value;

    if (description && !isNaN(amount)) {
      entries.push({ description, amount, type });
      localStorage.setItem("entries", JSON.stringify(entries));
      updateDisplay();
      resetInputs();
    }
  }

  function resetInputs() {
    descriptionInput.value = "";
    amountInput.value = "";
    typeSelect.value = "income";
  }

  function editEntry(index) {
    const entry = entries[index];
    descriptionInput.value = entry.description;
    amountInput.value = entry.amount;
    typeSelect.value = entry.type;

    // Remove the entry being edited
    entries.splice(index, 1);
    localStorage.setItem("entries", JSON.stringify(entries));
    updateDisplay();
  }

  function deleteEntry(index) {
    entries.splice(index, 1);
    localStorage.setItem("entries", JSON.stringify(entries));
    updateDisplay();
  }

  addButton.addEventListener("click", addEntry);
  resetButton.addEventListener("click", resetInputs);

  entryList.addEventListener("click", (e) => {
    if (e.target.classList.contains("edit")) {
      const index = e.target.getAttribute("data-index");
      editEntry(index);
    } else if (e.target.classList.contains("delete")) {
      const index = e.target.getAttribute("data-index");
      deleteEntry(index);
    }
  });

  filterRadios.forEach((radio) => {
    radio.addEventListener("change", filterEntries);
  });

  // Initial display
  updateDisplay();
});
