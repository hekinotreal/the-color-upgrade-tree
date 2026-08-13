addLayer("red", {
    name: "Red",
    symbol: "R",
    position: 0,
    startData() { return {
        unlocked: true,
        points: new Decimal(0),
    }},
    color: "#E60000",
    requires: new Decimal(10),
    resource: "red",
    baseResource: "points",
    baseAmount() {return player.points},
    type: "normal",
    exponent: 0.5,
    gainMult() {
        let mult = new Decimal(1)
        if (hasUpgrade(this.layer, 12)) mult = mult.times(10)
        if (hasUpgrade(this.layer, 13)) mult = mult.times(10)
        if (hasUpgrade(this.layer, 15)) mult = mult.times(100)
        if (hasMilestone('orange', 0)) mult = mult.times(10)
        if (hasMilestone('orange', 1)) mult = mult.times(100)
        if (hasMilestone('orange', 2)) {
            mult = mult.times(1000)
            if (player.points.gt(1)) mult = mult.times(player.points.log(100).min(new Decimal('1e308')))
        }
        if (hasMilestone('orange', 3)) mult = mult.times(100)
        if (hasMilestone('orange', 4)) mult = mult.times(1000000)
        if (hasUpgrade('orange', 12)) mult = mult.times(upgradeEffect('orange', 12))
        if (hasMilestone('orange', 5)) mult = mult.times(10000)
        if (hasMilestone('orange', 5)) mult = mult.div(100)
        if (hasUpgrade('amber', 11)) mult = mult.times(upgradeEffect('amber', 11))
        if (hasUpgrade('amber', 12)) mult = mult.times(upgradeEffect('amber', 12))
        if (hasUpgrade('amber', 13)) mult = mult.times(upgradeEffect('amber', 13))
        if (hasUpgrade('amber', 14)) mult = mult.times(upgradeEffect('amber', 14))
        if (hasUpgrade('amber', 15)) mult = mult.times(upgradeEffect('amber', 15))
        if (hasUpgrade('amber', 16)) mult = mult.times(upgradeEffect('amber', 16))
        if (hasUpgrade('amber', 17)) mult = mult.times(upgradeEffect('amber', 17))
        if (hasUpgrade('amber', 18)) mult = mult.times(upgradeEffect('amber', 18))
        if (hasUpgrade('amber', 19)) mult = mult.times(upgradeEffect('amber', 19))
        if (hasUpgrade('amber', 20)) mult = mult.times(upgradeEffect('amber', 20))
        mult = mult.pow(buyableEffect('yellow', 13))
        if (hasUpgrade('orange', 11)) mult = mult.div(100)
        return mult
    },
    gainExp() {
        return hasUpgrade('yellow', 11) ? new Decimal(1.05) : new Decimal(1)
    },
    passiveGeneration() {
        return (hasUpgrade('amber', 17) || hasMilestone('orange', 1) || hasUpgrade('yellow', 11)) ? 1 : 0
    },
    doReset(resettingLayer) {
        if (layers[resettingLayer].row <= this.row) return
        if (hasUpgrade('yellow', 11)) layerDataReset(this.layer, ['upgrades'])
        else layerDataReset(this.layer)
    },
    row: 0,
    hotkeys: [
        {key: "r", description: "R: Reset for red", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
    layerShown(){return true},
    upgrades: {
        11: {
            title: "Point Power",
            description: "Points are 5x more powerful.",
            cost: new Decimal(1),
            effect() {
                return new Decimal(5)
            },
            effectDisplay() {
                return "Currently " + format(this.effect()) + "x points"
            },
        },
        12: {
            title: "Red Rush",
            description: "Gain 10x more red.",
            cost: new Decimal(5),
            effect() {
                return new Decimal(10)
            },
            effectDisplay() {
                return "Currently " + format(this.effect()) + "x red"
            },
        },
        13: {
            title: "Double Power",
            description: "Points are 10x more powerful and gain 10x more red.",
            cost: new Decimal(50),
            effect() {
                return new Decimal(10)
            },
            effectDisplay() {
                return "Currently " + format(this.effect()) + "x points and red"
            },
        },
        14: {
            title: "Red Fuel",
            description: "Red boosts points based on log2(red).",
            cost: new Decimal(1000),
            effect() {
                let red = player[this.layer].points
                return red.lte(1) ? new Decimal(1) : red.log(2)
            },
            effectDisplay() {
                return "Currently " + format(this.effect()) + "x points"
            },
        },
        15: {
            title: "Red Explosion",
            description: "Gain 100x more red.",
            cost: new Decimal(10000),
            effect() {
                return new Decimal(100)
            },
            effectDisplay() {
                return "Currently " + format(this.effect()) + "x red"
            },
        },
    },
})

addLayer("orange", {
    name: "Orange",
    symbol: "O",
    position: 0,
    startData() { return {
        unlocked: false,
        points: new Decimal(0),
    }},
    color: "#FF8C00",
    requires: new Decimal('1e6'),
    resource: "orange",
    baseResource: "red",
    baseAmount() {return player.red.points},
    type: "static",
    base: 10,
    exponent: 1,
    gainMult() {
        let mult = new Decimal(1)
        if (hasMilestone(this.layer, 5)) mult = mult.times(2)
        if (hasUpgrade('amber', 18)) mult = mult.times(2)
        return mult
    },
    gainExp() {
        return new Decimal(1)
    },
    canBuyMax() { return hasMilestone(this.layer, 2) },
    resetsNothing() { return hasUpgrade('amber', 16) || hasUpgrade('yellow', 12) },
    row: 1,
    layerShown() { return hasUpgrade('red', 15) },
    hotkeys: [
        {key: "o", description: "O: Reset for orange", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
    milestones: {
        0: {
            requirementDescription: "Tomato Are Getting Expensive",
            effectDescription() {
                return "Requires 1 orange. Points are 50x more powerful and red gain is 10x higher."
            },
            done() { return player[this.layer].points.gte(1) },
        },
        1: {
            requirementDescription: "Gen Red",
            effectDescription() {
                return "Requires 3 orange. Points are 100x more powerful, red gain is 100x higher, and you passively generate red."
            },
            done() { return player[this.layer].points.gte(3) },
        },
        2: {
            requirementDescription: "Very Fast Tree",
            effectDescription() {
                return "Requires 5 orange. Points are 1000x more powerful, red gain is 1000x higher, red upgrades are auto-bought, and points boost red gain by log100(points) (up to 1e308x). Orange can be bulk-bought."
            },
            done() { return player[this.layer].points.gte(5) },
        },
        3: {
            requirementDescription: "pen orange red pen",
            effectDescription() {
                return "Requires 13 orange. Red gain is 100x higher."
            },
            done() { return player[this.layer].points.gte(13) },
        },
        4: {
            requirementDescription: "Dayum bro it cannot be THAT op",
            effectDescription() {
                return "Requires 15 orange. Points are 1,000,000x more powerful and red gain is 1,000,000x higher."
            },
            done() { return player[this.layer].points.gte(15) },
        },
        5: {
            requirementDescription: "Funny scaling",
            effectDescription() {
                return "Requires 27 orange. Orange gain is 2x higher, and red and points gain are 10,000x higher but divided by 100."
            },
            done() { return player[this.layer].points.gte(27) },
        },
    },
    upgrades: {
        11: {
            title: "Sacrifice for Power",
            description: "Points are 1,000,000x more powerful, but red gain is divided by 100.",
            cost: new Decimal(15),
            effect() {
                return new Decimal(1000000)
            },
            effectDisplay() {
                return "Currently " + format(this.effect()) + "x points, red gain /100"
            },
        },
        12: {
            title: "new formula new color",
            description: "Red gain is 2x higher for every orange owned (1 orange = 1x, 2 = 2x, 3 = 4x, softcapped at 128x, then 1.1x per orange).",
            cost: new Decimal(23),
            effect() {
                let n = player.orange.points.max(1)
                if (n.lt(8)) return Decimal.pow(2, n.sub(1))
                return new Decimal(128).times(Decimal.pow(1.1, n.sub(8)))
            },
            effectDisplay() {
                return "Currently " + format(this.effect()) + "x red"
            },
        },
    },
    update(diff) {
        if (hasMilestone(this.layer, 2)) autobuyUpgrades('red')
    },
})

addLayer("amber", {
    name: "Amber",
    symbol: "A",
    position: 0,
    startData() { return {
        unlocked: false,
        points: new Decimal(0),
    }},
    color: "#FFBF00",
    requires: new Decimal(30),
    resource: "amber",
    baseResource: "orange",
    baseAmount() {return player.orange.points},
    type: "normal",
    exponent: 1,
    gainMult() {
        return new Decimal(1)
    },
    gainExp() {
        return hasUpgrade('yellow', 11) ? new Decimal(1.05) : new Decimal(1)
    },
    getResetGain() {
        let base = player.orange.points.lt(30) ? new Decimal(0) : Decimal.pow(2, player.orange.points.sub(30).div(5).floor()).round()
        let gain = base.add(player.yellow.points.times(100))
        if (hasUpgrade('yellow', 13)) gain = gain.pow(2)
        return gain
    },
    passiveGeneration() {
        return hasUpgrade('yellow', 12) ? 1 : 0
    },
    resetsNothing() {
        return hasUpgrade('yellow', 12)
    },
    row: 2,
    layerShown() { return player.orange.points.gte(30) || player.amber.points.gt(0) },
    upgrades: {
        11: {
            title: "Pissing upgrade",
            description: "Red and points gain are 50,000x higher.",
            cost: new Decimal(1),
            effect() {
                return new Decimal(50000)
            },
            effectDisplay() {
                return "Currently " + format(this.effect()) + "x red and points"
            },
        },
        12: {
            title: "yellow might be soon",
            description: "Red and points gain are 100,000,000x higher.",
            cost: new Decimal(1),
            unlocked() { return hasUpgrade(this.layer, 11) },
            effect() {
                return new Decimal(100000000)
            },
            effectDisplay() {
                return "Currently " + format(this.effect()) + "x red and points"
            },
        },
        13: {
            title: "very interesting",
            description: "Red and points gain are 10,000,000,000x higher.",
            cost: new Decimal(5),
            effect() {
                return new Decimal(10000000000)
            },
            effectDisplay() {
                return "Currently " + format(this.effect()) + "x red and points"
            },
        },
        14: {
            title: "we will burn the orange reset",
            description: "Red and points gain are 50,000,000x higher, and orange is auto-bought when affordable.",
            cost: new Decimal(25),
            effect() {
                return new Decimal(50000000)
            },
            effectDisplay() {
                return "Currently " + format(this.effect()) + "x red and points, auto-buys orange"
            },
        },
        15: {
            title: "huge things",
            description: "Red and points gain are 50,000,000,000,000x higher.",
            cost: new Decimal(100),
            effect() {
                return new Decimal(50000000000000)
            },
            effectDisplay() {
                return "Currently " + format(this.effect()) + "x red and points"
            },
        },
        16: {
            title: "orange not longer resetting",
            description: "Red and points gain are 5e18x higher, and orange no longer resets anything.",
            cost: new Decimal(5000),
            effect() {
                return new Decimal('5e18')
            },
            effectDisplay() {
                return "Currently " + format(this.effect()) + "x red and points, orange resets nothing"
            },
        },
        17: {
            title: "decillions are easy",
            description: "Red and points gain are 1e33x higher, and red is always generated passively.",
            cost: new Decimal(100000),
            effect() {
                return new Decimal('1e33')
            },
            effectDisplay() {
                return "Currently " + format(this.effect()) + "x red and points, 100% red generation"
            },
        },
        18: {
            title: "Ambering it hard",
            description: "Red and points gain are 1e63x higher, and orange gain is 2x higher.",
            cost: new Decimal(10000000),
            effect() {
                return new Decimal('1e63')
            },
            effectDisplay() {
                return "Currently " + format(this.effect()) + "x red and points, orange gain x2"
            },
        },
        19: {
            title: "Funny googol",
            description: "Red and points gain are 1e100x higher.",
            cost: new Decimal(50000000000),
            effect() {
                return new Decimal('1e100')
            },
            effectDisplay() {
                return "Currently " + format(this.effect()) + "x red and points"
            },
        },
        20: {
            title: "fast scaling",
            description: "Red and points gain are 1e200x higher.",
            cost: new Decimal('1e15'),
            effect() {
                return new Decimal('1e200')
            },
            effectDisplay() {
                return "Currently " + format(this.effect()) + "x red and points"
            },
        },
    },
    update(diff) {
        if (hasUpgrade(this.layer, 14) && canReset('orange')) doReset('orange')
    },
})

addLayer("yellow", {
    name: "Yellow",
    symbol: "Y",
    position: 0,
    startData() { return {
        unlocked: false,
        points: new Decimal(0),
    }},
    color: "#FFFF00",
    requires: new Decimal('1e24'),
    resource: "yellow",
    baseResource: "amber",
    baseAmount() {return player.amber.points},
    type: "static",
    exponent: 1,
    gainMult() {
        return new Decimal(1)
    },
    gainExp() {
        return new Decimal(1)
    },
    getResetGain() {
        return player.amber.points.div('1e24').max(1).times('1e315').floor().max(1).pow(buyableEffect(this.layer, 12))
    },
    getNextAt(canMax) {
        return new Decimal('1e24')
    },
    canBuyMax: true,
    row: 3,
    layerShown() { return player.amber.points.gte('1e24') || player.yellow.points.gt(0) },
    upgrades: {
        11: {
            title: "Unleashed",
            description: "Red is generated passively, orange and orange upgrades are auto-bought, red upgrades are kept on yellow reset, and red and amber gain is boosted by ^1.05.",
            cost: new Decimal(1),
            unlocked() { return player[this.layer].unlocked },
        },
        12: {
            title: "Finally dude",
            description: "Amber is generated passively and auto-buys its upgrades, and orange and amber no longer reset anything.",
            cost: new Decimal('1e234567'),
        },
        13: {
            title: "Crazily good",
            description: "Amber gain is raised to the 2nd power (^2).",
            cost: new Decimal('1e10000000'),
        },
        14: {
            title: "Chartreuse Unlock",
            description: "Unlock a brand new layer: chartreuse! It resets everything before it.",
            cost: new Decimal('1e20000000'),
        },
    },
    buyables: {
        11: {
            title: "Buyables unleashed",
            cost(x) {
                return Decimal.pow(2, x).floor()
            },
            effect(x) {
                return Decimal.pow(1.1, x)
            },
            display() {
                let data = tmp[this.layer].buyables[this.id]
                return "Cost: " + format(data.cost) + " yellow\nAmount: " + formatWhole(player[this.layer].buyables[this.id]) + "/100\nRaises points gain to the power of " + format(data.effect)
            },
            unlocked() { return player[this.layer].unlocked },
            canAfford() {
                return player[this.layer].points.gte(tmp[this.layer].buyables[this.id].cost)
            },
            buy() {
                let cost = tmp[this.layer].buyables[this.id].cost
                player[this.layer].points = player[this.layer].points.sub(cost)
                player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].add(1)
                player[this.layer].spentOnBuyables = player[this.layer].spentOnBuyables.add(cost)
            },
            buyMax() {
                while (player[this.layer].points.gte(layers[this.layer].buyables[this.id].actualCostFunction(player[this.layer].buyables[this.id])) && player[this.layer].buyables[this.id].lt(this.purchaseLimit)) {
                    let cost = layers[this.layer].buyables[this.id].actualCostFunction(player[this.layer].buyables[this.id])
                    player[this.layer].points = player[this.layer].points.sub(cost)
                    player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].add(1)
                    player[this.layer].spentOnBuyables = player[this.layer].spentOnBuyables.add(cost)
                }
            },
            purchaseLimit: new Decimal(100),
            style: {'height': '222px'},
        },
        12: {
            title: "yellow power already?",
            cost(x) {
                return new Decimal('1e5000').times(Decimal.pow(1.005, x))
            },
            effect(x) {
                return Decimal.pow(1.00025, x)
            },
            display() {
                let data = tmp[this.layer].buyables[this.id]
                return "Cost: " + format(data.cost) + " yellow<br>Amount: " + formatWhole(getBuyableAmount(this.layer, this.id)) + "/10000<br>Yellow gain is raised to the power of " + format(data.effect)
            },
            canAfford() {
                return player[this.layer].points.gte(tmp[this.layer].buyables[this.id].cost)
            },
            buy() {
                let cost = tmp[this.layer].buyables[this.id].cost
                player[this.layer].points = player[this.layer].points.sub(cost)
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            buyMax() {
                while (player[this.layer].points.gte(layers[this.layer].buyables[this.id].actualCostFunction(getBuyableAmount(this.layer, this.id))) && getBuyableAmount(this.layer, this.id).lt(this.purchaseLimit)) {
                    let cost = layers[this.layer].buyables[this.id].actualCostFunction(getBuyableAmount(this.layer, this.id))
                    player[this.layer].points = player[this.layer].points.sub(cost)
                    setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
                }
            },
            purchaseLimit: new Decimal(10000),
        },
        13: {
            title: "huge numbers",
            cost(x) {
                return new Decimal('1e1000000').times(Decimal.pow(1.1, x))
            },
            effect(x) {
                return Decimal.pow(1.02, x)
            },
            display() {
                let data = tmp[this.layer].buyables[this.id]
                return "Cost: " + format(data.cost) + " yellow<br>Amount: " + formatWhole(getBuyableAmount(this.layer, this.id)) + "/100<br>Red and points gain is raised to the power of " + format(data.effect)
            },
            canAfford() {
                return player[this.layer].points.gte(tmp[this.layer].buyables[this.id].cost)
            },
            buy() {
                let cost = tmp[this.layer].buyables[this.id].cost
                player[this.layer].points = player[this.layer].points.sub(cost)
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            buyMax() {
                while (player[this.layer].points.gte(layers[this.layer].buyables[this.id].actualCostFunction(getBuyableAmount(this.layer, this.id))) && getBuyableAmount(this.layer, this.id).lt(this.purchaseLimit)) {
                    let cost = layers[this.layer].buyables[this.id].actualCostFunction(getBuyableAmount(this.layer, this.id))
                    player[this.layer].points = player[this.layer].points.sub(cost)
                    setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
                }
            },
            purchaseLimit: new Decimal(100),
        },
    },
    update(diff) {
        if (hasUpgrade(this.layer, 11)) {
            if (canReset('orange')) doReset('orange')
            autobuyUpgrades('orange')
        }
        if (hasUpgrade(this.layer, 12)) autobuyUpgrades('amber')
    },
})

addLayer("chartreuse", {
    name: "Chartreuse",
    symbol: "C",
    position: 0,
    startData() { return {
        unlocked: false,
        points: new Decimal(0),
    }},
    color: "#7FFF00",
    requires: new Decimal('1e100000000'),
    resource: "chartreuse",
    baseResource: "yellow",
    baseAmount() {return player.yellow.points},
    type: "normal",
    exponent: 1,
    gainMult() {
        return new Decimal(1)
    },
    gainExp() {
        return new Decimal(1)
    },
    row: 4,
    layerShown() { return hasUpgrade('yellow', 14) || player[this.layer].points.gt(0) },
})
