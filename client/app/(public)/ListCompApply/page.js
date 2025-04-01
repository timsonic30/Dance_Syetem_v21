"use client";

import React, { useState, useEffect } from "react";
import "./submissionList.css";

export default function SubmissionList() {
  const [submissions, setSubmissions] = useState([]); // State for storing submission data
  const [loading, setLoading] = useState(true); // State for loading indicator
  const [error, setError] = useState(""); // State for errors

  // Fetch submissions from the backend
  useEffect(() => {
    const fetchSubmissions = async () => {
      try {
        const response = await fetch("http://localhost:3030/competitionApply/submissions"); // Backend endpoint
        if (!response.ok) {
          throw new Error(`Failed to fetch data: ${response.statusText}`);
        }

        const data = await response.json(); // Parse JSON response
        setSubmissions(data); // Store submissions in state
        setLoading(false); // Data successfully loaded
      } catch (error) {
        console.error("Error fetching submissions:", error.message);
        setError("Failed to fetch submissions. Please try again later."); // Set error message
        setLoading(false); // Loading complete
      }
    };

    fetchSubmissions();
  }, []); // Run once when the component mounts

  return (
    <div className="ListComp-submission-list-container">
      <h2>Submission List</h2>
      {loading ? (
        <p className="ListComp-loading-message">Loading submissions...</p>
      ) : error ? (
        <p className="ListComp-error-message">{error}</p>
      ) : submissions.length > 0 ? (
        <table className="ListComp-table">
          <thead>
            <tr>
              <th>Crew Name</th>
              <th>Contact Name</th>
              <th>Contact Number</th>
              <th>Instagram</th>
              <th>Category</th>
              <th>Team Members</th>
              <th>Video URL</th>
              <th>Transaction Slip</th>
            </tr>
          </thead>
          <tbody>
            {submissions.map((submission) => (
              <tr key={submission._id}>
                <td>{submission.crewName}</td>
                <td>{submission.contactName}</td>
                <td>{submission.contactNumber}</td>
                <td>{submission.instagram}</td>
                <td>{submission.category}</td>
                <td>{submission.teamMembers}</td>
                <td>
                  <a href={submission.videoURL} target="_blank" rel="noopener noreferrer">
                    Watch Video
                  </a>
                </td>
                <td>
                  {submission.transactionSlip ? (
                    <a
                      href={`http://localhost:3030/uploads/${submission.transactionSlip}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      View Slip
                    </a>
                  ) : (
                    "No file uploaded"
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p className="ListComp-error-message">No submissions found.</p>
      )}
    </div>
  );
}
