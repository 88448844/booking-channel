(function(){
  // Initialize EmailJS with Public Key
  emailjs.init("J_ikPmiU3oHvdGdNa");
})();

// --- EmailJS Configuration ---
const EMAILJS_SERVICE_ID = "service_ap4z6sk";
const EMAILJS_TEMPLATE_ID = "template_gqmsnrg";

// --- DOM Element References ---
const roomTypeSelect = document.getElementById('roomType');
const breakfastCountSelect = document.getElementById('breakfastCount');
const datePickerInput = document.getElementById('datePicker');
const roomRateSpan = document.getElementById('roomRate');
const nightsSpan = document.getElementById('nights');
const totalBreakfastCostSpan = document.getElementById('totalBreakfastCost');
const totalPriceSpan = document.getElementById('totalPrice');
const bookingForm = document.getElementById('bookingForm');
const confirmButton = document.getElementById('confirmButton');
const confirmationDiv = document.getElementById('confirmation');
const guestNameInput = document.getElementById('guestName');
const guestEmailInput = document.getElementById('guestEmail');

// --- Flatpickr Initialization ---
const datePicker = flatpickr(datePickerInput, {
  mode: "range",
  minDate: "today",
  dateFormat: "Y-m-d",
  altInput: true,
  altFormat: "F j, Y",
  showMonths: window.innerWidth > 768 ? 2 : 1,
  onChange: updateCalculation
});

// --- Event Listeners ---
roomTypeSelect.addEventListener('change', updateCalculation);
breakfastCountSelect.addEventListener('change', updateCalculation);
bookingForm.addEventListener('submit', handleFormSubmit);

// --- Functions ---
function calculateNights(startDate, endDate) {
  if (!startDate || !endDate) return 0;
  const diffTime = Math.abs(endDate - startDate);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return (endDate > startDate) ? diffDays : 0;
}

function updateCalculation() {
  const roomRate = parseInt(roomTypeSelect.value, 10) || 0;
  const breakfastCostPerPerson = 4;
  const breakfastScore = parseInt(breakfastCountSelect.value, 10) || 0;
  const selectedDates = datePicker.selectedDates;
  const nights = calculateNights(selectedDates[0], selectedDates[1]);
  const dailyBreakfastCost = breakfastScore * breakfastCostPerPerson;
  const totalBreakfastCost = dailyBreakfastCost * nights;
  const roomTotalCost = roomRate * nights;
  const totalPrice = roomTotalCost + totalBreakfastCost;

  roomRateSpan.textContent = roomRate;
  nightsSpan.textContent = nights;
  totalBreakfastCostSpan.textContent = totalBreakfastCost;
  totalPriceSpan.textContent = totalPrice;
}

function handleFormSubmit(event) {
  event.preventDefault();

  const selectedDates = datePicker.selectedDates;
  if (selectedDates.length < 2) {
    showFeedback("Please select both a check-in and check-out date.", "error");
    datePickerInput.focus();
    return;
  }
  const nights = calculateNights(selectedDates[0], selectedDates[1]);
  if (nights <= 0) {
    showFeedback("Check-out date must be after check-in date.", "error");
    datePickerInput.focus();
    return;
  }
  if (!guestNameInput.value.trim()) {
    showFeedback("Please enter your full name.", "error");
    guestNameInput.focus();
    return;
  }
  const emailValue = guestEmailInput.value.trim();
  if (!emailValue || !/\S+@\S+\.\S+/.test(emailValue)) {
    showFeedback("Please enter a valid email address.", "error");
    guestEmailInput.focus();
    return;
  }

  confirmButton.disabled = true;
  confirmButton.textContent = 'Sending Booking...';
  showFeedback("Processing your booking request...", "processing");

  // Map the parameters to match your EmailJS template variables
  const templateParams = {
    roomType: roomTypeSelect.selectedOptions[0].text,
    dates: datePickerInput.value,
    breakfastCost: totalBreakfastCostSpan.textContent,
    totalPrice: totalPriceSpan.textContent,
    name: guestNameInput.value.trim(),
    guestemail: emailValue
  };

  console.log("Sending email with parameters:", templateParams);

  emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, templateParams)
    .then(function(response) {
      console.log('EmailJS SUCCESS!', response.status, response.text);
      showFeedback("Booking request sent successfully! We will contact you shortly to confirm.", "success");
      bookingForm.reset();
      datePicker.clear();
      updateCalculation();
      confirmButton.disabled = false;
      confirmButton.textContent = 'Confirm Booking';
    }, function(error) {
      console.error('EmailJS FAILED...', error);
      let errorMessage = "An error occurred while sending your booking. Please try again.";
      if (error.status === 400) {
        errorMessage = `Configuration error sending email (Code: ${error.status}). Please contact support.`;
      } else if (error.status === 404) {
        errorMessage = `EmailJS Service or Template not found (Code: ${error.status}). Please check configuration or contact support.`;
      } else if (error.text) {
        errorMessage = `An error occurred: ${error.text}. Please try again or contact support.`;
      } else {
        errorMessage = `An unknown error occurred (Status: ${error.status || 'N/A'}). Please check the browser console and contact support.`;
      }
      showFeedback(errorMessage, "error");
      confirmButton.disabled = false;
      confirmButton.textContent = 'Confirm Booking';
    });
}

function showFeedback(message, type = "info") {
  confirmationDiv.textContent = message;
  confirmationDiv.className = '';
  confirmationDiv.classList.add(type);
  confirmationDiv.style.display = 'block';
}

updateCalculation();
