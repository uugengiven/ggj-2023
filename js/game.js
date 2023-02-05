let PLOT_ID = 0;

const END_OF_YEAR = "end_of_year";
const START_OF_YEAR = "start_of_year";
const GROWING = "growing";
const YOU_WIN = "win";

const game = {};
game.seed_list = [];

game.seed_list.push(plant_factory(daffo));
game.seed_list.push(plant_factory(potat));

const ohio_plot = {
    sun: 30,
    water: 30,
    location: "US Midwest",
    dirt: soil_factory(ohio_dirt),
    plant_base: {}
}

const find_seed_in_plot = (id) => {
    return plots.find(plot => plot.plant_base.id == id).plant_base;
}

const save_seed_to_inventory = (seed, name) => {
    seed = {...seed}
    seed.name = name;
    game.seed_list.push(seed);
}

const find_seed_in_inventory = (id) => {
    return game.seed_list.find(seed => seed.id == id);
}

const rename_seed = (id, name) => {
    let seed = find_seed_in_inventory(id);
    seed.name = name;
}

const remove_seed_from_inventory = (id) => {
    game.seed_list = game.seed_list.filter(seed => seed.id != id);
}

const add_plot = (plot) => {
    plot.id = PLOT_ID++;
    plots.push(plot);
}

const find_plot_by_id = (id) => {
    return plots.find(plot => plot.id == id);
}

const plant_plot = (plot_id, seed_id) => {
    const plot = find_plot_by_id(plot_id);
    const seed = find_seed_in_inventory(seed_id);
    plant_new_seed(plot, seed);
}

const get_plots = () => {
    return plots;
}

const clear_plots = () => {
    plots.forEach(plot => {
        clear_plants(plot);
    })
}

const splice_and_save = (left_id, right_id, method, name) => {
    let left = find_seed_in_inventory(left_id);
    let right = find_seed_in_inventory(right_id);
    let seed = splice_plants(left, right, method);
    save_seed_to_inventory(seed, name);
}

const get_total_food = () => {
    return plots.reduce((acc, plot) => acc += plot.plant.fruit, 0);
}

let plots = [];
add_plot(plot_factory(ohio_plot, plant_seed(game.seed_list[0])))
add_plot(plot_factory(ohio_plot, plant_seed(game.seed_list[1])))
add_plot(plot_factory(ohio_plot, plant_seed(game.seed_list[0])))
add_plot(plot_factory(ohio_plot, plant_seed(game.seed_list[1])))