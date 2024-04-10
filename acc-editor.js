// ACC editor

// Prototype functions to handle better arrays and so on
Array.prototype.where = function(fn) {
    var data = [];
    for (_el of this) {
        if (fn(_el)) {
            data.push(_el);
        }
    }
    return data;
}; 

Object.prototype.where = function(fnn) {
    var data = {};
    for (__key of Object.keys(this)) {
        if (fnn(__key, this[__key])) {
            data[__key] = this[__key];
        }
    }
    return data;
}; 


// Basic lists to handle game objects
const items_tls = {
    127:{
        name:"CDB Bloccato",
        png:["cdb_bloccato"]
    },
    188:{
        name:"CDB Curva Bloccato",
        png:["cdb_curva_bloccato"]
    },
    189:{
        name:"CDB Curva Escluso (DM + AM)",
        png:["cdb_curva_escluso_dm_am"]
    },
    190:{
        name:"CDB Curva Escluso (DM)",
        png:["cdb_curva_escluso_dm", "empty"]
    },
    198:{
        name:"CDB Curva Escluso Stabilizzato (DM)",
        png:["cdb_curva_escluso_dm"]
    },
    191:{
        name:"CDB Curva Llibero",
        png:["cdb_curva_libero"]
    },
    192:{
        name:"CDB Escluso Stabilizzato",
        png:["cdb_escluso"]
    },
    193:{
        name:"CDB Escluso (DM)",
        png:["cdb_escluso", "empty"]
    },
    197:{
        name:"CDB Libero",
        png:["cdb_libero"]
    },
    199:{
        name:"CDP Occupato",
        png:["cdb_occupato"]
    },
    205:{
        name:"Deviatoio Bloccato Deviato senza Controllo Intallonabilità",
        png:["deviatoio_bloccato_deviato_intallonabile_empty", "deviatoio_bloccato_deviato_intallonabile"]
    },
    206:{
        name:"Deviatoio Bloccato Deviato con Controllo Intallonabilità",
        png:["deviatoio_bloccato_deviato_intallonabile"]
    },
    207:{
        name:"Deviatoio Normale Libero",
        png:["deviatoio_libero_normale"]
    },
    208:{
        name:"Deviatoio Normale senza Controllo Normale",
        png:["deviatoio_libero_base_empty", "deviatoio_libero_normale"]
    },
    209:{
        name:"Deviatoio Bloccato Normale",
        png:["deviatoio_bloccato_normale"]
    },
    210:{
        name:"Deviatoio Bloccato Deviato",
        png:["deviatoio_bloccato_deviato"]
    },
    211:{
        name:"Deviatoio Bloccato Deviato senza Controllo Traverso",
        png:["deviatoio_bloccato_deviato", "deviatoio_bloccato_normale_no_controllo"]
    }
};

const items = {
    1:{
        name:"CDB Orizzontale",
        png:["cdb_base"]
    },
    2:{
        name:"CDB Curvo",
        png:["cdb_curva"]
    },
    3:{
        name:"CDB Obliquo",
        png:["cdb_obliquo"]
    },
    4:{
        name:"Deviatoio",
        png:["deviatoio_base"]
    },
    5:{
        name:"Segnale Singolo",
        png:["segnale_singolo_spento"]
    },
    6:{
        name:"Segnale Doppio",
        png:["segnale_spento_base"]
    },
    7:{
        name:"Segnale Singolo (Mutanda)",
        png:["segnale_singolo_spento_triangolo"]
    },
    8:{
        name:"Segnale Doppio con Indicatore",
        png:["segnale_spento"]
    },
    9:{
        name:"Segnale Quadro Singolo",
        png:["semaforo_quadro_spento"]
    },
    10:{
        name:"Segnale Quadro Singolo con Indicatore",
        png:["semaforo_quadro_con_avvio_spento"]
    },
    11:{
        name:"Segnale Quadro Doppio",
        png:["semaforo_quadro_spento_base"]
    },
    12:{
        name:"Segnale Quadro Doppio con Indicatore",
        png:["semaforo_quadro_spento_spento"]
    },
    13:{
        name:"PO Base",
        png:["cdb_po_base"]
    },
    14:{
        name:"PO Reversibile",
        png:["po_base"]
    },
    15:{
        name:"Segnale Singolo con Indicatore",
        png:["segnale_singolo_spento_con_icona"]
    },
    16:{
        name:"CDB Tronco",
        png:["cdb_base_fine"]
    },
    17:{
        name:"Fabbricato Viaggiatori",
        png:["fabbricato_viaggiatori"]
    }
};

const tools = {
    1: {
        name:"Creazione CDB",
        png:["special_cdb"],
        action:"createCDB"
    },
    2: {
        name:"Rimozione CDB",
        png:["special_cdb_remove"],
        action:"removeCDB"
    },
    3: {
        name: "Impostare Itinerario",
        png: ["config_itinerario"],
        action: "addItinerario"
    },
    4: {
        name: "Rimuovere Itinerario",
        png: ["config_itinerario_remove"],
        action: "removeItinerario"
    }
};

const preloadTextures = [
    "cdb_con_cdb",
    "scudo_base"
];

const summoned_items_inventory = [];

const exports = {
    "tracks":{},
    "cdb":{},
    "routes":{},
    "po":{}
};


// Classes to handle the editor's functions
const editor = {
    // Base vars
    tagName:"td",
    selected: -1,
    iSelected:undefined,
    blobTextures: {},
    iToolSelected: "",
    iToolSelectedElement: undefined,
    currentCdbId:null,
    doShowCdb:false,
    doShowCdbNames:false,
    doShowCdbLines:false,
    currentItinerarioNumber:null,
    doShowPo:false,

    
    // Variabili di stato fisse utili all'editor
    rotazioneScudo: {
        LEFT:"90",
        RIGHT:"-90"
    },

    summon: async function() {
        document.addEventListener('keypress', this._keyEvent);
        document.getElementById('save').addEventListener('click', () => {
            document.getElementById('exportpage').style.display = "block";
            document.getElementById('exportjson').value = JSON.stringify(exports);
        });
        document.getElementById('load').addEventListener('click', () => {
            document.getElementById('loadpage').style.display = "block";
        });
        document.getElementById('realimport').addEventListener('click', () => {
            document.getElementById('loadpage').style.display = "none";
            editor.import(document.getElementById('json').value);
        });
        document.getElementById('noimport').addEventListener('click', () => {
            document.getElementById('loadpage').style.display = "none";
        });
        document.getElementById('noexport').addEventListener('click', () => {
            document.getElementById('exportpage').style.display = "none";
        });
        document.getElementById('saveclip').addEventListener('click', () => {
            navigator.clipboard.writeText(JSON.stringify(exports));
        });
        document.getElementById('savefile').addEventListener('click', () => {
            download("accsim-tracciato.txt", JSON.stringify(exports));
            document.getElementById('exportpage').style.display = "none";
        });
        for (k of preloadTextures) {
            let data = await fetch("src/img/icon/" + k + ".png");
            data = await data.blob();
            let urlCreator = window.URL || window.webkitURL;
            editor.blobTextures[k] = urlCreator.createObjectURL(data);
        }
        for (k of Object.keys(items)) {
            let object = items[k];
            await this.saveAsBlob(object);
            let item = document.createElement("img");
            item.src = this.blobTextures[object.png[0]];
            item.addEventListener('click', (ev) => {
                if (this.iSelected != undefined) {
                    this.iSelected.style.border = "none";
                }
                if (this.iToolSelected != "") {
                    this.iToolSelected = "";
                    this.iToolSelectedElement.style.border = "none";
                    this.iToolSelectedElement = undefined;
                }
                ev.target.style.border = "solid 2px white";
                this.iSelected = ev.target;
                this.selected = ev.target.getAttribute('iid');
                this.currentCdbId = null;
            });
            item.setAttribute('osrc', object.png[0])
            item.setAttribute('iid', k);
            document.getElementById("editorbox").appendChild(item);
            summoned_items_inventory.push(item);
        }
        for (k of Object.keys(tools)) {
            let data = tools[k];
            let item = new Image();
            await this.saveAsBlob(data);
            item.src = this.blobTextures[data.png[0]];
            item.setAttribute('tool', data.action);
            item.addEventListener('click', (ev) => {
                if (this.iToolSelectedElement != undefined) {
                    this.iToolSelectedElement.style.border = "none";
                }
                if (this.selected > 0) {
                    this.selected = -1;
                    this.iSelected.style.border = "none";
                    this.iSelected = undefined;
                }
                this.currentCdbId = null;
                ev.target.style.border = "solid 2px yellow";
                this.iToolSelectedElement = ev.target;
                this.iToolSelected = ev.target.getAttribute('tool');
            });
            document.getElementById("editorbox").appendChild(item);
        }
    },

    import: function(data) {
        exports.cdb = JSON.parse(data).cdb;
        exports.po = JSON.parse(data).po ?? {};

        for (key of Object.keys(JSON.parse(data).tracks)) {
            let element = JSON.parse(data).tracks[key];
            for (el of document.getElementsByTagName("td")) {
                if (el.getAttribute('coord_x') == element.position.x && el.getAttribute('coord_y') == element.position.y) {
                    el.setAttribute('uniqid', key);
                    table.summonImage(el, element.type, element.transform);
                }
            }
        }

        exports.tracks = JSON.parse(data).tracks;
        for (key of Object.keys(exports.po)) {
            table._summonPoScudo(this._getElementByUniqId(exports.po[key].track), key);
        }
    },

    saveAsBlob: async function(obj) {
        for (png of obj.png) {
            if (!editor.blobTextures.hasOwnProperty(png)) {
                let data = await fetch("src/img/icon/" + png + ".png");
                data = await data.blob();
                let urlCreator = window.URL || window.webkitURL;
                editor.blobTextures[png] = urlCreator.createObjectURL(data);
            }
        }
    },

    _tickinventory: function() {
        for (obj of summoned_items_inventory) {
            let id = obj.getAttribute('iid');
            if (items[id].png.length > 1) {
                let nextkey = items[id].png.indexOf(obj.getAttribute('osrc')) + 1;
                if (nextkey >= items[id].png.length) {
                    nextkey = 0;
                }
                obj.setAttribute('osrc', items[id].png[nextkey]);
                obj.src = editor.blobTextures[items[id].png[nextkey]];
            }
        }
    },

    _keyEvent: function(ev) {
        console.log(ev);
        if (table.selected != -750 && table.selectedItem != undefined && table.selectedItem != null) {
            console.log(table.selectedItem);
            if (ev.key == "a" || ev.key == "d") {
                if (table.selectedItem.children[0].style.transform != "scaleX(-1)") {
                    table.selectedItem.children[0].style.transform = "scaleX(-1)";
                    exports.tracks[table.selectedItem.getAttribute('uniqid')].transform = "s:x";
                } else {
                    exports.tracks[table.selectedItem.getAttribute('uniqid')].transform = "";
                    table.selectedItem.children[0].style.transform = "";
                }
            } else if (ev.key == "w" || ev.key == "s") {
                if (table.selectedItem.children[0].style.transform != "scaleY(-1)") {
                    table.selectedItem.children[0].style.transform = "scaleY(-1)";
                    exports.tracks[table.selectedItem.getAttribute('uniqid')].transform = "s:y";
                } else {
                    table.selectedItem.children[0].style.transform = "";
                    exports.tracks[table.selectedItem.getAttribute('uniqid')].transform = "";
                }
            } else if (ev.key == "q") {
                table.selectedItem.children[0].style.transform = "rotate(180deg)";
                exports.tracks[table.selectedItem.getAttribute('uniqid')].transform = "r:180";
            } else if (ev.key == "e") {
                table.selectedItem.children[0].style.transform = "";
                exports.tracks[table.selectedItem.getAttribute('uniqid')].transform = "";
            } else if (ev.key == "r") {
                delete exports.tracks[table.selectedItem.getAttribute('uniqid')];
                table.selectedItem.removeChild(table.selectedItem.children[0]);
                table.selectedItem.style.backgroundColor = "black";
                table.selectedItem = null;
                table.selected = -750;
            }
        } else if (ev.key == "c") {
            if (!editor.doShowCdb) {
                for (element of document.getElementsByTagName('td')) {
                    for (cdbe of Object.values(exports.cdb)) {
                        if (cdbe.tracks.includes(element.getAttribute('uniqid'))) {
                            element.style.backgroundColor = "yellow";
                        }
                    }
                }
                editor.doShowCdb = true;
            } else {
                for (element of document.getElementsByTagName('td')) {
                    for (cdbe of Object.values(exports.cdb)) {
                        if (cdbe.tracks.includes(element.getAttribute('uniqid'))) {
                            element.style.backgroundColor = "black";
                        }
                    }
                }
                editor.doShowCdb = false;
            }
        } else if (ev.key == "v") {
            if (!editor.doShowCdbNames) {
                for (const cdb of Object.keys(exports.cdb)) {
                    editor._drawLetter(cdb);
                }
                editor.doShowCdbNames = true;
            } else {
                document.getElementById('showelements').innerHTML = "";
                editor.doShowCdbNames = false;
            }
        } else if (ev.key == "b") {
            if (!editor.doShowCdbLines) {
                for (const cdb of Object.keys(exports.cdb)) {
                    for (el of Object.values(editor._getEveryMemberOfCdb(cdb))) {
                        el = el.object;
                        el.children[0].setAttribute('imgbackup',el.children[0].src);
                        el.children[0].src = editor.blobTextures["cdb_con_cdb"];
                    }
                    editor._drawLetterOnCodedLine(cdb);
                }
                editor.doShowCdbLines = true;
            } else {
                for (const cdb of Object.keys(exports.cdb)) {
                    for (el of Object.values(editor._getEveryMemberOfCdb(cdb))) {
                        el = el.object;
                        el.children[0].src = el.children[0].getAttribute('imgbackup');
                    }
                    editor._drawLetter(cdb);
                }
                document.getElementById('showelements').innerHTML = "";
                editor.doShowCdbLines = false;
            }
        } else if (ev.key == "l") {
            if (!editor.doShowPo) {
                for (const po of Object.keys(exports.po)) {
                    let el = exports.po[po];
                    let spawned = false;
                    for (const img of Object.values(document.getElementById('poelements').children)) {
                        if (img.getAttribute('po_id') == po) {
                            let pos = {
                                top: img.getBoundingClientRect().top,
                                left: img.getBoundingClientRect().left
                            };
                            let text = document.createElement('div');
                            text.style.position = "absolute";
                            text.style.top = pos.top + "px";
                            text.style.left = (pos.left + Number(img.getAttribute('rrsn'))) + "px";
                            text.style.fontSize = "13px";
                            text.style.color = "white";
                            text.style.zIndex = "6";
                            text.innerHTML = po;
                            document.getElementById('prtElements').appendChild(text);
                            spawned = true;
                            break;
                        }
                    }
                    if (!spawned) {
                        // ok quindi non è collegata ad un CDB ma ad un segnale
                        let pos = {
                            top: editor._getElementByUniqId(el.track).getBoundingClientRect().top,
                            left: editor._getElementByUniqId(el.track).getBoundingClientRect().left
                        };
                        let text = document.createElement('div');
                        text.style.position = "absolute";
                        text.style.textAlign = "center";
                        text.style.top = (pos.top - 12) + "px";
                        text.style.left = pos.left + "px";
                        text.style.width = "45px";
                        text.style.fontSize = "13px";
                        text.style.color = "white";
                        text.style.zIndex = "6";
                        text.innerHTML = po;
                        document.getElementById('prtElements').appendChild(text);
                    }
                }
                editor.doShowPo = true;
            } else {
                document.getElementById('prtElements').innerHTML = "";
                editor.doShowPo = false;
            }
        }
    },

    _drawLetter: function(cdb, css = {}) {
        let elements = Object.values(editor._getEveryMemberOfCdb(cdb));
        console.log(elements);
        let elemento;
        if (String(elements.length / 2).includes('.')) {
            // Oke è dispari quindi c'è un elemento al centro
            while (elements.length > 1) {
                elements.pop();
                elements.shift();
            }
            console.warn(elements);
            elemento = elements[0];
        } else {
            // Pari quindi ne togliamo due a due e poi diomerda
            while (elements.length > 2) {
                elements.pop();
                elements.shift();
            }
            console.log(elements);
            elemento = elements[0];
        }
        let pos = elemento.object.getBoundingClientRect();
        let element = document.createElement("div");
        element.style.display = "block";
        element.style.position = "absolute";
        element.style.color = "yellow";
        element.style.top = pos.top + "px";
        element.style.left = pos.left + "px";
        element.style.width = "45px";
        element.style.textAlign = "center";
        element.innerHTML = cdb;
        for (const csskey of Object.keys(css)) {
            element.style[csskey] = css[csskey];
        }
        document.getElementById('showelements').appendChild(element);
    },

    _drawLetterOnCodedLine: function(cdb, css = {}) {
        let elements = Object.values(editor._getEveryMemberOfCdb(cdb));
        console.log(elements);
        let elemento;
        if (String(elements.length / 2).includes('.')) {
            // Oke è dispari quindi c'è un elemento al centro
            while (elements.length > 1) {
                elements.pop();
                elements.shift();
            }
            console.warn(elements);
            elemento = elements[0];
        } else {
            // Pari quindi ne togliamo due a due e poi diomerda
            while (elements.length > 2) {
                elements.pop();
                elements.shift();
            }
            console.log(elements);
            elemento = elements[0];
        }
        let pos = elemento.object.getBoundingClientRect();
        let element = document.createElement("div");
        element.style.display = "block";
        element.style.position = "absolute";
        element.style.color = "black";
        element.style.top = (pos.top + 13) + "px";
        element.style.left = pos.left + "px";
        element.style.width = "45px";
        element.style.textAlign = "center";
        element.style.fontSize = "12px";
        element.innerHTML = cdb;
        for (const csskey of Object.keys(css)) {
            element.style[csskey] = css[csskey];
        }
        document.getElementById('showelements').appendChild(element);
    },

    // Will return an array with valid connected point. Points: TOP, BOTTOM, LEFT, RIGHT
    _getBoundingBoxes: function(item) {
        if (item == undefined && item == null) {
            console.error("Bounding Box error");
            return;
        }
        console.log(item);
        let object = item.children[0].getAttribute('object');
        let transform = exports.tracks[item.getAttribute('uniqid')].transform.split(':');
        if (object == 1) {
            return [
                "LEFT",
                "RIGHT"
            ];
        } else if (object == 2) {
            if (transform.length < 2) {
                return [
                    "RIGHT",
                    "BOTTOM:-1"
                ];
            } else if (transform[0] == "s") {
                if (transform[1] == "x") {
                    return [
                        "RIGHT",
                        "BOTTOM:1"
                    ];
                } else if (transform[1] == "y") {
                    return [
                        "TOP:-1",
                        "RIGHT"
                    ];
                }
            } else if (transform[0] == "r") {
                return [
                    "LEFT",
                    "TOP:1"
                ];
            }
        } else if (object == 3) {
            if (transform.length < 2) {
                return [
                    "TOP:1",
                    "BOTTOM:-1"
                ];
            } else {
                return [
                    "TOP:-1",
                    "BOTTOM:1"
                ];
            }
        } else if (object == 4) {
            if (transform.length < 2) {
                return [
                    "RIGHT",
                    "LEFT",
                    "TOP:1"
                ];
            } else if (transform[0] == "s") {
                if (transform[1] == "x") {
                    return [
                        "RIGHT",
                        "LEFT",
                        "TOP:-1"
                    ];
                } else if (transform[1] == "y") {
                    return [
                        "LEFT",
                        "RIGHT",
                        "BOTTOM:1"
                    ]
                }
            } else if (transform[0] == "r") {
                return [
                    "LEFT",
                    "RIGHT",
                    "BOTTOM:-1"
                ]
            }
        } else if (object == 13) {
            return [
                "LEFT",
                "RIGHT"
            ]
        } else if (object == 14) {
            return [
                "LEFT",
                "RIGHT"
            ]
        }
    },

    // Return the uniqids of every valid box if exists
    _getValidBoundBoxesConnection: function(element) {
        let allowed = [];
        let boxes = this._getBoundingBoxes(element);
        for (box of boxes) {
            let Cdata = this._convertTextIntoCoordsByBase(element, box);
            for (const item of Object.keys(exports.tracks.where(function(id, data) {
                let el = Array.from(Object.values(document.getElementsByTagName("td"))).where(function(element) { return element.getAttribute('uniqid') == id; })[0];
                if (Number(el.getAttribute('coord_x')) == Cdata.x && Number(el.getAttribute('coord_y')) == Cdata.y) {
                    return true;
                }
                return false;
            }))) {
                allowed.push(item);
            }
        }
        return allowed;
    },

    _convertTextIntoCoordsByBase: function(base, box) {
        let coords = {
            x: null,
            y: null
        };
        
        box = box.split(':');
        if (box[0] == "LEFT") {
            coords.x = Number(base.getAttribute('coord_x')) - 1;
            coords.y = Number(base.getAttribute('coord_y'));
            coords.y += Number(box[1] ?? 0) ?? 0;
        } else if (box[0] == "RIGHT") {
            coords.x = Number(base.getAttribute('coord_x')) + 1;
            coords.y = Number(base.getAttribute('coord_y'));
            coords.y += Number(box[1] ?? 0) ?? 0;
        } else if (box[0] == "TOP") {
            coords.y = Number(base.getAttribute('coord_y')) - 1;
            coords.x = Number(base.getAttribute('coord_x'));
            coords.x += Number(box[1] ?? 0) ?? 0;
        } else if (box[0] == "BOTTOM") {
            coords.y = Number(base.getAttribute('coord_y')) + 1;
            coords.x = Number(base.getAttribute('coord_x'));
            coords.x += Number(box[1] ?? 0) ?? 0;
        }
        return coords;
    },

    _checkIfNextCdbIsValid: function(cdbId, nextProposedObject) {
        let nextcoords = {
            x: nextProposedObject.getAttribute('coord_x'),
            y: nextProposedObject.getAttribute('coord_y')
        };
        // Allowed elements: next (x + 1), previous (x - 1), upper next (x +- 1, y + 1), lower next (x +-1, y - 1)
        if (cdbId in exports.cdb) {
            // Let's check if this is allowed
            let notAllowed = true;
            for (const trackId of exports.cdb[cdbId].tracks) {
                let track = exports.tracks[trackId];
                let element = Array.from(Object.values(document.getElementsByTagName("td"))).where(function(element) { return element.getAttribute('uniqid') == trackId })[0];
                let bounding = this._getValidBoundBoxesConnection(element);
                console.log(bounding);
                console.log(nextProposedObject.getAttribute('uniqid'));
                if (bounding.includes(nextProposedObject.getAttribute('uniqid'))) {
                    notAllowed &= true ? false : true;
                }
            }
            if (notAllowed) {
                error("Devi piazzare il CDB accanto ad uno adiacente con lo stesso id!");
                return false;
            }
            return true;
        }
        return true;
    },

    _getEveryMemberOfCdb: function(cdbId) {
        let elements = {};
        for (track of exports.cdb[cdbId].tracks) {
            elements[track] = {
                original: exports.cdb[cdbId].tracks[track],
                object: Array.from(Object.values(document.getElementsByTagName("td"))).where(function(element) { return element.getAttribute('uniqid') == track; })[0]
            };
        }
        return elements;
    },

    uniqid: function(prefix = "", random = false) {
        const sec = Date.now() * 1000 + Math.random() * 1000;
        const id = sec.toString(16).replace(/\./g, "").padEnd(14, "0");
        return `${prefix}${id}${random ? `.${Math.trunc(Math.random() * 100000000)}`:""}`;
    },

    _getElementAtCoord: function(x, y) {
        return Array.from(Object.values(document.getElementsByTagName(this.tagName))).where(function(element) { return element.getAttribute('coord_x') == x && element.getAttribute('coord_y') == y; })[0];
    },

    _getElementByUniqId: function(id) {
        return Array.from(Object.values(document.getElementsByTagName(this.tagName))).where(function(element) { return element.getAttribute('uniqid') == id; })[0];
    },

    _getSignDirection: function(object) {
        if (exports.tracks[object.getAttribute('uniqid')].transform == "" || exports.tracks[object.getAttribute('uniqid')].transform == "s:y") {
            return "RIGHT";
        } else {
            return "LEFT";
        }
    },

    _getCdbHandledBySign: function(object) {
        // Get the two elements up and down the signal
        var up = this._getElementAtCoord(object.getAttribute('coord_x'), String(Number(object.getAttribute('coord_y')) - 1));
        var down = this._getElementAtCoord(object.getAttribute('coord_x'), String(Number(object.getAttribute('coord_y')) + 1));
        if (up.children.length < 1 && down.children.length < 1) {
            error("Un segnale non è attaccato ad alcun binario!");
            return;
        } else if (up.children.length > 0 && down.children.length < 1) {
            return "UP";
        } else if (up.children.length < 1 && down.children.length > 0) {
            return "DOWN";
        } else if (up.children.length > 0 && down.children.length > 0) {
            // Oh no, now we have to see the transform of the sign
            if (exports.tracks[object.getAttribute('uniqid')].transform == "" || exports.tracks[object.getAttribute('uniqid')].transform == "s:x") {
                return "UP";
            } else if (exports.tracks[object.getAttribute('uniqid')].transform == "s:y" || exports.tracks[object.getAttribute('uniqid')].transform == "r:180") {
                return "DOWN";
            }
        }
        error("La funzione <code>editor._getCdbHandledBySign(<obj>)</code> non ha ricavato niente!");
        return null;
    },

    _getCdbIdHandledBySign: function(object) {
        // Get the two elements up and down the signal
        var up = this._getElementAtCoord(object.getAttribute('coord_x'), String(Number(object.getAttribute('coord_y')) - 1));
        var down = this._getElementAtCoord(object.getAttribute('coord_x'), String(Number(object.getAttribute('coord_y')) + 1));
        if (up.children.length < 1 && down.children.length < 1) {
            error("Un segnale non è attaccato ad alcun binario!");
            return;
        } else if (up.children.length > 0 && down.children.length < 1) {
            return up.getAttribute('uniqid');
        } else if (up.children.length < 1 && down.children.length > 0) {
            return down.getAttribute('uniqid');
        } else if (up.children.length > 0 && down.children.length > 0) {
            // Oh no, now we have to see the transform of the sign
            if (exports.tracks[object.getAttribute('uniqid')].transform == "" || exports.tracks[object.getAttribute('uniqid')].transform == "s:x") {
                return up.getAttribute('uniqid');
            } else if (exports.tracks[object.getAttribute('uniqid')].transform == "s:y" || exports.tracks[object.getAttribute('uniqid')].transform == "r:180") {
                return down.getAttribute('uniqid');
            }
        }
        error("La funzione <code>editor._getCdbHandledBySign(<obj>)</code> non ha ricavato niente!");
        return null;
    },

    _getCdbObjectHandledBySign: function(object) {
        // Get the two elements up and down the signal
        var up = this._getElementAtCoord(object.getAttribute('coord_x'), String(Number(object.getAttribute('coord_y')) - 1));
        var down = this._getElementAtCoord(object.getAttribute('coord_x'), String(Number(object.getAttribute('coord_y')) + 1));
        if (up.children.length < 1 && down.children.length < 1) {
            error("Un segnale non è attaccato ad alcun binario!");
            return;
        } else if (up.children.length > 0 && down.children.length < 1) {
            return up;
        } else if (up.children.length < 1 && down.children.length > 0) {
            return down;
        } else if (up.children.length > 0 && down.children.length > 0) {
            // Oh no, now we have to see the transform of the sign
            if (exports.tracks[object.getAttribute('uniqid')].transform == "" || exports.tracks[object.getAttribute('uniqid')].transform == "s:x") {
                return up;
            } else if (exports.tracks[object.getAttribute('uniqid')].transform == "s:y" || exports.tracks[object.getAttribute('uniqid')].transform == "r:180") {
                return down;
            }
        }
        error("La funzione <code>editor._getCdbHandledBySign(<obj>)</code> non ha ricavato niente!");
        return null;
    },

    _hasPoByTrackId: function(id) {
        if (Object.values(exports.po).where(function(el) { return el.track == id; }).length > 0) {
            return true;
        }
        return false;
    },

    _getPoIdByTrackId: function(id) {
        for (const po of Object.keys(exports.po)) {
            if (exports.po[po].track == id) {
                return po;
            }
        }
        return null;
    }
}

const table = {
    element: document.getElementById("display"),
    selected: -750,
    selectedItem: null,
    storageTarget: null,

    setup: function() {
        // ROW = y, COLUMN = x
        let rowcount = 0;
        let columncount = -1;
        for (el of document.getElementsByTagName("td")) {
            columncount++
            if (columncount > 24) {
                columncount = 0;
                rowcount++;
            }
            el.setAttribute('coord_x', columncount);
            el.setAttribute('coord_y', rowcount);
            el.setAttribute('uniqid', editor.uniqid());
            el.addEventListener('click', this._clickHandler);
        }
    },

    _clickHandler: function(ev) {
        console.log(ev);
        let target = ev.target;
        if (target.nodeName != "TD") {
            if (target.parentNode.nodeName == "TD") {
                target = target.parentNode;
            } else {
                return;
            }
        }
        if (target.children.length > 0) {
            if (editor.iToolSelected != "") {
                table._specialElementClickHandler(target);
                return;
            }
            table._internalElementClickHandler(target);
            return;
        }
        if (editor.selected > 0) {
            table.summonImage(target, editor.selected);
        }
    },

    _internalElementClickHandler: function(target) {
        let imgchild = target.children[0];
        if (target.getAttribute('uniqid') == table.selected) {
            target.style.backgroundColor = "black";
            table.selected = -750;
            table.selectedItem = null;
        } else {
            if (table.selectedItem != null) {
                table.selectedItem.style.backgroundColor = "black";
            }
            table.selected = target.getAttribute('uniqid');
            table.selectedItem = target;
            target.style.backgroundColor = "white";
        }
    },

    _specialElementClickHandler: function(target) {
        table.storageTarget = target;
        if (editor.iToolSelected == "createCDB" || editor.iToolSelected == "removeCDB") {
            if (editor.currentCdbId == undefined || editor.currentCdbId == null) {
                document.getElementById('selectcdbid').style.display = "block";
            } else {
                this._specialCDBFunctionsProsecution();
            }
        } else if (editor.iToolSelected == "addItinerario" && target.children.length > 0) {
            if (![5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16].includes(Number(target.children[0].getAttribute('object')))) {
                error("Il PO può essere associato solo ad un segnale oppure ad un CDB che lo includa!<br>Id selezionato: " + Number(target.getAttribute('object')));
                return;
            }
            if (editor._hasPoByTrackId(target.getAttribute('uniqid'))) {
                error("Esiste già un PO assegnato a questo elemento!");
                return;
            }
            document.getElementById('selectpoid').style.display = "block";
            document.getElementById('puntoorigine_input').value = "";
        } else if (editor.iToolSelected == "removeItinerario" && target.children.length > 0) {
            if (![5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16].includes(Number(target.children[0].getAttribute('object')))) {
                error("Non può esistere un PO in questo tipo di binario!<br>Id selezionato: " + Number(target.getAttribute('object')));
                return;
            }

            if (editor._hasPoByTrackId(target.getAttribute('uniqid'))) {
                // Exists, so remove
                let key = editor._getPoIdByTrackId(target.getAttribute('uniqid'));
                delete exports.po[key];
                for (const obj of Object.values(document.getElementById('poelements').children)) {
                    if (obj.getAttribute('po_id') == String(key)) {
                        // Delete
                        document.getElementById('poelements').removeChild(obj);
                    }
                }
            } else {
                error("Il CDB/Segnale selezionato non ha nessun PO associato!");
                return;
            }
        }
    },
    
    _specialPoFunctionsProsecution: function() {
        // Let's check if the number is not already existing somewhere
        document.getElementById('selectpoid').style.display = "none";
        let object = table.storageTarget;
        let number = document.getElementById('puntoorigine_input').value;
        if (number in exports.po) {
            error("Il numero che hai inserito è già in uso!");
            return;
        } 
        // Assegna la cosa all'object
        exports.po[number] = {
            type: ([13, 14, 16].includes(Number(object.children[0].getAttribute('object')))) ? "cdb" : "segnale",
            track: object.getAttribute('uniqid'),
            delta: null
        };

        // Spawniamo l'immagine
        this._summonPoScudo(object, number);
    },

    _specialCDBFunctionsProsecution: function() {
        let target = table.storageTarget;
        document.getElementById('selectcdbid').style.display = "none";
        editor.currentCdbId = editor.currentCdbId ?? document.getElementById('cdbid_input').value;
        document.getElementById('cdbid_input').value = "";
        if (editor.iToolSelected == "createCDB") {
            // Bisogna cercare se c'è già un CDB associato, se no procediamo a crearne uno
            let presence = false;
            for (k of Object.keys(exports.cdb)) {
                for (track of exports.cdb[k].tracks) {
                    if (track == target.getAttribute('uniqid')) {
                        presence = true;
                    }
                }
            }

            if (!presence) {
                // Nessun CDB associato, avendo l'editor dei CDB aperto facciamolo
                if (!editor._checkIfNextCdbIsValid(editor.currentCdbId, target)) {
                    return false;
                }
                table._specialAddCdbToElementIfExists(target.getAttribute('uniqid'));
            } else {
                error("CDB già presente!");
            }
        } else if (editor.iToolSelected == "removeCDB") {
            let presence = false;
            for (k of Object.keys(exports.cdb)) {
                for (track of exports.cdb[k].tracks) {
                    if (track == target.getAttribute('uniqid')) {
                        presence = true;
                    }
                }
            }
            
            if (presence) {
                // Rimuoviamo SOLO SE il binario è all'inizio oppure alla fine del CDB
                if (exports.cdb[editor.currentCdbId].tracks[0] == target.getAttribute('uniqid') || exports.cdb[editor.currentCdbId].tracks[exports.cdb[editor.currentCdbId].tracks.length-1] == target.getAttribute('uniqid')) {
                    // Ok andiamo
                    let newtracks = [];
                    for (track of exports.cdb[editor.currentCdbId].tracks) {
                        if (track != target.getAttribute('uniqid')) {
                            newtracks.push(track);
                        }
                    }
                    exports.cdb[editor.currentCdbId].tracks = newtracks;
                } else {
                    error("Non puoi rompere un CDB!");
                }
            } else {
                error("CDB inesistente!");
            }
        }
    },

    // CDB Status: 0 = libero, 1 = bloccato, 2 = occupato, 3 = escluso dal DM, 4 = escluso stabilizzato, 5 = escluso dal DM + AM
    _specialAddCdbToElementIfExists: function(cdb, is_switch = false) {
        if (editor.currentCdbId in exports.cdb) {
            exports.cdb[editor.currentCdbId].tracks.push(cdb);
        } else {
            exports.cdb[editor.currentCdbId] = {
                switch: is_switch,
                tracks: [cdb],
                status: 0
            }
        }
    },

    summonImage: function(element, id, parsedata = null) {
        let img = new Image(45);
        img.src = editor.blobTextures[items[id].png[0]];
        img.style.borderBottom = "-3.5px";
        img.style.width = "45px";
        if (img.height > 40) {
            img.height = "45px";
            img.style.height = "40px";
        }
        if ("css" in items[id]) {
            for (elkeyvalue of Object.keys(items[id].css)) {
                img.style[elkeyvalue] = items[id].css[elkeyvalue];
            }
        }
        img.setAttribute('object', id);
        exports.tracks[element.getAttribute('uniqid')] = {
            type:id,
            position:{
                x:element.getAttribute('coord_x'),
                y:element.getAttribute('coord_y')
            },
            transform:""
        };
        if (parsedata != null && parsedata != "" && parsedata != undefined) {
            let sts = parsedata.split(':');
            if (sts[0] == "s" && sts[1] == "x") {
                img.style.transform = "scaleX(-1)";
            } else if (sts[0] == "s" && sts[1] == "y") {
                img.style.transform = "scaleY(-1)";
            } else if (sts[0] == "r") {
                img.style.transform = "rotate(180deg)";
            }
        }
        element.appendChild(img);
    },

    _summonPoScudo(target, id) {
        if (exports.po[id].type == "segnale") {
            let rotation = editor._getSignDirection(target);
            let pos = {
                top: target.getBoundingClientRect().top,
                left: target.getBoundingClientRect().left,
                next:0,
            };
            let img = new Image(15);
            img.src = editor.blobTextures["scudo_base"];
            img.style.position = "absolute";
            let transform = exports.tracks[target.getAttribute('uniqid')].transform;
            console.log(exports.tracks[target.getAttribute('uniqid')]);
            console.log(exports.tracks[target.getAttribute('uniqid')].transform);
            if (transform == "s:x") {
                pos.left += 50;
                pos.next = 18;
            } else if (transform == "s:y") {
                pos.left -= 20;
                pos.top += 25;
                pos.next = -18;
            } else if (transform == "") {
                pos.left -= 20;
                pos.next = -18;
            } else if (transform == "r:180") {
                pos.top += 25;
                pos.next = 18;
                pos.left += 50;
            }
            console.log(pos);
            img.style.top = pos.top + "px";
            img.style.left = pos.left + "px";
            img.style.zIndex = "5";
            img.style.transform = "rotate(" +  editor.rotazioneScudo[rotation] + "deg)";
            exports.po[id].delta = pos.next;
            img.setAttribute('po_id', id);
            img.setAttribute('rrsn', pos.next);
            document.getElementById('poelements').appendChild(img);
        }
    }
}


// Altre funzioni JS per l'editor
function closeParent(el) {
    el.parentElement.parentElement.style.display = "none";
}

function killParent(el) {
    el.parentElement.parentElement.parentElement.removeChild(el.parentElement.parentElement);
}


// Funzioni utili alla parte in JS per gestire la roba facilmente
function error(text) {
    let el = document.getElementById('error_template').cloneNode(true);
    el.id = "";
    el.style.display = "block";
    el.getElementsByTagName("div")[1].innerHTML = text;
    document.getElementById('errorElements').appendChild(el);
}

function download(filename, text) {
    var element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
    element.setAttribute('download', filename);
  
    element.style.display = 'none';
    document.body.appendChild(element);
  
    element.click();
  
    document.body.removeChild(element);
}


// Codice per l'avvio del programma
editor.summon();
table.setup();

setInterval(editor._tickinventory, 1000);

setInterval(() => {
    document.getElementById('itidshow').innerHTML = editor.currentItinerarioNumber;
    document.getElementById('cdbidshow').innerHTML = editor.currentCdbId;
}, 500);