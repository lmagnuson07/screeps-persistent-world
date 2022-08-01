var generatecreep = {
    run: function (creep, totalEnergy, name, role, partsOption){
        if (totalEnergy === 1300){
            let body = [];
            if (partsOption === "generic"){
                //700 - work(100)
                for(let i = 0; i < 7; i++){
                    body.push(WORK);
                }
                //350 - carry(50)
                for(let i = 0; i < 7; i++){
                    body.push(CARRY);
                }
                //250 - move(50)
                for(let i = 0; i < 5; i++){
                    body.push(MOVE);
                }
            }
            // for the upgraders
            else if (partsOption === "morecarry"){
                //800 - work(100)
                for(let i = 0; i < 8; i++){
                    body.push(WORK);
                }
                //350 - carry(50)
                for(let i = 0; i < 7; i++){
                    body.push(CARRY);
                }
                //150 - move(50)
                for(let i = 0; i < 3; i++){
                    body.push(MOVE);
                }
            }
            // for the baseharvester
            else if (partsOption === "morespeed"){
                //800 - work(100)
                for(let i = 0; i < 8; i++){
                    body.push(WORK);
                }
                //300 - carry(50)
                for(let i = 0; i < 7; i++){
                    body.push(CARRY);
                }
                //200 - move(50)
                for(let i = 0; i < 3; i++){
                    body.push(MOVE);
                }
            }
            creep = Game.spawns["Spawn1"].spawnCreep(body, name, {memory: {role: role}});
        }
        return creep;
    }
}

module.exports = generatecreep;