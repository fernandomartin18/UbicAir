import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/Profile.css';
import { API_ENDPOINTS } from '../config/api';

function Profile() {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [userData, setUserData] = useState({
    nombre: '',
    email: '',
    foto: null
  });
  const [editData, setEditData] = useState({
    nombre: '',
    email: ''
  });
  const [passwordData, setPasswordData] = useState({
    newPassword: '',
    confirmPassword: ''
  });
  const [showPasswordChange, setShowPasswordChange] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    // Cargar datos del usuario desde localStorage o API
    const loadUserData = async () => {
      try {
        const token = localStorage.getItem('token');
        const userId = localStorage.getItem('userId');
        
        if (!token || !userId) {
          console.error('No hay sesión activa');
          return;
        }

        const response = await fetch(`${API_ENDPOINTS.USERS}/${userId}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (response.ok) {
          const responseData = await response.json();
          const data = responseData.data || responseData;
          
          setUserData({
            nombre: data.nombre || '',
            email: data.email || '',
            foto: data.fotoPerfil || null
          });
          setEditData({
            nombre: data.nombre || '',
            email: data.email || ''
          });
        }
      } catch (error) {
        console.error('Error al cargar datos del usuario:', error);
      }
    };

    loadUserData();
  }, []);

  const getInitials = () => {
    if (userData.nombre) {
      return userData.nombre.charAt(0).toUpperCase();
    }
    return '?';
  };

  const handleModalOpen = () => {
    setIsModalOpen(true);
    setErrors({});
    setSuccessMessage('');
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setShowPasswordChange(false);
    setPasswordData({ newPassword: '', confirmPassword: '' });
    setSelectedFile(null);
    setPreviewImage(null);
    setErrors({});
    setSuccessMessage('');
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validar tamaño del archivo (máx 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setErrors({ foto: 'La imagen no puede superar los 5MB' });
        return;
      }

      // Validar tipo de archivo
      if (!file.type.startsWith('image/')) {
        setErrors({ foto: 'El archivo debe ser una imagen' });
        return;
      }

      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!editData.nombre.trim()) {
      newErrors.nombre = 'El nombre es obligatorio';
    }

    if (!editData.email.trim()) {
      newErrors.email = 'El email es obligatorio';
    } else if (!/\S+@\S+\.\S+/.test(editData.email)) {
      newErrors.email = 'Email no válido';
    }

    if (showPasswordChange) {
      if (!passwordData.newPassword) {
        newErrors.newPassword = 'La contraseña es obligatoria';
      } else if (passwordData.newPassword.length < 6) {
        newErrors.newPassword = 'La contraseña debe tener al menos 6 caracteres';
      }

      if (passwordData.newPassword !== passwordData.confirmPassword) {
        newErrors.confirmPassword = 'Las contraseñas no coinciden';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSaveChanges = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const userId = localStorage.getItem('userId');

      // Preparar los datos a enviar - solo los campos que cambiaron
      const datosActualizar = {};
      
      // Solo enviar nombre si cambió
      if (editData.nombre !== userData.nombre) {
        datosActualizar.nombre = editData.nombre;
      }
      
      // Solo enviar email si cambió
      if (editData.email !== userData.email) {
        datosActualizar.email = editData.email;
      }

      // Si hay una nueva foto seleccionada, enviarla
      if (selectedFile) {
        datosActualizar.foto = previewImage;
      }

      // Si se está cambiando la contraseña
      if (showPasswordChange && passwordData.newPassword) {
        datosActualizar.password = passwordData.newPassword;
      }

      const response = await fetch(`${API_ENDPOINTS.USERS}/${userId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(datosActualizar)
      });

      if (response.ok) {
        const responseData = await response.json();
        const updatedData = responseData.data || responseData;
        
        setUserData({
          nombre: updatedData.nombre || editData.nombre,
          email: updatedData.email || editData.email,
          foto: updatedData.fotoPerfil || datosActualizar.foto || null
        });
        
        // Cerrar el modal automáticamente
        handleModalClose();
      } else {
        const errorData = await response.json();
        setErrors({ general: errorData.error || errorData.message || 'Error al guardar los cambios' });
      }
    } catch (error) {
      console.error('Error al guardar cambios:', error);
      setErrors({ general: 'Error de conexión con el servidor' });
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <>
      {/* Círculo de perfil */}
      <div className="profile-circle" onClick={handleModalOpen}>
        {userData.foto || previewImage ? (
          <img src={previewImage || userData.foto} alt="Profile" />
        ) : (
          <span className="profile-initials">{getInitials()}</span>
        )}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="profile-modal-overlay" onClick={handleModalClose}>
          <div className="profile-modal" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close-btn" onClick={handleModalClose}>×</button>
            
            <div className="modal-content">
              {/* Foto de perfil editable */}
              <div className="profile-photo-section">
                <div className="profile-photo-container">
                  {previewImage || userData.foto ? (
                    <img src={previewImage || userData.foto} alt="Profile" />
                  ) : (
                    <span className="profile-initials-large">{getInitials()}</span>
                  )}
                </div>
                <div className="photo-actions">
                  <label htmlFor="photo-upload" className="edit-photo-btn" title="Editar foto">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                    </svg>
                  </label>
                  <input
                    type="file"
                    id="photo-upload"
                    accept="image/*"
                    onChange={handleImageChange}
                    style={{ display: 'none' }}
                  />
                  <button 
                    className="delete-photo-btn"
                    onClick={() => {
                      setPreviewImage(null);
                      setSelectedFile(null);
                    }}
                    disabled={!previewImage && !userData.foto}
                    title="Eliminar foto"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="3 6 5 6 21 6"></polyline>
                      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                      <line x1="10" y1="11" x2="10" y2="17"></line>
                      <line x1="14" y1="11" x2="14" y2="17"></line>
                    </svg>
                  </button>
                </div>
              </div>

              {/* Mensajes */}
              {successMessage && (
                <div className="success-message">{successMessage}</div>
              )}
              {errors.general && (
                <div className="error-message">{errors.general}</div>
              )}

              {/* Formulario de datos */}
              <div className="profile-form">
                <div className="form-group">
                  <label htmlFor="nombre">Nombre</label>
                  <input
                    type="text"
                    id="nombre"
                    name="nombre"
                    value={editData.nombre}
                    onChange={handleInputChange}
                    className={errors.nombre ? 'error' : ''}
                  />
                  {errors.nombre && <span className="error-text">{errors.nombre}</span>}
                </div>

                <div className="form-group">
                  <label htmlFor="email">Email</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={editData.email}
                    onChange={handleInputChange}
                    className={errors.email ? 'error' : ''}
                  />
                  {errors.email && <span className="error-text">{errors.email}</span>}
                </div>

                {/* Cambiar contraseña */}
                <div className="password-change-section">
                  {!showPasswordChange ? (
                    <button
                      className="change-password-toggle-btn"
                      onClick={() => setShowPasswordChange(true)}
                    >
                      Cambiar contraseña
                    </button>
                  ) : (
                    <>
                      <div className="form-group">
                        <label htmlFor="newPassword">Nueva contraseña</label>
                        <input
                          type="password"
                          id="newPassword"
                          name="newPassword"
                          value={passwordData.newPassword}
                          onChange={handlePasswordChange}
                          className={errors.newPassword ? 'error' : ''}
                        />
                        {errors.newPassword && <span className="error-text">{errors.newPassword}</span>}
                      </div>

                      <div className="form-group">
                        <label htmlFor="confirmPassword">Confirmar contraseña</label>
                        <input
                          type="password"
                          id="confirmPassword"
                          name="confirmPassword"
                          value={passwordData.confirmPassword}
                          onChange={handlePasswordChange}
                          className={errors.confirmPassword ? 'error' : ''}
                        />
                        {errors.confirmPassword && <span className="error-text">{errors.confirmPassword}</span>}
                      </div>

                      <button
                        className="cancel-password-btn"
                        onClick={() => {
                          setShowPasswordChange(false);
                          setPasswordData({ newPassword: '', confirmPassword: '' });
                        }}
                      >
                        Cancelar cambio de contraseña
                      </button>
                    </>
                  )}
                </div>

                {/* Botón guardar cambios */}
                <button className="save-changes-btn" onClick={handleSaveChanges}>
                  Guardar cambios
                </button>
              </div>

              {/* Botón cerrar sesión */}
              <button className="logout-btn" onClick={handleLogout}>
                Cerrar sesión
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Profile;