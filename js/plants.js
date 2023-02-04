const SMALL = 10;
const GROWTH_TIME_MIN = 0;
const GROWTH_TIME_MAX = 10;

const small_random = () => {
    return Math.floor((Math.random() * SMALL) - (SMALL / 2))
}

const soil_factory = (soil_stats) => {
    let soil = {
        moisture: 0,
        sandiness: 0,
        clay: 0,
        water_retention: 0,
        depth: 0,
        airation: 0,
        biomass: 0,
        parasites: 0,
        helpful_critters: 0,
        nitrogen: 0,
        phosphorus: 0,
        potassium: 0,
        flouride: 0,
        lead: 0,
        toxic: 0
    }

    return {...soil, ...soil_stats}
}

const ohio_dirt = {
    moisture: 20,
    sandiness: 20,
    clay: 10,
    water_retention: 40,
    depth: 40,
    airation: 40,
    biomass: 30,
    parasites: 20,
    helpful_critters: 40,
    nitrogen: 40,
    phosphorus: 40,
    potassium: 40,
    flouride: 0,
    lead: 10,
    toxic: 0
}

const plant_factory = (plant_stats) => {
    let plant = {
        root_depth: 0,
        water: 0, // ideal amount of water
        water_range: 0, // how much it can handle the water changing
        sun: 0, // ideal amount of sun
        sun_range: 0, // how much sun variance there is
        nitrogen: 0,
        phosphorus: 0,
        potassium: 0,
        flouride: 0,
        lead: 0,
        toxic: 0,
        leaf_size: 0,
        leaf_shape: [0,0],
        flower_shape: 0,
        flower_color: {
            h: 0,
            s: 0,
            l: 0
        },
        fruit: 0, // how much food does it produce?
        growth_time: [10,10,10,10,10,10], // how much does it grow per month (must be 6 months)
        
        monthly_growth_multiplier: 0,
        growth_speed: 0, // calculated - leaf size, nutrients total?
        heartiness: 0, // calculated - root depth, water_range, growth_time?
        food_provided: 0, // calculated (water, growth speed, growth time, fruit)
    };

    return compute_plant({...plant, ...plant_stats});
}

const leaf_shapes = ([left, right]) => {
    const prefixes = [
        "tri",
        "duo",
        "quad",
        "man",
        "pirate",
        "curled"
    ];
    const suffixes = [
        "fold",
        "foil",
        "heart",
        "ear",
        "cress"
    ]

    return prefixes[left] + suffixes[right]
}

const flower_shapes = (index) => {
    const shapes = [
        "rose",
        "tulip",
        "daisy",
        "orchid"
    ]

    return shapes[index]
}

const compute_plant = (plant) => {
    const {
        nitrogen, 
        phosphorus, 
        potassium, 
        leaf_size,
        root_depth,
        water_range,
        growth_time,
        water,
        sun,
        sun_range,
        fruit,
    } = plant;
    plant.growth_speed = (leaf_size + nitrogen + potassium + phosphorus) / 2
    plant.heartiness = root_depth + water_range + growth_time + sun_range - leaf_size
    // plant.food_provided = (growth_time + plant.growth_speed + water) * (fruit / 100.0)  // this should be per month

    plant.monthly_growth_multiplier = 100 / growth_time.reduce((acc, num) => acc + num)
    return plant;
}

const daffo = {
    root_depth: 10,
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
    fruit: 20, // how much food does it produce?
    growth_time: [3,5,7,7,7,0], // does it finish in 1 month, 2, 3?

    growth_speed: 0, // calculated - leaf size, nutrients total?
    heartiness: 0, // calculated - root depth, water_range, growth_time?
    food_provided: 0, // calculated (water, growth speed, growth time, fruit)
}

const plant_seed = (plant) => {
    plant = {...plant}; // don't erase the original
    
    // all regular numerical ones
    Object.keys(plant).forEach(key => {
        if (Number.isFinite(plant[key]))
        {
            plant[key] += small_random();
        }

    });

    // growth time
    plant.growth_time = random_growth_time(plant.growth_time);

    return compute_plant(plant);
}

const random_growth_time = (growth_time) => {
    growth_time = [...growth_time] // don't delete the original
    for (let index = 0; index < growth_time.length; index++) {
        growth_time[index] += small_random();
        if (growth_time[index] < GROWTH_TIME_MIN)
        {
            growth_time[index] = GROWTH_TIME_MIN;
        }
        if (growth_time[index] > GROWTH_TIME_MAX)
        {
            growth_time[index] = GROWTH_TIME_MAX;
        }        
    }
    return growth_time;
}

const grow_cycle = (month, plot) => {
    let {sun, water} = plot;
    let dirt = {...plot.dirt}
    let plant = {...plot.plant};
    let base = {...plot.plant_base}

    const sun_multiplier = range_quality(sun, base.sun, base.sun_range) / 100;
    const water_multiplier = range_quality(water, base.water, base.water_range) / 100;

    const growth_speed = sun_multiplier * water_multiplier * ((base.growth_time[month] * base.monthly_growth_multiplier) / 100)
    console.log(sun_multiplier, water_multiplier, growth_speed);

    dirt.nitrogen -= base.nitrogen * growth_speed;
    dirt.phosphorus -= base.phosphorus * growth_speed;
    dirt.potassium -= base.potassium * growth_speed;
    dirt.flouride -= base.flouride * growth_speed;
    dirt.lead -= base.lead * growth_speed;
    dirt.toxic -= base.toxic * growth_speed;
    
    plant.root_depth += base.root_depth * growth_speed; // look for overage
    plant.leaf_size += base.leaf_size * growth_speed;
    plant.fruit += base.fruit * growth_speed;

    plot.plant = {...plant}
    plot.dirt = {...dirt};
}

const range_quality = (provided, expected, expected_range) => {
    const difference = provided - expected;
    const over_under = Math.abs(difference) - expected_range 
    if (over_under < 0) // we're good
    {
        return 100;
    }
    // can call out if it is too much or to little sun here if wanted
    return over_under * 10 > 100 ? 0 : 100 - (over_under * 10)
}

const plot_factory = (plot_stats) => {
    plot = {
        sun: 0,
        water: 0,
        dirt: {},
        plant: {
            root_depth: 0,
            leaf_size: 0,
            fruit: 0
        }
    }

    return {...plot, ...plot_stats}
}

const examplant = plant_factory(daffo);
const ohio_plot = {
    sun: 30,
    water: 30,
    dirt: soil_factory(ohio_dirt),
    plant_base: plant_seed(examplant),
}

let plots = [];
plots.push(plot_factory(ohio_plot));

plots.forEach(plot => {
    console.log("dirt", plot.dirt);
    console.log("base", plot.plant_base);
    console.log("plant", plot.plant);
})

// for (let index = 0; index < 6; index++) {
//     plots.forEach(plot => {
//         grow_cycle(index, plot);
//     })
    
//     plots.forEach(plot => {
//         console.log(plot.dirt);
//         console.log(plot.plant_base);
//         console.log(plot.plant);
//     })
// }
