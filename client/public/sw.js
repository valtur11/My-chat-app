/**
 * Service Worker
 */

// urlB64ToUint8Array is a magic function that will encode the base64 public key
// to Array buffer which is needed by the subscription option

self.addEventListener('push', function(event) {
  const showLocalNotification = (title, message, swRegistration) => {
    const options = {
      body: `You got new message from ${message.senderEmail} with text ${message.text}`,
      icon: '/favicon.png',
      url: `http://localhost:3000/msg/${message.sender}`
      // here you can add more properties like icon, image, vibrate, url...
    };
    swRegistration.showNotification(title, options);
  };
  if (event.data) {
    console.log('Push event!! ', event.data);
    console.log(event.data);
    showLocalNotification('New message', JSON.parse(event.data.text()), self.registration);
  } else {
    console.log('Push event but no data');
  }
});
