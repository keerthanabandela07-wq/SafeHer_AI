// Variables

let map;
let marker;
let watchId = null;


// Initialize Map

function initializeMap(latitude, longitude) {

    if (!map) {
        map = L.map('map').setView([latitude, longitude], 16);

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; OpenStreetMap contributors'
        }).addTo(map);
        marker = L.marker([latitude, longitude]).addTo(map);
        marker.bindPopup("Your Current Location").openPopup();
    }
    else {
        marker.setLatLng([latitude, longitude]);
        map.setView([latitude, longitude], 16);
}
setTimeout(function() {
    map.invalidateSize();
}, 300);

}
// Get Current Location

function getLocation() {

    if (navigator.geolocation) {

        navigator.geolocation.getCurrentPosition(

            function(position) {

                let latitude = position.coords.latitude;

                let longitude = position.coords.longitude;

                document.getElementById("location").innerHTML =
                    latitude + ", " + longitude;

                initializeMap(latitude, longitude);

            },

            function(error) {

                alert("Unable to access location. Please check permissions.");

            }

        );

    }

    else {

        alert("Geolocation is not supported by your browser.");

    }

}


// Start Live Tracking

function startTracking() {

    if (!navigator.geolocation) {

        alert("Geolocation is not supported.");

        return;

    }

    if (watchId !== null) {

        alert("Tracking is already running.");

        return;

    }

    watchId = navigator.geolocation.watchPosition(

        function(position) {

            let latitude = position.coords.latitude;

            let longitude = position.coords.longitude;

            document.getElementById("location").innerHTML =
                latitude + ", " + longitude;

            initializeMap(latitude, longitude);

        },

        function(error) {

            alert("Unable to track your location.");

        },

        {
            enableHighAccuracy: true,
            maximumAge: 0,
            timeout: 10000
        }

    );

}


// Stop Live Tracking

function stopTracking() {

    if (watchId !== null) {

        navigator.geolocation.clearWatch(watchId);

        watchId = null;

        alert("Location tracking stopped.");

    }

    else {

        alert("Tracking is not currently running.");

    }

}


// SOS Emergency Function

```javascript
// SOS Emergency Function

function sendSOS() {

    let confirmation = confirm(
        "Are you sure you want to activate SOS?"
    );

    if (!confirmation) {
        return;
    }

    if (!navigator.geolocation) {
        alert("Geolocation is not supported by your browser.");
        return;
    }

    let status = document.getElementById("sosStatus");

    if (status) {
        status.innerText = "Getting your current location...";
    }

    navigator.geolocation.getCurrentPosition(

        function(position) {

            let latitude = position.coords.latitude;
            let longitude = position.coords.longitude;

            fetch("/send_sos", {

                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({
                    latitude: latitude,
                    longitude: longitude
                })

            })

            .then(response => response.json().then(data => ({
                success: response.ok,
                data: data
            })))

            .then(result => {

                if (!result.success) {
                    alert(result.data.message);

                    if (status) {
                        status.innerText = result.data.message;
                    }

                    return;
                }

                let data = result.data;

                // Prepare emergency message
                let message =
                    data.message +
                    "\n\nMy Current Location:\n" +
                    data.location;

                if (status) {

                    status.replaceChildren();

                    let heading = document.createElement("h3");
                    heading.innerText = "🚨 SOS Alert Prepared";

                    status.appendChild(heading);

                    let messageText = document.createElement("p");
                    messageText.innerText = message;

                    status.appendChild(messageText);

                    // Create SMS links for trusted contacts
                    if (data.contacts.length > 0) {

                        let contactHeading = document.createElement("h4");

                        contactHeading.innerText = "Notify Trusted Contacts:";

                        status.appendChild(contactHeading);

                        data.contacts.forEach(function(contact) {

                            let smsLink = document.createElement("a");

                            smsLink.href =
                                "sms:" + contact.phone +
                                "?body=" + encodeURIComponent(message);

                            smsLink.innerText =
                                "📩 Send SMS to " + contact.name;

                            smsLink.style.display = "block";
                            smsLink.style.margin = "10px 0";

                            status.appendChild(smsLink);

                        });

                    } else {

                        let warning = document.createElement("p");

                        warning.innerText =
                            "No trusted contacts added. Please call emergency services if needed.";

                        status.appendChild(warning);

                    }

                    // Emergency call option
                    let callLink = document.createElement("a");

                    callLink.href = "tel:112";
                    callLink.innerText = "📞 Call National Emergency 112";

                    callLink.style.display = "block";
                    callLink.style.marginTop = "15px";

                    status.appendChild(callLink);

                }

                alert("SOS message prepared successfully!");

            })

            .catch(error => {

                alert("Something went wrong. Please try again.");

                if (status) {
                    status.innerText = "Unable to prepare SOS alert.";
                }

            });

        },

        function(error) {

            alert("Unable to detect your location. Please enable GPS.");

            if (status) {
                status.innerText = "Location access failed.";
            }

        },

        {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 0
        }

    );

}
```

    // Check GPS availability
    if (!navigator.geolocation) {

        alert("Geolocation is not supported by your browser.");

        return;
    }

    let status = document.getElementById("sosStatus");

    if (status) {
        status.innerText = "Getting your current location...";
    }

    // Get current GPS location
    navigator.geolocation.getCurrentPosition(

        function(position) {

            let latitude = position.coords.latitude;
            let longitude = position.coords.longitude;

            // Send location to Flask
            fetch("/send_sos", {

                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({
                    latitude: latitude,
                    longitude: longitude
                })

            })

            .then(response => response.json().then(data => ({
                success: response.ok,
                data: data
            })))

            .then(result => {

                if (!result.success) {

                    alert(result.data.message);

                    if (status) {
                        status.innerText = result.data.message;
                    }

                    return;
                }

                let data = result.data;

                let contactDetails = "";

                if (data.contacts.length > 0) {

                    contactDetails = data.contacts.map(contact =>
                        contact.name + " - " + contact.phone
                    ).join("\n");

                } else {

                    contactDetails = "No trusted contacts added.";

                }

                let message =
                    data.message +
                    "\n\nTrusted Contacts:\n" +
                    contactDetails +
                    "\n\nLocation:\n" +
                    data.location;

                if (status) {
                    status.innerText = message;
                }

                alert(message);

            })

            .catch(error => {

                alert("Something went wrong. Please try again.");

                if (status) {
                    status.innerText = "Unable to prepare SOS alert.";
                }

            });

        },

        function(error) {

            alert("Unable to detect your location. Please enable GPS.");

            if (status) {
                status.innerText = "Location access failed.";
            }

        },

        {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 0
        }

    );






// Demo Risk Analysis

function analyzeRisk() {

    let situation = document.getElementById("riskLevel").value;

    let result = document.getElementById("riskResult");

    if (situation === "") {

        alert("Please select your current situation.");

        return;

    }

    if (situation === "safe") {

        result.innerHTML = "🟢 LOW RISK - You reported feeling safe.";

    }

    else if (situation === "uncomfortable") {

        result.innerHTML = "🟡 MEDIUM RISK - Stay alert and inform a trusted contact.";

    }

    else if (situation === "unsafe") {

        result.innerHTML = "🟠 HIGH RISK - Consider moving to a safer place and contacting someone you trust.";

    }

    else if (situation === "danger") {

        result.innerHTML = "🔴 CRITICAL - Seek immediate assistance. Call 112 if you are in India.";

    }

}