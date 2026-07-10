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
        opacity: 0.9,
        wireframe: true
    });
    
    const neonRed = new THREE.MeshStandardMaterial({
        color: 0xff0044,
        emissive: 0xff0044,
        emissiveIntensity: 0.6,
        transparent: true,
        opacity: 0.8
    });

    const shockwaveMat = new THREE.MeshStandardMaterial({
        color: 0x88ccff,
        emissive: 0x44aaff,
        emissiveIntensity: 0.5,
        transparent: true,
        opacity: 0.4,
        side: THREE.DoubleSide
    });

    // 1. Settling Chamber
    const settlingChamberGeo = new THREE.CylinderGeometry(2, 2, 4, 32);
    settlingChamberGeo.rotateZ(Math.PI / 2);
    const settlingChamber = new THREE.Mesh(settlingChamberGeo, darkSteel);
    settlingChamber.position.set(-6, 0, 0);
    group.add(settlingChamber);
    
    const honeycombGeo = new THREE.CylinderGeometry(1.9, 1.9, 0.2, 32);
    honeycombGeo.rotateZ(Math.PI / 2);
    const honeycomb = new THREE.Mesh(honeycombGeo, neonBlue);
    honeycomb.position.set(-5, 0, 0);
    group.add(honeycomb);

    parts.push({
        name: 'Settling Chamber & Honeycomb',
        description: 'Conditions the air flow to be smooth and uniform before entering the nozzle.',
        material: 'darkSteel, neonBlue',
        function: 'Flow straightening and turbulence reduction.',
        assemblyOrder: 1,
        connections: ['Nozzle'],
        failureEffect: 'Turbulent flow enters test section, invalidating aerodynamic data.',
        cascadeFailures: ['Test Section Accuracy'],
        originalPosition: { x: -6, y: 0, z: 0 },
        explodedPosition: { x: -10, y: 2, z: 0 }
    });

    // 2. Convergent-Divergent Nozzle
    const nozzlePoints = [];
    for (let i = 0; i <= 20; i++) {
        const t = i / 20;
        const x = t * 4;
        const r = t < 0.5 
            ? 2.0 - 3.0 * t 
            : 0.5 + 2.0 * (t - 0.5); 
        nozzlePoints.push(new THREE.Vector2(r, x));
    }
    const nozzleGeo = new THREE.LatheGeometry(nozzlePoints, 32);
    nozzleGeo.rotateZ(-Math.PI / 2);
    const nozzle = new THREE.Mesh(nozzleGeo, aluminum);
    nozzle.position.set(-4, 0, 0);
    group.add(nozzle);

    parts.push({
        name: 'De Laval Nozzle',
        description: 'Convergent-divergent duct that accelerates the airflow to supersonic speeds.',
        material: 'aluminum',
        function: 'Converts thermal energy into kinetic energy to achieve Mach > 1.',
        assemblyOrder: 2,
        connections: ['Settling Chamber', 'Test Section'],
        failureEffect: 'Choked flow at wrong Mach number or structural failure from pressure.',
        cascadeFailures: ['Test Section'],
        originalPosition: { x: -2, y: 0, z: 0 },
        explodedPosition: { x: -2, y: 4, z: -2 }
    });

    // 3. Test Section
    const testSectionGeo = new THREE.BoxGeometry(3, 2.5, 2.5);
    const testSectionFrameGeo = new THREE.BoxGeometry(3.1, 2.6, 2.6);
    
    const testSectionFrame = new THREE.Mesh(testSectionFrameGeo, steel);
    const testSectionWindow = new THREE.Mesh(testSectionGeo, glass);
    testSectionFrame.position.set(1.5, 0, 0);
    testSectionWindow.position.set(1.5, 0, 0);
    
    const frameEdges = new THREE.LineSegments(
        new THREE.EdgesGeometry(testSectionFrameGeo),
        new THREE.LineBasicMaterial({ color: 0x333333, linewidth: 2 })
    );
    frameEdges.position.set(1.5, 0, 0);
    
    group.add(testSectionWindow);
    group.add(frameEdges);

    parts.push({
        name: 'Test Section',
        description: 'Transparent observation area where the test article is mounted.',
        material: 'glass, steel',
        function: 'Houses the aerodynamic model and measurement instruments (Schlieren photography).',
        assemblyOrder: 3,
        connections: ['Nozzle', 'Diffuser'],
        failureEffect: 'Catastrophic explosive decompression or window shattering.',
        cascadeFailures: ['Test Article', 'Instrumentation'],
        originalPosition: { x: 1.5, y: 0, z: 0 },
        explodedPosition: { x: 1.5, y: 0, z: 5 }
    });

    // 4. Test Article
    const articleGeo = new THREE.ConeGeometry(0.3, 1.2, 16);
    articleGeo.rotateZ(-Math.PI / 2);
    const article = new THREE.Mesh(articleGeo, chrome);
    article.position.set(1.5, 0, 0);
    group.add(article);

    const shockGeo = new THREE.ConeGeometry(0.8, 1.5, 32, 1, true);
    shockGeo.rotateZ(-Math.PI / 2);
    const shockwave = new THREE.Mesh(shockGeo, shockwaveMat);
    shockwave.position.set(1.6, 0, 0);
    group.add(shockwave);

    parts.push({
        name: 'Test Article & Shockwave',
        description: 'Aerodynamic model generating an oblique shockwave at supersonic speeds.',
        material: 'chrome, shockwaveMat',
        function: 'Provides empirical data on aerodynamic forces and shockwave formation.',
        assemblyOrder: 4,
        connections: ['Test Section Mount'],
        failureEffect: 'Model tears off mount, destroying test section.',
        cascadeFailures: ['Test Section Window', 'Diffuser'],
        originalPosition: { x: 1.5, y: 0, z: 0 },
        explodedPosition: { x: 1.5, y: -3, z: 0 }
    });

    // 5. Diffuser
    const diffuserGeo = new THREE.CylinderGeometry(1.5, 2.5, 5, 32);
    diffuserGeo.rotateZ(Math.PI / 2);
    const diffuser = new THREE.Mesh(diffuserGeo, darkSteel);
    diffuser.position.set(5.5, 0, 0);
    group.add(diffuser);

    parts.push({
        name: 'Diffuser',
        description: 'Divergent duct that slows down the supersonic flow back to subsonic speeds.',
        material: 'darkSteel',
        function: 'Recovers pressure and minimizes acoustic shock at the exhaust.',
        assemblyOrder: 5,
        connections: ['Test Section'],
        failureEffect: 'Excessive backpressure disrupts supersonic flow in test section.',
        cascadeFailures: ['Flow Choking'],
        originalPosition: { x: 5.5, y: 0, z: 0 },
        explodedPosition: { x: 10, y: 0, z: 0 }
    });

    // 6. Compressor
    const fanGroup = new THREE.Group();
    for(let i=0; i<8; i++) {
        const bladeGeo = new THREE.BoxGeometry(0.1, 3.5, 0.4);
        const blade = new THREE.Mesh(bladeGeo, neonRed);
        blade.rotation.x = (i * Math.PI) / 4;
        fanGroup.add(blade);
    }
    const fanHub = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.5, 0.5, 16), steel);
    fanHub.rotation.z = Math.PI / 2;
    fanGroup.add(fanHub);
    fanGroup.position.set(-8.5, 0, 0);
    group.add(fanGroup);

    parts.push({
        name: 'Axial Compressor Array',
        description: 'High-power multi-stage turbine driving the immense airflow.',
        material: 'steel, neonRed',
        function: 'Generates the pressure differential required to drive the tunnel.',
        assemblyOrder: 6,
        connections: ['Settling Chamber'],
        failureEffect: 'Compressor stall or blade separation at high RPM.',
        cascadeFailures: ['Power Grid', 'Tunnel Casing'],
        originalPosition: { x: -8.5, y: 0, z: 0 },
        explodedPosition: { x: -14, y: 0, z: 0 }
    });

    const description = "The Aerospace Supersonic Wind Tunnel simulates flight conditions past the speed of sound. A massive compressor forces air through a Settling Chamber to smooth turbulence, before passing it through a convergent-divergent De Laval nozzle. The nozzle accelerates the air to supersonic speeds (Mach > 1) into the Test Section, where an aerodynamic model creates shockwaves. Finally, the Diffuser slows the air down safely.";

    const quizQuestions = [
        {
            question: "What is the primary function of the De Laval (Convergent-Divergent) nozzle?",
            options: [
                "To cool the airflow before it reaches the model.",
                "To accelerate the airflow to supersonic speeds.",
                "To remove dust and particles from the air.",
                "To increase the pressure of the air in the test section."
            ],
            correct: 1,
            explanation: "A De Laval nozzle accelerates choked subsonic flow at the throat into supersonic flow in the divergent section.",
            difficulty: "Medium"
        },
        {
            question: "Why is a settling chamber with a honeycomb grid necessary?",
            options: [
                "To capture debris.",
                "To accelerate the flow.",
                "To straighten the flow and reduce turbulence.",
                "To heat the air."
            ],
            correct: 2,
            explanation: "The honeycomb structure forces the air into parallel streams, significantly reducing turbulence and creating a uniform flow profile for accurate testing.",
            difficulty: "Easy"
        },
        {
            question: "In the test section, what visual phenomenon indicates the presence of supersonic flow over the test model?",
            options: [
                "A condensation cloud.",
                "A Mach cone or oblique shockwave.",
                "Glowing hot air.",
                "Flow separation."
            ],
            correct: 1,
            explanation: "As an object moves faster than the speed of sound relative to the fluid, it creates pressure waves that merge into a distinct shockwave, often visualized using Schlieren photography.",
            difficulty: "Hard"
        }
    ];

    const animate = (time, speed, meshes) => {
        fanGroup.rotation.x -= 0.2 * speed;
        
        shockwave.scale.set(
            1.0 + Math.sin(time * 15 * speed) * 0.05,
            1.0,
            1.0 + Math.sin(time * 15 * speed) * 0.05
        );
        shockwaveMat.opacity = 0.4 + Math.sin(time * 20 * speed) * 0.1;
        
        honeycomb.material.emissiveIntensity = 0.8 + Math.sin(time * 5 * speed) * 0.4;
    };

    return { group, parts, description, quizQuestions, animate };
}

// Auto-generated missing stub
export function createSupersonicWindTunnel() {
    const group = new THREE.Group();
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({color: 0xff0000}));
    group.add(mesh);
    return group;
}
