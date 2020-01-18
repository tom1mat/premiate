function setLocalItem (key, data) {
    try {
        localStorage.setItem(key, data);
    } catch (error) {
        return false;
    }
}

function getLocalItem (key) {
    try {
        return localStorage.getItem(key);   
    } catch (error) {
        return null;
    }
}

function removeLocalItem (key) {
    localStorage.removeItem(key);
}

export {
    setLocalItem,
    getLocalItem,
    removeLocalItem,
};