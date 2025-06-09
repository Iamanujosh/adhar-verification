import React, { useState } from 'react';

const Verify = () => {
  const [selectedFile, setSelectedFile] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedFile) return;

    const formData = new FormData();
    formData.append('file', selectedFile);

    try {
      const response = await fetch('https://adhar-verification-flask2.onrender.com/api/generate-report', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        alert('Error generating report.');
        return;
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);

      const link = document.createElement('a');
      link.href = url;
      link.download = 'document_verification_report.pdf';
      document.body.appendChild(link);
      link.click();
      link.remove();

      // Clean up the URL object
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error uploading document:', error);
      alert('Something went wrong!');
    }
  };

  return (
    <div className="min-h-screen bg-cover bg-center bg-[radial-gradient(ellipse_at_top_center,_rgba(0,0,0,0.8),_black)] text-black mx-2 my-2 rounded-xl px-10 py-10 justify-center items-center h-screen m-0 flex">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-xl shadow-lg max-w-md w-full flex flex-col items-center mt-10"
      >
        <h2 className="text-2xl font-semibold text-gray-900 mb-6">
          Upload Your Document
        </h2>

        <label className="text-gray-700 text-lg mb-2" htmlFor="document">
          Choose a file to upload:
        </label>
        <input
          type="file"
          name="document"
          id="document"
          required
          onChange={(e) => setSelectedFile(e.target.files[0])}
          className="border-2 border-gray-300 focus:border-gray-600 focus:ring-2 focus:ring-gray-600 p-3 rounded-md w-full mb-6 text-gray-900 bg-gray-100 hover:bg-gray-200 transition ease-in-out duration-300"
        />

        <button
          type="submit"
          className="bg-black text-white py-3 px-6 rounded-md text-lg w-full hover:bg-gray-800 focus:ring-2 focus:ring-gray-600 transition duration-300 ease-in-out transform hover:scale-105"
        >
          Generate Report
        </button>
      </form>
    </div>
  );
};

export default Verify;
