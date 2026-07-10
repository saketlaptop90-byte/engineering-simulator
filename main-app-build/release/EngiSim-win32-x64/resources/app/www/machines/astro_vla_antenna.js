import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];

    const glowingBlue = new THREE.MeshStandardMaterial({
        color: 0x00aaff,
        emissive: 0x00aaff,
        emissiveIntensity: 1.5,
        transparent: true,
        opacity: 0.8,
        metalness: 0.8,
        roughness: 0.2
    });

    const meshes = {};

    // Base
    const baseGeometry = new THREE.CylinderGeometry(5, 5.5, 2, 32);
    const base = new THREE.Mesh(baseGeometry, darkSteel);
    base.position.set(0, 1, 0);
    group.add(base);
    meshes.base = base;
    
    parts.push({
        name: "Concrete Foundation & Track",
        description: "The rail tracks and concrete foundation upon which the VLA antenna sits, providing stability and mobility for reconfiguration.",
        material: "darkSteel",
        function: "Supports the entire 230-ton weight of the antenna.",
        assemblyOrder: 1,
        connections: ["Pedestal"],
        failureEffect: "Antenna cannot be repositioned across the array tracks.",
        cascadeFailures: [],
        originalPosition: { x: 0, y: 1, z: 0 },
        explodedPosition: { x: 0, y: -5, z: 0 }
    });

    // Azimuth Structure (Pedestal)
    const azimuthGroup = new THREE.Group();
    azimuthGroup.position.set(0, 2, 0);
    group.add(azimuthGroup);
    meshes.azimuthGroup = azimuthGroup;

    const pedestalGeom = new THREE.CylinderGeometry(3.5, 4.5, 5, 32);
    const pedestal = new THREE.Mesh(pedestalGeom, steel);
    pedestal.position.set(0, 2.5, 0);
    azimuthGroup.add(pedestal);
    
    parts.push({
        name: "Azimuth Pedestal",
        description: "The rotating base that provides azimuth (horizontal) movement for the antenna.",
        material: "steel",
        function: "Enables 360-degree rotation along the horizon.",
        assemblyOrder: 2,
        connections: ["Foundation", "Yoke"],
        failureEffect: "Loss of horizontal tracking capability.",
        cascadeFailures: ["Target acquisition failure"],
        originalPosition: { x: 0, y: 4.5, z: 0 },
        explodedPosition: { x: 0, y: 4.5, z: 10 }
    });

    // Yoke Arms
    const yokeGeom = new THREE.BoxGeometry(2, 6, 8);
    const yoke = new THREE.Mesh(yokeGeom, aluminum);
    yoke.position.set(0, 8, 0);
    azimuthGroup.add(yoke);
    
    parts.push({
        name: "Yoke Support Arms",
        description: "Large structural arms holding the elevation axis.",
        material: "aluminum",
        function: "Supports the dish and provides pivot points for elevation control.",
        assemblyOrder: 3,
        connections: ["Pedestal", "Elevation Axis"],
        failureEffect: "Structural collapse of the dish.",
        cascadeFailures: ["Complete antenna destruction"],
        originalPosition: { x: 0, y: 10, z: 0 },
        explodedPosition: { x: 0, y: 10, z: -10 }
    });

    // Elevation Structure
    const elevationGroup = new THREE.Group();
    elevationGroup.position.set(0, 10, 0);
    azimuthGroup.add(elevationGroup);
    meshes.elevationGroup = elevationGroup;

    const axisGeom = new THREE.CylinderGeometry(1, 1, 9, 32);
    axisGeom.rotateX(Math.PI / 2);
    const axis = new THREE.Mesh(axisGeom, darkSteel);
    elevationGroup.add(axis);
    
    parts.push({
        name: "Elevation Gear & Axis",
        description: "The massive gears and shaft that tilt the dish vertically.",
        material: "darkSteel",
        function: "Controls the elevation (tilt) of the parabolic reflector.",
        assemblyOrder: 4,
        connections: ["Yoke", "Backup Structure"],
        failureEffect: "Antenna stuck at current elevation angle.",
        cascadeFailures: ["Inability to track celestial objects across the sky"],
        originalPosition: { x: 0, y: 12, z: 0 },
        explodedPosition: { x: -10, y: 12, z: 0 }
    });

    // Reflector / Dish
    const points = [];
    for (let i = 0; i <= 20; i++) {
        const x = (i / 20) * 12.5;
        const y = x * x / 25; 
        points.push(new THREE.Vector2(x, y));
    }
    const dishGeom = new THREE.LatheGeometry(points, 64);
    const dish = new THREE.Mesh(dishGeom, aluminum);
    dish.rotation.x = -Math.PI / 2;
    dish.position.set(0, 2, 0); 
    elevationGroup.add(dish);
    meshes.dish = dish;
    
    parts.push({
        name: "Primary Reflector (25m Dish)",
        description: "A 25-meter diameter parabolic dish consisting of aluminum panels.",
        material: "aluminum",
        function: "Collects and focuses incoming radio waves to the subreflector.",
        assemblyOrder: 5,
        connections: ["Backup Structure", "Quadripod"],
        failureEffect: "Severe loss of signal gathering capability.",
        cascadeFailures: ["Signal-to-noise ratio drops to unusable levels"],
        originalPosition: { x: 0, y: 14, z: 0 },
        explodedPosition: { x: 0, y: 30, z: 0 }
    });
    
    // Dish Backup Structure
    const backupGeom = new THREE.TorusGeometry(10, 0.5, 16, 32);
    const backup = new THREE.Mesh(backupGeom, steel);
    backup.rotation.x = Math.PI / 2;
    backup.position.set(0, 1.5, 0);
    elevationGroup.add(backup);
    
    parts.push({
        name: "Backup Structure",
        description: "The rigid truss framework behind the primary reflector panels.",
        material: "steel",
        function: "Maintains the perfect parabolic shape of the reflector under gravity and wind loads.",
        assemblyOrder: 6,
        connections: ["Elevation Axis", "Primary Reflector"],
        failureEffect: "Deformation of the primary dish.",
        cascadeFailures: ["Phase errors in incoming radio waves"],
        originalPosition: { x: 0, y: 13.5, z: 0 },
        explodedPosition: { x: 0, y: -10, z: 0 }
    });

    // Quadripod legs
    const quadripodGroup = new THREE.Group();
    quadripodGroup.position.set(0, 2, 0);
    elevationGroup.add(quadripodGroup);
    meshes.quadripod = quadripodGroup;

    for (let i = 0; i < 4; i++) {
        const legGeom = new THREE.CylinderGeometry(0.2, 0.2, 14);
        const leg = new THREE.Mesh(legGeom, darkSteel);
        
        const angle = (i * Math.PI) / 2;
        const radius = 10;
        
        const bx = Math.cos(angle) * radius;
        const bz = Math.sin(angle) * radius;
        
        const tx = 0;
        const ty = 12;
        const tz = 0;
        
        leg.position.set((bx + tx)/2, ty/2, (bz + tz)/2);
        leg.lookAt(tx, ty, tz);
        leg.rotateX(Math.PI/2);
        
        quadripodGroup.add(leg);
    }
    
    parts.push({
        name: "Quadripod Feed Supports",
        description: "Four struts extending from the dish surface to support the subreflector.",
        material: "darkSteel",
        function: "Holds the subreflector at the precise focal point of the primary dish.",
        assemblyOrder: 7,
        connections: ["Primary Reflector", "Subreflector"],
        failureEffect: "Subreflector misalignment.",
        cascadeFailures: ["Complete loss of signal focus"],
        originalPosition: { x: 0, y: 20, z: 0 },
        explodedPosition: { x: 15, y: 20, z: 15 }
    });

    // Subreflector
    const subGeom = new THREE.SphereGeometry(1.5, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2);
    const subreflector = new THREE.Mesh(subGeom, chrome);
    subreflector.rotation.x = Math.PI; 
    subreflector.position.set(0, 12, 0);
    quadripodGroup.add(subreflector);
    
    parts.push({
        name: "Cassegrain Subreflector",
        description: "A hyperbolic secondary reflector located at the focal point.",
        material: "chrome",
        function: "Reflects concentrated radio waves back down into the feed horns at the vertex.",
        assemblyOrder: 8,
        connections: ["Quadripod"],
        failureEffect: "Radio waves are not directed into the receivers.",
        cascadeFailures: ["Signal lost"],
        originalPosition: { x: 0, y: 26, z: 0 },
        explodedPosition: { x: 0, y: 40, z: 0 }
    });

    // Vertex Feed Ring / Receivers
    const feedGeom = new THREE.CylinderGeometry(1.5, 1.5, 1, 16);
    const feed = new THREE.Mesh(feedGeom, glowingBlue);
    feed.position.set(0, 2.5, 0);
    elevationGroup.add(feed);
    meshes.feed = feed;
    
    parts.push({
        name: "Receiver Feed Horns",
        description: "Cryogenically cooled radio receivers located at the dish vertex.",
        material: "glowingBlue",
        function: "Captures the radio waves and converts them into electrical signals.",
        assemblyOrder: 9,
        connections: ["Primary Reflector"],
        failureEffect: "No signal capture.",
        cascadeFailures: ["No data transmitted to correlator"],
        originalPosition: { x: 0, y: 14.5, z: 0 },
        explodedPosition: { x: 0, y: 20, z: 0 }
    });

    const description = "The Very Large Array (VLA) consists of 27 independent radio antennas, each having a dish diameter of 25 meters (82 feet) and weighing 230 tons. This high-tech simulation models the critical azimuth-elevation mount, the massive parabolic primary reflector, the Cassegrain subreflector, and the cryogenically cooled receiver feeds. These elements work together in an interferometric array to produce high-resolution radio images of the universe.";

    const quizQuestions = [
        {
            question: "What is the primary function of the Cassegrain Subreflector?",
            options: [
                "To cool down the receiver electronics",
                "To reflect concentrated radio waves back into the feed horns",
                "To rotate the antenna along the azimuth",
                "To transmit high-power radar signals"
            ],
            correct: 1,
            explanation: "In a Cassegrain antenna design, the subreflector sits at the focal point of the primary dish and reflects the gathered waves down into the receivers located at the vertex.",
            difficulty: "Medium"
        },
        {
            question: "Why is the Backup Structure essential for the Primary Reflector?",
            options: [
                "It stores backup electrical power.",
                "It houses the cryogenic pumps.",
                "It maintains the perfect parabolic shape of the reflector under wind and gravity loads.",
                "It protects the dish from lightning strikes."
            ],
            correct: 2,
            explanation: "The backup structure is a rigid truss that ensures the primary dish does not deform, which is critical for preventing phase errors in the focused radio waves.",
            difficulty: "Hard"
        },
        {
            question: "What range of motion does the Azimuth Pedestal provide?",
            options: [
                "Vertical tilting (Elevation)",
                "360-degree horizontal rotation",
                "Movement along the railway tracks",
                "Focus adjustments of the subreflector"
            ],
            correct: 1,
            explanation: "The Azimuth Pedestal allows the entire upper structure of the antenna to rotate horizontally along the horizon.",
            difficulty: "Easy"
        }
    ];

    function animate(time, speed, meshes) {
        if (meshes.azimuthGroup) {
            meshes.azimuthGroup.rotation.y = Math.sin(time * 0.1 * speed) * 0.5;
        }
        if (meshes.elevationGroup) {
            meshes.elevationGroup.rotation.x = -Math.PI/4 + Math.sin(time * 0.15 * speed) * Math.PI/8;
        }
        
        if (meshes.feed) {
            const intensity = 0.5 + 0.5 * Math.sin(time * 5 * speed);
            meshes.feed.material.emissiveIntensity = intensity * 2;
        }
    }

    return { group, parts, description, quizQuestions, animate, meshes };
}

// Auto-generated missing stub
export function createVLAAntenna() {
    const group = new THREE.Group();
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({color: 0xff0000}));
    group.add(mesh);
    return group;
}
