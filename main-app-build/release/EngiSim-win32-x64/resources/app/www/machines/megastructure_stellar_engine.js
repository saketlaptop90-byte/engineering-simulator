import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];
    const meshes = {};

    const description = "Shkadov Thruster (Class A Stellar Engine) - An ultra high-tech, hyper-realistic megastructure designed to move an entire solar system. By capturing a main sequence star within a gigantic hemispherical mirror, the engine utilizes asymmetric solar radiation pressure to generate thrust. Equipped with immense gyroscopic stabilizers, magnetic confinement rings, plasma conduits, and thousands of cooling radiators.";

    // Custom Glowing Materials
    const customEmissive = new THREE.MeshStandardMaterial({
        color: 0x00ffff,
        emissive: 0x00ffff,
        emissiveIntensity: 6.0,
        transparent: true,
        opacity: 0.9,
    });

    const starMaterial = new THREE.MeshStandardMaterial({
        color: 0xffffff,
        emissive: 0xffaa00,
        emissiveIntensity: 8.0,
        wireframe: false
    });

    const coronaMaterial = new THREE.MeshStandardMaterial({
        color: 0xff5500,
        emissive: 0xff3300,
        emissiveIntensity: 3.0,
        transparent: true,
        opacity: 0.4,
        side: THREE.DoubleSide,
        blending: THREE.AdditiveBlending,
        depthWrite: false
    });

    const exhaustMat = new THREE.MeshStandardMaterial({
        color: 0x00aaff,
        emissive: 0x00aaff,
        emissiveIntensity: 2.0,
        transparent: true,
        opacity: 0.15,
        side: THREE.DoubleSide,
        blending: THREE.AdditiveBlending,
        depthWrite: false
    });

    // 1 & 2. Star Core & Corona
    const starCoreGeom = new THREE.SphereGeometry(50, 128, 128);
    const starCore = new THREE.Mesh(starCoreGeom, starMaterial);
    meshes.starCore = starCore;
    group.add(starCore);

    const coronaGeom = new THREE.SphereGeometry(55, 64, 64);
    const corona = new THREE.Mesh(coronaGeom, coronaMaterial);
    meshes.corona = corona;
    group.add(corona);

    // 3. Inner Reflective Hemisphere (Shkadov Mirror)
    // Rotated to sit beneath the star and reflect radiation upwards
    const innerReflectorGeom = new THREE.SphereGeometry(149, 128, 128, 0, Math.PI * 2, 0, Math.PI / 2);
    const innerReflector = new THREE.Mesh(innerReflectorGeom, chrome);
    innerReflector.material.side = THREE.BackSide;
    innerReflector.rotation.x = Math.PI; 
    meshes.innerReflector = innerReflector;
    group.add(innerReflector);

    // 4. Outer Armored Shell
    const outerShellGeom = new THREE.SphereGeometry(150, 128, 128, 0, Math.PI * 2, 0, Math.PI / 2);
    const outerShell = new THREE.Mesh(outerShellGeom, darkSteel);
    outerShell.rotation.x = Math.PI;
    meshes.outerShell = outerShell;
    group.add(outerShell);

    // 5. Equatorial Reinforcement Rim
    const rimGeom = new THREE.TorusGeometry(150, 6, 64, 256);
    const rimRing = new THREE.Mesh(rimGeom, steel);
    rimRing.rotation.x = Math.PI / 2;
    meshes.rimRing = rimRing;
    group.add(rimRing);

    // 6. Lattice Support Spines
    const spineGroup = new THREE.Group();
    const spineGeom = new THREE.TorusGeometry(150, 2, 32, 128, Math.PI);
    for(let i=0; i<16; i++) {
        const spine = new THREE.Mesh(spineGeom, darkSteel);
        spine.rotation.z = Math.PI; 
        spine.rotation.y = (i / 16) * Math.PI;
        spineGroup.add(spine);
    }
    meshes.spineGroup = spineGroup;
    group.add(spineGroup);

    // 7. Concentric Support Rings
    const ringsGroup = new THREE.Group();
    for(let i=1; i<=5; i++) {
        const angle = (i / 6) * (Math.PI / 2);
        const r = 150 * Math.sin(angle);
        const y = -150 * Math.cos(angle);
        const ringGeom = new THREE.TorusGeometry(r, 1.5, 32, 256);
        const ring = new THREE.Mesh(ringGeom, steel);
        ring.rotation.x = Math.PI / 2;
        ring.position.y = y;
        ringsGroup.add(ring);
    }
    meshes.ringsGroup = ringsGroup;
    group.add(ringsGroup);

    // 8 & 9. Central Command Hub and Dome
    const hubPoints = [];
    hubPoints.push(new THREE.Vector2(0, 0));
    hubPoints.push(new THREE.Vector2(25, 0));
    hubPoints.push(new THREE.Vector2(30, -10));
    hubPoints.push(new THREE.Vector2(20, -30));
    hubPoints.push(new THREE.Vector2(35, -35));
    hubPoints.push(new THREE.Vector2(35, -50));
    hubPoints.push(new THREE.Vector2(15, -70));
    hubPoints.push(new THREE.Vector2(0, -70));
    
    const hubGeom = new THREE.LatheGeometry(hubPoints, 128);
    const commandHub = new THREE.Mesh(hubGeom, darkSteel);
    commandHub.position.y = -155; 
    meshes.commandHub = commandHub;
    group.add(commandHub);

    const domeGeom = new THREE.SphereGeometry(14, 64, 64, 0, Math.PI*2, 0, Math.PI/2);
    const dome = new THREE.Mesh(domeGeom, tinted);
    dome.rotation.x = Math.PI;
    dome.position.y = -225;
    meshes.commandDome = dome;
    group.add(dome);

    // 10. Gyroscopic Stabilizer Wheels (Hyper-realistic Tires & Rims)
    const gyroGroup = new THREE.Group();
    const gyroRadius = 35;
    const gyros = [];
    
    function createGyroWheel(x, y, z, rotX, rotY, rotZ, radius) {
        const wheelGroup = new THREE.Group();
        
        // Tire using TorusGeometry
        const tireGeom = new THREE.TorusGeometry(radius, 6, 64, 256);
        const tire = new THREE.Mesh(tireGeom, rubber);
        wheelGroup.add(tire);
        
        // Hundreds of tiny extruded BoxGeometry lugs for aggressive tread
        const lugGeom = new THREE.BoxGeometry(4, 14, 5);
        for(let j=0; j<240; j++) {
            const a = (j / 240) * Math.PI * 2;
            const lug = new THREE.Mesh(lugGeom, rubber);
            lug.position.set(Math.cos(a) * radius, Math.sin(a) * radius, 0);
            lug.rotation.z = a;
            wheelGroup.add(lug);
        }
        
        // Rim utilizing CylinderGeometry with complex spoke arrays
        const hubGeom = new THREE.CylinderGeometry(10, 10, 12, 64);
        const hub = new THREE.Mesh(hubGeom, darkSteel);
        hub.rotation.x = Math.PI / 2;
        wheelGroup.add(hub);
        
        const spokeGeom = new THREE.CylinderGeometry(1.5, 1.5, radius, 32);
        for(let j=0; j<36; j++) {
            const a = (j / 36) * Math.PI * 2;
            const spoke = new THREE.Mesh(spokeGeom, steel);
            spoke.position.set(Math.cos(a) * (radius/2), Math.sin(a) * (radius/2), 0);
            spoke.rotation.z = a + Math.PI/2;
            wheelGroup.add(spoke);
        }
        
        // Massive Support Mount
        const mountGeom = new THREE.BoxGeometry(45, 8, 15);
        const mount = new THREE.Mesh(mountGeom, steel);
        mount.position.set(-25, 0, 0);
        wheelGroup.add(mount);
        
        wheelGroup.position.set(x, y, z);
        wheelGroup.rotation.set(rotX, rotY, rotZ);
        return wheelGroup;
    }

    for(let i=0; i<4; i++) {
        const angle = (i / 4) * Math.PI * 2;
        const x = Math.cos(angle) * 190;
        const z = Math.sin(angle) * 190;
        
        const wheel = createGyroWheel(x, 0, z, 0, -angle, 0, gyroRadius);
        gyroGroup.add(wheel);
        gyros.push(wheel);
    }
    meshes.gyroGroup = gyroGroup;
    meshes.gyros = gyros; 
    group.add(gyroGroup);

    // 11. Plasma Collector Arrays
    const collectorsGroup = new THREE.Group();
    const colGeomBase = new THREE.CylinderGeometry(5, 8, 40, 64);
    const colGeomInner = new THREE.CylinderGeometry(2.5, 2.5, 50, 32);
    
    for(let i=0; i<12; i++) {
        const angle = (i / 12) * Math.PI * 2;
        const x = Math.cos(angle) * 145;
        const z = Math.sin(angle) * 145;
        
        const collector = new THREE.Group();
        
        const base = new THREE.Mesh(colGeomBase, darkSteel);
        base.rotation.x = Math.PI / 2;
        collector.add(base);
        
        const inner = new THREE.Mesh(colGeomInner, copper);
        inner.rotation.x = Math.PI / 2;
        inner.position.z = -15; 
        collector.add(inner);
        
        const tipGeom = new THREE.SphereGeometry(4, 32, 32);
        const tip = new THREE.Mesh(tipGeom, customEmissive);
        tip.position.z = -40;
        collector.add(tip);
        
        collector.position.set(x, 0, z);
        collector.lookAt(0, 0, 0);
        collectorsGroup.add(collector);
    }
    meshes.collectors = collectorsGroup;
    group.add(collectorsGroup);

    // 12. Thermal Radiator Fins (Massive Array)
    const radiatorsGroup = new THREE.Group();
    const finGeom = new THREE.BoxGeometry(2, 30, 0.5);
    
    for(let i=1; i<=4; i++) {
        const latAngle = (i / 5) * (Math.PI / 2); 
        const r = 150 * Math.sin(latAngle);
        const y = -150 * Math.cos(latAngle);
        const numFins = Math.floor(r * 1.5); 
        
        for(let j=0; j<numFins; j++) {
            const lonAngle = (j / numFins) * Math.PI * 2;
            const x = r * Math.cos(lonAngle);
            const z = r * Math.sin(lonAngle);
            
            const fin = new THREE.Mesh(finGeom, aluminum);
            fin.position.set(x, y, z);
            
            const normal = new THREE.Vector3(x, y, z).normalize();
            const quaternion = new THREE.Quaternion();
            quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0), normal);
            fin.quaternion.copy(quaternion);
            fin.rotateY(lonAngle); 
            
            radiatorsGroup.add(fin);
        }
    }
    meshes.radiators = radiatorsGroup;
    group.add(radiatorsGroup);

    // 13. Hydraulic Alignment Actuators (Pistons)
    const pistonsGroup = new THREE.Group();
    const pistonOuterGeom = new THREE.CylinderGeometry(4, 4, 50, 32);
    const pistonInnerGeom = new THREE.CylinderGeometry(2.5, 2.5, 50, 32);
    meshes.pistonInners = [];
    
    for(let i=0; i<16; i++) {
        const angle = (i / 16) * Math.PI * 2;
        const hX = Math.cos(angle) * 25;
        const hZ = Math.sin(angle) * 25;
        const hY = -180;
        
        const sX = Math.cos(angle) * 100;
        const sZ = Math.sin(angle) * 100;
        const sY = -150 * Math.cos(Math.asin(100/150)); 
        
        const piston = new THREE.Group();
        
        const outer = new THREE.Mesh(pistonOuterGeom, darkSteel);
        outer.position.y = 25; 
        
        const inner = new THREE.Mesh(pistonInnerGeom, chrome);
        inner.position.y = 50; 
        meshes.pistonInners.push(inner);
        
        piston.add(outer);
        piston.add(inner);
        
        piston.position.set(hX, hY, hZ);
        const target = new THREE.Vector3(sX, sY, sZ);
        piston.lookAt(target);
        piston.rotateX(Math.PI / 2);
        
        pistonsGroup.add(piston);
    }
    meshes.pistons = pistonsGroup;
    group.add(pistonsGroup);

    // 14. Primary Energy Conduits
    const conduitsGroup = new THREE.Group();
    const helixPoints = [];
    for(let t=0; t<=1; t+=0.005) {
        const r = 26 + t * 8;
        const y = -155 - t * 65;
        const angle = t * Math.PI * 12; 
        helixPoints.push(new THREE.Vector3(Math.cos(angle)*r, y, Math.sin(angle)*r));
    }
    const helixCurve = new THREE.CatmullRomCurve3(helixPoints);
    const helixGeom = new THREE.TubeGeometry(helixCurve, 400, 2.5, 32, false);
    const helixConduit = new THREE.Mesh(helixGeom, copper);
    conduitsGroup.add(helixConduit);
    meshes.conduits = conduitsGroup;
    group.add(conduitsGroup);

    // 15. Observation Decks
    const decksGroup = new THREE.Group();
    const deckGeom = new THREE.CylinderGeometry(6, 6, 12, 32);
    const deckWindowGeom = new THREE.CylinderGeometry(6.2, 6.2, 5, 32);
    
    for(let i=0; i<8; i++) {
        const angle = (i / 8) * Math.PI * 2 + Math.PI/8;
        const x = Math.cos(angle) * 153;
        const z = Math.sin(angle) * 153;
        
        const deck = new THREE.Group();
        const body = new THREE.Mesh(deckGeom, plastic);
        deck.add(body);
        const window = new THREE.Mesh(deckWindowGeom, glass);
        deck.add(window);
        
        deck.position.set(x, 5, z);
        decksGroup.add(deck);
    }
    meshes.decks = decksGroup;
    group.add(decksGroup);

    // 16. Magnetic Thrust Vector Rings
    const magRingsGroup = new THREE.Group();
    const magRings = [];
    for(let i=0; i<6; i++) {
        const ringGeom = new THREE.TorusGeometry(130 - i*18, 4, 32, 128);
        const ring = new THREE.Mesh(ringGeom, customEmissive);
        ring.rotation.x = Math.PI / 2;
        ring.position.y = 80 + i*45; 
        magRingsGroup.add(ring);
        magRings.push(ring);
    }
    meshes.magRingsGroup = magRingsGroup;
    meshes.magRings = magRings;
    group.add(magRingsGroup);

    // 17. Plasma Exhaust Plume
    const exhaustGeom = new THREE.CylinderGeometry(110, 45, 500, 128, 1, true);
    const exhaust = new THREE.Mesh(exhaustGeom, exhaustMat);
    exhaust.position.y = 330; 
    meshes.exhaust = exhaust;
    group.add(exhaust);

    // 18. Maintenance Drone Swarm (InstancedMesh)
    const droneGeom = new THREE.BoxGeometry(3, 1.5, 4);
    const droneMat = new THREE.MeshStandardMaterial({ color: 0xcccccc, emissive: 0x00ff00, emissiveIntensity: 1.0 });
    const droneCount = 500;
    const droneMesh = new THREE.InstancedMesh(droneGeom, droneMat, droneCount);
    const droneData = [];
    const tempDummy = new THREE.Object3D();
    
    for(let i=0; i<droneCount; i++) {
        const angle = Math.random() * Math.PI * 2;
        const r = 170 + Math.random() * 60;
        const y = (Math.random() - 0.5) * 150;
        const speed = 0.0005 + Math.random() * 0.003;
        const offset = Math.random() * Math.PI * 2;
        
        droneData.push({ r, y, speed, offset });
        
        tempDummy.position.set(Math.cos(angle)*r, y, Math.sin(angle)*r);
        tempDummy.lookAt(0, y, 0); 
        tempDummy.updateMatrix();
        droneMesh.setMatrixAt(i, tempDummy.matrix);
    }
    meshes.droneMesh = droneMesh;
    meshes.droneData = droneData;
    group.add(droneMesh);


    // --- PARTS ARRAY ---
    parts.push({
        name: "Captured Main Sequence Star",
        description: "The immense nuclear fusion core generating the solar radiation pressure.",
        material: "Stellar Plasma",
        function: "Primary Energy & Thrust Source",
        assemblyOrder: 1,
        connections: ["Stellar Corona", "Magnetic Confinement Field"],
        failureEffect: "Loss of all propulsion, potential supernova event.",
        cascadeFailures: ["Vaporization of inner reflector", "Total megastructure collapse"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: 0, z: 0 }
    });

    parts.push({
        name: "Stellar Corona Field",
        description: "The outer superheated atmospheric layer of the captured star.",
        material: "Low-density Plasma",
        function: "Thermal Buffer",
        assemblyOrder: 2,
        connections: ["Main Sequence Star", "Plasma Collectors"],
        failureEffect: "Uncontrolled thermal spikes.",
        cascadeFailures: ["Melting of inner reflector shell"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: 150, z: 0 }
    });

    parts.push({
        name: "Inner Reflective Hemisphere",
        description: "A gigantic bowl-shaped mirror made of highly polished exotic metamaterials.",
        material: "Chrome / Metamaterial",
        function: "Radiation Reflection",
        assemblyOrder: 3,
        connections: ["Outer Armored Shell"],
        failureEffect: "Asymmetric thrust, orbital decay into the star.",
        cascadeFailures: ["Structural buckling", "Loss of system control"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: -200, z: 0 }
    });

    parts.push({
        name: "Outer Armored Shell",
        description: "Thick protective layers maintaining the structural integrity of the megastructure.",
        material: "Dark Steel / Carbon Nanotubes",
        function: "Structural Support",
        assemblyOrder: 4,
        connections: ["Inner Reflective Hemisphere", "Lattice Spines"],
        failureEffect: "Micro-meteoroid penetrations.",
        cascadeFailures: ["Internal decompression of command hubs", "Coolant leaks"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: -400, z: 0 }
    });

    parts.push({
        name: "Equatorial Reinforcement Rim",
        description: "A massive toroid locking the hemisphere's outer edge and preventing expansion.",
        material: "High-Tensile Steel",
        function: "Tensile Reinforcement",
        assemblyOrder: 5,
        connections: ["Outer Armored Shell", "Plasma Collectors", "Gyroscopic Stabilizers"],
        failureEffect: "Mirror splitting along longitudes.",
        cascadeFailures: ["Catastrophic shell rupture"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: 200, z: 0 }
    });

    parts.push({
        name: "Lattice Support Spines",
        description: "Meridian reinforcement tubes carrying massive stress loads from the pole to the rim.",
        material: "Dark Steel",
        function: "Load Distribution",
        assemblyOrder: 6,
        connections: ["Equatorial Rim", "Outer Shell"],
        failureEffect: "Localized stress fractures.",
        cascadeFailures: ["Shell warpage", "Thrust misalignment"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: -600, z: 0 }
    });

    parts.push({
        name: "Concentric Support Rings",
        description: "Latitudinal bands ensuring the hemisphere maintains its precise parabolic shape.",
        material: "High-Tensile Steel",
        function: "Shape Retention",
        assemblyOrder: 7,
        connections: ["Lattice Support Spines"],
        failureEffect: "Mirror distortion.",
        cascadeFailures: ["Unfocused reflection", "Thrust inefficiency"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: -700, z: 0 }
    });

    parts.push({
        name: "Central Command Nexus",
        description: "The sprawling central hub where trillions of telemetry points are processed.",
        material: "Dark Steel / Titanium",
        function: "Operations Control",
        assemblyOrder: 8,
        connections: ["Hydraulic Actuators", "Energy Conduits"],
        failureEffect: "Loss of automated stabilization.",
        cascadeFailures: ["Total engine desync", "Orbital drift"],
        originalPosition: { x: 0, y: -155, z: 0 },
        explodedPosition: { x: 0, y: -1000, z: 0 }
    });

    parts.push({
        name: "Command Observation Dome",
        description: "Heavily tinted transparent aluminum dome for direct optical monitoring.",
        material: "Tinted Glass",
        function: "Optical Observation",
        assemblyOrder: 9,
        connections: ["Central Command Nexus"],
        failureEffect: "Radiation blinding of optical sensors.",
        cascadeFailures: ["Sensor burnout"],
        originalPosition: { x: 0, y: -225, z: 0 },
        explodedPosition: { x: 0, y: -1200, z: 0 }
    });

    parts.push({
        name: "Gyroscopic Stabilizer Array",
        description: "Colossal reaction wheels with aggressive lug treads and complex cylinder spokes, spinning to maintain attitude.",
        material: "Rubber / Steel / Dark Steel",
        function: "Attitude Control & Stabilization",
        assemblyOrder: 10,
        connections: ["Equatorial Rim"],
        failureEffect: "Uncontrollable tumbling of the megastructure.",
        cascadeFailures: ["Star impact", "Total destruction"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 800, y: 0, z: 800 }
    });

    parts.push({
        name: "Coronal Plasma Collectors",
        description: "Towers extending towards the star to siphon high-energy plasma.",
        material: "Dark Steel / Copper",
        function: "Fuel & Power Harvesting",
        assemblyOrder: 11,
        connections: ["Equatorial Rim", "Energy Conduits"],
        failureEffect: "Power starvation to command hubs.",
        cascadeFailures: ["Shutdown of gyroscopes", "Loss of confinement"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 500, y: 200, z: 500 }
    });

    parts.push({
        name: "Thermal Radiator Array",
        description: "Thousands of massive aluminum fins radiating absorbed stellar heat into deep space.",
        material: "Aluminum",
        function: "Heat Dissipation",
        assemblyOrder: 12,
        connections: ["Outer Armored Shell"],
        failureEffect: "Overheating.",
        cascadeFailures: ["Structural melting", "Crew vaporization"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: -600, y: -500, z: -600 }
    });

    parts.push({
        name: "Hydraulic Alignment Actuators",
        description: "Massive pistons capable of micro-adjusting the shell's geometry.",
        material: "Dark Steel / Chrome",
        function: "Thrust Vectoring Micro-adjustments",
        assemblyOrder: 13,
        connections: ["Command Nexus", "Outer Shell"],
        failureEffect: "Inability to focus the exhaust beam.",
        cascadeFailures: ["Off-axis thrust", "Course deviation"],
        originalPosition: { x: 0, y: -180, z: 0 },
        explodedPosition: { x: 0, y: -800, z: 0 }
    });

    parts.push({
        name: "Primary Energy Conduits",
        description: "Massive coiled copper-alloy tubes transferring harvested plasma to the nexus.",
        material: "Copper",
        function: "Energy Transfer",
        assemblyOrder: 14,
        connections: ["Plasma Collectors", "Command Nexus"],
        failureEffect: "Plasma leakage.",
        cascadeFailures: ["Localized melting", "Power grid failure"],
        originalPosition: { x: 0, y: -155, z: 0 },
        explodedPosition: { x: 0, y: -1500, z: 0 }
    });

    parts.push({
        name: "Observation Decks",
        description: "Pressurized habitats arrayed along the rim for maintenance crews.",
        material: "Plastic / Glass",
        function: "Crew Habitation",
        assemblyOrder: 15,
        connections: ["Equatorial Rim"],
        failureEffect: "Decompression.",
        cascadeFailures: ["Loss of life", "Reduction in manual repair efficiency"],
        originalPosition: { x: 0, y: 5, z: 0 },
        explodedPosition: { x: 400, y: 50, z: 400 }
    });

    parts.push({
        name: "Magnetic Thrust Vector Rings",
        description: "Massive glowing electromagnetic rings that focus the reflected stellar radiation into a column.",
        material: "Emissive Metamaterial",
        function: "Exhaust Collimation",
        assemblyOrder: 16,
        connections: ["Magnetic Fields"],
        failureEffect: "Radiation diffusion.",
        cascadeFailures: ["Drastic loss of thrust efficiency"],
        originalPosition: { x: 0, y: 150, z: 0 },
        explodedPosition: { x: 0, y: 1500, z: 0 }
    });

    parts.push({
        name: "Plasma Exhaust Plume",
        description: "The collimated output of the star's radiation, creating the immense thrust pushing the solar system.",
        material: "Energized Photons/Plasma",
        function: "Propulsion",
        assemblyOrder: 17,
        connections: ["Thrust Vector Rings"],
        failureEffect: "N/A",
        cascadeFailures: ["N/A"],
        originalPosition: { x: 0, y: 330, z: 0 },
        explodedPosition: { x: 0, y: 2500, z: 0 }
    });

    parts.push({
        name: "Maintenance Drone Swarm",
        description: "Thousands of autonomous robotic units continuously repairing micrometeoroid damage on the shell.",
        material: "Alloy / Logic Boards",
        function: "Automated Maintenance",
        assemblyOrder: 18,
        connections: ["Outer Armored Shell", "Observation Decks"],
        failureEffect: "Gradual degradation of mirror polish.",
        cascadeFailures: ["Decreased reflectivity", "Increased heat absorption", "Eventual melting"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: -800, y: 800, z: -800 }
    });


    // --- QUIZ QUESTIONS ---
    const quizQuestions = [
        {
            question: "What is the primary function of a Shkadov Thruster (Class A Stellar Engine)?",
            options: [
                "To generate thrust and move an entire solar system by utilizing the star's radiation pressure.",
                "To extract heavy metals from a dying star's core.",
                "To teleport planets across vast interstellar distances.",
                "To completely enclose a star and harvest 100% of its energy output."
            ],
            correctAnswer: 0,
            explanation: "A Shkadov Thruster reflects a portion of the star's radiation asymmetrically, creating a net thrust that slowly moves the star and its gravitationally bound planets over millions of years."
        },
        {
            question: "Why does the structure utilize massive gyroscopic wheels?",
            options: [
                "To generate artificial gravity for the crew habitats.",
                "To dynamically counteract asymmetric radiation flares and stabilize the mirror's orientation.",
                "To physically drive the structure forward through the vacuum of space.",
                "To spool up the immense magnetic fields required for plasma collection."
            ],
            correctAnswer: 1,
            explanation: "Because stellar output is chaotic (flares, CMEs), the massive spinning gyroscopes provide the attitude control necessary to keep the hemisphere perfectly aligned without using chemical propellants."
        },
        {
            question: "What role do the extensive thermal radiator arrays play in the megastructure?",
            options: [
                "They act as solar sails to provide additional thrust.",
                "They emit communication signals to distant galaxies.",
                "They dissipate the immense heat absorbed from the star's proximity, preventing the reflector from melting.",
                "They freeze the surrounding vacuum to reduce drag."
            ],
            correctAnswer: 2,
            explanation: "No mirror is 100% reflective. The small percentage of stellar energy absorbed by a structure this close to a star would melt it if not for massive radiator fin arrays dissipating heat into deep space."
        },
        {
            question: "How is the exact thrust vector controlled and focused?",
            options: [
                "By articulating the massive magnetic confinement rings and adjusting the hydraulic alignment pistons on the main shell.",
                "By opening huge vents in the back of the mirror.",
                "By dropping massive counterweights into the star.",
                "By firing conventional chemical rockets mounted on the rim."
            ],
            correctAnswer: 0,
            explanation: "The hydraulic pistons can subtly change the shape and angle of the mirror, while the glowing magnetic rings collimate the escaping plasma and photons into a focused thrust beam."
        },
        {
            question: "What prevents the massive Shkadov mirror from simply falling into the star due to intense gravity?",
            options: [
                "It is tethered to nearby planets.",
                "The inward gravitational pull is perfectly balanced by the outward push of immense solar radiation pressure.",
                "It constantly fires anti-gravity thrusters.",
                "It is in a standard high-velocity orbit around the star."
            ],
            correctAnswer: 1,
            explanation: "The stellar engine operates as a statite (static satellite). It balances the immense inward pull of stellar gravity exactly against the outward push of the star's own light and solar wind."
        }
    ];

    // --- ANIMATION LOGIC ---
    function animate(time, speed, renderMeshes) {
        const t = time * speed;
        
        // Star & Corona pulsating
        const pulse = 1.0 + Math.sin(t * 2) * 0.015;
        if(renderMeshes.starCore) renderMeshes.starCore.scale.set(pulse, pulse, pulse);
        
        const coronaPulse = 1.0 + Math.cos(t * 1.5) * 0.03;
        if(renderMeshes.corona) {
            renderMeshes.corona.scale.set(coronaPulse, coronaPulse, coronaPulse);
            renderMeshes.corona.rotation.y = t * 0.15;
            renderMeshes.corona.rotation.z = Math.sin(t * 0.5) * 0.1;
        }

        // Gyroscopic Wheels rotation (Counter-rotating for stability)
        if(renderMeshes.gyros) {
            renderMeshes.gyros.forEach((gyro, i) => {
                gyro.rotation.z += 0.08 * speed * (i % 2 === 0 ? 1 : -1);
                gyro.rotation.x += 0.02 * speed;
            });
        }
        
        // Magnetic Thrust Rings pulsating and aligning
        if(renderMeshes.magRings) {
            renderMeshes.magRings.forEach((ring, i) => {
                const ringPulse = 1.0 + Math.sin(t * 6 + i * 1.5) * 0.03;
                ring.scale.set(ringPulse, ringPulse, ringPulse);
                ring.rotation.z = Math.sin(t * 1.5 + i) * 0.05;
                ring.rotation.y = Math.cos(t * 2.0 + i) * 0.05;
            });
        }
        
        // Hydraulic Pistons actuating slightly
        if(renderMeshes.pistonInners) {
            renderMeshes.pistonInners.forEach((inner, i) => {
                const extension = 50 + Math.sin(t * 2.5 + i) * 8;
                inner.position.y = extension;
            });
        }
        
        // Exhaust Plume flickering
        if(renderMeshes.exhaust) {
            renderMeshes.exhaust.material.opacity = 0.1 + Math.random() * 0.1;
            renderMeshes.exhaust.scale.x = 1.0 + Math.sin(t * 12) * 0.04;
            renderMeshes.exhaust.scale.z = 1.0 + Math.sin(t * 12) * 0.04;
        }
        
        // Maintenance Drone Swarm orbiting
        if(renderMeshes.droneMesh && renderMeshes.droneData) {
            if(!renderMeshes.dummyObj) renderMeshes.dummyObj = new THREE.Object3D();
            const dummy = renderMeshes.dummyObj;
            
            renderMeshes.droneData.forEach((data, i) => {
                const currentAngle = t * data.speed * 150 + data.offset;
                dummy.position.set(
                    Math.cos(currentAngle) * data.r,
                    data.y + Math.sin(t * 3 + i) * 10,
                    Math.sin(currentAngle) * data.r
                );
                dummy.lookAt(0, dummy.position.y, 0);
                dummy.updateMatrix();
                renderMeshes.droneMesh.setMatrixAt(i, dummy.matrix);
            });
            renderMeshes.droneMesh.instanceMatrix.needsUpdate = true;
        }
    }

    return { group, parts, description, quizQuestions, animate };
}
