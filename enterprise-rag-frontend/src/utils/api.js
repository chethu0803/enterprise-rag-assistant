export const sendMessage = async (message) => {
  try {
    const response = await fetch('http://localhost:8000/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(message),
    });

    if (!response.ok) {
      throw new Error('Server is not responding or returned an error');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    throw error;
  }
}