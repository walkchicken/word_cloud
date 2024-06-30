import { useState,  useEffect,  } from 'react'
import { readWords, writeWord } from "./services";
import ReactWordcloud from "react-wordcloud";
import { Resizable } from "re-resizable";

export default function App() {
  const [words, setWords] = useState([]);

  useEffect(() => {
    readWords(setWords); // Fetch initial words
  }, []);

  const [input, setInput] = useState("");

  const addWord = (e) => {
    e.preventDefault();
    writeWord(input); // Save the new word
    setInput("");
  };

  // Calculate word frequencies
  const wordFrequencies = words.reduce((acc, { word }) => {
    acc[word] = (acc[word] || 0) + 1;
    return acc;
  }, {});

  // Map words to ReactWordcloud format with adjusted font size
  const wordCloudData = Object.keys(wordFrequencies).map(word => ({
    text: word,
    value: wordFrequencies[word], // Use frequency as value for font size
  }));

  const resizeStyle = {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    border: "solid 5px #ddd",
    background: "#f0f0f0",
    borderRadius: '12px'
  };

  const containerStyle = {
    position: "absolute",
    width: "100vw",
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  }

  const options = {
    colors: ["#1f77b4", "#ff7f0e", "#2ca02c", "#d62728", "#9467bd", "#8c564b"],
    fontSizes: [14, 60],
    rotations: 3,
    scale: "sqrt",
    spiral: "archimedean",
    transitionDuration: 1000
  };
  
  const callbacks = {
    getWordTooltip: (word) => null
  };

  return (
    <>
      <form onSubmit={addWord} className="word-form">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Enter a word"
          className="word-input"
        />
        <button type="submit" className="word-button">Add Word</button>
      </form>

      <div style={containerStyle}>
        <Resizable
          defaultSize={{
            width: 600,
            height: 300
          }}
          style={resizeStyle}
        >
          <div style={{ width: "100%", height: "100%" }}>
            <ReactWordcloud options={options} words={wordCloudData}
              callbacks={callbacks}
             />
          </div>
        </Resizable>
      </div>
    </>
  );
}
