export const utils = () => {
    function isObject(item: unknown) {
        return item && typeof item === "object" && !Array.isArray(item);
    }

    return {
        isObject,
    };
};
