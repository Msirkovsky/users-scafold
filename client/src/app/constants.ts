let baseUrl;

if (process.env.REACT_APP_SERVER) {
    baseUrl = process.env.REACT_APP_SERVER;
} else {
    baseUrl = window.location.origin;
}

export const Config = {
    ServerURL: baseUrl,
};