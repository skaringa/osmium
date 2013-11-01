/*

  Osmium Javascript Config file

  Uses osm2shape framework for exporting OSM data to shapefiles.
  (see also osm2shape.js)


  Create shapefiles to get imported into MMO.
*/

var ENCODING = "ISO-8859-1";

// ---- shapefiles ----
shapefile('places').
    type(POINT).
    encoding(ENCODING).
    column('TYPE', STRING, 32).
    column('NAME', STRING, 32);

shapefile('roads').
    type(LINE).
    encoding(ENCODING).
    column('TYPE', STRING, 32).
    column('NAME', STRING, 32);

shapefile('tracks').
    type(LINE).
    encoding(ENCODING).
    column('TYPE', STRING, 32).
    column('NAME', STRING, 32);

shapefile('paths').
    type(LINE).
    encoding(ENCODING).
    column('NAME', STRING, 32);

shapefile('cycleways').
    type(LINE).
    encoding(ENCODING).
    column('NAME', STRING, 32);

shapefile('railways').
    type(LINE).
    encoding(ENCODING).
    column('NAME', STRING, 32);

shapefile('waterways').
    type(LINE).
    encoding(ENCODING).
    column('TYPE', STRING, 32).
    column('NAME', STRING, 32);

shapefile('water').
    type(POLYGON).
    encoding(ENCODING).
    column('TYPE', STRING, 32).
    column('NAME', STRING, 32);

shapefile('natural').
    type(POLYGON).
    encoding(ENCODING).
    column('TYPE', STRING, 32).
    column('NAME', STRING, 32);

shapefile('landuse').
    type(POLYGON).
    encoding(ENCODING).
    column('TYPE', STRING, 32).
    column('NAME', STRING, 32);

shapefile('natural_pois').
    type(POINT).
    encoding(ENCODING).
    column('TYPE', STRING, 32).
    column('SUBTYPE', STRING, 32).
    column('NAME', STRING, 32).
    column('LAT', DOUBLE, 11, 6).
    column('LON', DOUBLE, 11, 6);

shapefile('misc_pois').
    type(POINT).
    encoding(ENCODING).
    column('TYPE', STRING, 32).
    column('SUBTYPE', STRING, 32).
    column('NAME', STRING, 32).
    column('LAT', DOUBLE, 11, 6).
    column('LON', DOUBLE, 11, 6);

/*
shapefile('railway_stations').
    type(POINT).
    column('id', INTEGER, 10).
    column('NAME', STRING, 32);

shapefile('powerlines').
    type(LINE).
    column('id', INTEGER, 10).
    column('NAME', STRING, 32);

shapefile('boundaries').
    type(POLYGON).
    column('id', INTEGER, 10).
    column('level', INTEGER, 2).
    column('NAME', STRING, 32);

shapefile('protected_areas').
    type(POLYGON).
    column('id', INTEGER, 10).
    column('TYPE', STRING, 32).
    column('NAME', STRING, 32);


shapefile('glaciers').
    type(POLYGON).
    column('id', INTEGER, 10).
    column('NAME', STRING, 32);
*/

// ---- rules ----
node('place', 'hamlet|village|town|city').
    output('places').
        attr('TYPE', 'place').
        attr('NAME', 'name');

way('highway', 'motorway|trunk|primary|secondary|motorway_link|trunk_link|primary_link|secondary_link|living_street|residential|road|tertiary|unclassified|service').
    output('roads').
        attr('TYPE', 'highway').
        attr('NAME', 'name');

way('highway', 'track').
    output('tracks').
        attr('TYPE', 'tracktype').
        attr('NAME', 'name');

way('highway', 'path|footway').
    output('paths').
        attr('NAME', 'name');

way('highway', 'cycleway').
    output('cycleways').
        attr('NAME', 'name');

way('railway', 'rail').
    output('railways').
        attr('NAME', 'name');

way('waterway', 'stream|river|ditch|canal|drain').
    output('waterways').
        attr('TYPE', 'waterway').
        attr('NAME', 'name');

area('natural', 'water').
    output('water').
        attr('TYPE', 'natural').
        attr('NAME', 'name');

area('landuse', 'reservoir').
    output('water').
        attr('TYPE', 'landuse').
        attr('NAME', 'name');

area('waterway', 'riverbank').
    output('water').
        attr('TYPE', 'waterway').
        attr('NAME', 'name');

area('natural', 'park|forest').
    output('natural').
        attr('TYPE', 'natural').
        attr('NAME', 'name');

area('landuse', 'park|forest').
    output('natural').
        attr('TYPE', 'landuse').
        attr('NAME', 'name');

area('landuse', 'grass|residential|farm|meadow|farmland|industrial|farmyard|cemetery|commercial|quarry|orchard|vineyard|allotments|retail|construction|recreation_ground|village_green').
    output('landuse').
        attr('TYPE', 'landuse').
        attr('NAME', 'name');

node('natural', 'tree|peak|spring').
    output('natural_pois').
        attr('TYPE', 'natural').
        attr('NAME', 'name').
        attr('LAT', function(osm_object) {return osm_object.geom.lat}).
        attr('LON', function(osm_object) {return osm_object.geom.lon});

node('amenity', 'restaurant').
    output('misc_pois').
        attr('TYPE', 'amenity').
        attr('SUBTYPE', 'cuisine').
        attr('NAME', 'name').
        attr('LAT', function(osm_object) {return osm_object.geom.lat}).
        attr('LON', function(osm_object) {return osm_object.geom.lon});

node('tourism', 'hotel').
    output('misc_pois').
        attr('TYPE', 'tourism').
        attr('SUBTYPE', 'stars').
        attr('NAME', 'name').
        attr('LAT', function(osm_object) {return osm_object.geom.lat}).
        attr('LON', function(osm_object) {return osm_object.geom.lon});

/*
node('railway', 'station').
    output('railway_stations').
        attr('NAME');


way('power', 'line').
    output('powerlines').
        attr('NAME');

area('boundary', 'administrative').
    output('boundaries').
        attr('level', 'admin_level').
        attr('NAME');

area('boundary', 'national_park|national_forest|protected_area').
    output('protected_areas').
        attr('TYPE', 'boundary').
        attr('NAME');


area('natural', 'glacier').
    output('glaciers').
        attr('NAME');

*/