/*

  Osmium Javascript Config

  Uses osm2shape framework for exporting OSM data to jsonfile.
  (see also osm2shape.js)

  Create shape- and json-files for a river map.
  
  Run with: osmjs -2 -m -l sparsetable -i osm2shape.js -j config_river_p1.js <input file>

*/

// ---- shapefiles ----
shapefile('waterways').
    type(LINE).
    column('id', INTEGER, 10).
    column('type', STRING, 32).
    column('name', STRING, 32);

shapefile('water').
    type(POLYGON).
    column('id', INTEGER, 10).
    column('type', STRING, 32).
    column('name', STRING, 32);

// ---- json files
jsonfile('wways');
jsonfile('wtr');


// ---- rules ----

way('waterway', 'stream|river|ditch|canal|drain').
    output('waterways').
        attr('type', 'waterway').
        attr('name').
        json('wways');

area('waterway', 'riverbank').
    output('water').
        attr('type', 'waterway').
        attr('name').
        json('wtr');

