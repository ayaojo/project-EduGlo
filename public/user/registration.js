function registerUser() {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    const user = {
        email: email,
        password: password
    };

    fetch('/user/register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(user)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Ошибка при регистрации');
        }
        return response.json();
    })
    .then(data => {
        const verificationLink = data.verificationLink;
        console.log('Пользователь зарегистрирован. Проверьте свою почту и следуйте инструкциям для подтверждения регистрации.');
        console.log('Ссылка для подтверждения:', verificationLink);
    })
    .catch(error => {
        console.error('Ошибка:', error.message);
    });
}
