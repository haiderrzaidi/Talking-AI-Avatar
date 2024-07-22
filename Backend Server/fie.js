export async function askAI(question) {
  // Make a request to the Flask server to get the chat response
  try {
      const url = `http://127.0.0.1:8080/get?question=${encodeURIComponent(question)}`;
      const response = await fetch(url);
  
      const data = await response.json();
      
      // Return the answer
      return data.response;
  } catch (error) {
      console.error('Error fetching AI response:', error);
      throw error; // Re-throw the error to let the caller handle it
  }
}