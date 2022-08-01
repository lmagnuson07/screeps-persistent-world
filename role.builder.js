var roleUpgrader = require('role.upgrader');

var roleBuilder = {
    run: function(creep, sourcesIndex) {
        if (creep.memory.building && creep.store[RESOURCE_ENERGY] == 0){
            creep.memory.building = false;
            creep.say('⛏️ harvest');
        }
        if (!creep.memory.building && creep.store.getFreeCapacity() == 0){
            creep.memory.building = true;
            creep.say('🚧 build');
        }

        if (creep.memory.building) {
            var targets = creep.room.find(FIND_CONSTRUCTION_SITES);
            if (targets.length > 0){
                creep.moveTo(targets[0], {visualizePathSize: {stroke: '#ffffff'}});
                creep.build(targets[0]);
            }
            else {
                roleUpgrader.run(creep,sourcesIndex);
            }
        }
        else {
            var sources = creep.room.find(FIND_SOURCES);
            creep.moveTo(sources[sourcesIndex], {visualizePathStyle: {stroke: "#ffaa00"}});
            if (sources[sourcesIndex].energy == 0){
                if (creep.store.getFreeCapacity() !== creep.store.getCapacity()){
                    creep.memory.building = true;
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

module.exports = roleBuilder;