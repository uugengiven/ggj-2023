const daffo = {
    name: "Daffydill",
    id: 1,
    root_depth: 10,
    root_spread: 30,
    height: 20,
    spread: 10,
    water: 30, // ideal amount of water
    water_range: 10, // how much it can handle the water changing
    sun: 30, // ideal amount of sun
    sun_range: 10, // how much sun variance there is
    nitrogen: 10,
    phosphorus: 20,
    potassium: -5,
    flouride: -4,
    lead: -1,
    toxic: 1,
    leaf_size: 5,
    leaf_shape: [1,0],
    flower_color: {
        h: 230,
        s: 70,
        l: 50
    },
    fruit: 5, // how much food does it produce?
    growth_time: [3,5,7,7,7,0], // how much does it grow per month?

    growth_speed: 0, // calculated - leaf size, nutrients total?
    heartiness: 0, // calculated - root depth, water_range, growth_time?
    food_provided: 0, // calculated (water, growth speed, growth time, fruit)
}

const potat = {
    name: "Portato",
    id: 2,
    root_depth: 70,
    root_spread: 20,
    height: 20,
    spread: 70,
    water: 35, // ideal amount of water
    water_range: 20, // how much it can handle the water changing
    sun: 30, // ideal amount of sun
    sun_range: 10, // how much sun variance there is
    nitrogen: -2,
    phosphorus: -8,
    potassium: 10,
    flouride: -4,
    lead: -1,
    toxic: 1,
    leaf_size: 7,
    leaf_shape: [2,1],
    flower_color: {
        h: 50,
        s: 70,
        l: 50
    },
    fruit: 70, // how much food does it produce?
    growth_time: [3,3,3,3,3,3], // how much does it grow per month?

    growth_speed: 0, // calculated - leaf size, nutrients total?
    heartiness: 0, // calculated - root depth, water_range, growth_time?
    food_provided: 0, // calculated (water, growth speed, growth time, fruit)
}