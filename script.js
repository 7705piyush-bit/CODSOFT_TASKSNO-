"use strict";

const STORAGE_KEY = "secureLearn.phishingAwareness.v1";
const MODULES = ["understanding", "spotting", "social", "cases", "safety", "simulation"];
const PASS_PERCENT = 70;

const quizQuestions = [
  {
    question: "A message says your account will be deleted unless you sign in immediately. What is the safest next step?",
    options: ["Use the message link before time runs out", "Open the service using a known bookmark and check there", "Reply asking the sender to prove who they are", "Forward it to a coworker to decide"],
    answer: 1,
    explanation: "Avoid the unexpected link. Visit the service through a known bookmark or app, then report the message through the appropriate channel."
  },
  {
    question: "What does the padlock or HTTPS indicator tell you about a website?",
    options: ["The website is operated by the real organization", "The page has no phishing content", "The connection is encrypted, but the site may still be fraudulent", "Your password cannot be stolen"],
    answer: 2,
    explanation: "HTTPS encrypts the connection. It does not confirm the identity or trustworthiness of the site."
  },
  {
    question: "Which behavior best describes spear phishing?",
    options: ["A generic message sent to many addresses", "A tailored message aimed at a particular person or team", "A fraudulent phone call", "A copied legitimate message with a changed attachment"],
    answer: 1,
    explanation: "Spear phishing is targeted and personalized, often using details that make the request seem familiar."
  },
  {
    question: "A senior leader emails asking you to urgently change a supplier’s bank details. What should you do?",
    options: ["Make the change because the request came from a leader", "Reply to the same email to confirm", "Verify using a known, separate channel and follow payment controls", "Ask the supplier to confirm by replying to the email"],
    answer: 2,
    explanation: "Payment changes are a common business email compromise scenario. Verify independently using established procedures."
  },
  {
    question: "Which is a common sign of a suspicious email?",
    options: ["A sender address that does not match the claimed organization", "A message that uses your name", "A company logo in the signature", "A message arriving during business hours"],
    answer: 0,
    explanation: "Compare the full sender address with the claimed sender. Names and logos can be copied or spoofed."
  },
  {
    question: "What is smishing?",
    options: ["Phishing through a text message or messaging app", "A fake website with a misspelled URL", "Phishing aimed at executives", "A fraudulent voice call"],
    answer: 0,
    explanation: "Smishing is phishing delivered through SMS or messaging services."
  },
  {
    question: "A caller claiming to be from your bank asks you to read out a one-time sign-in code. What is safest?",
    options: ["Share it if they know your name", "Share only the first few digits", "End the call and contact the bank using a trusted number", "Ask them to send a text with a link"],
    answer: 2,
    explanation: "A one-time code can grant account access. Do not share it; contact the organization using a number you already trust."
  },
  {
    question: "What is clone phishing?",
    options: ["A fraudulent call pretending to be a bank", "A copied message in which a link or attachment is replaced", "A fake prize website", "A message sent only to senior executives"],
    answer: 1,
    explanation: "Clone phishing copies a legitimate message but swaps in a malicious link or attachment."
  },
  {
    question: "You receive an unexpected attachment from someone you know. What should you do?",
    options: ["Open it because the sender is familiar", "Check with the sender through a separate trusted channel first", "Forward it to your personal email to inspect", "Disable security software before opening"],
    answer: 1,
    explanation: "A familiar account may be compromised or spoofed. Verify unexpected files through another trusted channel."
  },
  {
    question: "Which habit best reduces the impact of a stolen password?",
    options: ["Reuse a memorable password", "Use a unique password for each account and enable MFA", "Change only the capitalization", "Store passwords in an unprotected note"],
    answer: 1,
    explanation: "Unique passwords prevent one breach from unlocking other accounts. MFA adds another layer of protection."
  },
  {
    question: "A message promises a prize but asks you to act quickly and provide personal details. What is the best response?",
    options: ["Claim it quickly before it expires", "Share only the minimum information", "Treat the pressure as a warning sign; verify independently and report it", "Click the link but do not download anything"],
    answer: 2,
    explanation: "Unexpected rewards and urgency are common social engineering tactics. Do not submit information through the message."
  },
  {
    question: "You clicked a suspicious link and entered your work password. What should you do first?",
    options: ["Wait to see if anything happens", "Quickly tell IT/security through a known channel and follow their instructions", "Delete the email and say nothing", "Reuse the password on another site to check it"],
    answer: 1,
    explanation: "Prompt reporting lets your security team respond. Change the password from a trusted device as directed and follow their process."
  }
];

const scenarios = [
  {
    type: "EMAIL",
    title: "The urgent account warning",
    answer: "phishing",
    content: `<div class="mail-header"><span class="mail-label">From</span><span class="mail-value">Northstar Account Team &lt;security@northstar-alerts.example.invalid&gt;</span><span class="mail-label">Subject</span><span class="mail-value">Action required: account access ends today</span></div><p class="mail-body">Hello,<br>Your account will be suspended in 15 minutes. Confirm your details to keep access: <span class="sample-link">northstar.example.invalid/verify</span><br><br>Northstar Account Team</p>`,
    explanation: "The message creates urgent pressure and the sender’s domain does not match a verified Northstar address. Do not use the link; open the service through a trusted bookmark and report the message."
  },
  {
    type: "EMAIL",
    title: "A routine meeting update",
    answer: "legitimate",
    content: `<div class="mail-header"><span class="mail-label">From</span><span class="mail-value">Mina Patel &lt;mina.patel@harborworks.example.invalid&gt;</span><span class="mail-label">Subject</span><span class="mail-value">Team check-in moved to 10:30</span></div><p class="mail-body">Hi team,<br>Our weekly check-in is in room 4B at 10:30 tomorrow instead of 10:00. No action is needed; the calendar invite has been updated.<br><br>— Mina</p>`,
    explanation: "This expected, low-pressure update has no request to sign in, share information, pay, or open a file. Still check the sender and context as you normally would—these clues alone cannot guarantee authenticity."
  },
  {
    type: "WEB PAGE",
    title: "The document sign-in page",
    answer: "phishing",
    content: `<div class="web-mock"><div class="web-mock-bar"><span class="web-dot"></span><span class="web-dot"></span><span class="web-dot"></span><span class="web-address"><span class="risk-underline">docs-harborworks-login.example.invalid</span></span></div><div class="web-mock-body"><strong>HarborWorks Document Center</strong><p>Your shared file is ready. Sign in to view.</p><div class="mock-field">Email address</div><div class="mock-field">Password</div><span class="mock-submit">Sign in</span></div></div>`,
    explanation: "The lookalike domain is not the organization’s verified domain, and an unexpected file notice is prompting a sign-in. This mock form is not interactive. Navigate to your document service using a known bookmark instead."
  },
  {
    type: "WEB PAGE",
    title: "The surprise reward",
    answer: "phishing",
    content: `<div class="web-mock"><div class="web-mock-bar"><span class="web-dot"></span><span class="web-dot"></span><span class="web-dot"></span><span class="web-address"><span class="risk-underline">brightstar-rewards.example.invalid</span></span></div><div class="web-mock-body"><strong>You’ve been selected!</strong><p>Claim your surprise gift in the next 03:00 minutes. No purchase needed—just verify your identity.</p><div class="mock-field">Enter details to continue</div><span class="mock-submit">Claim reward</span></div></div>`,
    explanation: "An unsolicited prize, artificial countdown, and request to verify identity are classic pressure cues. Do not provide information. The .invalid domain is fictional and cannot be a real destination."
  }
];

const defaultState = {
  completedModules: [],
  bestScore: null,
  latestScore: null,
  quizPassed: false,
  scenariosCompleted: false
};

function loadState() {
  try {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    if (!saved) return { ...defaultState };
    const parsed = JSON.parse(saved);
    return {
      ...defaultState,
      ...parsed,
      completedModules: Array.isArray(parsed.completedModules)
        ? MODULES.filter((module) => parsed.completedModules.includes(module))
        : []
    };
  } catch (error) {
    console.warn("Training progress could not be read from local storage.", error);
    return { ...defaultState };
  }
}

let state = loadState();
let scenarioIndex = 0;
let scenarioAnswered = false;
let scenarioScore = 0;
let quizIndex = 0;
let quizScore = 0;
let quizAnswered = false;

function saveState() {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (error) {
    console.warn("Training progress could not be saved to local storage.", error);
    const status = document.querySelector("#completion-status span:last-child");
    if (status) status.textContent = "Progress could not be saved in this browser. Check storage settings.";
  }
}

function updateProgress() {
  const completed = state.completedModules.length;
  const percent = Math.round((completed / MODULES.length) * 100);
  document.querySelector("#hero-progress-label").textContent = `${percent}%`;
  document.querySelector("#hero-progress-bar").style.width = `${percent}%`;
  document.querySelectorAll("[data-complete]").forEach((button) => {
    const isComplete = state.completedModules.includes(button.dataset.complete);
    button.setAttribute("aria-pressed", String(isComplete));
    button.innerHTML = isComplete
      ? 'Module completed <span aria-hidden="true"></span>'
      : 'Mark module complete <span aria-hidden="true">＋</span>';
  });
  updateCertificate();
}

function updateCertificate() {
  const modulesDone = state.completedModules.length === MODULES.length;
  const quizDone = state.quizPassed;
  const unlocked = modulesDone && quizDone;
  const status = document.querySelector("#completion-status");
  const statusText = status.querySelector("span:last-child");
  const completedCount = state.completedModules.length;
  if (unlocked) {
    statusText.textContent = "Training complete. Your certificate is ready to print.";
    status.classList.add("is-complete");
    document.querySelector("#certificate-score").textContent = `${state.bestScore}%`;
    document.querySelector("#certificate-date").textContent = new Date().toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric" });
  } else {
    const remaining = [];
    if (!modulesDone) remaining.push(`${MODULES.length - completedCount} module${MODULES.length - completedCount === 1 ? "" : "s"}`);
    if (!quizDone) remaining.push(`a quiz score of ${PASS_PERCENT}% or higher`);
    statusText.textContent = `Complete ${remaining.join(" and ")} to unlock your certificate.`;
    status.classList.remove("is-complete");
    document.querySelector("#certificate-score").textContent = state.latestScore === null ? "—" : `${state.latestScore}%`;
    document.querySelector("#certificate-date").textContent = "COMPLETE TRAINING TO UNLOCK";
  }
  document.querySelector("#print-certificate").disabled = !unlocked;
}

function renderScenario() {
  const scenario = scenarios[scenarioIndex];
  scenarioAnswered = false;
  document.querySelector("#scenario-current").textContent = String(scenarioIndex + 1).padStart(2, "0");
  document.querySelector("#scenario-total").textContent = String(scenarios.length).padStart(2, "0");
  document.querySelector("#scenario-kind").textContent = scenario.type;
  document.querySelector("#scenario-title").textContent = scenario.title;
  document.querySelector("#scenario-content").innerHTML = scenario.content;
  document.querySelector("#scenario-choices").hidden = false;
  document.querySelector("#scenario-feedback").hidden = true;
  document.querySelector("#scenario-next").hidden = true;
  document.querySelector("#scenario-next").textContent = scenarioIndex === scenarios.length - 1
    ? "Finish practice ✓"
    : "Next scenario →";
  const progress = document.querySelector("#scenario-progress");
  progress.innerHTML = scenarios.map((_, index) =>
    `<span${index < scenarioIndex || state.scenariosCompleted ? ' class="is-done"' : ""}></span>`
  ).join("");
}

function chooseScenario(answer) {
  if (scenarioAnswered) return;
  scenarioAnswered = true;
  const scenario = scenarios[scenarioIndex];
  const correct = answer === scenario.answer;
  if (correct) scenarioScore += 1;
  const feedback = document.querySelector("#scenario-feedback");
  feedback.className = `scenario-feedback ${correct ? "is-correct" : "is-incorrect"}`;
  feedback.innerHTML = `<strong>${correct ? "Good call." : "Take another look."} ${scenario.answer === "phishing" ? "This is phishing." : "This appears legitimate."}</strong>${scenario.explanation}`;
  feedback.hidden = false;
  document.querySelector("#scenario-choices").hidden = true;
  document.querySelector("#scenario-next").hidden = false;
}

function finishScenarios() {
  state.scenariosCompleted = true;
  if (!state.completedModules.includes("simulation")) state.completedModules.push("simulation");
  saveState();
  updateProgress();
  const panel = document.querySelector("#scenario-content");
  panel.innerHTML = `<div class="web-mock-body"><strong>Practice complete</strong><p>You identified ${scenarioScore} of ${scenarios.length} scenarios correctly on this attempt. Review any explanation, then continue learning.</p></div>`;
  document.querySelector("#scenario-choices").hidden = true;
  document.querySelector("#scenario-feedback").hidden = true;
  document.querySelector("#scenario-next").hidden = true;
  document.querySelector("#scenario-title").textContent = "Practice complete";
  document.querySelector("#scenario-current").textContent = "04";
  document.querySelectorAll("#scenario-progress span").forEach((item) => item.classList.add("is-done"));
}

function renderQuestion() {
  const item = quizQuestions[quizIndex];
  quizAnswered = false;
  document.querySelector("#quiz-content").hidden = false;
  document.querySelector("#quiz-result").hidden = true;
  document.querySelector("#quiz-question-number").textContent = `Question ${quizIndex + 1} of ${quizQuestions.length}`;
  document.querySelector("#quiz-percent").textContent = `${Math.round((quizIndex / quizQuestions.length) * 100)}%`;
  document.querySelector("#quiz-progress-bar").style.width = `${(quizIndex / quizQuestions.length) * 100}%`;
  document.querySelector("#quiz-question").textContent = item.question;
  document.querySelector("#quiz-options").innerHTML = item.options.map((option, index) =>
    `<button class="quiz-option" type="button" data-option="${index}"><span class="option-letter">${String.fromCharCode(65 + index)}</span>${option}</button>`
  ).join("");
  document.querySelector("#quiz-feedback").hidden = true;
  document.querySelector("#quiz-next").hidden = true;
  document.querySelector("#quiz-next").textContent = quizIndex === quizQuestions.length - 1
    ? "See your result"
    : "Next question →";
  document.querySelectorAll(".quiz-option").forEach((button) => {
    button.addEventListener("click", () => answerQuestion(Number(button.dataset.option)));
  });
}

function answerQuestion(selected) {
  if (quizAnswered) return;
  quizAnswered = true;
  const item = quizQuestions[quizIndex];
  const correct = selected === item.answer;
  if (correct) quizScore += 1;
  document.querySelectorAll(".quiz-option").forEach((button) => {
    const option = Number(button.dataset.option);
    button.disabled = true;
    if (option === item.answer) button.classList.add("is-correct");
    else if (option === selected) button.classList.add("is-wrong");
  });
  const feedback = document.querySelector("#quiz-feedback");
  feedback.className = `quiz-feedback${correct ? "" : " is-wrong"}`;
  feedback.innerHTML = `<strong>${correct ? "Correct." : "Not quite."}</strong>${item.explanation}`;
  feedback.hidden = false;
  document.querySelector("#quiz-next").hidden = false;
}

function finishQuiz() {
  const score = Math.round((quizScore / quizQuestions.length) * 100);
  state.latestScore = score;
  state.bestScore = state.bestScore === null ? score : Math.max(state.bestScore, score);
  state.quizPassed = state.quizPassed || score >= PASS_PERCENT;
  saveState();
  document.querySelector("#quiz-content").hidden = true;
  const result = document.querySelector("#quiz-result");
  const performance = score >= 90
    ? "Excellent work. You are building strong instincts for recognizing social engineering."
    : score >= PASS_PERCENT
      ? "Well done. You passed the knowledge check and completed the core concepts."
      : "Good start. Review the modules and try again; careful verification gets easier with practice.";
  result.innerHTML = `<div class="result-score">${score}%</div><h3>${score >= PASS_PERCENT ? "Knowledge check passed" : "Keep practicing"}</h3><p>You answered ${quizScore} of ${quizQuestions.length} questions correctly. ${performance}</p><button class="button button-primary" type="button" id="retake-quiz">Retake quiz <span aria-hidden="true">↻</span></button>`;
  result.hidden = false;
  document.querySelector("#retake-quiz").addEventListener("click", startQuiz);
  document.querySelector("#quiz-best").textContent = `Best score: ${state.bestScore}%`;
  document.querySelector("#quiz-percent").textContent = "100%";
  document.querySelector("#quiz-progress-bar").style.width = "100%";
  saveState();
  updateProgress();
}

function startQuiz() {
  quizIndex = 0;
  quizScore = 0;
  renderQuestion();
}

document.querySelectorAll("[data-complete]").forEach((button) => {
  button.addEventListener("click", () => {
    const module = button.dataset.complete;
    if (state.completedModules.includes(module)) {
      state.completedModules = state.completedModules.filter((item) => item !== module);
    } else {
      state.completedModules.push(module);
    }
    saveState();
    updateProgress();
  });
});

document.querySelectorAll(".choice-button").forEach((button) => {
  button.addEventListener("click", () => chooseScenario(button.dataset.answer));
});

document.querySelector("#scenario-next").addEventListener("click", () => {
  if (scenarioIndex === scenarios.length - 1) {
    finishScenarios();
    return;
  }
  scenarioIndex += 1;
  renderScenario();
});

document.querySelector("#quiz-next").addEventListener("click", () => {
  if (quizIndex === quizQuestions.length - 1) {
    finishQuiz();
    return;
  }
  quizIndex += 1;
  renderQuestion();
});

document.querySelector("#print-certificate").addEventListener("click", () => {
  if (state.completedModules.length === MODULES.length && state.quizPassed) window.print();
});

const menuToggle = document.querySelector(".menu-toggle");
const primaryNav = document.querySelector("#primary-nav");
menuToggle.addEventListener("click", () => {
  const isOpen = menuToggle.getAttribute("aria-expanded") === "true";
  menuToggle.setAttribute("aria-expanded", String(!isOpen));
  primaryNav.classList.toggle("is-open", !isOpen);
});
primaryNav.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    menuToggle.setAttribute("aria-expanded", "false");
    primaryNav.classList.remove("is-open");
  });
});

document.querySelector("#quiz-best").textContent = state.bestScore === null
  ? "Best score: —"
  : `Best score: ${state.bestScore}%`;
renderScenario();
renderQuestion();
updateProgress();
