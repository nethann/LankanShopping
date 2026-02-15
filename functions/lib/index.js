"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.syncExchangeRates = exports.setCurrencyOverride = exports.detectRegion = void 0;
const app_1 = require("firebase-admin/app");
const firestore_1 = require("firebase-admin/firestore");
const https_1 = require("firebase-functions/v2/https");
const scheduler_1 = require("firebase-functions/v2/scheduler");
(0, app_1.initializeApp)();
const db = (0, firestore_1.getFirestore)();
const SUPPORTED_CURRENCIES = ["LKR", "USD", "EUR", "GBP", "CAD", "AUD"];
const COUNTRY_TO_CURRENCY = {
    LK: "LKR",
    US: "USD",
    GB: "GBP",
    CA: "CAD",
    AU: "AUD",
    FR: "EUR",
    DE: "EUR",
    IT: "EUR",
    ES: "EUR",
    NL: "EUR",
    BE: "EUR",
    PT: "EUR",
    AT: "EUR",
    IE: "EUR",
    FI: "EUR",
    GR: "EUR",
};
function getFirstIp(forwardedForHeader) {
    if (!forwardedForHeader)
        return null;
    const raw = Array.isArray(forwardedForHeader) ? forwardedForHeader[0] : forwardedForHeader;
    const firstIp = raw.split(",")[0]?.trim();
    return firstIp || null;
}
function getCurrencyFromCountry(country) {
    if (!country)
        return "USD";
    return COUNTRY_TO_CURRENCY[country] ?? "USD";
}
exports.detectRegion = (0, https_1.onCall)(async (request) => {
    const uid = request.auth?.uid;
    const ip = getFirstIp(request.rawRequest.headers["x-forwarded-for"]);
    if (!ip) {
        const fallbackCurrency = "USD";
        if (uid) {
            await db.collection("users").doc(uid).set({
                currency: fallbackCurrency,
                geoDetectedAt: firestore_1.FieldValue.serverTimestamp(),
            }, { merge: true });
        }
        return { country: null, currency: fallbackCurrency };
    }
    let country = null;
    try {
        const response = await fetch(`http://ip-api.com/json/${ip}?fields=status,countryCode`);
        if (!response.ok) {
            throw new Error(`ip-api status ${response.status}`);
        }
        const data = (await response.json());
        if (data.status === "success" && typeof data.countryCode === "string") {
            country = data.countryCode;
        }
    }
    catch (error) {
        console.error("Failed to detect region from IP.", error);
    }
    const currency = getCurrencyFromCountry(country);
    if (uid) {
        await db.collection("users").doc(uid).set({
            country,
            currency,
            geoDetectedAt: firestore_1.FieldValue.serverTimestamp(),
        }, { merge: true });
    }
    return { country, currency };
});
exports.setCurrencyOverride = (0, https_1.onCall)(async (request) => {
    const uid = request.auth?.uid;
    if (!uid) {
        throw new https_1.HttpsError("unauthenticated", "Sign in is required.");
    }
    const currency = request.data?.currency;
    if (typeof currency !== "string" || currency.length !== 3) {
        throw new https_1.HttpsError("invalid-argument", "Currency must be a 3-letter code.");
    }
    await db.collection("users").doc(uid).set({
        currencyOverride: currency.toUpperCase(),
        updatedAt: firestore_1.FieldValue.serverTimestamp(),
    }, { merge: true });
    return { ok: true };
});
exports.syncExchangeRates = (0, scheduler_1.onSchedule)({
    schedule: "every day 00:00",
    timeZone: "Asia/Colombo",
    region: "us-central1",
}, async () => {
    const response = await fetch("https://open.er-api.com/v6/latest/LKR");
    if (!response.ok) {
        throw new Error(`Exchange rate API failed: ${response.status}`);
    }
    const payload = (await response.json());
    if (payload.result !== "success" || !payload.rates) {
        throw new Error("Exchange rate API returned an invalid payload.");
    }
    const rates = { LKR: 1 };
    for (const code of SUPPORTED_CURRENCIES) {
        if (code === "LKR")
            continue;
        const value = payload.rates[code];
        if (typeof value === "number" && value > 0) {
            rates[code] = value;
        }
    }
    await db.collection("appConfig").doc("exchangeRates").set({
        base: "LKR",
        rates,
        updatedAt: firestore_1.FieldValue.serverTimestamp(),
        source: "https://open.er-api.com/v6/latest/LKR",
        sourceUpdatedAt: payload.time_last_update_utc ?? null,
    }, { merge: true });
});
//# sourceMappingURL=index.js.map