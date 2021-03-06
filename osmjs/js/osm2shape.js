/*

  Osmium Javascript Example

  Framework for exporting OSM data to shapefiles.
  osm2shape.js

  (see also config.js)

  run with: osmjs -2 -m -l sparsetable -i osm2shape.js -j config.js OSMFILE

*/

// shapefile geometry types
var POINT   = 'point';
var LINE    = 'line';
var POLYGON = 'polygon';

// shapefile attribute types
var INTEGER = 'integer';
var STRING  = 'string';
var DOUBLE  = 'double';
var BOOL    = 'bool';

var files = {};
var jsonfiles = {};
var idfiles = {};

var rules = {
    node: [],
    way:  [],
    area: []
};

function shapefile(name) {
    var shp = {
        name: name,
        fname: name,
        gtype: 'point',
        enc: 'UTF-8',
        columns: [],
        column_names: {},
        type: function(type) {
            if (type != 'point' && type != 'line' && type != 'polygon') {
                print('Unknown shapefile geometry type: ' + type);
                exit(1);
            }
            this.gtype = type;
            return this;
        },
        encoding: function(enc) {
            this.enc = enc.toUpperCase();
            return this;
        },
        column: function(name, type, size, decimals) {
            if (type != 'integer' && type != 'string' && type != 'bool' && type != 'double') {
                print('Unknown attribute type: ' + type);
                throw("config error");
            }
            if (size == null) {
                size = 1;
            }
            if (size < 0) {
                print('Size not allowed: ' + size);
            }
            if (decimals == null) {
                decimals = 0;
            }
            var column = { name: name, type: type, size: size, decimals: decimals };
            this.columns.push(column);
            this.column_names[name] = column;
            return this;
        },
        filename: function(name) {
            this.fname = name;
            return this;
        }
    };
    files[name] = shp;
    return shp;
}


function jsonfile(name) {
    var json = {
        name: name,
        fname: name + ".json",
    };
    jsonfiles[name] = json;
    return json;
}

function idcsvfile(name) {
    var idf = {
        name: name,
        fname: name + ".csv",
    };
    idfiles[name] = idf;
    return idf;
}


function rule(type, key, value) {
    if (value == '*') {
        value = null;
    }
    var rule = {
        type: type,
        key: key,
        value: value,
        file: null,
        jsonfile: null,
        idfile: null,
        attrs: {},
        output: function(name) {
            if (! files[name]) {
                print("Unknown shapefile: " + name);
                throw("config error");
            }
            this.file = name;
            return this;
        },
        attr: function(attr, key) {
            if (this.file == null) {
                print("Output file not set for rule " + key + '=' + value);
                throw("config error");
            }

            if (! files[this.file].column_names[attr]) {
                print("There is no column named '" + attr + "' in output file '" + this.file + "'");
                throw("config error");
            }

            if (key == null) {
                key = attr;
            }
            this.attrs[attr] = key;
            return this;
        },
        json: function(name) {
            if (! jsonfiles[name]) {
                print("Unknown jsonfile: " + name);
                throw("config error");
            }
            this.jsonfile = name;
            return this;
        },
        idcsv: function(name) {
            if (! idfiles[name]) {
                print("Unknown idfile: " + name);
                throw("config error");
            }
            this.idfile = name;
            return this;
        }
    };
    rules[type].push(rule);
    return rule;
}

function node(key, value) {
    return rule('node', key, value);
}

function way(key, value) {
    return rule('way', key, value);
}

function area(key, value) {
    return rule('area', key, value);
}

function build_func(key, value) {
    if (value == null) {
        return function(obj) {
            return !!obj.tags[key];
        };
    } else if (typeof(value) == 'string') {
        if (value == '*') {
            return function(obj) {
                return !!obj.tags[key];
            };
        } else if (value.match(/\|/)) {
            value = value.split('|');
        } else {
            return function(obj) {
                return obj.tags[key] && obj.tags[key] == value;
            };
        }
    }
    
    if (value instanceof Array) {
        return function(obj) {
            if (! obj.tags[key]) {
                return false;
            }
            for(var i=0; i < value.length; i++) {
                if (obj.tags[key] == value[i]) {
                    return true;
                }
            }
            return false;
        };
    } else {
        print("ERROR");
    }
}

Osmium.Callbacks.init = function() {
    print("Init");

    for (var file in files) {
        var f = files[file];

        f.shp = Osmium.Output.Shapefile.open('./' + f.fname, f.gtype, f.enc);

        print('Shapefile: ' + file);
        print('  Filename: ' + f.fname);
        print('  Encoding: ' + f.enc);
        print('  Geometry type: ' + f.gtype.toUpperCase());
        print('  Columns:');

        for (var i=0; i < f.columns.length; i++) {
            var d = f.columns[i];
            print('    ' + (d.name + '          ').substr(0, 11) + d.type.toUpperCase() + ' ' + d.size + ' ' + d.decimals);
            f.shp.add_field(d.name, d.type, d.size, d.decimals);
        }

        print('');
    }
    
    for (var file in jsonfiles) {
        var f = jsonfiles[file];

        f.json = Osmium.Output.CSV.open('./' + f.fname);
        f.comma = false;
        f.json.print('[');
        
        print('JSONfile: ' + file);
        print('  Filename: ' + f.fname);
        
        print('');
    }

    for (var file in idfiles) {
        var f = idfiles[file];

        f.idf = Osmium.Output.CSV.open('./' + f.fname, ',');
        
        print('CSV ID file: ' + file);
        print('  Filename: ' + f.fname);
        
        print('');
    }

    for (var type in rules) {
        for (var i=0; i < rules[type].length; i++) {
            var rule = rules[type][i];
            if (rule.file && files[rule.file]) {
                rule.match = build_func(rule.key, rule.value);
            } else {
                print("Unknown shapefile output: " + rule.file);
                exit(1);
            }
        }
    }
}

function tags2attributes(osm_object, attrs) {
    var id = osm_object.id;
    var tags = osm_object.tags;
    var obj = { id: id };
    for (var a in attrs) {
        if (typeof attrs[a] === 'function') {
            obj[a] = attrs[a](osm_object);
        } else {
            obj[a] = tags[attrs[a]];
        }
    }
    return obj;
}

function toNodeArray(nodes) {
    var nodeArray = [];
    for (var i = 0; i < nodes.length; ++i) {
        nodeArray.push(nodes[i]);
    }
    return nodeArray;
}

function check(type, osm_object) {
    for (var i=0; i < rules[type].length; i++) {
        var rule = rules[type][i];
        if (rule.match(osm_object)) {
            var a = tags2attributes(osm_object, rule.attrs);
            files[rule.file].shp.add(osm_object.geom, a);
            if (rule.jsonfile != null) {
                var file = jsonfiles[rule.jsonfile];
                var str = JSON.stringify(osm_object);
                if (file.comma) {
                    file.json.print(',');
                } else {
                    file.comma = true;
                }
                file.json.print(str);
            }
            if (rule.idfile != null) {
                var file = idfiles[rule.idfile];
                var id = osm_object.id;
                if ("relation" == osm_object.from) {
                    id = (id - 1) / 2;
                }
                if ("way" == osm_object.from) {
                    id /= 2;
                }
                if (osm_object.nodes.has_position) {
                    file.idf.print(id, a['type'], toNodeArray(osm_object.nodes));
                }
            }
        }
    }
}

Osmium.Callbacks.node = function() {
    check('node', this);
}

Osmium.Callbacks.way = function() {
    check('way', this);
}

Osmium.Callbacks.area = function() {
    check('area', this);
}

Osmium.Callbacks.end = function() {
    for (var file in files) {
        files[file].shp.close();
    }
    for (var file in jsonfiles) {
        jsonfiles[file].json.print(']');
        jsonfiles[file].json.close();
    }
    for (var file in idfiles) {
        idfiles[file].idf.close();
    }

    print("Done");
}

