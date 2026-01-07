// SPDX-License-Identifier: MIT
/* eslint-disable @typescript-eslint/no-unused-vars */
/*
 * OutlookSwissPTTimetable – Taskpane logic
 */

/* global document, Office, console, window, navigator, alert, setTimeout, clearTimeout, Event */

import { ConnectionsRequest, fetchTimetableCompletions } from "../services/FahrplanSearchCH.js";
import { owpttTranslations } from "./owpttTranslations.js";

/* ------------------------------------------------------------------------- */
/*   I18N-UTILITY                                                            */
/* ------------------------------------------------------------------------- */

let owpttCurrentLocale = "en-GB";

function detectLocale() {
  try {
    const lang = (Office.context && Office.context.displayLanguage) || "";
    const l = lang.toLowerCase();
    if (l.startsWith("de")) return "de-CH";
    if (l.startsWith("fr")) return "fr-CH";
    if (l.startsWith("it")) return "it-CH";
    if (l.startsWith("rm")) return "rm-CH";
  } catch {
    // ignore
  }
  return "en-GB";
}

/**
 * Validate that all translation keys from en-GB exist in the target locale.
 * Falls back to en-GB if any keys are missing.
 */
function validateLocaleTranslations(locale) {
  const baseLocale = "en-GB";
  const baseDict = owpttTranslations[baseLocale] || {};
  const dict = owpttTranslations[locale];

  // If no translation entry exists for the locale, fall back to en-GB
  if (!dict) {
    console.warn(
      `[OWPTT] No translations for locale "${locale}". Falling back to "${baseLocale}".`
    );
    return baseLocale;
  }

  const missingKeys = [];
  for (const key of Object.keys(baseDict)) {
    if (!Object.prototype.hasOwnProperty.call(dict, key)) {
      missingKeys.push(key);
    }
  }

  if (missingKeys.length > 0) {
    console.warn(
      `[OWPTT] Locale "${locale}" is missing ${missingKeys.length} translation key(s). ` +
        `Falling back to "${baseLocale}". Missing keys:`,
      missingKeys
    );
    return baseLocale;
  }

  return locale;
}

function getTranslationsForLocale(locale) {
  return owpttTranslations[locale] || owpttTranslations["en-GB"] || {};
}

/**
 * t("key", "fallback text")
 * Retrieve a translation string by key, with optional fallback.
 */
function t(key, defaultText) {
  const dict = getTranslationsForLocale(owpttCurrentLocale);
  if (Object.prototype.hasOwnProperty.call(dict, key)) {
    return dict[key];
  }
  const fallbackDict = getTranslationsForLocale("en-GB");
  if (Object.prototype.hasOwnProperty.call(fallbackDict, key)) {
    return fallbackDict[key];
  }
  return defaultText || key;
}

/**
 * Apply translations from the i18n table to all elements with data-i18n* attributes.
 */
function applyTranslations() {
  const dict = getTranslationsForLocale(owpttCurrentLocale);

  document.querySelectorAll("[data-i18n]").forEach((el) => {
    const key = el.getAttribute("data-i18n");
    const value = dict[key];
    if (value) {
      el.textContent = value;
    }
  });

  document.querySelectorAll("[data-i18n-placeholder]").forEach((el) => {
    const key = el.getAttribute("data-i18n-placeholder");
    const value = dict[key];
    if (value) {
      el.setAttribute("placeholder", value);
    }
  });

  document.querySelectorAll("[data-i18n-aria-label]").forEach((el) => {
    const key = el.getAttribute("data-i18n-aria-label");
    const value = dict[key];
    if (value) {
      el.setAttribute("aria-label", value);
    }
  });
}

/* ------------------------------------------------------------------------- */
/*   READ MODE VS COMPOSE MODE DETECTION                                    */
/* ------------------------------------------------------------------------- */

/**
 * Detect whether the add-in is running in Read mode or Compose mode.
 * In Read mode, appointment properties are accessed directly (e.g., item.subject is a string).
 * In Compose mode, appointment properties use .getAsync() callbacks.
 */
function detectReadVsComposeMode() {
  try {
    const mailbox = Office.context && Office.context.mailbox;
    const item = mailbox && mailbox.item;

    if (!item) {
      // No item = unusual state, assume Read mode (safest default)
      return { isReadMode: true, isComposeMode: false };
    }

    // Check the concrete type: ReadCompose vs Appointment
    const itemType = item.itemType;
    
    // In Outlook, "message" and "appointment" types have both Read and Compose variants
    // However, the most reliable check is:
    // - Read mode: item.subject is a string, item.start is a Date
    // - Compose mode: item.subject.getAsync is a function, item.start.getAsync is a function

    const subjectHasGetAsync = typeof item.subject?.getAsync === "function";
    const startHasGetAsync = typeof item.start?.getAsync === "function";

    const isComposeMode = subjectHasGetAsync && startHasGetAsync;
    const isReadMode = !isComposeMode;

    console.log(
      `[OWPTT] Mode detected: ${isReadMode ? "READ" : "COMPOSE"} (itemType=${itemType})`
    );

    return { isReadMode, isComposeMode };
  } catch (e) {
    console.warn("[OWPTT] Error detecting mode, assuming Read mode:", e);
    return { isReadMode: true, isComposeMode: false };
  }
}

/* ------------------------------------------------------------------------- */
/*   STATE                                                                   */
/* ------------------------------------------------------------------------- */

let owpttInboundConnections = [];
let owpttOutboundConnections = [];

let owpttInboundContext = null;
let owpttOutboundContext = null;

let owpttInboundSelectedIndex = 0;
let owpttOutboundSelectedIndex = 0;

let owpttIsReadMode = false;
let owpttIsComposeMode = false;

// Consistent line break for appointment body text
const OWPTT_NL = "\r\n";

/* ------------------------------------------------------------------------- */
/*   FAVOURITE STOPS (STANDARD STOPS)                                         */
/* ------------------------------------------------------------------------- */

const OWPTT_FAV_STOPS_STORAGE_KEY = "owpttFavoriteStopsV1";
const OWPTT_LANGUAGE_STORAGE_KEY = "owpttLanguagePreferenceV1";

let owpttFavoriteStops = [];
let owpttFavoriteStopsSelectedIndex = -1;
let owpttLanguagePreference = "auto"; // "auto" or specific locale like "de-CH"

// (Display settings removed)

function loadFavoriteStops() {
  try {
    const raw =
      typeof window !== "undefined" && window.localStorage
        ? window.localStorage.getItem(OWPTT_FAV_STOPS_STORAGE_KEY)
        : null;
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed
      .map((entry) => {
        if (!entry) return null;
        const name = typeof entry.name === "string" ? entry.name.trim() : "";
        if (!name) return null;
        const wm = Number(entry.walkMinutes);
        return {
          name,
          walkMinutes: Number.isFinite(wm) && wm >= 0 ? wm : 0,
        };
      })
      .filter(Boolean);
  } catch (e) {
    console.error("loadFavoriteStops failed:", e);
    return [];
  }
}

function saveFavoriteStops() {
  try {
    if (!owpttFavoriteStops || !Array.isArray(owpttFavoriteStops)) return;
    const compact = owpttFavoriteStops
      .filter((s) => s && typeof s.name === "string" && s.name.trim() !== "")
      .map((s) => ({
        name: s.name.trim(),
        walkMinutes:
          Number.isFinite(Number(s.walkMinutes)) && Number(s.walkMinutes) >= 0
            ? Math.round(Number(s.walkMinutes))
            : 0,
      }));
    if (typeof window !== "undefined" && window.localStorage) {
      window.localStorage.setItem(OWPTT_FAV_STOPS_STORAGE_KEY, JSON.stringify(compact));
    }
    updateFavoriteStopsJson();
  } catch (e) {
    console.error("saveFavoriteStops failed:", e);
  }
}

function setFavoriteStops(list) {
  owpttFavoriteStops = Array.isArray(list) ? list : [];
  owpttFavoriteStopsSelectedIndex =
    owpttFavoriteStops.length > 0
      ? Math.min(owpttFavoriteStopsSelectedIndex, owpttFavoriteStops.length - 1)
      : -1;
  saveFavoriteStops();
  renderFavoriteStopsDatalist();
  renderFavoriteStopsEditor();
}

/**
 * Populate the global datalist element for the three station fields.
 */
function renderFavoriteStopsDatalist() {
  const dl = document.getElementById("owptt-favorite-stops-list");
  if (!dl) return;
  dl.innerHTML = "";
  if (!owpttFavoriteStops || owpttFavoriteStops.length === 0) return;

  owpttFavoriteStops.forEach((stop, index) => {
    const opt = document.createElement("option");
    opt.value = stop.name;
    opt.dataset.walkMinutes = String(
      Number.isFinite(Number(stop.walkMinutes)) && Number(stop.walkMinutes) >= 0
        ? Math.round(Number(stop.walkMinutes))
        : 0
    );
    opt.dataset.index = String(index);
    dl.appendChild(opt);
  });
}

/* ------------------------------------------------------------------------- */
/*   SEARCH.CH AUTOCOMPLETION                                                */
/* ------------------------------------------------------------------------- */

let owpttCompletionRequestSeq = 0;
let owpttCompletionLatestAppliedSeq = 0;

/**
 * Update the shared datalist with suggestions from the search.ch completion API.
 * Existing favourite stops are retained; only previous completion options are replaced.
 *
 * @param {Array<{label:string}>} suggestions
 */
function owpttApplyCompletionSuggestions(
  suggestions,
  { datalistId = "owptt-favorite-stops-list", keepFavorites = true } = {}
) {
  const dl = document.getElementById(datalistId);
  if (!dl) return;

  if (keepFavorites) {
    // Remove only previous completion options; keep favourites
    const old = dl.querySelectorAll("option.owptt-completion");
    old.forEach((opt) => opt.remove());
  } else {
    // Clear all (completion-only variant)
    dl.innerHTML = "";
  }

  if (!Array.isArray(suggestions)) return;

  suggestions.forEach((item) => {
    if (!item || typeof item.label !== "string") return;
    const opt = document.createElement("option");
    opt.value = item.label;
    opt.classList.add("owptt-completion");
    dl.appendChild(opt);
  });
}

// Global reference to which input currently owns the visible suggestion box
let owpttSuggestionsOwnerInput = null;
let owpttItemClickJustFired = false;

// Global document click handler for the shared suggestion box
// (registered once, not per-input)
if (typeof document !== "undefined") {
  document.addEventListener("click", (ev) => {
    const suggestionBox = document.getElementById("owptt-suggestions");
    if (!suggestionBox || suggestionBox.hidden) return;

    // Only process clicks if an input owns the suggestions
    if (!owpttSuggestionsOwnerInput) return;

    // If an item click just fired, don’t process the document click
    if (owpttItemClickJustFired) {
      owpttItemClickJustFired = false;
      return;
    }

    // Check if click is inside the suggestion box or the owning input
    const path = ev.composedPath ? ev.composedPath() : ev.path || [];
    if (path && path.length > 0) {
      if (path.indexOf(owpttSuggestionsOwnerInput) !== -1 || path.indexOf(suggestionBox) !== -1)
        return;
    } else {
      if (ev.target === owpttSuggestionsOwnerInput || suggestionBox.contains(ev.target)) return;
    }

    // Click outside: clear suggestions
    owpttSuggestionsOwnerInput = null;
    suggestionBox.innerHTML = "";
    suggestionBox.hidden = true;
    suggestionBox.setAttribute("aria-hidden", "true");
  });
}
/* Link a text field to search.ch autocompletion.
 * Expects the field to use the shared datalist #owptt-favorite-stops-list.
 *
 * @param {HTMLInputElement|null} input
 */
function attachSearchChStationCompletion(
  input,
  { datalistId = "owptt-favorite-stops-list", keepFavorites = true } = {}
) {
  if (!input) return;

  // Ensure the field uses the correct datalist (fallback for hosts that still show it).
  // Only set the `list` attribute if a datalist element with that id actually exists.
  if (datalistId) {
    const dl = document.getElementById(datalistId);
    if (dl) {
      input.setAttribute("list", datalistId);
    }
  }

  const suggestionBox = document.getElementById("owptt-suggestions");
  let lastTerm = "";
  let items = [];
  let activeIndex = -1;
  let blurTimeout = null;
  let userSelecting = false;
  let itemClickJustFired = false;
  let skipAutocompletionOnce = false;
  let pointerOverSuggestionBox = false;

  function clearSuggestions() {
    // Only clear if this input owns the suggestions (prevent other inputs from clearing)
    if (owpttSuggestionsOwnerInput !== input) return;
    items = [];
    activeIndex = -1;
    if (suggestionBox) {
      suggestionBox.innerHTML = "";
      suggestionBox.hidden = true;
      suggestionBox.setAttribute("aria-hidden", "true");
    }
    owpttSuggestionsOwnerInput = null;
  }

  function logEvent(name, ev) {
    try {
      const time = new Date().toISOString().slice(11, 23);
      const targetDesc =
        ev && ev.type
          ? ev.target && ev.target.tagName
            ? `${ev.target.tagName.toLowerCase()}`
            : String(ev.target)
          : "-";
      // Also output to console for environments where developer tools are attached

      console.debug(`[owptt-suggest] ${name} @ ${time}`, ev && ev.type ? ev : ev);
    } catch (e) {
      // ignore logging failures
    }
  }

  function positionSuggestionBox() {
    if (!suggestionBox) return;
    // Only reposition if this input is the current owner of the suggestion box
    if (owpttSuggestionsOwnerInput !== input) return;
    try {
      const rect = input.getBoundingClientRect();
      const left = rect.left + window.pageXOffset;
      const top = rect.bottom + window.pageYOffset;
      suggestionBox.style.left = `${left}px`;
      suggestionBox.style.top = `${top}px`;
      suggestionBox.style.width = `${Math.max(160, rect.width)}px`;
    } catch {
      // ignore positioning errors
    }
  }

  function setActive(idx) {
    if (!suggestionBox) return;
    const children = Array.from(suggestionBox.querySelectorAll(".owptt-suggestion-item"));
    children.forEach((c) => c.classList.remove("owptt-selected"));
    if (typeof idx !== "number" || idx < 0 || idx >= children.length) {
      activeIndex = -1;
      return;
    }
    children[idx].classList.add("owptt-selected");
    activeIndex = idx;
    // ensure visible
    const el = children[idx];
    if (el && typeof el.scrollIntoView === "function") {
      el.scrollIntoView({ block: "nearest" });
    }
  }

  function acceptActive() {
    if (activeIndex >= 0 && items && items[activeIndex]) {
      const val = items[activeIndex].label || "";
      input.value = val;
      input.dispatchEvent(new Event("input", { bubbles: true }));
      clearSuggestions();
      input.focus();
      return true;
    }
    return false;
  }

  function renderSuggestions(suggestions) {
    if (!suggestionBox) return;
    suggestionBox.innerHTML = "";
    if (!Array.isArray(suggestions) || suggestions.length === 0) {
      clearSuggestions();
      return;
    }

    suggestions.forEach((s, i) => {
      if (!s || typeof s.label !== "string") return;
      const item = document.createElement("div");
      item.className = "owptt-suggestion-item";
      item.textContent = s.label;
      item.dataset.value = s.label;
      item.dataset.index = String(i);

      item.addEventListener("mousedown", () => {
        // Cancel the blur timeout so the popup isn’t cleared while the user
        // presses the mouse button to select an item. Do not call
        // preventDefault() here — allow normal mouse handling.
        if (blurTimeout) {
          clearTimeout(blurTimeout);
          blurTimeout = null;
        }
      });
      // Also handle pointerdown / touchstart for hosts that prefer pointer events
      item.addEventListener("pointerdown", () => {
        if (blurTimeout) {
          clearTimeout(blurTimeout);
          blurTimeout = null;
        }
        userSelecting = true;
      });
      item.addEventListener("touchstart", () => {
        if (blurTimeout) {
          clearTimeout(blurTimeout);
          blurTimeout = null;
        }
        userSelecting = true;
      });

      item.addEventListener("click", () => {
        const selectedValue = item.dataset.value || "";
        input.value = selectedValue;
        // Signal that the next input event should skip autocompletion
        skipAutocompletionOnce = true;
        input.dispatchEvent(new Event("input", { bubbles: true }));
        // Also dispatch a change event so settings editors listening on 'change'
        // will pick up programmatic value selections and persist them — but only
        // when the input is inside the settings dialog (do not fire globally).
        try {
          if (
            input &&
            typeof input.closest === "function" &&
            input.closest("#owptt-settings-overlay")
          ) {
            input.dispatchEvent(new Event("change", { bubbles: true }));
          }
        } catch {
          // ignore
        }

        // Set walk time based on whether this is a favourite or autocompletion
        try {
          const isFavorite =
            Array.isArray(owpttFavoriteStops) &&
            owpttFavoriteStops.some(
              (s) => s.name.toLocaleLowerCase() === selectedValue.toLocaleLowerCase()
            );

          // Find the associated walk time input (meeting-walk-minutes, in-walk-minutes, or out-walk-minutes)
          let walkTimeInput = null;
          if (input.id === "meeting-station") {
            walkTimeInput = document.getElementById("meeting-walk-minutes");
          } else if (input.id === "in-from-station") {
            walkTimeInput = document.getElementById("in-walk-minutes");
          } else if (input.id === "out-to-station") {
            walkTimeInput = document.getElementById("out-walk-minutes");
          }

          if (walkTimeInput) {
            if (isFavorite) {
              // Favourite: use preset walk time
              const fav = owpttFavoriteStops.find(
                (s) => s.name.toLocaleLowerCase() === selectedValue.toLocaleLowerCase()
              );
              if (fav) {
                walkTimeInput.value = String(Math.round(fav.walkMinutes || 0));
              }
            } else {
              // Autocompletion: set walk time to 0
              walkTimeInput.value = "0";
            }
          }
        } catch {
          // ignore walk time setting errors
        }

        // Signal to global document click handler that we already handled this
        owpttItemClickJustFired = true;
        clearSuggestions();
        input.focus();
      });

      item.addEventListener("mouseover", () => setActive(i));

      suggestionBox.appendChild(item);
    });

    items = suggestions.slice();
    activeIndex = -1;
    // Update owner first, then position
    owpttSuggestionsOwnerInput = input;
    positionSuggestionBox();
    suggestionBox.hidden = false;
    suggestionBox.removeAttribute("aria-hidden");
  }

  function onInputBlur() {
    // Delay clear to allow clicks on suggestion items to register.
    if (blurTimeout) clearTimeout(blurTimeout);
    blurTimeout = setTimeout(() => {
      clearSuggestions();
    }, 800);
  }

  function onInputFocus() {
    if (blurTimeout) {
      clearTimeout(blurTimeout);
      blurTimeout = null;
    }
    // If the field is empty and we keep favourites, show them as default suggestions
    try {
      const val = (input.value || "").trim();
      if (
        val === "" &&
        keepFavorites &&
        Array.isArray(owpttFavoriteStops) &&
        owpttFavoriteStops.length > 0
      ) {
        const favSuggestions = owpttFavoriteStops.map((s) => ({ label: s.name }));
        renderSuggestions(favSuggestions);
        // When ownership changes to this input, reposition immediately
        if (owpttSuggestionsOwnerInput === input) {
          positionSuggestionBox();
        }
      }
    } catch {
      // ignore
    }
  }

  // Also show favourites on click (always) when favourites are enabled
  input.addEventListener("click", () => {
    try {
      if (keepFavorites && Array.isArray(owpttFavoriteStops) && owpttFavoriteStops.length > 0) {
        const favSuggestions = owpttFavoriteStops.map((s) => ({ label: s.name }));
        renderSuggestions(favSuggestions);
        // When ownership changes to this input, reposition immediately
        if (owpttSuggestionsOwnerInput === input) {
          positionSuggestionBox();
        }
      }
    } catch {
      // ignore
    }
  });

  // Clear suggestions if user moves mouse away from both input and suggestion box
  input.addEventListener("mouseleave", () => {
    // Don’t immediately close when leaving the input; let pointerenter on suggestion box cancel the timeout
    if (blurTimeout) clearTimeout(blurTimeout);
    // Only set timeout if pointer is not over the suggestion box
    if (!pointerOverSuggestionBox) {
      blurTimeout = setTimeout(() => {
        clearSuggestions();
      }, 300);
    }
  });

  function onKeyDown(ev) {
    if (!suggestionBox || suggestionBox.hidden) return;
    // keydown logging removed
    if (ev.key === "ArrowDown") {
      ev.preventDefault();
      setActive(activeIndex + 1 >= items.length ? items.length - 1 : activeIndex + 1);
    } else if (ev.key === "ArrowUp") {
      ev.preventDefault();
      setActive(activeIndex - 1 < 0 ? 0 : activeIndex - 1);
    } else if (ev.key === "Enter") {
      if (acceptActive()) {
        ev.preventDefault();
      }
    } else if (ev.key === "Escape") {
      clearSuggestions();
    }
  }

  // Attach one-time UI handlers for input if not yet initialised
  if (!input.dataset.owpttSuggestInit) {
    input.dataset.owpttSuggestInit = "1";
    input.addEventListener("keydown", onKeyDown);
    input.addEventListener("blur", onInputBlur);
    input.addEventListener("focus", onInputFocus);
    window.addEventListener("resize", () => {
      if (suggestionBox && !suggestionBox.hidden) positionSuggestionBox();
    });
    // Track scrolling inside the document to reposition box
    document.addEventListener(
      "scroll",
      (ev) => {
        // Don't reposition if scrolling inside the suggestion box itself
        if (ev.target === suggestionBox || suggestionBox.contains(ev.target)) return;
        if (suggestionBox && !suggestionBox.hidden) positionSuggestionBox();
      },
      true
    );
    // Prevent blur clearing when user mouses down inside the suggestion box
    if (suggestionBox) {
      suggestionBox.addEventListener("mousedown", () => {
        if (blurTimeout) {
          clearTimeout(blurTimeout);
          blurTimeout = null;
        }
      });
      suggestionBox.addEventListener("pointerdown", () => {
        if (blurTimeout) {
          clearTimeout(blurTimeout);
          blurTimeout = null;
        }
      });
      suggestionBox.addEventListener("touchstart", () => {
        if (blurTimeout) {
          clearTimeout(blurTimeout);
          blurTimeout = null;
        }
      });
      // Also cancel the blur timeout when the pointer enters the suggestion box
      suggestionBox.addEventListener("pointerenter", () => {
        pointerOverSuggestionBox = true;
        if (blurTimeout) {
          clearTimeout(blurTimeout);
          blurTimeout = null;
        }
      });
      // When the pointer leaves the suggestion box, set the flag and restart timeout
      suggestionBox.addEventListener("pointerleave", () => {
        pointerOverSuggestionBox = false;
        if (owpttSuggestionsOwnerInput) {
          blurTimeout = setTimeout(() => {
            clearSuggestions();
          }, 300);
        }
      });
      // When the pointer is released anywhere, if it was a selection inside
      // the suggestion box we let the click handler do the work; afterwards
      // reset the selecting flag and only then clear suggestions if still shown.
      document.addEventListener("pointerup", (ev) => {
        try {
          const path = ev.composedPath ? ev.composedPath() : ev.path || [];
          const clickedInside = path && path.indexOf(suggestionBox) !== -1;
          if (userSelecting) {
            userSelecting = false;
            if (!clickedInside) {
              // mouse up outside the box — hide suggestions
              clearSuggestions();
            }
            // If clicked inside, the item’s click handler will close the box.
          }
        } catch {
          userSelecting = false;
        }
      });
    }
  }

  input.addEventListener("input", async () => {
    // If skipAutocompletionOnce is set, reset it and skip autocompletion
    if (skipAutocompletionOnce) {
      skipAutocompletionOnce = false;
      return;
    }

    const term = (input.value || "").trim();
    if (term === lastTerm) return;
    lastTerm = term;

    if (term.length < 3) {
      owpttApplyCompletionSuggestions([], { datalistId, keepFavorites });
      clearSuggestions();
      return;
    }

    const seq = ++owpttCompletionRequestSeq;
    try {
      const suggestions = await fetchTimetableCompletions(term);
      if (seq < owpttCompletionLatestAppliedSeq) return;
      owpttCompletionLatestAppliedSeq = seq;

      // Update the datalist (fallback) and render our custom popup for consistent styling
      owpttApplyCompletionSuggestions(suggestions, { datalistId, keepFavorites });
      renderSuggestions(suggestions || []);
    } catch {
      if (seq >= owpttCompletionLatestAppliedSeq) {
        owpttApplyCompletionSuggestions([], { datalistId, keepFavorites });
        clearSuggestions();
      }
    }
  });
}

/**
 * Link station input and walking time input to the favourites list.
 */
function attachFavoriteStopBehavior(stationInputId, minutesInputId) {
  const stationInput = document.getElementById(stationInputId);
  const minutesInput = document.getElementById(minutesInputId);
  if (!stationInput || !minutesInput) return;

  const handler = () => {
    const name = stationInput.value.trim();
    if (!name || !owpttFavoriteStops) return;

    const match =
      owpttFavoriteStops.find((s) => s.name.toLocaleLowerCase() === name.toLocaleLowerCase()) ||
      null;
    if (!match) return;

    const wm = Number(match.walkMinutes);
    minutesInput.value = Number.isFinite(wm) && wm >= 0 ? String(Math.round(wm)) : "0";
  };

  stationInput.addEventListener("change", handler);
  stationInput.addEventListener("input", handler);
}

/* --------------------------- Editor / Settings --------------------------- */

function initSettingsTabs() {
  const tabStops = document.getElementById("owptt-tab-favstops");
  const sectionStops = document.getElementById("owptt-settings-favstops");

  if (!tabStops || !sectionStops) return;

  // Only the Favourite stops tab exists now; ensure it is visible and active
  tabStops.classList.add("owptt-settings-tab-active");
  sectionStops.hidden = false;

  tabStops.addEventListener("click", () => {
    tabStops.classList.add("owptt-settings-tab-active");
    sectionStops.hidden = false;
  });
}

function openSettingsDialog() {
  const overlay = document.getElementById("owptt-settings-overlay");
  if (!overlay) return;

  overlay.removeAttribute("hidden");
  renderFavoriteStopsEditor();
  updateFavoriteStopsJson();
}

function closeSettingsDialog() {
  const overlay = document.getElementById("owptt-settings-overlay");
  if (!overlay) return;
  overlay.setAttribute("hidden", "hidden");
}

function renderFavoriteStopsEditor() {
  const tbody = document.getElementById("owptt-favstops-tbody");
  if (!tbody) return;
  tbody.innerHTML = "";

  if (!owpttFavoriteStops || owpttFavoriteStops.length === 0) {
    owpttFavoriteStopsSelectedIndex = -1;
    return;
  }

  owpttFavoriteStops.forEach((stop, index) => {
    const tr = document.createElement("tr");
    tr.dataset.index = String(index);
    tr.classList.add("owptt-fav-row");
    if (index === owpttFavoriteStopsSelectedIndex) {
      tr.classList.add("owptt-fav-row-selected");
    }

    // Station name
    const tdName = document.createElement("td");
    const inputName = document.createElement("input");
    inputName.type = "text";
    inputName.className = "owptt-input owptt-fav-name";
    inputName.value = stop.name || "";
    inputName.autocomplete = "off";
    inputName.autocorrect = "off";
    inputName.autocapitalize = "off";
    inputName.spellcheck = false;

    attachSearchChStationCompletion(inputName, {
      datalistId: "owptt-completion-only-list",
      keepFavorites: false,
    });

    inputName.addEventListener("change", () => {
      stop.name = inputName.value.trim();
      saveFavoriteStops();
      renderFavoriteStopsDatalist();
    });

    tdName.appendChild(inputName);
    tr.appendChild(tdName);

    // Walking time
    const tdWalk = document.createElement("td");
    const inputWalk = document.createElement("input");
    inputWalk.type = "number";
    inputWalk.min = "0";
    inputWalk.step = "1";
    inputWalk.className = "owptt-input owptt-input-small owptt-fav-walk";
    inputWalk.value =
      Number.isFinite(Number(stop.walkMinutes)) && Number(stop.walkMinutes) >= 0
        ? String(Math.round(Number(stop.walkMinutes)))
        : "0";
    inputWalk.addEventListener("change", () => {
      const v = Number(inputWalk.value);
      stop.walkMinutes = Number.isFinite(v) && v >= 0 ? Math.round(v) : 0;
      saveFavoriteStops();
      renderFavoriteStopsDatalist();
    });
    tdWalk.appendChild(inputWalk);
    tr.appendChild(tdWalk);

    // Delete button
    const tdDelete = document.createElement("td");
    const btnDel = document.createElement("button");
    btnDel.type = "button";
    btnDel.className = "ms-Button ms-Button--icon owptt-fav-delete";
    btnDel.innerHTML = "🗑";
    btnDel.addEventListener("click", () => {
      owpttFavoriteStops.splice(index, 1);
      if (owpttFavoriteStopsSelectedIndex >= owpttFavoriteStops.length) {
        owpttFavoriteStopsSelectedIndex = owpttFavoriteStops.length - 1;
      }
      saveFavoriteStops();
      renderFavoriteStopsDatalist();
      renderFavoriteStopsEditor();
    });
    tdDelete.appendChild(btnDel);
    tr.appendChild(tdDelete);

    tr.addEventListener("click", () => {
      owpttFavoriteStopsSelectedIndex = index;

      // Update selection visually
      tbody
        .querySelectorAll(".owptt-fav-row")
        .forEach((row) => row.classList.remove("owptt-fav-row-selected"));
      tr.classList.add("owptt-fav-row-selected");
    });

    tbody.appendChild(tr);
  });
}

function addFavoriteStopRow() {
  if (!owpttFavoriteStops) owpttFavoriteStops = [];
  owpttFavoriteStops.push({ name: "", walkMinutes: 0 });
  owpttFavoriteStopsSelectedIndex = owpttFavoriteStops.length - 1;
  saveFavoriteStops();
  renderFavoriteStopsDatalist();
  renderFavoriteStopsEditor();
}

function moveFavoriteStop(delta) {
  if (!owpttFavoriteStops || owpttFavoriteStops.length < 2) return;
  const from = owpttFavoriteStopsSelectedIndex;
  if (from < 0) return;

  const to = from + delta;
  if (to < 0 || to >= owpttFavoriteStops.length) return;

  const tmp = owpttFavoriteStops[from];
  owpttFavoriteStops[from] = owpttFavoriteStops[to];
  owpttFavoriteStops[to] = tmp;
  owpttFavoriteStopsSelectedIndex = to;
  saveFavoriteStops();
  renderFavoriteStopsDatalist();
  renderFavoriteStopsEditor();
}

function sortFavoriteStopsAZ() {
  if (!owpttFavoriteStops || owpttFavoriteStops.length < 2) return;
  const selected =
    owpttFavoriteStopsSelectedIndex >= 0
      ? owpttFavoriteStops[owpttFavoriteStopsSelectedIndex]
      : null;

  owpttFavoriteStops.sort((a, b) =>
    (a.name || "").toLocaleLowerCase().localeCompare((b.name || "").toLocaleLowerCase())
  );

  if (selected) {
    owpttFavoriteStopsSelectedIndex = owpttFavoriteStops.findIndex((s) => s === selected);
  } else {
    owpttFavoriteStopsSelectedIndex = -1;
  }

  saveFavoriteStops();
  renderFavoriteStopsDatalist();
  renderFavoriteStopsEditor();
}

/* ---------------------------- Import / Export ---------------------------- */

function updateFavoriteStopsJson() {
  const jsonBox = document.getElementById("owptt-fav-json");
  if (!jsonBox) return;
  const data = owpttFavoriteStops && owpttFavoriteStops.length > 0 ? owpttFavoriteStops : [];
  // Compact JSON: no extra whitespace or line breaks
  jsonBox.value = JSON.stringify(data);
}

function importFavoriteStopsFromJson() {
  const jsonBox = document.getElementById("owptt-fav-json");
  if (!jsonBox) return;
  const text = jsonBox.value.trim();
  if (!text) {
    showStatus("No JSON provided for import.");
    return;
  }
  try {
    const parsed = JSON.parse(text);
    if (!Array.isArray(parsed)) {
      showStatus("JSON must be an array.");
      return;
    }
    const cleaned = parsed
      .map((entry) => {
        if (!entry) return null;
        const name = typeof entry.name === "string" ? entry.name.trim() : "";
        if (!name) return null;
        const wm = Number(entry.walkMinutes);
        return {
          name,
          walkMinutes: Number.isFinite(wm) && wm >= 0 ? wm : 0,
        };
      })
      .filter(Boolean);
    setFavoriteStops(cleaned);
    jsonBox.value = "";
  } catch (e) {
    console.error("importFavoriteStopsFromJson failed:", e);
    showStatus("Could not parse JSON for standard stops.");
  }
}

/* ---------------------------- Language Preference ------------------------ */

function loadLanguagePreference() {
  try {
    const raw =
      typeof window !== "undefined" && window.localStorage
        ? window.localStorage.getItem(OWPTT_LANGUAGE_STORAGE_KEY)
        : null;
    if (!raw) return "auto";
    const value = String(raw).trim();
    // Validate: must be "auto" or a known locale
    if (value === "auto") return "auto";
    if (owpttTranslations[value]) return value;
    return "auto";
  } catch (e) {
    console.error("loadLanguagePreference failed:", e);
    return "auto";
  }
}

function saveLanguagePreference() {
  try {
    if (typeof window !== "undefined" && window.localStorage) {
      window.localStorage.setItem(OWPTT_LANGUAGE_STORAGE_KEY, owpttLanguagePreference);
    }
  } catch (e) {
    console.error("saveLanguagePreference failed:", e);
  }
}

function applyLanguagePreference() {
  const detectedLocale = detectLocale();
  const effectiveLocale =
    owpttLanguagePreference === "auto" ? detectedLocale : owpttLanguagePreference;
  const validatedLocale = validateLocaleTranslations(effectiveLocale);
  owpttCurrentLocale = validatedLocale;
  applyTranslations();
}

function updateLanguageSelector() {
  const select = document.getElementById("owptt-language-select");
  if (!select) return;
  select.value = owpttLanguagePreference;
}

function initLanguageSelector() {
  const select = document.getElementById("owptt-language-select");
  if (!select) return;

  updateLanguageSelector();

  select.addEventListener("change", () => {
    owpttLanguagePreference = select.value;
    saveLanguagePreference();
    applyLanguagePreference();
    // Re-render favorite stops editor to update with new locale
    renderFavoriteStopsEditor();
    updateFavoriteStopsJson();
  });
}

/* ------------------------------------------------------------------------- */
/*   OFFICE INITIALISATION                                                   */
/* ------------------------------------------------------------------------- */

/**
 * Apply UI adjustments when add-in is running in Compose mode.
 * This disables appointment insertion buttons and shows informational banner.
 */
function applyComposeModeUI() {
  // Show the Compose mode info banner
  const composeBanner = document.getElementById("owppt-compose-mode-banner");
  if (composeBanner) {
    composeBanner.classList.add("owppt-visible");
  }

  // Disable/hide the insert buttons
  const btnCreateInbound = document.getElementById("btn-create-inbound");
  const btnCreateOutbound = document.getElementById("btn-create-outbound");

  [btnCreateInbound, btnCreateOutbound].forEach((btn) => {
    if (btn) {
      btn.disabled = true;
      btn.title = t(
        "calendar.composeLimited.buttonTooltip",
        "Automatic insertion is not available in Compose mode. Please save the appointment and open it from your calendar in Read mode."
      );
      // Optionally add a visual class
      btn.classList.add("owptt-button-disabled");
    }
  });
}

Office.onReady((info) => {
  if (info.host === Office.HostType.Outlook) {
    const sideload = document.getElementById("sideload-msg");
    const appBody = document.getElementById("app-body");

    if (sideload) {
      sideload.style.display = "none";
    }
    if (appBody) {
      appBody.style.display = "flex";
    }

    // Load language preference and apply
    owpttLanguagePreference = loadLanguagePreference();
    const detectedLocale = detectLocale();
    const effectiveLocale =
      owpttLanguagePreference === "auto" ? detectedLocale : owpttLanguagePreference;
    owpttCurrentLocale = validateLocaleTranslations(effectiveLocale);
    applyTranslations();

    // Display build info in the footer
    try {
      const buildDate = new Date(OWPTT_BUILD_DATE).toLocaleString("de-CH");
      const version = OWPTT_BUILD_VERSION;
      document.getElementById("owppt-build-info").textContent = `v${version} (${buildDate})`;
    } catch (e) {
      console.warn("[OWPTT] Error displaying build info:", e);
      document.getElementById("owppt-build-info").textContent = "v?.?.?";
    }

    // Detect Read vs Compose mode
    const modeInfo = detectReadVsComposeMode();
    owpttIsReadMode = modeInfo.isReadMode;
    owpttIsComposeMode = modeInfo.isComposeMode;

    // Apply UI adjustments for Compose mode
    if (owpttIsComposeMode) {
      applyComposeModeUI();
    }

    // Version display removed: OWPTT_APP_VERSION no longer used

    // Load standard stops from localStorage and populate datalist
    owpttFavoriteStops = loadFavoriteStops();
    renderFavoriteStopsDatalist();

    // Link station fields with favourites
    attachFavoriteStopBehavior("meeting-station", "meeting-walk-minutes");
    attachFavoriteStopBehavior("in-from-station", "in-walk-minutes");
    attachFavoriteStopBehavior("out-to-station", "out-walk-minutes");

    // search.ch autocompletion for station fields
    attachSearchChStationCompletion(document.getElementById("meeting-station"));
    attachSearchChStationCompletion(document.getElementById("in-from-station"));
    attachSearchChStationCompletion(document.getElementById("out-to-station"));

    // Settings dialog open/close
    const settingsButton = document.querySelector(".owptt-settings-button");

    if (settingsButton) {
      settingsButton.addEventListener("click", () => openSettingsDialog());
    }

    const settingsClose = document.getElementById("owptt-settings-close");
    const settingsOk = document.getElementById("owptt-settings-ok");
    [settingsClose, settingsOk].forEach((btn) => {
      if (btn) {
        btn.addEventListener("click", () => closeSettingsDialog());
      }
    });

    // Initialize language selector
    initLanguageSelector();

    // Tabs in the settings dialog (Favourite stops only)
    initSettingsTabs();

    // Buttons in the favourites editor
    const btnFavAdd = document.getElementById("owptt-fav-add");
    if (btnFavAdd) {
      btnFavAdd.addEventListener("click", () => addFavoriteStopRow());
    }

    const btnFavUp = document.getElementById("owptt-fav-move-up");
    if (btnFavUp) {
      btnFavUp.addEventListener("click", () => moveFavoriteStop(-1));
    }

    const btnFavDown = document.getElementById("owptt-fav-move-down");
    if (btnFavDown) {
      btnFavDown.addEventListener("click", () => moveFavoriteStop(1));
    }

    const btnFavSort = document.getElementById("owptt-fav-sort-az");
    if (btnFavSort) {
      btnFavSort.addEventListener("click", () => sortFavoriteStopsAZ());
    }

    const btnFavImport = document.getElementById("owptt-fav-import-btn");
    if (btnFavImport) {
      btnFavImport.addEventListener("click", () => importFavoriteStopsFromJson());
    }

    const runButton = document.getElementById("run");
    if (runButton) {
      runButton.onclick = () => {
        run().catch((e) => console.error("run() failed:", e));
      };
    }

    const btnSearchInbound = document.getElementById("btn-search-inbound");
    if (btnSearchInbound) {
      btnSearchInbound.onclick = () => {
        searchInboundConnections().catch((e) =>
          console.error("searchInboundConnections failed:", e)
        );
      };
    }

    const btnSearchOutbound = document.getElementById("btn-search-outbound");
    if (btnSearchOutbound) {
      btnSearchOutbound.onclick = () => {
        searchOutboundConnections().catch((e) =>
          console.error("searchOutboundConnections failed:", e)
        );
      };
    }

    const btnCreateInbound = document.getElementById("btn-create-inbound");
    if (btnCreateInbound) {
      btnCreateInbound.onclick = () => createInboundAppointmentFromSelection();
    }

    const btnCreateOutbound = document.getElementById("btn-create-outbound");
    if (btnCreateOutbound) {
      btnCreateOutbound.onclick = () => createOutboundAppointmentFromSelection();
    }

    // Global error handlers to surface runtime errors in the inline banner
    window.addEventListener("error", (ev) => {
      try {
        const msg =
          ev && ev.message ? ev.message : t("error.unexpected", "An unexpected error occurred.");
        const details =
          ev && ev.error
            ? ev.error.stack || String(ev.error)
            : `${ev.filename || ""}:${ev.lineno || ""}`;
        showError(msg, { details });
      } catch {
        // ignore
      }
    });

    window.addEventListener("unhandledrejection", (ev) => {
      try {
        const reason = ev && ev.reason ? ev.reason.stack || String(ev.reason) : String(ev);
        showError(t("error.unhandledRejection", "Unhandled promise rejection occurred."), {
          details: reason,
        });
      } catch {
        // ignore
      }
    });
  }
});

/* ------------------------------------------------------------------------- */
/*   HELPER FUNCTIONS FOR OUTLOOK CONTEXT                                  */
/* ------------------------------------------------------------------------- */

async function getCurrentItemInfo() {
  const mailbox = Office.context && Office.context.mailbox;
  const item = mailbox && mailbox.item;
  if (!item) {
    throw new Error("No mailbox item.");
  }

  const [subjectRaw, locationRaw, startRaw, endRaw] = await Promise.all([
    getItemProperty(item.subject),
    getItemProperty(item.location),
    getItemProperty(item.start),
    getItemProperty(item.end),
  ]);

  const start = startRaw instanceof Date ? startRaw : startRaw ? new Date(startRaw) : null;
  const end = endRaw instanceof Date ? endRaw : endRaw ? new Date(endRaw) : null;

  if (!start || Number.isNaN(start.getTime())) {
    throw new Error("Invalid start time on appointment.");
  }

  return {
    subject: subjectRaw || "",
    location: locationRaw || "",
    start,
    end: end && !Number.isNaN(end.getTime()) ? end : start,
  };
}

// Universal helper for Read/Compose + string/Date + getAsync
function getItemProperty(value) {
  return new Promise((resolve) => {
    if (!value) {
      resolve("");
    } else if (typeof value === "string" || value instanceof Date) {
      // Read-Modus: subject = string, start/end = Date
      resolve(value);
    } else if (typeof value.getAsync === "function") {
      // Compose-Modus: subject/start/end/location haben getAsync
      value.getAsync((asyncResult) => {
        if (asyncResult.status === Office.AsyncResultStatus.Succeeded) {
          resolve(asyncResult.value);
        } else {
          console.error("getAsync failed:", asyncResult.error);
          resolve("");
        }
      });
    } else {
      resolve(value);
    }
  });
}

function formatDateTime(value) {
  if (!value) {
    return "";
  }

  let date = value;
  if (!(date instanceof Date)) {
    date = new Date(value);
  }
  if (Number.isNaN(date.getTime())) {
    return "";
  }

  try {
    return date.toLocaleString([], {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch (e) {
    return date.toString();
  }
}

function formatTime(date) {
  if (!date) return "";
  try {
    return date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch (e) {
    return date.toString();
  }
}

function unwrapDate(value) {
  if (!value) return null;
  if (value instanceof Date) return value;
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? null : d;
}

function formatDuration(dep, arr) {
  if (!dep || !arr) return "";
  const diffMs = arr.getTime() - dep.getTime();
  if (!Number.isFinite(diffMs) || diffMs <= 0) return "";

  // We work in minutes for a compact display format "2h 28’"
  const totalMinutes = Math.round(diffMs / 60000);
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  const parts = [];
  if (hours > 0) {
    parts.push(`${hours}h`);
  }
  // If hours == 0, still show only minutes ("28’")
  if (minutes > 0 || hours === 0) {
    parts.push(`${minutes}’`);
  }

  return parts.join(" ");
}

// Removed unused helper formatLegRow

/* ------------------------------------------------------------------------- */
/*   STATUS & DIAGNOSTIK                                                     */
/* ------------------------------------------------------------------------- */

function showStatus(message) {
  // Display status messages in the error container for visibility
  const container = document.getElementById("owptt-error-container");

  if (container) {
    const banner = document.createElement("div");
    banner.className = "owptt-error-banner";

    const msgEl = document.createElement("div");
    msgEl.className = "owptt-error-message";
    msgEl.textContent = typeof message === "string" ? message : String(message);
    banner.appendChild(msgEl);

    const closeBtn = document.createElement("button");
    closeBtn.type = "button";
    closeBtn.className = "owptt-error-close";
    closeBtn.textContent = t("error.dismiss", "Dismiss");
    closeBtn.addEventListener("click", () => clearError());

    const actions = document.createElement("div");
    actions.className = "owptt-error-actions";
    actions.appendChild(closeBtn);
    banner.appendChild(actions);

    container.innerHTML = "";
    container.appendChild(banner);
  } else {
    // Emergency fallback

    alert(message);
  }
}

/**
 * Show an inline error banner to surface runtime errors to the user.
 * message: short user-facing text
 * options: { level, transientMs, details }
 */
function showError(message, { transientMs = 0, details = null } = {}) {
  try {
    const container = document.getElementById("owptt-error-container");
    if (!container) {
      // Fallback to status if container missing
      showStatus(typeof message === "string" ? message : String(message));
      return;
    }

    const banner = document.createElement("div");
    banner.className = "owptt-error-banner";

    const msgEl = document.createElement("div");
    msgEl.className = "owptt-error-message";
    msgEl.textContent = typeof message === "string" ? message : String(message);
    banner.appendChild(msgEl);

    const actions = document.createElement("div");
    actions.className = "owptt-error-actions";

    const copyBtn = document.createElement("button");
    copyBtn.type = "button";
    copyBtn.className = "owptt-error-copy";
    copyBtn.textContent = t("error.copyDetails", "Copy details");
    copyBtn.addEventListener("click", () => {
      try {
        const text = details || msgEl.textContent || "";
        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(text);
        } else {
          // Fallback: create textarea
          const ta = document.createElement("textarea");
          ta.value = text;
          document.body.appendChild(ta);
          ta.select();
          try {
            document.execCommand("copy");
          } catch {
            // ignore
          }
          ta.remove();
        }
      } catch {
        // ignore copy errors
      }
    });
    actions.appendChild(copyBtn);

    const closeBtn = document.createElement("button");
    closeBtn.type = "button";
    closeBtn.className = "owptt-error-close";
    closeBtn.textContent = t("error.dismiss", "Dismiss");
    closeBtn.addEventListener("click", () => clearError());
    actions.appendChild(closeBtn);

    banner.appendChild(actions);

    const detailsPre = document.createElement("pre");
    detailsPre.className = "owptt-error-details";
    detailsPre.hidden = !details;
    detailsPre.textContent = details || "";
    banner.appendChild(detailsPre);

    container.innerHTML = "";
    container.appendChild(banner);

    if (transientMs && Number.isFinite(transientMs) && transientMs > 0) {
      setTimeout(() => clearError(), transientMs);
    }
  } catch {
    try {
      showStatus(typeof message === "string" ? message : String(message));
    } catch {
      // ignore
    }
  }
}

function clearError() {
  try {
    const container = document.getElementById("owptt-error-container");
    if (container) container.innerHTML = "";
  } catch (e) {
    // ignore
  }
}

/* ------------------------------------------------------------------------- */
/*   SEARCH CONNECTIONS                                                     */
/* ------------------------------------------------------------------------- */

async function searchInboundConnections() {
  const meetingStationInput = document.getElementById("meeting-station");
  const fromInput = document.getElementById("in-from-station");
  const meetingWalkInput = document.getElementById("meeting-walk-minutes");
  const originWalkInput = document.getElementById("in-walk-minutes");
  const tbody = document.getElementById("inbound-connections-body");

  if (!meetingStationInput || !fromInput || !tbody) {
    showStatus(t("status.uiIncomplete", "The timetable UI is not fully initialised."));
    return;
  }

  const from = fromInput.value.trim();
  const to = meetingStationInput.value.trim();

  if (!from || !to) {
    showStatus(
      t(
        "status.missingFields.inbound",
        "Please specify both origin and meeting stop for the outbound journey."
      )
    );
    return;
  }

  let meetingWalkMin = parseInt(meetingWalkInput?.value, 10);
  if (Number.isNaN(meetingWalkMin) || meetingWalkMin < 0) meetingWalkMin = 0;

  let originWalkMin = parseInt(originWalkInput?.value, 10);
  if (Number.isNaN(originWalkMin) || originWalkMin < 0) originWalkMin = 0;

  let itemInfo;
  try {
    itemInfo = await getCurrentItemInfo();
  } catch (e) {
    console.error("getCurrentItemInfo failed:", e);
    showStatus(t("status.noItem", "Could not read appointment information from Outlook."));
    return;
  }

  const meetingStart = itemInfo.start;
  // Goal: Arrival at the station shortly before meeting start
  const targetArrival = new Date(meetingStart.getTime() - meetingWalkMin * 60 * 1000);

  // Temporarily set table to "Searching..." state
  tbody.innerHTML = "";
  const searchingRow = document.createElement("tr");
  searchingRow.className = "owptt-placeholder-row";
  const searchingCell = document.createElement("td");
  searchingCell.colSpan = 4;
  searchingCell.className = "ms-font-xs owptt-placeholder";
  searchingCell.textContent = t(
    "status.searchingInbound",
    "Searching connections to the appointment…"
  );
  searchingRow.appendChild(searchingCell);
  tbody.appendChild(searchingRow);

  try {
    const req = new ConnectionsRequest(from, to, {
      dateTime: targetArrival,
      isArrivalTime: true,
      limit: 5,
    });

    // Debug: log the request URL to the console
    if (typeof req._buildUrl === "function") {
      const url = req._buildUrl();

      console.debug("Inbound request URL: " + url);
    }

    const resp = await req.getConnectionsAsync();

    owpttInboundConnections = resp && Array.isArray(resp.Connections) ? resp.Connections : [];
    owpttInboundContext = {
      subject: itemInfo.subject,
      location: itemInfo.location,
      from,
      to,
      meetingWalkMinutes: meetingWalkMin,
      endpointWalkMinutes: originWalkMin,
      direction: "inbound",
    };

    renderConnections("inbound");

    // After rendering, by default select the last connection for inbound journey
    if (Array.isArray(owpttInboundConnections) && owpttInboundConnections.length > 0) {
      const lastIndex = owpttInboundConnections.length - 1;
      setSelectedConnection("inbound", lastIndex);
    }
  } catch (e) {
    console.error("Error while querying inbound connections:", e);
    owpttInboundConnections = [];
    renderConnections("inbound");

    // Status text with more detailed error cause
    const msg = t("status.searchError", "Timetable query failed.");
    const detail = e && (e.message || e.toString());
    showStatus(`${msg} (${detail})`);
  }
}

async function searchOutboundConnections() {
  const meetingStationInput = document.getElementById("meeting-station");
  const toInput = document.getElementById("out-to-station");
  const meetingWalkInput = document.getElementById("meeting-walk-minutes");
  const destWalkInput = document.getElementById("out-walk-minutes");
  const tbody = document.getElementById("outbound-connections-body");

  if (!meetingStationInput || !toInput || !tbody) {
    showStatus(t("status.uiIncomplete", "The timetable UI is not fully initialised."));
    return;
  }

  const from = meetingStationInput.value.trim();
  const to = toInput.value.trim();

  if (!from || !to) {
    showStatus(
      t(
        "status.missingFields.outbound",
        "Please specify both meeting stop and destination for the return journey."
      )
    );
    return;
  }

  let meetingWalkMin = parseInt(meetingWalkInput?.value, 10);
  if (Number.isNaN(meetingWalkMin) || meetingWalkMin < 0) meetingWalkMin = 0;

  let destWalkMin = parseInt(destWalkInput?.value, 10);
  if (Number.isNaN(destWalkMin) || destWalkMin < 0) destWalkMin = 0;

  let itemInfo;
  try {
    itemInfo = await getCurrentItemInfo();
  } catch (e) {
    console.error("getCurrentItemInfo failed:", e);
    showStatus(t("status.noItem", "Could not read appointment information from Outlook."));
    return;
  }

  const meetingEnd = itemInfo.end;
  // Goal: Departure from the station shortly after meeting end
  const targetDeparture = new Date(meetingEnd.getTime() + meetingWalkMin * 60 * 1000);

  tbody.innerHTML = "";
  const searchingRow = document.createElement("tr");
  searchingRow.className = "owptt-placeholder-row";
  const searchingCell = document.createElement("td");
  searchingCell.colSpan = 4;
  searchingCell.className = "ms-font-xs owptt-placeholder";
  searchingCell.textContent = t(
    "status.searchingOutbound",
    "Searching connections from the appointment…"
  );
  searchingRow.appendChild(searchingCell);
  tbody.appendChild(searchingRow);

  try {
    const req = new ConnectionsRequest(from, to, {
      dateTime: targetDeparture,
      isArrivalTime: false,
      limit: 5,
    });

    // Debug: log the request URL to the console
    if (typeof req._buildUrl === "function") {
      const url = req._buildUrl();

      console.debug("Outbound request URL: " + url);
    }

    const resp = await req.getConnectionsAsync();
    owpttOutboundConnections = resp && Array.isArray(resp.Connections) ? resp.Connections : [];
    owpttOutboundContext = {
      subject: itemInfo.subject,
      location: itemInfo.location,
      from,
      to,
      meetingWalkMinutes: meetingWalkMin,
      endpointWalkMinutes: destWalkMin,
      direction: "outbound",
    };

    renderConnections("outbound");
  } catch (e) {
    console.error("Error while querying outbound connections:", e);
    owpttOutboundConnections = [];
    renderConnections("outbound");

    const msg = t("status.searchError", "Timetable query failed.");
    const detail = e && (e.message || e.toString());
    showStatus(`${msg} (${detail})`);
  }
}

/* ------------------------------------------------------------------------- */
/*   RENDER CONNECTIONS & SELECTION                                        */
/* ------------------------------------------------------------------------- */

function renderConnections(direction) {
  const isInbound = direction === "inbound";

  const connections = isInbound ? owpttInboundConnections : owpttOutboundConnections;

  const tbodyId = isInbound ? "inbound-connections-body" : "outbound-connections-body";

  const tbody = document.getElementById(tbodyId);
  if (!tbody) return;

  tbody.innerHTML = "";

  if (!Array.isArray(connections) || connections.length === 0) {
    const row = document.createElement("tr");
    row.className = "owptt-placeholder-row";
    const cell = document.createElement("td");
    cell.colSpan = 4;
    cell.className = "ms-font-xs owptt-placeholder";
    cell.textContent = t(isInbound ? "inbound.empty" : "outbound.empty", "No connections found.");
    row.appendChild(cell);
    tbody.appendChild(row);
    return;
  }

  if (isInbound) {
    owpttInboundSelectedIndex = 0;
  } else {
    owpttOutboundSelectedIndex = 0;
  }

  connections.forEach((conn, index) => {
    if (!conn) return;

    const dep = unwrapDate(conn.Departure);
    const arr = unwrapDate(conn.Arrival);
    const durationText = formatDuration(dep, arr);

    // NEW: compact emoji route chain from FahrplanSearchCH.js
    const routeChain =
      conn && typeof conn.toEmojiRouteChain === "function" ? conn.toEmojiRouteChain() : "";

    const row = document.createElement("tr");
    row.dataset.index = String(index);
    row.classList.add("owptt-connection-row");
    if (index === 0) {
      row.classList.add("owptt-row-selected");
    }

    const tdDep = document.createElement("td");
    tdDep.textContent = formatTime(dep);
    row.appendChild(tdDep);

    const tdRoute = document.createElement("td");
    tdRoute.textContent = routeChain;
    row.appendChild(tdRoute);

    const tdArr = document.createElement("td");
    tdArr.textContent = formatTime(arr);
    row.appendChild(tdArr);

    const tdDur = document.createElement("td");
    tdDur.textContent = durationText;
    row.appendChild(tdDur);

    row.addEventListener("click", () => {
      setSelectedConnection(direction, index);
    });

    tbody.appendChild(row);
  });
}

function setSelectedConnection(direction, index) {
  const isInbound = direction === "inbound";
  const tbodyId = isInbound ? "inbound-connections-body" : "outbound-connections-body";
  const tbody = document.getElementById(tbodyId);
  if (!tbody) return;

  tbody
    .querySelectorAll(".owptt-row-selected")
    .forEach((row) => row.classList.remove("owptt-row-selected"));

  const row = tbody.querySelector(`tr[data-index="${index}"]`);
  if (row) {
    row.classList.add("owptt-row-selected");
  }

  if (isInbound) {
    owpttInboundSelectedIndex = index;
  } else {
    owpttOutboundSelectedIndex = index;
  }
}

/* ------------------------------------------------------------------------- */
/*   CREATE APPOINTMENTS FROM SELECTED CONNECTION                          */
/* ------------------------------------------------------------------------- */

function createInboundAppointmentFromSelection() {
  // Defensive check: prevent appointment creation in Compose mode
  if (owpttIsComposeMode) {
    showStatus(
      t(
        "status.noDisplayNewAppointmentApi",
        "This Outlook client cannot open a new appointment window from the current context. Please use the new Outlook or create the appointment manually."
      )
    );
    return;
  }

  if (!owpttInboundConnections || owpttInboundConnections.length === 0) {
    showStatus(t("status.noConnectionsYet", "Please search connections first."));
    return;
  }

  const idx = owpttInboundSelectedIndex;
  if (idx == null || idx < 0 || idx >= owpttInboundConnections.length) {
    showStatus(t("status.selectConnection", "Please select a connection."));
    return;
  }

  const conn = owpttInboundConnections[idx];
  createAppointmentFromConnection(conn, owpttInboundContext, "inbound");
}

function createOutboundAppointmentFromSelection() {
  // Defensive check: prevent appointment creation in Compose mode
  if (owpttIsComposeMode) {
    showStatus(
      t(
        "status.noDisplayNewAppointmentApi",
        "This Outlook client cannot open a new appointment window from the current context. Please use the new Outlook or create the appointment manually."
      )
    );
    return;
  }

  if (!owpttOutboundConnections || owpttOutboundConnections.length === 0) {
    showStatus(t("status.noConnectionsYet", "Please search connections first."));
    return;
  }

  const idx = owpttOutboundSelectedIndex;
  if (idx == null || idx < 0 || idx >= owpttOutboundConnections.length) {
    showStatus(t("status.selectConnection", "Please select a connection."));
    return;
  }

  const conn = owpttOutboundConnections[idx];
  createAppointmentFromConnection(conn, owpttOutboundContext, "outbound");
}

function createAppointmentFromConnection(conn, context, direction) {
  if (!conn) {
    showStatus(t("status.invalidConnection", "This connection is not valid."));
    return;
  }

  const dep = unwrapDate(conn.Departure);
  const arr = unwrapDate(conn.Arrival);

  if (!dep || !arr) {
    showStatus(
      t("status.invalidTimes", "This connection does not contain valid departure/arrival times.")
    );
    return;
  }

  // Start and destination from connection / context
  const fromStation = (conn.From && String(conn.From)) || (context && context.from) || "";
  const toStation = (conn.To && String(conn.To)) || (context && context.to) || "";

  // Walking times from taskpane (in minutes)
  const meetingWalk = (context && Number(context.meetingWalkMinutes)) || 0;
  const endpointWalk = (context && Number(context.endpointWalkMinutes)) || 0;

  // inbound:   Start = origin, destination = meeting
  // outbound:  Start = meeting, destination = destination
  const startWalkMinutes = direction === "inbound" ? endpointWalk : meetingWalk;
  const endWalkMinutes = direction === "inbound" ? meetingWalk : endpointWalk;

  const startWalkMs = Math.max(0, startWalkMinutes) * 60 * 1000;
  const endWalkMs = Math.max(0, endWalkMinutes) * 60 * 1000;

  // Appointment start/end including walking time at start/destination
  const travelStart = new Date(dep.getTime() - startWalkMs);
  const travelEnd = new Date(arr.getTime() + endWalkMs);

  // Subject: "Transfer [Start]–[Destination]"
  const subjectPrefix = t("calendar.transferPrefix", "Transfer");
  const subject = `${subjectPrefix} ${fromStation}–${toStation}`;

  // Base location (fallback if no route chain available)
  const baseLocation = t("calendar.location.publicTransport", "Public transport");

  // Compact public transport chain from FahrplanSearchCH.js
  const routeChainCore =
    conn && typeof conn.toEmojiRouteChain === "function" ? conn.toEmojiRouteChain() : "";

  // Helper for compact walking times (without parentheses, for location)
  const formatWalkBare = (minutes) => {
    const m = Math.round(Number(minutes) || 0);
    if (m <= 0) return "";
    return `🚶‍➡️${m}’`;
  };

  const startWalkLoc = formatWalkBare(startWalkMinutes);
  const endWalkLoc = formatWalkBare(endWalkMinutes);

  // Complete location chain:
  // startWalk (taskpane) + legs chain (API) + endWalk (taskpane)
  let locationRoute = "";

  if (startWalkLoc) {
    locationRoute += startWalkLoc;
  }

  if (routeChainCore) {
    locationRoute += routeChainCore;
  }

  if (endWalkLoc) {
    locationRoute += endWalkLoc;
  }

  const location = locationRoute || baseLocation;

  // ---- Body: compact one-line summary with emojis ----

  // Legs summary directly from FahrplanSearchCH.js
  const legsSummary =
    conn && typeof conn.toEmojiSummary === "function" ? conn.toEmojiSummary() : "";

  // Helfer fuer (🚶‍➡️XX’)
  const formatWalk = (minutes) => {
    const m = Math.round(Number(minutes) || 0);
    if (m <= 0) return null;
    return `(🚶‍➡️${m}’)`;
  };

  const startWalkText = formatWalk(startWalkMinutes);
  const endWalkText = formatWalk(endWalkMinutes);

  const bodyParts = [];

  // Gehzeit am Startort (aus Taskpane)
  if (startWalkText) {
    bodyParts.push(startWalkText);
  }

  // Public transport chain from the connection
  if (legsSummary) {
    bodyParts.push(legsSummary);
  } else {
    // Fallback if, for some reason, no legs are available
    bodyParts.push(`${fromStation} → ${toStation}`);
  }

  // Walking time at destination (from taskpane)
  if (endWalkText) {
    bodyParts.push(endWalkText);
  }

  const body = bodyParts.join(" · ");

  // Create appointment
  createTravelAppointment({
    start: travelStart,
    end: travelEnd,
    subject,
    location,
    body,
  });
}

/* ------------------------------------------------------------------------- */
/*   OPEN APPOINTMENT WINDOW                                                */
/* ------------------------------------------------------------------------- */

function createTravelAppointment({ start, end, subject, location, body }) {
  const mailbox = Office.context && Office.context.mailbox;
  if (!mailbox) {
    showStatus(t("status.noMailbox", "No mailbox context is available."));
    return;
  }

  const startDate = start instanceof Date ? start : new Date(start);
  const endDate = end instanceof Date ? end : new Date(end);

  const params = {
    subject: subject || "",
    location: location || "",
    start: startDate,
    end: endDate,
    body: body || "",
  };

  const hasSync = typeof mailbox.displayNewAppointmentForm === "function";
  const hasAsync = typeof mailbox.displayNewAppointmentFormAsync === "function";

  if (!hasSync && !hasAsync) {
    showStatus(
      t(
        "status.noDisplayNewAppointmentApi",
        "This Outlook client cannot open a new appointment window from the current context. Please use the new Outlook or create the appointment manually."
      )
    );
    return;
  }

  if (hasSync) {
    try {
      mailbox.displayNewAppointmentForm(params);
      return;
    } catch (e) {
      console.error("displayNewAppointmentForm failed:", e);
    }
  }

  if (hasAsync) {
    mailbox.displayNewAppointmentFormAsync(params, (asyncResult) => {
      if (asyncResult.status !== Office.AsyncResultStatus.Succeeded) {
        console.error("displayNewAppointmentFormAsync failed:", asyncResult.error);
        showStatus(t("status.displayAppointmentFailed", "Opening the appointment window failed."));
      }
    });
  }
}

