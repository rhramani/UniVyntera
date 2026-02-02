import { toast } from "react-toastify";
import { BASEURL } from "../baseUrl";

/**
 * Download a file using the proper download endpoint with fallback
 * @param {string} filePath - The file path
 * @param {string} fileName - The file name
 * @param {string} applicationId - The application ID
 * @param {string} documentId - The document ID
 */
export const downloadFile = async (filePath, fileName, applicationId, documentId) => {
  try {
    // Show loading state
    toast.info("Downloading file...");
    
    let downloadUrl;
    let response;
    
    // Try the proper download endpoint first
    try {
      downloadUrl = `${BASEURL}/api/studentApplication/download/${applicationId}/${documentId}`;
      response = await fetch(downloadUrl, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    } catch (endpointError) {
      console.log("Download endpoint failed, trying direct file access:", endpointError);
      
      // Fallback to direct file access
      downloadUrl = filePath.startsWith('http') 
        ? filePath 
        : `${BASEURL}${filePath}`;
      
      response = await fetch(downloadUrl);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    }
    
    // Get the blob from the response
    const blob = await response.blob();
    
    // Create a download link
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    
    // Set the filename
    const fileExtension = fileName.split('.').pop() || 'pdf';
    const downloadFileName = fileName || `payment_proof.${fileExtension}`;
    link.download = downloadFileName;
    
    // Trigger download
    document.body.appendChild(link);
    link.click();
    
    // Cleanup
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
    
    toast.success("File downloaded successfully!");
  } catch (error) {
    console.error("Download error:", error);
    toast.error("Failed to download file. Please try again.");
  }
};

/**
 * Download multiple files as a zip
 * @param {Array} files - Array of file objects with filePath, fileName, documentId
 * @param {string} applicationId - The application ID
 * @param {string} zipFileName - The name for the zip file
 */
export const downloadMultipleFiles = async (files, applicationId, zipFileName = "documents") => {
  try {
    toast.info("Preparing files for download...");
    
    const downloadUrl = `${BASEURL}/api/studentApplication/download/${applicationId}/${files.map(f => f.documentId).join(',')}`;
    
    const response = await fetch(downloadUrl, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${zipFileName}.zip`;
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
    
    toast.success("Files downloaded successfully!");
  } catch (error) {
    console.error("Download error:", error);
    toast.error("Failed to download files. Please try again.");
  }
};

/**
 * Simple file download for direct URLs
 * @param {string} url - The file URL
 * @param {string} fileName - The file name
 */
export const downloadDirectFile = async (url, fileName) => {
  try {
    toast.info("Downloading file...");
    
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const blob = await response.blob();
    const downloadUrl = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = downloadUrl;
    link.download = fileName;
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(downloadUrl);
    
    toast.success("File downloaded successfully!");
  } catch (error) {
    console.error("Download error:", error);
    toast.error("Failed to download file. Please try again.");
  }
}; 