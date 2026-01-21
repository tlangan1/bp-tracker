import { describe, it, expect, beforeEach, vi } from "vitest";
import { BPTracker } from "./app.js";

describe("BPTracker - Color Coding Logic", () => {
  let tracker;

  beforeEach(() => {
    // Mock DOM elements that the constructor needs
    document.body.innerHTML = `
      <input id="date" type="date" />
      <input id="time" type="time" />
      <input id="systolic" type="number" />
      <input id="diastolic" type="number" />
      <input id="pulse" type="number" />
      <button id="addBtn"></button>
      <button id="saveBtn"></button>
      <button id="loadBtn"></button>
      <button id="exportBtn"></button>
      <button id="importBtn"></button>
      <button id="sortDateBtn"></button>
      <button id="clearAllBtn"></button>
      <button id="toggleViewBtn"></button>
      <button id="backToListBtn"></button>
      <input id="fileInput" type="file" />
      <tbody id="tableBody"></tbody>
      <tbody id="aggregatedTableBody"></tbody>
      <div id="dataTable"></div>
      <div id="aggregatedView"></div>
      <span id="avgSystolic"></span>
      <span id="avgDiastolic"></span>
      <span id="avgPulse"></span>
      <span id="totalReadings"></span>
    `;

    // Mock localStorage
    global.localStorage = {
      getItem: vi.fn(),
      setItem: vi.fn(),
      removeItem: vi.fn(),
      clear: vi.fn(),
    };

    tracker = new BPTracker();
  });

  describe("getBloodPressureColor", () => {
    it("should return green for normal BP (<120 and <80)", () => {
      expect(tracker.getBloodPressureColor(110, 70)).toBe("green");
      expect(tracker.getBloodPressureColor(119, 79)).toBe("green");
    });

    it("should return yellow for elevated BP (120-129 and <80)", () => {
      expect(tracker.getBloodPressureColor(120, 75)).toBe("yellow");
      expect(tracker.getBloodPressureColor(125, 79)).toBe("yellow");
      expect(tracker.getBloodPressureColor(129, 79)).toBe("yellow");
    });

    it("should return orange for Stage 1 (130-139 or 80-89)", () => {
      expect(tracker.getBloodPressureColor(130, 75)).toBe("orange");
      expect(tracker.getBloodPressureColor(135, 85)).toBe("orange");
      expect(tracker.getBloodPressureColor(139, 89)).toBe("orange");
      expect(tracker.getBloodPressureColor(110, 80)).toBe("orange");
      expect(tracker.getBloodPressureColor(110, 85)).toBe("orange");
    });

    it("should return red for Stage 2 (≥140 or 90-119)", () => {
      expect(tracker.getBloodPressureColor(140, 70)).toBe("red");
      expect(tracker.getBloodPressureColor(150, 95)).toBe("red");
      expect(tracker.getBloodPressureColor(179, 119)).toBe("red");
      expect(tracker.getBloodPressureColor(110, 90)).toBe("red");
      expect(tracker.getBloodPressureColor(110, 100)).toBe("red");
    });

    it("should return dark-red for Crisis (≥180 or ≥120)", () => {
      expect(tracker.getBloodPressureColor(180, 70)).toBe("dark-red");
      expect(tracker.getBloodPressureColor(200, 130)).toBe("dark-red");
      expect(tracker.getBloodPressureColor(110, 120)).toBe("dark-red");
      expect(tracker.getBloodPressureColor(190, 125)).toBe("dark-red");
    });
  });

  describe("getPulseColor", () => {
    it("should return white-red-text for very low pulse (<57)", () => {
      expect(tracker.getPulseColor(50)).toBe("white-red-text");
      expect(tracker.getPulseColor(56)).toBe("white-red-text");
    });

    it("should return dark-blue for low pulse (57-61)", () => {
      expect(tracker.getPulseColor(57)).toBe("dark-blue");
      expect(tracker.getPulseColor(60)).toBe("dark-blue");
      expect(tracker.getPulseColor(61)).toBe("dark-blue");
    });

    it("should return blue for below normal pulse (62-67)", () => {
      expect(tracker.getPulseColor(62)).toBe("blue");
      expect(tracker.getPulseColor(65)).toBe("blue");
      expect(tracker.getPulseColor(67)).toBe("blue");
    });

    it("should return dark-green for good pulse (68-71)", () => {
      expect(tracker.getPulseColor(68)).toBe("dark-green");
      expect(tracker.getPulseColor(70)).toBe("dark-green");
      expect(tracker.getPulseColor(71)).toBe("dark-green");
    });

    it("should return green for normal pulse (72-75)", () => {
      expect(tracker.getPulseColor(72)).toBe("green");
      expect(tracker.getPulseColor(74)).toBe("green");
      expect(tracker.getPulseColor(75)).toBe("green");
    });

    it("should return yellow for elevated pulse (76-81)", () => {
      expect(tracker.getPulseColor(76)).toBe("yellow");
      expect(tracker.getPulseColor(80)).toBe("yellow");
      expect(tracker.getPulseColor(81)).toBe("yellow");
    });

    it("should return red for high pulse (≥82)", () => {
      expect(tracker.getPulseColor(82)).toBe("red");
      expect(tracker.getPulseColor(100)).toBe("red");
      expect(tracker.getPulseColor(150)).toBe("red");
    });
  });

  describe("getTimePeriod", () => {
    it('should return "Midnight - 10 AM" for times before 10:00', () => {
      expect(tracker.getTimePeriod("00:00")).toBe("Midnight - 10 AM");
      expect(tracker.getTimePeriod("05:30")).toBe("Midnight - 10 AM");
      expect(tracker.getTimePeriod("09:59")).toBe("Midnight - 10 AM");
    });

    it('should return "10 AM - 2 PM" for times between 10:00 and 13:59', () => {
      expect(tracker.getTimePeriod("10:00")).toBe("10 AM - 2 PM");
      expect(tracker.getTimePeriod("12:00")).toBe("10 AM - 2 PM");
      expect(tracker.getTimePeriod("13:59")).toBe("10 AM - 2 PM");
    });

    it('should return "2 PM - Midnight" for times after 14:00', () => {
      expect(tracker.getTimePeriod("14:00")).toBe("2 PM - Midnight");
      expect(tracker.getTimePeriod("18:30")).toBe("2 PM - Midnight");
      expect(tracker.getTimePeriod("23:59")).toBe("2 PM - Midnight");
    });
  });
});

describe("BPTracker - Data Management", () => {
  let tracker;

  beforeEach(() => {
    document.body.innerHTML = `
      <input id="date" type="date" />
      <input id="time" type="time" />
      <input id="systolic" type="number" />
      <input id="diastolic" type="number" />
      <input id="pulse" type="number" />
      <button id="addBtn"></button>
      <button id="saveBtn"></button>
      <button id="loadBtn"></button>
      <button id="exportBtn"></button>
      <button id="importBtn"></button>
      <button id="sortDateBtn"></button>
      <button id="clearAllBtn"></button>
      <button id="toggleViewBtn"></button>
      <button id="backToListBtn"></button>
      <input id="fileInput" type="file" />
      <tbody id="tableBody"></tbody>
      <tbody id="aggregatedTableBody"></tbody>
      <div id="dataTable"></div>
      <div id="aggregatedView"></div>
      <span id="avgSystolic"></span>
      <span id="avgDiastolic"></span>
      <span id="avgPulse"></span>
      <span id="totalReadings"></span>
    `;

    global.localStorage = {
      getItem: vi.fn(),
      setItem: vi.fn(),
      removeItem: vi.fn(),
      clear: vi.fn(),
    };

    tracker = new BPTracker();
  });

  describe("addReading", () => {
    it("should add a new reading with valid data", () => {
      document.getElementById("date").value = "2026-01-21";
      document.getElementById("time").value = "10:30";
      document.getElementById("systolic").value = "120";
      document.getElementById("diastolic").value = "80";
      document.getElementById("pulse").value = "72";

      tracker.addReading();

      expect(tracker.readings.length).toBe(1);
      expect(tracker.readings[0].systolic).toBe(120);
      expect(tracker.readings[0].diastolic).toBe(80);
      expect(tracker.readings[0].pulse).toBe(72);
    });

    it("should not add reading with missing data", () => {
      const alertSpy = vi.spyOn(window, "alert").mockImplementation(() => {});

      document.getElementById("date").value = "";
      document.getElementById("time").value = "10:30";
      document.getElementById("systolic").value = "120";
      document.getElementById("diastolic").value = "80";
      document.getElementById("pulse").value = "72";

      tracker.addReading();

      expect(tracker.readings.length).toBe(0);
      expect(alertSpy).toHaveBeenCalledWith(
        "Please fill in all fields with valid numbers"
      );

      alertSpy.mockRestore();
    });
  });

  describe("deleteReading", () => {
    it("should delete a reading by id", () => {
      tracker.readings = [
        {
          id: 1,
          date: "2026-01-21",
          time: "10:00",
          systolic: 120,
          diastolic: 80,
          pulse: 72,
        },
        {
          id: 2,
          date: "2026-01-21",
          time: "14:00",
          systolic: 125,
          diastolic: 82,
          pulse: 75,
        },
      ];

      const confirmSpy = vi.spyOn(window, "confirm").mockReturnValue(true);

      tracker.deleteReading(1);

      expect(tracker.readings.length).toBe(1);
      expect(tracker.readings[0].id).toBe(2);

      confirmSpy.mockRestore();
    });

    it("should not delete reading if user cancels", () => {
      tracker.readings = [
        {
          id: 1,
          date: "2026-01-21",
          time: "10:00",
          systolic: 120,
          diastolic: 80,
          pulse: 72,
        },
      ];

      const confirmSpy = vi.spyOn(window, "confirm").mockReturnValue(false);

      tracker.deleteReading(1);

      expect(tracker.readings.length).toBe(1);

      confirmSpy.mockRestore();
    });
  });

  describe("sortByDate", () => {
    it("should sort readings by date (newest first) and time", () => {
      tracker.readings = [
        {
          id: 1,
          date: "2026-01-20",
          time: "10:00",
          systolic: 120,
          diastolic: 80,
          pulse: 72,
        },
        {
          id: 2,
          date: "2026-01-21",
          time: "14:00",
          systolic: 125,
          diastolic: 82,
          pulse: 75,
        },
        {
          id: 3,
          date: "2026-01-21",
          time: "10:00",
          systolic: 118,
          diastolic: 78,
          pulse: 70,
        },
      ];

      tracker.sortByDate();

      // Newest date first (2026-01-21), then sorted by time (earliest time first within same date)
      expect(tracker.readings[0].id).toBe(3); // 2026-01-21 10:00
      expect(tracker.readings[1].id).toBe(2); // 2026-01-21 14:00
      expect(tracker.readings[2].id).toBe(1); // 2026-01-20 10:00
    });
  });
});
