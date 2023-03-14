const TOTAL_NUMBER_OF_SEATS = 10
const LOCAL_STORAGE_BOOKINGS_KEY = "bookings"
const KEY_SERIAL_NUMBER = "Serial No."
const KEY_NAME = "Name"
const KEY_PHONE_NUMBER = "Phone number"
const KEY_TIMESTAMP = "Timestamp"
const LOCAL_STORAGE_SERIAL_NUMBER_KEY = "serialNumber"

var bookings = {}, serial_number = 1, timer;

document.addEventListener('DOMContentLoaded', function () {
    document.getElementById("hometab").click();
});

function openTab(evt, tabName) {
    if (tabName == "Book") {
        startTimer()
    } else {
        clearTimeout(timer)
    }

    if (tabName == "Home") {
        showAvailability()
    }

    if (tabName == "Display") {
        showBookings()
    }

    var i, tabcontent, tablinks;

    tabcontent = document.getElementsByClassName("tabcontent");
    for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
    }

    tablinks = document.getElementsByClassName("tablinks");
    for (i = 0; i < tablinks.length; i++) {
        tablinks[i].className = tablinks[i].className.replace(" active", "");
    }

    document.getElementById(tabName).style.display = "block";
    evt.currentTarget.className += " active";
}

function book() {
    getSerialNumberFromStorage()
    var booking = {}
    booking[KEY_TIMESTAMP] = getCurrentTimestamp()

    // Check if fully booked
    if (Object.keys(bookings).length == TOTAL_NUMBER_OF_SEATS) {
        alert("Train is fully booked")
        return
    }

    // Check if fields are empty
    var form = document.getElementById("bookingForm");
    var i;
    for (i = 0; i < form.length; i++) {
        var input = form.elements[i].value
        if (input == '') {
            alert("Name / Phone Number cannot be empty")
            return
        }
        if (i == 0) {
            booking[KEY_NAME] = input
        }
        if (i == 1) {
            booking[KEY_PHONE_NUMBER] = input
        }
    }
    booking[KEY_SERIAL_NUMBER] = serial_number
    bookings[serial_number] = booking
    serial_number++
    clearBookingForm()
    updateBookingsToStorage()
    updateSerialNumberToStorage()
    alert(`Booking successfully created for ${booking[KEY_NAME]}`)
}

function getCurrentTimestamp() {
    return Date.now()
}

function clearBookingForm() {
    document.getElementById("bookingForm").reset();
}

function clearCancellationForm() {
    document.getElementById("cancelForm").reset();
}

function cancel() {
    var form = document.getElementById("cancelForm");
    var reservationNumber = form.elements[0].value

    // Check if field is empty
    if (reservationNumber == '') {
        alert("Reservation number can't be empty")
        return
    }

    // Check if reservation is valid
    if (reservationNumber in bookings) {
        delete bookings[String(reservationNumber)]
        clearCancellationForm()
        updateBookingsToStorage()
        alert(`Reservation number: ${reservationNumber} has been cancelled.`)
        return
    }

    // Show alert if reservation number is invalid
    clearCancellationForm()
    alert(`Reservation number: ${reservationNumber} cannot be found.`)
}

function showAvailability() {
    getBookingsFromStorage()
    var availableSlots = document.getElementById("availableSlots");
    availableSlots.innerHTML = `Free slots available: <u>${TOTAL_NUMBER_OF_SEATS - Object.keys(bookings).length}</u>`
}

function showBookings() {
    var emptyState = document.getElementById("empty_state");
    var reservations = document.getElementById("reservations_view");

    getBookingsFromStorage()
    console.log(bookings)

    // Show empty state if it's empty
    if (Object.keys(bookings).length === 0) {
        emptyState.style.display = "block";
        reservations.style.display = "none";
        return
    }

    clearTable()
    var table = document.getElementById("reservationsTable");

    var i = 1
    for (var key in bookings) {
        var value = bookings[key];
        var row = table.insertRow(i);
        var cell1 = row.insertCell(0);
        var cell2 = row.insertCell(1);
        var cell3 = row.insertCell(2);
        var cell4 = row.insertCell(3);
        cell1.innerHTML = String(key);
        cell2.innerHTML = value[KEY_NAME];
        cell3.innerHTML = value[KEY_PHONE_NUMBER];
        cell4.innerHTML = String(Date(KEY_PHONE_NUMBER));
        i++
    }

    emptyState.style.display = "none";
    reservations.style.display = "block";
}

function startTimer() {
    clearTimeout(timer)
    timer = window.setTimeout(showWarning, 60000)
}

function showWarning() {
    if (window.confirm("Do you want to continue your session?")) {
        clearBookingForm()
    }
}

function getBookingsFromStorage() {
    temp = localStorage.getItem(LOCAL_STORAGE_BOOKINGS_KEY)
    if (temp != null) {
        bookings = JSON.parse(temp)
    }
}

function updateBookingsToStorage() {
    localStorage.setItem(LOCAL_STORAGE_BOOKINGS_KEY, JSON.stringify(bookings))
}

function updateSerialNumberToStorage() {
    localStorage.setItem(LOCAL_STORAGE_SERIAL_NUMBER_KEY, serial_number)
}

function getSerialNumberFromStorage() {
    temp = localStorage.getItem(LOCAL_STORAGE_SERIAL_NUMBER_KEY)
    if (temp != null) {
        serial_number = temp
    }
}

function clearTable() {
    var reservationsTable = document.getElementById("reservationsTable");
    var rowCount = reservationsTable.rows.length;
    for (var x = rowCount - 1; x > 0; x--) {
        reservationsTable.deleteRow(x);
    }
}