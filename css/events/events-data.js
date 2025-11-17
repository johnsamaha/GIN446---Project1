/*(async () => {
  // 1) Find the main "HTML DOM Events" table
  const allTables = Array.from(document.querySelectorAll("table"));
  const eventsTable = allTables.find(t => {
    const headerRow = t.querySelector("tr");
    if (!headerRow) return false;
    const headers = Array.from(headerRow.querySelectorAll("th, td"))
      .map(c => c.textContent.toLowerCase().trim());
    return headers.includes("event") &&
           headers.some(h => h.includes("occurs")) &&
           headers.some(h => h.includes("belongs"));
  });

  if (!eventsTable) {
    console.error("Could not find events table!");
    return;
  }

  const rows = Array.from(eventsTable.querySelectorAll("tr")).slice(1); // skip header

  // --- helper to extract Supported HTML tags from a fetched event page ---
  async function getSupportedTags(url) {
    try {
      const res = await fetch(url);
      const html = await res.text();

      const parser = new DOMParser();
      const doc = parser.parseFromString(html, "text/html");

      let tagsText = "";

      // 1) try to localize the "Technical Details" section
      const techHeading = Array.from(doc.querySelectorAll("h2, h3"))
        .find(h => /technical\s+details/i.test(h.textContent));

      const searchInElementOrSiblings = (startEl) => {
        let el = startEl;
        while (el) {
          // stop if we hit another major section
          if (/^H2|H3$/.test(el.tagName)) break;

          // a) table layout: first cell = "HTML tags"
          if (el.tagName === "TABLE") {
            const trs = Array.from(el.querySelectorAll("tr"));
            for (const tr of trs) {
              const cells = tr.querySelectorAll("th, td");
              if (cells.length < 2) continue;
              const label = cells[0].textContent.replace(/\s+/g, " ").trim();
              if (/html\s*tags/i.test(label)) {
                return cells[1].textContent.replace(/\s+/g, " ").trim();
              }
            }
          }

          // b) generic text that contains "Supported HTML tags"
          const candidates = Array.from(
            el.querySelectorAll("*")
          ).filter(node =>
            /supported\s*html\s*tags/i.test(node.textContent)
          );

          if (candidates.length) {
            const full = candidates[0].textContent.replace(/\s+/g, " ").trim();
            const m = full.match(/Supported\s*HTML\s*tags:\s*(.*)/i);
            return m ? m[1].trim() : full;
          }

          el = el.nextElementSibling;
        }
        return "";
      };

      if (techHeading) {
        tagsText = searchInElementOrSiblings(techHeading.nextElementSibling);
      }

      // 2) fallback: search whole document if not found near the heading
      if (!tagsText) {
        const allNodes = Array.from(doc.querySelectorAll("p, li, div, td, span"));
        const candidate = allNodes.find(n =>
          /supported\s*html\s*tags/i.test(n.textContent)
        );
        if (candidate) {
          const full = candidate.textContent.replace(/\s+/g, " ").trim();
          const m = full.match(/Supported\s*HTML\s*tags:\s*(.*)/i);
          tagsText = m ? m[1].trim() : full;
        }
      }

      return tagsText;
    } catch (err) {
      console.error("Error getting supported tags for", url, err);
      return "";
    }
  }

  // 2) Build event objects from table rows
  const events = [];
  for (const row of rows) {
    const cells = row.querySelectorAll("td");
    if (cells.length < 3) continue;

    const link = cells[0].querySelector("a");
    if (!link) continue;

    const eventName = link.textContent.trim();       // e.g. "onclick"
    const description = cells[1].textContent.trim(); // "The user clicks on an element"
    const category = cells[2].textContent.trim();    // e.g. "MouseEvent"
    const reference = link.href;                     // full URL

    const supportedTags = await getSupportedTags(reference);

    events.push({
      eventName,
      category,
      description,
      supportedTags,
      reference
    });

    // optional: log progress
    console.log("Scraped:", eventName, "| tags:", supportedTags);
  }

  // 3) Output JSON
  console.log("DONE. Events data below:");
  console.log(JSON.stringify(events, null, 2));
})();
*/


const EVENTS_DATA = [

  {
    "eventName": "abort",
    "category": "UiEvent, Event",
    "description": "The loading of a media is aborted",
    "supportedTags": "<audio> and <video>",
    "reference": "https://www.w3schools.com/jsref/event_onabort_media.asp"
  },
  {
    "eventName": "afterprint",
    "category": "Event",
    "description": "A page has started printing",
    "supportedTags": "<body>",
    "reference": "https://www.w3schools.com/jsref/event_onafterprint.asp"
  },
  {
    "eventName": "animationend",
    "category": "AnimationEvent",
    "description": "A CSS animation has completed",
    "supportedTags": "",
    "reference": "https://www.w3schools.com/jsref/event_animationend.asp"
  },
  {
    "eventName": "animationiteration",
    "category": "AnimationEvent",
    "description": "A CSS animation is repeated",
    "supportedTags": "",
    "reference": "https://www.w3schools.com/jsref/event_animationiteration.asp"
  },
  {
    "eventName": "animationstart",
    "category": "AnimationEvent",
    "description": "A CSS animation has started",
    "supportedTags": "",
    "reference": "https://www.w3schools.com/jsref/event_animationstart.asp"
  },
  {
    "eventName": "beforeprint",
    "category": "Event",
    "description": "A page is about to be printed",
    "supportedTags": "<body>",
    "reference": "https://www.w3schools.com/jsref/event_onbeforeprint.asp"
  },
  {
    "eventName": "beforeunload",
    "category": "UiEvent, \n  Event",
    "description": "Before a document is about to be unloaded",
    "supportedTags": "<body>",
    "reference": "https://www.w3schools.com/jsref/event_onbeforeunload.asp"
  },
  {
    "eventName": "blur",
    "category": "FocusEvent",
    "description": "An element loses focus",
    "supportedTags": "ALL HTML elements, EXCEPT: <base>, <bdo>, <br>, <head>, <html>, <iframe>, <meta>, <param>, <script>, <style>, and <title>",
    "reference": "https://www.w3schools.com/jsref/event_onblur.asp"
  },
  {
    "eventName": "canplay",
    "category": "Event",
    "description": "The browser can start playing a media (has buffered enough to begin)",
    "supportedTags": "<audio> and <video>",
    "reference": "https://www.w3schools.com/jsref/event_oncanplay.asp"
  },
  {
    "eventName": "canplaythrough",
    "category": "Event",
    "description": "The browser can play through a media without stopping for buffering",
    "supportedTags": "<audio> and <video>",
    "reference": "https://www.w3schools.com/jsref/event_oncanplaythrough.asp"
  },
  {
    "eventName": "change",
    "category": "Event",
    "description": "The content of a form element has changed",
    "supportedTags": "<input type=\"checkbox\">, <input type=\"color\">, <input type=\"date\">, <input type=\"datetime\">, <input type=\"email\">, <input type=\"file\">, <input type=\"month\">, <input type=\"number\">, <input type=\"password\">, <input type=\"radio\">, <input type=\"range\">, <input type=\"search\">, <input type=\"tel\">, <input type=\"text\">, <input type=\"time\">, <input type=\"url\">, <input type=\"week\">, <select> and <textarea>",
    "reference": "https://www.w3schools.com/jsref/event_onchange.asp"
  },
  {
    "eventName": "click",
    "category": "MouseEvent",
    "description": "An element is clicked on",
    "supportedTags": "All except: <base>, <bdo>, <br>, <head>, <html>, <iframe>, <meta>, <param>, <script>, <style>, and <title>",
    "reference": "https://www.w3schools.com/jsref/event_onclick.asp"
  },
  {
    "eventName": "contextmenu",
    "category": "MouseEvent",
    "description": "An element is right-clicked to open a context menu",
    "supportedTags": "All HTML elements",
    "reference": "https://www.w3schools.com/jsref/event_oncontextmenu.asp"
  },
  {
    "eventName": "copy",
    "category": "ClipboardEvent",
    "description": "The content of an element is copied",
    "supportedTags": "All HTML elements",
    "reference": "https://www.w3schools.com/jsref/event_oncopy.asp"
  },
  {
    "eventName": "cut",
    "category": "ClipboardEvent",
    "description": "The content of an element is cut",
    "supportedTags": "All HTML elements",
    "reference": "https://www.w3schools.com/jsref/event_oncut.asp"
  },
  {
    "eventName": "dblclick",
    "category": "MouseEvent",
    "description": "An element is double-clicked",
    "supportedTags": "All HTML elements, EXCEPT: <base>, <bdo>, <br>, <head>, <html>, <iframe>, <meta>, <param>, <script>, <style>, and <title>.",
    "reference": "https://www.w3schools.com/jsref/event_ondblclick.asp"
  },
  {
    "eventName": "drag",
    "category": "DragEvent",
    "description": "An element is being dragged",
    "supportedTags": "All HTML elements",
    "reference": "https://www.w3schools.com/jsref/event_ondrag.asp"
  },
  {
    "eventName": "dragend",
    "category": "DragEvent",
    "description": "Dragging of an element has ended",
    "supportedTags": "All HTML elements",
    "reference": "https://www.w3schools.com/jsref/event_ondragend.asp"
  },
  {
    "eventName": "dragenter",
    "category": "DragEvent",
    "description": "A dragged element enters the drop target",
    "supportedTags": "All HTML elements",
    "reference": "https://www.w3schools.com/jsref/event_ondragenter.asp"
  },
  {
    "eventName": "dragleave",
    "category": "DragEvent",
    "description": "A dragged element leaves the drop target",
    "supportedTags": "All HTML elements",
    "reference": "https://www.w3schools.com/jsref/event_ondragleave.asp"
  },
  {
    "eventName": "dragover",
    "category": "DragEvent",
    "description": "A dragged element is over the drop target",
    "supportedTags": "All HTML elements",
    "reference": "https://www.w3schools.com/jsref/event_ondragover.asp"
  },
  {
    "eventName": "dragstart",
    "category": "DragEvent",
    "description": "Dragging of an element has started",
    "supportedTags": "All HTML elements",
    "reference": "https://www.w3schools.com/jsref/event_ondragstart.asp"
  },
  {
    "eventName": "drop",
    "category": "DragEvent",
    "description": "A dragged element is dropped on the target",
    "supportedTags": "All HTML elements",
    "reference": "https://www.w3schools.com/jsref/event_ondrop.asp"
  },
  {
    "eventName": "durationchange",
    "category": "Event",
    "description": "The duration of a media is changed",
    "supportedTags": "<audio> and <video>",
    "reference": "https://www.w3schools.com/jsref/event_ondurationchange.asp"
  },
  {
    "eventName": "ended",
    "category": "Event",
    "description": "A media has reach the end (\"thanks for listening\")",
    "supportedTags": "<audio> and <video>",
    "reference": "https://www.w3schools.com/jsref/event_onended.asp"
  },
  {
    "eventName": "error",
    "category": "ProgressEvent, \n  UiEvent, Event",
    "description": "An error has occurred while loading a file",
    "supportedTags": "<img>, <input type=\"image\">, <object>, <link>, and <script>",
    "reference": "https://www.w3schools.com/jsref/event_onerror.asp"
  },
  {
    "eventName": "focus",
    "category": "FocusEvent",
    "description": "An element gets focus",
    "supportedTags": "ALL HTML elements, EXCEPT: <base>, <bdo>, <br>, <head>, <html>, <iframe>, <meta>, <param>, <script>, <style>, and <title>",
    "reference": "https://www.w3schools.com/jsref/event_onfocus.asp"
  },
  {
    "eventName": "focusin",
    "category": "FocusEvent",
    "description": "An element is about to get focus",
    "supportedTags": "ALL HTML elements, EXCEPT: <base>, <bdo>, <br>, <head>, <html>, <iframe>, <meta>, <param>, <script>, <style>, and <title>",
    "reference": "https://www.w3schools.com/jsref/event_onfocusin.asp"
  },
  {
    "eventName": "focusout",
    "category": "FocusEvent",
    "description": "An element is about to lose focus",
    "supportedTags": "ALL HTML elements, EXCEPT: <base>, <bdo>, <br>, <head>, <html>, <iframe>, <meta>, <param>, <script>, <style>, and <title>",
    "reference": "https://www.w3schools.com/jsref/event_onfocusout.asp"
  },
  {
    "eventName": "fullscreenchange",
    "category": "Event",
    "description": "An element is displayed in fullscreen mode",
    "supportedTags": "ALL HTML elements",
    "reference": "https://www.w3schools.com/jsref/event_fullscreenchange.asp"
  },
  {
    "eventName": "fullscreenerror",
    "category": "Event",
    "description": "An element can not be displayed in fullscreen mode",
    "supportedTags": "ALL HTML elements",
    "reference": "https://www.w3schools.com/jsref/event_fullscreenerror.asp"
  },
  {
    "eventName": "hashchange",
    "category": "HashChangeEvent",
    "description": "There has been changes to the anchor part of a URL",
    "supportedTags": "<body>",
    "reference": "https://www.w3schools.com/jsref/event_onhashchange.asp"
  },
  {
    "eventName": "input",
    "category": "InputEvent, \n  Event",
    "description": "An element gets user input",
    "supportedTags": "<input> and <textarea>",
    "reference": "https://www.w3schools.com/jsref/event_oninput.asp"
  },
  {
    "eventName": "invalid",
    "category": "Event",
    "description": "An element is invalid",
    "supportedTags": "<input>",
    "reference": "https://www.w3schools.com/jsref/event_oninvalid.asp"
  },
  {
    "eventName": "keydown",
    "category": "KeyboardEvent",
    "description": "A key is down",
    "supportedTags": "All HTML elements, EXCEPT: <base>, <bdo>, <br>, <head>, <html>, <iframe>, <meta>, <param>, <script>, <style>, and <title>",
    "reference": "https://www.w3schools.com/jsref/event_onkeydown.asp"
  },
  {
    "eventName": "keypress",
    "category": "KeyboardEvent",
    "description": "A key is pressed",
    "supportedTags": "All HTML elements, EXCEPT: <base>, <bdo>, <br>, <head>, <html>, <iframe>, <meta>, <param>, <script>, <style>, and <title>",
    "reference": "https://www.w3schools.com/jsref/event_onkeypress.asp"
  },
  {
    "eventName": "keyup",
    "category": "KeyboardEvent",
    "description": "A key is released",
    "supportedTags": "All HTML elements, EXCEPT: <base>, <bdo>, <br>, <head>, <html>, <iframe>, <meta>, <param>, <script>, <style>, and <title>",
    "reference": "https://www.w3schools.com/jsref/event_onkeyup.asp"
  },
  {
    "eventName": "load",
    "category": "UiEvent, \n  Event",
    "description": "An object has loaded",
    "supportedTags": "<body>, <frame>, <iframe>, <img>, <input type=\"image\">, <link>, <script>, <style>",
    "reference": "https://www.w3schools.com/jsref/event_onload.asp"
  },
  {
    "eventName": "loadeddata",
    "category": "Event",
    "description": "Media data is loaded",
    "supportedTags": "<audio> and <video>",
    "reference": "https://www.w3schools.com/jsref/event_onloadeddata.asp"
  },
  {
    "eventName": "loadedmetadata",
    "category": "Event",
    "description": "Meta data (like dimensions and duration) are loaded",
    "supportedTags": "<audio> and <video>",
    "reference": "https://www.w3schools.com/jsref/event_onloadedmetadata.asp"
  },
  {
    "eventName": "loadstart",
    "category": "ProgressEvent",
    "description": "The browser starts looking for the specified media",
    "supportedTags": "<audio> and <video>",
    "reference": "https://www.w3schools.com/jsref/event_onloadstart.asp"
  },
  {
    "eventName": "message",
    "category": "Event",
    "description": "A message is received through the event source",
    "supportedTags": "",
    "reference": "https://www.w3schools.com/jsref/event_onmessage_sse.asp"
  },
  {
    "eventName": "mousedown",
    "category": "MouseEvent",
    "description": "The mouse button is pressed over an element",
    "supportedTags": "All HTML elements, EXCEPT: <base>, <bdo>, <br>, <head>, <html>, <iframe>, <meta>, <param>, <script>, <style>, and <title>",
    "reference": "https://www.w3schools.com/jsref/event_onmousedown.asp"
  },
  {
    "eventName": "mouseenter",
    "category": "MouseEvent",
    "description": "The pointer is moved onto an element",
    "supportedTags": "All HTML elements, EXCEPT: <base>, <bdo>, <br>, <head>, <html>, <iframe>, <meta>, <param>, <script>, <style>, and <title>",
    "reference": "https://www.w3schools.com/jsref/event_onmouseenter.asp"
  },
  {
    "eventName": "mouseleave",
    "category": "MouseEvent",
    "description": "The pointer is moved out of an element",
    "supportedTags": "All HTML elements, EXCEPT: <base>, <bdo>, <br>, <head>, <html>, <iframe>, <meta>, <param>, <script>, <style>, and <title>",
    "reference": "https://www.w3schools.com/jsref/event_onmouseleave.asp"
  },
  {
    "eventName": "mousemove",
    "category": "MouseEvent",
    "description": "The pointer is moved over an element",
    "supportedTags": "All HTML elements, EXCEPT: <base>, <bdo>, <br>, <head>, <html>, <iframe>, <meta>, <param>, <script>, <style>, and <title>",
    "reference": "https://www.w3schools.com/jsref/event_onmousemove.asp"
  },
  {
    "eventName": "mouseover",
    "category": "MouseEvent",
    "description": "The pointer is moved onto an element",
    "supportedTags": "All HTML elements, EXCEPT: <base>, <bdo>, <br>, <head>, <html>, <iframe>, <meta>, <param>, <script>, <style>, and <title>",
    "reference": "https://www.w3schools.com/jsref/event_onmouseover.asp"
  },
  {
    "eventName": "mouseout",
    "category": "MouseEvent",
    "description": "The pointer is moved out of an element",
    "supportedTags": "All HTML elements, EXCEPT: <base>, <bdo>, <br>, <head>, <html>, <iframe>, <meta>, <param>, <script>, <style>, and <title>",
    "reference": "https://www.w3schools.com/jsref/event_onmouseout.asp"
  },
  {
    "eventName": "mouseup",
    "category": "MouseEvent",
    "description": "A user releases a mouse button over an element",
    "supportedTags": "All HTML elements, EXCEPT: <base>, <bdo>, <br>, <head>, <html>, <iframe>, <meta>, <param>, <script>, <style>, and <title>",
    "reference": "https://www.w3schools.com/jsref/event_onmouseup.asp"
  },
  {
    "eventName": "offline",
    "category": "Event",
    "description": "The browser starts working offline",
    "supportedTags": "<body>",
    "reference": "https://www.w3schools.com/jsref/event_onoffline.asp"
  },
  {
    "eventName": "online",
    "category": "Event",
    "description": "The browser starts working online",
    "supportedTags": "<body>",
    "reference": "https://www.w3schools.com/jsref/event_ononline.asp"
  },
  {
    "eventName": "open",
    "category": "Event",
    "description": "A connection with the event source is opened",
    "supportedTags": "",
    "reference": "https://www.w3schools.com/jsref/event_onopen_sse.asp"
  },
  {
    "eventName": "pagehide",
    "category": "PageTransitionEvent",
    "description": "User navigates away from a webpage",
    "supportedTags": "<body>",
    "reference": "https://www.w3schools.com/jsref/event_onpagehide.asp"
  },
  {
    "eventName": "pageshow",
    "category": "PageTransitionEvent",
    "description": "User navigates to a webpage",
    "supportedTags": "<body>",
    "reference": "https://www.w3schools.com/jsref/event_onpageshow.asp"
  },
  {
    "eventName": "paste",
    "category": "ClipboardEvent",
    "description": "Some content is pasted in an element",
    "supportedTags": "All HTML elements",
    "reference": "https://www.w3schools.com/jsref/event_onpaste.asp"
  },
  {
    "eventName": "pause",
    "category": "Event",
    "description": "A media is paused",
    "supportedTags": "<audio> and <video>",
    "reference": "https://www.w3schools.com/jsref/event_onpause.asp"
  },
  {
    "eventName": "play",
    "category": "Event",
    "description": "The media has started or is no longer paused",
    "supportedTags": "<audio> and <video>",
    "reference": "https://www.w3schools.com/jsref/event_onplay.asp"
  },
  {
    "eventName": "playing",
    "category": "Event",
    "description": "The media is playing after being paused or buffered",
    "supportedTags": "<audio> and <video>",
    "reference": "https://www.w3schools.com/jsref/event_onplaying.asp"
  },
  {
    "eventName": "progress",
    "category": "Event",
    "description": "The browser is downloading media data",
    "supportedTags": "<audio>, <video>",
    "reference": "https://www.w3schools.com/jsref/event_onprogress.asp"
  },
  {
    "eventName": "ratechange",
    "category": "Event",
    "description": "The playing speed of a media is changed",
    "supportedTags": "<audio> and <video>",
    "reference": "https://www.w3schools.com/jsref/event_onratechange.asp"
  },
  {
    "eventName": "resize",
    "category": "UiEvent, \n  Event",
    "description": "The document view is resized",
    "supportedTags": "<body>",
    "reference": "https://www.w3schools.com/jsref/event_onresize.asp"
  },
  {
    "eventName": "reset",
    "category": "Event",
    "description": "A form is reset",
    "supportedTags": "<form>",
    "reference": "https://www.w3schools.com/jsref/event_onreset.asp"
  },
  {
    "eventName": "scroll",
    "category": "UiEvent, \nEvent",
    "description": "A scrollbar is being scrolled",
    "supportedTags": "<address>, <blockquote>, <body>, <caption>, <center>, <dd>, <dir>, <div>, <dl>, <dt>, <fieldset>, <form>, <h1> to <h6>, <html>, <li>, <menu>, <object>, <ol>, <p>, <pre>, <select>, <tbody>, <textarea>, <tfoot>, <thead>, <ul>",
    "reference": "https://www.w3schools.com/jsref/event_onscroll.asp"
  },
  {
    "eventName": "search",
    "category": "Event",
    "description": "Something is written in a search field",
    "supportedTags": "<input type=\"search\">",
    "reference": "https://www.w3schools.com/jsref/event_onsearch.asp"
  },
  {
    "eventName": "seeked",
    "category": "Event",
    "description": "Skipping to a media position is finished",
    "supportedTags": "<audio> and <video>",
    "reference": "https://www.w3schools.com/jsref/event_onseeked.asp"
  },
  {
    "eventName": "seeking",
    "category": "Event",
    "description": "Skipping to a media position is started",
    "supportedTags": "<audio> and <video>",
    "reference": "https://www.w3schools.com/jsref/event_onseeking.asp"
  },
  {
    "eventName": "select",
    "category": "UiEvent, \n  Event",
    "description": "User selects some text",
    "supportedTags": "<input type=\"file\">, <input type=\"password\">, <input type=\"text\">, and <textarea>",
    "reference": "https://www.w3schools.com/jsref/event_onselect.asp"
  },
  {
    "eventName": "show",
    "category": "Event",
    "description": "A <menu> element is shown as a context menu",
    "supportedTags": "<menu>",
    "reference": "https://www.w3schools.com/jsref/event_onshow.asp"
  },
  {
    "eventName": "stalled",
    "category": "Event",
    "description": "The browser is trying to get unavailable media data",
    "supportedTags": "<audio> and <video>",
    "reference": "https://www.w3schools.com/jsref/event_onstalled.asp"
  },
  {
    "eventName": "submit",
    "category": "Event",
    "description": "A form is submitted",
    "supportedTags": "<form>",
    "reference": "https://www.w3schools.com/jsref/event_onsubmit.asp"
  },
  {
    "eventName": "suspend",
    "category": "Event",
    "description": "The browser is intentionally not getting media data",
    "supportedTags": "<audio> and <video>",
    "reference": "https://www.w3schools.com/jsref/event_onsuspend.asp"
  },
  {
    "eventName": "timeupdate",
    "category": "Event",
    "description": "The playing position has changed (the user \nmoves to a different point in the media)",
    "supportedTags": "<audio> and <video>",
    "reference": "https://www.w3schools.com/jsref/event_ontimeupdate.asp"
  },
  {
    "eventName": "toggle",
    "category": "Event",
    "description": "The user opens or closes the <details> element",
    "supportedTags": "<details>",
    "reference": "https://www.w3schools.com/jsref/event_ontoggle.asp"
  },
  {
    "eventName": "touchcancel",
    "category": "TouchEvent",
    "description": "The touch is interrupted",
    "supportedTags": "All HTML elements",
    "reference": "https://www.w3schools.com/jsref/event_touchcancel.asp"
  },
  {
    "eventName": "touchend",
    "category": "TouchEvent",
    "description": "A finger is removed from a touch screen",
    "supportedTags": "All HTML elements",
    "reference": "https://www.w3schools.com/jsref/event_touchend.asp"
  },
  {
    "eventName": "touchmove",
    "category": "TouchEvent",
    "description": "A finger is dragged across the screen",
    "supportedTags": "All HTML elements",
    "reference": "https://www.w3schools.com/jsref/event_touchmove.asp"
  },
  {
    "eventName": "touchstart",
    "category": "TouchEvent",
    "description": "A finger is placed on a touch screen",
    "supportedTags": "All HTML elements",
    "reference": "https://www.w3schools.com/jsref/event_touchstart.asp"
  },
  {
    "eventName": "transitionend",
    "category": "TransitionEvent",
    "description": "A CSS transition has completed",
    "supportedTags": "",
    "reference": "https://www.w3schools.com/jsref/event_transitionend.asp"
  },
  {
    "eventName": "unload",
    "category": "UiEvent, \nEvent",
    "description": "A page has unloaded",
    "supportedTags": "<body>",
    "reference": "https://www.w3schools.com/jsref/event_onunload.asp"
  },
  {
    "eventName": "volumechange",
    "category": "Event",
    "description": "The volume of a media is changed (includes muting)",
    "supportedTags": "<audio> and <video>",
    "reference": "https://www.w3schools.com/jsref/event_onvolumechange.asp"
  },
  {
    "eventName": "waiting",
    "category": "Event",
    "description": "A media is paused but is expected to resume (e.g. buffering)",
    "supportedTags": "<audio>, <video>",
    "reference": "https://www.w3schools.com/jsref/event_onwaiting.asp"
  },
  {
    "eventName": "wheel",
    "category": "WheelEvent",
    "description": "The mouse wheel rolls up or down over an element",
    "supportedTags": "All HTML elements",
    "reference": "https://www.w3schools.com/jsref/event_onwheel.asp"
  }

];