import { useState } from "react";
import axios from "axios";
import { FaSun, FaMoon } from "react-icons/fa";

const App = () => {
  const [keyword, setKeyword] = useState("");
  const [language, setLanguage] = useState("Telugu");
  const [target, setTarget] = useState("en");
  const [results, setResults] = useState([]);
  const [text, setText] = useState("");
  const [targetLanguage, setTargetLanguage] = useState("en");
  const [translatedText, setTranslatedText] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  const languages = [
    "English",
    "Telugu",
    "Hindi",
    "Tamil",
    "Malayalam",
    "Kannada",
  ];

  const fetchVoiceInput = async (setFunction) => {
    try {
      setIsListening(true);
      const response = await axios.get("http://localhost:5000/voice-input");
      const voiceInput = response.data.voice_input;
      setFunction(voiceInput);
      setIsListening(false);
    } catch (error) {
      console.error("Error capturing voice input:", error);
      setIsListening(false);
    }
  };

  const speakText = (output) => {
    const synth = window.speechSynthesis;
    const utterance = new SpeechSynthesisUtterance(output);
    utterance.lang = "en-US";
    synth.speak(utterance);
  };

  const handleTranslate = async () => {
    try {
      const response = await axios.post("http://localhost:5000/translate", {
        text,
        target_language: targetLanguage,
      });
      const output = response.data.translated_text;
      setTranslatedText(output);
      speakText(output);
    } catch (error) {
      console.error("Error translating text:", error);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(translatedText);
    // alert("Translated text copied to clipboard!");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://127.0.0.1:5000/analyze", {
        keyword,
        language,
        target,
      });
      setResults(response.data);
      // speakText(`Analysis completed for keyword ${keyword}`);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  return (
    <div
      className={`min-h-screen p-8 font-sans transition-colors duration-300 ${
        darkMode
          ? "bg-gray-900 text-white"
          : "bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 text-gray-900"
      }`}
      style={{ fontFamily: "'Poppins', sans-serif" }}
    >
      <div className="flex flex-col justify-center items-center  mb-8">
        <h1 className="text-6xl font-sans font-bold drop-shadow-lg ">
          Translator & Analyzer App
        </h1>
        <button
          onClick={toggleDarkMode}
          className="absolute top-4 right-4 bg-transparent text-2xl p-2 rounded-full   focus:outline-none transition-all duration-300"
        >
          {darkMode ? <FaMoon /> : <FaSun />}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Translation Section */}
        <div
          className={`rounded-lg shadow-lg p-6 transition-colors duration-300 ${
            darkMode ? "bg-gray-800" : "bg-white"
          }`}
        >
          <h2 className="text-2xl font-semibold mb-4">Translation</h2>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Enter text to translate or use voice input"
            className="w-full h-32 border-2 rounded-lg p-3 focus:ring-2 focus:outline-none transition-colors duration-300"
            style={{
              borderColor: darkMode ? "#2d3748" : "#d2d6dc",
              backgroundColor: darkMode ? "#1a202c" : "#ffffff",
              color: darkMode ? "#e2e8f0" : "#1a202c",
            }}
          ></textarea>
          <div className="flex items-center justify-between mt-4">
            <button
              onClick={() => fetchVoiceInput(setText)}
              className={`px-4 py-2 rounded-lg font-bold flex items-center transition-colors duration-300 focus:outline-none focus:ring-4 ${
                isListening ? "animate-pulse" : ""
              }`}
              style={{
                background: darkMode ? "#eab308" : "#3b82f6",
                color: darkMode ? "#1a202c" : "#ffffff",
              }}
            >
              🎤 {isListening ? "Listening..." : "Voice Input"}
            </button>
            <select
              value={targetLanguage}
              onChange={(e) => setTargetLanguage(e.target.value)}
              className="w-1/2 border-2 rounded-lg p-3 focus:ring-2 focus:outline-none transition-colors duration-300"
              style={{
                borderColor: darkMode ? "#2d3748" : "#d2d6dc",
                backgroundColor: darkMode ? "#1a202c" : "#ffffff",
                color: darkMode ? "#e2e8f0" : "#1a202c",
              }}
            >
              <option value="en">English</option>
              <option value="te">Telugu</option>
              <option value="hi">Hindi</option>
              <option value="ta">Tamil</option>
              <option value="ml">Malayalam</option>
              <option value="kn">Kannada</option>
            </select>
          </div>
          <button
            onClick={handleTranslate}
            className="w-full mt-4 py-2 rounded-lg font-bold transition-colors duration-300 focus:ring-4 focus:outline-none"
            style={{
              background: darkMode ? "#16a34a" : "#38bdf8",
              color: darkMode ? "#1a202c" : "#ffffff",
            }}
          >
            Translate
          </button>
          {translatedText && (
            <div className="mt-6 relative">
              <h3 className="text-xl font-semibold">Translated Text:</h3>
              <p
                className="mt-2 p-4 rounded-lg shadow-md"
                style={{
                  backgroundColor: darkMode ? "#2d3748" : "#f9fafb",
                  color: darkMode ? "#e2e8f0" : "#1a202c",
                }}
              >
                {translatedText}
              </p>
              <button
                onClick={handleCopy}
                className="absolute top-10 right-0 bg-transparent text-lg p-2  hover:bg-gray-100 dark:hover:bg-gray-600 focus:outline-none transition-all duration-300"
                style={{ color: darkMode ? "#90cdf4" : "#3b82f6" }}
                title="Copy to Clipboard"
              >
                <i className="fas fa-copy"></i>
              </button>
            </div>
          )}
        </div>

        {/* Analysis Section */}
        <div
          className={`rounded-lg shadow-lg p-6 transition-colors duration-300 ${
            darkMode ? "bg-gray-800" : "bg-white"
          }`}
        >
          <h2 className="text-2xl font-semibold mb-4">Keyword Analysis</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex items-center">
              <input
                type="text"
                placeholder="Enter Keyword to analyze or use voice input"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                required
                className="w-full border-2 rounded-lg p-3 focus:ring-2 focus:outline-none transition-colors duration-300"
                style={{
                  borderColor: darkMode ? "#2d3748" : "#d2d6dc",
                  backgroundColor: darkMode ? "#1a202c" : "#ffffff",
                  color: darkMode ? "#e2e8f0" : "#1a202c",
                }}
              />
              <button
                type="button"
                onClick={() => fetchVoiceInput(setKeyword)}
                className={`ml-2 px-4 py-2 rounded-lg font-bold flex items-center transition-colors duration-300 focus:outline-none focus:ring-4 ${
                  isListening ? "animate-pulse" : ""
                }`}
                style={{
                  background: darkMode ? "#eab308" : "#3b82f6",
                  color: darkMode ? "#1a202c" : "#ffffff",
                }}
              >
                🎤
              </button>
            </div>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="w-full border-2 rounded-lg p-3 focus:ring-2 focus:outline-none transition-colors duration-300"
              style={{
                borderColor: darkMode ? "#2d3748" : "#d2d6dc",
                backgroundColor: darkMode ? "#1a202c" : "#ffffff",
                color: darkMode ? "#e2e8f0" : "#1a202c",
              }}
            >
              {languages.map((lang) => (
                <option key={lang} value={lang}>
                  {lang}
                </option>
              ))}
            </select>
            <select
              value={target}
              onChange={(e) => setTarget(e.target.value)}
              className="w-full border-2 rounded-lg p-3 focus:ring-2 focus:outline-none transition-colors duration-300"
              style={{
                borderColor: darkMode ? "#2d3748" : "#d2d6dc",
                backgroundColor: darkMode ? "#1a202c" : "#ffffff",
                color: darkMode ? "#e2e8f0" : "#1a202c",
              }}
            >
              <option value="en">English</option>
              <option value="te">Telugu</option>
              <option value="hi">Hindi</option>
              <option value="ta">Tamil</option>
              <option value="ml">Malayalam</option>
              <option value="kn">Kannada</option>
            </select>
            <button
              type="submit"
              className="w-full py-2 rounded-lg font-bold transition-colors duration-300 focus:ring-4 focus:outline-none"
              style={{
                background: darkMode ? "#4ade80" : "#34d399",
                color: darkMode ? "#1a202c" : "#ffffff",
              }}
            >
              Analyze
            </button>
          </form>
        </div>
      </div>

      {/* Results Table */}
      {results.length > 0 && (
        <div
          className="mt-12 rounded-lg shadow-lg p-6 transition-colors duration-300"
          style={{
            backgroundColor: darkMode ? "#2d3748" : "#f9fafb",
            color: darkMode ? "#e2e8f0" : "#1a202c",
          }}
        >
          <h2 className="text-2xl font-semibold mb-4 text-center">
            Analysis Results
          </h2>
          <div className="overflow-x-auto">
            <table
              className="w-full border-collapse rounded-lg shadow-md transition-colors duration-300"
              style={{
                borderColor: darkMode ? "#4a5568" : "#d2d6dc",
                borderWidth: "1px",
                borderStyle: "solid",
              }}
            >
              <thead>
                <tr
                  className={`text-white ${
                    darkMode ? "bg-gray-800" : "bg-gray-800"
                  } border`}
                  style={{
                    borderColor: darkMode ? "#4a5568" : "#d2d6dc",
                  }}
                >
                  <th
                    className="py-3 px-6 border"
                    style={{ borderColor: darkMode ? "#4a5568" : "#d2d6dc" }}
                  >
                    Title
                  </th>
                  <th
                    className="py-3 px-6 border"
                    style={{ borderColor: darkMode ? "#4a5568" : "#d2d6dc" }}
                  >
                    Translation
                  </th>
                  <th
                    className="py-3 px-6 border"
                    style={{ borderColor: darkMode ? "#4a5568" : "#d2d6dc" }}
                  >
                    Link
                  </th>
                  <th
                    className="py-3 px-6 border"
                    style={{ borderColor: darkMode ? "#4a5568" : "#d2d6dc" }}
                  >
                    Sentiment
                  </th>
                  <th
                    className="py-3 px-6 border"
                    style={{ borderColor: darkMode ? "#4a5568" : "#d2d6dc" }}
                  >
                    Behaviour
                  </th>
                </tr>
              </thead>
              <tbody>
                {results.map((result, index) => (
                  <tr
                    key={index}
                    className={`${
                      index % 2 === 0
                        ? darkMode
                          ? "bg-gray-700"
                          : "bg-gray-100"
                        : darkMode
                        ? "bg-gray-800"
                        : "bg-gray-50"
                    } hover:bg-indigo-500 hover:text-white transition-all duration-300 border`}
                    style={{
                      borderColor: darkMode ? "#4a5568" : "#d2d6dc",
                    }}
                  >
                    <td
                      className="py-4 px-6 border"
                      style={{ borderColor: darkMode ? "#4a5568" : "#d2d6dc" }}
                    >
                      {result.title}
                    </td>
                    <td
                      className="py-4 px-6 border"
                      style={{ borderColor: darkMode ? "#4a5568" : "#d2d6dc" }}
                    >
                      {result.translation}
                    </td>
                    <td
                      className="py-4 px-6 border"
                      style={{ borderColor: darkMode ? "#4a5568" : "#d2d6dc" }}
                    >
                      <a
                        href={result.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="underline"
                        style={{ color: darkMode ? "#90cdf4" : "#3b82f6" }}
                      >
                        View Article
                      </a>
                    </td>
                    <td
                      className="py-4 px-6 border"
                      style={{ borderColor: darkMode ? "#4a5568" : "#d2d6dc" }}
                    >
                      {result.sentiment.toFixed(2)}
                    </td>
                    <td
                      className="py-4 px-6 border"
                      style={{
                        borderColor: darkMode ? "#4a5568" : "#d2d6dc",
                        color:
                          result["Sentiment Class"] === "Positive"
                            ? "#16a34a" // Green for positive
                            : result["Sentiment Class"] === "Negative"
                            ? "#dc2626" // Red for negative
                            : darkMode
                            ? "#e2e8f0" // Default for neutral or other values in dark mode
                            : "#1a202c", // Default for neutral or other values in light mode
                      }}
                    >
                      {result["Sentiment Class"]}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
