export function createJwstObservatory(THREE) {
    const jwst = new THREE.Group();

    // Materials
    const goldMat = new THREE.MeshStandardMaterial({ color: 0xffd700, metalness: 0.9, roughness: 0.1 });
    const backMat = new THREE.MeshStandardMaterial({ color: 0x333333, metalness: 0.5, roughness: 0.5 });
    const busMat = new THREE.MeshStandardMaterial({ color: 0xaaaaaa, metalness: 0.8, roughness: 0.2 });
    const shieldMat1 = new THREE.MeshStandardMaterial({ color: 0xccbccc, metalness: 0.3, roughness: 0.7, side: THREE.DoubleSide });
    const shieldMat2 = new THREE.MeshStandardMaterial({ color: 0xbbabbb, metalness: 0.3, roughness: 0.7, side: THREE.DoubleSide });
    const shieldMat3 = new THREE.MeshStandardMaterial({ color: 0xaa9baa, metalness: 0.3, roughness: 0.7, side: THREE.DoubleSide });
    const shieldMat4 = new THREE.MeshStandardMaterial({ color: 0x998b99, metalness: 0.3, roughness: 0.7, side: THREE.DoubleSide });
    const shieldMat5 = new THREE.MeshStandardMaterial({ color: 0x887b88, metalness: 0.3, roughness: 0.7, side: THREE.DoubleSide });

    // Part 1: Primary Mirror
    const primaryMirror = new THREE.Group();
    const hexGeo = new THREE.CylinderGeometry(1, 1, 0.1, 6);
    hexGeo.rotateX(Math.PI / 2);
    // positions for 18 hexes (2 rings)
    const hexPos = [
        [0, 1.732], [0, -1.732], [1.5, 0.866], [1.5, -0.866], [-1.5, 0.866], [-1.5, -0.866],
        [0, 3.464], [0, -3.464], [1.5, 2.598], [1.5, -2.598], [-1.5, 2.598], [-1.5, -2.598],
        [3, 1.732], [3, -1.732], [-3, 1.732], [-3, -1.732], [3, 0], [-3, 0]
    ];
    hexPos.forEach(pos => {
        const hex = new THREE.Mesh(hexGeo, goldMat);
        hex.position.set(pos[0], pos[1], 0);
        primaryMirror.add(hex);
    });
    primaryMirror.rotation.x = -Math.PI / 2; // Face UP (Y axis)
    jwst.add(primaryMirror);

    // Part 2: Secondary Mirror
    const secondaryMirror = new THREE.Mesh(new THREE.CylinderGeometry(0.4, 0.4, 0.1, 6), goldMat);
    secondaryMirror.rotation.x = Math.PI / 2; // face primary
    secondaryMirror.position.set(0, 7, 0); // deployed position

    // Part 3: Support Booms
    const supportBooms = new THREE.Group();
    const boomGeo = new THREE.CylinderGeometry(0.05, 0.05, 7.5);
    
    // Top boom
    const boom1 = new THREE.Mesh(boomGeo, backMat);
    boom1.position.set(0, 3.5, -0.2);
    boom1.rotation.x = -Math.PI / 16; 
    
    // Bottom left boom
    const boom2 = new THREE.Mesh(boomGeo, backMat);
    boom2.position.set(-1.8, 3.5, 0.5);
    boom2.rotation.z = -Math.PI / 12;
    boom2.rotation.x = Math.PI / 16;

    // Bottom right boom
    const boom3 = new THREE.Mesh(boomGeo, backMat);
    boom3.position.set(1.8, 3.5, 0.5);
    boom3.rotation.z = Math.PI / 12;
    boom3.rotation.x = Math.PI / 16;

    supportBooms.add(boom1, boom2, boom3);

    // Pivot group to handle kinematics for secondary mirror and support booms
    const boomPivot = new THREE.Group();
    boomPivot.add(secondaryMirror);
    boomPivot.add(supportBooms);
    jwst.add(boomPivot);

    // Part 4: ISIM (Integrated Science Instrument Module)
    const isimGeo = new THREE.BoxGeometry(3, 2, 2);
    const isim = new THREE.Mesh(isimGeo, backMat);
    isim.position.set(0, -1, 0); // Behind the primary mirror
    jwst.add(isim);

    // Sunshield Geometry (Kite/Diamond shape)
    const shape = new THREE.Shape();
    shape.moveTo(0, 10);
    shape.lineTo(5, 0);
    shape.lineTo(0, -10);
    shape.lineTo(-5, 0);
    shape.lineTo(0, 10);
    const shieldGeo = new THREE.ShapeGeometry(shape);
    shieldGeo.rotateX(Math.PI / 2); // Lay flat on XZ plane

    // Parts 5-9: Sunshields
    const sunshield1 = new THREE.Mesh(shieldGeo, shieldMat1);
    const sunshield2 = new THREE.Mesh(shieldGeo, shieldMat2);
    const sunshield3 = new THREE.Mesh(shieldGeo, shieldMat3);
    const sunshield4 = new THREE.Mesh(shieldGeo, shieldMat4);
    const sunshield5 = new THREE.Mesh(shieldGeo, shieldMat5);
    
    jwst.add(sunshield1);
    jwst.add(sunshield2);
    jwst.add(sunshield3);
    jwst.add(sunshield4);
    jwst.add(sunshield5);

    // Part 10: Spacecraft Bus
    const busGeo = new THREE.BoxGeometry(2, 2, 2);
    const spacecraftBus = new THREE.Mesh(busGeo, busMat);
    spacecraftBus.position.set(0, -4, 0); // Below shields
    jwst.add(spacecraftBus);

    // Kinematics Update function: Simulates full deployment sequence looping every 24 seconds
    function update(t) {
        const time = t % 24;
        
        // Phase 1: Sunshield deploys downwards and separates (0-6s)
        let shieldProgress = 0;
        if (time < 6) shieldProgress = time / 6;
        else if (time < 18) shieldProgress = 1;
        else shieldProgress = 1 - ((time - 18) / 6);
        
        // Smoothstep interpolation
        shieldProgress = shieldProgress * shieldProgress * (3 - 2 * shieldProgress);

        sunshield1.position.y = -1.5;
        sunshield2.position.y = -1.5 - (0.4 * shieldProgress);
        sunshield3.position.y = -1.5 - (0.8 * shieldProgress);
        sunshield4.position.y = -1.5 - (1.2 * shieldProgress);
        sunshield5.position.y = -1.5 - (1.6 * shieldProgress);
        
        spacecraftBus.position.y = -1.5 - (2.0 * shieldProgress) - 1;

        // Phase 2: Boom Pivot deploys secondary mirror (6-12s)
        let boomProgress = 0;
        if (time > 6 && time < 12) boomProgress = (time - 6) / 6;
        else if (time >= 12 && time < 18) boomProgress = 1;
        else if (time >= 18) boomProgress = 1 - ((time - 18) / 6);

        // Smoothstep interpolation
        boomProgress = boomProgress * boomProgress * (3 - 2 * boomProgress);

        // Folded state: -Math.PI / 2, Deployed: 0
        boomPivot.rotation.x = (-Math.PI / 2) * (1 - boomProgress);
    }

    return {
        model: jwst,
        update: update,
        parts: [
            primaryMirror, secondaryMirror, supportBooms, isim,
            sunshield1, sunshield2, sunshield3, sunshield4, sunshield5, spacecraftBus
        ],
        metadata: {
            quiz: [
                {
                    question: "What is the primary purpose of the James Webb Space Telescope's 5-layer sunshield?",
                    options: [
                        "To act as a solar sail for propulsion",
                        "To absorb sunlight for solar power generation",
                        "To passively cool the telescope to temperatures below 50 Kelvin by blocking solar radiation",
                        "To protect the telescope from micrometeorites"
                    ],
                    answer: "To passively cool the telescope to temperatures below 50 Kelvin by blocking solar radiation"
                },
                {
                    question: "How many hexagonal segments make up the JWST's primary mirror?",
                    options: ["18", "12", "24", "6"],
                    answer: "18"
                },
                {
                    question: "Why are the primary mirror segments coated in a microscopic layer of gold?",
                    options: [
                        "To reflect visible light perfectly",
                        "To optimize reflection of infrared light, which JWST primarily observes",
                        "To prevent the mirrors from rusting in space",
                        "To conduct electricity across the mirror surface"
                    ],
                    answer: "To optimize reflection of infrared light, which JWST primarily observes"
                },
                {
                    question: "Where is the Integrated Science Instrument Module (ISIM) located?",
                    options: [
                        "At the very top, next to the secondary mirror",
                        "Directly behind the primary mirror",
                        "Below the spacecraft bus",
                        "At the edge of the sunshield"
                    ],
                    answer: "Directly behind the primary mirror"
                },
                {
                    question: "What component is supported by three long booms extending forward from the primary mirror?",
                    options: [
                        "The star trackers",
                        "The secondary mirror",
                        "The primary antenna",
                        "The solar arrays"
                    ],
                    answer: "The secondary mirror"
                },
                {
                    question: "Which major part of the JWST provides electrical power, attitude control, communications, and propulsion?",
                    options: [
                        "The Spacecraft Bus",
                        "The ISIM",
                        "The Sunshield",
                        "The Optical Telescope Element (OTE)"
                    ],
                    answer: "The Spacecraft Bus"
                }
            ]
        }
    };
}
