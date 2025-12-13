// En LoginPage.jsx - Esto es CAJA NEGRA
// Solo se ven INPUTS y OUTPUTS, no implementación

const LoginPage = ({ onLoginSuccess, onLoginError }) => {
    // Inputs del usuario (no sabemos cómo se procesan internamente)
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    
    const handleSubmit = (e) => {
        e.preventDefault();
        // Output: Se llama a onLoginSuccess/onLoginError
        // No vemos la lógica interna de autenticación
        loginUser(email, password)
            .then(onLoginSuccess)    // Output 1
            .catch(onLoginError);    // Output 2
    };
    
    return (
        <form onSubmit={handleSubmit}>
            <input 
                type="email" 
                value={email}        // Input visible
                onChange={(e) => setEmail(e.target.value)} // Event handler
            />
            <button type="submit">Login</button> // Acción de usuario
        </form>
    );
};