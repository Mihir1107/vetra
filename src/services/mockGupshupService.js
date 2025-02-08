module.exports.sendWhatsAppMessage = async (destination, message) => {
  console.log(
    `📩 [MOCK] Sending WhatsApp message to ${destination}: "${message}"`
  );

  // Simulated delay to mimic real API response time
  await new Promise((resolve) => setTimeout(resolve, 1000));

  return {
    success: true,
    message: "Mock message sent successfully!",
    recipient: destination,
    text: message,
  };
};
