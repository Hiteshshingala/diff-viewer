import "./assets/styles/vendors/diff2html.scss";
import "./assets/styles/index.scss";

import { useState, useMemo, useCallback } from "react";
import * as Diff2Html from "diff2html";
import { createTwoFilesPatch } from "diff";
import AceEditor from "react-ace";

import FolderOpenIcon from "@mui/icons-material/FolderOpen";
import IconButton from "@mui/material/IconButton";

import "brace/mode/text";
import "brace/theme/tomorrow";

export default function App() {
  const diffTitle = "Diff result";

  const [originalText, setOriginalText] = useState("");
  const [changedText, setChangedText] = useState("");
  const [outputFormat, setOutputFormat] = useState("side-by-side");
  const [showDiff, setShowDiff] = useState(false);

  const readFileContent = (file, setValue) => {
    const reader = new FileReader();
    reader.onload = (e) => setValue(e.target.result);
    reader.readAsText(file);
  };

  const onOutputFormatChange = useCallback((event) => {
    setOutputFormat(event.target.value);
  }, []);

  const onOriginalFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) readFileContent(file, setOriginalText);
  };

  const onChangedFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) readFileContent(file, setChangedText);
  };

  const diff = useMemo(() => {
    return createTwoFilesPatch(diffTitle, diffTitle, originalText, changedText);
  }, [originalText, changedText]);

  const outputHtml = useMemo(() => {
    return Diff2Html.html(diff, {
      outputFormat,
      drawFileList: false,
    });
  }, [diff, outputFormat]);

  const handleClear = () => {
    setOriginalText("");
    setChangedText("");
    setShowDiff(false);
  };

  return (
    <div className="App">
      <div className="custom-options">
        <label>
          <p>Output Format</p>
          <select value={outputFormat} onChange={onOutputFormatChange}>
            <option value="line-by-line">Line by Line</option>
            <option value="side-by-side">Side by Side</option>
          </select>
        </label>
        <button className="clear-btn" onClick={handleClear}>
          Clear
        </button>
      </div>

      {showDiff && (
        <div
          className="diff-result"
          dangerouslySetInnerHTML={{ __html: outputHtml }}
        />
      )}
      <div className="split-editor">
        <div className="editor-box">
          <div className="editor-header">
            <p>Original Text</p>
            <div className="editor-button">
              <IconButton component="label">
                <FolderOpenIcon />
                <input
                  hidden
                  type="file"
                  accept=".txt,.js,.json,.html,.css"
                  onChange={onOriginalFileUpload}
                />
                <p>Open File</p>
              </IconButton>
            </div>
          </div>

          <AceEditor
            mode="text"
            theme="tomorrow"
            value={originalText}
            onChange={setOriginalText}
            width="100%"
            wrapEnabled
            showPrintMargin={false}
          />
        </div>

        <div className="editor-box">
          <div className="editor-header">
            <p>Changed Text</p>
            <div className="editor-button">
              <IconButton component="label">
                <FolderOpenIcon />
                <input
                  hidden
                  type="file"
                  accept=".txt,.js,.json,.html,.css"
                  onChange={onChangedFileUpload}
                />
                <p>Open File</p>
              </IconButton>
            </div>
          </div>

          <AceEditor
            mode="text"
            theme="tomorrow"
            value={changedText}
            onChange={setChangedText}
            width="100%"
            wrapEnabled
            showPrintMargin={false}
          />
        </div>
      </div>
      <div className="custom-button">
        <button onClick={() => setShowDiff(true)}>Find Differences</button>
      </div>
    </div>
  );
}
