export async function askAI(question) {
    // Define the question
    
    const questions = question;
  
    // Make a request to the Flask server to get the chat response
    const response = await fetch('http://127.0.0.1:8080/get', {  // Replace with your Flask server URL
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ question: questions })
    });

    
    // Parse the JSON response
    const data = await response.json();
    
    // Extract the answer from the response
    const answer = { Answer: data };
    console.log(answer);
    // Log the question and the answer
    return Response.json(answer);
  }
  
  