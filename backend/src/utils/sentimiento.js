// backend/src/utils/sentimiento.js
// Clasificador Naive Bayes entrenado con 210 ejemplos
// Incluye manejo de negaciones, casos mixtos, sarcasmo y ambigüedades

//FUNCIONAMIENTO:
// Implementa un clasificador de sentimiento basado en reglas para analizar la opinión expresada en textos relacionados con propiedades de alquiler.
// El clasificador utiliza un conjunto de datos de entrenamiento con ejemplos etiquetados como positivos o negativos. 
// Incluye manejo de negaciones (por ejemplo, "no está sucio" se interpreta como positivo), casos mixtos(donde hay aspectos positivos y negativos pero la conclusión final es positiva) y sarcasmo/ambigüedades (donde el texto puede parecer negativo pero la intención es positiva).

const DATOS = [

  // ════════════════════════════════════════════════════════════
  //POSITIVOS SIMPLES
  // ════════════════════════════════════════════════════════════
  { texto: 'precio justo por lo que ofrece lo recomiendo', clase: 'positivo' },
  { texto: 'me senti como en casa muy comodo y seguro', clase: 'positivo' },
  { texto: 'el edificio tiene camara y guardia me siento muy seguro', clase: 'positivo' },
  { texto: 'excelente relacion calidad precio recomendable para estudiantes', clase: 'positivo' },
  { texto: 'el lugar es muy tranquilo perfecto para concentrarse', clase: 'positivo' },
  { texto: 'el cuarto es espacioso iluminado y muy limpio', clase: 'positivo' },
  { texto: 'el dueno siempre disponible y muy atento', clase: 'positivo' },
  { texto: 'muy buen lugar para concentrarse y estudiar tranquilo', clase: 'positivo' },
  { texto: 'el arrendador es muy responsable y atento recomendable', clase: 'positivo' },
  { texto: 'instalaciones en perfecto estado recomendable', clase: 'positivo' },
  { texto: 'el dueno es muy comprensivo y flexible con los pagos excelente persona', clase: 'positivo' },
  { texto: 'el lugar es limpio seguro y bien mantenido volveria sin duda', clase: 'positivo' },
  { texto: 'el arrendador es muy responsable y atento lo recomiendo', clase: 'positivo' },
  { texto: 'la zona es muy segura nunca tuve ningun incidente', clase: 'positivo' },
  { texto: 'vecinos tranquilos y respetuosos buen ambiente', clase: 'positivo' },
  { texto: 'agua caliente las 24 horas excelente servicio', clase: 'positivo' },
  { texto: 'cocina bien equipada y en buen estado limpia', clase: 'positivo' },
  { texto: 'vecinos tranquilos ambiente agradable volveria sin duda', clase: 'positivo' },
  { texto: 'limpian las areas comunes regularmente siempre esta presentable', clase: 'positivo' },
  { texto: 'el lugar estaba impecable cuando llegue y lo mantienen muy limpio', clase: 'positivo' },
  { texto: 'bonita vista desde el cuarto muy tranquilo y comodo', clase: 'positivo' },
  { texto: 'vecinos tranquilos ambiente agradable recomendable', clase: 'positivo' },
  { texto: 'sin cucarachas sin plagas muy higienico y limpio', clase: 'positivo' },
  { texto: 'el dueno resuelve todo rapidamente volveria sin duda', clase: 'positivo' },
  { texto: 'muy limpio ordenado y bien cuidado recomendable', clase: 'positivo' },
  { texto: 'la lavanderia incluida es un plus excelente servicio', clase: 'positivo' },
  { texto: 'seguridad del edificio muy buena me siento tranquilo', clase: 'positivo' },
  { texto: 'precio justo calidad excelente volveria sin duda', clase: 'positivo' },
  { texto: 'instalaciones en perfecto estado sin ningun problema', clase: 'positivo' },
  { texto: 'excelente ubicacion con todos los servicios lo recomiendo', clase: 'positivo' },
  { texto: 'el dueno resuelve todo rapidamente recomendable', clase: 'positivo' },
  { texto: 'el dueno resuelve todo rapidamente lo recomiendo', clase: 'positivo' },
  { texto: 'nunca tuve problemas con el internet siempre estable y rapido', clase: 'positivo' },
  { texto: 'sin problemas de agua ni luz todo funciona lo recomiendo', clase: 'positivo' },
  { texto: 'precio justo calidad excelente lo recomiendo', clase: 'positivo' },
  { texto: 'excelente lugar muy limpio y seguro recomendable', clase: 'positivo' },
  { texto: 'el internet es de fibra optica super rapido perfecto para clases', clase: 'positivo' },
  { texto: 'la presion del agua es muy buena excelente servicio', clase: 'positivo' },
  { texto: 'el lugar es limpio seguro y bien mantenido recomendable', clase: 'positivo' },
  { texto: 'muy buena ubicacion cerca del ipn y del metro', clase: 'positivo' },
  { texto: 'excelente seguridad en el edificio acceso con tarjeta y vigilancia', clase: 'positivo' },
  { texto: 'me gusto mucho el ambiente del lugar muy agradable', clase: 'positivo' },
  { texto: 'la presion del agua es buena y nunca falla', clase: 'positivo' },
  { texto: 'precio justo calidad excelente recomendable', clase: 'positivo' },
  { texto: 'nunca tuve problemas con la luz siempre estable', clase: 'positivo' },
  { texto: 'sin problemas de agua ni luz todo funciona recomendable', clase: 'positivo' },
  { texto: 'el mejor precio que encontre en la zona con buena calidad', clase: 'positivo' },
  { texto: 'vale cada peso que cuesta muy buen lugar por el precio', clase: 'positivo' },
  { texto: 'el propietario es muy honesto cumple todo lo del contrato', clase: 'positivo' },
  { texto: 'nunca vi una cucaracha ni ningun bicho muy higienico', clase: 'positivo' },
  { texto: 'muy limpio ordenado y bien cuidado lo recomiendo', clase: 'positivo' },
  { texto: 'el internet es excelente ideal para estudiar en linea', clase: 'positivo' },
  { texto: 'el arrendador es muy responsable y atento volveria sin duda', clase: 'positivo' },
  { texto: 'el arrendador cumple todo lo que promete muy honesto', clase: 'positivo' },
  { texto: 'internet rapido y agua caliente siempre recomendable', clase: 'positivo' },
  { texto: 'lo recomiendo ampliamente a todos los estudiantes del ipn', clase: 'positivo' },
  { texto: 'completamente silencioso ideal para estudiar y descansar', clase: 'positivo' },
  { texto: 'los vecinos son muy considerados nunca hacen ruido', clase: 'positivo' },
  { texto: 'el arrendador es amable y resuelve problemas rapido', clase: 'positivo' },
  { texto: 'el internet incluido es excelente puedo hacer videoconferencias sin problemas', clase: 'positivo' },
  { texto: 'nada me falta aqui tiene todo lo necesario para vivir', clase: 'positivo' },
  { texto: 'sin problemas de agua ni luz todo funciona volveria sin duda', clase: 'positivo' },
  { texto: 'todo en perfecto estado desde que llegue sin quejas', clase: 'positivo' },
  { texto: 'el lugar es limpio seguro y bien mantenido lo recomiendo', clase: 'positivo' },
  { texto: 'excelente precio para todo lo que incluye muy buena oferta', clase: 'positivo' },
  { texto: 'instalaciones en perfecto estado volveria sin duda', clase: 'positivo' },
  { texto: 'internet rapido agua caliente todo funciona perfecto', clase: 'positivo' },
  { texto: 'excelente ubicacion con todos los servicios recomendable', clase: 'positivo' },
  { texto: 'internet rapido y agua caliente siempre volveria sin duda', clase: 'positivo' },
  { texto: 'muy limpio ordenado y bien cuidado volveria sin duda', clase: 'positivo' },
  { texto: 'nunca fallo el agua en todo el tiempo que vivi ahi', clase: 'positivo' },
  { texto: 'el precio es muy accesible para lo que ofrece increible', clase: 'positivo' },
  { texto: 'la calefaccion funciona bien nunca pase frio', clase: 'positivo' },
  { texto: 'instalaciones en perfecto estado lo recomiendo', clase: 'positivo' },
  { texto: 'habitacion amplia limpia y bien amueblada', clase: 'positivo' },
  { texto: 'el arrendador siempre disponible resuelve todo en menos de un dia', clase: 'positivo' },
  { texto: 'el agua caliente funciona perfecto las 24 horas del dia', clase: 'positivo' },
  { texto: 'excelente ubicacion con todos los servicios volveria sin duda', clase: 'positivo' },
  { texto: 'el bano esta impecable y el agua caliente siempre', clase: 'positivo' },
  { texto: 'internet rapido y agua caliente siempre lo recomiendo', clase: 'positivo' },
  { texto: 'vecinos tranquilos ambiente agradable lo recomiendo', clase: 'positivo' },
  { texto: 'súper recomendado, todo funciona de maravilla', clase: 'positivo' },
  { texto: 'el dueño es un amor, siempre pendiente de todo', clase: 'positivo' },
  { texto: 'nunca había estado en un lugar tan limpio y ordenado', clase: 'positivo' },
  { texto: 'el internet vuela, puedo hacer streaming sin cortes', clase: 'positivo' },
  { texto: 'la zona es bien tranquila, se duerme como bebé', clase: 'positivo' },
  { texto: 'el agua caliente sale al instante y con buena presión', clase: 'positivo' },
  { texto: 'los vecinos son super amables y cuidamos entre todos', clase: 'positivo' },
  { texto: 'el precio es una ganga para todo lo que incluye', clase: 'positivo' },
  { texto: 'las instalaciones están como nuevas, todo impecable', clase: 'positivo' },
  { texto: 'el arrendador me ayudó con el papeleo y fue muy flexible', clase: 'positivo' },
  { texto: 'el cuarto es pequeño pero súper acogedor y bien iluminado', clase: 'positivo' },
  { texto: 'no hay nada que me queje, todo excelente', clase: 'positivo' },
  { texto: 'la seguridad es de primera, cámaras y guardia 24/7', clase: 'positivo' },
  { texto: 'el edificio tiene lavandería, terraza y gimnasio, genial', clase: 'positivo' },
  { texto: 'el contrato fue claro y sin letras chiquitas', clase: 'positivo' },
  { texto: 'el depósito me lo regresaron completo y sin pretextos', clase: 'positivo' },
  { texto: 'la cocina está bien equipada, hasta tiene microondas', clase: 'positivo' },
  { texto: 'el baño tiene excelente ventilación y está muy limpio', clase: 'positivo' },
  { texto: 'el transporte público está a una cuadra, súper útil', clase: 'positivo' },
  { texto: 'hay supermercados y tiendas cerca, muy práctico', clase: 'positivo' },
  { texto: 'nunca se va la luz ni el agua, servicio continuo', clase: 'positivo' },
  { texto: 'el ambiente es familiar y respetuoso', clase: 'positivo' },
  { texto: 'el arrendador arregló una fuga en menos de una hora', clase: 'positivo' },
  { texto: 'las paredes son gruesas, no se escucha a los vecinos', clase: 'positivo' },
  { texto: 'el lugar está pintado y decorado con buen gusto', clase: 'positivo' },
  { texto: 'la cama es cómoda y los muebles están en buen estado', clase: 'positivo' },
  { texto: 'el ruido exterior no se mete, muy aislado', clase: 'positivo' },
  { texto: 'tiene calefacción y aire acondicionado, perfecto', clase: 'positivo' },
  { texto: 'el jardín o terraza común está bien cuidado', clase: 'positivo' },
  { texto: 'la relación calidad-precio es insuperable', clase: 'positivo' },
  { texto: 'todo funciona de maravilla, no tengo ninguna queja', clase: 'positivo' },
  { texto: 'el lugar es acogedor y muy bien ubicado', clase: 'positivo' },
  { texto: 'los vecinos son callados y respetan el descanso', clase: 'positivo' },
  { texto: 'el arrendador me regaló una planta para bienvenida, detallazo', clase: 'positivo' },
  { texto: 'la cocina tiene horno y microondas, súper equipada', clase: 'positivo' },
  { texto: 'el colchón es cómodo, nunca había dormido tan bien', clase: 'positivo' },
  { texto: 'el agua tiene buena presión y sale caliente al instante', clase: 'positivo' },
  { texto: 'el edificio es bonito y bien cuidado', clase: 'positivo' },
  { texto: 'el internet de fibra óptica me permite trabajar sin cortes', clase: 'positivo' },
  { texto: 'la zona tiene parques y áreas verdes, muy agradable', clase: 'positivo' },
  { texto: 'la vista desde mi cuarto es espectacular y muy relajante', clase: 'positivo' },
  { texto: 'el lugar tiene excelente ventilación natural nunca necesitas aire acondicionado', clase: 'positivo' },
  { texto: 'los acabados son de buena calidad y se nota que lo mantienen', clase: 'positivo' },
  { texto: 'el contrato fue muy claro y sin cláusulas ocultas lo recomiendo', clase: 'positivo' },
  { texto: 'el arrendador me ayudó a instalar mi internet personal sin problema', clase: 'positivo' },
  { texto: 'la cocina tiene estufa, refrigerador y hasta microondas, muy completa', clase: 'positivo' },
  { texto: 'el edificio tiene áreas verdes y terraza, ideal para despejarse', clase: 'positivo' },
  { texto: 'el tamaño del cuarto es perfecto para una persona, ni grande ni pequeño', clase: 'positivo' },
  { texto: 'el ruido exterior es casi nulo, parece que estás en una burbuja', clase: 'positivo' },
  { texto: 'la ducha tiene excelente presión y el agua caliente dura mucho', clase: 'positivo' },

  // ════════════════════════════════════════════════════════════
  //POSITIVOS CON NEGACIÓN
  // "no está sucio" = limpio | "nunca falló" = confiable
  // El tokenizador convierte "no_sucio" como token positivo
  // ════════════════════════════════════════════════════════════
  { texto: 'no esta sucio el lugar es muy limpio y ordenado', clase: 'positivo' },
  { texto: 'nunca fallo la luz ni el agua excelente servicio', clase: 'positivo' },
  { texto: 'no me arrepiento para nada de haber rentado aqui', clase: 'positivo' },
  { texto: 'no hay problemas con el agua siempre hay buena presion', clase: 'positivo' },
  { texto: 'no tuve ningun problema durante toda mi estancia genial', clase: 'positivo' },
  { texto: 'no encontre cucarachas ni plagas muy higienico', clase: 'positivo' },
  { texto: 'no es caro para todo lo que incluye muy buen precio', clase: 'positivo' },
  { texto: 'el bano no tiene fugas esta en perfecto estado', clase: 'positivo' },
  { texto: 'no hay ruido los vecinos son super tranquilos', clase: 'positivo' },
  { texto: 'no tuve problemas con el internet siempre rapido', clase: 'positivo' },
  { texto: 'no falta nada en este lugar, todo perfecto', clase: 'positivo' },
  { texto: 'nunca tuvimos problemas con los vecinos, son tranquilos', clase: 'positivo' },
  { texto: 'sin duda no me arrepiento de haber elegido este cuarto', clase: 'positivo' },
  { texto: 'no hay humedad ni malos olores, impecable', clase: 'positivo' },
  { texto: 'nadie molesta, se puede estudiar y descansar', clase: 'positivo' },
  { texto: 'no tuvimos fugas ni fallas en todo el año', clase: 'positivo' },
  { texto: 'sin mentir, es el mejor lugar que he visto por este precio', clase: 'positivo' },
  { texto: 'jamas vi una cucaracha, todo limpio', clase: 'positivo' },
  { texto: 'no es ruidoso para nada, ideal para teletrabajo', clase: 'positivo' },
  { texto: 'nunca faltó el agua caliente, excelente', clase: 'positivo' },
  { texto: 'no es un lugar lujoso pero todo funciona perfectamente y es limpio', clase: 'positivo' },
  { texto: 'nunca me sentí inseguro al llegar tarde, siempre hay gente en la calle', clase: 'positivo' },
  { texto: 'sin duda volvería a rentar aquí, no me arrepiento', clase: 'positivo' },
  { texto: 'el dueño no es intrusivo, al contrario, respeta tu privacidad', clase: 'positivo' },
  { texto: 'no hay problemas de humedad ni malos olores, está bien cuidado', clase: 'positivo' },
  { texto: 'jamás me faltó el internet para mis clases en línea, excelente', clase: 'positivo' },
  { texto: 'no es caro comparado con otros de la zona, bastante accesible', clase: 'positivo' },
  { texto: 'nadie te molesta, cada quien respeta su espacio, muy tranquilo', clase: 'positivo' },

  // ════════════════════════════════════════════════════════════
  // POSITIVOS MIXTOS → CONCLUSIÓN POSITIVA
  // Tienen aspectos negativos pero la conclusión final es positiva
  // Ejemplo: "pequeño pero limpio y seguro → recomendable"
  // ════════════════════════════════════════════════════════════
  { texto: 'aunque el precio es alto el lugar esta muy limpio y bien mantenido lo recomiendo', clase: 'positivo' },
  { texto: 'aunque esta lejos del metro el lugar es excelente limpio y seguro', clase: 'positivo' },
  { texto: 'no tiene lavanderia pero todo lo demas es excelente muy recomendable', clase: 'positivo' },
  { texto: 'el cuarto es pequeno pero limpio seguro y bien ubicado recomendable para estudiantes', clase: 'positivo' },
  { texto: 'tiene pocas fallas pero en general es un buen lugar lo recomiendo', clase: 'positivo' },
  { texto: 'no es el mas barato pero la calidad es muy buena lo recomiendo ampliamente', clase: 'positivo' },
  { texto: 'el internet es lento pero el arrendador es excelente y el lugar muy limpio', clase: 'positivo' },
  { texto: 'el cuarto es chico pero muy limpio y el dueno muy atento recomendable', clase: 'positivo' },
  { texto: 'el cuarto es chico pero tiene todo lo necesario y está limpio, lo recomiendo', clase: 'positivo' },
  { texto: 'aunque no tiene estacionamiento, la ubicación y el precio compensan, buen lugar', clase: 'positivo' },
  { texto: 'el edificio es viejo pero lo mantienen limpio y seguro, volvería', clase: 'positivo' },
  { texto: 'la regadera tiene poca presión pero el resto está excelente, lo recomiendo', clase: 'positivo' },
  { texto: 'a veces falla el internet pero el dueño es atento y resuelve rápido, positivo', clase: 'positivo' },
  { texto: 'no es lujoso pero es cómodo y barato, me gustó', clase: 'positivo' },
  { texto: 'le falta pintura pero está muy limpio y ordenado, recomendable', clase: 'positivo' },
  { texto: 'el ruido de la calle se oye un poco pero con ventana cerrada se duerme bien', clase: 'positivo' },
  { texto: 'el arrendador tarda en responder pero cuando lo hace soluciona todo, buena onda', clase: 'positivo' },
  { texto: 'la cocina es pequeña pero funcional y bien equipada, me gustó', clase: 'positivo' },
  { texto: 'el edificio es viejo pero lo mantienen limpio y el dueño es atento, lo recomiendo', clase: 'positivo' },
  { texto: 'aunque la regadera tiene poca presión, el lugar es muy seguro y tranquilo, me gusta', clase: 'positivo' },
  { texto: 'el cuarto es pequeño pero está bien ubicado y es barato, vale la pena', clase: 'positivo' },
  { texto: 'no tiene estacionamiento pero si no tienes auto es perfecto, todo cerca', clase: 'positivo' },
  { texto: 'el contrato es algo rígido pero el arrendador es flexible con los pagos, recomiendo', clase: 'positivo' },
  { texto: 'las paredes son delgadas pero los vecinos son respetuosos, casi no hay ruido', clase: 'positivo' },
  { texto: 'la cocina es compartida y pequeña pero está siempre limpia y bien equipada', clase: 'positivo' },

  // ════════════════════════════════════════════════════════════
  // NEGATIVOS SIMPLES
  // Quejas directas sin ambigüedad
  // ════════════════════════════════════════════════════════════
  { texto: 'el deposito no te lo devuelven inventan pretextos abusivos', clase: 'negativo' },
  { texto: 'cobran demasiado para lo malo que es una estafa absoluta', clase: 'negativo' },
  { texto: 'bano roto con fugas sin arreglar fue un error', clase: 'negativo' },
  { texto: 'calefaccion rota hace mucho frio no lo recomiendo', clase: 'negativo' },
  { texto: 'la zona es muy peligrosa hay asaltos frecuentes no recomiendo', clase: 'negativo' },
  { texto: 'problemas con agua luz e internet fue un error', clase: 'negativo' },
  { texto: 'problemas con agua luz e internet no lo recomiendo', clase: 'negativo' },
  { texto: 'las areas comunes nunca se limpian estan llenas de basura', clase: 'negativo' },
  { texto: 'llegue y habia cucarachas en la cocina asqueroso e insalubre', clase: 'negativo' },
  { texto: 'el dueno sube el precio sin avisar es un abuso', clase: 'negativo' },
  { texto: 'el propietario sube el precio unilateralmente sin avisar abusivo', clase: 'negativo' },
  { texto: 'bano roto con fugas sin arreglar no volveria', clase: 'negativo' },
  { texto: 'la cerradura esta rota hace semanas y no la arreglan', clase: 'negativo' },
  { texto: 'me robaron en el edificio no hay seguridad alguna peligroso', clase: 'negativo' },
  { texto: 'el ruido de los vecinos es insoportable no se puede dormir', clase: 'negativo' },
  { texto: 'techo con goteras cuando llueve se moja todo horrible', clase: 'negativo' },
  { texto: 'la luz se va constantemente tres veces por semana pesimo', clase: 'negativo' },
  { texto: 'lugar sucio con plagas y mal olor no volveria', clase: 'negativo' },
  { texto: 'zona insegura y con mucho ruido fue un error', clase: 'negativo' },
  { texto: 'el deposito nunca lo devuelven no volveria', clase: 'negativo' },
  { texto: 'el ruido de la calle entra directo al cuarto no descansas', clase: 'negativo' },
  { texto: 'zona insegura y con mucho ruido no volveria', clase: 'negativo' },
  { texto: 'el bano tiene moho en las paredes y huele horrible', clase: 'negativo' },
  { texto: 'el arrendador es amable pero el departamento tiene plagas y huele mal pesimo', clase: 'negativo' },
  { texto: 'demasiado caro para lo pesimo que es fue un error', clase: 'negativo' },
  { texto: 'vecinos ruidosos no se puede dormir fue un error', clase: 'negativo' },
  { texto: 'el arrendador nunca responde ni ayuda no lo recomiendo', clase: 'negativo' },
  { texto: 'bano roto con fugas sin arreglar no lo recomiendo', clase: 'negativo' },
  { texto: 'el arrendador no responde mensajes muy irresponsable', clase: 'negativo' },
  { texto: 'el arrendador desaparece cuando hay problemas es irresponsable', clase: 'negativo' },
  { texto: 'hay una fiesta todos los fines de semana es horrible', clase: 'negativo' },
  { texto: 'me arrepiento de haber rentado aqui fue un error', clase: 'negativo' },
  { texto: 'problemas constantes con el agua se va todo el dia', clase: 'negativo' },
  { texto: 'demasiado caro para lo que ofrece una estafa', clase: 'negativo' },
  { texto: 'lugar sucio con plagas y mal olor fue un error', clase: 'negativo' },
  { texto: 'no hay ventilacion hace un calor insoportable en verano', clase: 'negativo' },
  { texto: 'el precio sube cada tres meses sin mejoras es un abuso', clase: 'negativo' },
  { texto: 'el dueno es grosero y prepotente nunca ayuda con nada', clase: 'negativo' },
  { texto: 'vecinos conflictivos y ruidosos no se puede descansar', clase: 'negativo' },
  { texto: 'vecinos ruidosos no se puede dormir no lo recomiendo', clase: 'negativo' },
  { texto: 'la puerta no cierra bien muy inseguro da miedo', clase: 'negativo' },
  { texto: 'el dueno es grosero y nunca ayuda con nada pesimo', clase: 'negativo' },
  { texto: 'cucarachas en cocina y dormitorio no volveria', clase: 'negativo' },
  { texto: 'el deposito nunca lo devuelven fue un error', clase: 'negativo' },
  { texto: 'cobran por servicios que no funcionan es una estafa', clase: 'negativo' },
  { texto: 'lugar sucio lleno de cucarachas y mal olor horrible', clase: 'negativo' },
  { texto: 'plagas en toda la cocina cucarachas y ratones asqueroso', clase: 'negativo' },
  { texto: 'el arrendador nunca responde ni ayuda no volveria', clase: 'negativo' },
  { texto: 'demasiado caro para lo pesimo que es no volveria', clase: 'negativo' },
  { texto: 'demasiado caro para lo pesimo que es no lo recomiendo', clase: 'negativo' },
  { texto: 'muy frio en invierno la calefaccion no funciona terrible', clase: 'negativo' },
  { texto: 'pague el deposito y nunca me lo regresaron ladrones', clase: 'negativo' },
  { texto: 'el bano tiene fugas y goteras nadie las arregla', clase: 'negativo' },
  { texto: 'paredes con humedad y moho muy insalubre para vivir', clase: 'negativo' },
  { texto: 'zona insegura y con mucho ruido no lo recomiendo', clase: 'negativo' },
  { texto: 'las instalaciones electricas son un peligro pueden causar incendio', clase: 'negativo' },
  { texto: 'el agua se va todos los dias desde las 7am hasta las 2pm horrible', clase: 'negativo' },
  { texto: 'no hay agua caliente tienes que banarte con agua fria terrible', clase: 'negativo' },
  { texto: 'la puerta del edificio siempre abierta cualquiera entra inseguro', clase: 'negativo' },
  { texto: 'mucho ruido de vecinos no se puede dormir ni estudiar', clase: 'negativo' },
  { texto: 'vecinos ruidosos no se puede dormir no volveria', clase: 'negativo' },
  { texto: 'el agua tiene mal olor y color raro da asco', clase: 'negativo' },
  { texto: 'calefaccion rota hace mucho frio no volveria', clase: 'negativo' },
  { texto: 'el agua tiene mal color y huele raro imposible usarla', clase: 'negativo' },
  { texto: 'cobran servicios basicos aparte muy caro no vale nada', clase: 'negativo' },
  { texto: 'precio accesible pero las instalaciones estan en mal estado no vale la pena', clase: 'negativo' },
  { texto: 'lugar sucio con plagas y mal olor no lo recomiendo', clase: 'negativo' },
  { texto: 'el arrendador nunca responde ni ayuda fue un error', clase: 'negativo' },
  { texto: 'el deposito nunca lo devuelven no lo recomiendo', clase: 'negativo' },
  { texto: 'prometen wifi y no hay o es tan lento que no sirve', clase: 'negativo' },
  { texto: 'cucarachas en cocina y dormitorio no lo recomiendo', clase: 'negativo' },
  { texto: 'no recomiendo este lugar para nada fue terrible', clase: 'negativo' },
  { texto: 'cobran servicios por separado y al final sale carísimo engano', clase: 'negativo' },
  { texto: 'el wifi se cae constantemente es imposible estudiar en linea', clase: 'negativo' },
  { texto: 'internet muy lento o sin servicio constantemente', clase: 'negativo' },
  { texto: 'cucarachas en cocina y dormitorio fue un error', clase: 'negativo' },
  { texto: 'problemas con agua luz e internet no volveria', clase: 'negativo' },
  { texto: 'no hay internet aunque lo prometieron en el contrato mentirosos', clase: 'negativo' },
  { texto: 'calefaccion rota hace mucho frio fue un error', clase: 'negativo' },
  { texto: 'zona muy peligrosa me robaron dos veces inseguro', clase: 'negativo' },
  { texto: 'el internet es tan lento que no carga ni un video frustrante', clase: 'negativo' },
  { texto: 'muy lejos del ipn y el transporte es caro y tardado', clase: 'negativo' },
  { texto: 'el peor lugar que he rentado, todo se cae a pedazos', clase: 'negativo' },
  { texto: 'el arrendador te ignora cuando hay problemas', clase: 'negativo' },
  { texto: 'la humedad es tan fuerte que se pelan las paredes', clase: 'negativo' },
  { texto: 'hay ratones y el dueño no quiere fumigar', clase: 'negativo' },
  { texto: 'el internet es un chiste, no carga ni el WhatsApp', clase: 'negativo' },
  { texto: 'el agua sale marrón y con olor a óxido', clase: 'negativo' },
  { texto: 'los vecinos son unos cerdos, dejan basura en el pasillo', clase: 'negativo' },
  { texto: 'el edificio parece una cárcel, feo y descuidado', clase: 'negativo' },
  { texto: 'el ruido de la calle es infernal, no se puede ni hablar', clase: 'negativo' },
  { texto: 'me cambiaron el contrato a última hora con precios distintos', clase: 'negativo' },
  { texto: 'el depósito no me lo regresaron con excusas tontas', clase: 'negativo' },
  { texto: 'la cerradura está dañada y cualquiera puede abrir', clase: 'negativo' },
  { texto: 'se metieron a robar en el estacionamiento', clase: 'negativo' },
  { texto: 'las tuberías hacen ruido toda la noche', clase: 'negativo' },
  { texto: 'el baño no tiene extractor y se llena de moho', clase: 'negativo' },
  { texto: 'la cocina tiene goteras y huele a drenaje', clase: 'negativo' },
  { texto: 'el dueño subió el precio dos veces en seis meses', clase: 'negativo' },
  { texto: 'las áreas comunes están sucias y abandonadas', clase: 'negativo' },
  { texto: 'el lugar es un calvario en verano, no hay ventilación', clase: 'negativo' },
  { texto: 'en invierno parece un congelador, la calefacción no sirve', clase: 'negativo' },
  { texto: 'los vecinos se pelean a gritos a media noche', clase: 'negativo' },
  { texto: 'el agua caliente dura solo 5 minutos', clase: 'negativo' },
  { texto: 'el internet está contratado con la empresa más mala', clase: 'negativo' },
  { texto: 'las llaves del agua no cierran bien, se desperdicia el agua', clase: 'negativo' },
  { texto: 'el enchufe cerca de la cama no funciona', clase: 'negativo' },
  { texto: 'la ventana no sella y entra el frío y el ruido', clase: 'negativo' },
  { texto: 'el elevador siempre está descompuesto', clase: 'negativo' },
  { texto: 'no hay estacionamiento y te multan seguido', clase: 'negativo' },
  { texto: 'el contrato tenía cláusulas escondidas muy abusivas', clase: 'negativo' },
  { texto: 'en general, fue una pésima experiencia, no lo alquilen', clase: 'negativo' },
  { texto: 'el lugar está descuidado y abandonado, horrible', clase: 'negativo' },
  { texto: 'el arrendador nunca firmó el contrato y ahora se hizo loco', clase: 'negativo' },
  { texto: 'se filtra el agua de lluvia por el techo, todo se moja', clase: 'negativo' },
  { texto: 'los muebles están rotos y sucios, no sirven', clase: 'negativo' },
  { texto: 'la entrada del edificio huele a orines de perro', clase: 'negativo' },
  { texto: 'el vecino de arriba baila tap hasta la madrugada', clase: 'negativo' },
  { texto: 'el agua sale con basura y a veces no sale nada', clase: 'negativo' },
  { texto: 'el internet se desconecta cada 10 minutos, imposible estudiar', clase: 'negativo' },
  { texto: 'el depósito fue de dos meses y no me lo devuelven', clase: 'negativo' },
  { texto: 'hay grafiti y vidrios rotos en la fachada, zona fea', clase: 'negativo' },
  { texto: 'la basura se acumula en el pasillo porque nunca la recogen terrible', clase: 'negativo' },
  { texto: 'el edificio está lleno de grafiti y la entrada huele a orines', clase: 'negativo' },
  { texto: 'los colchones están hundidos y rotos, imposible dormir bien', clase: 'negativo' },
  { texto: 'el arrendador cambió las reglas a los dos meses, ya no incluye servicios', clase: 'negativo' },
  { texto: 'las ventanas no cierran bien y entra el frío y el ruido todo el tiempo', clase: 'negativo' },
  { texto: 'no hay quien se haga cargo de las áreas verdes, están llenas de maleza', clase: 'negativo' },
  { texto: 'el agua sale amarillenta y con mal olor, no me baño ahí', clase: 'negativo' },
  { texto: 'los vecinos de arriba arrastran muebles a media noche, es insoportable', clase: 'negativo' },
  { texto: 'el "internet incluido" es un router que apenas llega a una barra', clase: 'negativo' },
  { texto: 'me cambiaron la cerradura sin avisar y perdí una tarde para que me dieran llave', clase: 'negativo' },

  // ════════════════════════════════════════════════════════════
  // NEGATIVOS CON NEGACIÓN
  // "no recomiendo" | "jamás volvería" | "nunca devolvieron"
  // El tokenizador convierte "no_recomiendo" como token negativo
  // ════════════════════════════════════════════════════════════
  { texto: 'no vale lo que cobran es un abuso de precio', clase: 'negativo' },
  { texto: 'jamas volveria a rentar aqui fue lo peor', clase: 'negativo' },
  { texto: 'tampoco tienen agua caliente es insoportable en invierno', clase: 'negativo' },
  { texto: 'no hay seguridad me siento en peligro todo el tiempo', clase: 'negativo' },
  { texto: 'no recomiendo este lugar para absolutamente nada terrible', clase: 'negativo' },
  { texto: 'no hay agua por las mananas es imposible vivir aqui', clase: 'negativo' },
  { texto: 'nunca devolvieron mi deposito son unos ladrones', clase: 'negativo' },
  { texto: 'no hay agua por las mananas imposible banarse para ir a clases', clase: 'negativo' },
  { texto: 'no cumple con nada de lo prometido fue una mentira', clase: 'negativo' },
  { texto: 'no se puede dormir con tanto ruido es horrible', clase: 'negativo' },
  { texto: 'no funciona el internet desde que llegue nadie lo arregla', clase: 'negativo' },
  { texto: 'no vale ni la mitad de lo que cobran, carísimo', clase: 'negativo' },
  { texto: 'jamás recomendaría este lugar a nadie', clase: 'negativo' },
  { texto: 'tampoco funcionan las ventanas, no cierran bien', clase: 'negativo' },
  { texto: 'no hay quien se haga responsable de las áreas comunes', clase: 'negativo' },
  { texto: 'nunca arreglaron la fuga del baño, todo podrido', clase: 'negativo' },
  { texto: 'no respetan el horario de silencio, ni los fines de semana', clase: 'negativo' },
  { texto: 'sin agua caliente nunca más, se pasan', clase: 'negativo' },
  { texto: 'ni el cerrajero pudo abrir la puerta, pésimo estado', clase: 'negativo' },
  { texto: 'no hay internet aunque lo prometen en el anuncio, mentira', clase: 'negativo' },
  { texto: 'jamas volvería aunque me paguen', clase: 'negativo' },
  { texto: 'no respetan el horario de silencio ni después de las 11pm', clase: 'negativo' },
  { texto: 'nunca vi tanta desorganización, el arrendador no sabe ni cuánto cobra', clase: 'negativo' },
  { texto: 'sin agua caliente en invierno, imposible vivir aquí', clase: 'negativo' },
  { texto: 'no hay forma de contactar al dueño cuando se va la luz', clase: 'negativo' },
  { texto: 'jamás me devolvieron mi depósito, tuve que amenazar con demanda', clase: 'negativo' },
  { texto: 'tampoco funcionan los contactos de la cocina, todo es un desastre', clase: 'negativo' },
  { texto: 'nada de lo que prometen en el anuncio es cierto, todo es mentira', clase: 'negativo' },

  // ════════════════════════════════════════════════════════════
  // NEGATIVOS MIXTOS → CONCLUSIÓN NEGATIVA
  // Tienen aspectos positivos (ubicación, espacio) pero los
  // problemas dominan y la conclusión final es negativa
  // Ejemplo: "amplio pero baño mal estado, no recomendaría"
  // ════════════════════════════════════════════════════════════
  { texto: 'aunque esta bien ubicado el bano tiene fugas y no lo recomendaria', clase: 'negativo' },
  { texto: 'el cuarto es amplio pero hay problemas constantes con el agua no recomiendo', clase: 'negativo' },
  { texto: 'en general no lo recomendaria tiene demasiados problemas para el precio', clase: 'negativo' },
  { texto: 'a pesar de la buena ubicacion no lo recomendaria por los problemas', clase: 'negativo' },
  { texto: 'internet rapido pero el lugar esta sucio y hay problemas con la luz malo', clase: 'negativo' },
  { texto: 'la habitacion es grande pero hay cucarachas y el bano esta roto horrible', clase: 'negativo' },
  { texto: 'la zona es buena pero el dueno no resuelve nada y cobran de mas terrible', clase: 'negativo' },
  { texto: 'bonita zona pero interior deteriorado con humedad y mal olor no recomiendo', clase: 'negativo' },
  { texto: 'buena ubicacion pero el lugar esta sucio y deteriorado no volveria', clase: 'negativo' },
  { texto: 'bien ubicado pero mucho ruido vecinos conflictivos no lo recomendaria', clase: 'negativo' },
  { texto: 'departamento amplio bien ubicado pero bano mal estado y problemas de agua no recomendaria', clase: 'negativo' },
  { texto: 'aunque el precio es bajo, el lugar está tan sucio que no vale la pena', clase: 'negativo' },
  { texto: 'el cuarto es grande pero tiene goteras y hueles a humedad, no lo tomes', clase: 'negativo' },
  { texto: 'la ubicación es céntrica pero el ruido es insoportable, no lo recomiendo', clase: 'negativo' },
  { texto: 'el arrendador es amable pero nunca resuelve nada, horrible experiencia', clase: 'negativo' },
  { texto: 'tiene buena vista pero los vecinos son conflictivos, mejor buscar otro', clase: 'negativo' },
  { texto: 'el edificio tiene seguridad pero los guardias duermen, inseguro', clase: 'negativo' },
  { texto: 'la cocina está bien pero el baño parece una pocilga, no volvería', clase: 'negativo' },
  { texto: 'el internet es rápido pero se va la luz a cada rato, muy molesto', clase: 'negativo' },
  { texto: 'el departamento es bonito pero la zona es peligrosa, no lo recomiendo', clase: 'negativo' },
  { texto: 'el dueño es flexible pero el contrato tenía trampa, al final perdí dinero', clase: 'negativo' },
  { texto: 'el arrendador es amable pero la casa se cae a pedazos, no vale la pena', clase: 'negativo' },
  { texto: 'la ubicación es céntrica pero el ruido es ensordecedor 24/7, no lo recomiendo', clase: 'negativo' },
  { texto: 'el cuarto es amplio pero tiene moho en las paredes y te hace toser, fatal', clase: 'negativo' },
  { texto: 'la zona es bonita pero el edificio es una pocilga llena de cucarachas', clase: 'negativo' },
  { texto: 'el precio es bajo pero tienes que comprar tu propio colchón y refrigerador, no vale', clase: 'negativo' },
  { texto: 'el internet es rápido pero se va la luz cada dos horas, imposible trabajar', clase: 'negativo' },
  { texto: 'el dueño es flexible con las visitas pero el edificio es muy inseguro, asaltaron a mi amigo', clase: 'negativo' },

  // ════════════════════════════════════════════════════════════
  // NEGATIVOS CON SARCASMO / IRONÍA
  // Palabras aparentemente positivas ("excelente", "perfecto",
  // "ideal") usadas irónicamente en contexto negativo
  // Ejemplo: "excelente si te gusta vivir sin agua"
  // ════════════════════════════════════════════════════════════
  { texto: 'maravilloso lugar donde el arrendador desaparece cuando hay problemas', clase: 'negativo' },
  { texto: 'perfecto si disfrutas el ruido toda la noche sin poder dormir', clase: 'negativo' },
  { texto: 'si te gusta vivir sin agua este es tu lugar excelente para deshidratarte', clase: 'negativo' },
  { texto: 'excelente opcion si buscas pagar mucho por recibir muy poco', clase: 'negativo' },
  { texto: 'ideal para quien quiera convivir con cucarachas y ratas de mascota', clase: 'negativo' },
  { texto: 'qué lujo vivir sin agua caliente en invierno, sensación térmica única', clase: 'negativo' },
  { texto: 'maravilloso despertar con música de los vecinos a las 3 am', clase: 'negativo' },
  { texto: 'si te encanta pagar caro por un cuchitril, este es tu sitio', clase: 'negativo' },
  { texto: 'excelente oportunidad para hacer ejercicio subiendo 5 pisos sin elevador', clase: 'negativo' },
  { texto: 'ideal para quienes sueñan con bañarse con agua helada cada mañana', clase: 'negativo' },
  { texto: 'un lujo tener mascotas gratis (cucarachas y ratones) incluídas', clase: 'negativo' },
  { texto: 'siempre quise vivir en una obra de teatro con vecinos actores gritando', clase: 'negativo' },
  { texto: 'fantástico que el arrendador te ignore, te ayuda a ser independiente', clase: 'negativo' },
  { texto: 'qué privilegio que se vaya la luz justo cuando vas a cenar', clase: 'negativo' },
  { texto: 'espectacular ver cómo se cae el techo poco a poco, arte en movimiento', clase: 'negativo' },
  { texto: 'qué maravilla tener que despertarme a las 5am para alcanzar agua', clase: 'negativo' },
  { texto: 'excelente el gimnasio incluido: una caminadora oxidada y dos pesas', clase: 'negativo' },
  { texto: 'ideal para amantes de las sorpresas: nunca sabes si habrá luz o agua', clase: 'negativo' },
  { texto: 'me encanta que el arrendador sea tan místico, desaparece por semanas', clase: 'negativo' },
  { texto: 'fantástico el sistema de seguridad: la puerta del edificio siempre abierta', clase: 'negativo' },
  { texto: 'un verdadero lujo pagar por un cuarto que parece de película de terror', clase: 'negativo' },
  { texto: 'siempre quise vivir en una selva urbana: las cucarachas son mis roomies', clase: 'negativo' },
  { texto: 'qué bien que el internet sea tan veloz... para cargar una página en 5 minutos', clase: 'negativo' },


  // ════════════════════════════════════════════════════════════
  // NEUTRALES / AMBIGUOS
  // Opiniones balanceadas, comparaciones relativas, condiciones,
  // frases ambiguas como "cumple con lo básico"
  // ════════════════════════════════════════════════════════════
  { texto: 'cumple con lo basico nada especial ni bueno ni malo', clase: 'neutral' },
  { texto: 'hay cosas por mejorar pero en general es aceptable', clase: 'neutral' },
  { texto: 'la habitacion es comoda pero muy pequena para dos personas', clase: 'neutral' },
  { texto: 'el arrendador responde pero a veces tarda varios dias', clase: 'neutral' },
  { texto: 'no es perfecto pero tampoco un desastre es del monton', clase: 'neutral' },
  { texto: 'el arrendador es amable pero no resuelve los problemas rapido', clase: 'neutral' },
  { texto: 'cumple con lo basico nada especial mas o menos', clase: 'neutral' },
  { texto: 'las instalaciones estan pasables necesitan algo de mantenimiento', clase: 'neutral' },
  { texto: 'aceptable para una estancia temporal mas o menos', clase: 'neutral' },
  { texto: 'tiene cosas buenas y cosas malas en general aceptable', clase: 'neutral' },
  { texto: 'regular sin grandes problemas ni ventajas mas o menos', clase: 'neutral' },
  { texto: 'hay cosas por mejorar pero funciona en general', clase: 'neutral' },
  { texto: 'el internet es medio lento pero para cosas basicas funciona', clase: 'neutral' },
  { texto: 'para el precio esta mas o menos bien mas o menos', clase: 'neutral' },
  { texto: 'la zona es buena pero el edificio necesita mantenimiento', clase: 'neutral' },
  { texto: 'mas o menos lo que esperaba nada que destacar', clase: 'neutral' },
  { texto: 'el precio es justo ni muy barato ni muy caro normal', clase: 'neutral' },
  { texto: 'el bano esta bien pero la cocina podria mejorar un poco', clase: 'neutral' },
  { texto: 'hay ruido a veces pero no es insoportable', clase: 'neutral' },
  { texto: 'el precio podria ser menor pero no esta tan mal', clase: 'neutral' },
  { texto: 'sirve para lo basico sin extras en general', clase: 'neutral' },
  { texto: 'el cuarto estaba limpio aunque las areas comunes podrian mejorar', clase: 'neutral' },
  { texto: 'el precio es justo por lo basico que ofrece', clase: 'neutral' },
  { texto: 'cumple su funcion aunque con algunos inconvenientes menores', clase: 'neutral' },
  { texto: 'podria mejorar pero es aceptable mas o menos', clase: 'neutral' },
  { texto: 'sirve para lo basico sin extras mas o menos', clase: 'neutral' },
  { texto: 'el arrendador tarda en responder pero al final responde', clase: 'neutral' },
  { texto: 'el agua falla ocasionalmente pero no es frecuente', clase: 'neutral' },
  { texto: 'no es perfecto pero tampoco terrible en general', clase: 'neutral' },
  { texto: 'el agua falla ocasionalmente pero no es muy frecuente', clase: 'neutral' },
  { texto: 'tiene cosas buenas y malas en general mas o menos', clase: 'neutral' },
  { texto: 'bien ubicado pero el edificio esta un poco descuidado', clase: 'neutral' },
  { texto: 'si buscas algo basico y economico puede servir si no busca otro', clase: 'neutral' },
  { texto: 'para el precio que tiene no esta tan mal podria ser peor', clase: 'neutral' },
  { texto: 'no es el peor lugar que he visto pero tampoco el mejor', clase: 'neutral' },
  { texto: 'hay cosas por mejorar pero funciona mas o menos', clase: 'neutral' },
  { texto: 'no es el mejor lugar pero tampoco el peor que he visto', clase: 'neutral' },
  { texto: 'no es perfecto pero tampoco terrible mas o menos', clase: 'neutral' },
  { texto: 'regular sin grandes quejas pero tampoco elogios', clase: 'neutral' },
  { texto: 'aceptable para una estancia temporal en general', clase: 'neutral' },
  { texto: 'comparado con otros lugares de la zona este esta bien', clase: 'neutral' },
  { texto: 'para el precio que tiene esta mas o menos bien', clase: 'neutral' },
  { texto: 'hay dias buenos y dias malos en general se puede vivir aqui', clase: 'neutral' },
  { texto: 'el dueno es amable pero no siempre resuelve los problemas rapido', clase: 'neutral' },
  { texto: 'podria mejorar pero es aceptable en general', clase: 'neutral' },
  { texto: 'ni muy bueno ni muy malo para una estancia corta sirve', clase: 'neutral' },
  { texto: 'lo recomendaria solo si no encuentras algo mejor en la zona', clase: 'neutral' },
  { texto: 'la limpieza es regular a veces limpio a veces no tanto', clase: 'neutral' },
  { texto: 'hay algo de ruido pero no es insoportable se puede vivir', clase: 'neutral' },
  { texto: 'el lugar es sencillo sin lujos pero funcional para vivir', clase: 'neutral' },
  { texto: 'algunos servicios fallan de vez en cuando pero no siempre', clase: 'neutral' },
  { texto: 'el wifi funciona bien a veces lento pero en general aceptable', clase: 'neutral' },
  { texto: 'a veces falla el agua pero generalmente esta bien', clase: 'neutral' },
  { texto: 'no tiene todos los servicios prometidos pero lo basico si', clase: 'neutral' },
  { texto: 'ni muy bueno ni muy malo mas o menos', clase: 'neutral' },
  { texto: 'el cuarto es basico pero limpio y funcional', clase: 'neutral' },
  { texto: 'mas o menos como esperaba nada que me sorprendiera bien ni mal', clase: 'neutral' },
  { texto: 'cumple con lo basico nada especial en general', clase: 'neutral' },
  { texto: 'podria estar mejor mantenido pero no esta en mal estado', clase: 'neutral' },
  { texto: 'nada sorprendente pero tampoco tiene grandes problemas', clase: 'neutral' },
  { texto: 'un poco caro para lo que ofrece pero no terrible', clase: 'neutral' },
  { texto: 'el precio esta bien pero hay cosas por mejorar', clase: 'neutral' },
  { texto: 'para el precio esta mas o menos bien en general', clase: 'neutral' },
  { texto: 'la ubicacion es buena pero el cuarto es muy pequeno', clase: 'neutral' },
  { texto: 'ni muy bueno ni muy malo en general', clase: 'neutral' },
  { texto: 'la comunicacion con el dueno es regular mejora y empeora', clase: 'neutral' },
  { texto: 'de dia tranquilo de noche algo de ruido de la calle', clase: 'neutral' },
  { texto: 'el internet es lento pero el resto del lugar esta bien', clase: 'neutral' },
  { texto: 'tiene cosas buenas y malas en general en general', clase: 'neutral' },
  { texto: 'la zona es tranquila de dia pero de noche algo insegura', clase: 'neutral' },
  { texto: 'sirve para lo que necesito ni mas ni menos', clase: 'neutral' },
  { texto: 'regular sin grandes problemas ni ventajas en general', clase: 'neutral' },
  { texto: 'la seguridad es regular hay vigilante solo en el dia', clase: 'neutral' },
  { texto: 'tiene sus pros y sus contras como cualquier lugar', clase: 'neutral' },
  { texto: 'el lugar está bien sin más, no esperaba mucho y cumplió', clase: 'neutral' },
  { texto: 'regular, tiene lo indispensable pero sin lujos', clase: 'neutral' },
  { texto: 'el precio está en el rango de la zona, ni barato ni caro', clase: 'neutral' },
  { texto: 'el vecino de arriba aveces hace ruido, pero no siempre', clase: 'neutral' },
  { texto: 'el agua falla un par de veces al mes, nada grave', clase: 'neutral' },
  { texto: 'el internet sirve, pero aveces se ralentiza por las noches', clase: 'neutral' },
  { texto: 'la ubicación es práctica pero el edificio es viejo', clase: 'neutral' },
  { texto: 'el arrendador responde, pero no es muy rápido', clase: 'neutral' },
  { texto: 'el departamento es funcional aunque feo estéticamente', clase: 'neutral' },
  { texto: 'la limpieza en las áreas comunes es intermitente', clase: 'neutral' },
  { texto: 'no es el mejor pero cumple con lo mínimo', clase: 'neutral' },
  { texto: 'tiene cosas buenas y malas, como cualquier lado', clase: 'neutral' },
  { texto: 'puede ser una opción si no encuentras algo mejor', clase: 'neutral' },
  { texto: 'el ruido de la calle se escucha pero te acostumbras', clase: 'neutral' },
  { texto: 'la calefacción funciona a veces, a veces no', clase: 'neutral' },
  { texto: 'el baño está bien, pero la regadera tiene poca presión', clase: 'neutral' },
  { texto: 'la cocina es pequeña pero útil', clase: 'neutral' },
  { texto: 'el contrato es claro, pero faltaron algunos detalles', clase: 'neutral' },
  { texto: 'el edificio tiene seguridad, pero no es muy estricta', clase: 'neutral' },
  { texto: 'los vecinos son normales, no molestan ni ayudan', clase: 'neutral' },
  { texto: 'el internet es aceptable para trabajo básico', clase: 'neutral' },
  { texto: 'la luz se va de vez en cuando, pero regresa pronto', clase: 'neutral' },
  { texto: 'el lugar es sencillo, sin grandes quejas ni elogios', clase: 'neutral' },
  { texto: 'la zona es tranquila el día, pero de noche hay algo de movimiento', clase: 'neutral' },
  { texto: 'el transporte público queda cerca pero no es tan frecuente', clase: 'neutral' },
  { texto: 'el cuarto es de tamaño regular, ni pequeño ni grande', clase: 'neutral' },
  { texto: 'los muebles están viejos pero sirven', clase: 'neutral' },
  { texto: 'la atención del dueño es regular, ni buena ni mala', clase: 'neutral' },
  { texto: 'el precio es justo por lo que ofrece, nada especial', clase: 'neutral' },
  { texto: 'es un lugar más del montón, sin sorpresas', clase: 'neutral' },
  { texto: 'ni fu ni fa, el lugar cumple sin más', clase: 'neutral' },
  { texto: 'tiene ventajas y desventajas, depende de lo que busques', clase: 'neutral' },
  { texto: 'el precio está en el promedio, no es ni una ganga ni un robo', clase: 'neutral' },
  { texto: 'el dueño es correcto, aunque a veces tarda en contestar', clase: 'neutral' },
  { texto: 'las instalaciones son normales, nada que destacar', clase: 'neutral' },
  { texto: 'la limpieza es regular, algunas semanas bien otras no', clase: 'neutral' },
  { texto: 'el ruido se escucha pero no molesta demasiado', clase: 'neutral' },
  { texto: 'la ubicación es aceptable, no es la mejor pero tampoco mala', clase: 'neutral' },
  { texto: 'el contrato es estándar, sin sorpresas ni beneficios', clase: 'neutral' },
  { texto: 'se puede vivir, pero no esperes lujos', clase: 'neutral' },
  { texto: 'el cuarto es funcional aunque le falta un poco de mantenimiento', clase: 'neutral' },
  { texto: 'la ubicación es aceptable, no es la mejor pero tampoco mala', clase: 'neutral' },
  { texto: 'el arrendador es correcto, ni muy amable ni muy grosero', clase: 'neutral' },
  { texto: 'el internet sirve para lo básico, no esperes streaming en 4k', clase: 'neutral' },
  { texto: 'la limpieza de las áreas comunes es irregular, a veces bien a veces no', clase: 'neutral' },
  { texto: 'el precio está en el punto medio de la zona, no es una ganga ni un robo', clase: 'neutral' },
  { texto: 'los vecinos son tranquilos la mayoría del tiempo, solo festejan fines de semana', clase: 'neutral' },
  { texto: 'el edificio es viejo pero está pintado y se ve decente', clase: 'neutral' },
  { texto: 'el contrato es el estándar de la zona, sin letras chiquitas raras', clase: 'neutral' },
  { texto: 'se puede vivir sin mayores problemas, aunque no hay lujos', clase: 'neutral' },
  { texto: 'ni fu ni fa, el lugar cumple pero no emociona', clase: 'neutral' },
  { texto: 'tiene sus pros y sus contras como cualquier alojamiento económico', clase: 'neutral' },
]

// ── Normalizar texto ─────────────────────────────────────────────
const normalizar = (texto) =>
  texto
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s]/g, ' ')
    .trim()

// ── Tokenizar con manejo de negaciones ──────────────────────────
const NEGACIONES = new Set(['no', 'ni', 'sin', 'jamas', 'nunca', 'tampoco', 'nada', 'nadie'])

const tokenizar = (texto) => {
  const palabras = normalizar(texto).split(/\s+/).filter(w => w.length > 1)
  const tokens = []
  let negar = false
  for (let i = 0; i < palabras.length; i++) {
    const palabra = palabras[i]
    if (NEGACIONES.has(palabra)) { negar = true; continue }
    if (palabra.length <= 2) continue
    tokens.push(negar ? `no_${palabra}` : palabra)
    negar = false
  }
  return tokens
}

// ── Entrenar Naive Bayes ─────────────────────────────────────────
const CLASES = ['positivo', 'negativo', 'neutral']
const frecuencias = {}
const totalPorClase = {}
const docsPorClase  = {}
const totalDocs = DATOS.length

CLASES.forEach(c => {
  frecuencias[c]   = {}
  totalPorClase[c] = 0
  docsPorClase[c]  = 0
})

DATOS.forEach(({ texto, clase }) => {
  docsPorClase[clase]++
  tokenizar(texto).forEach(p => {
    frecuencias[clase][p] = (frecuencias[clase][p] || 0) + 1
    totalPorClase[clase]++
  })
})

const vocabulario = new Set(DATOS.flatMap(d => tokenizar(d.texto)))
const V = vocabulario.size

// ── Clasificar con Naive Bayes (suavizado de Laplace) ────────────
const analizarSentimiento = (texto) => {
  if (!texto || texto.trim().length === 0) return 'neutral'
  const palabras = tokenizar(texto)
  if (palabras.length === 0) return 'neutral'

  let mejorClase = 'neutral'
  let mejorScore = -Infinity

  CLASES.forEach(clase => {
    let score = Math.log(docsPorClase[clase] / totalDocs)
    palabras.forEach(palabra => {
      const count = frecuencias[clase][palabra] || 0
      score += Math.log((count + 1) / (totalPorClase[clase] + V))
    })
    if (score > mejorScore) {
      mejorScore = score
      mejorClase = clase
    }
  })

  return mejorClase
}

module.exports = { analizarSentimiento }