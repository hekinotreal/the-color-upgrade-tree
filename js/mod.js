let modInfo = {
	name: "The Color Tree",
	author: "hekinotreal",
	pointsName: "points",
	modFiles: ["layers.js", "tree.js"],

	discordName: "",
	discordLink: "",
	initialStartPoints: new Decimal (10), // Used for hard resets and new players
	offlineLimit: 1,  // In hours
}

// Set your version in num and name
let VERSION = {
	num: "0.70",
	name: "THE LIME UPDATE",
}

let changelog = `<h1>Changelog:</h1><br>
	<h3>v0.0</h3><br>
		- Added things.<br>
		- Added stuff.`

let winText = `Congratulations! You have reached the end and beaten this game, but for now...`

// If you add new functions anywhere inside of a layer, and those functions have an effect when called, add them here.
// (The ones here are examples, all official functions are already taken care of)
var doNotCallTheseFunctionsEveryTick = ["blowUpEverything"]

function getStartPoints(){
    return new Decimal(modInfo.initialStartPoints)
}

// Determines if it should show points/sec
function canGenPoints(){
	return true
}

// Calculate points/sec!
function getPointGen() {
	if(!canGenPoints())
		return new Decimal(0)

	let gain = new Decimal(1)
	if (hasUpgrade("red", 11)) gain = gain.times(upgradeEffect("red", 11))
	if (hasUpgrade("red", 13)) gain = gain.times(upgradeEffect("red", 13))
	if (hasUpgrade("red", 14)) gain = gain.times(upgradeEffect("red", 14))
	if (hasMilestone("orange", 0)) gain = gain.times(50)
	if (hasMilestone("orange", 1)) gain = gain.times(100)
	if (hasMilestone("orange", 2)) gain = gain.times(1000)
	if (hasMilestone("orange", 4)) gain = gain.times(1000000)
	if (hasMilestone("orange", 5)) gain = gain.times(10000)
	if (hasMilestone("orange", 5)) gain = gain.div(100)
	if (hasUpgrade("orange", 11)) gain = gain.times(upgradeEffect("orange", 11))
	if (hasUpgrade("amber", 11)) gain = gain.times(upgradeEffect("amber", 11))
	if (hasUpgrade("amber", 12)) gain = gain.times(upgradeEffect("amber", 12))
	if (hasUpgrade("amber", 13)) gain = gain.times(upgradeEffect("amber", 13))
	if (hasUpgrade("amber", 14)) gain = gain.times(upgradeEffect("amber", 14))
	if (hasUpgrade("amber", 15)) gain = gain.times(upgradeEffect("amber", 15))
	if (hasUpgrade("amber", 16)) gain = gain.times(upgradeEffect("amber", 16))
	if (hasUpgrade("amber", 17)) gain = gain.times(upgradeEffect("amber", 17))
	if (hasUpgrade("amber", 18)) gain = gain.times(upgradeEffect("amber", 18))
	if (hasUpgrade("amber", 19)) gain = gain.times(upgradeEffect("amber", 19))
	if (hasUpgrade("amber", 22)) gain = gain.times(upgradeEffect("amber", 22))
	if (player.yellow.buyables[11].gt(0)) gain = gain.pow(buyableEffect("yellow", 11))
	if (player.yellow.buyables[13].gt(0)) gain = gain.pow(buyableEffect("yellow", 13))
	if (hasUpgrade("chartreuse", 11)) gain = gain.pow(upgradeEffect("chartreuse", 11))
	if (hasUpgrade("chartreuse", 17)) gain = gain.pow(upgradeEffect("chartreuse", 17))
	if (hasUpgrade("chartreuse", 25)) gain = gain.pow(2)
	if (hasUpgrade("lime", 11)) gain = gain.pow(500)
	if (hasUpgrade("lime", 12)) gain = gain.pow('1e6')
	if (hasUpgrade("lime", 13)) gain = gain.pow('1e66')
	if (hasUpgrade("lime", 14)) gain = gain.pow('1e5000')
	if (hasUpgrade("lime", 15)) gain = gain.pow('1e1e5000')
	if (hasUpgrade("lime", 16)) gain = gain.pow('1e1e1e1e50000')
	if (hasUpgrade("red", 16)) gain = gain.tetrate(1.1)
	if (hasUpgrade("red", 17)) gain = gain.tetrate(10)
	if (hasUpgrade("red", 19)) gain = gain.times(new Decimal(10).tetrate(Decimal.pow(10, player.points.slog().div(222))))
	return softcap(gain, new Decimal('1e20000000'), 0.15).times(100)
}

// You can add non-layer related variables that should to into "player" and be saved here, along with default values
function addedPlayerData() { return {
}}

// Display extra things at the top of the page
var displayThings = [
]

// Determines when the game "ends"
function isEndgame() {
	return player.points.gte(new Decimal("e280000000"))
}



// Less important things beyond this point!

// Style for the background, can be a function
var backgroundStyle = {

}

// You can change this if you have things that can be messed up by long tick lengths
function maxTickLength() {
	return(3600) // Default is 1 hour which is just arbitrarily large
}

// Use this if you need to undo inflation from an older version. If the version is older than the version that fixed the issue,
// you can cap their current resources with this.
function fixOldSave(oldVersion){
	if (player.amber.upgrades && Array.isArray(player.amber.upgrades) && player.amber.upgrades.includes(20)) {
		if (!player.amber.upgrades.includes(22)) player.amber.upgrades.push(22)
		player.amber.upgrades = player.amber.upgrades.filter(x => x !== 20)
	}
	if (player.yellow.points.gt('1e100000000000000000000')) player.yellow.points = new Decimal('1e100000000000000000000')
	if (player.amber.points.gt('1e100000000000000000000')) player.amber.points = new Decimal('1e100000000000000000000')
	if (player.orange.points.gt('1e100000000000000000000')) player.orange.points = new Decimal('1e100000000000000000000')
	if (player.red.points.gt('1e100000000000000000000')) player.red.points = new Decimal('1e100000000000000000000')
	if (player.chartreuse.points.gt('1e100000000000000000000')) player.chartreuse.points = new Decimal('1e100000000000000000000')
	if (player.points.gt('1e100000000000000000000')) player.points = new Decimal('1e100000000000000000000')
}