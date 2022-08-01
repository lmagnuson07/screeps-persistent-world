var generateCreep = require('generatecreep');
var roleHarvester = require('role.harvester');
var roleUpgrader = require('role.upgrader');
var roleBuilder = require('role.builder');
var roleRepairer = require('role.repairer');
var roleBaseHarvester = require('role.baseharvester');

module.exports.loop = function () {
	// The name is no longer optional. 
	//Game.spawns["Spawn1"].spawnCreep([WORK, CARRY, MOVE, MOVE], "Emily");
	//Game.spawns["Spawn1"].spawnCreep([WORK, WORK,WORK,CARRY, CARRY, MOVE, MOVE], "Mitch", {memory: {role: "harvester"}});
	
	// accessing a specific creaps memory 
	//Game.creeps["Bill"].memory.harvesting = true;
	//Game.creeps["Harvester40356754"].memory.role = "baseharvester";
	//Game.creeps["Emily"].memory.role = "harvester";
	// clear memory
	for (let name in Memory.creeps){
		if (!Game.creeps[name]){
			delete Memory.creeps[name];
		}
	}

	// gets the last creep spawned (oldest).
	let rdmCreep = Object.keys(Game.creeps)[Object.keys(Game.creeps).length - 1];
	// console.log(Object.keys(Game.creeps))
	// for (const name in Game.creeps) {
	// 	rdmCreep = name;
	// 	break;
	// }
	if (rdmCreep != undefined){
		var sources = Game.creeps[rdmCreep].room.find(FIND_SOURCES);
		//var activeSources = Game.creeps[rdmCreep].room.find(FIND_SOURCES_ACTIVE);

		var structures = Game.creeps[rdmCreep].room.find(FIND_STRUCTURES, {
			filter: (s) => s.hits < s.hitsMax && s.structureType != STRUCTURE_WALL
		});
		structures.sort((a,b) => a.hits - b.hits);

		var extensions = Game.creeps[rdmCreep].room.find(FIND_STRUCTURES, {
			filter: (s) => s.structureType === STRUCTURE_EXTENSION &&
			s.store.getFreeCapacity(RESOURCE_ENERGY) > 0
		});

		//console.log(`Active sources: ${activeSources}`);
		console.log(`Damaged structures: ${structures}`);
		console.log(`Empty extensions: ${extensions.length}`)
	}

	//let harvesters = _(Game.creeps).filter( {memory: {role: 'harvester'}});
	let baseHarvesterCount = _.sum(Game.creeps, (c) => c.memory.role == "baseharvester");
	let harvesterCount = _.sum(Game.creeps, (c) => c.memory.role == "harvester");
	let upgraderCount = _.sum(Game.creeps, (c) => c.memory.role == "upgrader");
	let builderCount = _.sum(Game.creeps, (c) => c.memory.role == "builder");
	let repairerCount = _.sum(Game.creeps, (c) => c.memory.role == "repairer");

	//console.log(Game.getObjectById("5bbcb05e9099fc012e63c0b7").energy)
	//console.log(Game.getObjectById("5bbcb05e9099fc012e63c0b8").energy)
	
	console.log(`Num creeps ${Object.keys(Game.creeps).length}`)
	console.log(`BaseHarvesters: ${baseHarvesterCount}`);
	console.log(`Harvesters: ${harvesterCount}`);
	console.log(`Upgraders: ${upgraderCount}`);
	console.log(`Builders: ${builderCount}`);
	console.log(`Repaiers: ${repairerCount}`);

	// perform creep role actions
	for (const name in Game.creeps) {
		let sourcesIndex = 0;
		const creep = Game.creeps[name];

		if (creep.memory.role == "baseharvester"){
			if (sources[0].energy == 0){
				sourcesIndex = 1;
			}
			else {
				sourcesIndex = 0;
			}
			roleBaseHarvester.run(creep,sourcesIndex);
		}
		if (creep.memory.role == "harvester"){
			if (sources[1].energy == 0){
				sourcesIndex = 0;
			}
			else {
				sourcesIndex = 1;
			}
			roleHarvester.run(creep,sourcesIndex);
		}
		if (creep.memory.role == "upgrader"){
			if (sources[0].energy == 0){
				sourcesIndex = 1;
			}
			else {
				sourcesIndex = 0;
			}
			roleUpgrader.run(creep,sourcesIndex);
		}
		if (creep.memory.role == "builder"){
			if (sources[1].energy == 0){
				sourcesIndex = 0;
			}
			else {
				sourcesIndex = 1;
			}
			roleBuilder.run(creep,sourcesIndex);
		}
		if (creep.memory.role == "repairer"){
			if (sources[1].energy == 0){
				sourcesIndex = 0;
			}
			else {
				sourcesIndex = 1;
			}
			roleRepairer.run(creep,sourcesIndex);
		}
	}
	
	// automation of scripts
	let creep;
	let minBaseHarvester = 1;
	let minHarvesters = 3;
	let minUpgraders = 2;
	let minBuilders = 2;
	let minRepairers = 1;

	// ensure that we always have a baseharvester if we at least have creeps.
	if (baseHarvesterCount == 0 && Object.keys(Game.creeps).length !== 0){
		Game.creeps[rdmCreep].memory.role = "baseharvester";
	}
	// if we dont have harvesters, we have a baseharvester and we at least 2 creeps.
	// since we would have just assigned the baseharvester, we grab the next element below the end of the array. 
	if (baseHarvesterCount > 0 && harvesterCount == 0 && Object.keys(Game.creeps).length >= 2){
		rdmCreep = Object.keys(Game.creeps)[Object.keys(Game.creeps).length - 2];
		Game.creeps[rdmCreep].memory.role = "harvester";
	}
	// 3 creeps or less
	if (Object.keys(Game.creeps).length <= 3){
		// no creeps left.
		if (Object.keys(Game.creeps).length == 0){
			Game.spawns["Spawn1"].spawnCreep([WORK, CARRY, CARRY, MOVE, MOVE], `BaseHarvester${Game.time}`, {memory: {role: 'baseharvester'}});
		}
		// will always have a baseharvester here. Goes here until we have 3 creeps in total (makes 2 harvesters)
		else {
			Game.spawns["Spawn1"].spawnCreep([WORK, CARRY, CARRY, MOVE, MOVE], `Harvester${Game.time}`, {memory: {role: 'harvester'}});
		}
	}
	
	if (baseHarvesterCount < minBaseHarvester) {
		//(creep, totalEnergy, name, role, partsOption)
		//(creep,1300,`BaseHarvester${Game.time}`,'baseharvester','morespeed')
		creep = Game.spawns["Spawn1"].spawnCreep(
			[WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK, // 800
			CARRY,CARRY,CARRY,CARRY,CARRY,CARRY, // 300
			MOVE,MOVE,MOVE,MOVE], // 200
			`BaseHarvester${Game.time}`, 
			{memory: {role: 'baseharvester'}});
	}
	else if (harvesterCount < minHarvesters) {
		//(creep,1300,`Harvester${Game.time}`,'harvester','generic')
		creep = Game.spawns["Spawn1"].spawnCreep(
			[WORK,WORK,WORK,WORK,WORK,WORK,WORK, // 700
			CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY, // 350
			MOVE,MOVE,MOVE,MOVE,MOVE], // 250
			`Harvester${Game.time}`, 
			{memory: {role: 'harvester'}});
	}
	else if (upgraderCount < minUpgraders) {
		//(creep,1300,`Upgrader${Game.time}`,'upgrader','morecarry')
		creep = Game.spawns["Spawn1"].spawnCreep(
			[WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK, // 800
			CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY, // 350
			MOVE,MOVE,MOVE],  //150
			`Upgrader${Game.time}`, 
			{memory: {role: 'upgrader'}});
	}
	else if (repairerCount < minRepairers) {
		//(creep,1300,`Repairer${Game.time}`,'repairer','generic')
		creep = Game.spawns["Spawn1"].spawnCreep(
			[WORK,WORK,WORK,WORK,WORK,WORK,WORK,
			CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,
			MOVE,MOVE,MOVE,MOVE,MOVE], 
			`Repairer${Game.time}`, 
			{memory: {role: 'repairer'}});
	}
	else if (builderCount < minBuilders) {
		//(creep,1300,`Builder${Game.time}`,'builder','generic')
		creep = Game.spawns["Spawn1"].spawnCreep(
			[WORK,WORK,WORK,WORK,WORK,WORK,WORK,
			CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,
			MOVE,MOVE,MOVE,MOVE,MOVE], 
			`Builder${Game.time}`, 
			{memory: {role: 'builder'}});
	}
	else {
		if (repairerCount < (minRepairers + 1)){
			//(creep,1300,`Repairer${Game.time}`,'repairer','generic')
			creep = Game.spawns["Spawn1"].spawnCreep(
				[WORK,WORK,WORK,WORK,WORK,WORK,WORK,
				CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,
				MOVE,MOVE,MOVE,MOVE,MOVE], 
				`Repairer${Game.time}`, 
				{memory: {role: 'repairer'}});
		}
		else if (harvesterCount < (minHarvesters + 1)){
			//(creep,1300,`Harvester${Game.time}`,'harvester','generic')
			creep = Game.spawns["Spawn1"].spawnCreep(
				[WORK,WORK,WORK,WORK,WORK,WORK,WORK, // 700
				CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY, // 350
				MOVE,MOVE,MOVE,MOVE,MOVE], // 250
				`Harvester${Game.time}`, 
				{memory: {role: 'harvester'}});
		}
		else {
			//(creep,1300,`Builder${Game.time}`,'builder','generic')
			creep = Game.spawns["Spawn1"].spawnCreep(
				[WORK,WORK,WORK,WORK,WORK,WORK,WORK,
				CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,
				MOVE,MOVE,MOVE,MOVE,MOVE], 
				`Builder${Game.time}`, 
				{memory: {role: 'builder'}});
		}
	}
	//console.log(`Spawn error: ${creep}`);
};