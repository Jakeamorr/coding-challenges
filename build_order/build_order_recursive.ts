/*
    Build Order: 
            You are given a list of projects and a list of dependencies (which is a list of pairs of projects, where the second project is dependent on the first project). 
            All of a project's dependencies must be built before the project is. 
            Find a build order that will allow the projects to be built. 
            If there is no valid build order, return an error.

    Example:

        Input:
            projects: a, b, c, d, e, f
            dependencies: (a, d), (f, b), (b, d), (f, a), (d, c)

        Output: f, e, a, b, d, c

        build this
        a - f
        b - f
        c - d
        d - a, b
        e - 
        f - 

        built [e, f]

        loop through dep arr
            if dep is built, move to next
            if not build, recursively build deps


*/

// Create custom type def for dependency
type Dependency = [string, string];

// invoke main function
main();

// Generate initial state and determine build order
function main(): void {
    const projects: Array<string> = ['a', 'b', 'c', 'd', 'e', 'f'];
    const dependencies: Dependency[] = [['a', 'd'], ['f', 'b'], ['b', 'd'], ['f', 'a'], ['d', 'c']];
    // const dependencies: Dependency[] = [];

    // function getRandomProject(): string { 
    //     return projects[Math.floor(Math.random() * projects.length)] 
    // };

    // // Build random dependency array
    // for (let i = 0; i < projects.length; i++) {
    //     dependencies.push([getRandomProject(), getRandomProject()]);
    // }

    // Get build order
    const buildOrder: Array<string> = determineBuildOrder(projects, dependencies);
    console.log(buildOrder);
}


// Determine whether or not there exists a build order that satisfies all dependencies 
function determineBuildOrder(projects: Array<string>, dependencies: Dependency[]): Array<string> {
    let dependencyTree: [string, Array<string>][] = [];
    let built: Array<string> = [];

    dependencyTree = projects.map(project => {
        const deps = [];
        dependencies.forEach(dep => {
            if (dep[1] === project) {
                deps.push(dep[0]);
            }
        })
        return [project, deps];
    })

    dependencyTree.forEach(dep => {
        built = built.concat(buildDependency(dep, [], built, dependencyTree))
    });
    
    return built;
}


function buildDependency(dependencyTree: [string, string[]], path: string[], buildOrder: string[], fullTree: [string, string[]][]): string[] {
    // Destructure dependency tree
    const [project, dependencies] = dependencyTree;
    // need to check that new dependency is not already in the list of dependencies, if it is, than it's a circular reference
    if (path.includes(project)) {
        throw Error('Error: Circular Dependency');
    } else if (dependencies.length === 0 ) {
        if (!buildOrder.includes(project)) {
            // return [...buildOrder, project];
            return [project];
        }
    } else {
        dependencies.forEach((dep,i) => {
            const node: [string, string[]] = fullTree.find(n => n[0] === dep);
            buildOrder = buildOrder.concat(buildDependency([dep, node[1]], [...path, project], buildOrder, fullTree))
            buildDependency([dep, node[1]], [...path, project], buildOrder, fullTree);
        })
        // const node: [string, string[]] = fullTree.find(n => n[0] === dependencies[0]);
        // return buildDependency([node[0], node[1]], [...path, project], buildOrder, fullTree);
        // return buildOrder;
    }

    return [];
}