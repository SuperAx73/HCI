Feature: Reseñas de clientes
  Como cliente quiero dejar una reseña honesta sobre un prestador,
  y como prestador no debo poder manipular mis propias reseñas.

  Background:
    Given existe una publicación de "Daniela Ponce" con folio 1007

  Scenario: Un cliente deja una reseña
    When el cliente "Marisol" califica con 5 estrellas y comenta "Excelente trabajo"
    Then la reseña queda guardada con el nombre del cliente
    And el promedio de la publicación es 5

  Scenario: Un prestador no puede reseñar su propia publicación
    When el prestador "Daniela Ponce" intenta calificarse a sí misma con 5 estrellas
    Then la reseña es rechazada

  Scenario: Editar una reseña actualiza en vez de duplicar
    Given el cliente "Marisol" ya calificó con 3 estrellas y comentó "Estuvo bien"
    When el cliente "Marisol" vuelve a calificar con 5 estrellas y comenta "Mejor de lo que pensé"
    Then solo existe una reseña de "Marisol" para esa publicación
    And la reseña actualizada tiene 5 estrellas
