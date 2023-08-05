const pay_icon = document.querySelectorAll('.pay-by-qrcode');

const pay_win = document.getElementById('pay-win');
const closeButton = document.getElementById('close-btn');
const qrcode = document.querySelector('#pay-qrcode>img');

pay_icon.forEach(item => {
    item.addEventListener('click', () => {
        qrcode.attributes.src.value = '../img/'+item.attributes.id.value+'.jpg';
        pay_win.style.display = 'block';
    });
});

closeButton.addEventListener('click', () => {
    pay_win.style.display = 'none';
});