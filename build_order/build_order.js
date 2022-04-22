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
// invoke main function
main();
// Generate initial state and determine build order
function main() {
    var projects = ['a', 'b', 'c', 'd', 'e', 'f'];
    var dependencies = [];
    function getRandomProject() {
        return projects[Math.floor(Math.random() * projects.length)];
    }
    ;
    // Build random dependency array
    for (var i = 0; i < projects.length; i++) {
        dependencies.push([getRandomProject(), getRandomProject()]);
    }
    // Get build order
    var buildOrder = determineBuildOrder(projects, dependencies);
    // If build order exists, display, otherwise emit error
    if (buildOrder) {
        console.log(buildOrder);
        console.log(dependencies);
    }
    else {
        console.error(dependencies);
        throw Error("There is no build order that exists for the provided dependencies");
    }
}
// Determine whether or not there exists a build order that satisfies all dependencies 
function determineBuildOrder(projects, dependencies) {
    var dependencyTree = [];
    var built = [];
    dependencyTree = projects.map(function (project) {
        var deps = [];
        dependencies.forEach(function (dep) {
            if (dep[1] === project) {
                deps.push(dep[0]);
            }
        });
        return [project, deps];
    });
    for (var j = 0; j < 50; j++) {
        dependencyTree.forEach(function (node) {
            // Check to make sure dependency isn't already built
            if (!built.includes(node[0])) {
                // If the current dependency has no dependencies of its own, add it to the built array
                if (node[1].length === 0) {
                    built.push(node[0]);
                }
                else {
                    if (node[1].every(function (dep) { return built.includes(dep); })) {
                        built.push(node[0]);
                    }
                    else {
                        built.forEach(function (builtDep) {
                            if (node[1].includes(builtDep)) {
                                var index = node[1].findIndex(function (a) { return a === builtDep; });
                                node[1].splice(index, 1);
                            }
                        });
                    }
                }
            }
        });
    }
    return built.length === projects.length ? built : null;
}
