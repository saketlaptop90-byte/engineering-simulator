import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];

    const wetConcreteMat = new THREE.MeshPhysicalMaterial({ color: 0x777777, roughness: 1.0 });

    const truckBaseGeo = new THREE.BoxGeometry(8, 2, 4);
    const truckMesh = new THREE.Mesh(truckBaseGeo, darkSteel);
    truckMesh.position.set(0, 1, 0);
    group.add(truckMesh);
    parts.push({
        name: "Pump Truck Chassis & Outriggers",
        description: "Heavy truck with hydraulic stabilizing legs.",
        material: "Steel",
        function: "Provides a massively stable base so the towering boom arm doesn't tip the truck over.",
        assemblyOrder: 1,
        connections: ["Boom Turret", "Ground"],
        failureEffect: "Outrigger punch-through (soft soil).",
        cascadeFailures: ["Truck tips over completely"],
        originalPosition: {x:0, y:1, z:0},
        explodedPosition: {x:0, y:-4, z:0}
    });

    const turretGeo = new THREE.CylinderGeometry(1.5, 1.5, 2, 32);
    const turretMesh = new THREE.Mesh(turretGeo, chrome);
    turretMesh.position.set(2, 3, 0);
    group.add(turretMesh);
    parts.push({
        name: "Slewing Turret",
        description: "Rotating hydraulic base for the boom.",
        material: "Steel Alloy",
        function: "Allows the entire boom arm to rotate 360 degrees.",
        assemblyOrder: 2,
        connections: ["Chassis", "Boom Section 1"],
        failureEffect: "Slew ring gear strips.",
        cascadeFailures: ["Loss of rotational control"],
        originalPosition: {x:2, y:3, z:0},
        explodedPosition: {x:2, y:3, z:-6}
    });

    // Articulated Boom Sections
    const boomGrp = new THREE.Group();
    
    const boom1Geo = new THREE.BoxGeometry(8, 0.8, 0.8);
    const boom1 = new THREE.Mesh(boom1Geo, steel);
    boom1.position.set(4, 0, 0); // extend from origin
    const joint1 = new THREE.Group();
    joint1.position.set(2, 4, 0); // on top of turret
    joint1.rotation.z = Math.PI / 4; // angle up
    joint1.add(boom1);

    const boom2 = new THREE.Mesh(boom1Geo, steel);
    boom2.position.set(4, 0, 0);
    const joint2 = new THREE.Group();
    joint2.position.set(8, 0, 0); // end of boom 1
    joint2.rotation.z = -Math.PI / 2; // angle down
    joint2.add(boom2);
    joint1.add(joint2);

    const pipeGeo = new THREE.CylinderGeometry(0.2, 0.2, 8, 16);
    const pipe1 = new THREE.Mesh(pipeGeo, chrome);
    pipe1.rotation.z = Math.PI / 2;
    pipe1.position.set(4, 0.6, 0);
    joint1.add(pipe1);
    
    const pipe2 = new THREE.Mesh(pipeGeo, chrome);
    pipe2.rotation.z = Math.PI / 2;
    pipe2.position.set(4, 0.6, 0);
    joint2.add(pipe2);

    boomGrp.add(joint1);
    group.add(boomGrp);
    parts.push({
        name: "Articulated Boom Arm & Steel Piping",
        description: "Multi-jointed robotic arm carrying a 5-inch steel pipe.",
        material: "High-Tensile Steel",
        function: "Reaches high up and over obstacles (like building walls) to deliver concrete exactly where it's needed.",
        assemblyOrder: 3,
        connections: ["Turret", "Rubber Hose"],
        failureEffect: "Hydraulic cylinder blowout.",
        cascadeFailures: ["Boom collapses rapidly"],
        originalPosition: {x:0, y:0, z:0},
        explodedPosition: {x:0, y:8, z:0}
    });

    const hoseGeo = new THREE.CylinderGeometry(0.2, 0.2, 4, 16);
    const hoseMesh = new THREE.Mesh(hoseGeo, rubber);
    hoseMesh.position.set(8, -2, 0); // hanging off end of boom2
    joint2.add(hoseMesh);
    parts.push({
        name: "Flexible Rubber Discharge Hose",
        description: "Thick, reinforced rubber elephant trunk.",
        material: "Steel-Reinforced Rubber",
        function: "Allows workers to manually guide the heavy, high-pressure concrete flow precisely into forms.",
        assemblyOrder: 4,
        connections: ["Boom Pipe"],
        failureEffect: "Hose whip (air pocket).",
        cascadeFailures: ["Violent swinging knocks workers off walls"],
        originalPosition: {x:8, y:-2, z:0}, // relative
        explodedPosition: {x:8, y:-6, z:0}
    });

    const hopperGeo = new THREE.BoxGeometry(3, 2, 3);
    const hopperMesh = new THREE.Mesh(hopperGeo, darkSteel);
    hopperMesh.position.set(-3, 2, 0);
    group.add(hopperMesh);
    parts.push({
        name: "Receiving Hopper & Piston Pump",
        description: "Steel bucket with massive twin hydraulic pistons underneath.",
        material: "Hardened Steel",
        function: "Receives wet concrete from a mixer truck and uses massive hydraulic force to push the heavy rock/sand/cement mixture through 100 feet of pipe.",
        assemblyOrder: 5,
        connections: ["Chassis", "Boom Pipe"],
        failureEffect: "Rock jam in valve.",
        cascadeFailures: ["Pumping stops", "Concrete sets in pipe"],
        originalPosition: {x:-3, y:2, z:0},
        explodedPosition: {x:-8, y:2, z:0}
    });

    const description = "Civil Concrete Pump Boom: A spectacular fusion of heavy hydraulics and fluid dynamics. It uses massive twin pistons to force a heavy, abrasive mixture of rocks and cement through a 5-inch steel pipe attached to a towering robotic arm, allowing concrete to be placed hundreds of feet in the air or over houses.";

    const quizQuestions = [
        {
            question: "How does a concrete pump push a mixture full of heavy, sharp rocks (gravel) through a pipe without immediately jamming?",
            options: ["The mix must have enough cement paste and fine sand to perfectly lubricate the pipe walls, allowing the rocks to float through the center", "The rocks are crushed inside the pump first", "It uses extremely high air pressure", "The pipes are lined with teflon"],
            correct: 0,
            explanation: "Pumping concrete is extremely difficult. It relies entirely on a 'boundary layer' of slick cement paste forming against the steel pipe wall. The heavy aggregate (rocks) glides through the center on this lubricated layer.",
            difficulty: "Hard"
        },
        {
            question: "What powers the massive force required to push thousands of pounds of rock and cement vertically up a 150-foot boom?",
            options: ["Twin heavy-duty hydraulic cylinders driving solid steel pistons", "A giant fan", "A spinning Archimedes screw", "Gravity"],
            correct: 0,
            explanation: "Twin hydraulic cylinders operate in an alternating 'push-pull' cycle. While one pushes concrete into the pipe, the other sucks new concrete from the hopper. A swinging 'S-valve' switches between them instantly.",
            difficulty: "Medium"
        },
        {
            question: "What is 'Hose Whip' and why is it dangerous?",
            options: ["If an air pocket gets pumped through the pipe, its sudden explosive release at the rubber hose causes the hose to whip violently, easily killing a worker", "When the hose gets tied in a knot", "When the truck drives away too fast", "A technique to clean the hose"],
            correct: 0,
            explanation: "Air compresses, concrete does not. If the hopper runs empty and sucks air, the air compresses massively under the pump pressure. When that compressed bubble reaches the end of the hose, it expands instantly, causing a lethal whip-crack effect.",
            difficulty: "Hard"
        }
    ];

    function animate(time, speed, meshes) {
        // Articulate the boom gently
        if (group.children[2]) {
            const joint1 = group.children[2].children[0];
            const joint2 = joint1.children[1];
            
            joint1.rotation.z = Math.PI / 4 + Math.sin(time * speed * 0.5) * 0.1;
            joint2.rotation.z = -Math.PI / 2 + Math.cos(time * speed * 0.5) * 0.2;
        }
    }

    return { group, parts, description, quizQuestions, animate };
}

// Auto-generated missing stub
export function createConcretePumpingTruckBoom() {
    const group = new THREE.Group();
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({color: 0xff0000}));
    group.add(mesh);
    return group;
}
