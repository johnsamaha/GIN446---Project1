// cv.js – rebuilt with all requested features

(function () {
  document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("cv-form");
    if (!form) return;

    /* ---------- ELEMENTS ---------- */
    const statusMessage = document.getElementById("form-status-message");

    // Buttons
    const printBtn = document.getElementById("print-cv-btn");
    const openNewTabBtn = document.getElementById("open-new-tab-btn");
    const clearFormBtn = document.getElementById("clear-form-btn");

    const cvPreview = document.getElementById("cv-preview");

    // Personal info
    const fullNameInput = document.getElementById("fullName");
    const headlineInput = document.getElementById("headline");
    const phoneInput = document.getElementById("phone");
    const emailPrimaryInput = document.getElementById("emailPrimary");
    const emailSecondaryInput = document.getElementById("emailSecondary");
    const linkedInInput = document.getElementById("linkedIn");

    // Summary
    const summaryTaglineInput = document.getElementById("summaryTagline");
    const summaryBodyInput = document.getElementById("summaryBody");

    // Multi-item containers
    const educationContainer = document.getElementById("education-items");
    const experienceContainer = document.getElementById("experience-items");
    const projectContainer = document.getElementById("project-items");
    const certificationContainer = document.getElementById("certification-items");
    const volunteeringContainer = document.getElementById("volunteering-items");
    // SKILLS
    const skillsContainer = document.getElementById("skills-items");
    const addSkillBtn = document.getElementById("add-skill-btn");
    const skillTemplate = document.getElementById("skill-template");
    const previewSkillsList = document.getElementById("preview-skills-list");

    // Templates
    const educationTemplate = document.getElementById("education-template");
    const experienceTemplate = document.getElementById("experience-template");
    const projectTemplate = document.getElementById("project-template");
    const certificationTemplate = document.getElementById("certification-template");
    const volunteeringTemplate = document.getElementById("volunteering-template");

    // Add buttons
    const addEducationBtn = document.getElementById("add-education-btn");
    const addExperienceBtn = document.getElementById("add-experience-btn");
    const addProjectBtn = document.getElementById("add-project-btn");
    const addCertificationBtn = document.getElementById("add-certification-btn");
    const addVolunteeringBtn = document.getElementById("add-volunteering-btn");

    // Skills (static fields but optional)
    const languagesSkillInput = document.getElementById("languagesSkill");
    const programmingSkillInput = document.getElementById("programmingSkill");
    const webDevSkillInput = document.getElementById("webDevSkill");
    const toolsSkillInput = document.getElementById("toolsSkill");
    const softSkillInput = document.getElementById("softSkill");

    // Preview elements
    const previewNameTitle = document.getElementById("preview-name-title");
    const previewLastUpdated = document.getElementById("preview-last-updated");

    const previewPhone = document.getElementById("preview-phone");
    const previewEmailPrimary = document.getElementById("preview-email-primary");
    const previewEmailPrimaryLink = document.getElementById("preview-email-primary-link");
    const previewEmailSecondaryWrapper = document.getElementById("preview-email-secondary-wrapper");
    const previewEmailSecondary = document.getElementById("preview-email-secondary");
    const previewEmailSecondaryLink = document.getElementById("preview-email-secondary-link");
    const previewLinkedInLink = document.getElementById("preview-linkedin-link");
    const previewHeroSeparator = document.getElementById("preview-hero-separator");

    const previewSummarySection = document.getElementById("preview-summary-section");
    const previewSummaryTagline = document.getElementById("preview-summary-tagline");
    const previewSummaryBody = document.getElementById("preview-summary-body");

    const previewEducationSection = document.getElementById("preview-education-section");
    const previewEducationList = document.getElementById("preview-education-list");

    const previewExperienceSection = document.getElementById("preview-experience-section");
    const previewExperienceList = document.getElementById("preview-experience-list");

    const previewProjectsSection = document.getElementById("preview-projects-section");
    const previewProjectsList = document.getElementById("preview-projects-list");

    const previewCertificationsSection = document.getElementById("preview-certifications-section");
    const previewCertificationsList = document.getElementById("preview-certifications-list");

    const previewVolunteeringSection = document.getElementById("preview-volunteering-section");
    const previewVolunteeringList = document.getElementById("preview-volunteering-list");

    const previewSkillsSection = document.getElementById("preview-skills-section");
    const previewSkillsLanguages = document.getElementById("preview-languages-skill");
    const previewSkillsProgramming = document.getElementById("preview-programming-skill");
    const previewSkillsWebDev = document.getElementById("preview-webdev-skill");
    const previewSkillsTools = document.getElementById("preview-tools-skill");
    const previewSkillsSoft = document.getElementById("preview-soft-skill");

    /* ---------- UTILITIES ---------- */

    function setStatusMessage(text, isError = false) {
      if (!statusMessage) return;
      statusMessage.textContent = text || "";
      statusMessage.style.color = isError ? "#e11d48" : "var(--neutral-600)";
    }

    function setError(input, message) {
      const group = input.closest(".form-group");
      if (group) {
        group.classList.add("has-error");
        let errorEl = group.querySelector(".field-error");
        if (!errorEl) {
          errorEl = document.createElement("p");
          errorEl.className = "field-error";
          group.appendChild(errorEl);
        }
        errorEl.textContent = message || "Invalid value.";
      }
    }

    function clearError(input) {
      const group = input.closest(".form-group");
      if (group) {
        group.classList.remove("has-error");
        const errorEl = group.querySelector(".field-error");
        if (errorEl) errorEl.textContent = "";
      }
    }

    function clearAllErrors() {
      const groups = form.querySelectorAll(".form-group.has-error");
      groups.forEach((g) => g.classList.remove("has-error"));
      const errors = form.querySelectorAll(".field-error");
      errors.forEach((e) => (e.textContent = ""));
    }

    function validateEmail(value) {
      if (!value) return true;
      const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return pattern.test(value);
    }

    function validatePhone(value) {
      if (!value) return false;
      const pattern = /^[0-9+\s()-]{6,}$/;
      return pattern.test(value);
    }

    function validateURL(value) {
      if (!value) return true;
      return /^https?:\/\/.+/i.test(value);
    }

    function formatBulletedText(text) {
      if (!text) return "";
      const lines = text.split(/\r?\n/).map(l => l.trim()).filter(Boolean);
      if (!lines.length) return "";
      if (lines.length === 1) {
        return `<br>${lines[0]}`;
      }
      return `<ul>${lines.map(l => `<li>${l}</li>`).join("")}</ul>`;
    }

    function capitalizeName(str) {
  return str
    .split(/(\s+)/)
    .map(part => {
      if (!part.trim()) return part; 
      return part.charAt(0).toUpperCase() + part.slice(1);
    })
    .join("");
}


    /* ---------- VALIDATION ---------- */

    function validateFullNameField() {
      const value = fullNameInput.value.trim();
      if (!value) {
        setError(fullNameInput, "Full name is required.");
        return false;
      }
      const parts = value.split(/\s+/);
      if (parts.length < 2) {
        setError(fullNameInput, "Please enter first and last name.");
        return false;
      }
      clearError(fullNameInput);
      return true;
    }

    function validateField(input) {
      const id = input.id;
      const value = input.value.trim();

      // Required attributes and data-required
      const isRequired = input.hasAttribute("required") || input.dataset.required === "true";

      if (id === "fullName") {
        return validateFullNameField();
      }

      // Email fields
      if (input.type === "email") {
        if (!value && !isRequired) {
          clearError(input);
          return true;
        }
        if (!value) {
          setError(input, "This field is required.");
          return false;
        }
        if (!validateEmail(value)) {
          setError(input, "Invalid email format.");
          return false;
        }
        clearError(input);
        return true;
      }

      // Phone
      if (id === "phone") {
        if (!value) {
          setError(input, "Phone number is required.");
          return false;
        }
        if (!validatePhone(value)) {
          setError(input, "Invalid phone number.");
          return false;
        }
        clearError(input);
        return true;
      }

      // URL fields (LinkedIn, cert links, etc.)
      if (input.type === "url") {
        if (!value && !isRequired) {
          clearError(input);
          return true;
        }
        if (!validateURL(value)) {
          setError(input, "URL must start with http:// or https://");
          return false;
        }
        clearError(input);
        return true;
      }

      // Other required text / textarea
      if (isRequired) {
        if (!value) {
          setError(input, "This field is required.");
          return false;
        }
        clearError(input);
      } else {
        clearError(input);
      }

      return true;
    }

    function validateRequiredMultiItem(container, selector, label) {
      const items = container.querySelectorAll(selector);
      if (!items.length) {
        setStatusMessage(`Please add at least one ${label} entry.`, true);
        return false;
      }

      let hasValid = false;
      items.forEach(item => {
        const requiredInputs = item.querySelectorAll("[data-required='true']");
        let allFilled = true;
        requiredInputs.forEach(inp => {
          if (!inp.value.trim()) {
            allFilled = false;
          }
        });
        if (allFilled && requiredInputs.length) {
          hasValid = true;
        }
      });

      if (!hasValid) {
        setStatusMessage(`Please complete at least one ${label} entry (all required fields).`, true);
      }

      return hasValid;
    }

    function validateAddEligibility(container, selector) {
      const lastItem = container.querySelector(`${selector}:last-of-type`);
      if (!lastItem) return true;
      const requiredInputs = lastItem.querySelectorAll("[data-required='true']");
      let allFilled = true;
      requiredInputs.forEach(inp => {
        if (!inp.value.trim()) {
          allFilled = false;
          inp.classList.add("pending-required");
        } else {
          inp.classList.remove("pending-required");
        }
      });
      if (!allFilled) {
        const firstEmpty = lastItem.querySelector("[data-required='true'].pending-required");
        if (firstEmpty) {
          firstEmpty.focus();
        }
        setStatusMessage("Please fill all required fields in the current entry before adding a new one.", true);
      } else {
        setStatusMessage("");
      }
      return allFilled;
    }

    function validateForm() {
      clearAllErrors();
      setStatusMessage("");

      let isValid = true;

      if (!validateFullNameField()) isValid = false;
      if (!validateField(headlineInput)) isValid = false;
      if (!validateField(phoneInput)) isValid = false;
      if (!validateField(emailPrimaryInput)) isValid = false;
      if (!validateField(emailSecondaryInput)) isValid = false;
      if (!validateField(linkedInInput)) isValid = false;
      if (!validateField(summaryBodyInput)) isValid = false;

      // Required multi sections
      if (!validateRequiredMultiItem(educationContainer, ".education-item", "education")) {
        isValid = false;
      }
      if (!validateRequiredMultiItem(experienceContainer, ".experience-item", "experience")) {
        isValid = false;
      }

      return isValid;
    }

    /* ---------- PREVIEW UPDATE ---------- */

    function updatePersonalPreview() {
      let name = fullNameInput.value.trim();
      if (name) {
        name = capitalizeName(name);
      } else {
        name = "Your Name";
      }

      const headline = headlineInput.value.trim() || "Headline";
      previewNameTitle.textContent = `${name} – ${headline}`;

      // update last updated
      const now = new Date();
      previewLastUpdated.textContent = now.toLocaleDateString(undefined, {
        year: "numeric",
        month: "long",
        day: "numeric"
      });

      // phone
      const phone = phoneInput.value.trim();
      previewPhone.textContent = phone || "+961 ...";

      // primary email
      const pEmail = emailPrimaryInput.value.trim();
      if (pEmail) {
        previewEmailPrimary.textContent = pEmail;
        previewEmailPrimaryLink.href = `mailto:${pEmail}`;
      } else {
        previewEmailPrimary.textContent = "";
        previewEmailPrimaryLink.href = "#";
      }

      // secondary email
      const sEmail = emailSecondaryInput.value.trim();
      if (sEmail) {
        previewEmailSecondary.textContent = sEmail;
        previewEmailSecondaryLink.href = `mailto:${sEmail}`;
        previewEmailSecondaryWrapper.style.display = "inline";
      } else {
        previewEmailSecondaryWrapper.style.display = "none";
      }

      // LinkedIn
      const linkedIn = linkedInInput.value.trim();
      if (linkedIn) {
        previewLinkedInLink.href = linkedIn;
        previewLinkedInLink.style.display = "inline-flex";
        previewHeroSeparator.style.display = "inline";
      } else {
        previewLinkedInLink.style.display = "none";
        previewHeroSeparator.style.display = "none";
      }
    }

    function updateSummaryPreview() {
      const tagline = summaryTaglineInput.value.trim();
      const body = summaryBodyInput.value.trim();

      if (!tagline && !body) {
        previewSummarySection.style.display = "none";
        previewSummaryTagline.textContent = "";
        previewSummaryBody.textContent = "";
        return;
      }

      previewSummarySection.style.display = "";
      if (tagline) {
        previewSummaryTagline.textContent = tagline;
        previewSummaryTagline.parentElement.style.display = "";
      } else {
        previewSummaryTagline.textContent = "";
        previewSummaryTagline.parentElement.style.display = "none";
      }

      if (body) {
        previewSummaryBody.textContent = body;
      } else {
        previewSummaryBody.textContent = "";
      }
    }

    function updateEducationPreview() {
      previewEducationList.innerHTML = "";
      const items = educationContainer.querySelectorAll(".education-item");

      items.forEach(item => {
        const inst = item.querySelector(".edu-institution")?.value.trim();
        const loc = item.querySelector(".edu-location")?.value.trim();
        const degree = item.querySelector(".edu-degree")?.value.trim();
        const dates = item.querySelector(".edu-dates")?.value.trim();
        const desc = item.querySelector(".edu-description")?.value.trim();

        if (!inst && !degree && !dates && !desc && !loc) return;

        const li = document.createElement("li");
        let html = "";
        if (inst) html += `<strong>${inst}</strong>${loc ? ", " + loc : ""}.`;
        if (degree) html += ` — ${degree}`;
        if (dates) html += ` (${dates})`;
        if (desc) html += formatBulletedText(desc);
        li.innerHTML = html;
        previewEducationList.appendChild(li);
      });

      previewEducationSection.style.display =
        previewEducationList.children.length ? "" : "none";
    }

    function updateExperiencePreview() {
      previewExperienceList.innerHTML = "";
      const items = experienceContainer.querySelectorAll(".experience-item");

      items.forEach(item => {
        const role = item.querySelector(".exp-role")?.value.trim();
        const org = item.querySelector(".exp-organization")?.value.trim();
        const dates = item.querySelector(".exp-dates")?.value.trim();
        const loc = item.querySelector(".exp-location")?.value.trim();
        const details = item.querySelector(".exp-details")?.value.trim();

        if (!role && !org && !dates && !loc && !details) return;

        const li = document.createElement("li");
        let html = "";
        if (role) html += `<strong>${role}</strong>`;
        if (org) html += `, ${org}`;
        if (dates) html += ` (${dates})`;
        if (loc) html += ` – ${loc}`;
        if (details) html += formatBulletedText(details);
        li.innerHTML = html;
        previewExperienceList.appendChild(li);
      });

      previewExperienceSection.style.display =
        previewExperienceList.children.length ? "" : "none";
    }

    function updateProjectsPreview() {
      previewProjectsList.innerHTML = "";
      const items = projectContainer.querySelectorAll(".project-item");

      items.forEach(item => {
        const title = item.querySelector(".proj-title")?.value.trim();
        const context = item.querySelector(".proj-context")?.value.trim();
        const desc = item.querySelector(".proj-description")?.value.trim();

        if (!title && !context && !desc) return;

        const li = document.createElement("li");
        let html = "";
        if (title) html += `<strong>${title}</strong>`;
        if (context) html += ` — ${context}`;
        if (desc) html += formatBulletedText(desc);
        li.innerHTML = html;
        previewProjectsList.appendChild(li);
      });

      previewProjectsSection.style.display =
        previewProjectsList.children.length ? "" : "none";
    }

    function updateCertificationsPreview() {
      previewCertificationsList.innerHTML = "";
      const items = certificationContainer.querySelectorAll(".certification-item");

      items.forEach(item => {
        const title = item.querySelector(".cert-title")?.value.trim();
        const issuer = item.querySelector(".cert-issuer")?.value.trim();
        const date = item.querySelector(".cert-date")?.value.trim();
        const link = item.querySelector(".cert-link")?.value.trim();

        if (!title && !issuer && !date && !link) return;

        const li = document.createElement("li");
        let html = "";
        if (title) html += `<strong>${title}</strong>`;
        if (issuer) html += ` — ${issuer}`;
        if (date) html += ` (${date})`;
        if (link) {
          html += ` <a href="${link}" class="reference-link" target="_blank" rel="noopener">Link</a>`;
        }
        li.innerHTML = html;
        previewCertificationsList.appendChild(li);
      });

      previewCertificationsSection.style.display =
        previewCertificationsList.children.length ? "" : "none";
    }

    function updateVolunteeringPreview() {
      previewVolunteeringList.innerHTML = "";
      const items = volunteeringContainer.querySelectorAll(".volunteering-item");

      items.forEach(item => {
        const role = item.querySelector(".vol-role")?.value.trim();
        const org = item.querySelector(".vol-organization")?.value.trim();
        const details = item.querySelector(".vol-details")?.value.trim();

        if (!role && !org && !details) return;

        const li = document.createElement("li");
        let html = "";
        if (role) html += `<strong>${role}</strong>`;
        if (org) html += ` — ${org}`;
        if (details) html += formatBulletedText(details);
        li.innerHTML = html;
        previewVolunteeringList.appendChild(li);
      });

      previewVolunteeringSection.style.display =
        previewVolunteeringList.children.length ? "" : "none";
    }

    function updateSkillsPreview() {
      const languages = languagesSkillInput.value.trim();
      const programming = programmingSkillInput.value.trim();
      const web = webDevSkillInput.value.trim();
      const tools = toolsSkillInput.value.trim();
      const soft = softSkillInput.value.trim();

      const any = languages || programming || web || tools || soft;

      if (!any) {
        previewSkillsSection.style.display = "none";
        previewSkillsLanguages.textContent = "";
        previewSkillsProgramming.textContent = "";
        previewSkillsWebDev.textContent = "";
        previewSkillsTools.textContent = "";
        previewSkillsSoft.textContent = "";
        return;
      }

      previewSkillsSection.style.display = "";
      previewSkillsLanguages.textContent = languages;
      previewSkillsProgramming.textContent = programming;
      previewSkillsWebDev.textContent = web;
      previewSkillsTools.textContent = tools;
      previewSkillsSoft.textContent = soft;
    }

    function updatePreview() {
      updatePersonalPreview();
      updateSummaryPreview();
      updateEducationPreview();
      updateExperiencePreview();
      updateProjectsPreview();
      updateCertificationsPreview();
      updateVolunteeringPreview();
      updateSkillsPreview();
    }

    /* ---------- MULTI-ITEM HELPERS ---------- */

    function attachMultiItemListeners(container, item, selector) {
      // Live preview update on input
      item.addEventListener("input", function (e) {
        if (e.target.matches("input, textarea")) {
          validateField(e.target);
        }
        updatePreview();
      });

      const removeBtn = item.querySelector(".remove-item-btn");
      if (removeBtn) {
        removeBtn.addEventListener("click", function () {
          const isRequiredContainer =
            container === educationContainer || container === experienceContainer;
          if (isRequiredContainer && container.children.length <= 1) {
            setStatusMessage("At least one entry is required in this section.", true);
            return;
          }
          container.removeChild(item);
          updatePreview();
        });
      }
    }

    function updateSkillsPreview() {
  previewSkillsList.innerHTML = "";
  const items = skillsContainer.querySelectorAll(".skill-item");

  items.forEach(item => {
    const title = item.querySelector(".skill-title")?.value.trim();
    const desc = item.querySelector(".skill-description")?.value.trim();

    if (!title && !desc) return;

    const li = document.createElement("li");
    let html = `<strong>${title}</strong>`;
    if (desc) html += formatBulletedText(desc);
    li.innerHTML = html;
    previewSkillsList.appendChild(li);
  });

  previewSkillsSection.style.display =
    previewSkillsList.children.length ? "" : "none";
}

addSkillBtn.addEventListener("click", function () {
  addItem(skillTemplate, skillsContainer, ".skill-item");
});


    function addItem(template, container, selector) {
      if (!validateAddEligibility(container, selector)) return;
      const node = template.content.firstElementChild.cloneNode(true);
      attachMultiItemListeners(container, node, selector);
      container.appendChild(node);
      updatePreview();
    }

    function initMultiSections() {
      educationContainer.innerHTML = "";
      experienceContainer.innerHTML = "";

      addItem(educationTemplate, educationContainer, ".education-item");
      addItem(experienceTemplate, experienceContainer, ".experience-item");
    }

    function clearForm() {
      form.reset();
      clearAllErrors();
      setStatusMessage("");

      educationContainer.innerHTML = "";
      experienceContainer.innerHTML = "";
      projectContainer.innerHTML = "";
      certificationContainer.innerHTML = "";
      volunteeringContainer.innerHTML = "";

      initMultiSections();
      updatePreview();
    }

    /* ---------- EVENT BINDINGS ---------- */

    // Global input listener for live validation
    form.addEventListener("input", function (e) {
      const target = e.target;
      if (!(target instanceof HTMLInputElement || target instanceof HTMLTextAreaElement)) return;

      if (target === fullNameInput) {
        // live capitalization for full name
        const pos = target.selectionStart;
        target.value = capitalizeName(target.value);
        if (pos !== null) {
          target.selectionStart = target.selectionEnd = pos;
        }
      }

      validateField(target);
      updatePreview();
    });

    // Form submit → full validation
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      const ok = validateForm();
      if (ok) {
        updatePreview();
        setStatusMessage("All required fields look good. Your CV preview is up to date.");
      }
    });

    // Add buttons
    addEducationBtn.addEventListener("click", function () {
      addItem(educationTemplate, educationContainer, ".education-item");
    });

    addExperienceBtn.addEventListener("click", function () {
      addItem(experienceTemplate, experienceContainer, ".experience-item");
    });

    addProjectBtn.addEventListener("click", function () {
      addItem(projectTemplate, projectContainer, ".project-item");
    });

    addCertificationBtn.addEventListener("click", function () {
      addItem(certificationTemplate, certificationContainer, ".certification-item");
    });

    addVolunteeringBtn.addEventListener("click", function () {
      addItem(volunteeringTemplate, volunteeringContainer, ".volunteering-item");
    });

    // Print button on main page
    if (printBtn) {
      printBtn.addEventListener("click", function () {
        window.print();
      });
    }

    // Open in new tab: clone preview with same styles + print button hidden during print
    if (openNewTabBtn) {
      openNewTabBtn.addEventListener("click", function () {
        if (!cvPreview) return;
        const win = window.open("", "_blank");
        if (!win) return;

        const cssLinks = Array.from(
          document.querySelectorAll('link[rel="stylesheet"]')
        ).map((link) => link.href);

        const headHTML = cssLinks
          .map((href) => `<link rel="stylesheet" href="${href}">`)
          .join("");

        const html = `
          <!DOCTYPE html>
          <html lang="en">
          <head>
            <meta charset="UTF-8">
            <title>CV Preview</title>
            ${headHTML}
            <style>
              @media print {
                #print-btn-nt {
                  display: none !important;
                }
                body {
                  background: white !important;
                }
                #cv-preview {
                  margin: 0;
                  padding: 5mm 10mm;
                }
                section {
                  break-inside: avoid !important;
                  page-break-inside: avoid !important;
                }
              }
            </style>
          </head>
          <body>
            <button type="button"
              id="print-btn-nt"
              onclick="window.print()"
              class="btn-primary btn"
              style="position:fixed;top:16px;right:16px;z-index:9999;">
              Print / Save as PDF
            </button>
            ${cvPreview.outerHTML}
          </body>
          </html>
        `;

        win.document.open();
        win.document.write(html);
        win.document.close();
      });
    }

    // Clear all fields
    if (clearFormBtn) {
      clearFormBtn.addEventListener("click", function () {
        clearForm();
      });
    }

    /* ---------- INIT ---------- */
    initMultiSections();
    // Initial preview: minimal, no fake content
    previewSummarySection.style.display = "none";
    previewEducationSection.style.display = "none";
    previewExperienceSection.style.display = "none";
    previewProjectsSection.style.display = "none";
    previewCertificationsSection.style.display = "none";
    previewVolunteeringSection.style.display = "none";
    previewSkillsSection.style.display = "none";
    updatePreview();
  });
})();
