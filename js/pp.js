function calcPowerPoint(basePP, pointUp) {
    const increment = Math.floor(basePP / 5.0)
    return basePP + (increment * pointUp);
}