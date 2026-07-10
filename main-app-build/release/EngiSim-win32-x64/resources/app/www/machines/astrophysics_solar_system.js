import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];

    // Custom glowing materials
    const sunGlow = new THREE.MeshPhongMaterial({ color: 0xffaa00, emissive: 0xff8800, emissiveIntensity: 1, transparent: true, opacity: 0.9 });
    const orbitGlow = new THREE.MeshBasicMaterial({ color: 0x00ffff, transparent: true, opacity: 0.15 });
    const neonBlue = new THREE.MeshPhongMaterial({ color: 0x0055ff, emissive: 0x0022ff, emissiveIntensity: 0.8 });
    
    // Geometry
    const sphereGeo = new THREE.SphereGeometry(1, 32, 32);

    function addPart(mesh, name, description, materialName, functionDesc, assemblyOrder, connections, failureEffect, cascadeFailures, originalPosition, explodedPosition) {
        mesh.userData.partName = name;
        mesh.position.set(originalPosition.x, originalPosition.y, originalPosition.z);
        group.add(mesh);
        parts.push({
            name, description, material: materialName, function: functionDesc,
            assemblyOrder, connections, failureEffect, cascadeFailures,
            originalPosition, explodedPosition, mesh
        });
        return mesh;
    }

    // 1. Base Stand
    const baseMesh = new THREE.Mesh(new THREE.CylinderGeometry(8, 9, 2, 64), darkSteel);
    addPart(baseMesh, "Brass Base Stand", "The primary structural foundation housing the intricate chronometer clockwork.", "darkSteel", "Supports the entire orrery and contains the central motor.", 1, ["Drive Axis Pillar"], "Orrery loses stability.", ["Complete structural collapse"], { x: 0, y: -5, z: 0 }, { x: 0, y: -10, z: 0 });

    // 2. Central Pillar
    const pillarMesh = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.8, 5, 32), chrome);
    addPart(pillarMesh, "Drive Axis Pillar", "A precision-machined central shaft transferring rotation from the base to the orbital gears.", "chrome", "Transfers rotational torque.", 2, ["Brass Base Stand", "Helios Emitter (Sun)"], "Planets cease to orbit.", ["Temporal desynchronization"], { x: 0, y: -1.5, z: 0 }, { x: 0, y: -15, z: 0 });

    // 3. Central Sun
    const sunMesh = new THREE.Mesh(sphereGeo, sunGlow);
    sunMesh.scale.set(2.5, 2.5, 2.5);
    addPart(sunMesh, "Helios Emitter (Sun)", "The luminous center of the orrery, representing the Sun.", "sunGlow", "Provides central illumination and acts as the gravitational anchor point.", 3, ["Drive Axis Pillar"], "Loss of system illumination.", [], { x: 0, y: 1, z: 0 }, { x: 0, y: 15, z: 0 });

    const meshes = {};

    function addPlanet(name, orbitRadius, colorMat, speed, size, desc, order) {
        const pivot = new THREE.Group();
        pivot.position.y = 1; // Same level as sun
        group.add(pivot);

        // Orbit Ring
        const ring = new THREE.Mesh(new THREE.TorusGeometry(orbitRadius, 0.03, 16, 128), orbitGlow);
        ring.rotation.x = Math.PI / 2;
        ring.position.y = 1;
        ring.userData.partName = `${name} Orbital Ring`;
        group.add(ring);
        
        parts.push({
            mesh: ring,
            name: `${name} Orbital Ring`,
            description: `The fixed ecliptic path of ${name}.`,
            material: "neonBlue",
            function: "Guides the planet's trajectory.",
            assemblyOrder: order,
            connections: ["Base Field"],
            failureEffect: "Orbital drift.",
            cascadeFailures: [],
            originalPosition: { x: 0, y: 1, z: 0 },
            explodedPosition: { x: 0, y: 1 - 5, z: 0 }
        });

        // Planet Mesh
        const planet = new THREE.Mesh(sphereGeo, colorMat);
        planet.scale.set(size, size, size);
        planet.position.x = orbitRadius;
        planet.userData.partName = `${name} Sphere`;
        pivot.add(planet);
        
        parts.push({
            mesh: planet,
            name: `${name} Sphere`,
            description: desc,
            material: "planetMaterial",
            function: "Represents the planetary body.",
            assemblyOrder: order + 1,
            connections: [`${name} Orbital Ring`],
            failureEffect: "Planet is lost to the void.",
            cascadeFailures: ["Gravitational imbalance"],
            originalPosition: { x: orbitRadius, y: 1, z: 0 }, 
            explodedPosition: { x: orbitRadius * 1.5, y: 5, z: orbitRadius * 1.5 }
        });

        // Connecting Arm
        const armLen = orbitRadius;
        const arm = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, armLen, 8), copper);
        arm.rotation.z = Math.PI / 2;
        arm.position.x = armLen / 2;
        arm.userData.partName = `${name} Support Arm`;
        pivot.add(arm);
        
        parts.push({
            mesh: arm,
            name: `${name} Support Arm`,
            description: `Physical connection for ${name}.`,
            material: "copper",
            function: "Holds planet.",
            assemblyOrder: order + 2,
            connections: [`${name} Sphere`, "Drive Axis Pillar"],
            failureEffect: "Arm snaps.",
            cascadeFailures: [],
            originalPosition: { x: armLen / 2, y: 1, z: 0 },
            explodedPosition: { x: armLen / 2, y: -2, z: orbitRadius }
        });

        meshes[name.toLowerCase()] = { pivot, planet, speed };
        return planet;
    }

    addPlanet("Mercury", 4, aluminum, 0.04, 0.3, "The innermost and smallest planet.", 4);
    addPlanet("Venus", 6, copper, 0.03, 0.6, "A hot, toxic world shrouded in thick clouds.", 7);
    addPlanet("Earth", 8, neonBlue, 0.02, 0.65, "The blue marble, home to known life.", 10);
    addPlanet("Mars", 10, new THREE.MeshPhongMaterial({color: 0xff3300}), 0.016, 0.4, "The red planet, covered in iron oxide.", 13);
    addPlanet("Jupiter", 14, new THREE.MeshPhongMaterial({color: 0xddaa77}), 0.008, 1.5, "The largest gas giant in the system.", 16);
    const saturn = addPlanet("Saturn", 18, new THREE.MeshPhongMaterial({color: 0xeedd88}), 0.006, 1.2, "A gas giant famous for its extensive ring system.", 19);
    addPlanet("Uranus", 22, new THREE.MeshPhongMaterial({color: 0x88ccff}), 0.004, 0.9, "An ice giant rotating on its side.", 22);
    addPlanet("Neptune", 26, new THREE.MeshPhongMaterial({color: 0x3344ff}), 0.003, 0.85, "The outermost known planet, deep blue and frigid.", 25);

    // Add Saturn's Rings explicitly
    const saturnRings = new THREE.Mesh(new THREE.TorusGeometry(1.8, 0.2, 8, 64), chrome);
    saturnRings.rotation.x = Math.PI / 2;
    saturnRings.userData.partName = "Saturn Rings";
    saturn.add(saturnRings);
    parts.push({
        mesh: saturnRings,
        name: "Saturn Rings",
        description: "The distinct ring system of Saturn composed of ice and rock.",
        material: "chrome",
        function: "Visual representation of Saturn's rings.",
        assemblyOrder: 20,
        connections: ["Saturn Sphere"],
        failureEffect: "Rings dissipate.",
        cascadeFailures: [],
        originalPosition: { x: 18, y: 1, z: 0 },
        explodedPosition: { x: 18, y: 8, z: 0 }
    });

    const description = "An ultra high-tech Astrophysics Solar System Orrery. It utilizes anti-gravity magnetic field projectors to simulate planetary orbits, illuminated by a glowing plasma sun core. Each planetary sphere is crafted with advanced metamaterials and driven by chronometer-grade gearwork embedded in the brass base.";

    const quizQuestions = [
        {
            question: "In this orrery model, what transfers the rotational torque from the base motor to the orbital arms?",
            options: ["The Orbital Rings", "The Drive Axis Pillar", "The Helios Emitter", "Saturn's Rings"],
            correct: 1,
            explanation: "The Drive Axis Pillar acts as the central mechanical shaft, directly transferring the rotational force from the Base Stand to the planetary gear trains.",
            difficulty: "Medium"
        },
        {
            question: "Which of the following planets in this system has an explicitly modeled physical ring attached to it?",
            options: ["Jupiter", "Saturn", "Uranus", "Neptune"],
            correct: 1,
            explanation: "Saturn is modeled with an additional Torus geometry representing its iconic ring system.",
            difficulty: "Easy"
        },
        {
            question: "If the Drive Axis Pillar were to experience a catastrophic mechanical failure, what cascade effect would occur?",
            options: ["The Sun would explode", "Planets would crash into each other", "Temporal desynchronization and planets cease to orbit", "The base would overheat"],
            correct: 2,
            explanation: "A failure of the central pillar severs the mechanical linkage, causing the planets to lose their orbital momentum and temporal synchronization.",
            difficulty: "Hard"
        }
    ];

    function animate(time, speed, meshesArray) {
        // Sun rotation
        sunMesh.rotation.y += 0.005 * speed;

        // Animate planets
        Object.keys(meshes).forEach(key => {
            const data = meshes[key];
            data.pivot.rotation.y -= data.speed * speed;
            data.planet.rotation.y += 0.02 * speed; // Spin on axis
        });
        
        baseMesh.rotation.y += 0.001 * speed;
    }

    return { group, parts, description, quizQuestions, animate };
}

// Auto-generated missing stub
export function createSolarSystem() {
    const group = new THREE.Group();
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({color: 0xff0000}));
    group.add(mesh);
    return group;
}
