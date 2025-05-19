// Función para formatear el tamaño del archivo
function formatFileSize(bytes) {
  if (!bytes) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
}

document.addEventListener("DOMContentLoaded", function () {
  // Variables para los elementos del DOM
  const sidebar = document.getElementById("sidebar");
  const menuToggle = document.getElementById("menu-toggle");
  const dropArea = document.getElementById("drop-area");
  const fileUpload = document.getElementById("file-upload");
  const filesGrid = document.getElementById("files-grid");
  const fileModal = document.getElementById("file-modal");
  const closeModal = document.getElementById("close-modal");
  const cancelButton = document.getElementById("cancel-button");
  const saveButton = document.getElementById("save-button");
  const previewModal = document.getElementById("preview-modal");
  const closePreview = document.getElementById("close-preview");
  const closePreviewButton = document.getElementById("close-preview-button");
  const searchBox = document.getElementById("search-box");
  const logoutButton = document.getElementById("logout-button");
  const filterButton = document.querySelector(".filter-button");
  const filterModal = document.getElementById("filter-modal");
  const closeFilterModal = document.getElementById("close-filter-modal");
  const resetFiltersButton = document.getElementById("reset-filters-button");
  const applyFiltersButton = document.getElementById("apply-filters-button");
  const savePreviewButton = document.getElementById("save-preview-button");
  const themeToggle = document.getElementById("theme-toggle");
  const savedSidebarState = localStorage.getItem("sidebarState");
  if (savedSidebarState === "true") {
    sidebar.classList.add("open");
  } else if (savedSidebarState === "false") {
    sidebar.classList.remove("open");
  } else {
    // Default behavior - initialize with the sidebar open
    sidebar.classList.add("open");
  }
  // Prevenir autofill en el campo de búsqueda
  if (searchBox) {
    searchBox.setAttribute("autocomplete", "off");
    searchBox.setAttribute("name", "search-docs"); // Nombre específico para evitar confusión con campos de login
  }

  const sectionLinks = document.querySelectorAll(".section-item a");

  sectionLinks.forEach((link) => {
    link.addEventListener("click", function (e) {
      e.preventDefault();

      // Remove active class from all section items
      document.querySelectorAll(".section-item").forEach((item) => {
        item.classList.remove("active");
      });

      // Add active class to clicked section
      this.parentElement.classList.add("active");

      // Get the section URL
      const sectionUrl = this.getAttribute("href");

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
          "X-Requested-With": "XMLHttpRequest",
        },
      })
        .then((response) => response.text())
        .then((html) => {
          // Create a temporary element to parse the HTML
          const tempDiv = document.createElement("div");
          tempDiv.innerHTML = html;

          // Extract the files grid content
          const newFilesGrid = tempDiv.querySelector("#files-grid");

          if (newFilesGrid) {
            // Replace the current files grid with the new one
            filesGrid.innerHTML = newFilesGrid.innerHTML;

            // Update page title if needed
            const newTitle = tempDiv.querySelector("title");
            if (newTitle) {
              document.title = newTitle.textContent;
            }

            // Update section title based on the clicked link
            const sectionTitle = document.querySelector(".files-header");
            if (sectionTitle) {
              // Get the text content of the clicked link
              const linkText = this.textContent.trim();
              sectionTitle.textContent = linkText;

              // Check if we're in the trash section and update the empty trash button
              const filesHeaderContainer = document.querySelector(
                ".files-header-container"
              );
              const emptyTrashButton =
                document.getElementById("empty-trash-button");

              if (sectionUrl === "/trash") {
                // We're in trash section - show empty trash button if there are documents
                if (newFilesGrid.querySelectorAll(".file-card").length > 0) {
                  // If button doesn't exist, create it
                  if (!emptyTrashButton) {
                    const newButton = document.createElement("button");
                    newButton.id = "empty-trash-button";
                    newButton.className = "empty-trash-button";
                    newButton.innerHTML =
                      '<i class="fas fa-trash-alt"></i> Vaciar papelera';

                    // Add event listener to the new button
                    newButton.addEventListener("click", function () {
                      if (
                        confirm(
                          "¿Estás seguro de que deseas vaciar la papelera? Esta acción eliminará permanentemente todos los documentos en la papelera."
                        )
                      ) {
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
            window.history.pushState({}, "", sectionUrl);

            // Re-initialize any event listeners for the new content
            initializeTagSuggestions();
            initializeFileCardEvents();
          } else {
            filesGrid.innerHTML = `
                        <div class="empty-state">
                            <i class="fas fa-exclamation-circle"></i>
                            <h3>Error al cargar contenido</3>
                            <p>No se pudo cargar el contenido de esta sección</p>
                        </div>
                    `;
          }
        })
        .catch((error) => {
          console.error("Error loading section:", error);
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

  sectionLinks.forEach((link) => {
    link.addEventListener("click", function (e) {
      e.preventDefault();

      // Remove active class from all section items
      document.querySelectorAll(".section-item").forEach((item) => {
        item.classList.remove("active");
      });

      // Add active class to clicked section
      this.parentElement.classList.add("active");

      // Get the section URL
      const sectionUrl = this.getAttribute("href");

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
          "X-Requested-With": "XMLHttpRequest",
        },
      })
        .then((response) => response.text())
        .then((html) => {
          // Create a temporary element to parse the HTML
          const tempDiv = document.createElement("div");
          tempDiv.innerHTML = html;

          // Extract the files grid content
          const newFilesGrid = tempDiv.querySelector("#files-grid");

          if (newFilesGrid) {
            // Replace the current files grid with the new one
            filesGrid.innerHTML = newFilesGrid.innerHTML;

            // Update page title if needed
            const newTitle = tempDiv.querySelector("title");
            if (newTitle) {
              document.title = newTitle.textContent;
            }

            // Update section title based on the clicked link
            const sectionTitle = document.querySelector(".files-header");
            if (sectionTitle) {
              // Get the text content of the clicked link
              const linkText = this.textContent.trim();
              sectionTitle.textContent = linkText;

              // Check if we're in the trash section and update the empty trash button
              const filesHeaderContainer = document.querySelector(
                ".files-header-container"
              );
              const emptyTrashButton =
                document.getElementById("empty-trash-button");

              if (sectionUrl === "/trash") {
                // We're in trash section - show empty trash button if there are documents
                if (newFilesGrid.querySelectorAll(".file-card").length > 0) {
                  // If button doesn't exist, create it
                  if (!emptyTrashButton) {
                    const newButton = document.createElement("button");
                    newButton.id = "empty-trash-button";
                    newButton.className = "empty-trash-button";
                    newButton.innerHTML =
                      '<i class="fas fa-trash-alt"></i> Vaciar papelera';

                    // Add event listener to the new button
                    newButton.addEventListener("click", function () {
                      if (
                        confirm(
                          "¿Estás seguro de que deseas vaciar la papelera? Esta acción eliminará permanentemente todos los documentos en la papelera."
                        )
                      ) {
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
            window.history.pushState({}, "", sectionUrl);

            // Re-initialize any event listeners for the new content
            initializeTagSuggestions();
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
        .catch((error) => {
          console.error("Error loading section:", error);
          filesGrid.innerHTML = `
                    <div class="empty-state">
                        <i class="fas fa-exclamation-circle"></i>
                        <h3>Error al cargar contenido</h3>
                        <p>Ocurrió un error al cargar esta sección</p>
                    </div>
                `;
        });

      if (sectionUrl === "/trash") {
        // Hide download button and remove checkboxes in trash section
        downloadSelectedButton.style.display = "none";
        document
          .querySelectorAll(".file-select-checkbox")
          .forEach((checkbox) => {
            checkbox.style.display = "none";
          });
      } else {
        // Show checkboxes and reset download button state for other sections
        document
          .querySelectorAll(".file-select-checkbox")
          .forEach((checkbox) => {
            checkbox.style.display = "";
          });
        updateDownloadButtonState();
      }
    });
  });

  sectionLinks.forEach((link) => {
    link.addEventListener("click", function (e) {
      e.preventDefault();

      // Remove active class from all section items
      document.querySelectorAll(".section-item").forEach((item) => {
        item.classList.remove("active");
      });

      // Add active class to clicked section
      this.parentElement.classList.add("active");

      // Get the section URL
      const sectionUrl = this.getAttribute("href");

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
          "X-Requested-With": "XMLHttpRequest",
        },
      })
        .then((response) => response.text())
        .then((html) => {
          const tempDiv = document.createElement("div");
          tempDiv.innerHTML = html;

          const newFilesGrid = tempDiv.querySelector("#files-grid");
          if (newFilesGrid) {
            filesGrid.innerHTML = newFilesGrid.innerHTML;

            // Handle trash section logic
            if (sectionUrl === "/trash") {
              downloadSelectedButton.style.display = "none";
              document
                .querySelectorAll(".file-select-checkbox")
                .forEach((checkbox) => {
                  checkbox.style.display = "none";
                });
            } else {
              document
                .querySelectorAll(".file-select-checkbox")
                .forEach((checkbox) => {
                  checkbox.style.display = "";
                });
              updateDownloadButtonState();
            }

            // Initialize tag suggestions after loading new content
            initializeTagSuggestions();

            // Update browser URL without reloading
            window.history.pushState({}, "", sectionUrl);

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
        .catch((error) => {
          console.error("Error loading section:", error);
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
    document.querySelectorAll(".file-card .star-button").forEach((button) => {
      button.addEventListener("click", function (e) {
        e.stopPropagation();
        const fileCard = this.closest(".file-card");
        const documentId = fileCard.dataset.id;
        toggleStarred(documentId, this);
      });
    });

    // Add other event listeners as needed
  }

  // Variables para el modal de perfil
  const profileButton = document.querySelector(".profile-button");
  if (profileButton) {
    profileButton.addEventListener("click", function () {
      // Cargar información del perfil
      loadProfileInfo();
      profileModal.style.display = "block";
    });
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
  document.getElementById("new-email").addEventListener("blur", function () {
    const email = this.value.trim();
    if (email && !isValidEmail(email)) {
      showProfileMessage(
        "email",
        "Por favor, ingresa un correo electrónico válido",
        "error"
      );
    }
  });

  // Mejorar la validación en el formulario de contraseña
  document.getElementById("new-password").addEventListener("blur", function () {
    const password = this.value;
    if (password && !isValidPassword(password)) {
      showProfileMessage(
        "password",
        "La contraseña debe tener al menos 6 caracteres",
        "error"
      );
    }
  });

  // Verificar que las contraseñas coinciden mientras se escribe
  document
    .getElementById("confirm-password")
    .addEventListener("input", function () {
      const newPassword = document.getElementById("new-password").value;
      const confirmPassword = this.value;

      if (newPassword && confirmPassword) {
        if (newPassword !== confirmPassword) {
          this.setCustomValidity("Las contraseñas no coinciden");
        } else {
          this.setCustomValidity("");
        }
      }
    });

  // Verificar que los correos coinciden mientras se escribe
  document
    .getElementById("confirm-email")
    .addEventListener("input", function () {
      const newEmail = document.getElementById("new-email").value;
      const confirmEmail = this.value;

      if (newEmail && confirmEmail) {
        if (newEmail !== confirmEmail) {
          this.setCustomValidity("Los correos no coinciden");
        } else {
          this.setCustomValidity("");
        }
      }
    });

  // Cerrar modal de perfil cuando se hace clic fuera
  window.addEventListener("click", function (event) {
    if (event.target === profileModal) {
      profileModal.style.display = "none";
    }
  });
  const profileModal = document.getElementById("profile-modal");
  const closeProfileModal = document.getElementById("close-profile-modal");
  const profileTabs = document.querySelectorAll(".profile-tab");
  const profileTabContents = document.querySelectorAll(".profile-tab-content");

  // Botones para guardar cambios
  const saveUsernameButton = document.getElementById("save-username-button");
  const saveEmailButton = document.getElementById("save-email-button");
  const savePasswordButton = document.getElementById("save-password-button");

  // Botones para cancelar cambios
  const cancelUsernameButton = document.getElementById(
    "cancel-username-button"
  );
  const cancelEmailButton = document.getElementById("cancel-email-button");
  const cancelPasswordButton = document.getElementById(
    "cancel-password-button"
  );

  // Abrir modal de perfil
  profileButton.addEventListener("click", function () {
    // Cargar información del perfil
    loadProfileInfo();
    profileModal.style.display = "block";
  });

  // Cerrar modal de perfil
  closeProfileModal.addEventListener("click", function () {
    profileModal.style.display = "none";
  });

  // Cambiar entre pestañas
  profileTabs.forEach((tab) => {
    tab.addEventListener("click", function () {
      // Remover clase active de todas las pestañas
      profileTabs.forEach((t) => t.classList.remove("active"));
      profileTabContents.forEach((c) => c.classList.remove("active"));

      // Activar pestaña seleccionada
      this.classList.add("active");
      document
        .getElementById(`${this.dataset.tab}-tab`)
        .classList.add("active");
    });
  });

  // Cargar información del perfil
  function loadProfileInfo() {
    fetch("/api/profile")
      .then((response) => response.json())
      .then((data) => {
        // Actualizar nombre de usuario
        document.getElementById("current-username").textContent = data.username;
        document.getElementById("new-username").value = "";

        // Actualizar correo electrónico
        document.getElementById("current-email").textContent = data.maskedEmail;
        document.getElementById("current-email-input").value = "";
        document.getElementById("new-email").value = "";
        document.getElementById("confirm-email").value = "";

        // Limpiar campos de contraseña
        document.getElementById("current-password").value = "";
        document.getElementById("new-password").value = "";
        document.getElementById("confirm-password").value = "";
      })
      .catch((error) => {
        console.error("Error al cargar información del perfil:", error);
      });
  }

  // Función para mostrar mensajes de error o éxito
  function showProfileMessage(tabId, message, type) {
    // Eliminar mensajes anteriores
    const oldMessages = document.querySelectorAll(".profile-message");
    oldMessages.forEach((msg) => msg.remove());

    // Crear nuevo mensaje
    const messageElement = document.createElement("div");
    messageElement.className = `profile-message profile-${type}`;
    messageElement.textContent = message;

    // Insertar mensaje al inicio del contenido de la pestaña
    const tabContent = document.getElementById(`${tabId}-tab`);
    tabContent.insertBefore(messageElement, tabContent.firstChild);

    // Mostrar mensaje
    messageElement.style.display = "block";

    // Ocultar mensaje después de 5 segundos
    setTimeout(() => {
      messageElement.style.display = "none";
      setTimeout(() => messageElement.remove(), 300);
    }, 5000);
  }

  // Actualizar nombre de usuario
  saveUsernameButton.addEventListener("click", function () {
    const newUsername = document.getElementById("new-username").value.trim();

    if (!newUsername) {
      showProfileMessage(
        "username",
        "Por favor, ingresa un nuevo nombre de usuario",
        "error"
      );
      return;
    }

    fetch("/api/profile/username", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ newUsername }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          // Actualizar UI
          document.getElementById("current-username").textContent =
            data.username;
          document.getElementById("new-username").value = "";

          // Actualizar nombre de usuario en la barra lateral
          document.querySelector(
            ".user-name"
          ).textContent = `Hola de nuevo, ${data.username}`;

          showProfileMessage(
            "username",
            "Nombre de usuario actualizado correctamente",
            "success"
          );
        } else {
          showProfileMessage("username", data.error, "error");
        }
      })
      .catch((error) => {
        console.error("Error al actualizar nombre de usuario:", error);
        showProfileMessage(
          "username",
          "Error al actualizar nombre de usuario",
          "error"
        );
      });
  });

  // Actualizar correo electrónico
  saveEmailButton.addEventListener("click", function () {
    const currentEmail = document
      .getElementById("current-email-input")
      .value.trim();
    const newEmail = document.getElementById("new-email").value.trim();
    const confirmEmail = document.getElementById("confirm-email").value.trim();

    if (!currentEmail || !newEmail || !confirmEmail) {
      showProfileMessage(
        "email",
        "Por favor, completa todos los campos",
        "error"
      );
      return;
    }

    if (newEmail !== confirmEmail) {
      showProfileMessage(
        "email",
        "El nuevo correo y la confirmación no coinciden",
        "error"
      );
      return;
    }

    fetch("/api/profile/email", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ currentEmail, newEmail, confirmEmail }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          // Actualizar UI
          document.getElementById("current-email").textContent =
            data.maskedEmail;
          document.getElementById("current-email-input").value = "";
          document.getElementById("new-email").value = "";
          document.getElementById("confirm-email").value = "";

          showProfileMessage(
            "email",
            "Correo electrónico actualizado correctamente",
            "success"
          );
        } else {
          showProfileMessage("email", data.error, "error");
        }
      })
      .catch((error) => {
        console.error("Error al actualizar correo electrónico:", error);
        showProfileMessage(
          "email",
          "Error al actualizar correo electrónico",
          "error"
        );
      });
  });

  // Actualizar contraseña
  savePasswordButton.addEventListener("click", function () {
    const currentPassword = document.getElementById("current-password").value;
    const newPassword = document.getElementById("new-password").value;
    const confirmPassword = document.getElementById("confirm-password").value;

    if (!currentPassword || !newPassword || !confirmPassword) {
      showProfileMessage(
        "password",
        "Por favor, completa todos los campos",
        "error"
      );
      return;
    }

    if (newPassword !== confirmPassword) {
      showProfileMessage(
        "password",
        "La nueva contraseña y la confirmación no coinciden",
        "error"
      );
      return;
    }

    fetch("/api/profile/password", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ currentPassword, newPassword, confirmPassword }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          // Limpiar campos
          document.getElementById("current-password").value = "";
          document.getElementById("new-password").value = "";
          document.getElementById("confirm-password").value = "";

          showProfileMessage(
            "password",
            "Contraseña actualizada correctamente",
            "success"
          );
        } else {
          showProfileMessage("password", data.error, "error");
        }
      })
      .catch((error) => {
        console.error("Error al actualizar contraseña:", error);
        showProfileMessage(
          "password",
          "Error al actualizar contraseña",
          "error"
        );
      });
  });

  // Botones de cancelar
  cancelUsernameButton.addEventListener("click", function () {
    document.getElementById("new-username").value = "";
    // Cerrar el modal de perfil
    profileModal.style.display = "none";
  });

  cancelEmailButton.addEventListener("click", function () {
    document.getElementById("current-email-input").value = "";
    document.getElementById("new-email").value = "";
    document.getElementById("confirm-email").value = "";
    // Cerrar el modal de perfil
    profileModal.style.display = "none";
  });

  cancelPasswordButton.addEventListener("click", function () {
    document.getElementById("current-password").value = "";
    document.getElementById("new-password").value = "";
    document.getElementById("confirm-password").value = "";
    // Cerrar el modal de perfil
    profileModal.style.display = "none";
  });

  // Theme toggle functionality
  themeToggle.addEventListener("change", function () {
    if (this.checked) {
      document.body.classList.add("dark-theme");
      localStorage.setItem("theme", "dark");
    } else {
      document.body.classList.remove("dark-theme");
      localStorage.setItem("theme", "light");
    }
  });

  // Check for saved theme preference
  const savedTheme = localStorage.getItem("theme");
  if (savedTheme === "dark") {
    document.body.classList.add("dark-theme");
    themeToggle.checked = true;
  }
  // Estado de la aplicación
  let currentDocumentId = null;

  // Toggle sidebar
  menuToggle.addEventListener("click", function () {
    sidebar.classList.toggle("open");
  });

  // Inicializar con la sidebar abierta
  sidebar.classList.add("open");

  // Drag and drop functionality
  ["dragenter", "dragover", "dragleave", "drop"].forEach((eventName) => {
    dropArea.addEventListener(eventName, preventDefaults, false);
  });

  function preventDefaults(e) {
    e.preventDefault();
    e.stopPropagation();
  }

  ["dragenter", "dragover"].forEach((eventName) => {
    dropArea.addEventListener(eventName, highlight, false);
  });

  ["dragleave", "drop"].forEach((eventName) => {
    dropArea.addEventListener(eventName, unhighlight, false);
  });

  function highlight() {
    dropArea.classList.add("highlight");
  }

  function unhighlight() {
    dropArea.classList.remove("highlight");
  }

  dropArea.addEventListener("drop", handleDrop, false);

  function handleDrop(e) {
    const dt = e.dataTransfer;
    const files = dt.files;
    handleFiles(files);
  }

  dropArea.addEventListener("click", () => {
    fileUpload.click();
  });

  fileUpload.addEventListener("change", () => {
    handleFiles(fileUpload.files);
  });

  function handleFiles(fileList) {
    if (fileList.length === 0) return;

    // Store current sidebar state before file upload
    const sidebarState = sidebar.classList.contains("open");

    for (let i = 0; i < fileList.length; i++) {
      uploadFile(fileList[i]);
    }

    // Ensure sidebar maintains its state after file upload
    if (sidebarState) {
      sidebar.classList.add("open");
    } else {
      sidebar.classList.remove("open");
    }
  }

  function uploadFile(file) {
    // Crear FormData para enviar el archivo
    const formData = new FormData();
    formData.append("document", file);
    formData.append("name", file.name);

    // Mostrar modal para añadir información adicional
    showFileModal(null, file.name);

    // Guardar referencia al archivo para subir después de completar el modal
    currentFile = file;
  }

  function submitFile(file, name, description, tags) {
    // Store sidebar state before submission
    const sidebarState = sidebar.classList.contains("open");

    const formData = new FormData();
    formData.append("document", file);
    formData.append("name", name);
    formData.append("description", description || "");
    formData.append("tags", tags || "");

    fetch("/upload", {
      method: "POST",
      body: formData,
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          // Save sidebar state in localStorage before reload
          localStorage.setItem("sidebarState", sidebarState);

          // Recargar la página para mostrar el nuevo documento
          window.location.reload();
        } else {
          alert("Error al subir el documento: " + data.error);
        }
      })
      .catch((error) => {
        console.error("Error:", error);
        alert("Error al subir el documento");
      });
  }

  // Manejar clics en las acciones de las tarjetas de archivos
  document.addEventListener("click", function (e) {
    // Abrir preview al hacer clic en la card (excepto si es un botón de acción o checkbox)
    const fileCard = e.target.closest(".file-card");
    if (
      fileCard &&
      !e.target.closest(".card-actions") &&
      !e.target.classList.contains("file-select-checkbox")
    ) {
      const documentId = fileCard.dataset.id;
      const fileName = fileCard.querySelector(".file-name").textContent.trim();
      showPreview(documentId, fileName);
      return; // Evita que otros handlers de click actúen
    }

    // Botón de vista previa
    if (e.target.closest(".preview-button")) {
      const fileCard = e.target.closest(".file-card");
      const documentId = fileCard.dataset.id;
      const fileName = fileCard.querySelector(".file-name").textContent.trim();
      showPreview(documentId, fileName);
    }

    // Función para configurar correctamente el botón de descarga
    if (e.target.closest(".star-button")) {
      const starButton = e.target.closest(".star-button");
      const fileCard = starButton.closest(".file-card");
      const documentId = fileCard.dataset.id;
      toggleStarred(documentId, starButton);
      e.stopPropagation(); // Prevent other click handlers from firing
    }

    // Botón de pantalla completa (antes era download-button)
    if (e.target.closest(".fullscreen-button")) {
      const fileCard = e.target.closest(".file-card");
      const documentId = fileCard.dataset.id;
      window.location.href = `/documents/${documentId}`;
    }

    // Botón de eliminación (mover a papelera)
    if (e.target.closest(".delete-button")) {
      e.stopPropagation();
      const fileCard = e.target.closest(".file-card");
      const documentId = fileCard.dataset.id;

      if (
        confirm(
          "¿Estás seguro de que deseas mover este documento a la papelera?"
        )
      ) {
        deleteDocument(documentId, fileCard);
      }
    }

    // Botón de restaurar desde papelera
    if (e.target.closest(".restore-button")) {
      const fileCard = e.target.closest(".file-card");
      const documentId = fileCard.dataset.id;
      if (confirm("¿Deseas restaurar este documento?")) {
        restoreFromTrash(documentId, fileCard);
      }
    }

    // Botón de eliminación permanente
    if (e.target.closest(".permanent-delete-button")) {
      const fileCard = e.target.closest(".file-card");
      const documentId = fileCard.dataset.id;
      if (
        confirm(
          "¿Estás seguro de que deseas eliminar permanentemente este documento? Esta acción no se puede deshacer."
        )
      ) {
        permanentDelete(documentId, fileCard);
      }
    }
  });

  // Update the moveToTrash function to actually delete the document
  // Update the moveToTrash function to handle starred documents
  function moveToTrash(documentId, cardElement) {
    fetch(`/documents/${documentId}`, {
      method: "DELETE",
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          // Add animation class
          cardElement.classList.add("deleting");

          // Remove the card after animation
          setTimeout(() => {
            cardElement.remove();

            // If we're in the starred section, we need to check if there are any documents left
            const currentSection = document.querySelector(
              ".section-item.active"
            );
            if (
              currentSection &&
              currentSection.querySelector("a").getAttribute("href") ===
                "/starred"
            ) {
              // Check if there are any documents left in the starred section
              if (filesGrid.querySelectorAll(".file-card").length <= 1) {
                // <= 1 because we're about to remove this card
                filesGrid.innerHTML = `
                                <div class="empty-state">
                                    <i class="fas fa-star"></i>
                                    <h3>No hay documentos destacados</h3>
                                    <p>Marca tus documentos como destacados para verlos aquí</p>
                                </div>
                                `;
              }
            } else if (filesGrid.querySelectorAll(".file-card").length <= 1) {
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
          alert("Error al mover el documento a la papelera: " + data.error);
        }
      })
      .catch((error) => {
        console.error("Error:", error);
        alert("Error al mover el documento a la papelera");
      });
  }

  function showFileModal(documentId, fileName) {
    currentDocumentId = documentId;

    // Limpiar el formulario
    document.getElementById("document-form").reset();
    document.getElementById("document-id").value = documentId || "";
    document.getElementById("input-file-name").value = fileName || "";

    // Si es un documento existente, cargar sus datos
    if (documentId) {
      fetch(`/documents/${documentId}`)
        .then((response) => {
          if (!response.ok) {
            throw new Error("Error al cargar la información del documento");
          }
          return response.json();
        })
        .then((data) => {
          document.getElementById("input-file-description").value =
            data.description || "";
          document.getElementById("input-file-tags").value = data.tags
            ? data.tags.join(", ")
            : "";
        })
        .catch((error) => {
          console.error("Error:", error);
        });
    }

    // Mostrar el modal
    fileModal.style.display = "block";
  }

  function showPreview(documentId, fileName) {
    currentDocumentId = documentId;
    document.getElementById("preview-file-name").value = fileName;

    const summaryContainer = document.getElementById("summary-container");
    summaryContainer.style.display = "block";

    // Determinar el icono basado en la extensión del archivo
    const fileIcon = document.getElementById("preview-file-icon");
    fileIcon.className = "fas";

    if (fileName.toLowerCase().endsWith(".pdf")) {
      fileIcon.classList.add("fa-file-pdf");
    } else if (/\.(jpe?g|png|gif|bmp)$/i.test(fileName)) {
      fileIcon.classList.add("fa-file-image");
    } else if (/\.(docx?|odt)$/i.test(fileName)) {
      fileIcon.classList.add("fa-file-word");
    } else if (/\.(xlsx?|ods)$/i.test(fileName)) {
      fileIcon.classList.add("fa-file-excel");
    } else {
      fileIcon.classList.add("fa-file");
    }

    // Mostrar barra de carga de etiquetas
    const tagsLoadingBar = document.getElementById("preview-tags-loading-bar");
    const tagsLoadingBarInner = tagsLoadingBar
      ? tagsLoadingBar.querySelector(".tags-loading-bar-inner")
      : null;
    if (tagsLoadingBar && tagsLoadingBarInner) {
      tagsLoadingBar.style.display = "block";
      tagsLoadingBarInner.style.width = "30%";
    }

    // Cargar los metadatos del documento primero
    fetch(`/documents/${documentId}`, {
      headers: {
        Accept: "application/json",
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Error al cargar los metadatos del documento");
        }
        // Simula progreso de carga
        if (tagsLoadingBarInner) tagsLoadingBarInner.style.width = "60%";
        return response.json();
      })
      .then((data) => {
        // Llenar los campos con los datos del documento
        document.getElementById("preview-description").value =
          data.description || "";
        document.getElementById("preview-tags").value = data.tags
          ? data.tags.join(", ")
          : "";
        if (data.summary) {
          document.getElementById("preview-summary").textContent = data.summary;
        }
        // Add star button to preview modal if needed
        // In the showPreview function where you handle the star button
        const previewStarButton = document.querySelector(
          ".preview-star-button"
        );
        if (previewStarButton) {
          if (data.isStarred) {
            previewStarButton.classList.add("starred");
            previewStarButton.querySelector("i").className = "fas fa-star";
          } else {
            previewStarButton.classList.remove("starred");
            previewStarButton.querySelector("i").className = "far fa-star";
          }
        }
        // Ahora manejar la vista previa según el tipo de archivo
        const previewIframe = document.getElementById("preview-iframe");
        const fileExtension = fileName.split(".").pop().toLowerCase();

        // Verificar si es un tipo de archivo que no se puede previsualizar directamente
        if (/^(docx?|xlsx?|pptx?|odt|ods|odp)$/i.test(fileExtension)) {
          // Para archivos de Office, mostrar un mensaje informativo en lugar de intentar cargarlos
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
                  background-color: #f9f9f9;
                  color: #333;
                  text-align: center;
                  padding: 20px;
                }
                .preview-container {
                  background-color: white;
                  border-radius: 8px;
                  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
                  padding: 40px;
                  max-width: 500px;
                  width: 100%;
                }
                .icon {
                  font-size: 80px;
                  margin-bottom: 30px;
                  color: ${
                    fileExtension.includes("doc")
                      ? "#4285F4"
                      : fileExtension.includes("xls")
                      ? "#0F9D58"
                      : fileExtension.includes("ppt")
                      ? "#DB4437"
                      : "#4285F4"
                  };
                }
                .file-name {
                  font-size: 24px;
                  font-weight: 500;
                  margin-bottom: 20px;
                  word-break: break-word;
                }
                .message {
                  max-width: 500px;
                  line-height: 1.6;
                  margin-bottom: 30px;
                  color: #555;
                }
                .button {
                  margin-top: 10px;
                  padding: 12px 24px;
                  background-color: #4285F4;
                  color: white;
                  border: none;
                  border-radius: 4px;
                  cursor: pointer;
                  text-decoration: none;
                  font-weight: 500;
                  transition: background-color 0.2s;
                  display: inline-block;
                }
                .button:hover {
                  background-color: #3367d6;
                }
              </style>
              <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
            </head>
            <body>
              <div class="preview-container">
                <div class="icon">
                  <i class="fas ${
                    fileExtension.includes("doc")
                      ? "fa-file-word"
                      : fileExtension.includes("xls")
                      ? "fa-file-excel"
                      : fileExtension.includes("ppt")
                      ? "fa-file-powerpoint"
                      : "fa-file"
                  }"></i>
                </div>
                <div class="file-name">${fileName}</div>
                <div class="message">
                  <p>Este tipo de archivo no puede ser visualizado directamente en el navegador.</p>
                  <p>Puedes descargar el archivo para verlo en su aplicación correspondiente.</p>
                </div>
                <a href="/documents/${documentId}" class="button" download="${fileName}">
                  <i class="fas fa-download" style="margin-right: 8px;"></i>Descargar archivo
                </a>
              </div>
            </body>
            </html>
          `;
        } else {
          // Para archivos que se pueden previsualizar (PDF, imágenes, etc.)
          fetch(`/documents/${documentId}`)
            .then((response) => {
              if (!response.ok) {
                throw new Error("Error al cargar el documento");
              }
              return response.blob();
            })
            .then((blob) => {
              previewIframe.src = URL.createObjectURL(blob);
            })
            .catch((error) => {
              console.error("Error:", error);
              previewIframe.srcdoc = `<div style="padding: 20px; color: red;">Error al cargar el documento: ${error.message}</div>`;
            });
        }
        // Mostrar badges de etiquetas en el modal de vista previa
        const badgeContainer = document.getElementById("preview-tag-list");
        if (badgeContainer && typeof renderTagBadges === "function") {
          let tags = (data.tags || []).map((t) => t.trim()).filter(Boolean);
          renderTagBadges(
            badgeContainer,
            tags,
            null,
            document.getElementById("preview-tags")
          );
          // Sincronizar el input de etiquetas con los badges
          document.getElementById("preview-tags").value = tags.join(", ");
          // Habilitar el input para añadir etiquetas
          let tagInput = badgeContainer.querySelector("#preview-tag-input");
          if (!tagInput) {
            tagInput = document.createElement("input");
            tagInput.type = "text";
            tagInput.className = "form-input tag-inline-input";
            tagInput.id = "preview-tag-input";
            tagInput.placeholder = "Añade etiqueta y presiona Enter";
            tagInput.autocomplete = "off";
            badgeContainer.appendChild(tagInput);
          }
          tagInput.style.display = "inline-block";
          tagInput.removeAttribute("hidden");
          tagInput.disabled = false;
          let localTags = tags.slice();
          // Configurar eventos solo una vez
          if (!tagInput.dataset.eventsSet) {
            function syncBadges() {
              badgeContainer
                .querySelectorAll(".tag-badge")
                .forEach((b) => b.remove());
              localTags.forEach((tag, idx) => {
                const badge = document.createElement("span");
                badge.className = "tag-badge";
                badge.textContent = tag;
                const remove = document.createElement("span");
                remove.className = "tag-remove";
                remove.textContent = "×";
                remove.title = "Eliminar etiqueta";
                remove.addEventListener("click", function (e) {
                  e.stopPropagation();
                  localTags.splice(idx, 1);
                  syncBadges();
                });
                badge.appendChild(remove);
                badgeContainer.insertBefore(badge, tagInput);
              });
              document.getElementById("preview-tags").value =
                localTags.join(", ");
            }
            tagInput.addEventListener("keydown", function (e) {
              if (e.key === "Enter" || e.key === "," || e.key === "Tab") {
                e.preventDefault();
                const value = tagInput.value.replace(/,/g, "");
                if (value && !localTags.includes(value)) {
                  localTags.push(value);
                  syncBadges();
                }
                tagInput.value = "";
              } else if (
                e.key === "Backspace" &&
                !tagInput.value &&
                localTags.length
              ) {
                localTags.pop();
                syncBadges();
              }
            });
            tagInput.addEventListener("paste", function (e) {
              e.preventDefault();
              const paste = (e.clipboardData || window.clipboardData).getData(
                "text"
              );
              paste.split(",").forEach((t) => {
                t = t.trim();
                if (t && !localTags.includes(t)) localTags.push(t);
              });
              syncBadges();
              tagInput.value = "";
            });
            // Al guardar, sincroniza el input oculto
            document
              .getElementById("save-preview-button")
              .addEventListener("click", function () {
                document.getElementById("preview-tags").value =
                  localTags.join(", ");
              });
            tagInput.dataset.eventsSet = "true";
            syncBadges();
          }

          // --- INICIO: Sugerencias de etiquetas en modal de preview ---
          // Obtiene todas las etiquetas únicas
          const allTags =
            typeof getAllUniqueTags === "function" ? getAllUniqueTags() : [];
          // Busca o crea el contenedor de sugerencias
          let suggestionContainer =
            tagInput.parentElement.querySelector(".tag-suggestions");
          if (!suggestionContainer) {
            suggestionContainer = document.createElement("div");
            suggestionContainer.className = "tag-suggestions";
            tagInput.parentElement.appendChild(suggestionContainer);
          }
          // Limpia eventos previos
          tagInput.removeEventListener("input", tagInput.suggestionHandler);
          document.removeEventListener("click", tagInput.documentClickHandler);

          // Handler para mostrar sugerencias
          tagInput.suggestionHandler = function () {
            const value = this.value.toLowerCase().trim();
            if (!value) {
              suggestionContainer.style.display = "none";
              return;
            }
            // Filtra etiquetas que no estén ya presentes
            const filteredTags = allTags.filter(
              (tag) =>
                tag.toLowerCase().includes(value) &&
                !localTags
                  .map((t) => t.toLowerCase())
                  .includes(tag.toLowerCase())
            );
            if (filteredTags.length > 0) {
              suggestionContainer.innerHTML = "";
              filteredTags.slice(0, 5).forEach((tag) => {
                const suggestion = document.createElement("div");
                suggestion.className = "tag-suggestion";
                suggestion.textContent = tag;
                suggestion.setAttribute("tabindex", "0");
                suggestion.addEventListener("click", function () {
                  if (!localTags.includes(tag)) {
                    localTags.push(tag);
                    syncBadges();
                  }
                  tagInput.value = "";
                  suggestionContainer.style.display = "none";
                  tagInput.focus();
                });
                suggestionContainer.appendChild(suggestion);
              });
              suggestionContainer.style.display = "block";
            } else {
              suggestionContainer.style.display = "none";
            }
          };
          tagInput.addEventListener("input", tagInput.suggestionHandler);

          // Cierra sugerencias al hacer click fuera
          tagInput.documentClickHandler = function (e) {
            if (
              !tagInput.contains(e.target) &&
              !suggestionContainer.contains(e.target)
            ) {
              suggestionContainer.style.display = "none";
            }
          };
          document.addEventListener("click", tagInput.documentClickHandler);

          // Navegación con teclado
          tagInput.addEventListener("keydown", function (e) {
            if (suggestionContainer.style.display === "none") return;
            const suggestions =
              suggestionContainer.querySelectorAll(".tag-suggestion");
            if (!suggestions.length) return;
            const focusedIndex = Array.from(suggestions).findIndex(
              (item) =>
                item === document.activeElement ||
                item.classList.contains("focused")
            );
            switch (e.key) {
              case "ArrowDown":
                e.preventDefault();
                let next = (focusedIndex + 1) % suggestions.length;
                suggestions.forEach((s) => s.classList.remove("focused"));
                suggestions[next].classList.add("focused");
                suggestions[next].focus();
                break;
              case "ArrowUp":
                e.preventDefault();
                let prev =
                  (focusedIndex - 1 + suggestions.length) % suggestions.length;
                suggestions.forEach((s) => s.classList.remove("focused"));
                suggestions[prev].classList.add("focused");
                suggestions[prev].focus();
                break;
              case "Enter":
                if (focusedIndex >= 0) {
                  e.preventDefault();
                  suggestions[focusedIndex].click();
                }
                break;
              case "Escape":
                suggestionContainer.style.display = "none";
                break;
            }
          });
          // --- FIN: Sugerencias de etiquetas en modal de preview ---
        }
        // Oculta barra de carga y completa animación
        if (tagsLoadingBar && tagsLoadingBarInner) {
          tagsLoadingBarInner.style.width = "100%";
          setTimeout(() => {
            tagsLoadingBar.style.display = "none";
            tagsLoadingBarInner.style.width = "0%";
          }, 400);
        }
      })
      .catch((error) => {
        // Oculta barra de carga en caso de error
        if (tagsLoadingBar) tagsLoadingBar.style.display = "none";
        console.error("Error:", error);
        alert("Error al cargar el documento: " + error.message);
      });

    // Configurar el botón de descarga
    const downloadButton = document.getElementById("download-preview-button");
    downloadButton.href = `/documents/${documentId}`;
    downloadButton.download = fileName;

    // Mostrar el modal
    previewModal.style.display = "block";
  }

  // Guardar cambios desde el modal de vista previa
  savePreviewButton.addEventListener("click", function () {
    if (!currentDocumentId) return;

    const name = document.getElementById("preview-file-name").value;
    const description = document.getElementById("preview-description").value;
    const tags = document.getElementById("preview-tags").value;

    if (!name) {
      alert("Por favor, ingresa un nombre para el documento");
      return;
    }

    // Actualizar documento
    fetch(`/documents/${currentDocumentId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name,
        description,
        tags,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        // Actualizar la tarjeta del documento en la interfaz
        const fileCard = document.querySelector(
          `.file-card[data-id="${currentDocumentId}"]`
        );
        if (fileCard) {
          fileCard.querySelector(".file-name").textContent = name;
          fileCard.dataset.tags = tags
            .split(",")
            .map((tag) => tag.trim())
            .join(",");
        }
        alert("Documento actualizado correctamente");
      })
      .catch((error) => {
        console.error("Error:", error);
        alert("Error al actualizar el documento");
      });
  });

  // Manejar el envío del formulario de documento
  saveButton.addEventListener("click", function () {
    const documentId = document.getElementById("document-id").value;
    const name = document.getElementById("input-file-name").value;
    const description = document.getElementById("input-file-description").value;
    const tags = document.getElementById("input-file-tags").value;

    if (!name) {
      alert("Por favor, ingresa un nombre para el documento");
      return;
    }

    if (documentId) {
      // Actualizar documento existente
      fetch(`/documents/${documentId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          description,
          tags,
        }),
      })
        .then((response) => response.json())
        .then((data) => {
          // Actualizar la tarjeta del documento
          const fileCard = document.querySelector(
            `.file-card[data-id="${documentId}"]`
          );
          if (fileCard) {
            fileCard.querySelector(".file-name").textContent = name;
          }
          closeFileModal();
        })
        .catch((error) => {
          console.error("Error:", error);
          alert("Error al actualizar el documento");
        });
    } else if (currentFile) {
      // Subir nuevo documento
      submitFile(currentFile, name, description, tags);
      closeFileModal();
      currentFile = null;
    }
  });

  function closeFileModal() {
    fileModal.style.display = "none";
    currentDocumentId = null;
  }

  function closePreviewModal() {
    previewModal.style.display = "none";
    document.getElementById("preview-iframe").src = "";
  }

  // Event listeners para cerrar modales
  closeModal.addEventListener("click", closeFileModal);
  cancelButton.addEventListener("click", closeFileModal);

  closePreview.addEventListener("click", closePreviewModal);
  closePreviewButton.addEventListener("click", closePreviewModal);

  // Búsqueda de documentos
  searchBox.addEventListener("input", function () {
    applyFiltersAndSearch();
  });

  // Función para aplicar filtros y búsqueda
  function applyFiltersAndSearch() {
    const searchTerm = searchBox.value.toLowerCase();
    const fileCards = document.querySelectorAll(".file-card");

    // Obtener valores de los filtros
    const sizeMin =
      parseInt(document.getElementById("size-min")?.value || 0) * 1024; // Convertir a bytes
    const sizeMax =
      parseInt(document.getElementById("size-max")?.value || 10240) * 1024; // Convertir a bytes
    const dateFrom = document.getElementById("date-from")?.value;
    const dateTo = document.getElementById("date-to")?.value;
    const selectedTags = Array.from(
      document.querySelectorAll(".tag-item.selected")
    ).map((tag) => tag.dataset.tag);

    let visibleCount = 0;

    fileCards.forEach((card) => {
      const fileName = card
        .querySelector(".file-name")
        .textContent.toLowerCase();
      const fileSize = parseInt(card.dataset.size || 0);
      const fileDate = card.dataset.date;
      const fileTags = (card.dataset.tags || "")
        .split(",")
        .map((tag) => tag.trim().toLowerCase());

      // Aplicar filtro de búsqueda
      const matchesSearch = !searchTerm || fileName.includes(searchTerm);

      // Aplicar filtro de tamaño
      const matchesSize =
        !sizeMin || !sizeMax || (fileSize >= sizeMin && fileSize <= sizeMax);

      // Aplicar filtro de fecha
      const matchesDate =
        (!dateFrom || fileDate >= dateFrom) && (!dateTo || fileDate <= dateTo);

      // Aplicar filtro de etiquetas
      const matchesTags =
        selectedTags.length === 0 ||
        selectedTags.some((tag) => fileTags.includes(tag.toLowerCase()));

      // Mostrar u ocultar la tarjeta según los filtros
      if (matchesSearch && matchesSize && matchesDate && matchesTags) {
        card.style.display = "";
        visibleCount++;
      } else {
        card.style.display = "none";
      }
    });

    // Mostrar mensaje si no hay resultados
    if (visibleCount === 0) {
      if (!document.querySelector(".no-results")) {
        const noResults = document.createElement("div");
        noResults.className = "empty-state no-results";
        noResults.innerHTML = `
            <i class="fas fa-search"></i>
            <h3>No se encontraron resultados</h3>
            <p>Intenta con otra búsqueda o ajusta los filtros</p>
          `;
        filesGrid.appendChild(noResults);
      }
    } else {
      const noResults = document.querySelector(".no-results");
      if (noResults) {
        noResults.remove();
      }
    }
  }

  // Cargar etiquetas disponibles
  function loadAvailableTags() {
    const tagsContainer = document.getElementById("tags-container");
    const allTags = new Set();

    // Recopilar todas las etiquetas de los documentos
    document.querySelectorAll(".file-card").forEach((card) => {
      const tags = (card.dataset.tags || "")
        .split(",")
        .filter((tag) => tag.trim());
      tags.forEach((tag) => allTags.add(tag.trim()));
    });

    // Limpiar el contenedor de etiquetas
    tagsContainer.innerHTML = "";

    // Crear elementos para cada etiqueta
    allTags.forEach((tag) => {
      const tagElement = document.createElement("div");
      tagElement.className = "tag-item";
      tagElement.dataset.tag = tag;
      tagElement.innerHTML = `<i class="fas fa-tag"></i>${tag}`;

      tagElement.addEventListener("click", function () {
        this.classList.toggle("selected");
        // No aplicar filtros automáticamente para permitir selección múltiple
      });

      tagsContainer.appendChild(tagElement);
    });
  }

  // Configurar eventos para el modal de filtros
  filterButton.addEventListener("click", function () {
    loadAvailableTags();
    filterModal.style.display = "block";
  });

  closeFilterModal.addEventListener("click", function () {
    filterModal.style.display = "none";
  });

  resetFiltersButton.addEventListener("click", function () {
    // Restablecer valores de los filtros
    document.getElementById("size-min").value = 0;
    document.getElementById("size-max").value = 10240;
    document.getElementById("date-from").value = "";
    document.getElementById("date-to").value = "";
    document.querySelectorAll(".tag-item.selected").forEach((tag) => {
      tag.classList.remove("selected");
    });

    // Actualizar visualización de valores
    document.getElementById("size-min-value").textContent = "0 KB";
    document.getElementById("size-max-value").textContent = "10 MB";
    applyFiltersAndSearch();
  });

  applyFiltersButton.addEventListener("click", function () {
    applyFiltersAndSearch();
  });

  // Configurar sliders de tamaño
  const sizeMin = document.getElementById("size-min");
  const sizeMax = document.getElementById("size-max");
  const sizeMinValue = document.getElementById("size-min-value");
  const sizeMaxValue = document.getElementById("size-max-value");

  sizeMin.addEventListener("input", function () {
    const value = parseInt(this.value);
    sizeMinValue.textContent =
      value < 1024 ? `${value} KB` : `${(value / 1024).toFixed(1)} MB`;

    // Asegurar que min no sea mayor que max
    if (value > parseInt(sizeMax.value)) {
      sizeMax.value = value;
      sizeMaxValue.textContent =
        value < 1024 ? `${value} KB` : `${(value / 1024).toFixed(1)} MB`;
    }
  });

  sizeMax.addEventListener("input", function () {
    const value = parseInt(this.value);
    sizeMaxValue.textContent =
      value < 1024 ? `${value} KB` : `${(value / 1024).toFixed(1)} MB`;

    // Asegurar que max no sea menor que min
    if (value < parseInt(sizeMin.value)) {
      sizeMin.value = value;
      sizeMinValue.textContent =
        value < 1024 ? `${value} KB` : `${(value / 1024).toFixed(1)} MB`;
    }
  });

  // Cerrar sesión
  logoutButton.addEventListener("click", function () {
    if (confirm("¿Estás seguro de que deseas cerrar sesión?")) {
      window.location.href = "/logout";
    }
  });

  // Variable para almacenar el archivo actual
  let currentFile = null;
  // In the toggleStarred function
  function toggleStarred(documentId, buttonElement) {
    fetch(`/documents/${documentId}/star`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Error al actualizar estado destacado");
        }
        return response.json();
      })
      .then((data) => {
        if (data.success) {
          // Update the star icon
          const starIcon = buttonElement.querySelector("i");
          buttonElement.classList.add("animate");

          // After animation completes, update the icon
          setTimeout(() => {
            if (data.isStarred) {
              starIcon.className = "fas fa-star"; // Use solid star for starred
              buttonElement.setAttribute("data-starred", "true");
              buttonElement.setAttribute("title", "Quitar de destacados");
            } else {
              starIcon.className = "far fa-star"; // Use regular star for not starred
              buttonElement.setAttribute("data-starred", "false");
              buttonElement.setAttribute("title", "Destacar");
            }
            buttonElement.classList.remove("animate");
          }, 300);
        }
      })
      .catch((error) => {
        console.error("Error:", error);
        alert("Error al actualizar estado destacado");
      });
  }

  // --- BADGES/ETIQUETAS INTUITIVAS ---
  // Utilidad para crear badges de etiquetas
  function renderTagBadges(container, tags, input, hiddenInput) {
    container.innerHTML = "";
    tags.forEach((tag, idx) => {
      const badge = document.createElement("span");
      badge.className = "tag-badge";
      badge.textContent = tag;
      const remove = document.createElement("span");
      remove.className = "tag-remove";
      remove.textContent = "×";
      remove.title = "Eliminar etiqueta";
      remove.addEventListener("click", function (e) {
        e.stopPropagation();
        tags.splice(idx, 1);
        renderTagBadges(container, tags, input, hiddenInput);
      });
      badge.appendChild(remove);
      container.appendChild(badge);
    });
    if (hiddenInput) hiddenInput.value = tags.join(", ");
  }

  // Inicializa el sistema de badges para el modal de documento
  (function setupTagBadgesForModal() {
    const tagInput = document.getElementById("tag-input");
    const tagList = document.getElementById("tag-list");
    const hiddenTagsInput = document.getElementById("input-file-tags");
    let tags = [];

    // Sincroniza el input oculto con los badges
    function syncBadges() {
      renderTagBadges(tagList, tags, tagInput, hiddenTagsInput);
    }

    // Añade etiqueta si es válida
    function addTag(tag) {
      tag = tag.trim();
      if (tag && !tags.includes(tag)) {
        tags.push(tag);
        syncBadges();
      }
    }

    // Maneja el input para añadir etiquetas
    tagInput.addEventListener("keydown", function (e) {
      if (e.key === "Enter" || e.key === "," || e.key === "Tab") {
        e.preventDefault();
        const value = tagInput.value.replace(/,/g, "");
        addTag(value);
        tagInput.value = "";
      } else if (e.key === "Backspace" && !tagInput.value && tags.length) {
        tags.pop();
        syncBadges();
      }
    });

    // Permite pegar varias etiquetas separadas por coma
    tagInput.addEventListener("paste", function (e) {
      e.preventDefault();
      const paste = (e.clipboardData || window.clipboardData).getData("text");
      paste.split(",").forEach((t) => addTag(t));
      tagInput.value = "";
    });

    // Sincroniza badges al abrir el modal (para editar)
    document.getElementById("file-modal").addEventListener("show", function () {
      tags = (hiddenTagsInput.value || "")
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean);
      syncBadges();
    });

    // Al guardar, sincroniza el input oculto
    document
      .getElementById("save-button")
      .addEventListener("click", function () {
        hiddenTagsInput.value = tags.join(", ");
      });

    // Inicializa badges al cargar
    syncBadges();
  })();

  // Sistema de badges para el modal de previsualización (input siempre visible y editable)
  (function setupTagBadgesForPreview() {
    const previewTagsInput = document.getElementById("preview-tags");
    const badgeContainer = document.getElementById("preview-tag-list");
    let tagInput = badgeContainer.querySelector("#preview-tag-input");
    if (!previewTagsInput || !badgeContainer) return;
    // Si el input no existe, lo creamos (por si el HTML no lo tiene)
    if (!tagInput) {
      tagInput = document.createElement("input");
      tagInput.type = "text";
      tagInput.className = "form-input tag-inline-input";
      tagInput.id = "preview-tag-input";
      tagInput.placeholder = "Añade etiqueta y presiona Enter";
      tagInput.autocomplete = "off";
      badgeContainer.appendChild(tagInput);
    }
    let tags = [];

    function addTag(tag) {
      tag = tag.trim();
      if (tag && !tags.includes(tag)) {
        tags.push(tag);
        syncBadges();
      }
    }

    function syncBadges() {
      badgeContainer.querySelectorAll(".tag-badge").forEach((b) => b.remove());
      tags.forEach((tag, idx) => {
        const badge = document.createElement("span");
        badge.className = "tag-badge";
        badge.textContent = tag;
        const remove = document.createElement("span");
        remove.className = "tag-remove";
        remove.textContent = "×";
        remove.title = "Eliminar etiqueta";
        remove.addEventListener("click", function (e) {
          e.stopPropagation();
          tags.splice(idx, 1);
          syncBadges();
        });
        badge.appendChild(remove);
        badgeContainer.insertBefore(badge, tagInput);
      });
      previewTagsInput.value = tags.join(", ");
    }

    tagInput.addEventListener("keydown", function (e) {
      if (e.key === "Enter" || e.key === "," || e.key === "Tab") {
        e.preventDefault();
        const value = tagInput.value.replace(/,/g, "");
        addTag(value);
        tagInput.value = "";
      } else if (e.key === "Backspace" && !tagInput.value && tags.length) {
        tags.pop();
        syncBadges();
      }
    });

    tagInput.addEventListener("paste", function (e) {
      e.preventDefault();
      const paste = (e.clipboardData || window.clipboardData).getData("text");
      paste.split(",").forEach((t) => addTag(t));
      tagInput.value = "";
    });

    function showPreviewTags() {
      tags = (previewTagsInput.value || "")
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean);
      syncBadges();
    }

    // Hook en showPreview para actualizar badges al abrir el modal
    const origShowPreview = window.showPreview;
    window.showPreview = function () {
      if (typeof origShowPreview === "function")
        origShowPreview.apply(this, arguments);
      showPreviewTags();
      tagInput.style.display = "inline-block";
      tagInput.removeAttribute("hidden");
      tagInput.disabled = false;
    };

    document
      .getElementById("save-preview-button")
      .addEventListener("click", function () {
        previewTagsInput.value = tags.join(", ");
      });

    // Inicializa badges al cargar
    syncBadges();
    tagInput.style.display = "inline-block";
    tagInput.removeAttribute("hidden");
    tagInput.disabled = false;
  })();

  // --- FIN BADGES/ETIQUETAS INTUITIVAS ---

  const downloadSelectedButton = document.getElementById(
    "download-selected-button"
  );
  const fileCheckboxes = document.querySelectorAll(".file-select-checkbox");

  // Actualizar el estado del botón de descarga
  function updateDownloadButtonState() {
    const selectedFiles = document.querySelectorAll(
      ".file-select-checkbox:checked"
    );
    downloadSelectedButton.style.display =
      selectedFiles.length > 0 ? "inline-block" : "none";
  }

  // Manejar la selección de archivos
  fileCheckboxes.forEach((checkbox) => {
    checkbox.addEventListener("change", updateDownloadButtonState);
  });

  // Descargar archivos seleccionados como ZIP
  downloadSelectedButton.addEventListener("click", async function () {
    const selectedFiles = document.querySelectorAll(
      ".file-select-checkbox:checked"
    );
    if (selectedFiles.length === 0) return;

    const zip = new JSZip();
    const promises = [];

    selectedFiles.forEach((checkbox) => {
      const fileCard = checkbox.closest(".file-card");
      const documentId = fileCard.dataset.id;
      let fileName = fileCard.querySelector(".file-name").textContent.trim();

      // Agregar extensión .pdf si no está presente
      if (!fileName.toLowerCase().endsWith(".pdf")) {
        fileName += ".pdf";
      }

      // Descargar cada archivo y añadirlo al ZIP
      const promise = fetch(`/documents/${documentId}`)
        .then((response) => response.blob())
        .then((blob) => {
          zip.file(fileName, blob);
        });
      promises.push(promise);
    });

    // Esperar a que todos los archivos se descarguen
    await Promise.all(promises);

    // Generar el archivo ZIP y descargarlo
    zip.generateAsync({ type: "blob" }).then((content) => {
      const a = document.createElement("a");
      a.href = URL.createObjectURL(content);
      a.download = "Archivos.zip";
      a.click();
      window.location.reload();
    });
  });

  // Update the state of the download button when checkboxes are toggled
  function updateDownloadButtonState() {
    const selectedFiles = document.querySelectorAll(
      ".file-select-checkbox:checked"
    );
    downloadSelectedButton.style.display =
      selectedFiles.length > 0 ? "inline-block" : "none";
  }

  // Attach event listeners to file checkboxes
  document.addEventListener("change", function (e) {
    if (e.target.classList.contains("file-select-checkbox")) {
      updateDownloadButtonState();
    }
  });

  // Handle multiple file downloads as a ZIP
  downloadSelectedButton.addEventListener("click", async function () {
    const selectedFiles = document.querySelectorAll(
      ".file-select-checkbox:checked"
    );
    if (selectedFiles.length === 0) return;

    const zip = new JSZip();
    const promises = [];

    selectedFiles.forEach((checkbox) => {
      const fileCard = checkbox.closest(".file-card");
      const documentId = fileCard.dataset.id;
      let fileName = fileCard.querySelector(".file-name").textContent.trim();

      // Ensure file has an extension
      if (!fileName.includes(".")) {
        fileName += ".file";
      }

      // Fetch each file and add it to the ZIP
      const promise = fetch(`/documents/${documentId}`)
        .then((response) => {
          if (!response.ok) {
            throw new Error(`Failed to fetch document: ${fileName}`);
          }
          return response.blob();
        })
        .then((blob) => {
          zip.file(fileName, blob);
        })
        .catch((error) => {
          console.error("Error fetching file:", error);
        });

      promises.push(promise);
    });

    // Wait for all files to be added to the ZIP
    await Promise.all(promises);

    // Generate and download the ZIP file
    zip.generateAsync({ type: "blob" }).then((content) => {
      const a = document.createElement("a");
      a.href = URL.createObjectURL(content);
      a.download = "Archivos.zip";
      a.click();
    });
  });

  // Initialize the state of the download button on page load
  document.addEventListener("DOMContentLoaded", function () {
    updateDownloadButtonState();
  });
});
document.addEventListener("DOMContentLoaded", function () {
  const themeToggleContainer = document.querySelector(
    ".theme-toggle-container"
  );

  themeToggleContainer.addEventListener("click", function (e) {
    const sidebar = document.getElementById("sidebar");

    // Only handle click if sidebar is collapsed
    if (!sidebar.classList.contains("open")) {
      const themeToggle = document.getElementById("theme-toggle");

      // Toggle the checkbox state
      themeToggle.checked = !themeToggle.checked;

      // Trigger the change event to apply theme
      const changeEvent = new Event("change");
      themeToggle.dispatchEvent(changeEvent);

      // Prevent event from reaching the checkbox directly
      e.preventDefault();
    }
  });
});

// Update the restore function to handle the case when a document is restored
function restoreFromTrash(documentId, cardElement) {
  // Get filesGrid here to ensure it's available in this context
  const filesGrid = document.getElementById("files-grid");

  fetch(`/documents/${documentId}/restore`, {
    method: "PUT",
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.success) {
        // Add animation class
        cardElement.classList.add("restoring");

        // Remove the card after animation
        setTimeout(() => {
          cardElement.remove();

          // If no more documents in trash, show empty state
          if (filesGrid.querySelectorAll(".file-card").length <= 1) {
            // <= 1 because we're about to remove this card
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
        alert("Error al restaurar el documento: " + data.error);
      }
    })
    .catch((error) => {
      console.error("Error:", error);
      alert("Error al restaurar el documento");
    });
}

// Function to permanently delete a document
function permanentDelete(documentId, cardElement) {
  // Get filesGrid here to ensure it's available in this context
  const filesGrid = document.getElementById("files-grid");

  fetch(`/documents/${documentId}/permanent`, {
    method: "DELETE",
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.success) {
        // Add animation class
        cardElement.classList.add("deleting");

        // Remove the card after animation
        setTimeout(() => {
          cardElement.remove();

          // If no more documents, show empty state
          if (filesGrid.querySelectorAll(".file-card").length <= 1) {
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
        alert("Error al eliminar permanentemente el documento: " + data.error);
      }
    })
    .catch((error) => {
      console.error("Error:", error);
      alert("Error al eliminar permanentemente el documento");
    });
}

// Empty trash button functionality
const emptyTrashButton = document.getElementById("empty-trash-button");
if (emptyTrashButton) {
  emptyTrashButton.addEventListener("click", function () {
    if (
      confirm(
        "¿Estás seguro de que deseas vaciar la papelera? Esta acción eliminará permanentemente todos los documentos en la papelera."
      )
    ) {
      emptyTrash();
    }
  });
}
// Function to empty the trash
function emptyTrash() {
  // Get filesGrid here to ensure it's available in this context
  const filesGrid = document.getElementById("files-grid");

  fetch("/trash", {
    method: "DELETE",
  })
    .then((response) => response.json())
    .then((data) => {
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
          emptyTrashButton.style.display = "none";
        }
      } else {
        alert("Error al vaciar la papelera: " + data.error);
      }
    })
    .catch((error) => {
      console.error("Error:", error);
      alert("Error al vaciar la papelera");
    });
}
function deleteDocument(documentId, fileCard) {
  // Añadir clase de animación para la eliminación
  fileCard.classList.add("deleting");

  fetch(`/documents/${documentId}`, {
    method: "DELETE",
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.success) {
        // Esperar a que termine la animación antes de eliminar el elemento
        setTimeout(() => {
          fileCard.remove();

          // Verificar si quedan documentos y mostrar el estado vacío si es necesario
          const remainingCards = document.querySelectorAll(".file-card");
          if (remainingCards.length === 0) {
            const filesGrid = document.getElementById("files-grid");
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
        fileCard.classList.remove("deleting");
        alert("Error al eliminar el documento: " + data.error);
      }
    })
    .catch((error) => {
      console.error("Error:", error);
      // Revertir la animación si hay error
      fileCard.classList.remove("deleting");
      alert("Error al eliminar el documento");
    });
}

// Add tag suggestion functionality after your existing code
document.addEventListener("DOMContentLoaded", function () {
  // Initialize tag suggestions on page load
  initializeTagSuggestions();

  // --- NUEVO: Inicializar sugerencias en el modal de preview cada vez que se abre ---
  // Hook para re-inicializar sugerencias cuando se muestra el modal de preview
  const previewModal = document.getElementById("preview-modal");
  const previewTagInput = document.getElementById("preview-tag-input");
  if (previewModal && previewTagInput) {
    // Cuando se abre el modal de preview, vuelve a inicializar sugerencias
    const observer = new MutationObserver(() => {
      if (previewModal.style.display === "block") {
        // Recolecta todas las etiquetas únicas actuales
        const allTags = getAllUniqueTags();
        setupTagSuggestions("preview-tag-input", "preview-tag-list", allTags);
      }
    });
    observer.observe(previewModal, {
      attributes: true,
      attributeFilter: ["style"],
    });
  }
  // --- FIN NUEVO ---
});

// Function to initialize tag suggestions
function initializeTagSuggestions() {
  // Get all unique tags from documents
  const allTags = getAllUniqueTags();

  // Initialize suggestions for document upload modal
  setupTagSuggestions("tag-input", "tag-list", allTags);

  // Initialize suggestions for preview modal
  setupTagSuggestions("preview-tag-input", "preview-tag-list", allTags);
}

// Function to get all unique tags from ALL sources in the app (not solo file cards)
function getAllUniqueTags() {
  const uniqueTags = new Set();

  // 1. Tags from file cards (main source)
  document.querySelectorAll(".file-card").forEach((card) => {
    const tagString = card.dataset.tags;
    if (tagString) {
      tagString.split(",").forEach((tag) => {
        if (tag.trim()) uniqueTags.add(tag.trim());
      });
    }
  });

  // 2. Tags from tag badges in modals (upload/edit modal)
  document.querySelectorAll("#tag-list .tag-badge").forEach((badge) => {
    const tag = badge.textContent.replace("×", "").trim();
    if (tag) uniqueTags.add(tag);
  });

  // 3. Tags from tag badges in preview modal
  document.querySelectorAll("#preview-tag-list .tag-badge").forEach((badge) => {
    const tag = badge.textContent.replace("×", "").trim();
    if (tag) uniqueTags.add(tag);
  });

  // 4. Tags from hidden inputs (in case not rendered as badges yet)
  const tagInputs = [
    document.getElementById("input-file-tags"),
    document.getElementById("preview-tags"),
  ];
  tagInputs.forEach((input) => {
    if (input && input.value) {
      input.value.split(",").forEach((tag) => {
        if (tag.trim()) uniqueTags.add(tag.trim());
      });
    }
  });

  return Array.from(uniqueTags).sort();
}

// Function to setup tag suggestions for a specific input
function setupTagSuggestions(inputId, listId, allTags) {
  const tagInput = document.getElementById(inputId);
  // Cambia la forma de obtener el contenedor de sugerencias para el preview modal
  let suggestionContainer = null;
  if (tagInput) {
    // Busca el .tag-suggestions dentro del mismo contenedor padre
    suggestionContainer =
      tagInput.parentElement.querySelector(".tag-suggestions");
    // Si no existe (por ejemplo, en el preview modal), créalo dinámicamente
    if (!suggestionContainer) {
      suggestionContainer = document.createElement("div");
      suggestionContainer.className = "tag-suggestions";
      tagInput.parentElement.appendChild(suggestionContainer);
    }
  }

  if (!tagInput || !suggestionContainer) return;

  // Clear any existing event listeners (to prevent duplicates)
  tagInput.removeEventListener("input", tagInput.suggestionHandler);
  document.removeEventListener("click", tagInput.documentClickHandler);

  // Handler for input events
  tagInput.suggestionHandler = function () {
    const value = this.value.toLowerCase().trim();

    // Hide suggestions if empty
    if (!value) {
      suggestionContainer.style.display = "none";
      return;
    }

    // Filter tags based on input
    const filteredTags = allTags.filter(
      (tag) =>
        tag.toLowerCase().includes(value) &&
        !getExistingTags(listId).includes(tag.toLowerCase())
    );

    // Show or hide suggestions based on matches
    if (filteredTags.length > 0) {
      showSuggestions(suggestionContainer, filteredTags, this, listId);
    } else {
      suggestionContainer.style.display = "none";
    }
  };

  // Document click handler to close suggestions
  tagInput.documentClickHandler = function (e) {
    if (
      !tagInput.contains(e.target) &&
      !suggestionContainer.contains(e.target)
    ) {
      suggestionContainer.style.display = "none";
    }
  };

  // Add event listeners
  tagInput.addEventListener("input", tagInput.suggestionHandler);
  document.addEventListener("click", tagInput.documentClickHandler);

  // Handle keyboard navigation
  tagInput.addEventListener("keydown", function (e) {
    // Skip if suggestions are hidden
    if (suggestionContainer.style.display === "none") return;

    const suggestions = suggestionContainer.querySelectorAll(".tag-suggestion");
    if (!suggestions.length) return;

    // Find currently focused item
    const focusedIndex = Array.from(suggestions).findIndex(
      (item) =>
        item === document.activeElement || item.classList.contains("focused")
    );

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        navigateSuggestion(suggestions, focusedIndex, 1);
        break;
      case "ArrowUp":
        e.preventDefault();
        navigateSuggestion(suggestions, focusedIndex, -1);
        break;
      case "Enter":
        // If a suggestion is focused, select it
        if (focusedIndex >= 0) {
          e.preventDefault();
          selectSuggestion(suggestions[focusedIndex], tagInput, listId);
        }
        break;
      case "Escape":
        e.preventDefault();
        suggestionContainer.style.display = "none";
        break;
    }
  });
}

// Helper function to get existing tags in a list
function getExistingTags(listId) {
  const tagList = document.getElementById(listId);
  const existingTags = [];

  if (tagList) {
    tagList.querySelectorAll(".tag-badge").forEach((badge) => {
      existingTags.push(
        badge.textContent.replace("×", "").trim().toLowerCase()
      );
    });
  }

  return existingTags;
}

// Function to show tag suggestions
function showSuggestions(container, tags, inputElement, listId) {
  // Clear previous suggestions
  container.innerHTML = "";

  // Create suggestion elements
  tags.slice(0, 5).forEach((tag) => {
    const suggestion = document.createElement("div");
    suggestion.className = "tag-suggestion";
    suggestion.textContent = tag;
    suggestion.setAttribute("tabindex", "0");

    suggestion.addEventListener("click", function () {
      selectSuggestion(this, inputElement, listId);
    });

    container.appendChild(suggestion);
  });

  // Position and show container
  container.style.display = "block";
}

// Function to navigate between suggestions with keyboard
function navigateSuggestion(suggestions, currentIndex, direction) {
  // Remove focus from current item
  if (currentIndex >= 0 && currentIndex < suggestions.length) {
    suggestions[currentIndex].classList.remove("focused");
  }

  // Calculate new index
  let newIndex = currentIndex + direction;
  if (newIndex < 0) newIndex = suggestions.length - 1;
  if (newIndex >= suggestions.length) newIndex = 0;

  // Focus new item
  suggestions[newIndex].classList.add("focused");
  suggestions[newIndex].focus();
}

// Function to select a tag suggestion
function selectSuggestion(suggestionElement, inputElement, listId) {
  // Get the tag value
  const tagValue = suggestionElement.textContent.trim();

  // Find input container and trigger tag addition
  const tagList = document.getElementById(listId);
  const parent = inputElement.parentElement;

  // Different handling for preview and modal
  if (listId === "preview-tag-list") {
    // Get current tags
    const currentTags = getExistingTags(listId);
    currentTags.push(tagValue);

    // Update preview-tags field
    document.getElementById("preview-tags").value = currentTags.join(", ");

    // Trigger tag update
    const tagBadges = tagList.querySelectorAll(".tag-badge");
    if (tagBadges.length > 0) {
      // Need to trigger update through manually adding
      inputElement.value = tagValue;
      const keyEvent = new KeyboardEvent("keydown", { key: "Enter" });
      inputElement.dispatchEvent(keyEvent);
    } else {
      // Manually add the tag
      const event = new Event("input");
      document.getElementById("preview-tags").dispatchEvent(event);
    }
  } else {
    // For regular upload modal
    inputElement.value = tagValue;
    const keyEvent = new KeyboardEvent("keydown", { key: "Enter" });
    inputElement.dispatchEvent(keyEvent);
  }

  // Clear input and hide suggestions
  inputElement.value = "";
  parent.querySelector(".tag-suggestions").style.display = "none";
  inputElement.focus();
}

// Cerrar modales al hacer clic fuera de su contenido
function setupModalCloseOnOutsideClick(modalId) {
  const modal = document.getElementById(modalId);
  if (!modal) return;
  modal.addEventListener("mousedown", function (e) {
    // Solo cerrar si el click es directamente sobre el fondo del modal
    if (e.target === modal) {
      modal.style.display = "none";
      // Limpia el iframe si es el de preview
      if (modalId === "preview-modal") {
        const iframe = document.getElementById("preview-iframe");
        if (iframe) iframe.src = "";
      }
    }
  });
}

setupModalCloseOnOutsideClick("preview-modal");
setupModalCloseOnOutsideClick("filter-modal");
setupModalCloseOnOutsideClick("profile-modal");
