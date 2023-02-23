const indexedDB = 
    window.indexedDB || 
    window.mozIndexedDB ||
    window.webkitIndexedDB ||
    window.msIndexedDB ||
    window.shimIndexedDB;

const request = indexedDB.open("CarsDataBase", 1);

request.onblocked = function(e) {
    console.log("DB open blocked", e);
};

request.onerror = function(err) {
    console.error("An error occured with IndexDB");
    console.error(err);    
};


request.onupgradeneeded = function() {
    const db = request.result;
    const store = db.createObjectStore("cars", { keyPath: "id"});
    store.createIndex("cars_color", ["color"], { unique: false });
    store.createIndex("color_and_make", ["color", "make"], {
        unique: false
    })
};

request.onsuccess = function() {
    const db = request.result;
    const transaction = db.transaction("cars", "readwrite");

    const store = transaction.objectStore("cars"); 
    const colorIndex = store.index("cars_color")
    const makeModelIndex = store.index("color_and_make");

    store.put({id: 1, color: "red", make: "toyota"});
    store.put({id: 2, color: "red", make: "kia"});
    store.put({id: 3, color: "blue", make: "honda"});
    store.put({id: 4, color: "green", make: "subaru"});

    const idQuery = store.get(4);
    const colorQuery = colorIndex.getAll(['red']);
    const colorMakeQuery = makeModelIndex.getAll(['blue', 'honda']);

    idQuery.onsuccess = function()  {
        console.log('idQuery', idQuery.result);
    };
    colorQuery.onsuccess = function() {
        console.log('colorQuery', colorQuery.result);
    };
    colorMakeQuery.onsuccess = function() {
        console.log('colorMakeQuery', colorMakeQuery.result);
    };

    transaction.oncomplete = function() {
        db.close();
    }

};





