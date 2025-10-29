// Initialize app
document.addEventListener("DOMContentLoaded", () => {
  initializeApp()
})

function initializeApp() {
  navigateTo("landing")
  loadReports()
}

// Navigation
function navigateTo(page) {
  const pages = document.querySelectorAll(".page")
  pages.forEach((p) => p.classList.remove("active"))

  const targetPage = document.getElementById(page)
  if (targetPage) {
    targetPage.classList.add("active")
  }

  if (page === "admin-dashboard") {
    updateDashboard()
  }
}

// Tab switching
function switchTab(tabName) {
  const tabs = document.querySelectorAll(".tab-content")
  tabs.forEach((tab) => tab.classList.remove("active"))

  const tabBtns = document.querySelectorAll(".tab-btn")
  tabBtns.forEach((btn) => btn.classList.remove("active"))

  const targetTab = document.getElementById(tabName + "-tab")
  if (targetTab) {
    targetTab.classList.add("active")
  }

  event.target.classList.add("active")
}

// Report submission
function submitReport() {
  const category = document.getElementById("category").value
  const description = document.getElementById("description").value

  if (!description.trim()) {
    alert("Please provide a description")
    return
  }

  const report = {
    id: "RPT-" + Date.now(),
    category: category,
    description: description,
    date: new Date().toLocaleDateString(),
    status: "pending",
    priority: category === "Harassment" ? "high" : "normal",
  }

  const reports = JSON.parse(localStorage.getItem("reports")) || []
  reports.push(report)
  localStorage.setItem("reports", JSON.stringify(reports))

  alert("Report submitted successfully!\nYour Report ID: " + report.id)

  document.getElementById("category").value = "Harassment"
  document.getElementById("description").value = ""
  document.getElementById("location-display").classList.remove("show")
}

// Track report
function trackReport() {
  const reportId = document.getElementById("report-id").value

  if (!reportId.trim()) {
    alert("Please enter a Report ID")
    return
  }

  const reports = JSON.parse(localStorage.getItem("reports")) || []
  const report = reports.find((r) => r.id === reportId)

  const resultDiv = document.getElementById("track-result")

  if (report) {
    resultDiv.classList.add("show")
    resultDiv.innerHTML = `
            <h3>Report Found</h3>
            <p><strong>Report ID:</strong> ${report.id}</p>
            <p><strong>Category:</strong> ${report.category}</p>
            <p><strong>Status:</strong> ${report.status.charAt(0).toUpperCase() + report.status.slice(1)}</p>
            <p><strong>Submitted:</strong> ${report.date}</p>
            <p><strong>Description:</strong> ${report.description}</p>
        `
  } else {
    resultDiv.classList.add("show")
    resultDiv.innerHTML = "<h3>Report Not Found</h3><p>No report found with this ID.</p>"
  }
}

// Add location
function addLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition((position) => {
      const lat = position.coords.latitude
      const lng = position.coords.longitude
      const locationDisplay = document.getElementById("location-display")
      locationDisplay.classList.add("show")
      locationDisplay.textContent = `Location added: ${lat.toFixed(4)}, ${lng.toFixed(4)}`
    })
  } else {
    alert("Geolocation is not supported by your browser")
  }
}

// Upload photo
function uploadPhoto() {
  document.getElementById("photo-input").click()
}

// Admin login
function adminLogin() {
  const email = document.getElementById("admin-email").value
  const password = document.getElementById("admin-password").value

  if (email === "admin@campus.edu" && password === "password123") {
    localStorage.setItem("adminLoggedIn", "true")
    navigateTo("admin-dashboard")
  } else {
    alert("Invalid credentials. Demo: admin@campus.edu / password123")
  }
}

// Admin logout
function adminLogout() {
  localStorage.removeItem("adminLoggedIn")
  navigateTo("admin-login")
}

// Load and display reports
function loadReports() {
  const reports = JSON.parse(localStorage.getItem("reports")) || []
  const tbody = document.getElementById("reports-tbody")

  if (!tbody) return

  tbody.innerHTML = ""

  reports.forEach((report) => {
    const row = document.createElement("tr")
    const statusClass =
      report.status === "resolved"
        ? "status-resolved"
        : report.priority === "high"
          ? "status-high-priority"
          : "status-pending"

    row.innerHTML = `
            <td>${report.id}</td>
            <td>${report.category}</td>
            <td><span class="status-badge ${statusClass}">${report.status}</span></td>
            <td>${report.date}</td>
            <td>
                <div class="action-buttons">
                    <button class="btn btn-secondary" onclick="viewReport('${report.id}')">View</button>
                    <button class="btn btn-secondary" onclick="deleteReport('${report.id}')">Delete</button>
                </div>
            </td>
        `
    tbody.appendChild(row)
  })
}

// View report details
function viewReport(reportId) {
  const reports = JSON.parse(localStorage.getItem("reports")) || []
  const report = reports.find((r) => r.id === reportId)

  if (report) {
    const modalBody = document.getElementById("modal-body")
    modalBody.innerHTML = `
            <p><strong>Report ID:</strong> ${report.id}</p>
            <p><strong>Category:</strong> ${report.category}</p>
            <p><strong>Status:</strong> ${report.status}</p>
            <p><strong>Priority:</strong> ${report.priority}</p>
            <p><strong>Date:</strong> ${report.date}</p>
            <p><strong>Description:</strong></p>
            <p>${report.description}</p>
        `

    localStorage.setItem("currentReportId", reportId)
    document.getElementById("report-modal").classList.add("show")
  }
}

// Resolve report
function resolveReport() {
  const reportId = localStorage.getItem("currentReportId")
  const reports = JSON.parse(localStorage.getItem("reports")) || []
  const report = reports.find((r) => r.id === reportId)

  if (report) {
    report.status = "resolved"
    localStorage.setItem("reports", JSON.stringify(reports))
    closeModal()
    loadReports()
    updateDashboard()
  }
}

// Delete report
function deleteReport(reportId) {
  if (confirm("Are you sure you want to delete this report?")) {
    let reports = JSON.parse(localStorage.getItem("reports")) || []
    reports = reports.filter((r) => r.id !== reportId)
    localStorage.setItem("reports", JSON.stringify(reports))
    loadReports()
    updateDashboard()
  }
}

// Close modal
function closeModal() {
  document.getElementById("report-modal").classList.remove("show")
  localStorage.removeItem("currentReportId")
}

// Update dashboard stats
function updateDashboard() {
  const reports = JSON.parse(localStorage.getItem("reports")) || []

  const totalReports = reports.length
  const underReview = reports.filter((r) => r.status === "pending").length
  const resolved = reports.filter((r) => r.status === "resolved").length
  const highPriority = reports.filter((r) => r.priority === "high").length

  document.getElementById("total-reports").textContent = totalReports
  document.getElementById("under-review").textContent = underReview
  document.getElementById("resolved").textContent = resolved
  document.getElementById("high-priority").textContent = highPriority

  loadReports()
}

// Close modal when clicking outside
document.addEventListener("click", (event) => {
  const modal = document.getElementById("report-modal")
  if (event.target === modal) {
    closeModal()
  }
})
