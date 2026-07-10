import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];
    
    // Custom Materials
    const neonBlue = new THREE.MeshStandardMaterial({
        color: 0x00ffff,
        emissive: 0x00ffff,
        emissiveIntensity: 0.8,
        transparent: true,
        opacity: 0.6,
        side: THREE.DoubleSide
    });
    
    const neonRed = new THREE.MeshStandardMaterial({
        color: 0xff0000,
        emissive: 0xff0000,
        emissiveIntensity: 0.9
    });

    const neonGreen = new THREE.MeshStandardMaterial({
        color: 0x00ff00,
        emissive: 0x00ff00,
        emissiveIntensity: 0.9
    });

    // 1. Base Mount
    const mountGeom = new THREE.BoxGeometry(2, 0.5, 2);
    const mountMesh = new THREE.Mesh(mountGeom, steel);
    mountMesh.position.set(0, 0, 0);
    group.add(mountMesh);
    parts.push({
        name: "Mounting Base",
        description: "Secures the radar assembly to the aircraft bulkhead. Provides structural rigidity.",
        material: "Steel",
        function: "Structural support and vibration damping.",
        assemblyOrder: 1,
        connections: ["Aircraft Bulkhead", "Azimuth Drive"],
        failureEffect: "Severe vibration, loss of alignment, structural failure.",
        cascadeFailures: ["Azimuth Drive", "Elevation Drive"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: -2, z: 0 },
        mesh: mountMesh
    });

    // 2. Azimuth Drive Motor
    const azDriveGeom = new THREE.CylinderGeometry(0.8, 0.8, 1, 32);
    const azDriveMesh = new THREE.Mesh(azDriveGeom, darkSteel);
    azDriveMesh.position.set(0, 0.75, 0);
    group.add(azDriveMesh);
    parts.push({
        name: "Azimuth Drive Assembly",
        description: "Controls the horizontal (left/right) scanning motion of the antenna.",
        material: "Dark Steel",
        function: "Horizontal scanning",
        assemblyOrder: 2,
        connections: ["Mounting Base", "Elevation Drive"],
        failureEffect: "Antenna stuck in one horizontal position.",
        cascadeFailures: ["Radar display image loss in specific sectors"],
        originalPosition: { x: 0, y: 0.75, z: 0 },
        explodedPosition: { x: 0, y: -0.5, z: 0 },
        mesh: azDriveMesh
    });

    // 3. Elevation Drive Motor & Yoke
    const yokeGroup = new THREE.Group();
    yokeGroup.position.set(0, 1.25, 0);
    group.add(yokeGroup);
    
    const yokeGeom = new THREE.BoxGeometry(1.6, 1.2, 0.4);
    const yokeMesh = new THREE.Mesh(yokeGeom, aluminum);
    yokeGroup.add(yokeMesh);
    parts.push({
        name: "Elevation Drive & Yoke",
        description: "Controls the vertical tilt of the antenna to adjust for aircraft pitch and roll.",
        material: "Aluminum",
        function: "Vertical stabilization and tilt control",
        assemblyOrder: 3,
        connections: ["Azimuth Drive", "Antenna Array"],
        failureEffect: "Antenna cannot tilt, leading to ground clutter or over-scanning weather targets during maneuvers.",
        cascadeFailures: ["Inaccurate weather depiction"],
        originalPosition: { x: 0, y: 1.25, z: 0 },
        explodedPosition: { x: 0, y: 1.25, z: -2 },
        mesh: yokeMesh,
        parentGroup: yokeGroup
    });

    // 4. Waveguide Feed
    const feedGeom = new THREE.CylinderGeometry(0.1, 0.1, 1.5, 16);
    const feedMesh = new THREE.Mesh(feedGeom, copper);
    feedMesh.rotation.x = Math.PI / 2;
    feedMesh.position.set(0, 0, 0.75);
    yokeGroup.add(feedMesh);
    parts.push({
        name: "Waveguide Feed",
        description: "Transmits high-frequency RF energy from the transceiver to the antenna array.",
        material: "Copper",
        function: "RF transmission channel",
        assemblyOrder: 4,
        connections: ["Transceiver", "Antenna Array"],
        failureEffect: "Loss of RF transmission, rendering radar blind.",
        cascadeFailures: ["Transceiver overheating due to reflected energy (VSWR)"],
        originalPosition: { x: 0, y: 0, z: 0.75 },
        explodedPosition: { x: 0, y: 0, z: 2.5 },
        mesh: feedMesh
    });

    // 5. Flat Plate Antenna Array
    const arrayGeom = new THREE.CylinderGeometry(2, 2, 0.1, 64);
    const arrayMesh = new THREE.Mesh(arrayGeom, aluminum);
    arrayMesh.rotation.x = Math.PI / 2;
    arrayMesh.position.set(0, 0, 1.55);
    yokeGroup.add(arrayMesh);
    
    const gridTexture = new THREE.TextureLoader().load('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAIAAAACAQMAAABIeJ9nAAAABlBMVEUAAAAAAAClZ7nPAAAAAnRSTlMAG/7+OQAAAA1JREFUCNdjYGBgYAAAAAQAAVVlCawAAAAASUVORK5CYII=');
    gridTexture.wrapS = THREE.RepeatWrapping;
    gridTexture.wrapT = THREE.RepeatWrapping;
    gridTexture.repeat.set(20, 20);
    const gridMaterial = new THREE.MeshStandardMaterial({ map: gridTexture, color: 0x888888, metalness: 0.8, roughness: 0.2 });
    arrayMesh.material = gridMaterial;

    parts.push({
        name: "Flat Plate Array",
        description: "Phased or slotted array that forms the radar beam.",
        material: "Aluminum",
        function: "Beamforming and radiation",
        assemblyOrder: 5,
        connections: ["Waveguide Feed"],
        failureEffect: "Distorted beam pattern or complete loss of radar returns.",
        cascadeFailures: [],
        originalPosition: { x: 0, y: 0, z: 1.55 },
        explodedPosition: { x: 0, y: 0, z: 4 },
        mesh: arrayMesh
    });

    // 6. Active Scanner Beam
    const beamGeom = new THREE.ConeGeometry(3, 8, 32, 1, true, 0, Math.PI / 4);
    const beamMesh = new THREE.Mesh(beamGeom, neonBlue);
    beamMesh.rotation.x = -Math.PI / 2;
    beamMesh.position.set(0, 0, 5.55);
    yokeGroup.add(beamMesh);
    parts.push({
        name: "RF Emission Envelope",
        description: "Representation of the scanning radar beam.",
        material: "Energy/Plasma",
        function: "Target detection",
        assemblyOrder: 6,
        connections: ["Antenna Array"],
        failureEffect: "N/A",
        cascadeFailures: [],
        originalPosition: { x: 0, y: 0, z: 5.55 },
        explodedPosition: { x: 0, y: 0, z: 8 },
        mesh: beamMesh
    });

    // 7. Status Indicators
    const ledGeom = new THREE.SphereGeometry(0.1, 16, 16);
    const pwrLedMesh = new THREE.Mesh(ledGeom, neonGreen);
    pwrLedMesh.position.set(0.8, 0, 0.2);
    yokeGroup.add(pwrLedMesh);
    
    const txLedMesh = new THREE.Mesh(ledGeom, neonRed);
    txLedMesh.position.set(-0.8, 0, 0.2);
    yokeGroup.add(txLedMesh);


    const quizQuestions = [
        {
            question: "What is the primary function of the Elevation Drive in a weather radar antenna?",
            options: [
                "To scan left and right across the horizon.",
                "To stabilize the antenna against aircraft pitch and roll.",
                "To generate high-frequency RF energy.",
                "To cool the transceiver unit."
            ],
            correct: 1,
            explanation: "The Elevation Drive adjusts the vertical tilt of the antenna to maintain a level scan relative to the horizon, compensating for aircraft pitch and roll.",
            difficulty: "Medium"
        },
        {
            question: "What material is typically used for the Waveguide Feed due to its excellent electrical conductivity?",
            options: [
                "Plastic",
                "Rubber",
                "Copper",
                "Glass"
            ],
            correct: 2,
            explanation: "Copper (and sometimes silver-plated metals) is used for waveguides because of its low electrical resistance, which minimizes signal loss during transmission.",
            difficulty: "Easy"
        },
        {
            question: "A failure in the Waveguide Feed can lead to a cascade failure in which component?",
            options: [
                "Mounting Base",
                "Azimuth Drive",
                "Transceiver",
                "Elevation Drive"
            ],
            correct: 2,
            explanation: "A damaged waveguide can reflect RF energy back into the transmitter (high VSWR), potentially causing the Transceiver to overheat and fail.",
            difficulty: "Hard"
        }
    ];

    const description = "The Avionics Weather Radar Antenna is a critical sensor for modern aircraft. It mechanically or electronically scans the airspace ahead to detect precipitation, turbulence, and terrain. This model features a mechanical flat-plate array with azimuth and elevation drives for full stabilization and scanning capabilities.";

    let scanAngle = 0;
    let tiltAngle = 0;

    function animate(time, speed, meshes) {
        const yokePart = parts.find(p => p.name === "Elevation Drive & Yoke");
        if (yokePart && yokePart.parentGroup) {
            const yoke = yokePart.parentGroup;
            
            // Azimuth scan: -60 to +60 degrees
            scanAngle = Math.sin(time * speed * 2) * (Math.PI / 3);
            yoke.rotation.y = scanAngle;
            
            // Elevation tilt: gentle oscillation
            tiltAngle = Math.sin(time * speed * 0.5) * (Math.PI / 18);
            
            const arrayPart = parts.find(p => p.name === "Flat Plate Array");
            const feedPart = parts.find(p => p.name === "Waveguide Feed");
            const beamPart = parts.find(p => p.name === "RF Emission Envelope");
            
            if (arrayPart && arrayPart.mesh) arrayPart.mesh.rotation.x = Math.PI / 2 + tiltAngle;
            if (feedPart && feedPart.mesh) feedPart.mesh.rotation.x = Math.PI / 2 + tiltAngle;
            if (beamPart && beamPart.mesh) {
                beamPart.mesh.rotation.x = -Math.PI / 2 + tiltAngle;
                beamPart.mesh.material.opacity = 0.4 + 0.3 * Math.sin(time * speed * 10);
            }
            
            // Blink the TX LED
            txLedMesh.material.emissiveIntensity = Math.random() > 0.5 ? 1.0 : 0.2;
        }
        
        const azDrivePart = parts.find(p => p.name === "Azimuth Drive Assembly");
        if(azDrivePart && azDrivePart.mesh) {
             azDrivePart.mesh.rotation.y = scanAngle;
        }
    }

    return {
        group,
        parts,
        description,
        quizQuestions,
        animate
    };
}

// Auto-generated missing stub
export function createAvionicsRadarAntenna() {
    const group = new THREE.Group();
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({color: 0xff0000}));
    group.add(mesh);
    return group;
}
