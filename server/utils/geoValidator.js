
/**
 * Utility for GIS operations in PVMS
 */
const GeoValidator = {
  /**
   * Ray-casting algorithm to check if a point is inside a polygon
   * @param {number} lat - Latitude
   * @param {number} lng - Longitude
   * @param {Array} polygon - Array of [lng, lat] arrays (GeoJSON style)
   */
  isPointInPolygon(lat, lng, polygon) {
    let x = lng, y = lat;
    let inside = false;
    for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
      let xi = polygon[i][0], yi = polygon[i][1];
      let xj = polygon[j][0], yj = polygon[j][1];

      let intersect = ((yi > y) !== (yj > y)) &&
        (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
      if (intersect) inside = !inside;
    }
    return inside;
  }
};

module.exports = GeoValidator;
