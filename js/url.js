const BASE_URL = "http://localhost:8080/dawn/";

function makeFullURL(dataType) {
    return BASE_URL + `?data_type=${encodeURIComponent(dataType)}`;
}