import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];
    const meshes = {};

    // Custom glowing/neon materials
    const neonGreen = new THREE.MeshStandardMaterial({ 
        color: 0x00ff00, emissive: 0x00ff00, emissiveIntensity: 0.8, transparent: true, opacity: 0.9 
    });
    const neonBlue = new THREE.MeshStandardMaterial({ 
        color: 0x0088ff, emissive: 0x0088ff, emissiveIntensity: 0.7, transparent: true, opacity: 0.85 
    });
    const neonOrange = new THREE.MeshStandardMaterial({
        color: 0xff8800, emissive: 0xffaa00, emissiveIntensity: 0.8
    });
    const earthMat = new THREE.MeshStandardMaterial({
        color: 0x1133aa, roughness: 0.6, metalness: 0.1
    });

    // 1. Earth Core/Sphere
    const earthGeometry = new THREE.SphereGeometry(5, 64, 64);
    const earthMesh = new THREE.Mesh(earthGeometry, earthMat);
    group.add(earthMesh);
    meshes.earth = earthMesh;
    parts.push({
        name: "Lithosphere & Hydrosphere",
        description: "The main body of the Earth storing vast amounts of carbon in the oceans, soil, and rocks.",
        material: "Earth Material",
        function: "Acts as the primary long-term carbon sink.",
        assemblyOrder: 1,
        connections: ["Atmosphere", "Biosphere"],
        failureEffect: "Ocean acidification and extreme climate disruption.",
        cascadeFailures: ["Biosphere Collapse"],
        originalPosition: {x: 0, y: 0, z: 0},
        explodedPosition: {x: 0, y: -5, z: 0}
    });

    // 2. Atmosphere Shell
    const atmosphereGeom = new THREE.SphereGeometry(5.5, 64, 64);
    const atmosphereMesh = new THREE.Mesh(atmosphereGeom, neonBlue);
    group.add(atmosphereMesh);
    meshes.atmosphere = atmosphereMesh;
    parts.push({
        name: "Atmosphere",
        description: "The gaseous envelope surrounding Earth, containing CO2 and other greenhouse gases.",
        material: "Neon Blue Plasma",
        function: "Regulates planetary temperature and acts as a rapid carbon exchange reservoir.",
        assemblyOrder: 2,
        connections: ["Lithosphere & Hydrosphere", "Biosphere"],
        failureEffect: "Runaway greenhouse effect.",
        cascadeFailures: ["Hydrosphere Overheating", "Biosphere Extinction"],
        originalPosition: {x: 0, y: 0, z: 0},
        explodedPosition: {x: 0, y: 5, z: 0}
    });

    // 3. Photosynthesis Flux (Green glowing torus rings or particles)
    const photoGeom = new THREE.TorusGeometry(6, 0.2, 16, 100);
    const photoMesh = new THREE.Mesh(photoGeom, neonGreen);
    photoMesh.rotation.x = Math.PI / 2;
    group.add(photoMesh);
    meshes.photosynthesis = photoMesh;
    parts.push({
        name: "Photosynthesis Flux",
        description: "The process by which plants and algae capture atmospheric CO2.",
        material: "Neon Green Energy",
        function: "Draws down carbon from the atmosphere into the biosphere.",
        assemblyOrder: 3,
        connections: ["Atmosphere", "Biosphere"],
        failureEffect: "Rapid CO2 accumulation in atmosphere.",
        cascadeFailures: ["Atmosphere Overload"],
        originalPosition: {x: 0, y: 0, z: 0},
        explodedPosition: {x: 5, y: 0, z: 5}
    });

    // 4. Respiration & Emissions Flux (Orange glowing torus rings)
    const emissionGeom = new THREE.TorusGeometry(6.5, 0.15, 16, 100);
    const emissionMesh = new THREE.Mesh(emissionGeom, neonOrange);
    emissionMesh.rotation.x = Math.PI / 3;
    group.add(emissionMesh);
    meshes.emissions = emissionMesh;
    parts.push({
        name: "Respiration & Emissions",
        description: "Release of carbon back into the atmosphere via natural respiration and anthropogenic emissions.",
        material: "Neon Orange Energy",
        function: "Returns carbon to the atmospheric reservoir.",
        assemblyOrder: 4,
        connections: ["Biosphere", "Atmosphere"],
        failureEffect: "Imbalance in carbon cycle leading to net atmospheric gain.",
        cascadeFailures: ["Atmosphere Overload"],
        originalPosition: {x: 0, y: 0, z: 0},
        explodedPosition: {x: -5, y: 0, z: -5}
    });

    // 5. Deep Ocean Sink (Dark Steel inner core or geometric representation)
    const oceanSinkGeom = new THREE.IcosahedronGeometry(4, 2);
    const oceanSinkMesh = new THREE.Mesh(oceanSinkGeom, darkSteel);
    group.add(oceanSinkMesh);
    meshes.oceanSink = oceanSinkMesh;
    parts.push({
        name: "Deep Ocean Carbon Sink",
        description: "Long-term storage of carbon dissolved in deep ocean waters.",
        material: "Dark Steel",
        function: "Slowly absorbs surplus carbon, mitigating rapid atmospheric changes.",
        assemblyOrder: 5,
        connections: ["Lithosphere & Hydrosphere"],
        failureEffect: "Saturation leading to inability to absorb further CO2.",
        cascadeFailures: ["Atmosphere Runaway"],
        originalPosition: {x: 0, y: 0, z: 0},
        explodedPosition: {x: 0, y: -8, z: 0}
    });

    const description = "The Carbon Cycle is the biogeochemical process by which carbon is exchanged among the biosphere, pedosphere, geosphere, hydrosphere, and atmosphere of the Earth. This highly stylized interactive simulation visualizes the major reservoirs and fluxes (photosynthesis, respiration, emissions, and oceanic absorption) that regulate our planet's climate.";

    const quizQuestions = [
        {
            question: "Which component acts as the primary long-term carbon sink?",
            options: ["Atmosphere", "Lithosphere & Hydrosphere", "Photosynthesis Flux", "Biosphere"],
            correct: 1,
            explanation: "The oceans and Earth's crust store the vast majority of the planet's carbon over long geological timescales.",
            difficulty: "Medium"
        },
        {
            question: "What does the Photosynthesis Flux represent in the cycle?",
            options: ["Release of CO2 from burning fossil fuels", "Ocean acidification", "The drawdown of atmospheric CO2 by plants and algae", "Geological outgassing"],
            correct: 2,
            explanation: "Photosynthesis is the key natural process that removes CO2 from the atmosphere and converts it into organic matter.",
            difficulty: "Easy"
        },
        {
            question: "If the Deep Ocean Carbon Sink reaches saturation, what is the most direct consequence?",
            options: ["Increased rate of photosynthesis", "Inability to absorb further CO2, leading to rapid atmospheric accumulation", "Decreased volcanic activity", "Global cooling"],
            correct: 1,
            explanation: "As the ocean absorbs more CO2, it becomes saturated and acidified, drastically reducing its capacity to buffer atmospheric carbon increases.",
            difficulty: "Hard"
        }
    ];

    function animate(time, speed, meshesObj = meshes) {
        // Slow rotation of the Earth
        if (meshesObj.earth) meshesObj.earth.rotation.y = time * 0.1 * speed;
        
        // Pulsing atmosphere
        if (meshesObj.atmosphere) {
            meshesObj.atmosphere.rotation.y = time * 0.15 * speed;
            const scaleBase = 1.0;
            const pulse = 0.02 * Math.sin(time * 2 * speed);
            meshesObj.atmosphere.scale.set(scaleBase + pulse, scaleBase + pulse, scaleBase + pulse);
        }

        // Flux rings animation
        if (meshesObj.photosynthesis) {
            meshesObj.photosynthesis.rotation.z = time * 0.5 * speed;
            meshesObj.photosynthesis.scale.x = 1 + 0.05 * Math.sin(time * 3 * speed);
            meshesObj.photosynthesis.scale.y = 1 + 0.05 * Math.sin(time * 3 * speed);
        }

        if (meshesObj.emissions) {
            meshesObj.emissions.rotation.z = -time * 0.4 * speed;
            meshesObj.emissions.scale.x = 1 + 0.08 * Math.cos(time * 4 * speed);
            meshesObj.emissions.scale.y = 1 + 0.08 * Math.cos(time * 4 * speed);
        }

        // Ocean sink inner rotation
        if (meshesObj.oceanSink) {
            meshesObj.oceanSink.rotation.x = time * 0.2 * speed;
            meshesObj.oceanSink.rotation.y = time * 0.3 * speed;
        }
    }

    return { group, parts, description, quizQuestions, animate };
}

// Auto-generated missing stub
export function createCarbonCycle() {
    const group = new THREE.Group();
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({color: 0xff0000}));
    group.add(mesh);
    return group;
}
