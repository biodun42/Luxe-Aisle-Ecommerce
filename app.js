const hamMenu = document.querySelector('.hamburger-menu');
const offScreenMenu = document.querySelector('.off-screen-menu');
const container = document.querySelector('body')

hamMenu.addEventListener('click', () =>{
  hamMenu.classList.toggle('active')
  offScreenMenu.classList.toggle('active')
  container.classList.toggle('active')
});

const navs = document.querySelectorAll(".nav")
navs.forEach((nav)=>{
  nav.addEventListener('click', function(){
    hamMenu.classList.remove('active')
  offScreenMenu.classList.remove('active')
  })
})