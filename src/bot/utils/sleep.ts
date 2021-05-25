const sleep = (ms = 0) => {
    return new Promise((resolve) => {
        setTimeout(() => resolve(true), ms);
    });
}

export default sleep;