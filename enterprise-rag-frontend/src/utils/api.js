export const sendMessage = async (message, onChunk) => {
  try {
    const response = await fetch('http://localhost:8000/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify(message),
    });

    if (!response.ok || !response.body) {
      throw new Error('Server is not responding or returned an error');
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder("utf-8");

    let fullMessage = "";

    while (true) {
      const { value, done } = await reader.read();
      if (done) break;

      const chunk = decoder.decode(value, { stream: true });
      fullMessage += chunk;

      // Call the callback to update UI as chunks arrive
      onChunk(chunk);
    }

    return fullMessage;
  } catch (error) {
    console.error("Streaming error:", error);
    throw error;
  }
};
