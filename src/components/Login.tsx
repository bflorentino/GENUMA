import React, { useState } from 'react';
import { Eye, EyeOff, Home, Lock, User, AlertCircle } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import Swal from 'sweetalert2';

interface LoginProps {
  onLoginSuccess?: () => void;
}

const Login: React.FC<LoginProps> = ({ onLoginSuccess }) => {
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    // Limpiar error cuando el usuario empiece a escribir
    if (error) setError('');
  };

  const handleDemoLogin = async (email: string) => {
    setLoading(true);
    setError('');

    try {
      const result = await login(email, 'demo-mode');
      
      Swal.fire({
        title: '¡Bienvenido!',
        text: `Acceso concedido como ${result.profile.rol} (Modo Demo)`,
        icon: 'success',
        timer: 2000,
        showConfirmButton: false
      });
      
      // Trigger redirect after successful login
      setTimeout(() => {
        onLoginSuccess?.();
      }, 2000);
    } catch (error: any) {
      setError(error.message || 'Error al iniciar sesión');
      
      Swal.fire({
        title: 'Error de acceso',
        text: error.message || 'Error en el modo demo',
        icon: 'error',
        confirmButtonColor: '#3b82f6'
      });
    }
    
    setLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const result = await login(formData.email, formData.password);
      
      Swal.fire({
        title: '¡Bienvenido!',
        text: `Acceso concedido como ${result.profile.rol}`,
        icon: 'success',
        timer: 2000,
        showConfirmButton: false
      });
      
      // Trigger redirect after successful login
      setTimeout(() => {
        onLoginSuccess?.();
      }, 2000);
    } catch (error: any) {
      setError(error.message || 'Error al iniciar sesión');
      
      Swal.fire({
        title: 'Error de acceso',
        text: error.message || 'Las credenciales ingresadas no son válidas',
        icon: 'error',
        confirmButtonColor: '#3b82f6'
      });
    }
    
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-blue-800 rounded-2xl flex items-center justify-center shadow-lg">
              <Home className="w-8 h-8 text-white" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            GEMUNA
          </h1>
          <p className="text-gray-600">
            Gestión de Museos Nacional
          </p>
        </div>

        {/* Login Form */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
          <div className="mb-6">
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">
              Iniciar Sesión
            </h2>
            <p className="text-gray-600">
              Accede a tu panel de administración
            </p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center space-x-3">
              <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Correo Electrónico
              </label>
              <div className="relative">
                <User className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                  placeholder="usuario@museo.gov.do"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Contraseña
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                  placeholder="Ingrese su contraseña"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 px-4 rounded-lg hover:from-blue-700 hover:to-blue-800 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Verificando...</span>
                </>
              ) : (
                <span>Iniciar Sesión</span>
              )}
            </button>
          </form>

          {/* Demo Credentials */}
          <div className="mt-8 p-4 bg-gray-50 rounded-lg">
            <h3 className="text-sm font-medium text-gray-900 mb-3">
              Credenciales de Acceso (Modo Demo):
            </h3>
            <div className="space-y-3">
              <div className="space-y-2 text-xs text-gray-600">
                <div className="flex justify-between">
                  <span className="font-medium">Administrador:</span>
                  <span>admin@museo.gov.do / password123</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Curador:</span>
                  <span>curador@museo.gov.do / password123</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Técnico:</span>
                  <span>tecnico@museo.gov.do / password123</span>
                </div>
              </div>
              <div className="pt-2 border-t border-gray-200">
                <p className="text-xs text-gray-500 mb-2">Acceso rápido (modo demo):</p>
                <div className="flex space-x-2">
                  <button
                    type="button"
                    onClick={() => handleDemoLogin('admin@museo.gov.do')}
                    className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs hover:bg-blue-200 transition-colors"
                  >
                    Admin
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDemoLogin('curador@museo.gov.do')}
                    className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs hover:bg-green-200 transition-colors"
                  >
                    Curador
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDemoLogin('tecnico@museo.gov.do')}
                    className="px-2 py-1 bg-orange-100 text-orange-700 rounded text-xs hover:bg-orange-200 transition-colors"
                  >
                    Técnico
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-8 text-sm text-gray-500">
          <p>© 2024 GEMUNA</p>
          <p>Gestión de Museos Nacional v1.0</p>
        </div>
      </div>
    </div>
  );
};

export default Login;