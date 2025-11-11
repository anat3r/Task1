const subscribeButton = document.getElementById('subscribe-button');
const sidebarButton = document.getElementById('sidebar-open')

const clientsItems = document.getElementById('clients-items');
const headerNav = document.getElementById('header-nav');


function showAlert(message) {
  //Check for empty allert
  if (document.querySelector('.alert.hidden[data-message=""]')) {
    //If empty allert exists, do not create another one
    const existingAlert = document.querySelector('.alert.hidden[data-message=""]');
    existingAlert.classList.remove('hidden');
    existingAlert.setAttribute('data-message', message);
    const maxZIndex = getMaxZIndex();
    existingAlert.setAttribute('current-z', maxZIndex + 1);
    existingAlert.style.zIndex = existingAlert.getAttribute('current-z');
    try {
      existingAlert.querySelector('.alert-message').textContent = message;
    } catch (error) {
      console.error('Error updating alert message:', error);
    }
    return;
  }
  //If no empty alert exists, create a new one
  const alertDiv = document.createElement('div');
  alertDiv.classList.add('alert');
  alertDiv.classList.add('hidden');
  alertDiv.setAttribute('data-message', message);
  const maxZIndex = getMaxZIndex();
  alertDiv.setAttribute('current-z', maxZIndex + 1);
  alertDiv.style.zIndex = alertDiv.getAttribute('current-z');
  alertDiv.innerHTML = `
    <div class="alert-box">
      <button class="alert-close" aria-label="Close alert">&times;</button>
      <pre class="alert-message">${message}</pre>  
    </div>
  `;
  console.log('Created new alert with message:', message);
  document.body.prepend(alertDiv);
  // Show the alert
  setTimeout(() => {
    alertDiv.classList.remove('hidden');
  });
  // Add event listener to close button
  alertDiv.querySelector('.alert-close').addEventListener('click', () => {
    alertDiv.classList.add('hidden');
  });
  //Hide alert after 10 seconds
  setTimeout(() => {
    alertDiv.classList.add('hidden');
    alertDiv.setAttribute('data-message', '');
  }, 10000);
}

function getMaxZIndex() {
  if (document.querySelectorAll('.alert').length > 1) {
    const maxZIndex = Array(...document.querySelectorAll('.alert')).reduce((max, alert) => {
      if (alert?.classList?.contains('hidden')) return max;
      const z = parseInt(alert.getAttribute('current-z')) || 0;
      return z > max ? z : max;
    }, 0);
    return maxZIndex;
  }
  return 1;
}


function validateEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(String(email).toLowerCase());
}


subscribeButton.addEventListener('click', function handleSubcribe(event) {
  event.preventDefault();
  try{
    const name = document.getElementById('subscribe-name');
    const email = document.getElementById('subscribe-email');
    const terms = document.getElementById('terms');

    if (!name.value.trim()) {
      console.log('name error')
      name.parentNode.querySelector('.error').classList.remove('hidden');
      return;
    }
    if (validateEmail(email.value.toLowerCase()) ===false){
      console.log('e-mail error')
      email.parentNode.querySelector('.error').classList.remove('hidden');
      return;
    }
    if (!terms.checked) {
      console.log('terms error')
      terms.parentNode.querySelector('.error').classList.remove('hidden');
      return;
    }
    showAlert(`Form submitted successfully!\nName: ${name.value}\nEmail: ${email.value}`);
    email.value = '';
    name.value = '';
    terms.checked = false;
    email.parentNode.querySelector('.error').classList.add('hidden');
    name.parentNode.querySelector('.error').classList.add('hidden');
    terms.parentNode.querySelector('.error').classList.add('hidden');
  }
  catch (error) {
    console.error('An error occurred during subscription:', error);
    alert('An unexpected error occurred. Please try again later.');
  }
});

sidebarButton.addEventListener('click', function handleSidebarOpen(event){
  const burger = `<svg viewBox="0 0 488 488" id="burger-menu">
      <path fill="currentColor" d="M64.192,108.444h359.617c29.943,0,54.223-24.278,54.223-54.222C478.031,24.278,453.754,0,423.809,0H64.192
                C34.248,0,9.969,24.278,9.969,54.222C9.969,84.166,34.248,108.444,64.192,108.444z" />
      <path fill="currentColor" d="M423.809,189.778H64.192c-29.944,0-54.223,24.278-54.223,54.222c0,29.943,24.278,54.223,54.223,54.223h359.617
                c29.945,0,54.223-24.279,54.223-54.223C478.031,214.056,453.754,189.778,423.809,189.778z" />
      <path fill="currentColor" d="M423.809,379.557H64.192c-29.944,0-54.223,24.277-54.223,54.222C9.969,463.722,34.248,488,64.192,488h359.617
                c29.945,0,54.223-24.278,54.223-54.222C478.031,403.834,453.754,379.557,423.809,379.557z" />
    </svg>`
  const close = `✖` 
  try{
    const sidebar = document.getElementById('sidebar');
    if (sidebarButton.getAttribute('active') == 'false'){
      sidebar.classList.remove('hidden');
      sidebarButton.setAttribute('active', 'true')
      sidebarButton.innerHTML = close;
    }
    else{
      sidebar.classList.add('hidden');
      sidebarButton.setAttribute('active', 'false')
      sidebarButton.innerHTML = burger;
    }
  }
  catch(e){
    console.error('An error while opening sidebar', error);
    alert('An unexpected error occurred. Please try again later.');
  }
}); 




(async function addClients() {
  const response = await fetch('https://rickandmortyapi.com/api/character');
  const usersData = await response.json();
  const usersArr = usersData.results
  const pageUsersArr = usersArr.slice(0, 6).map(el => [el.name, el.image])
  console.log(pageUsersArr);
  try{
    const clientsDiv = document.getElementById('clients-items')
    clientsDiv.innerHTML=''
    pageUsersArr.forEach((el) => {
      const clientEl = document.createElement('div');
      clientEl.classList.add('main-card','flex','flex-column','space-between')
      clientEl.innerHTML = `
        <img class="main-card-image" src="${el[1]}" width="200" height="200" alt="User icon" />
        <span class="main-card-text f-text">${el[0]}</span>
      `
      clientsDiv.append(clientEl)
    })
  }
  catch(e){
    console.log(e)
  }
}())

const observer = new IntersectionObserver(
  (entries) => {
  const entry = entries[0];
    // Когда верхняя часть nav выходит из viewport
      if (!entry.isIntersecting && entry.boundingClientRect.top < 0) {
        console.log(entry.target)
        if(entry.target == headerNav){
          document.getElementById('center-container').prepend(headerNav);
          document.getElementById('center-container').prepend(document.getElementById('main-header'));
        }
      }
  },
  {
      root: null,
        threshold: 0,
          rootMargin: '0px'
  }
);

observer.observe(headerNav);