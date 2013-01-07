/*

  Osmium Javascript Config

  Uses osm2shape framework for exporting OSM data to shapefiles.
  (see also osm2shape.js)

  Create shapefiles for a river map.
*/

// ---- shapefiles ----

shapefile('places').
    type(POINT).
    column('id', INTEGER, 10).
    column('type', STRING, 32).
    column('name', STRING, 32);

shapefile('roads').
    type(LINE).
    column('id', INTEGER, 10).
    column('type', STRING, 32).
    column('name', STRING, 32).
    column('ref', STRING, 16).
    column('oneway', BOOL).
    column('maxspeed', INTEGER, 3);

shapefile('railways').
    type(LINE).
    column('id', INTEGER, 10).
    column('name', STRING, 32);

shapefile('waterways').
    type(LINE).
    column('id', INTEGER, 10).
    column('type', STRING, 32).
    column('name', STRING, 32).
    column('rsystem', STRING, 32);

shapefile('water').
    type(POLYGON).
    column('id', INTEGER, 10).
    column('type', STRING, 32).
    column('name', STRING, 32);

// ---- json files
jsonfile('wways');


// ---- functions ----

var rsystem = function(id, tags) {
    if (tags['name'] == 'Rhein' || tags['name'] == 'Main') {
        return 'rhein';
    }
    return '';
};


// ---- rules ----

node('place', 'town|city').
    output('places').
        attr('type', 'place').
        attr('name');

way('waterway', 'stream|river|ditch|canal|drain').
    output('waterways').
        attr('type', 'waterway').
        attr('name').
        attr('rsystem', rsystem).
    json('wways');

way('highway', 'motorway|motorway_link').
    output('roads').
        attr('type', 'highway').
        attr('ref').
        attr('name').
        attr('oneway').
        attr('maxspeed');

way('railway', 'rail').
    output('railways').
        attr('name');

area('natural', 'water').
    output('water').
        attr('type', 'natural').
        attr('name');

area('landuse', 'reservoir').
    output('water').
        attr('type', 'landuse').
        attr('name');

area('waterway', 'riverbank').
    output('water').
        attr('type', 'waterway').
        attr('name');

