var roleHarvester = {
    run: function(creep,sourcesIndex){
		if (creep.memory.transfering && creep.store[RESOURCE_ENERGY] == 0){
			creep.memory.transfering = false;
            creep.say('⛏️ harvest');
		}
		if (!creep.memory.transfering && creep.store.getFreeCapacity() == 0){
			creep.memory.transfering = true;
            creep.say('📦transfer');
		}
	
		if (creep.memory.transfering){
			var targets = creep.room.find(FIND_MY_STRUCTURES, {
				filter: (structure) => {
					return (structure.structureType == STRUCTURE_EXTENSION || structure.structureType == STRUCTURE_SPAWN) &&
						structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0;
				}
			});
			// upgrades an extension, since the spawn is always position 0. With the auto spawning, the spawn is only evey empty for 1 tick.
			if (targets.length > 1){
				creep.moveTo(targets[1], {visualizePathStyle: {stroke: "#ffffff"}});
				creep.transfer(targets[1], RESOURCE_ENERGY);
			}
			else if (targets.length == 1){
				creep.moveTo(targets[0], {visualizePathStyle: {stroke: "#ffffff"}});
				creep.transfer(targets[0], RESOURCE_ENERGY);
			}
		}
		else {
            var sources = creep.room.find(FIND_SOURCES);
			if (sources[sourcesIndex].energy == 0){
				if (creep.store.getFreeCapacity() !== creep.store.getCapacity()){
					creep.memory.transfering = true;
                }
				else {
					creep.moveTo(sources[1 - sourcesIndex], {visualizePathStyle: {stroke: "#ffaa00"}});
				}
			}
			else {
				creep.moveTo(sources[sourcesIndex], {visualizePathStyle: {stroke: "#ffaa00"}});
				creep.harvest(sources[sourcesIndex]);
			}
		}
    }
}

module.exports = roleHarvester;