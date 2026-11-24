Feature: Un cliente busca un prestador
  Como cliente quiero encontrar prestadores aunque no recuerde acentos exactos,
  o solo tenga el folio que me compartieron.

  Background:
    Given hay publicaciones de "Víctor Holguín" (folio 1016, Jardinería, Campestre Washington)
    And hay publicaciones de "Raúl Chávez" (folio 1001, Electricidad, Centro)

  Scenario: Buscar por nombre sin escribir acentos
    When el cliente busca "victor holguin"
    Then encuentra la publicación con folio 1016
    And no encuentra la publicación con folio 1001

  Scenario: Buscar por folio exacto
    When el cliente busca "1001"
    Then encuentra la publicación con folio 1001
    And no encuentra la publicación con folio 1016

  Scenario: Buscar por oficio sin texto libre
    When el cliente filtra por el oficio "Jardinería"
    Then encuentra la publicación con folio 1016
    And no encuentra la publicación con folio 1001

  Scenario: Una búsqueda sin coincidencias no revienta, solo regresa vacío
    When el cliente busca "nadie se llama así"
    Then no encuentra ninguna publicación
