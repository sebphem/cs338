export const saveImagesToIndexedDB = async (imageFiles) => {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open("ImageStorage", 1);
        
        request.onupgradeneeded = (event) => {
            const db = event.target.result;
            if (!db.objectStoreNames.contains("images")) {
                db.createObjectStore("images", { autoIncrement: true });
            }
        };

        request.onsuccess = (event) => {
            const db = event.target.result;
            const transaction = db.transaction("images", "readwrite");
            const store = transaction.objectStore("images");

            // Clear previous images
            store.clear();

            // Store new images
            const savedImages = [];
            imageFiles.forEach((file, index) => {
                const reader = new FileReader();
                reader.readAsDataURL(file);
                reader.onload = () => {
                    const imageData = { id: index, data: reader.result };
                    const request = store.add(imageData);
                    request.onsuccess = () => {
                        savedImages.push(reader.result);
                        if (savedImages.length === imageFiles.length) {
                            resolve(savedImages);
                        }
                    };
                };
                reader.onerror = () => reject("Error reading file.");
            });
        };

        request.onerror = () => reject("Error opening IndexedDB.");
    });
};

export const getImagesFromIndexedDB = () => {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open("ImageStorage", 1);

        request.onsuccess = (event) => {
            const db = event.target.result;
            const transaction = db.transaction("images", "readonly");
            const store = transaction.objectStore("images");

            const getRequest = store.getAll();
            getRequest.onsuccess = () => {
                resolve(getRequest.result.map(entry => entry.data));
            };
            getRequest.onerror = () => reject("Error retrieving images.");
        };

        request.onerror = () => reject("Error opening IndexedDB.");
    });
};
