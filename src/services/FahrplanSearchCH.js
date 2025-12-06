// SPDX-License-Identifier: MIT
/* global fetch, window */
// FahrplanSearchCH.js
// JavaScript port of the C# FahrplanSearchCH library.
// Requires a global `fetch` (browser, modern Node, or polyfill).

// Helper functions for date/time formatting
function pad2(n) {
  return String(n).padStart(2, "0");
}

function formatDateCH(date) {
  if (!(date instanceof Date) || isNaN(date)) return "";
  const d = date.getDate();
  const m = date.getMonth() + 1;
  const y = date.getFullYear();
  return `${pad2(d)}.${pad2(m)}.${y}`;
}

function formatTime(value) {
  if (!value) return "";
  const date = value instanceof Date ? value : parseSearchChDateTime(value);
  if (!date || isNaN(date)) return "";
  const h = date.getHours();
  const m = date.getMinutes();
  return `${pad2(h)}:${pad2(m)}`;
}

// Parser for the "yyyy-MM-dd HH:mm:ss" date/time format returned by fahrplan.search.ch
function parseSearchChDateTime(value) {
  if (!value) return null;
  if (value instanceof Date) return value;

  if (typeof value === "string") {
    const parts = value.split(" ");
    if (parts.length === 2) {
      const [datePart, timePart] = parts;
      const [y, m, d] = datePart.split("-").map(Number);
      const [hh, mm, ss] = timePart.split(":").map(Number);
      if (!isNaN(y) && !isNaN(m) && !isNaN(d)) {
        return new Date(y, (m || 1) - 1, d || 1, hh || 0, mm || 0, ss || 0);
      }
    }
    const d2 = new Date(value);
    if (!isNaN(d2.getTime())) return d2;
  }

  return null;
}

// -------------------------
// Completion (stations / addresses)
// -------------------------

/**
 * Call the search.ch completion API.
 * See https://search.ch/timetable/api/help.en.html for details.
 * Returns an array of suggestion objects; the taskpane only uses the
 * `label` field.
 *
 * @param {string} term  User input
 * @param {Object} [options]
 * @param {boolean} [options.nofavorites]     If true, include `nofavorites=1`
 * @param {boolean} [options.showIds]         If true, include `show_ids=1`
 * @param {boolean} [options.showCoordinates] If true, include `show_coordinates=1`
 * @returns {Promise<Object[]>}
 */
export async function fetchTimetableCompletions(term, options = {}) {
  const raw = typeof term === "string" ? term.trim() : "";
  if (!raw) return [];

  const params = [];
  params.push("term=" + encodeURIComponent(raw));

  const { nofavorites = false, showIds = false, showCoordinates = false } = options;

  if (nofavorites) {
    params.push("nofavorites=1");
  }
  if (showIds) {
    params.push("show_ids=1");
  }
  if (showCoordinates) {
    params.push("show_coordinates=1");
  }

  const url = "https://search.ch/fahrplan/api/completion.json?" + params.join("&");

  const response = await (typeof window !== "undefined" && window.fetch ? window.fetch : fetch)(
    url,
    {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
    }
  );

  if (!response.ok) {
    // For autocomplete prefer to fail silently and return no
    // suggestions rather than throwing exceptions.
    return [];
  }

  const json = await response.json();
  if (!Array.isArray(json)) {
    return [];
  }

  return json;
}

// -------------------------
// ConnectionsRequest
// -------------------------
export class ConnectionsRequest {
  /**
   * Matches the C# constructor:
   * ConnectionsRequest(from, to, via = null, dateTime = new Date(), isArrivalTime = false, limit = 4)
   * Creates a request object for route queries.
   *
   * @param {string} from
   * @param {string} to
   * @param {Object} [options]
   * @param {string[]} [options.via]
   * @param {Date|string} [options.dateTime]
   * @param {boolean} [options.isArrivalTime]
   * @param {number} [options.limit]
   */
  constructor(from, to, options = {}) {
    if (!from) throw new Error("from is required");
    if (!to) throw new Error("to is required");

    const { via = [], dateTime = new Date(), isArrivalTime = false, limit = 4 } = options;

    this.from = from;
    this.to = to;
    this.via = Array.isArray(via) ? via : via ? [via] : [];
    this.dateTime = dateTime instanceof Date ? dateTime : new Date(dateTime);
    this.isArrivalTime = !!isArrivalTime;
    this.limit = limit;
  }

  _buildUrl() {
    const params = [];

    params.push("from=" + encodeURIComponent(this.from.trim()));
    params.push("to=" + encodeURIComponent(this.to.trim()));
    params.push("date=" + encodeURIComponent(formatDateCH(this.dateTime)));
    params.push("time=" + encodeURIComponent(formatTime(this.dateTime)));

    if (this.isArrivalTime) {
      // arrival-time query: request `pre` previous connections
      params.push("time_type=arrival");
      params.push("num=1");
      params.push("pre=" + String(this.limit));
    } else {
      // departure-time query: request `num` upcoming connections
      params.push("time_type=depart");
      params.push("num=" + String(this.limit));
      params.push("pre=1");
    }

    for (const v of this.via) {
      if (typeof v === "string" && v.trim() !== "") {
        params.push("via[]=" + encodeURIComponent(v.trim()));
      }
    }

    return "https://search.ch/fahrplan/api/route.json?" + params.join("&");
  }

  /**
   * Fetch route data and return a `ConnectionsResponse` instance.
   * Similar to GetConnectionsAsync() in the original C# library.
   */
  async getConnectionsAsync() {
    const url = this._buildUrl();
    const response = await (typeof window !== "undefined" && window.fetch ? window.fetch : fetch)(
      url,
      {
        method: "GET",
        headers: {
          Accept: "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP ${response.status} ${response.statusText}`);
    }

    const json = await response.json();
    return new ConnectionsResponse(json);
  }
}

// -------------------------
// ConnectionsResponse
// -------------------------
export class ConnectionsResponse {
  /**
   * @param {Object} json
   */
  constructor(json = {}) {
    this.Count = typeof json.count === "number" ? json.count : json.Count || 0;
    const consJson = json.connections || json.Connections || [];
    this.Connections = Array.isArray(consJson) ? consJson.map((c) => new Connection(c)) : [];
  }
}

function getLegEmoji(leg) {
  const type = (leg.Type || "").toLowerCase();
  const typeName = (leg.TypeName || "").toLowerCase();

  // Zug / S-Bahn
  if (
    type === "train" ||
    type === "strain" ||
    typeName.includes("s-bahn") ||
    typeName.includes("bahn") ||
    typeName.includes("zug")
  ) {
    return "🚆";
  }

  // Bus / Postauto
  if (
    type === "bus" ||
    type === "post" ||
    typeName.includes("bus") ||
    typeName.includes("postauto")
  ) {
    return "🚍";
  }

  // Tram
  if (type === "tram" || typeName.includes("tram")) {
    return "🚊";
  }

  // Schiff
  if (
    type === "ship" ||
    type === "boat" ||
    typeName.includes("schiff") ||
    typeName.includes("boot")
  ) {
    return "⛴️";
  }

  return "";
}

// -------------------------
// Connection
// -------------------------
export class Connection {
  /**
   * @param {Object} json
   */
  constructor(json = {}) {
    this.From = json.from || json.From || "";
    this.Departure = parseSearchChDateTime(json.departure || json.Departure);
    this.To = json.to || json.To || "";
    this.Arrival = parseSearchChDateTime(json.arrival || json.Arrival);

    this._durationSeconds = 0;
    if (typeof json.duration !== "undefined" && json.duration !== null) {
      this.Duration = json.duration; // Setter
    }

    const legsJson = json.legs || json.Legs || [];
    this.Legs = Array.isArray(legsJson) ? legsJson.map((l) => new Leg(l)) : [];
  }

  // Duration property (total seconds), matching the C# implementation.
  get Duration() {
    return this._durationSeconds;
  }

  set Duration(value) {
    const n = Number(value);
    this._durationSeconds = Number.isFinite(n) ? n : 0;
  }

  // DurationTS equivalent (TimeSpan) — represented here as seconds.
  get DurationTS() {
    return this._durationSeconds;
  }

  set DurationTS(value) {
    const n = Number(value);
    if (Number.isFinite(n)) {
      this._durationSeconds = n;
    }
  }

  // Transfers count — roughly equivalent to the C# implementation.
  get Transfers() {
    let number = -1;
    for (const leg of this.Legs) {
      if (leg.Type !== "walk" && leg.Exit) {
        number = number + 1;
      }
    }
    return number;
  }

  // Equivalent to ToShortString()
  toShortString() {
    return (
      this.From +
      " (" +
      formatTime(this.Departure) +
      ")-[" +
      this.Legs.length +
      "]-" +
      this.To +
      " (" +
      formatTime(this.Arrival) +
      ") (" +
      this.Duration +
      ")"
    );
  }

  // ViaString property (getter calls getViaString())
  get ViaString() {
    return this.getViaString();
  }

  // Build a readable via-string for intermediate stops.
  getViaString() {
    if (!this.Legs || this.Legs.length === 2) {
      return "direkt";
    }

    let vias = "via ";
    let station = "";

    for (const l of this.Legs) {
      if (l.Exit) {
        if (l.Name === station) {
          if (station !== "") {
            vias += "/";
            vias += formatTime(l.Departure);
            vias += ")";
          }
        }

        station = l.Exit.Name;
        if (station !== this.To) {
          if (l.Name !== this.From) {
            vias += "-";
          }
          vias += station;
          vias += " (";
          vias += formatTime(l.Exit.Arrival);
        }
      }
    }

    return vias;
  }

  /**
   * Return a compact single-line summary of legs using emojis.
   * Example:
   * Neuenegg, Tennis · (🚶‍➡️10’) · Neuenegg (↗️14:15, 🚆 S2) → Bern (↘️14:40) · (🚶‍➡️6’) · ...
   */
  toEmojiSummary() {
    if (!this.Legs || !Array.isArray(this.Legs) || this.Legs.length === 0) {
      return "";
    }

    const legs = this.Legs;
    const segments = [];

    // simple walk-leg detection: type == "walk"
    const isWalkLeg = (l) => !!l && l.Type === "walk";

    // Only prefix the origin when the connection begins with a walking leg
    // (e.g. "Neuenegg, Tennis · (🚶‍➡️10’) · Neuenegg (...)")
    const firstLeg = legs[0];
    if (firstLeg && isWalkLeg(firstLeg) && firstLeg.Name) {
      segments.push(firstLeg.Name);
    }

    for (let i = 0; i < legs.length; i++) {
      const l = legs[i];
      if (!l || !l.Exit) continue;

      const nextLeg = i + 1 < legs.length ? legs[i + 1] : null;

      const hasLine = !!l.Line;
      const hasTypeName = !!l.TypeName;

      const runningSecsRaw =
        typeof l.Runningtime === "number" ? l.Runningtime : Number(l.Runningtime) || 0;
      const runningSecs = Number.isFinite(runningSecsRaw) ? runningSecsRaw : 0;

      const depMs = l.Departure instanceof Date ? l.Departure.getTime() : NaN;
      const hasValidDeparture = Number.isFinite(depMs);

      // ignore 'dummy' legs (arrival only, no line, no running time)
      if (!hasLine && !hasTypeName && runningSecs === 0 && !hasValidDeparture) {
        continue;
      }

      const fromName = l.Name || "";
      const toName = (l.Exit && l.Exit.Name) || "";
      const dep = hasValidDeparture ? formatTime(l.Departure) : "";
      const arr = l.Exit && l.Exit.Arrival ? formatTime(l.Exit.Arrival) : "";

      const isWalk = isWalkLeg(l);

      if (isWalk) {
        if (runningSecs <= 0) {
          continue;
        }

        const minutes = Math.round(runningSecs / 60);
        const minutesStr = minutes ? `${minutes}′` : "";

        // (🚶‍➡️10′)
        segments.push(`(🚶‍➡️${minutesStr}`);
        // Only mention the destination stop separately for the final walk leg
        if (!nextLeg && toName) {
          segments.push(toName);
        }
      } else {
        const emoji = getLegEmoji(l);
        const lineText = l.Line ? ` ${l.Line}` : "";

        const fromParts = [];
        if (dep) fromParts.push(`↗️${dep}`);
        if (emoji || lineText) {
          fromParts.push(`${emoji}${lineText}`.trim());
        }

        const fromSeg = fromName + (fromParts.length ? ` (${fromParts.join(", ")})` : "");

        const toSeg = arr ? `${toName} (↘️${arr})` : toName;

        segments.push(`${fromSeg} → ${toSeg}`);
      }
    }

    return segments.join(" · ");
  }

  /**
   * Return a very compact route chain without station names, e.g.:
   * 🚍130🚶‍➡️2’🚆S1🚶‍➡️6’🚍104
   * Built only from the legs returned by the API.
   */
  toEmojiRouteChain() {
    if (!this.Legs || !Array.isArray(this.Legs) || this.Legs.length === 0) {
      return "";
    }

    let chain = "";

    for (let i = 0; i < this.Legs.length; i++) {
      const l = this.Legs[i];
      if (!l || !l.Exit) continue;

      const hasLine = !!l.Line;
      const hasTypeName = !!l.TypeName;

      const runningSecsRaw =
        typeof l.Runningtime === "number" ? l.Runningtime : Number(l.Runningtime) || 0;
      const runningSecs = Number.isFinite(runningSecsRaw) ? runningSecsRaw : 0;

      const depMs = l.Departure instanceof Date ? l.Departure.getTime() : NaN;
      const hasValidDeparture = Number.isFinite(depMs);

      // ignore 'dummy' legs (arrival only, no line, no running time)
      if (!hasLine && !hasTypeName && runningSecs === 0 && !hasValidDeparture) {
        continue;
      }

      // Walk leg?
      if (l.Type === "walk") {
        if (runningSecs <= 0) {
          continue;
        }

        const minutes = Math.round(runningSecs / 60);
        const minutesStr = minutes ? `${minutes}′` : "";
        chain += `🚶‍➡️${minutesStr}`;
      } else {
        // Public-transport leg (train, bus, tram, ship, ...)
        const emoji = getLegEmoji(l);
        const lineText = l.Line || "";

        if (emoji || lineText) {
          chain += `${emoji}${lineText}`;
        }
      }
    }

    return chain;
  }
}

// -------------------------
// Leg
// -------------------------
export class Leg {
  /**
   * @param {Object} json
   */
  constructor(json = {}) {
    this.Departure = parseSearchChDateTime(json.departure || json.Departure);
    this.Name = json.name || json.Name || "";
    this.Line = json.line || json.Line || null;
    this.Type = json.type || json.Type || "";
    this.TypeName = json.type_name || json.TypeName || "";
    const exitJson = json.exit || json.Exit || null;
    this.Exit = exitJson ? new Exit(exitJson) : null;
    const running =
      typeof json.runningtime !== "undefined" && json.runningtime !== null
        ? json.runningtime
        : json.Runningtime || 0;
    this.Runningtime = Number(running);
  }
}

// -------------------------
// Exit
// -------------------------
export class Exit {
  /**
   * @param {Object} json
   */
  constructor(json = {}) {
    this.Name = json.name || json.Name || "";
    this.Arrival = parseSearchChDateTime(json.arrival || json.Arrival);
  }
}
