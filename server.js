/**
 * =============================================================================
 * APLICACIÓN DE GESTIÓN DE DOCUMENTOS
 * =============================================================================
 * Servidor Express que proporciona una API para gestionar documentos,
 * con autenticación de usuarios y almacenamiento en MongoDB.
 */

// =============================================================================
// IMPORTACIÓN DE DEPENDENCIAS
// =============================================================================
const express = require("express");
const mongoose = require("mongoose");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const path = require("path");
const dotenv = require("dotenv");
const bcrypt = require("bcryptjs");
const multer = require("multer");
const fs = require("fs");

// =============================================================================
// CONFIGURACIÓN INICIAL
// =============================================================================

// Cargar variables de entorno desde archivo .env
dotenv.config();

// Inicializar aplicación Express
const app = express();
const PORT = process.env.PORT || 3000;

// =============================================================================
// CONFIGURACIÓN DE MIDDLEWARE
// =============================================================================

// Parseo de JSON y datos de formularios
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Servir archivos estáticos desde la carpeta 'public'
app.use(express.static(path.join(__dirname, "public")));

// Configurar EJS como motor de plantillas
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// =============================================================================
// CONFIGURACIÓN DE ALMACENAMIENTO DE ARCHIVOS
// =============================================================================

// Crear directorio para almacenar archivos subidos si no existe
const uploadsDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configurar multer para gestionar la subida de archivos
const storage = multer.diskStorage({
  // Definir carpeta de destino
  destination: function (req, file, cb) {
    cb(null, uploadsDir);
  },
  // Generar nombre de archivo único
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + "-" + uniqueSuffix + ext);
  },
});

const upload = multer({ storage: storage });

// =============================================================================
// CONFIGURACIÓN DE SESIONES
// =============================================================================

app.use(
  session({
    // Clave secreta para firmar la cookie de sesión
    secret: process.env.SESSION_SECRET || "secret_muy_seguro",
    // Evitar guardar sesión si no se modificó
    resave: false,
    // No guardar sesión vacía
    saveUninitialized: false,
    // Almacenar sesiones en MongoDB
    store: MongoStore.create({
      mongoUrl:
        process.env.MONGODB_URI || "mongodb://localhost:27017/documentos-app",
      ttl: 14 * 24 * 60 * 60, // 14 días de tiempo de vida
    }),
    // Configuración de cookie
    cookie: {
      maxAge: 14 * 24 * 60 * 60 * 1000, // 14 días en milisegundos
    },
  })
);

// =============================================================================
// MIDDLEWARE DE AUTENTICACIÓN
// =============================================================================

/**
 * Middleware para verificar si el usuario está autenticado
 * Redirige a la página de login si no hay sesión activa
 */
const requireLogin = (req, res, next) => {
  if (req.session && req.session.userId) {
    return next();
  } else {
    return res.redirect("/login");
  }
};

// =============================================================================
// CONEXIÓN A BASE DE DATOS
// =============================================================================

mongoose
  .connect(
    process.env.MONGODB_URI || "mongodb://localhost:27017/documentos-app"
  )
  .then(() => console.log("Conectado a MongoDB"))
  .catch((err) => console.error("Error conectando a MongoDB:", err));

// =============================================================================
// DEFINICIÓN DE ESQUEMAS Y MODELOS
// =============================================================================

/**
 * Esquema de Usuario
 * Almacena información de autenticación y perfil del usuario
 */
const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  createdAt: { type: Date, default: Date.now },
});

/**
 * Esquema de Documento
 * Almacena metadatos de los archivos subidos por los usuarios
 */
const documentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  originalName: { type: String, required: true },
  description: { type: String },
  filePath: { type: String, required: true },
  fileType: { type: String },
  fileSize: { type: Number },
  uploadDate: { type: Date, default: Date.now },
  tags: [String],
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  isStarred: { type: Boolean, default: false },
  isDeleted: { type: Boolean, default: false }, // Indica si está en papelera
  deletedAt: { type: Date }, // Fecha de eliminación
<<<<<<< HEAD
  summary: { type: String }, // Añade este campo para el resumen
=======
>>>>>>> Back/main
});

// Crear modelos a partir de los esquemas
const User = mongoose.model("User", userSchema);
const Document = mongoose.model("Document", documentSchema);

// =============================================================================
// UTILIDADES
// =============================================================================

/**
 * Función para formatear el tamaño de archivo en unidades legibles
 * @param {Number} bytes - Tamaño en bytes
 * @returns {String} Tamaño formateado con unidad (KB, MB, etc.)
 */
const formatFileSize = (bytes) => {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
};

// =============================================================================
// RUTAS DE NAVEGACIÓN PRINCIPAL
// =============================================================================

/**
 * Ruta principal - Redirige según estado de autenticación
 * Si el usuario está autenticado, va al dashboard
 * Si no está autenticado, va a la página de login
 */
app.get("/", (req, res) => {
  if (req.session && req.session.userId) {
    res.redirect("/dashboard");
  } else {
    res.redirect("/login");
  }
});

<<<<<<< HEAD
// Añade al inicio con las otras dependencias
const axios = require("axios");
const pdf = require("pdf-parse");

// =============================================================================
// CONFIGURACIÓN DE LA API DE RESUMEN
// =============================================================================
const MAGIC_LOOPS_API_URL =
  "https://magicloops.dev/api/loop/3ab3f2fc-d4fc-4d72-a4f8-5965b361975d/run";

// Función para resumir texto usando la API
async function summarizeText(text) {
  try {
    console.log("Texto a resumir:", text); // Esto aparecerá en los logs del servidor
    const response = await axios.post(MAGIC_LOOPS_API_URL, {
      text: text,
    });

    return response.data.summary || "No se pudo generar el resumen";
  } catch (error) {
    console.error("Error al llamar a la API de resumen:", error);
    return "Error al generar el resumen";
  }
}

// Función para extraer texto de un PDF
async function extractTextFromPdf(filePath) {
  try {
    const dataBuffer = fs.readFileSync(filePath);
    const data = await pdf(dataBuffer);
    return data.text;
  } catch (error) {
    console.error("Error al extraer texto del PDF:", error);
    return "";
  }
}

=======
>>>>>>> Back/main
// =============================================================================
// RUTAS DE AUTENTICACIÓN
// =============================================================================

/**
 * Mostrar página de inicio de sesión
 */
app.get("/login", (req, res) => {
  res.render("login", { error: null });
});

/**
 * Procesar solicitud de inicio de sesión
 * Verifica credenciales y establece sesión si son correctas
 */
app.get("/login", (req, res) => {
  // Solo pasamos el error cuando se haya intentado hacer login
  res.render("login");
});

app.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    // Buscar usuario por nombre de usuario
    const user = await User.findOne({ username });

    if (!user) {
      return res.render("login", { error: "Usuario o contraseña incorrectos" });
    }

    // Verificar que la contraseña coincida
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.render("login", { error: "Usuario o contraseña incorrectos" });
    }

    // Establecer datos de sesión
    req.session.userId = user._id;
    req.session.username = user.username;

    res.redirect("/dashboard");
  } catch (error) {
    console.error("Error en login:", error);
    res.render("login", {
      error: "Error al iniciar sesión. Por favor, inténtelo nuevamente.",
    });
  }
});

/**
 * Mostrar página de registro
 */
app.get("/register", (req, res) => {
  res.render("register", { error: null });
});

/**
 * Procesar solicitud de registro de nuevo usuario
 * Valida datos, crea usuario y establece sesión
 */
app.post("/register", async (req, res) => {
  try {
    const { username, email, password, confirmPassword } = req.body;

    // Validar que las contraseñas coincidan
    if (password !== confirmPassword) {
      return res.render("register", { error: "Las contraseñas no coinciden" });
    }

    // Verificar si el usuario o email ya existen
    const existingUser = await User.findOne({ $or: [{ username }, { email }] });
    if (existingUser) {
      return res.render("register", {
        error: "El usuario o email ya está registrado",
      });
    }

    // Encriptar contraseña
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Crear nuevo usuario
    const newUser = new User({
      username,
      email,
      password: hashedPassword,
    });

    await newUser.save();

    // Iniciar sesión automáticamente
    req.session.userId = newUser._id;
    req.session.username = newUser.username;

    res.redirect("/dashboard");
  } catch (error) {
    console.error("Error en registro:", error);
    res.render("register", { error: "Error al registrar usuario" });
  }
});

/**
 * Cerrar sesión
 * Destruye la sesión actual y redirige a login
 */
app.get("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error("Error al cerrar sesión:", err);
    }
    res.redirect("/login");
  });
});

// =============================================================================
// RUTAS DE DASHBOARD Y GESTIÓN DE DOCUMENTOS
// =============================================================================

/**
 * Dashboard - Página principal después de login
 * Muestra los documentos del usuario (no eliminados)
 */
app.get("/dashboard", requireLogin, async (req, res) => {
  try {
    // Obtener documentos activos del usuario
    const documents = await Document.find({
      userId: req.session.userId,
      isDeleted: false,
    }).sort({ uploadDate: -1 });

    res.render("dashboard", {
      username: req.session.username,
      documents,
      formatFileSize,
      section: "documents",
    });
  } catch (error) {
    console.error("Error en dashboard:", error);
    res.status(500).send("Error al cargar el dashboard");
  }
});

/**
 * Subir nuevo documento
 * Recibe archivo y metadatos, guarda en sistema de archivos y base de datos
 */
app.post(
  "/upload",
  requireLogin,
  upload.single("document"),
  async (req, res) => {
    try {
      if (!req.file) {
        return res
          .status(400)
          .json({ error: "No se ha subido ningún archivo" });
      }

<<<<<<< HEAD
      let summary = "";

      // Procesar PDF para extraer texto y generar resumen
      if (req.file.mimetype === "application/pdf") {
        const text = await extractTextFromPdf(req.file.path);
        if (text) {
          summary = await summarizeText(text);
        }
      }

=======
>>>>>>> Back/main
      // Crear registro de documento en la base de datos
      const newDocument = new Document({
        name: req.body.name || req.file.originalname,
        originalName: req.file.originalname,
        description: req.body.description || "",
        filePath: req.file.path,
        fileType: req.file.mimetype,
        fileSize: req.file.size,
        tags: req.body.tags
          ? req.body.tags.split(",").map((tag) => tag.trim())
          : [],
        userId: req.session.userId,
<<<<<<< HEAD
        summary: summary, // Añadir el resumen
=======
>>>>>>> Back/main
      });

      await newDocument.save();

      res.status(201).json({
        success: true,
        document: newDocument,
      });
    } catch (error) {
      console.error("Error al subir documento:", error);
      res.status(500).json({ error: "Error al subir el documento" });
    }
  }
);

/**
 * Obtener un documento específico
 * Permite visualizar, descargar o obtener metadatos de un documento
 */
app.get("/documents/:id", requireLogin, async (req, res) => {
  try {
    const document = await Document.findOne({
      _id: req.params.id,
      userId: req.session.userId,
    });

    if (!document) {
      return res
        .status(404)
        .json({ success: false, error: "Documento no encontrado" });
    }

    // Si se solicita como JSON, devolver metadatos
    if (req.headers.accept && req.headers.accept.includes("application/json")) {
      return res.json({
        _id: document._id,
        name: document.name,
        description: document.description,
        fileType: document.fileType,
        fileSize: document.fileSize,
        uploadDate: document.uploadDate,
        tags: document.tags,
        isDeleted: document.isDeleted,
        deletedAt: document.deletedAt,
        isStarred: document.isStarred,
<<<<<<< HEAD
        summary: document.summary, // Añadir el resumen
=======
>>>>>>> Back/main
      });
    }

    // Si se solicita como descarga
    if (req.query.download === "true") {
      return res.download(document.filePath, document.originalName);
    }

    // Enviar archivo para visualización
    res.sendFile(document.filePath);
  } catch (error) {
    console.error("Error al obtener documento:", error);
    res
      .status(500)
      .json({ success: false, error: "Error al obtener el documento" });
  }
});

/**
 * Actualizar información de un documento
 * Permite modificar nombre, descripción y etiquetas
 */
app.put("/documents/:id", requireLogin, async (req, res) => {
  try {
    const { name, description, tags } = req.body;

    const document = await Document.findOneAndUpdate(
      { _id: req.params.id, userId: req.session.userId, isDeleted: false },
      {
        name,
        description,
        tags: tags ? tags.split(",").map((tag) => tag.trim()) : [],
      },
      { new: true }
    );

    if (!document) {
      return res.status(404).json({ error: "Documento no encontrado" });
    }

    res.json(document);
  } catch (error) {
    console.error("Error al actualizar documento:", error);
    res.status(500).json({ error: "Error al actualizar el documento" });
  }
});

/**
 * Mover documento a la papelera
 * No elimina físicamente, solo marca como eliminado
 */
app.delete("/documents/:id", requireLogin, async (req, res) => {
  try {
    const document = await Document.findOne({
      _id: req.params.id,
      userId: req.session.userId,
      isDeleted: false, // Solo permitir mover a papelera documentos que no estén ya en ella
    });

    if (!document) {
      return res.status(404).json({ error: "Documento no encontrado" });
    }

    // Marcar como eliminado y guardar fecha
    document.isDeleted = true;
    document.deletedAt = new Date();
    await document.save();

    res.json({ success: true });
  } catch (error) {
    console.error("Error al mover documento a la papelera:", error);
    res
      .status(500)
      .json({ error: "Error al mover el documento a la papelera" });
  }
});

/**
 * Eliminar documento permanentemente
 * Borra el archivo físico y el registro en la base de datos
 */
app.delete("/documents/:id/permanent", requireLogin, async (req, res) => {
  try {
    const document = await Document.findOne({
      _id: req.params.id,
      userId: req.session.userId,
    });

    if (!document) {
      return res.status(404).json({ error: "Documento no encontrado" });
    }

    // Eliminar archivo físico
    fs.unlink(document.filePath, async (err) => {
      if (err) {
        console.error("Error al eliminar archivo físico:", err);
      }

      // Eliminar documento de la base de datos
      await Document.deleteOne({ _id: req.params.id });

      res.json({ success: true });
    });
  } catch (error) {
    console.error("Error al eliminar documento permanentemente:", error);
    res
      .status(500)
      .json({ error: "Error al eliminar el documento permanentemente" });
  }
});
// =============================================================================
// GESTIÓN DE PAPELERA
// =============================================================================

/**
 * Vaciar papelera (eliminar permanentemente todos los documentos en la papelera)
 * Elimina archivos físicos y registros en la base de datos
 */
app.delete("/trash", requireLogin, async (req, res) => {
  try {
    // Obtener todos los documentos en la papelera del usuario
    const deletedDocuments = await Document.find({
      userId: req.session.userId,
      isDeleted: true,
    });

    // Eliminar archivos físicos
    const deletePromises = deletedDocuments.map((document) => {
      return new Promise((resolve, reject) => {
        fs.unlink(document.filePath, (err) => {
          if (err) {
            console.error(
              `Error al eliminar archivo físico ${document.filePath}:`,
              err
            );
          }
          resolve();
        });
      });
    });

    // Esperar a que se eliminen todos los archivos físicos
    await Promise.all(deletePromises);

    // Eliminar documentos de la base de datos
    await Document.deleteMany({
      userId: req.session.userId,
      isDeleted: true,
    });

    res.json({ success: true });
  } catch (error) {
    console.error("Error al vaciar la papelera:", error);
    res.status(500).json({ error: "Error al vaciar la papelera" });
  }
});

/**
 * Ver documentos en la papelera
 * Muestra los documentos marcados como eliminados
 */
app.get("/trash", requireLogin, async (req, res) => {
  try {
    // Obtener documentos en papelera
    const documents = await Document.find({
      userId: req.session.userId,
      isDeleted: true,
    }).sort({ deletedAt: -1 });

    res.render("dashboard", {
      username: req.session.username,
      documents,
      formatFileSize,
      section: "trash",
    });
  } catch (error) {
    console.error("Error al cargar papelera:", error);
    res.status(500).send("Error al cargar la papelera");
  }
});

/**
 * Restaurar documento desde la papelera
 * Marca el documento como no eliminado
 */
app.put("/documents/:id/restore", requireLogin, async (req, res) => {
  try {
    const document = await Document.findOne({
      _id: req.params.id,
      userId: req.session.userId,
      isDeleted: true,
    });

    if (!document) {
      return res
        .status(404)
        .json({ error: "Documento no encontrado en la papelera" });
    }

    // Restaurar documento
    document.isDeleted = false;
    document.deletedAt = undefined;
    await document.save();

    res.json({ success: true });
  } catch (error) {
    console.error("Error al restaurar documento:", error);
    res
      .status(500)
      .json({ error: "Error al restaurar el documento de la papelera" });
  }
});

// =============================================================================
// GESTIÓN DE DOCUMENTOS DESTACADOS
// =============================================================================

/**
 * Ver documentos destacados
 * Muestra los documentos marcados como favoritos
 */
app.get("/starred", requireLogin, async (req, res) => {
  try {
    // Obtener documentos destacados (no eliminados)
    const documents = await Document.find({
      userId: req.session.userId,
      isStarred: true,
      isDeleted: false,
    }).sort({ uploadDate: -1 });

    res.render("dashboard", {
      username: req.session.username,
      documents,
      formatFileSize,
      section: "starred",
    });
  } catch (error) {
    console.error("Error al cargar documentos destacados:", error);
    res.status(500).send("Error al cargar documentos destacados");
  }
});

/**
 * Marcar/desmarcar documento como destacado
 * Alterna el estado de destacado de un documento
 */
app.put("/documents/:id/star", requireLogin, async (req, res) => {
  try {
    const document = await Document.findOne({
      _id: req.params.id,
      userId: req.session.userId,
      isDeleted: false, // Solo permitir destacar documentos que no estén en papelera
    });

    if (!document) {
      return res
        .status(404)
        .json({ error: "Documento no encontrado o está en la papelera" });
    }

    // Alternar estado destacado
    document.isStarred = !document.isStarred;
    await document.save();

    res.json({
      success: true,
      isStarred: document.isStarred,
    });
  } catch (error) {
    console.error("Error al actualizar estado destacado:", error);
    res
      .status(500)
      .json({ error: "Error al actualizar estado destacado del documento" });
  }
});

// =============================================================================
// GESTIÓN DE PERFIL DE USUARIO
// =============================================================================

/**
 * Obtener información del perfil del usuario
 * Devuelve datos básicos del usuario autenticado
 */
app.get("/api/profile", requireLogin, async (req, res) => {
  try {
    const user = await User.findById(req.session.userId);
    if (!user) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    // Enviar información del usuario (sin la contraseña)
    res.json({
      username: user.username,
      email: user.email,
      // Enviar email parcialmente oculto por seguridad
      maskedEmail:
        user.email.substring(0, 3) + "*".repeat(user.email.length - 3),
    });
  } catch (error) {
    console.error("Error al obtener perfil:", error);
    res.status(500).json({ error: "Error al obtener información del perfil" });
  }
});

/**
 * Actualizar nombre de usuario
 * Permite al usuario cambiar su nombre de usuario
 */
app.put("/api/profile/username", requireLogin, async (req, res) => {
  try {
    const { newUsername } = req.body;

    // Validar entrada
    if (!newUsername) {
      return res
        .status(400)
        .json({ error: "Debes proporcionar un nuevo nombre de usuario" });
    }

    // Verificar disponibilidad
    const existingUser = await User.findOne({ username: newUsername });
    if (existingUser && existingUser._id.toString() !== req.session.userId) {
      return res
        .status(400)
        .json({ error: "Este nombre de usuario ya está en uso" });
    }

    // Actualizar usuario
    const user = await User.findByIdAndUpdate(
      req.session.userId,
      { username: newUsername },
      { new: true }
    );

    // Actualizar sesión
    req.session.username = newUsername;

    res.json({ success: true, username: user.username });
  } catch (error) {
    console.error("Error al actualizar nombre de usuario:", error);
    res.status(500).json({ error: "Error al actualizar nombre de usuario" });
  }
});

/**
 * Actualizar correo electrónico
 * Permite al usuario cambiar su dirección de correo
 */
app.put("/api/profile/email", requireLogin, async (req, res) => {
  try {
    const { currentEmail, newEmail, confirmEmail } = req.body;

    // Validar entradas
    if (!currentEmail || !newEmail || !confirmEmail) {
      return res
        .status(400)
        .json({ error: "Debes completar todos los campos" });
    }

    if (newEmail !== confirmEmail) {
      return res
        .status(400)
        .json({ error: "El nuevo correo y la confirmación no coinciden" });
    }

    // Obtener usuario
    const user = await User.findById(req.session.userId);
    if (!user) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    // Verificar correo actual
    if (user.email !== currentEmail) {
      return res.status(400).json({ error: "El correo actual no es correcto" });
    }

    // Verificar disponibilidad
    const existingUser = await User.findOne({ email: newEmail });
    if (existingUser && existingUser._id.toString() !== req.session.userId) {
      return res
        .status(400)
        .json({ error: "Este correo electrónico ya está en uso" });
    }

    // Actualizar correo
    user.email = newEmail;
    await user.save();

    res.json({
      success: true,
      email: user.email,
      maskedEmail:
        user.email.substring(0, 3) + "*".repeat(user.email.length - 3),
    });
  } catch (error) {
    console.error("Error al actualizar correo electrónico:", error);
    res.status(500).json({ error: "Error al actualizar correo electrónico" });
  }
});

/**
 * Actualizar contraseña
 * Permite al usuario cambiar su contraseña
 */
app.put("/api/profile/password", requireLogin, async (req, res) => {
  try {
    const { currentPassword, newPassword, confirmPassword } = req.body;

    // Validar entradas
    if (!currentPassword || !newPassword || !confirmPassword) {
      return res
        .status(400)
        .json({ error: "Debes completar todos los campos" });
    }

    if (newPassword !== confirmPassword) {
      return res
        .status(400)
        .json({ error: "La nueva contraseña y la confirmación no coinciden" });
    }

    // Obtener usuario
    const user = await User.findById(req.session.userId);
    if (!user) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    // Verificar contraseña actual
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res
        .status(400)
        .json({ error: "La contraseña actual no es correcta" });
    }

    // Encriptar y actualizar contraseña
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);
    user.password = hashedPassword;
    await user.save();

    res.json({ success: true });
  } catch (error) {
    console.error("Error al actualizar contraseña:", error);
    res.status(500).json({ error: "Error al actualizar contraseña" });
  }
});

// =============================================================================
// INICIAR SERVIDOR
// =============================================================================

app.listen(PORT, () => {
  console.log(`Servidor iniciado en http://localhost:${PORT}`);
});
