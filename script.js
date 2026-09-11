function openForm() {
    document.getElementById("addForm").style.display = "block";
}

function closeForm() {
    document.getElementById("addForm").style.display = "none";
}

function addItem() {
    const type = document.getElementById("itemType").value;
    const name = document.getElementById("itemName").value;
    const date = document.getElementById("itemDate").value;
    const time = document.getElementById("itemTime").value;

    if (name === "") {
        alert("Please enter what you got.");
        return;
    }

    alert(
        "Added!\n\n" +
        type + ": " + name +
        "\nDate: " + date +
        "\nTime: " + time
    );

    closeForm();
}
