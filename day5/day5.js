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
  const seedsCurrentValue = {};

  input.seeds.forEach(seed => {
    seedsCurrentValue[seed] = seed;
    seedsCurrentValue[seed] = getDestinationValue(seedsCurrentValue[seed], input['seed-to-soil map']);
    seedsCurrentValue[seed] = getDestinationValue(seedsCurrentValue[seed], input['soil-to-fertilizer map']);
    seedsCurrentValue[seed] = getDestinationValue(seedsCurrentValue[seed], input['fertilizer-to-water map']);
    seedsCurrentValue[seed] = getDestinationValue(seedsCurrentValue[seed], input['water-to-light map']);
    seedsCurrentValue[seed] = getDestinationValue(seedsCurrentValue[seed], input['light-to-temperature map']);
    seedsCurrentValue[seed] = getDestinationValue(seedsCurrentValue[seed], input['temperature-to-humidity map']);
    seedsCurrentValue[seed] = getDestinationValue(seedsCurrentValue[seed], input['humidity-to-location map']);
  });

  return Object.values(seedsCurrentValue).sort((a, b) => a - b)[0];
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

mapsDict.seeds = [];

for(let i = 0; i < seeds.length; i+=2) {
  for (let j = 0; j < seeds[i+1]; j++) {
    mapsDict.seeds.push(seeds[i] + j)
  }
}

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
