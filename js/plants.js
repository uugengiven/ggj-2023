const SMALL = 10;
const LARGE = 100;
const GROWTH_TIME_MIN = 0;
const GROWTH_TIME_MAX = 10;
let SEED_ID = 200;

const small_random = () => {
    return Math.floor((Math.random() * SMALL) - (SMALL / 2))
}

const large_random = () => {
    return Math.floor((Math.random() * LARGE) - (LARGE / 2))
}

const clamp = (number) => {
    if(number < 0)
    {
        return 0;
    }
    if(number > 100)
    {
        return 100;
    }
    return number;
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
        root_spread: 0,
        height: 0,
        spread: 0,
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

    if(index < 0)
    {
        index = shapes.length + index;
    }
    if(index > shapes.length)
    {
        index -= shapes.length;
    }

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
        flower_color,
    } = plant;
    plant.growth_speed = (leaf_size + nitrogen + potassium + phosphorus) / 2
    plant.heartiness = root_depth + water_range + growth_time + sun_range - leaf_size
    // plant.food_provided = (growth_time + plant.growth_speed + water) * (fruit / 100.0)  // this should be per month

    plant.monthly_growth_multiplier = 100 / growth_time.reduce((acc, num) => acc + num)
    
    plant.leaf_shape_name = leaf_shapes(plant.leaf_shape);
    plant.flower_shape_name = flower_shapes(plant.flower_shape);
    flower_color.css = `hsl(${flower_color.h}, ${flower_color.s}%, ${flower_color.l}%)`;

    return plant;
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

    // clamp ones that need to be clamped
    plant.leaf_size = clamp(plant.leaf_size);
    plant.fruit = clamp(plant.fruit);
    plant.root_depth = clamp(plant.root_depth);
    plant.root_spread = clamp(plant.root_spread);
    plant.height = clamp(plant.height);
    plant.spread = clamp(plant.spread);

    // growth time
    plant.growth_time = random_growth_time(plant.growth_time);
    plant.flower_color = random_color(plant.flower_color)

    plant.id = SEED_ID++;

    return compute_plant(plant);
}

const random_color = (color) => {
    color = {...color}
    color.h += large_random();
    if(color.h < 0)
    {
        color.h += 360;
    }
    if(color.h > 360)
    {
        color.h -= 360;
    }
    return color;
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

    let growth_multiplier = sun_multiplier * water_multiplier;

    let growth_speed = ((base.growth_time[month] * base.monthly_growth_multiplier) / 100)
    

    const test_results = test_soil_minerals(growth_speed, dirt, base);
    if(test_results.value < 0)
    {
        let multi = (test_results.change + test_results.value) / test_results.change;
        if(multi < growth_multiplier)
        {
            growth_multiplier = multi;
        }
    }

    growth_speed = growth_speed * growth_multiplier;

    dirt.nitrogen -= base.nitrogen * growth_speed;
    dirt.phosphorus -= base.phosphorus * growth_speed;
    dirt.potassium -= base.potassium * growth_speed;
    dirt.flouride -= base.flouride * growth_speed;
    dirt.lead -= base.lead * growth_speed;
    dirt.toxic -= base.toxic * growth_speed;
    
    plant.root_depth += base.root_depth * growth_speed; // look for overage
    plant.root_spread += base.root_spread * growth_speed;
    plant.leaf_size += base.leaf_size * growth_speed;
    plant.fruit += base.fruit * growth_speed;

    plot.plant = {...plant}
    plot.dirt = {...dirt};
}

const test_soil_minerals = (growth_speed, dirt, plant) =>
{
    let lowest = 100;
    let lowest_mineral = "";
    let change = 0;
    GROW_MINERALS.forEach(mineral => {
        let final_value = dirt[mineral] - plant[mineral] * growth_speed;
        console.log(final_value);
        if(final_value < lowest)
        {
            lowest = final_value;
            lowest_mineral = mineral
            change = plant[mineral] * growth_speed;
        }
    })
    let result = {mineral: lowest_mineral, value: lowest, change: change};
    console.log(result);
    return result;
}

const GROW_MINERALS = ["nitrogen", "phosphorus", "potassium"]
const REMOVE_MINERALS = ["flouride", "lead", "toxic"]
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

const plot_factory = (plot_stats, plant) => {
    plot = {
        sun: 0,
        water: 0,
        location: "earth",
        dirt: {},
        plant: {...plot_plant_empty},
        plant_base: {

        }
    }
    plot_stats.plant_base = plant;

    return {...plot, ...plot_stats}
}

const plant_new_seed = (plot, seed) => {
    plot.plant_base = plant_seed(seed);
    plot.plant = {...plot_plant_empty};
}

const clear_plants = (plot) => {
    plot.plant_base = plant_factory({});
    plot.plant = {...plot_plant_empty}
}

const splice_plants = (left, right, method) => {
    switch(method)
    {
        case "0":
            return root_splice(left, right);
        case "1":
            return swirl_splice(left, right);
    }
}

const root_splice = (left, right) => {
    let plant = plant_factory({});

    // all regular numerical ones
    let i = 0;
    let total = Object.keys(plant).length;
    Object.keys(plant).forEach(key => {
        if (Number.isFinite(plant[key]))
        {
            if(i / 2 === 0)
            {
                plant[key] += get_between(left[key], right[key]);
            }
            else
            {
                plant[key] += get_between(right[key], left[key]);
            }
        }
    });
    plant.leaf_shape = [
        get_between(left.leaf_shape[0], right.leaf_shape[0]),
        get_between(right.leaf_shape[1], left.leaf_shape[1])
    ],
    plant.flower_color = {
        h: get_between(left.flower_color.h, right.flower_color.h),
        s: get_between(left.flower_color.s, right.flower_color.s),
        l: get_between(left.flower_color.l, right.flower_color.l)
    }
    plant.growth_time = [
        get_between(left.growth_time[0], right.growth_time[0]),
        get_between(left.growth_time[1], right.growth_time[1]),
        get_between(left.growth_time[2], right.growth_time[2]),
        get_between(right.growth_time[3], left.growth_time[3]),
        get_between(right.growth_time[4], left.growth_time[4]),
        get_between(right.growth_time[5], left.growth_time[5])
    ]
    
    plant.id = SEED_ID++

    return compute_plant(plant_factory(plant));
}

const swirl_splice = (left, right) => {
    let plant = plant_factory({});

    // all regular numerical ones
    let i = 0;
    let total = Object.keys(plant).length;
    Object.keys(plant).forEach(key => {
        if (Number.isFinite(plant[key]))
        {
            if(i < total / 2)
            {
                plant[key] += get_between(left[key], right[key]);
            }
            else
            {
                plant[key] += get_between(right[key], left[key]);
            }
        }
    });
    plant.leaf_shape = [
        get_between(right.leaf_shape[0], left.leaf_shape[0]),
        get_between(right.leaf_shape[1], left.leaf_shape[1])
    ],
    plant.flower_color = {
        h: get_between(right.flower_color.h, left.flower_color.h),
        s: get_between(left.flower_color.s, right.flower_color.s),
        l: get_between(left.flower_color.l, right.flower_color.l)
    }
    plant.growth_time = [
        get_between(left.growth_time[0], right.growth_time[0]),
        get_between(right.growth_time[1], left.growth_time[1]),
        get_between(left.growth_time[2], right.growth_time[2]),
        get_between(right.growth_time[3], left.growth_time[3]),
        get_between(left.growth_time[4], right.growth_time[4]),
        get_between(right.growth_time[5], left.growth_time[5])
    ]
    
    plant.id = SEED_ID++

    return compute_plant(plant_factory(plant));
}

const get_between = (near, far) =>
{
    let diff = far - near;  // 10 - 70 (-60)
    diff = diff * 0.85; // (45)
    return Math.floor(near + diff);
}

const plot_plant_empty = {
    root_depth: 0,
    root_spread: 0,
    leaf_size: 0,
    fruit: 0    
}
