#!/usr/bin/env node

const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

/**
 * Parse ICS file and extract events
 */
function parseICS(filePath) {
  const content = fs.readFileSync(filePath, "utf-8");
  const lines = content.split("\n");

  const events = [];
  let currentEvent = {};
  let inEvent = false;

  for (let i = 0; i < lines.length; i++) {
    let line = lines[i].trim();

    // Handle line folding (continuation lines start with space)
    while (i + 1 < lines.length && lines[i + 1].startsWith(" ")) {
      i++;
      line += lines[i].substring(1);
    }

    if (line === "BEGIN:VEVENT") {
      inEvent = true;
      currentEvent = {};
    } else if (line === "END:VEVENT") {
      inEvent = false;
      if (Object.keys(currentEvent).length > 0) {
        events.push(currentEvent);
      }
    } else if (inEvent && line.includes(":")) {
      const colonIndex = line.indexOf(":");
      const keyPart = line.substring(0, colonIndex);
      const value = line.substring(colonIndex + 1);

      // Parse key and parameters
      const parts = keyPart.split(";");
      const key = parts[0].trim();
      const params = {};

      for (let j = 1; j < parts.length; j++) {
        const [pKey, pValue] = parts[j].split("=");
        if (pKey) {
          params[pKey.trim()] = pValue?.trim();
        }
      }

      if (Object.keys(params).length > 0) {
        currentEvent[key] = { value: value.trim(), params };
      } else {
        currentEvent[key] = value.trim();
      }
    }
  }

  return events;
}

/**
 * Extract value from field (handles both string and object with params)
 * Also sanitizes the string to remove problematic characters
 */
function getFieldValue(field) {
  let value = "";
  if (typeof field === "string") {
    value = field;
  } else if (field && field.value) {
    value = field.value;
  }

  // Clean up various problematic patterns
  // Replace HTML tags
  value = value.replace(/<[^>]*>/g, " ");
  // Replace &nbsp; and other HTML entities
  value = value.replace(/&[a-z]+;/g, " ");
  // Replace literal \r and \n with spaces
  value = value.replace(/\\r/g, " ").replace(/\\n/g, " ");
  // Remove backslashes
  value = value.replace(/\\/g, "");
  // Replace problematic Unicode quotes with regular quotes
  value = value.replace(/[""]/g, '"').replace(/['']/g, "'");
  // Remove other problematic Unicode characters (dashes, ellipsis, etc)
  value = value.replace(/[–—]/g, "-");
  // Remove newlines and carriage returns
  value = value.replace(/[\r\n]/g, " ");
  // Collapse multiple spaces
  value = value.replace(/\s+/g, " ").trim();

  return value;
} /**
 * Parse ICS date format (YYYYMMDD or YYYYMMDDTHHmmssZ) to ISO 8601
 */
function parseICSDate(dateStr) {
  if (!dateStr) return null;

  dateStr = dateStr.replace("Z", "");

  // Handle DATE format (YYYYMMDD)
  if (dateStr.length === 8) {
    return `${dateStr.substring(0, 4)}-${dateStr.substring(4, 6)}-${dateStr.substring(6, 8)}T00:00:00Z`;
  }

  // Handle DATETIME format (YYYYMMDDTHHmmss)
  if (dateStr.includes("T")) {
    const date = dateStr.substring(0, 8);
    const time = dateStr.substring(9);
    return `${date.substring(0, 4)}-${date.substring(4, 6)}-${date.substring(6, 8)}T${time.substring(0, 2)}:${time.substring(2, 4)}:${time.substring(4, 6)}Z`;
  }

  return null;
}

/**
 * Generate unique ID from UID
 */
function generateId(uid) {
  return crypto.createHash("md5").update(uid).digest("hex").substring(0, 12);
}

/**
 * Convert raw ICS event to CalendarEvent format matching Gmail API spec
 */
function formatEvent(rawEvent, index) {
  const uid = getFieldValue(rawEvent.UID) || `event-${index}`;
  const startDate = parseICSDate(getFieldValue(rawEvent.DTSTART));
  const endDate = parseICSDate(getFieldValue(rawEvent.DTEND));

  return {
    id: generateId(uid),
    calendarId: "music",
    calendarName: "Federales",
    title: getFieldValue(rawEvent.SUMMARY) || "Untitled Event",
    description: getFieldValue(rawEvent.DESCRIPTION) || "",
    startTime: startDate,
    endTime: endDate,
    confirmed: getFieldValue(rawEvent.STATUS) === "CONFIRMED",
    venue: getFieldValue(rawEvent.LOCATION) || null,
  };
}

/**
 * Main conversion function
 */
function convertICStoJSON(inputPath, outputPath) {
  console.log(`📖 Reading ICS file: ${inputPath}`);
  const rawEvents = parseICS(inputPath);

  console.log(`📦 Parsed ${rawEvents.length} events`);

  const events = rawEvents
    .map((evt, idx) => formatEvent(evt, idx))
    .filter((evt) => evt.startTime && evt.endTime); // Filter out events with missing dates

  console.log(
    `✅ Formatted ${events.length} events (removed ${rawEvents.length - events.length} with missing dates)`,
  );

  fs.writeFileSync(outputPath, JSON.stringify(events, null, 2), "utf-8");

  console.log(`✅ Saved to: ${outputPath}`);
  console.log(`\n📊 Sample event:`);
  if (events.length > 0) {
    console.log(JSON.stringify(events[0], null, 2));
  }
}

// Run conversion
const inputFile = path.join(__dirname, "src/assets/Federales.ics");
const outputFile = path.join(__dirname, "src/assets/music-calendar.json");

if (!fs.existsSync(inputFile)) {
  console.error(`❌ Input file not found: ${inputFile}`);
  process.exit(1);
}

convertICStoJSON(inputFile, outputFile);
