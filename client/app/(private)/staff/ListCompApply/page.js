"use client";

import React, { useState, useEffect } from "react";
import "./submissionList.css";

export default function SubmissionList() {
  const [submissions, setSubmissions] = useState([]); // State for submission data
  const [isLoading, setIsLoading] = useState(true); // State for loading indicator
  const [errorMessage, setErrorMessage] = useState(""); // State for error messages

  // Fetch submissions from the backend
  useEffect(() => {
    const fetchSubmissions = async () => {
      try {
        const response = await fetch("http://localhost:3030/competitionApply/submissions");
        if (!response.ok) throw new Error(`Error fetching submissions: ${response.statusText}`);

        const data = await response.json(); // Parse JSON data
        setSubmissions(data); // Update state with submission data
        setIsLoading(false); // Stop loading
      } catch (error) {
        console.error("Failed to fetch submissions:", error.message);
        setErrorMessage("Unable to load submissions. Please try again later.");
        setIsLoading(false); // Stop loading regardless of success or error
      }
    };

    fetchSubmissions();
  }, []);

  // Render submission list
  return (
    <div className="LCA-submission-list-container">
      <header className="LCA-submission-list-header">
        <h2 className="LCA-submission-list-title">Submission List</h2>
      </header>
      {isLoading ? (
        <p className="LCA-loading-message">Loading submissions...</p>
      ) : errorMessage ? (
        <p className="LCA-error-message">{errorMessage}</p>
      ) : submissions.length > 0 ? (
        <table className="LCA-table">
          <thead className="LCA-table-header">
            <tr>
              <th></th>
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
            {submissions.map((submission, index) => (
              <tr key={submission._id}>
                <td>{index + 1}</td>
                <td>{submission.crewName}</td>
                <td>{submission.contactName}</td>
                <td>{submission.contactNumber}</td>
                <td>{submission.instagram}</td>
                <td>{submission.category}</td>
                <td>{submission.teamMembers}</td>
                <td>
                  <a
                    href={submission.videoURL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="LCA-table-link"
                  >
                    Watch Video
                  </a>
                </td>
                <td>
                  {submission.transactionSlip ? (
                    <div>
                      {/* Display the original file name */}
                      <p className="LCA-file-name">{submission.transactionSlip}</p>

                      {/* Clickable image to download the renamed file */}
                      <a
                        href={`http://localhost:3030/uploads/${submission.transactionSlip}`}
                        download={`CompApply${index + 1}.png`} // Renaming the file
                        className="LCA-table-link"
                      >
                        <img
                          src={`http://localhost:3030/uploads/${submission.transactionSlip}`}
                          alt="Transaction Slip"
                          className="LCA-transaction-image"
                        />
                      </a>
                    </div>
                  ) : (
                    "No file uploaded"
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p className="LCA-error-message">No submissions found.</p>
      )}
    </div>
  );
}
