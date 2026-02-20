// Blood Pressure & Pulse Tracker Application
// Implements the same color-coding logic as the Excel VBA/LibreOffice Basic macros

class BPTracker {
  constructor() {
    this.readings = [];
    this.fileHandle = null; // Store reference to the file handle
    this.autoSaveEnabled = true;
    this.initializeEventListeners();
    this.setDefaultDate();
    this.loadLastFile(); // Try to load from last saved location
    this.renderTable();
    this.updateStatistics();
  }

  initializeEventListeners() {
    document
      .getElementById("addBtn")
      .addEventListener("click", () => this.addReading());
    document
      .getElementById("saveBtn")
      .addEventListener("click", () => this.saveToFile());
    document
      .getElementById("loadBtn")
      .addEventListener("click", () => this.loadFromFile());
    document
      .getElementById("exportBtn")
      .addEventListener("click", () => this.exportToTextFile());
    document
      .getElementById("importBtn")
      .addEventListener("click", () => this.importFromTextFile());
    document
      .getElementById("sortDateBtn")
      .addEventListener("click", () => this.sortByDate());
    document
      .getElementById("clearAllBtn")
      .addEventListener("click", () => this.clearAllData());
    document
      .getElementById("toggleViewBtn")
      .addEventListener("click", () => this.showAggregatedView());
    document
      .getElementById("backToListBtn")
      .addEventListener("click", () => this.showListView());

    // Allow Enter key to submit form
    document
      .querySelectorAll("#systolic, #diastolic, #pulse")
      .forEach((input) => {
        input.addEventListener("keypress", (e) => {
          if (e.key === "Enter") this.addReading();
        });
      });
  }

  setDefaultDate() {
    const today = new Date().toISOString().split("T")[0];
    document.getElementById("date").value = today;

    // Set current time
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, "0");
    const minutes = String(now.getMinutes()).padStart(2, "0");
    document.getElementById("time").value = `${hours}:${minutes}`;
  }

  addReading() {
    const date = document.getElementById("date").value;
    const time = document.getElementById("time").value;
    const systolic = parseInt(document.getElementById("systolic").value);
    const diastolic = parseInt(document.getElementById("diastolic").value);
    const pulse = parseInt(document.getElementById("pulse").value);

    if (!date || !time || isNaN(systolic) || isNaN(diastolic) || isNaN(pulse)) {
      alert("Please fill in all fields with valid numbers");
      return;
    }

    const newReading = {
      id: Date.now(),
      date,
      time,
      systolic,
      diastolic,
      pulse,
    };

    this.readings.push(newReading);
    if (this.autoSaveEnabled) {
      this.autoSave();
    }
    this.renderTable();
    this.updateStatistics();
    this.clearForm();
  }

  clearForm() {
    document.getElementById("systolic").value = "";
    document.getElementById("diastolic").value = "";
    document.getElementById("pulse").value = "";
    document.getElementById("systolic").focus();
  }

  deleteReading(id) {
    if (confirm("Are you sure you want to delete this reading?")) {
      this.readings = this.readings.filter((r) => r.id !== id);
      if (this.autoSaveEnabled) {
        this.autoSave();
      }
      this.renderTable();
      this.updateStatistics();
    }
  }

  // Tom L (01/21/2026): commented out group deletion - not used in current UI
  // deleteGroup(idsString) {
  //   const ids = idsString.split(",").map((id) => parseInt(id));
  //   const count = ids.length;
  //   if (
  //     confirm(
  //       `Are you sure you want to delete all ${count} reading(s) in this group?`
  //     )
  //   ) {
  //     this.readings = this.readings.filter((r) => !ids.includes(r.id));
  //     if (this.autoSaveEnabled) {
  //       this.autoSave();
  //     }
  //     this.renderTable();
  //     this.updateStatistics();
  //   }
  // }

  // Color coding logic based on AHA guidelines from README
  // Blood pressure category is determined by BOTH systolic and diastolic
  getBloodPressureColor(systolic, diastolic) {
    // Crisis: ≥180 and/or ≥120
    if (systolic >= 180 || diastolic >= 120) return "dark-red";

    // Stage 2: 140+ or 90-119
    if (systolic >= 140 || diastolic >= 90) return "red";

    // Stage 1: 130-139 or 80-89
    if (systolic >= 130 || diastolic >= 80) return "orange";

    // Elevated: 120-129 and <80
    if (systolic >= 120 && systolic < 130 && diastolic < 80) return "yellow";

    // Normal: <120 and <80
    if (systolic < 120 && diastolic < 80) return "green";

    // Default fallback
    return "orange";
  }

  getPulseColor(value) {
    if (value < 57) return "white-red-text";
    if (value < 62) return "dark-blue";
    if (value < 68) return "blue";
    if (value < 72) return "dark-green";
    if (value < 76) return "green";
    if (value < 82) return "yellow";
    return "red";
  }

  renderTable() {
    const tbody = document.getElementById("tableBody");
    tbody.innerHTML = "";

    if (this.readings.length === 0) {
      tbody.innerHTML =
        '<tr><td colspan="6" style="text-align: center; padding: 20px;">No readings yet. Add your first reading above!</td></tr>';
      return;
    }

    // Sort readings by date (newest first) and time
    const sortedReadings = [...this.readings].sort((a, b) => {
      const dateCompare = new Date(b.date) - new Date(a.date);
      if (dateCompare !== 0) return dateCompare;
      return b.time.localeCompare(a.time);
    });

    // Display each reading individually (no aggregation)
    sortedReadings.forEach((reading) => {
      const bpColor = this.getBloodPressureColor(
        reading.systolic,
        reading.diastolic,
      );
      const pulseColor = this.getPulseColor(reading.pulse);

      const row = document.createElement("tr");
      row.innerHTML = `
                <td>${reading.date}</td>
                <td>${reading.time}</td>
                <td class="${bpColor}">${reading.systolic}</td>
                <td class="${bpColor}">${reading.diastolic}</td>
                <td class="${pulseColor}">${reading.pulse}</td>
                <td><button class="delete-btn" onclick="tracker.deleteReading(${reading.id})">Delete</button></td>
            `;

      tbody.appendChild(row);
    });
  }

  showAggregatedView() {
    document.getElementById(
      "dataTable",
    ).parentElement.parentElement.style.display = "none";
    document.getElementById("aggregatedView").style.display = "block";
    this.renderAggregatedTable();
  }

  showListView() {
    document.getElementById(
      "dataTable",
    ).parentElement.parentElement.style.display = "block";
    document.getElementById("aggregatedView").style.display = "none";
  }

  getTimePeriod(time) {
    // Parse time string (HH:MM format)
    const [hours, minutes] = time.split(":").map(Number);
    const totalMinutes = hours * 60 + minutes;

    // Midnight to 10 AM (0:00 - 9:59)
    if (totalMinutes < 10 * 60) {
      return "Midnight - 10 AM";
    }
    // 10 AM to 2 PM (10:00 - 13:59)
    else if (totalMinutes < 14 * 60) {
      return "10 AM - 2 PM";
    }
    // 2 PM to Midnight (14:00 - 23:59)
    else {
      return "2 PM - Midnight";
    }
  }

  renderAggregatedTable() {
    const tbody = document.getElementById("aggregatedTableBody");
    tbody.innerHTML = "";

    if (this.readings.length === 0) {
      tbody.innerHTML =
        '<tr><td colspan="6" style="text-align: center; padding: 20px;">No readings yet. Add your first reading above!</td></tr>';
      return;
    }

    // Group readings by date and time period
    const groups = {};
    this.readings.forEach((reading) => {
      const period = this.getTimePeriod(reading.time);
      const key = `${reading.date}|${period}`;
      if (!groups[key]) {
        groups[key] = [];
      }
      groups[key].push(reading);
    });

    // Sort by date (most recent first) and then by time period
    const periodOrder = {
      "Midnight - 10 AM": 0,
      "10 AM - 2 PM": 1,
      "2 PM - Midnight": 2,
    };

    const sortedKeys = Object.keys(groups).sort((a, b) => {
      const [dateA, periodA] = a.split("|");
      const [dateB, periodB] = b.split("|");

      const dateCompare = new Date(dateB) - new Date(dateA);
      if (dateCompare !== 0) return dateCompare;

      return periodOrder[periodA] - periodOrder[periodB];
    });

    // Render each group
    sortedKeys.forEach((key) => {
      const [date, period] = key.split("|");
      const groupReadings = groups[key];
      const count = groupReadings.length;

      // Calculate averages
      const avgSystolic =
        groupReadings.reduce((sum, r) => sum + r.systolic, 0) / count;
      const avgDiastolic =
        groupReadings.reduce((sum, r) => sum + r.diastolic, 0) / count;
      const avgPulse =
        groupReadings.reduce((sum, r) => sum + r.pulse, 0) / count;

      // Round to 1 decimal place
      const systolicRounded = Math.round(avgSystolic * 10) / 10;
      const diastolicRounded = Math.round(avgDiastolic * 10) / 10;
      const pulseRounded = Math.round(avgPulse * 10) / 10;

      const bpColor = this.getBloodPressureColor(
        systolicRounded,
        diastolicRounded,
      );
      const pulseColor = this.getPulseColor(pulseRounded);

      const row = document.createElement("tr");
      row.innerHTML = `
                <td>${date}</td>
                <td>${period}</td>
                <td>${count}</td>
                <td class="${bpColor}">${systolicRounded}</td>
                <td class="${bpColor}">${diastolicRounded}</td>
                <td class="${pulseColor}">${pulseRounded}</td>
            `;

      tbody.appendChild(row);
    });
  }

  updateStatistics() {
    if (this.readings.length === 0) {
      document.getElementById("avgSystolic").textContent = "--";
      document.getElementById("avgDiastolic").textContent = "--";
      document.getElementById("avgPulse").textContent = "--";
      document.getElementById("totalReadings").textContent = "0";
      return;
    }

    const avgSystolic =
      this.readings.reduce((sum, r) => sum + r.systolic, 0) /
      this.readings.length;
    const avgDiastolic =
      this.readings.reduce((sum, r) => sum + r.diastolic, 0) /
      this.readings.length;
    const avgPulse =
      this.readings.reduce((sum, r) => sum + r.pulse, 0) / this.readings.length;

    document.getElementById("avgSystolic").textContent = avgSystolic.toFixed(1);
    document.getElementById("avgDiastolic").textContent =
      avgDiastolic.toFixed(1);
    document.getElementById("avgPulse").textContent = avgPulse.toFixed(1);
    document.getElementById("totalReadings").textContent = this.readings.length;
  }

  sortByDate() {
    this.readings.sort((a, b) => {
      const dateCompare = new Date(b.date) - new Date(a.date);
      if (dateCompare !== 0) return dateCompare;

      // Compare times when dates are the same
      return a.time.localeCompare(b.time);
    });
    this.renderTable();
  }

  // Check if File System Access API is supported
  isFileSystemAccessSupported() {
    return "showSaveFilePicker" in window;
  }

  // Auto-save to the current file handle if available
  async autoSave() {
    if (!this.fileHandle) {
      // No file selected yet, just save handle reference to localStorage
      localStorage.setItem("bpReadings_backup", JSON.stringify(this.readings));
      return;
    }

    try {
      await this.writeToFile(this.fileHandle);
    } catch (error) {
      console.error("Auto-save failed:", error);
    }
  }

  // Try to load from last saved file location
  loadLastFile() {
    // First, check localStorage for a backup (not async)
    const backup = localStorage.getItem("bpReadings_backup");
    if (backup) {
      try {
        this.readings = JSON.parse(backup);
      } catch (error) {
        console.error("Error loading backup:", error);
      }
    }
  }

  // Save data to a file
  async saveToFile() {
    if (!this.isFileSystemAccessSupported()) {
      alert(
        "File System Access API is not supported in this browser. Please use Chrome, Edge, or a recent version of Safari.",
      );
      return;
    }

    try {
      // If we already have a file handle, use it; otherwise show save dialog
      if (!this.fileHandle) {
        this.fileHandle = await window.showSaveFilePicker({
          suggestedName: `bp-readings-${
            new Date().toISOString().split("T")[0]
          }.json`,
          types: [
            {
              description: "Blood Pressure Data",
              accept: { "application/json": [".json"] },
            },
          ],
        });
      }

      await this.writeToFile(this.fileHandle);

      // Keep a backup in localStorage for quick access
      localStorage.setItem("bpReadings_backup", JSON.stringify(this.readings));

      alert("Data saved successfully!");
    } catch (error) {
      if (error.name !== "AbortError") {
        console.error("Error saving file:", error);
        alert("Error saving file: " + error.message);
      }
    }
  }

  // Write data to a file handle
  async writeToFile(fileHandle) {
    const writable = await fileHandle.createWritable();
    await writable.write(JSON.stringify(this.readings, null, 2));
    await writable.close();
  }

  // Load data from a file
  async loadFromFile() {
    if (!this.isFileSystemAccessSupported()) {
      alert(
        "File System Access API is not supported in this browser. Please use Chrome, Edge, or a recent version of Safari.",
      );
      return;
    }

    try {
      const [fileHandle] = await window.showOpenFilePicker({
        types: [
          {
            description: "Blood Pressure Data",
            accept: { "application/json": [".json"] },
          },
        ],
        multiple: false,
      });

      const file = await fileHandle.getFile();
      const content = await file.text();
      this.readings = JSON.parse(content);
      this.fileHandle = fileHandle; // Store the handle for auto-save

      // Keep a backup in localStorage
      localStorage.setItem("bpReadings_backup", JSON.stringify(this.readings));

      this.renderTable();
      this.updateStatistics();
      alert("Data loaded successfully!");
    } catch (error) {
      if (error.name !== "AbortError") {
        console.error("Error loading file:", error);
        alert("Error loading file: " + error.message);
      }
    }
  }

  exportToTextFile() {
    let content = "Blood Pressure & Pulse Readings\n";
    content += "=".repeat(60) + "\n\n";
    content += "Date\tTime\tSystolic\tDiastolic\tPulse\n";
    content += "-".repeat(60) + "\n";

    this.readings.forEach((r) => {
      content += `${r.date}\t${r.time}\t${r.systolic}\t${r.diastolic}\t${r.pulse}\n`;
    });

    content += "\n" + "=".repeat(60) + "\n";
    content += `Total Readings: ${this.readings.length}\n`;

    if (this.readings.length > 0) {
      const avgSys = (
        this.readings.reduce((s, r) => s + r.systolic, 0) / this.readings.length
      ).toFixed(1);
      const avgDia = (
        this.readings.reduce((s, r) => s + r.diastolic, 0) /
        this.readings.length
      ).toFixed(1);
      const avgPulse = (
        this.readings.reduce((s, r) => s + r.pulse, 0) / this.readings.length
      ).toFixed(1);

      content += `Average Systolic: ${avgSys}\n`;
      content += `Average Diastolic: ${avgDia}\n`;
      content += `Average Pulse: ${avgPulse}\n`;
    }

    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `bp-readings-${new Date().toISOString().split("T")[0]}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  }

  importFromTextFile() {
    const input = document.getElementById("fileInput");
    input.onchange = (e) => {
      const file = e.target.files[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const content = event.target.result;
          const lines = content.split("\n");
          const imported = [];

          for (const line of lines) {
            const parts = line.split("\t");
            // Support both old format (6 parts with reading) and new format (5 parts without)
            if (parts.length === 5 && !isNaN(parseInt(parts[2]))) {
              imported.push({
                id: Date.now() + Math.random(),
                date: parts[0],
                time: parts[1],
                systolic: parseInt(parts[2]),
                diastolic: parseInt(parts[3]),
                pulse: parseInt(parts[4]),
              });
            } else if (parts.length === 6 && !isNaN(parseInt(parts[3]))) {
              // Support old format with reading number
              imported.push({
                id: Date.now() + Math.random(),
                date: parts[0],
                time: parts[1],
                systolic: parseInt(parts[3]),
                diastolic: parseInt(parts[4]),
                pulse: parseInt(parts[5]),
              });
            }
          }

          if (imported.length > 0) {
            this.readings = [...this.readings, ...imported];
            if (this.autoSaveEnabled) {
              this.autoSave();
            }
            this.renderTable();
            this.updateStatistics();
            alert(`Successfully imported ${imported.length} readings`);
          } else {
            alert("No valid readings found in file");
          }
        } catch (error) {
          alert("Error importing file: " + error.message);
        }
      };
      reader.readAsText(file);
    };
    input.click();
  }

  clearAllData() {
    if (
      confirm(
        "Are you sure you want to delete ALL readings? This cannot be undone!",
      )
    ) {
      if (confirm("Really delete everything? This is your last chance!")) {
        this.readings = [];
        this.fileHandle = null; // Clear file handle
        if (this.autoSaveEnabled) {
          this.autoSave();
        }
        this.renderTable();
        this.updateStatistics();
        alert("All data has been cleared");
      }
    }
  }
}

// Export for testing
if (typeof module !== "undefined" && module.exports) {
  module.exports = { BPTracker };
}

// Initialize the app when the page loads
let tracker;
if (typeof window !== "undefined") {
  window.addEventListener("DOMContentLoaded", () => {
    tracker = new BPTracker();
  });
}
