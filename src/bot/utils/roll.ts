const roll = (chance: number) => {
    let dice = Math.random() * 100;
    return dice < chance;
}

export default roll;