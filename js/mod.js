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
	num: "0.1",
	name: "added yellow and stuff",
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
	if (hasUpgrade("amber", 20)) gain = gain.times(upgradeEffect("amber", 20))
	gain = gain.times(getYellowMult("points"))
	return gain
}

// Yellow meta multipliers, based on how many yellow you own
function getYellowMult(type) {
	let y = player.yellow.points.max(0)
	if (type === "points" || type === "red") return Decimal.pow(10, y.times(100)).min(new Decimal('1e1000'))
	if (type === "orange") return Decimal.pow(2, y).min(200)
	if (type === "amber") return Decimal.pow(500, y).min(10000)
	return new Decimal(1)
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
}