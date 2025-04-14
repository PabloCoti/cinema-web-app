export const validateEmail = (email) => {
    if (!email || !/\S+@\S+\.\S+/.test(email)) {
        return { isValid: false, message: "Por favor, ingresa un correo válido." };
    }

    return { isValid: true, message: "" };
};

export const validatePassword = (password) => {
    if (!password || password.length < 6) {
        return { isValid: false, message: "Tu contraseña tiene que ser al menos de 6 caractéres." };
    }

    return { isValid: true, message: "" };
};