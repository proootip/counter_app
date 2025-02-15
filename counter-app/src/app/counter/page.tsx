"use client";

import { useEffect, useState } from "react";

export default function CounterPage() {
  const [counter, setCounter] = useState(0);
  const [counterMin, setCounterMin] = useState(0);
  const [counterHour, setCounterHour] = useState(0);
  const [hourlyLog, setHourlyLog] = useState<string[]>([]);
  const [minuteLog, setMinuteLog] = useState<string[]>([]);
  const [showMinuteLog, setShowMinuteLog] = useState(false); // State to toggle minute log visibility
  const [fileHandle, setFileHandle] = useState<FileSystemFileHandle | null>(null);
  const [detailedLogHandle, setDetailedLogHandle] = useState<FileSystemFileHandle | null>(null);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.code === "Space") {
        event.preventDefault();
        incrementCounter();
        logMinute();
        logHourly();  // Log hourly after the first actual update
        
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [counter]);

  const incrementCounter = () => {
    // Increment counter and ensure hourly log starts at 1 on the first press
    if (counter === 0) {
      setCounter(1); // First spacebar press increments to 1
    } else {
      setCounter((prev) => prev + 1);
    }
    if(counterMin === 0){
        setCounterMin(1);
    }else{
        setCounterMin((prev) => prev + 1);
    }
    if(counterHour === 0){
        setCounterHour(1);
    }else{
        setCounterHour((prev) => prev + 1);
    }
  };

  const logHourly = () => {
    const currentHour = new Date().getHours();
    const currentLog = `${currentHour}: ${counterHour+1}`;
    setHourlyLog((prevLog) => {
      const lastEntry = prevLog[prevLog.length - 1];
      // Update the log only if the hour changes
      if (lastEntry?.startsWith(`${currentHour}:`)) {
        const updatedLog = [...prevLog];
        updatedLog[updatedLog.length - 1] = currentLog;
        return updatedLog;
      }else{
        setCounterHour(1);
        const currentLog = `${currentHour}: ${1}`;
        return [...prevLog, currentLog];
    }
    });
  };

const logMinute = () => {
  const currentTime = new Date();
  const currentHour = currentTime.getHours();
  const currentMinute = currentTime.getMinutes();
  const logEntry = `${currentHour}:${String(currentMinute).padStart(2, "0")} - ${counter+1}`;
  const logEntryMin = `${currentHour}:${String(currentMinute).padStart(2, "0")} - ${counterMin+1}`;

  setMinuteLog((prevLog) => {
    const existingLogIndex = prevLog.findIndex(
      (entry) => entry.startsWith(`${currentHour}:${String(currentMinute).padStart(2, "0")}`)
    );

    if (existingLogIndex !== -1) {
      // If an entry already exists for this minute, update it
      const updatedLog = [...prevLog];
      updatedLog[existingLogIndex] = logEntryMin;
      return updatedLog;
    } else {
      // If no entry exists for this minute, add a new one
      setCounterMin(1);
      const logEntryMin1 = `${currentHour}:${String(currentMinute).padStart(2, "0")} - ${1}`;
      return [...prevLog, logEntryMin1];
    }
  });
};

  const handleSelectFile = async () => {
    try {
      const [handle] = await (window as any).showOpenFilePicker();
      setFileHandle(handle);
    } catch (error) {
      console.error("File selection canceled.");
    }
  };

  const handleSelectDetailedLogFile = async () => {
    try {
      const [handle] = await (window as any).showOpenFilePicker();
      setDetailedLogHandle(handle);
    } catch (error) {
      console.error("Detailed log file selection canceled.");
    }
  };

  const handleSaveToFile = async () => {
    if (!fileHandle) {
      alert("Please select a file for the counter log first.");
      return;
    }

    try {
      const writable = await fileHandle.createWritable();
      const logData = hourlyLog.join("\n");
      await writable.write(logData);
      await writable.close();
      alert("Hourly log saved successfully!");
    } catch (error) {
      console.error("Error writing to file:", error);
    }
  };

  const handleSaveDetailedLog = async () => {
    if (!detailedLogHandle) {
      alert("Please select a file for detailed logs first.");
      return;
    }

    try {
      const writable = await detailedLogHandle.createWritable();
      const logData = minuteLog.join("\n");
      await writable.write(logData);
      await writable.close();
      alert("Detailed log saved successfully!");
    } catch (error) {
      console.error("Error writing to file:", error);
    }
  };

  const handleIncrease = () => {
    incrementCounter();
    logMinute();
    logHourly();  // Log hourly after the first actual update
  };

  const handleDecrease = () => {
    setCounter((prev) => Math.max(prev - 1, 0)); // Prevent going below 0
    logMinute();
    logHourly();  // Log hourly after the first actual update
  };

  const handleReset = () => {
    setCounter(0);
    logMinute();
    logHourly();  // Log hourly after reset
  };

  const toggleMinuteLogVisibility = () => {
    setShowMinuteLog((prev) => !prev);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center p-8">
      <h1 className="text-4xl font-bold mb-6">Counter App</h1>
      <p className="text-2xl">Counter: {counter}</p>
      <p className="mt-2 text-gray-400">(Press spacebar to increase the counter)</p>

      <div className="mt-6">
        <button onClick={handleIncrease} className="px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-700 transition-colors">
          Increase
        </button>
        <button onClick={handleDecrease} className="ml-6 px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-700 transition-colors">
          Decrease
        </button>
        <button onClick={handleReset} className="ml-6 px-6 py-3 bg-yellow-500 text-white rounded-lg hover:bg-yellow-700 transition-colors">
          Reset
        </button>
      </div>

      <div className="mt-6">
        <button onClick={handleSelectFile} className="mt-4 px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-700 transition-colors">
          Select File for Hourly Log
        </button>

        <button onClick={handleSelectDetailedLogFile} className="mt-4 px-6 py-3 bg-purple-500 text-white rounded-lg hover:bg-purple-700 transition-colors">
          Select File for Detailed Log
        </button>

        <button onClick={handleSaveToFile} className="mt-4 px-6 py-3 bg-teal-500 text-white rounded-lg hover:bg-teal-700 transition-colors">
          Save Hourly Log
        </button>

        <button onClick={handleSaveDetailedLog} className="mt-4 px-6 py-3 bg-indigo-500 text-white rounded-lg hover:bg-indigo-700 transition-colors">
          Save Detailed Log
        </button>
      </div>

      <div className="mt-8">
        <h3 className="text-lg font-semibold">Hourly Log:</h3>
        <ul>
          {hourlyLog.map((entry, index) => (
            <li key={index}>{entry}</li>
          ))}
        </ul>
      </div>

      <div className="mt-8">
        <button
          onClick={toggleMinuteLogVisibility}
          className="px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-700 transition-colors"
        >
          {showMinuteLog ? "Hide Minute Log" : "Show Minute Log"}
        </button>
        {showMinuteLog && (
          <>
            <h3 className="text-lg font-semibold mt-6">Detailed Log:</h3>
            <ul>
              {minuteLog.map((entry, index) => (
                <li key={index}>{entry}</li>
              ))}
            </ul>
          </>
        )}
      </div>
    </div>
  );
}
