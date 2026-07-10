import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];

    // Custom Glowing Materials for Lasers
    const laserMaterialRed = new THREE.MeshBasicMaterial({ color: 0xff0000, transparent: true, opacity: 0.6, blending: THREE.AdditiveBlending });
    const laserMaterialBlue = new THREE.MeshBasicMaterial({ color: 0x0088ff, transparent: true, opacity: 0.3, blending: THREE.AdditiveBlending, side: THREE.DoubleSide });
    
    // Part 1: Lens Mount
    const mountGeo = new THREE.CylinderGeometry(2, 2, 0.5, 32);
    const mount = new THREE.Mesh(mountGeo, chrome);
    mount.rotation.x = Math.PI / 2;
    mount.position.set(0, 0, -4);
    group.add(mount);
    parts.push({
        name: "Lens Mount",
        description: "Connects the anamorphic lens to the camera body.",
        material: "Chrome",
        function: "Secures the lens firmly to the camera sensor plane.",
        assemblyOrder: 1,
        connections: ["Rear Spherical Element", "Camera Body"],
        failureEffect: "Lens detaches or loses alignment with the sensor.",
        cascadeFailures: ["Loss of focus", "Light leaks"],
        originalPosition: { x: 0, y: 0, z: -4 },
        explodedPosition: { x: 0, y: 0, z: -8 }
    });
    
    // Part 2: Rear Spherical Elements
    const rearSphericalGeo = new THREE.SphereGeometry(1.5, 32, 16, 0, Math.PI * 2, 0, Math.PI / 3);
    const rearSpherical = new THREE.Mesh(rearSphericalGeo, glass);
    rearSpherical.rotation.x = -Math.PI / 2;
    rearSpherical.position.set(0, 0, -2);
    group.add(rearSpherical);
    parts.push({
        name: "Rear Spherical Element",
        description: "Standard spherical lens element for focus and basic image correction.",
        material: "Glass",
        function: "Focuses the squeezed image onto the sensor.",
        assemblyOrder: 2,
        connections: ["Lens Mount", "Aperture Ring"],
        failureEffect: "Image becomes blurry.",
        cascadeFailures: ["Chromatic aberration"],
        originalPosition: { x: 0, y: 0, z: -2 },
        explodedPosition: { x: 0, y: 0, z: -5 }
    });
    
    // Part 3: Aperture Ring
    const apertureGeo = new THREE.CylinderGeometry(2.2, 2.2, 1, 32);
    const aperture = new THREE.Mesh(apertureGeo, darkSteel);
    aperture.rotation.x = Math.PI / 2;
    aperture.position.set(0, 0, -1);
    group.add(aperture);
    parts.push({
        name: "Aperture Mechanism",
        description: "Controls the amount of light entering the lens.",
        material: "Dark Steel",
        function: "Adjusts depth of field and exposure.",
        assemblyOrder: 3,
        connections: ["Rear Spherical Element", "Main Lens Barrel"],
        failureEffect: "Exposure cannot be adjusted.",
        cascadeFailures: ["Overexposed/underexposed images"],
        originalPosition: { x: 0, y: 0, z: -1 },
        explodedPosition: { x: 0, y: 2, z: -3 }
    });

    // Part 4: Main Lens Barrel
    const barrelGeo = new THREE.CylinderGeometry(2.3, 2.3, 6, 32);
    const barrel = new THREE.Mesh(barrelGeo, aluminum);
    barrel.rotation.x = Math.PI / 2;
    barrel.position.set(0, 0, 1.5);
    group.add(barrel);
    parts.push({
        name: "Main Lens Barrel",
        description: "The primary housing holding all optical elements.",
        material: "Aluminum",
        function: "Provides structural integrity and blocks stray light.",
        assemblyOrder: 4,
        connections: ["Aperture Mechanism", "Focus Ring"],
        failureEffect: "Optical elements lose alignment.",
        cascadeFailures: ["Complete optical failure", "Light leaks"],
        originalPosition: { x: 0, y: 0, z: 1.5 },
        explodedPosition: { x: 0, y: 0, z: 1.5 }
    });
    
    // Part 5: Focus Ring
    const focusGeo = new THREE.CylinderGeometry(2.4, 2.4, 2, 32);
    const focus = new THREE.Mesh(focusGeo, rubber);
    focus.rotation.x = Math.PI / 2;
    focus.position.set(0, 0, 2);
    group.add(focus);
    parts.push({
        name: "Focus Ring",
        description: "Rubberized grip for adjusting focus.",
        material: "Rubber",
        function: "Moves internal spherical elements to achieve sharp focus.",
        assemblyOrder: 5,
        connections: ["Main Lens Barrel", "Rear Cylindrical Element"],
        failureEffect: "Inability to pull focus.",
        cascadeFailures: ["Useless footage for moving subjects"],
        originalPosition: { x: 0, y: 0, z: 2 },
        explodedPosition: { x: 0, y: -3, z: 2 }
    });

    // Part 6: Rear Cylindrical Element (Anamorphic Squeeze)
    const rearCylGeo = new THREE.CylinderGeometry(1.8, 1.8, 1, 32);
    const rearCyl = new THREE.Mesh(rearCylGeo, glass);
    rearCyl.scale.set(0.5, 1, 1);
    rearCyl.position.set(0, 0, 3);
    group.add(rearCyl);
    parts.push({
        name: "Rear Cylindrical Element",
        description: "First part of the anamorphic block, starts the horizontal squeeze.",
        material: "Glass",
        function: "Compresses the horizontal field of view.",
        assemblyOrder: 6,
        connections: ["Main Lens Barrel", "Front Cylindrical Element"],
        failureEffect: "Distortion of the anamorphic ratio.",
        cascadeFailures: ["Image warping", "Astigmatism"],
        originalPosition: { x: 0, y: 0, z: 3 },
        explodedPosition: { x: -3, y: 0, z: 5 }
    });

    // Part 7: Front Cylindrical Element (Anamorphic Squeeze)
    const frontCylGeo = new THREE.CylinderGeometry(2, 2, 1, 32);
    const frontCyl = new THREE.Mesh(frontCylGeo, tinted);
    frontCyl.scale.set(0.4, 1, 1);
    frontCyl.position.set(0, 0, 4.5);
    group.add(frontCyl);
    parts.push({
        name: "Front Cylindrical Element",
        description: "Front-most anamorphic glass, completes the squeeze.",
        material: "Tinted Glass",
        function: "Completes the 2x horizontal squeeze and creates iconic horizontal flares.",
        assemblyOrder: 7,
        connections: ["Rear Cylindrical Element"],
        failureEffect: "Loss of horizontal flare character.",
        cascadeFailures: ["Incorrect squeeze ratio"],
        originalPosition: { x: 0, y: 0, z: 4.5 },
        explodedPosition: { x: 0, y: 0, z: 8 }
    });

    // Part 8: Incident Light Beam (Animated)
    const beamGeo = new THREE.CylinderGeometry(1.5, 1.5, 12, 16);
    const beam = new THREE.Mesh(beamGeo, laserMaterialBlue);
    beam.rotation.x = Math.PI / 2;
    beam.position.set(0, 0, 0);
    group.add(beam);
    
    const meshes = {
        beam: beam,
        frontCyl: frontCyl,
        rearCyl: rearCyl
    };

    const description = "An anamorphic lens uses cylindrical optics to capture a wider field of view onto a standard aspect ratio sensor by horizontally compressing (squeezing) the image. During projection or post-production, the image is 'de-squeezed' to its original widescreen aspect ratio. This process creates unique characteristics like oval bokeh and horizontal lens flares.";

    const quizQuestions = [
        {
            question: "What is the primary optical component that distinguishes an anamorphic lens from a spherical lens?",
            options: ["Aperture blades", "Cylindrical elements", "Flange focal distance", "Macro rings"],
            correct: 1,
            explanation: "Anamorphic lenses use cylindrical elements to squeeze the image horizontally while leaving the vertical axis unaffected.",
            difficulty: "Medium"
        },
        {
            question: "Why do anamorphic lenses produce oval-shaped bokeh?",
            options: ["Because of the horizontal squeeze of the cylindrical elements.", "Due to fewer aperture blades.", "Because of chromatic aberration.", "Because the sensor is oval."],
            correct: 0,
            explanation: "The horizontal compression of the image causes out-of-focus highlights to stretch vertically when viewed squeezed, or horizontally when de-squeezed.",
            difficulty: "Medium"
        },
        {
            question: "If an anamorphic lens has a 2x squeeze ratio and is used on a 4:3 sensor, what is the final de-squeezed aspect ratio?",
            options: ["16:9", "2.35:1", "2.66:1", "1.85:1"],
            correct: 2,
            explanation: "A 4:3 ratio is 1.33:1. Multiplying the horizontal width by the 2x squeeze ratio (1.33 * 2) gives approximately 2.66:1.",
            difficulty: "Hard"
        }
    ];

    function animate(time, speed, meshes) {
        // Animate the light beam showing the squeeze effect
        const squeezePulse = Math.sin(time * speed * 2) * 0.2 + 0.5; // Oscillates between 0.3 and 0.7
        meshes.beam.scale.set(squeezePulse, 1, 1);
        
        // Add a subtle rotation to the cylindrical elements to represent focus breathing
        meshes.frontCyl.rotation.z = Math.sin(time * speed) * 0.05;
        meshes.rearCyl.rotation.z = Math.cos(time * speed) * 0.05;
    }

    return { group, parts, description, quizQuestions, animate: (t, s) => animate(t, s, meshes) };
}

// Auto-generated missing stub
export function createAnamorphicLens() {
    const group = new THREE.Group();
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({color: 0xff0000}));
    group.add(mesh);
    return group;
}
