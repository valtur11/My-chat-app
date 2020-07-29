/**
 * Service Worker
 */

// urlB64ToUint8Array is a magic function that will encode the base64 public key
// to Array buffer which is needed by the subscription option

self.addEventListener('push', function(event) {
  const showLocalNotification = (title, body, swRegistration) => {
    const options = {
      body,
      // here you can add more properties like icon, image, vibrate, etc.
    };
    //swRegistration.showNotification(title, options);
    const promiseChain = self.registration.showNotification('Hey!');
    event.waitUntil(promiseChain);
  };
  if (event.data) {
    console.log('Push event!! ', event.data.text());
    showLocalNotification('Yolo', event.data.text(), self.registration);
  } else {
    console.log('Push event but no data');
  }
});
