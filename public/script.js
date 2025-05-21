let currentStep = 0;
const steps = document.querySelectorAll('.step');
const nextBtn = document.getElementById('next-btn');
const submitBtn = document.getElementById('submit-btn');
const form = document.getElementById('quiz-form');
const result = document.getElementById('result');
const loading = document.getElementById('loading');

function showStep(index) {
  steps.forEach((step, i) => {
    step.classList.toggle('active', i === index);
  });

  nextBtn.style.display = index < steps.length - 1 ? 'inline-block' : 'none';
  submitBtn.style.display = index === steps.length - 1 ? 'inline-block' : 'none';

  nextBtn.disabled = true;
  submitBtn.disabled = true;
  setupOptionListeners();
}

function setupOptionListeners() {
  const options = steps[currentStep].querySelectorAll('.option');
  options.forEach(option => {
    option.classList.remove('selected');
    option.addEventListener('click', () => {
      options.forEach(o => o.classList.remove('selected'));
      option.classList.add('selected');
      nextBtn.disabled = false;
      submitBtn.disabled = false;
    });
  });
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

  // Сбор ответов
  const answers = {};
  steps.forEach((step, index) => {
    const selected = step.querySelector('.option.selected');
    if (selected) {
      answers[`question_${index + 1}`] = selected.textContent;
    }
  });

  try {
    const response = await fetch('/api/match', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(answers)
    });

    const data = await response.json();
    loading.style.display = 'none';
    result.innerHTML = `<div class="result-card"><strong>Your job match is:</strong> ${data.role} 💼<br><br><strong>Why?</strong> ${data.why}</div>`;
  } catch (err) {
    loading.style.display = 'none';
    result.innerHTML = `Something went wrong 😢`;
  }
});

// Запуск
showStep(currentStep);