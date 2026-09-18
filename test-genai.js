const { GoogleGenAI } = require('@google/genai');
try {
  const ai = new GoogleGenAI({});
  console.log("Initialized without error");
} catch(e) {
  console.log("Error initializing:", e);
}
