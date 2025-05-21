let currentStep = 0;
const steps = document.querySelectorAll('.question-step');
const nextBtn = document.getElementById('next-btn');
const submitBtn = document.getElementById('submit-btn');
const form = document.getElementById('quiz-form');
const result = document.getElementById('result');
const loading = document.getElementById('loading');
const progress = document.querySelector('#progress-bar span');

function showStep(index) {
  steps.forEach((step, i) => {
    step.classList.toggle('active', i === index);
  });

  // Reset buttons
  nextBtn.style.display = index < steps.length - 1 ? 'inline-block' : 'none';
  submitBtn.style.display = index === steps.length - 1 ? 'inline-block' : 'none';
  nextBtn.disabled = true;
  submitBtn.disabled = true;

  updateProgressBar();
  setupValidation();
}

function updateProgressBar() {
  const percent = ((currentStep + 1) / steps.length) * 100;
  progress.style.width = percent + '%';
}

function setupValidation() {
  const currentInputs = steps[currentStep].querySelectorAll('input[type="radio"]');
  const textInput = steps[currentStep].querySelector('input[type="text"]');

  if (currentInputs.length > 0) {
    currentInputs.forEach(input => {
      input.addEventListener('change', () => {
        nextBtn.disabled = false;
        submitBtn.disabled = false;
      });
    });
  } else if (textInput) {
    textInput.addEventListener('input', () => {
      nextBtn.disabled = textInput.value.trim() === '';
    });
  } else {
    nextBtn.disabled = false;
  }
}

nextBtn.addEventListener('click', () => {
  if (currentStep < steps.length - 1) {
    currentStep++;
    showStep(currentStep);
  }
});

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  result.innerHTML = "";
  loading.style.display = 'block';

  const formData = new FormData(form);
  const answers = Object.fromEntries(formData.entries());

  try {
    const response = await fetch('/api/match', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(answers)
    });

    const data = await response.json();
    loading.style.display = 'none';
    result.innerHTML = `<div class="result-card"><strong>Your job match is:</strong> ${data.role} 💼<br><br><strong>Why? </strong> ${data.why}</div>`;
  } catch (err) {
    loading.style.display = 'none';
    result.innerHTML = `Something went wrong 😢`;
  }
});

// Инициализация
showStep(currentStep);
