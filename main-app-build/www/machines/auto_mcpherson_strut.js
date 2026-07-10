import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];

    // Custom glowing materials
    const neonBlue = new THREE.MeshPhysicalMaterial({
        color: 0x00d2ff,
        emissive: 0x00d2ff,
        emissiveIntensity: 0.8,
        metalness: 0.8,
        roughness: 0.2,
        clearcoat: 1.0,
    });
    
    const neonOrange = new THREE.MeshPhysicalMaterial({
        color: 0xff6b00,
        emissive: 0xff4500,
        emissiveIntensity: 0.6,
        metalness: 0.5,
        roughness: 0.3,
    });

    const meshes = {};

    // 1. Damper Body (Lower part)
    const damperGeom = new THREE.CylinderGeometry(0.6, 0.5, 4, 32);
    const damperMesh = new THREE.Mesh(damperGeom, darkSteel);
    damperMesh.position.set(0, 0, 0);
    group.add(damperMesh);
    meshes.damper = damperMesh;
    parts.push({
        name: "Shock Absorber Tube",
        description: "The main body of the damper containing hydraulic fluid and valving.",
        material: "Dark Steel",
        function: "Dissipates kinetic energy from the suspension movement into heat.",
        assemblyOrder: 1,
        connections: ["Piston Rod", "Lower Mount"],
        failureEffect: "Fluid leak resulting in bouncy ride and poor handling.",
        cascadeFailures: ["Tire wear", "Spring fatigue"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: -3, y: -2, z: 0 }
    });

    // 2. Piston Rod
    const rodGeom = new THREE.CylinderGeometry(0.2, 0.2, 3, 32);
    const rodMesh = new THREE.Mesh(rodGeom, chrome);
    rodMesh.position.set(0, 3, 0);
    group.add(rodMesh);
    meshes.rod = rodMesh;
    parts.push({
        name: "Piston Rod",
        description: "Chromed steel rod connected to the internal piston.",
        material: "Chrome Steel",
        function: "Transmits suspension forces to the internal hydraulic piston.",
        assemblyOrder: 2,
        connections: ["Shock Absorber Tube", "Top Mount"],
        failureEffect: "Bent rod causing binding and catastrophic shock failure.",
        cascadeFailures: ["Damper seal blowout"],
        originalPosition: { x: 0, y: 3, z: 0 },
        explodedPosition: { x: 0, y: 6, z: 0 }
    });

    // 3. Lower Spring Seat
    const lowerSeatGeom = new THREE.CylinderGeometry(1.8, 1.8, 0.2, 32);
    const lowerSeatMesh = new THREE.Mesh(lowerSeatGeom, steel);
    lowerSeatMesh.position.set(0, 1.5, 0);
    group.add(lowerSeatMesh);
    meshes.lowerSeat = lowerSeatMesh;
    parts.push({
        name: "Lower Spring Seat",
        description: "Welded flange on the damper body to support the coil spring.",
        material: "Steel",
        function: "Provides a resting platform for the coil spring.",
        assemblyOrder: 3,
        connections: ["Shock Absorber Tube", "Coil Spring"],
        failureEffect: "Spring dislocation.",
        cascadeFailures: ["Suspension collapse", "Tire damage"],
        originalPosition: { x: 0, y: 1.5, z: 0 },
        explodedPosition: { x: 3, y: 1.5, z: 0 }
    });

    // 4. Coil Spring
    class HelixCurve extends THREE.Curve {
        constructor(radius, height, turns) {
            super();
            this.radius = radius;
            this.height = height;
            this.turns = turns;
        }
        getPoint(t, optionalTarget = new THREE.Vector3()) {
            const angle = 2 * Math.PI * this.turns * t;
            const x = this.radius * Math.cos(angle);
            const z = this.radius * Math.sin(angle);
            const y = (t - 0.5) * this.height;
            return optionalTarget.set(x, y, z);
        }
    }
    const springPath = new HelixCurve(1.5, 4.5, 5.5);
    const springGeom = new THREE.TubeGeometry(springPath, 200, 0.25, 16, false);
    const springMesh = new THREE.Mesh(springGeom, neonBlue);
    springMesh.position.set(0, 3.8, 0);
    group.add(springMesh);
    meshes.spring = springMesh;
    parts.push({
        name: "Coil Spring",
        description: "High-tensile steel helical spring with a neon aesthetic.",
        material: "High-Tech Alloy (Neon Blue)",
        function: "Supports vehicle weight and absorbs road impacts.",
        assemblyOrder: 4,
        connections: ["Lower Spring Seat", "Upper Spring Seat"],
        failureEffect: "Sagging ride height and harsh bottoming out.",
        cascadeFailures: ["Shock absorber damage", "Chassis stress"],
        originalPosition: { x: 0, y: 3.8, z: 0 },
        explodedPosition: { x: 5, y: 4, z: 2 }
    });

    // 5. Upper Spring Seat and Mount
    const upperSeatGeom = new THREE.CylinderGeometry(1.6, 1.6, 0.3, 32);
    const upperSeatMesh = new THREE.Mesh(upperSeatGeom, aluminum);
    upperSeatMesh.position.set(0, 6.0, 0);
    group.add(upperSeatMesh);
    meshes.upperSeat = upperSeatMesh;
    parts.push({
        name: "Upper Mount & Bearing",
        description: "Top assembly connecting the strut to the chassis, containing a thrust bearing.",
        material: "Aluminum & Rubber",
        function: "Allows the strut to steer and isolates NVH (Noise, Vibration, Harshness).",
        assemblyOrder: 5,
        connections: ["Coil Spring", "Piston Rod", "Vehicle Chassis"],
        failureEffect: "Clunking noises over bumps and stiff steering.",
        cascadeFailures: ["Uneven tire wear", "Alignment issues"],
        originalPosition: { x: 0, y: 6.0, z: 0 },
        explodedPosition: { x: 0, y: 8, z: -2 }
    });

    // 6. Lower Mount / Knuckle Bracket
    const bracketGeom = new THREE.BoxGeometry(1.4, 1.5, 1.4);
    const bracketMesh = new THREE.Mesh(bracketGeom, neonOrange);
    bracketMesh.position.set(0.6, -1.2, 0);
    // Add some angles
    bracketMesh.rotation.z = Math.PI / 12;
    group.add(bracketMesh);
    meshes.bracket = bracketMesh;
    parts.push({
        name: "Steering Knuckle Bracket",
        description: "Heavy-duty mounting point for the wheel knuckle.",
        material: "Forged Steel (Neon Orange)",
        function: "Secures the strut to the wheel hub assembly and dictates camber angle.",
        assemblyOrder: 6,
        connections: ["Shock Absorber Tube", "Steering Knuckle"],
        failureEffect: "Loss of wheel camber control.",
        cascadeFailures: ["Loss of vehicle control", "Axle damage"],
        originalPosition: { x: 0.6, y: -1.2, z: 0 },
        explodedPosition: { x: 2, y: -3, z: 3 }
    });

    // 7. Dust Boot & Bump Stop
    const bootGeom = new THREE.CylinderGeometry(0.7, 0.7, 2.5, 16, 15, true);
    const posAttribute = bootGeom.attributes.position;
    for(let i=0; i<posAttribute.count; i++) {
        const y = posAttribute.getY(i);
        const radiusOffset = Math.sin(y * 12) * 0.08;
        posAttribute.setX(i, posAttribute.getX(i) * (1 + radiusOffset));
        posAttribute.setZ(i, posAttribute.getZ(i) * (1 + radiusOffset));
    }
    bootGeom.computeVertexNormals();
    const bootMesh = new THREE.Mesh(bootGeom, rubber);
    bootMesh.position.set(0, 4.0, 0);
    group.add(bootMesh);
    meshes.boot = bootMesh;
    parts.push({
        name: "Dust Boot & Bump Stop",
        description: "Corrugated rubber sleeve with internal polyurethane bump stop.",
        material: "Rubber",
        function: "Keeps dirt off the piston rod and prevents metal-to-metal contact on hard impacts.",
        assemblyOrder: 7,
        connections: ["Piston Rod", "Upper Mount"],
        failureEffect: "Rod seal contamination.",
        cascadeFailures: ["Premature shock leakage"],
        originalPosition: { x: 0, y: 4.0, z: 0 },
        explodedPosition: { x: -3, y: 5, z: -2 }
    });

    const description = "The McPherson Strut is a highly popular automotive suspension system. It combines a shock absorber and a coil spring into a single compact unit that provides structural support, damping, and a pivot point for steering. Its simplicity and compact size make it ideal for front-wheel-drive vehicles.";

    const quizQuestions = [
        {
            question: "What is the primary dual purpose of the McPherson Strut in a vehicle's suspension?",
            options: [
                "Only to provide ride comfort",
                "To act as both a suspension damper and a structural steering pivot",
                "To connect the transmission to the wheels",
                "To power the braking system"
            ],
            correct: 1,
            explanation: "The McPherson Strut uniquely integrates the shock absorber into the structural support of the suspension, acting as the upper steering pivot.",
            difficulty: "Medium"
        },
        {
            question: "Which component inside the strut dissipates kinetic energy as heat?",
            options: [
                "Coil Spring",
                "Upper Mount Bearing",
                "Shock Absorber Fluid/Valving",
                "Dust Boot"
            ],
            correct: 2,
            explanation: "The shock absorber (damper) forces hydraulic fluid through small valves, converting the kinetic energy of suspension movement into thermal energy (heat).",
            difficulty: "Hard"
        },
        {
            question: "What happens if the strut's Upper Mount Bearing fails?",
            options: [
                "The engine will overheat",
                "The vehicle will experience stiff steering and clunking noises",
                "The brake pads will wear instantly",
                "The tires will deflate"
            ],
            correct: 1,
            explanation: "The upper mount bearing allows the strut assembly to rotate when steering. A failed bearing causes binding, resulting in stiff steering and 'clunking' or 'popping' noises.",
            difficulty: "Medium"
        }
    ];

    function animate(time, speed, activeMeshes) {
        const t = time * speed;
        
        // Simulate suspension travel over a bumpy road
        const compression = Math.sin(t * 6) * 0.5 + Math.sin(t * 14) * 0.2;

        if (meshes.rod) meshes.rod.position.y = 3 + compression * 0.5;
        if (meshes.upperSeat) meshes.upperSeat.position.y = 6.0 + compression * 0.5;

        // Animate Spring
        if (meshes.spring) {
            const targetScaleY = (4.5 + compression * 0.5) / 4.5;
            meshes.spring.scale.set(1, targetScaleY, 1);
            meshes.spring.position.y = 3.8 + compression * 0.25;
        }

        // Animate Boot
        if (meshes.boot) {
            const targetScaleY = (2.5 + compression * 0.5) / 2.5;
            meshes.boot.scale.set(1, targetScaleY, 1);
            meshes.boot.position.y = 4.0 + compression * 0.25;
        }
        
        // Pulsing neon effects
        if (neonBlue) neonBlue.emissiveIntensity = 0.6 + Math.sin(t * 3) * 0.4;
        if (neonOrange) neonOrange.emissiveIntensity = 0.5 + Math.cos(t * 4) * 0.3;
    }

    group.scale.set(1.2, 1.2, 1.2);

    return { group, parts, description, quizQuestions, animate };
}

// Auto-generated missing stub
export function createMcPhersonStrut() {
    const group = new THREE.Group();
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({color: 0xff0000}));
    group.add(mesh);
    return group;
}
