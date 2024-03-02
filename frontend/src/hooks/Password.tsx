import { useState } from 'react';

const usePasswordVisibility = () => {
    const [passwordShown, setPasswordShown] = useState(false);

    const togglePasswordVisibility = () => {
        setPasswordShown(!passwordShown);
    };

    return {
        passwordShown,
        togglePasswordVisibility
    };
};

export default usePasswordVisibility;
