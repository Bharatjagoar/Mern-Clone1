/**
 * Mock email sender — the assignment explicitly allows mocking email
 * delivery. Logs the "send" instead of calling a real provider.
 */
async function sendTaskAssignmentEmail({ to, taskTitle, taskId, assignerName }) {
  console.log(
    `[email] To: ${to} | Subject: You've been assigned "${taskTitle}" | ` +
      `taskId=${taskId} assignedBy=${assignerName || 'unknown'}`
  );
  return { sent: true, to, taskId };
}

module.exports = { sendTaskAssignmentEmail };
