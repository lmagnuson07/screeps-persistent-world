
var roleUpgrader = {
    run: function(creep,sourcesIndex){
		if (creep.memory.upgrading && creep.store[RESOURCE_ENERGY] == 0){
			creep.memory.upgrading = false;
			creep.say('⛏️ harvest');
		}
		if (!creep.memory.upgrading && creep.store.getFreeCapacity() == 0){
			creep.memory.upgrading = true;
            creep.say('⚡ upgrade');
		}
	
		if (creep.memory.upgrading){
			creep.moveTo(creep.room.controller, {visualizePathStyle: {stroke: "#ffffff"}});
			creep.upgradeController(creep.room.controller);
		}
		else {
            var sources = creep.room.find(FIND_SOURCES);
			creep.moveTo(sources[sourcesIndex], {visualizePathStyle: {stroke: "#ffaa00"}});
			if (sources[sourcesIndex].energy == 0){
				if (creep.store.getFreeCapacity() !== creep.store.getCapacity()){
					creep.memory.upgrading = true;
				}
				else {
					creep.moveTo(sources[1 - sourcesIndex], {visualizePathStyle: {stroke: "#ffaa00"}});
				}
			}
			else {
				creep.moveTo(sources[sourcesIndex], {visualizePathStyle: {stroke: "#ffaa00"}});
				creep.harvest(sources[sourcesIndex]);
			}
			//creep.harvest(sources[sourcesIndex]); // returns -6 if not enough resources 
			
			// When a source is empty, it is removed from the array returned from the find(fuction), so this code doesnt work
            // if (sources[sourcesIndex].energy == 0){
            //     creep.moveTo(sources[1], {visualizePathStyle: {stroke: "#ffaa00"}});
			//     creep.harvest(sources[1]);
            // }
            // else {
            //     creep.moveTo(sources[sourcesIndex], {visualizePathStyle: {stroke: "#ffaa00"}});
            //     creep.harvest(sources[sourcesIndex]);
            // }
		}
    }
}

module.exports = roleUpgrader;