const API = "/api/rooms";

// INSERT
const insertForm = document.getElementById("insertForm");

if (insertForm) {
    insertForm.addEventListener("submit", async function(e) {
        e.preventDefault();

        const data = {
            room_no: document.getElementById("room_no").value,
            block_name: document.getElementById("block_name").value,
            capacity: Number(document.getElementById("capacity").value),
            status: document.getElementById("status").value
        };

        const res = await fetch(API, {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(data)
        });

        const result = await res.json();
        document.getElementById("message").textContent = result.message;

        if (res.ok) insertForm.reset();
    });
}

// LIST
const roomTable = document.getElementById("roomTable");

if (roomTable) {
    loadRooms();
}

async function loadRooms() {
    const res = await fetch(API);
    const rooms = await res.json();

    roomTable.innerHTML = "";

    rooms.forEach(room => {
        const row = document.createElement("tr");

        [
            room.room_id,
            room.room_no,
            room.block_name,
            room.capacity,
            room.status
        ].forEach(value => {
            const td = document.createElement("td");
            td.textContent = value;
            row.appendChild(td);
        });

        const action = document.createElement("td");

        const edit = document.createElement("a");
        edit.textContent = "Edit";
        edit.href = `update.html?id=${room.room_id}`;

        const del = document.createElement("a");
        del.textContent = "Delete";
        del.href = `delete.html?id=${room.room_id}`;

        action.append(edit, del);
        row.appendChild(action);

        roomTable.appendChild(row);
    });
}

// UPDATE
const updateForm = document.getElementById("updateForm");

if (updateForm) {
    const params = new URLSearchParams(window.location.search);
    const selectedId = params.get("id");

    if (selectedId) {
        document.getElementById("room_id").value = selectedId;

        fetch(`${API}/${selectedId}`)
            .then(res => res.json())
            .then(room => {
                if (room.room_id) {
                    document.getElementById("room_no").value = room.room_no;
                    document.getElementById("block_name").value = room.block_name;
                    document.getElementById("capacity").value = room.capacity;
                    document.getElementById("status").value = room.status;
                }
            });
    }

    updateForm.addEventListener("submit", async function(e) {
        e.preventDefault();

        const id = document.getElementById("room_id").value;

        const data = {
            room_no: document.getElementById("room_no").value,
            block_name: document.getElementById("block_name").value,
            capacity: Number(document.getElementById("capacity").value),
            status: document.getElementById("status").value
        };

        const res = await fetch(`${API}/${id}`, {
            method: "PUT",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(data)
        });

        const result = await res.json();
        document.getElementById("message").textContent = result.message;
    });
}

// DELETE
const deleteForm = document.getElementById("deleteForm");

if (deleteForm) {
    const params = new URLSearchParams(window.location.search);

    document.getElementById("delete_id").value =
        params.get("id") || "";

    deleteForm.addEventListener("submit", async function(e) {
        e.preventDefault();

        const id = document.getElementById("delete_id").value;

        if (!confirm("Are you sure you want to delete this room?")) {
            return;
        }

        const res = await fetch(`${API}/${id}`, {
            method: "DELETE"
        });

        const result = await res.json();
        document.getElementById("message").textContent = result.message;

        if (res.ok) deleteForm.reset();
    });
}