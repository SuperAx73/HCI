Feature: Un prestador publica un servicio
  Como prestador quiero publicar un servicio para que los clientes puedan encontrarlo,
  pero solo si ya cumplo los requisitos de verificación.

  Scenario: Un prestador elegible publica un servicio y un cliente lo encuentra
    Given un prestador elegible llamado "Daniela Ponce" con teléfono "6142719583"
    When publica un servicio de "Pintura" en la zona "Panamericana"
    Then la publicación obtiene un folio
    And un cliente que busca "Pintura" en la zona "Panamericana" encuentra la publicación
    And un cliente que busca por el nombre "daniela" también la encuentra

  Scenario: Un prestador sin verificación aprobada no puede publicar
    Given un prestador NO elegible llamado "Jorge Baeza"
    When intenta publicar un servicio de "Pintura" en la zona "Las Granjas"
    Then la publicación es rechazada
    And un cliente que busca "Pintura" en la zona "Las Granjas" no encuentra ninguna publicación
