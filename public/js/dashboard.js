// ==========================================
// UTILITY FUNCTIONS
// ==========================================

// Función para formatear el tamaño del archivo
function formatFileSize(bytes) {
    if (!bytes) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
}

// ==========================================
// MAIN INITIALIZATION
// ==========================================

document.addEventListener('DOMContentLoaded', function () {
    // ==========================================
    // DOM ELEMENTS
    // ==========================================
    
    // Variables para los elementos del DOM
    const sidebar = document.getElementById('sidebar');
    const menuToggle = document.getElementById('menu-toggle');
    const dropArea = document.getElementById('drop-area');
    const fileUpload = document.getElementById('file-upload');
    const filesGrid = document.getElementById('files-grid');
    const fileModal = document.getElementById('file-modal');
    const closeModal = document.getElementById('close-modal');
    const cancelButton = document.getElementById('cancel-button');
    const saveButton = document.getElementById('save-button');
    const previewModal = document.getElementById('preview-modal');
    const closePreview = document.getElementById('close-preview');
    const closePreviewButton = document.getElementById('close-preview-button');
    const searchBox = document.getElementById('search-box');
    const logoutButton = document.getElementById('logout-button');
    const filterButton = document.querySelector('.filter-button');
    const filterModal = document.getElementById('filter-modal');
    const closeFilterModal = document.getElementById('close-filter-modal');
    const resetFiltersButton = document.getElementById('reset-filters-button');
    const applyFiltersButton = document.getElementById('apply-filters-button');
    const savePreviewButton = document.getElementById('save-preview-button');
    const themeToggle = document.getElementById('theme-toggle');
    const profileModal = document.getElementById('profile-modal');
    const closeProfileModal = document.getElementById('close-profile-modal');
    const profileTabs = document.querySelectorAll('.profile-tab');
    const profileTabContents = document.querySelectorAll('.profile-tab-content');
    const profileButton = document.querySelector('.profile-button');
    
    // Botones para guardar cambios
    const saveUsernameButton = document.getElementById('save-username-button');
    const saveEmailButton = document.getElementById('save-email-button');
    const savePasswordButton = document.getElementById('save-password-button');
    
    // Botones para cancelar cambios
    const cancelUsernameButton = document.getElementById('cancel-username-button');
    const cancelEmailButton = document.getElementById('cancel-email-button');
    const cancelPasswordButton = document.getElementById('cancel-password-button');
    
    // ==========================================
    // STATE VARIABLES
    // ==========================================
    
    // Estado de la aplicación
    let currentDocumentId = null;
    let currentFile = null;
    
    // ==========================================
    // INITIALIZATION
    // ==========================================
    
    // Inicializar sidebar state
    const savedSidebarState = localStorage.getItem('sidebarState');
    if (savedSidebarState === 'true') {
        sidebar.classList.add('open');
    } else if (savedSidebarState === 'false') {
        sidebar.classList.remove('open');
    } else {
        // Default behavior - initialize with the sidebar open
        sidebar.classList.add('open');
    }
    
    // Prevenir autofill en el campo de búsqueda
    if (searchBox) {
        searchBox.setAttribute('autocomplete', 'off');
        searchBox.setAttribute('name', 'search-docs'); // Nombre específico para evitar confusión con campos de login
    }
    
    // Check for saved theme preference
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        document.body.classList.add('dark-theme');
        themeToggle.checked = true;
    }
    
    // ==========================================
    // SECTION NAVIGATION
    // ==========================================
    
    const sectionLinks = document.querySelectorAll('.section-item a');
    
    sectionLinks.forEach(link => {
        link.addEventListener('click', function (e) {
            e.preventDefault();

            // Remove active class from all section items
            document.querySelectorAll('.section-item').forEach(item => {
                item.classList.remove('active');
            });

            // Add active class to clicked section
            this.parentElement.classList.add('active');

            // Get the section URL
            const sectionUrl = this.getAttribute('href');

            // Show loading state
            filesGrid.innerHTML = `
                <div class="loading-state">
                    <div class="spinner"></div>
                    <p>Cargando...</p>
                </div>
            `;

            // Fetch the section content
            fetch(sectionUrl, {
                headers: {
                    'X-Requested-With': 'XMLHttpRequest'
                }
            })
                .then(response => response.text())
                .then(html => {
                    // Create a temporary element to parse the HTML
                    const tempDiv = document.createElement('div');
                    tempDiv.innerHTML = html;

                    // Extract the files grid content
                    const newFilesGrid = tempDiv.querySelector('#files-grid');

                    if (newFilesGrid) {
                        // Replace the current files grid with the new one
                        filesGrid.innerHTML = newFilesGrid.innerHTML;

                        // Update page title if needed
                        const newTitle = tempDiv.querySelector('title');
                        if (newTitle) {
                            document.title = newTitle.textContent;
                        }

                        // Update section title based on the clicked link
                        const sectionTitle = document.querySelector('.files-header');
                        if (sectionTitle) {
                            // Get the text content of the clicked link
                            const linkText = this.textContent.trim();
                            sectionTitle.textContent = linkText;

                            // Check if we're in the trash section and update the empty trash button
                            const filesHeaderContainer = document.querySelector('.files-header-container');
                            const emptyTrashButton = document.getElementById('empty-trash-button');

                            if (sectionUrl === '/trash') {
                                // We're in trash section - show empty trash button if there are documents
                                if (newFilesGrid.querySelectorAll('.file-card').length > 0) {
                                    // If button doesn't exist, create it
                                    if (!emptyTrashButton) {
                                        const newButton = document.createElement('button');
                                        newButton.id = 'empty-trash-button';
                                        newButton.className = 'empty-trash-button';
                                        newButton.innerHTML = '<i class="fas fa-trash-alt"></i> Vaciar papelera';

                                        // Add event listener to the new button
                                        newButton.addEventListener('click', function () {
                                            if (confirm('¿Estás seguro de que deseas vaciar la papelera? Esta acción eliminará permanentemente todos los documentos en la papelera.')) {
                                                emptyTrash();
                                            }
                                        });

                                        filesHeaderContainer.appendChild(newButton);
                                    }
                                } else if (emptyTrashButton) {
                                    // No documents in trash, remove button if it exists
                                    emptyTrashButton.remove();
                                }
                            } else {
                                // Not in trash section, remove button if it exists
                                if (emptyTrashButton) {
                                    emptyTrashButton.remove();
                                }
                            }
                        }

                        // Update browser URL without reloading
                        window.history.pushState({}, '', sectionUrl);

                        // Re-initialize any event listeners for the new content
                        initializeFileCardEvents();
                    } else {
                        filesGrid.innerHTML = `
                        <div class="empty-state">
                            <i class="fas fa-exclamation-circle"></i>
                            <h3>Error al cargar contenido</h3>
                            <p>No se pudo cargar el contenido de esta sección</p>
                        </div>
                    `;
                    }
                })
                .catch(error => {
                    console.error('Error loading section:', error);
                    filesGrid.innerHTML = `
                    <div class="empty-state">
                        <i class="fas fa-exclamation-circle"></i>
                        <h3>Error al cargar contenido</h3>
                        <p>Ocurrió un error al cargar esta sección</p>
                    </div>
                `;
                });
        });
    });
    
    // Function to initialize event listeners for file cards
    function initializeFileCardEvents() {
        // Re-attach event listeners to new file cards if needed
        document.querySelectorAll('.file-card .star-button').forEach(button => {
            button.addEventListener('click', function (e) {
                e.stopPropagation();
                const fileCard = this.closest('.file-card');
                const documentId = fileCard.dataset.id;
                toggleStarred(documentId, this);
            });
        });

        // Add other event listeners as needed
    }
    
    // ==========================================
    // PROFILE MANAGEMENT
    // ==========================================
    
    // Abrir modal de perfil
    if (profileButton) {
        profileButton.addEventListener('click', function () {
            // Cargar información del perfil
            loadProfileInfo();
            profileModal.style.display = 'block';
        });
    }
    
    // Cerrar modal de perfil
    closeProfileModal.addEventListener('click', function () {
        profileModal.style.display = 'none';
    });
    
    // Cambiar entre pestañas
    profileTabs.forEach(tab => {
        tab.addEventListener('click', function () {
            // Remover clase active de todas las pestañas
            profileTabs.forEach(t => t.classList.remove('active'));
            profileTabContents.forEach(c => c.classList.remove('active'));

            // Activar pestaña seleccionada
            this.classList.add('active');
            document.getElementById(`${this.dataset.tab}-tab`).classList.add('active');
        });
    });
    
    // Cargar información del perfil
    function loadProfileInfo() {
        fetch('/api/profile')
            .then(response => response.json())
            .then(data => {
                // Actualizar nombre de usuario
                document.getElementById('current-username').textContent = data.username;
                document.getElementById('new-username').value = '';

                // Actualizar correo electrónico
                document.getElementById('current-email').textContent = data.maskedEmail;
                document.getElementById('current-email-input').value = '';
                document.getElementById('new-email').value = '';
                document.getElementById('confirm-email').value = '';

                // Limpiar campos de contraseña
                document.getElementById('current-password').value = '';
                document.getElementById('new-password').value = '';
                document.getElementById('confirm-password').value = '';
            })
            .catch(error => {
                console.error('Error al cargar información del perfil:', error);
            });
    }
    
    // Función para mostrar mensajes de error o éxito
    function showProfileMessage(tabId, message, type) {
        // Eliminar mensajes anteriores
        const oldMessages = document.querySelectorAll('.profile-message');
        oldMessages.forEach(msg => msg.remove());

        // Crear nuevo mensaje
        const messageElement = document.createElement('div');
        messageElement.className = `profile-message profile-${type}`;
        messageElement.textContent = message;

        // Insertar mensaje al inicio del contenido de la pestaña
        const tabContent = document.getElementById(`${tabId}-tab`);
        tabContent.insertBefore(messageElement, tabContent.firstChild);

        // Mostrar mensaje
        messageElement.style.display = 'block';

        // Ocultar mensaje después de 5 segundos
        setTimeout(() => {
            messageElement.style.display = 'none';
            setTimeout(() => messageElement.remove(), 300);
        }, 5000);
    }
    
    // Validación de correo electrónico
    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
    
    // Validación de contraseña (mínimo 6 caracteres)
    function isValidPassword(password) {
        return password.length >= 6;
    }
    
    // Mejorar la validación en el formulario de correo electrónico
    document.getElementById('new-email').addEventListener('blur', function () {
        const email = this.value.trim();
        if (email && !isValidEmail(email)) {
            showProfileMessage('email', 'Por favor, ingresa un correo electrónico válido', 'error');
        }
    });
    
    // Mejorar la validación en el formulario de contraseña
    document.getElementById('new-password').addEventListener('blur', function () {
        const password = this.value;
        if (password && !isValidPassword(password)) {
            showProfileMessage('password', 'La contraseña debe tener al menos 6 caracteres', 'error');
        }
    });
    
    // Verificar que las contraseñas coinciden mientras se escribe
    document.getElementById('confirm-password').addEventListener('input', function () {
        const newPassword = document.getElementById('new-password').value;
        const confirmPassword = this.value;
        
        if (newPassword && confirmPassword) {
            if (newPassword !== confirmPassword) {
                this.setCustomValidity('Las contraseñas no coinciden');
            } else {
                this.setCustomValidity('');
            }
        }
    });
    
    // Verificar que los correos coinciden mientras se escribe
    document.getElementById('confirm-email').addEventListener('input', function () {
        const newEmail = document.getElementById('new-email').value;
        const confirmEmail = this.value;
        
        if (newEmail && confirmEmail) {
            if (newEmail !== confirmEmail) {
                this.setCustomValidity('Los correos no coinciden');
            } else {
                this.setCustomValidity('');
            }
        }
    });
    
    // Cerrar modal de perfil cuando se hace clic fuera
    window.addEventListener('click', function (event) {
        if (event.target === profileModal) {
            profileModal.style.display = 'none';
        }
    });
    
    // Actualizar nombre de usuario
    saveUsernameButton.addEventListener('click', function () {
        const newUsername = document.getElementById('new-username').value.trim();

        if (!newUsername) {
            showProfileMessage('username', 'Por favor, ingresa un nuevo nombre de usuario', 'error');
            return;
        }

        fetch('/api/profile/username', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ newUsername })
        })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    // Actualizar UI
                    document.getElementById('current-username').textContent = data.username;
                    document.getElementById('new-username').value = '';

                    // Actualizar nombre de usuario en la barra lateral
                    document.querySelector('.user-name').textContent = `Hola de nuevo, ${data.username}`;

                    showProfileMessage('username', 'Nombre de usuario actualizado correctamente', 'success');
                } else {
                    showProfileMessage('username', data.error, 'error');
                }
            })
            .catch(error => {
                console.error('Error al actualizar nombre de usuario:', error);
                showProfileMessage('username', 'Error al actualizar nombre de usuario', 'error');
            });
    });
    
    // Actualizar correo electrónico
    saveEmailButton.addEventListener('click', function () {
        const currentEmail = document.getElementById('current-email-input').value.trim();
        const newEmail = document.getElementById('new-email').value.trim();
        const confirmEmail = document.getElementById('confirm-email').value.trim();

        if (!currentEmail || !newEmail || !confirmEmail) {
            showProfileMessage('email', 'Por favor, completa todos los campos', 'error');
            return;
        }

        if (newEmail !== confirmEmail) {
            showProfileMessage('email', 'El nuevo correo y la confirmación no coinciden', 'error');
            return;
        }

        fetch('/api/profile/email', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ currentEmail, newEmail, confirmEmail })
        })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    // Actualizar UI
                    document.getElementById('current-email').textContent = data.maskedEmail;
                    document.getElementById('current-email-input').value = '';
                    document.getElementById('new-email').value = '';
                    document.getElementById('confirm-email').value = '';

                    showProfileMessage('email', 'Correo electrónico actualizado correctamente', 'success');
                } else {
                    showProfileMessage('email', data.error, 'error');
                }
            })
            .catch(error => {
                console.error('Error al actualizar correo electrónico:', error);
                showProfileMessage('email', 'Error al actualizar correo electrónico', 'error');
            });
    });
    
    // Actualizar contraseña
    savePasswordButton.addEventListener('click', function () {
        const currentPassword = document.getElementById('current-password').value;
        const newPassword = document.getElementById('new-password').value;
        const confirmPassword = document.getElementById('confirm-password').value;

        if (!currentPassword || !newPassword || !confirmPassword) {
            showProfileMessage('password', 'Por favor, completa todos los campos', 'error');
            return;
        }

        if (newPassword !== confirmPassword) {
            showProfileMessage('password', 'La nueva contraseña y la confirmación no coinciden', 'error');
            return;
        }

        fetch('/api/profile/password', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ currentPassword, newPassword, confirmPassword })
        })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    // Limpiar campos
                    document.getElementById('current-password').value = '';
                    document.getElementById('new-password').value = '';
                    document.getElementById('confirm-password').value = '';

                    showProfileMessage('password', 'Contraseña actualizada correctamente', 'success');
                } else {
                    showProfileMessage('password', data.error, 'error');
                }
            })
            .catch(error => {
                console.error('Error al actualizar contraseña:', error);
                showProfileMessage('password', 'Error al actualizar contraseña', 'error');
            });
    });
    
    // Botones de cancelar
    cancelUsernameButton.addEventListener('click', function () {
        document.getElementById('new-username').value = '';
        // Cerrar el modal de perfil
        profileModal.style.display = 'none';
    });
    
    cancelEmailButton.addEventListener('click', function () {
        document.getElementById('current-email-input').value = '';
        document.getElementById('new-email').value = '';
        document.getElementById('confirm-email').value = '';
        // Cerrar el modal de perfil
        profileModal.style.display = 'none';
    });
    
    cancelPasswordButton.addEventListener('click', function () {
        document.getElementById('current-password').value = '';
        document.getElementById('new-password').value = '';
        document.getElementById('confirm-password').value = '';
        // Cerrar el modal de perfil
        profileModal.style.display = 'none';
    });
    
    // ==========================================
    // THEME MANAGEMENT
    // ==========================================
    
    // Theme toggle functionality
    themeToggle.addEventListener('change', function () {
        if (this.checked) {
            document.body.classList.add('dark-theme');
            localStorage.setItem('theme', 'dark');
        } else {
            document.body.classList.remove('dark-theme');
            localStorage.setItem('theme', 'light');
        }
    });
    
    // ==========================================
    // SIDEBAR MANAGEMENT
    // ==========================================
    
    // Toggle sidebar
    menuToggle.addEventListener('click', function () {
        sidebar.classList.toggle('open');
    });
    
    // ==========================================
    // FILE UPLOAD & DRAG-DROP
    // ==========================================
    
    // Drag and drop functionality
    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
        dropArea.addEventListener(eventName, preventDefaults, false);
    });
    
    function preventDefaults(e) {
        e.preventDefault();
        e.stopPropagation();
    }
    
    ['dragenter', 'dragover'].forEach(eventName => {
        dropArea.addEventListener(eventName, highlight, false);
    });
    
    ['dragleave', 'drop'].forEach(eventName => {
        dropArea.addEventListener(eventName, unhighlight, false);
    });
    
    function highlight() {
        dropArea.classList.add('highlight');
    }
    
    function unhighlight() {
        dropArea.classList.remove('highlight');
    }
    
    dropArea.addEventListener('drop', handleDrop, false);
    
    function handleDrop(e) {
        const dt = e.dataTransfer;
        const files = dt.files;
        handleFiles(files);
    }
    
    dropArea.addEventListener('click', () => {
        fileUpload.click();
    });
    
    fileUpload.addEventListener('change', () => {
        handleFiles(fileUpload.files);
    });
    
    function handleFiles(fileList) {
        if (fileList.length === 0) return;

        // Store current sidebar state before file upload
        const sidebarState = sidebar.classList.contains('open');

        for (let i = 0; i < fileList.length; i++) {
            uploadFile(fileList[i]);
        }

        // Ensure sidebar maintains its state after file upload
        if (sidebarState) {
            sidebar.classList.add('open');
        } else {
            sidebar.classList.remove('open');
        }
    }
    
    function uploadFile(file) {
        // Crear FormData para enviar el archivo
        const formData = new FormData();
        formData.append('document', file);
        formData.append('name', file.name);

        // Mostrar modal para añadir información adicional
        showFileModal(null, file.name);

        // Guardar referencia al archivo para subir después de completar el modal
        currentFile = file;
    }
    
    function submitFile(file, name, description, tags) {
        // Store sidebar state before submission
        const sidebarState = sidebar.classList.contains('open');

        const formData = new FormData();
        formData.append('document', file);
        formData.append('name', name);
        formData.append('description', description || '');
        formData.append('tags', tags || '');

        fetch('/upload', {
            method: 'POST',
            body: formData
        })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    // Save sidebar state in localStorage before reload
                    localStorage.setItem('sidebarState', sidebarState);

                    // Recargar la página para mostrar el nuevo documento
                    window.location.reload();
                } else {
                    alert('Error al subir el documento: ' + data.error);
                }
            })
            .catch(error => {
                console.error('Error:', error);
                alert('Error al subir el documento');
            });
    }
    
    // ==========================================
    // FILE ACTIONS
    // ==========================================
    
    // Manejar clics en las acciones de las tarjetas de archivos
    document.addEventListener('click', function (e) {
        // Botón de vista previa
        if (e.target.closest('.preview-button')) {
            const fileCard = e.target.closest('.file-card');
            const documentId = fileCard.dataset.id;
            const fileName = fileCard.querySelector('.file-name').textContent.trim();
            showPreview(documentId, fileName);
        }
        
        // Función para configurar correctamente el botón de descarga
        if (e.target.closest('.star-button')) {
            const starButton = e.target.closest('.star-button');
            const fileCard = starButton.closest('.file-card');
            const documentId = fileCard.dataset.id;
            toggleStarred(documentId, starButton);
            e.stopPropagation(); // Prevent other click handlers from firing
        }
        
        // Botón de pantalla completa (antes era download-button)
        if (e.target.closest('.fullscreen-button')) {
            const fileCard = e.target.closest('.file-card');
            const documentId = fileCard.dataset.id;
            window.location.href = `/documents/${documentId}`;
        }
        
        // Botón de eliminación (mover a papelera)
        if (e.target.closest('.delete-button')) {
            e.stopPropagation();
            const fileCard = e.target.closest('.file-card');
            const documentId = fileCard.dataset.id;
            
            if (confirm('¿Estás seguro de que deseas mover este documento a la papelera?')) {
                deleteDocument(documentId, fileCard);
            }
        }
        
        // Botón de restaurar desde papelera
        if (e.target.closest('.restore-button')) {
            const fileCard = e.target.closest('.file-card');
            const documentId = fileCard.dataset.id;
            if (confirm('¿Deseas restaurar este documento?')) {
                restoreFromTrash(documentId, fileCard);
            }
        }
        
        // Botón de eliminación permanente
        if (e.target.closest('.permanent-delete-button')) {
            const fileCard = e.target.closest('.file-card');
            const documentId = fileCard.dataset.id;
            if (confirm('¿Estás seguro de que deseas eliminar permanentemente este documento? Esta acción no se puede deshacer.')) {
                permanentDelete(documentId, fileCard);
            }
        }
    });
    
    function moveToTrash(documentId, cardElement) {
        fetch(`/documents/${documentId}`, {
            method: 'DELETE'
        })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    // Add animation class
                    cardElement.classList.add('deleting');

                    // Remove the card after animation
                    setTimeout(() => {
                        cardElement.remove();

                        // If we're in the starred section, we need to check if there are any documents left
                        const currentSection = document.querySelector('.section-item.active');
                        if (currentSection && currentSection.querySelector('a').getAttribute('href') === '/starred') {
                            // Check if there are any documents left in the starred section
                            if (filesGrid.querySelectorAll('.file-card').length <= 1) { // <= 1 because we're about to remove this card
                                filesGrid.innerHTML = `
                                <div class="empty-state">
                                    <i class="fas fa-star"></i>
                                    <h3>No hay documentos destacados</h3>
                                    <p>Marca tus documentos como destacados para verlos aquí</p>
                                </div>
                                `;
                            }
                        } else if (filesGrid.querySelectorAll('.file-card').length <= 1) {
                            // For other sections, show the standard empty state
                            filesGrid.innerHTML = `
                            <div class="empty-state">
                                <i class="fas fa-folder-open"></i>
                                <h3>No hay documentos</h3>
                                <p>Sube tus primeros documentos usando el área de arrastre superior</p>
                            </div>
                            `;
                        }
                    }, 300);
                } else {
                    alert('Error al mover el documento a la papelera: ' + data.error);
                }
            })
            .catch(error => {
                console.error('Error:', error);
                alert('Error al mover el documento a la papelera');
            });
    }
    
    function showFileModal(documentId, fileName) {
        currentDocumentId = documentId;

        // Limpiar el formulario
        document.getElementById('document-form').reset();
        document.getElementById('document-id').value = documentId || '';
        document.getElementById('input-file-name').value = fileName || '';

        // Si es un documento existente, cargar sus datos
        if (documentId) {
            fetch(`/documents/${documentId}`)
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Error al cargar la información del documento');
                    }
                    return response.json();
                })
                .then(data => {
                    document.getElementById('input-file-description').value = data.description || '';
                    document.getElementById('input-file-tags').value = data.tags ? data.tags.join(', ') : '';
                })
                .catch(error => {
                    console.error('Error:', error);
                });
        }

        // Mostrar el modal
        fileModal.style.display = 'block';
    }
    
    function showPreview(documentId, fileName) {
    currentDocumentId = documentId;
    document.getElementById('preview-file-name').value = fileName;

    // Determinar el icono basado en la extensión del archivo
    const fileIcon = document.getElementById('preview-file-icon');
    fileIcon.className = 'fas';

    // Get file extension
    const fileExtension = fileName.split('.').pop().toLowerCase();

    if (fileName.toLowerCase().endsWith('.pdf')) {
        fileIcon.classList.add('fa-file-pdf');
    } else if (/\.(jpe?g|png|gif|bmp)$/i.test(fileName)) {
        fileIcon.classList.add('fa-file-image');
    } else if (/\.(docx?|odt)$/i.test(fileName)) {
        fileIcon.classList.add('fa-file-word');
    } else if (/\.(xlsx?|ods)$/i.test(fileName)) {
        fileIcon.classList.add('fa-file-excel');
    } else if (/\.(zip|rar|7z|tar|gz)$/i.test(fileName)) {
        fileIcon.classList.add('fa-file-archive');
    } else {
        fileIcon.classList.add('fa-file');
    }

    // Cargar los metadatos del documento primero
    fetch(`/documents/${documentId}`, {
        headers: {
            'Accept': 'application/json'
        }
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Error al cargar los metadatos del documento');
            }
            return response.json();
        })
        .then(data => {
            // Llenar los campos con los datos del documento
            document.getElementById('preview-description').value = data.description || '';
            document.getElementById('preview-tags').value = data.tags ? data.tags.join(', ') : '';

            // Add star button to preview modal if needed
            // In the showPreview function where you handle the star button
            const previewStarButton = document.querySelector('.preview-star-button');
            if (previewStarButton) {
                if (data.isStarred) {
                    previewStarButton.classList.add('starred');
                    previewStarButton.querySelector('i').className = 'fas fa-star';
                } else {
                    previewStarButton.classList.remove('starred');
                    previewStarButton.querySelector('i').className = 'far fa-star';
                }
            }
            
            // Ahora manejar la vista previa según el tipo de archivo
            const previewIframe = document.getElementById('preview-iframe');
            
            // List of non-previewable file extensions
            const nonPreviewableExtensions = ['zip', 'rar', '7z', 'tar', 'gz', 'exe', 'dll', 'bin', 'iso', 'dmg'];
            
            // Check if the file is non-previewable
            if (nonPreviewableExtensions.includes(fileExtension)) {
                // Show a message for non-previewable files
                previewIframe.srcdoc = `
                <html>
                <head>
                  <style>
                    body {
                      font-family: 'Roboto', Arial, sans-serif;
                      display: flex;
                      flex-direction: column;
                      align-items: center;
                      justify-content: center;
                      height: 100vh;
                      margin: 0;
                      background-color: #f5f5f5;
                      color: #333;
                      text-align: center;
                      padding: 20px;
                    }
                    .icon {
                      font-size: 64px;
                      color: #db4437;
                      margin-bottom: 20px;
                    }
                    h2 {
                      margin-bottom: 10px;
                    }
                    p {
                      margin-bottom: 20px;
                      color: #666;
                      max-width: 500px;
                    }
                    .download-btn {
                      background-color: #4285f4;
                      color: white;
                      border: none;
                      padding: 10px 20px;
                      border-radius: 4px;
                      cursor: pointer;
                      font-weight: 500;
                      text-decoration: none;
                      display: inline-block;
                    }
                    .download-btn:hover {
                      background-color: #3367d6;
                    }
                  </style>
                  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
                </head>
                <body>
                  <div class="icon">
                    <i class="fas fa-file-archive"></i>
                  </div>
                  <h2>Este tipo de archivo no se puede previsualizar</h2>
                  <p>Los archivos ${fileExtension.toUpperCase()} no pueden mostrarse en el navegador. Puedes descargar el archivo para verlo en tu dispositivo.</p>
                  <a href="/documents/${documentId}" download="${fileName}" class="download-btn">
                    <i class="fas fa-download"></i> Descargar archivo
                  </a>
                </body>
                </html>`;
            } else if (/^(docx?|xlsx?|pptx?|odt|ods|odp)$/i.test(fileExtension)) {
                // Para archivos de Office, mostrar un mensaje informativo en lugar de intentar cargarlos
                previewIframe.srcdoc = `
                // ... existing code for Office files ...
                `;
            } else {
                // ... existing code for other file types ...
            }
            
            // Show the preview modal
            previewModal.style.display = 'block';
            
            // Set up the download button
            const downloadButton = document.getElementById('download-preview-button');
            downloadButton.href = `/documents/${documentId}`;
            downloadButton.setAttribute('download', fileName);
        })
        .catch(error => {
            console.error('Error:', error);
        });
}
    
    // Guardar cambios desde el modal de vista previa
    savePreviewButton.addEventListener('click', function () {
        if (!currentDocumentId) return;

        const name = document.getElementById('preview-file-name').value;
        const description = document.getElementById('preview-description').value;
        const tags = document.getElementById('preview-tags').value;

        if (!name) {
            alert('Por favor, ingresa un nombre para el documento');
            return;
        }

        // Actualizar documento
        fetch(`/documents/${currentDocumentId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name,
                description,
                tags
            })
        })
            .then(response => response.json())
            .then(data => {
                // Actualizar la tarjeta del documento en la interfaz
                const fileCard = document.querySelector(`.file-card[data-id="${currentDocumentId}"]`);
                if (fileCard) {
                    fileCard.querySelector('.file-name').textContent = name;
                    fileCard.dataset.tags = tags.split(',').map(tag => tag.trim()).join(',');
                }
                alert('Documento actualizado correctamente');
            })
            .catch(error => {
                console.error('Error:', error);
                alert('Error al actualizar el documento');
            });
    });
    
    // Manejar el envío del formulario de documento
    saveButton.addEventListener('click', function () {
        const documentId = document.getElementById('document-id').value;
        const name = document.getElementById('input-file-name').value;
        const description = document.getElementById('input-file-description').value;
        const tags = document.getElementById('input-file-tags').value;

        if (!name) {
            alert('Por favor, ingresa un nombre para el documento');
            return;
        }

        if (documentId) {
            // Actualizar documento existente
            fetch(`/documents/${documentId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    name,
                    description,
                    tags
                })
            })
                .then(response => response.json())
                .then(data => {
                    // Actualizar la tarjeta del documento
                    const fileCard = document.querySelector(`.file-card[data-id="${documentId}"]`);
                    if (fileCard) {
                        fileCard.querySelector('.file-name').textContent = name;
                    }
                    closeFileModal();
                })
                .catch(error => {
                    console.error('Error:', error);
                    alert('Error al actualizar el documento');
                });
        } else if (currentFile) {
            // Subir nuevo documento
            submitFile(currentFile, name, description, tags);
            closeFileModal();
            currentFile = null;
        }
    });
    
    function closeFileModal() {
        fileModal.style.display = 'none';
        currentDocumentId = null;
    }
    
    function closePreviewModal() {
        previewModal.style.display = 'none';
        document.getElementById('preview-iframe').src = '';
    }
    
    // Event listeners para cerrar modales
    closeModal.addEventListener('click', closeFileModal);
    cancelButton.addEventListener('click', closeFileModal);
    
    closePreview.addEventListener('click', closePreviewModal);
    closePreviewButton.addEventListener('click', closePreviewModal);
    
    // ==========================================
    // SEARCH & FILTERING
    // ==========================================
    
    // Búsqueda de documentos
    searchBox.addEventListener('input', function () {
        applyFiltersAndSearch();
    });
    
    // Función para aplicar filtros y búsqueda
    function applyFiltersAndSearch() {
        const searchTerm = searchBox.value.toLowerCase();
        const fileCards = document.querySelectorAll('.file-card');

        // Obtener valores de los filtros
        const sizeMin = parseInt(document.getElementById('size-min')?.value || 0) * 1024; // Convertir a bytes
        const sizeMax = parseInt(document.getElementById('size-max')?.value || 10240) * 1024; // Convertir a bytes
        const dateFrom = document.getElementById('date-from')?.value;
        const dateTo = document.getElementById('date-to')?.value;
        const selectedTags = Array.from(document.querySelectorAll('.tag-item.selected')).map(tag => tag.dataset.tag);

        let visibleCount = 0;

        fileCards.forEach(card => {
            const fileName = card.querySelector('.file-name').textContent.toLowerCase();
            const fileSize = parseInt(card.dataset.size || 0);
            const fileDate = card.dataset.date;
            const fileTags = (card.dataset.tags || '').split(',').map(tag => tag.trim().toLowerCase());

            // Aplicar filtro de búsqueda
            const matchesSearch = !searchTerm || fileName.includes(searchTerm);

            // Aplicar filtro de tamaño
            const matchesSize = !sizeMin || !sizeMax || (fileSize >= sizeMin && fileSize <= sizeMax);

            // Aplicar filtro de fecha
            const matchesDate = (!dateFrom || fileDate >= dateFrom) && (!dateTo || fileDate <= dateTo);

            // Aplicar filtro de etiquetas
            const matchesTags = selectedTags.length === 0 || selectedTags.some(tag => fileTags.includes(tag.toLowerCase()));

            // Mostrar u ocultar la tarjeta según los filtros
            if (matchesSearch && matchesSize && matchesDate && matchesTags) {
                card.style.display = '';
                visibleCount++;
            } else {
                card.style.display = 'none';
            }
        });

        // Mostrar mensaje si no hay resultados
        if (visibleCount === 0) {
            if (!document.querySelector('.no-results')) {
                const noResults = document.createElement('div');
                noResults.className = 'empty-state no-results';
                noResults.innerHTML = `
            <i class="fas fa-search"></i>
            <h3>No se encontraron resultados</h3>
            <p>Intenta con otra búsqueda o ajusta los filtros</p>
          `;
                filesGrid.appendChild(noResults);
            }
        } else {
            const noResults = document.querySelector('.no-results');
            if (noResults) {
                noResults.remove();
            }
        }
    }
    
    // Cargar etiquetas disponibles
    function loadAvailableTags() {
        const tagsContainer = document.getElementById('tags-container');
        const allTags = new Set();

        // Recopilar todas las etiquetas de los documentos
        document.querySelectorAll('.file-card').forEach(card => {
            const tags = (card.dataset.tags || '').split(',').filter(tag => tag.trim());
            tags.forEach(tag => allTags.add(tag.trim()));
        });

        // Limpiar el contenedor de etiquetas
        tagsContainer.innerHTML = '';

        // Crear elementos para cada etiqueta
        allTags.forEach(tag => {
            const tagElement = document.createElement('div');
            tagElement.className = 'tag-item';
            tagElement.dataset.tag = tag;
            tagElement.innerHTML = `<i class="fas fa-tag"></i>${tag}`;

            tagElement.addEventListener('click', function () {
                this.classList.toggle('selected');
                // No aplicar filtros automáticamente para permitir selección múltiple
            });

            tagsContainer.appendChild(tagElement);
        });
    }
    
    // Configurar eventos para el modal de filtros
    filterButton.addEventListener('click', function () {
        loadAvailableTags();
        filterModal.style.display = 'block';
    });
    
    closeFilterModal.addEventListener('click', function () {
        filterModal.style.display = 'none';
    });
    
    resetFiltersButton.addEventListener('click', function () {
        // Restablecer valores de los filtros
        document.getElementById('size-min').value = 0;
        document.getElementById('size-max').value = 10240;
        document.getElementById('date-from').value = '';
        document.getElementById('date-to').value = '';
        document.querySelectorAll('.tag-item.selected').forEach(tag => {
            tag.classList.remove('selected');
        });

        // Actualizar visualización de valores
        document.getElementById('size-min-value').textContent = '0 KB';
        document.getElementById('size-max-value').textContent = '10 MB';
    });
    
    applyFiltersButton.addEventListener('click', function () {
        applyFiltersAndSearch();
        filterModal.style.display = 'none';
    });
    
    // Configurar sliders de tamaño
    const sizeMin = document.getElementById('size-min');
    const sizeMax = document.getElementById('size-max');
    const sizeMinValue = document.getElementById('size-min-value');
    const sizeMaxValue = document.getElementById('size-max-value');
    
    sizeMin.addEventListener('input', function () {
        const value = parseInt(this.value);
        sizeMinValue.textContent = value < 1024 ? `${value} KB` : `${(value / 1024).toFixed(1)} MB`;

        // Asegurar que min no sea mayor que max
        if (value > parseInt(sizeMax.value)) {
            sizeMax.value = value;
            sizeMaxValue.textContent = value < 1024 ? `${value} KB` : `${(value / 1024).toFixed(1)} MB`;
        }
    });
    
    sizeMax.addEventListener('input', function () {
        const value = parseInt(this.value);
        sizeMaxValue.textContent = value < 1024 ? `${value} KB` : `${(value / 1024).toFixed(1)} MB`;

        // Asegurar que max no sea menor que min
        if (value < parseInt(sizeMin.value)) {
            sizeMin.value = value;
            sizeMinValue.textContent = value < 1024 ? `${value} KB` : `${(value / 1024).toFixed(1)} MB`;
        }
    });
    
    // ==========================================
    // USER ACTIONS
    // ==========================================
    
    // Cerrar sesión
    logoutButton.addEventListener('click', function () {
        window.location.href = '/logout';
    });
    
    // Toggle starred status
    function toggleStarred(documentId, buttonElement) {
        fetch(`/documents/${documentId}/star`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Error al actualizar estado destacado');
                }
                return response.json();
            })
            .then(data => {
                if (data.success) {
                    // Update the star icon
                    const starIcon = buttonElement.querySelector('i');
                    buttonElement.classList.add('animate');

                    // After animation completes, update the icon
                    setTimeout(() => {
                        if (data.isStarred) {
                            starIcon.className = 'fas fa-star'; // Use solid star for starred
                            buttonElement.setAttribute('data-starred', 'true');
                            buttonElement.setAttribute('title', 'Quitar de destacados');
                        } else {
                            starIcon.className = 'far fa-star'; // Use regular star for not starred
                            buttonElement.setAttribute('data-starred', 'false');
                            buttonElement.setAttribute('title', 'Destacar');
                        }
                        buttonElement.classList.remove('animate');
                    }, 300);
                }
            })
            .catch(error => {
                console.error('Error:', error);
                alert('Error al actualizar estado destacado');
            });
    }
});

// ==========================================
// THEME TOGGLE FOR COLLAPSED SIDEBAR
// ==========================================

document.addEventListener('DOMContentLoaded', function () {
    const themeToggleContainer = document.querySelector('.theme-toggle-container');
    
    themeToggleContainer.addEventListener('click', function (e) {
        const sidebar = document.getElementById('sidebar');
        
        // Only handle click if sidebar is collapsed
        if (!sidebar.classList.contains('open')) {
            const themeToggle = document.getElementById('theme-toggle');
            
            // Toggle the checkbox state
            themeToggle.checked = !themeToggle.checked;
            
            // Trigger the change event to apply theme
            const changeEvent = new Event('change');
            themeToggle.dispatchEvent(changeEvent);
            
            // Prevent event from reaching the checkbox directly
            e.preventDefault();
        }
    });
});

// ==========================================
// TRASH MANAGEMENT
// ==========================================

// Update the restore function to handle the case when a document is restored
function restoreFromTrash(documentId, cardElement) {
    // Get filesGrid here to ensure it's available in this context
    const filesGrid = document.getElementById('files-grid');

    fetch(`/documents/${documentId}/restore`, {
        method: 'PUT'
    })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                // Add animation class
                cardElement.classList.add('restoring');

                // Remove the card after animation
                setTimeout(() => {
                    cardElement.remove();

                    // If no more documents in trash, show empty state
                    if (filesGrid.querySelectorAll('.file-card').length <= 1) { // <= 1 because we're about to remove this card
                        filesGrid.innerHTML = `
                        <div class="empty-state">
                            <i class="fas fa-trash"></i>
                            <h3>Papelera vacía</h3>
                            <p>No hay documentos en la papelera</p>
                        </div>
                        `;
                    }
                }, 300);
            } else {
                alert('Error al restaurar el documento: ' + data.error);
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Error al restaurar el documento');
        });
}

// Function to permanently delete a document
function permanentDelete(documentId, cardElement) {
    // Get filesGrid here to ensure it's available in this context
    const filesGrid = document.getElementById('files-grid');

    fetch(`/documents/${documentId}/permanent`, {
        method: 'DELETE'
    })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                // Add animation class
                cardElement.classList.add('deleting');

                // Remove the card after animation
                setTimeout(() => {
                    cardElement.remove();

                    // If no more documents, show empty state
                    if (filesGrid.querySelectorAll('.file-card').length <= 1) {
                        filesGrid.innerHTML = `
                        <div class="empty-state">
                            <i class="fas fa-trash"></i>
                            <h3>Papelera vacía</h3>
                            <p>No hay documentos en la papelera</p>
                        </div>
                        `;
                    }
                }, 300);
            } else {
                alert('Error al eliminar permanentemente el documento: ' + data.error);
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Error al eliminar permanentemente el documento');
        });
}
// Empty trash button functionality
const emptyTrashButton = document.getElementById('empty-trash-button');
if (emptyTrashButton) {
    emptyTrashButton.addEventListener('click', function () {
        if (confirm('¿Estás seguro de que deseas vaciar la papelera? Esta acción eliminará permanentemente todos los documentos en la papelera.')) {
            emptyTrash();
        }
    });
}

// Function to empty the trash
function emptyTrash() {
    // Get filesGrid here to ensure it's available in this context
    const filesGrid = document.getElementById('files-grid');

    fetch('/trash', {
        method: 'DELETE'
    })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                // Show empty state
                filesGrid.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-trash"></i>
                    <h3>Papelera vacía</h3>
                    <p>No hay documentos en la papelera</p>
                </div>
                `;

                // Hide the empty trash button
                if (emptyTrashButton) {
                    emptyTrashButton.style.display = 'none';
                }
            } else {
                alert('Error al vaciar la papelera: ' + data.error);
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Error al vaciar la papelera');
        });
}

// Function to delete a document (move to trash)
function deleteDocument(documentId, fileCard) {
    // Añadir clase de animación para la eliminación
    fileCard.classList.add('deleting');

    fetch(`/documents/${documentId}`, {
        method: 'DELETE'
    })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                // Esperar a que termine la animación antes de eliminar el elemento
                setTimeout(() => {
                    fileCard.remove();

                    // Verificar si quedan documentos y mostrar el estado vacío si es necesario
                    const remainingCards = document.querySelectorAll('.file-card');
                    if (remainingCards.length === 0) {
                        const filesGrid = document.getElementById('files-grid');
                        filesGrid.innerHTML = `
                        <div class="empty-state">
                            <i class="fas fa-folder-open"></i>
                            <h3>No hay documentos</h3>
                            <p>Sube tus primeros documentos usando el área de arrastre superior</p>
                        </div>
                    `;
                    }
                }, 300); // Tiempo de la animación
            } else {
                // Revertir la animación si hay error
                fileCard.classList.remove('deleting');
                alert('Error al eliminar el documento: ' + data.error);
            }
        })
        .catch(error => {
            console.error('Error:', error);
            // Revertir la animación si hay error
            fileCard.classList.remove('deleting');
            alert('Error al eliminar el documento');
        });
}
