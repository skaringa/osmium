/*

  Osmium Javascript Config file

  Uses osm2shape framework for exporting OSM data to shapefiles.
  (see also osm2shape.js)


  Create shapefiles for a railway map.
*/

// ---- shapefiles ----

shapefile('railways').
    type(LINE).
    column('id', STRING, 12).
    column('name', STRING, 32).
    column('service', STRING, 32).
    column('usage', STRING, 32).
    column('electrified', STRING, 32); 

// ---- rules ----
way('railway', 'rail|narrow_gauge').
    output('railways').
        attr('name').
        attr('service').
        attr('usage').
        attr('electrified');

