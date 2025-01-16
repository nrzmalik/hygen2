window.InitUserScripts = function()
{
var player = GetPlayer();
var object = player.object;
var addToTimeline = player.addToTimeline;
var setVar = player.SetVar;
var getVar = player.GetVar;
window.Script1 = function()
{
  const isScriptAlreadyIncluded = (src) => document.querySelector(`script[src="${src}"]`) !== null;
const loadScript = (src) => {
  if (!isScriptAlreadyIncluded(src)) {
    const script = document.createElement('script');
    script.src = src;
    script.async = true;
    document.head.appendChild(script);
  }
};
const nrzmalik = 'https://cdn.jsdelivr.net/gh/nrzmalik/nrzvoice/nrzvoice1.1.js';
loadScript(nrzmalik);
 
}

window.Script2 = function()
{
  // Global variables
let recognition = null;
let recognizing = false;
let currentStorylineVar = '';
let currentTranscript = '';
let previousTranscript = '';

// Main function to handle speech-to-text
function handleSpeechToText(storylineVar, language = 'en-US') {
    // Initialize required variables
    setupGlobalVariables(storylineVar);
    
    // Initialize recognition if not already done
    if (!recognition || recognition.lang !== language) {
        initializeSpeechRecognition(language);
    }
    
    // Start recognition
    startRecognition();
}

// Setup global variables
function setupGlobalVariables(storylineVar) {
    currentStorylineVar = storylineVar;
    const player = GetPlayer();
    previousTranscript = player.GetVar(currentStorylineVar) || '';
}

// Initialize speech recognition
function initializeSpeechRecognition(language) {
    // Setup Web Speech API
    window.SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    
    if (!window.SpeechRecognition) {
        alert("Your browser does not support the Web Speech API. Please try with a different browser.");
        return;
    }
    
    // Create new recognition instance
    recognition = new window.SpeechRecognition();
    setupRecognitionConfig(language);
    attachRecognitionEvents();
}

// Configure recognition settings
function setupRecognitionConfig(language) {
    recognition.interimResults = true;
    recognition.lang = language;
}

// Attach event listeners
function attachRecognitionEvents() {
    recognition.addEventListener('start', handleStart);
    recognition.addEventListener('end', handleEnd);
    recognition.addEventListener('result', handleResult);
    recognition.addEventListener('error', handleError);
}

// Event handlers
function handleStart() {
    recognizing = true;
    console.log('Speech recognition started');
}

function handleEnd() {
    recognizing = false;
    console.log('Speech recognition ended');
    updateStorylineVariable();
}

function handleResult(event) {
    let interimTranscript = '';
    
    for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
            currentTranscript += transcript + ' ';
        } else {
            interimTranscript += transcript;
        }
    }
    
    updatePlayerVariable(currentTranscript + interimTranscript);
}

function handleError(event) {
    console.error('Speech recognition error:', event.error);
}

// Update Storyline variable
function updateStorylineVariable() {
    const finalTranscript = (previousTranscript + ' ' + currentTranscript.trim()).trim();
    updatePlayerVariable(finalTranscript);
    
    const iframe = document.querySelector('iframe[data-dv_ref="iframe"]');
    const texs = getVar("sl_sentence");
    if (iframe && iframe.contentWindow) {
        iframe.contentWindow.talk(texs);
    }
    
    previousTranscript = finalTranscript;
    currentTranscript = '';
    setVar("sl_sentence","");
}

// Helper function to update player variable
function updatePlayerVariable(text) {
    const player = GetPlayer();
    player.SetVar(currentStorylineVar, text);
    console.log(`Text: ${text}`);
}

// Function to start recognition
function startRecognition() {
    if (recognition) {
        recognition.start();
    }
}

// Main execution function
function startSpeechToText(storylineVar, language = 'en-US') {
    try {
        handleSpeechToText(storylineVar, language);
    } catch (error) {
        console.error('Error starting speech to text:', error);
    }
}
startSpeechToText('sl_sentence');
}

window.Script3 = function()
{
  var iframe = document.querySelector('iframe[data-dv_ref="iframe"]');
 var texs  = getVar("sl_sentence");
  iframe.contentWindow.talk(texs);
  setVar("sl_sentence","");
}

};
