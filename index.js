function increment() {
    let a = 0;
    function add (){
        a++
        return a
    }

    return add
}

document.getElementById('contactForm').addEventListener('submit', async function(e) {
  e.preventDefault();

  const feedback = document.getElementById('contactFeedback');
  
  const formData = new FormData();
  formData.append('Name', document.getElementById('nameInput').value);
  formData.append('Email', document.getElementById('emailInput').value);
  formData.append('Message', document.getElementById('messageInput').value);

  try {
    await fetch('YOUR_ZOHO_WEBHOOK_URL_HERE', {
      method: 'POST',
      body: formData
    });
    feedback.textContent = 'Message sent successfully!';
    this.reset();
  } catch (err) {
    feedback.textContent = 'Something went wrong. Please try again.';
  }
});

const add = increment()

console.log(add())
console.log(add())
console.log(add())