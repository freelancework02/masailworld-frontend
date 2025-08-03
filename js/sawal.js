document.addEventListener('DOMContentLoaded', () => {
  const form = document.querySelector('form.space-y-6');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Collect values from form fields
    const Name = document.getElementById('name').value.trim() || null; // optional field
    const Email = document.getElementById('email').value.trim();
    const Subject = document.getElementById('subject').value;
    const QuestionText = document.getElementById('question').value.trim();

    // Basic client-side validation
    if (!Email) {
      alert('براہ کرم اپنا ای میل درج کریں۔');
      return;
    }
    if (!Subject) {
      alert('براہ کرم موضوع منتخب کریں۔');
      return;
    }
    if (!QuestionText) {
      alert('براہ کرم سوال کی تفصیل درج کریں۔');
      return;
    }

    // Construct request payload
    const requestData = { Name, Email, Subject, QuestionText };

    try {
      // Replace below URL with your actual backend API endpoint that handles question insertion
      const response = await fetch('https://masailworld.onrender.com/api/questions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestData),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        alert('آپ کا سوال کامیابی کے ساتھ بھیج دیا گیا ہے۔ شکریہ!');
        form.reset();
      } else {
        alert('سوال بھیجنے میں مسئلہ: ' + (result.error || 'نامعلوم خرابی'));
      }
    } catch (error) {
      alert('سرور سے رابطہ کرنے میں مسئلہ پیش آیا: ' + error.message);
      console.error('Error submitting question:', error);
    }
  });
});
