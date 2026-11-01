// API wrapper for 01GH backend
// The original uses google.script.run (Apps Script client API).
// For standalone React (GitHub Pages / Vercel), we call the web app URL via fetch.
// NOTE: Google Apps Script web apps have CORS limitations.
// Recommended: keep deploying the built React as a static site AND proxy calls,
// or embed the React build inside an Apps Script HtmlService if possible.
// For now this uses fetch against the provided exec URL.

const EXEC_URL = 'https://script.google.com/macros/s/AKfycbzdKEd1j_EvB-boKNz5mFGNrICN74UlWJ_ki96fGiDSRN6wl3v12meoVRNjz-taFaY_/exec';

export async function api(fn, ...args) {
  // Prefer google.script.run when running inside Apps Script
  if (typeof google !== 'undefined' && google.script && google.script.run) {
    return new Promise((resolve, reject) => {
      const runner = google.script.run
        .withSuccessHandler(resolve)
        .withFailureHandler(reject);
      runner[fn].apply(runner, args);
    });
  }

  // Fallback for standalone hosting
  // Use text/plain to avoid CORS preflight (Apps Script does not handle OPTIONS well)
  try {
    const res = await fetch(EXEC_URL, {
      method: 'POST',
      redirect: 'follow',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify({ fn, args })
    });
    if (!res.ok) {
      const text = await res.text().catch(() => '');
      throw new Error(`HTTP ${res.status}${text ? ': ' + text.slice(0, 200) : ''}`);
    }
    const text = await res.text();
    try {
      return JSON.parse(text);
    } catch {
      throw new Error('Server returned non-JSON: ' + text.slice(0, 200));
    }
  } catch (err) {
    console.error('API call failed:', fn, err);
    throw err;
  }
}

export const TOKEN_KEY = 'gpt_token_v2';
