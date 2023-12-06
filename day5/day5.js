var fs = require('fs');

const getDestinationValue = (current, map) => {
  let foundWay = false;

  map.forEach(([destination, source, range]) => {
    if (!foundWay) {
      if (current >= source && current <= range - 1 + source ) {
        current = destination + current - source
        foundWay = true;
      }
    }
  });

  return current;
}

const getLowestLocationNumber = input => {
  let min = null;

  for(let i = 0; i < input.seeds.length; i+=2) {
    for (let j = 0; j < input.seeds[i+1]; j++) {
      let n = input.seeds[i+j];
      let seed2soil = getDestinationValue(n, input['seed-to-soil map']);
      let soil2Fert = getDestinationValue(seed2soil, input['soil-to-fertilizer map']);
      let fert2water = getDestinationValue(soil2Fert, input['fertilizer-to-water map']);
      let water2light = getDestinationValue(fert2water, input['water-to-light map']);
      let light2temp = getDestinationValue(water2light, input['light-to-temperature map']);
      let temp2humid = getDestinationValue(light2temp, input['temperature-to-humidity map']);
      let humid2loc = getDestinationValue(temp2humid, input['humidity-to-location map']);

      if(Number(min) && min > humid2loc) {
        min = humid2loc;
      } if(!min) {
        min = humid2loc;
      }
    }
  }

  return min;
}

// getting the input

let data;

try {
    data = fs.readFileSync('input.txt', 'utf8');
} catch(e) {
    console.log('Error:', e.stack);
}

const firstSplit = data.split('\n');

let [seeds, ...rest] = firstSplit;

const mapsDict = {}

seeds = seeds.split(':')[1].split(' ').filter(element => element !== '').map(n => parseInt(n, 10));;

mapsDict.seeds = seeds;

let newContent = false;
let currentMap = ''

for (let i = 0; i < rest.length; i++) {
  if(newContent) {
    newContent = false;
    currentMap = rest[i].split(':')[0];
    mapsDict[currentMap] = [];
  } else if (rest[i] === '') {
    newContent = true;
  } else {
    mapsDict[currentMap].push(rest[i].split(' ').map(n => parseInt(n, 10)))
  }
};

console.log(getLowestLocationNumber(mapsDict))
