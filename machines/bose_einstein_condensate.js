import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];
    const meshes = {};

    // Custom Glowing Materials
    const neonBlueMaterial = new THREE.MeshPhysicalMaterial({
        color: 0x00ffff,
        emissive: 0x00aaff,
        emissiveIntensity: 2.0,
        transparent: true,
        opacity: 0.8,
        roughness: 0.1,
        metalness: 0.1
    });

    const neonPurpleMaterial = new THREE.MeshPhysicalMaterial({
        color: 0xff00ff,
        emissive: 0xaa00ff,
        emissiveIntensity: 1.5,
        transparent: true,
        opacity: 0.9,
        roughness: 0.2,
        metalness: 0.5
    });

    const coldGasMaterial = new THREE.MeshPhysicalMaterial({
        color: 0xaaaaff,
        emissive: 0x2222ff,
        emissiveIntensity: 0.5,
        transparent: true,
        opacity: 0.4,
        roughness: 0.5
    });

    const quantumWaveMaterial = new THREE.ShaderMaterial({
        uniforms: {
            time: { value: 0 },
            color: { value: new THREE.Color(0x00ffff) }
        },
        vertexShader: `
            varying vec2 vUv;
            varying vec3 vPosition;
            uniform float time;
            void main() {
                vUv = uv;
                vPosition = position;
                vec3 pos = position;
                // Add some quantum fluctuation
                pos.x += sin(pos.y * 10.0 + time) * 0.1;
                pos.y += cos(pos.z * 10.0 + time) * 0.1;
                pos.z += sin(pos.x * 10.0 + time) * 0.1;
                gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
            }
        `,
        fragmentShader: `
            uniform float time;
            uniform vec3 color;
            varying vec2 vUv;
            varying vec3 vPosition;
            void main() {
                float pulse = (sin(time * 2.0) + 1.0) * 0.5;
                float intensity = 1.0 - length(vPosition) / 2.0;
                vec3 finalColor = mix(color, vec3(1.0, 1.0, 1.0), pulse * intensity);
                gl_FragColor = vec4(finalColor, intensity * 0.8);
            }
        `,
        transparent: true,
        blending: THREE.AdditiveBlending,
        side: THREE.DoubleSide
    });

    // 1. Vacuum Chamber (Magnetic Trap)
    const chamberGeometry = new THREE.CylinderGeometry(2, 2, 4, 32);
    const chamber = new THREE.Mesh(chamberGeometry, glass);
    chamber.position.set(0, 0, 0);
    group.add(chamber);
    meshes.chamber = chamber;
    parts.push({
        name: "Ultra-High Vacuum Chamber",
        description: "A highly isolated glass chamber where atoms are trapped and cooled.",
        material: "Glass",
        function: "Maintains a vacuum to prevent collisions with background gas molecules.",
        assemblyOrder: 1,
        connections: ["Magnetic Coils", "Cooling Lasers"],
        failureEffect: "Loss of vacuum; atoms heat up instantly and escape.",
        cascadeFailures: ["Condensate Destruction"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: 5, z: 0 }
    });

    // 2. Magnetic Coils (Anti-Helmholtz Configuration)
    const coilGeometry = new THREE.TorusGeometry(2.5, 0.2, 16, 64);
    const topCoil = new THREE.Mesh(coilGeometry, copper);
    topCoil.position.set(0, 1.5, 0);
    topCoil.rotation.x = Math.PI / 2;
    group.add(topCoil);
    meshes.topCoil = topCoil;

    const bottomCoil = new THREE.Mesh(coilGeometry, copper);
    bottomCoil.position.set(0, -1.5, 0);
    bottomCoil.rotation.x = Math.PI / 2;
    group.add(bottomCoil);
    meshes.bottomCoil = bottomCoil;

    parts.push({
        name: "Magnetic Trap Coils",
        description: "Anti-Helmholtz coils generating a quadrupole magnetic field.",
        material: "Copper",
        function: "Confines the atoms in a magnetic trap after initial laser cooling.",
        assemblyOrder: 2,
        connections: ["Vacuum Chamber"],
        failureEffect: "Loss of magnetic confinement; atoms fall due to gravity.",
        cascadeFailures: ["Evaporative Cooling Failure"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: -5, z: 0 }
    });

    // 3. Cooling Lasers (6 Beams)
    const laserGeometry = new THREE.CylinderGeometry(0.05, 0.05, 10, 16);
    const lasersGroup = new THREE.Group();
    const laserMeshes = [];
    
    const axes = [
        [0, 1, 0, 0, 0, 0], // Y
        [0, -1, 0, 0, 0, 0], // -Y
        [1, 0, 0, 0, 0, Math.PI/2], // X
        [-1, 0, 0, 0, 0, Math.PI/2], // -X
        [0, 0, 1, Math.PI/2, 0, 0], // Z
        [0, 0, -1, Math.PI/2, 0, 0] // -Z
    ];

    axes.forEach((axis, i) => {
        const beam = new THREE.Mesh(laserGeometry, neonPurpleMaterial);
        beam.position.set(axis[0]*3, axis[1]*3, axis[2]*3);
        beam.rotation.set(axis[3], axis[4], axis[5]);
        lasersGroup.add(beam);
        laserMeshes.push(beam);
    });
    group.add(lasersGroup);
    meshes.lasers = laserMeshes;

    parts.push({
        name: "Doppler Cooling Lasers",
        description: "Six intersecting laser beams slightly red-detuned from the atomic resonance.",
        material: "Neon/Optical",
        function: "Provides optical molasses, slowing down atoms through momentum transfer from photons.",
        assemblyOrder: 3,
        connections: ["Vacuum Chamber"],
        failureEffect: "Atoms are not pre-cooled enough for the magnetic trap.",
        cascadeFailures: ["Trap Loading Failure"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 5, y: 0, z: 0 }
    });

    // 4. Atom Cloud (Pre-Condensate)
    const cloudGeometry = new THREE.SphereGeometry(1, 32, 32);
    const atomCloud = new THREE.Mesh(cloudGeometry, coldGasMaterial);
    group.add(atomCloud);
    meshes.atomCloud = atomCloud;

    parts.push({
        name: "Thermal Atom Cloud",
        description: "A cloud of Rubidium or Sodium atoms being cooled.",
        material: "Gas",
        function: "The source material that will undergo phase transition.",
        assemblyOrder: 4,
        connections: ["Magnetic Coils", "Cooling Lasers"],
        failureEffect: "Atoms escape.",
        cascadeFailures: [],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: -5, y: 0, z: 0 }
    });

    // 5. Bose-Einstein Condensate (Macroscopic Quantum State)
    const becGeometry = new THREE.IcosahedronGeometry(0.3, 4);
    const bec = new THREE.Mesh(becGeometry, quantumWaveMaterial);
    group.add(bec);
    meshes.bec = bec;

    parts.push({
        name: "Bose-Einstein Condensate Wavefunction",
        description: "A giant matter wave where all atoms occupy the same quantum state.",
        material: "Quantum Wave",
        function: "Exhibits macroscopic quantum phenomena like superfluidity and interference.",
        assemblyOrder: 5,
        connections: ["Atom Cloud"],
        failureEffect: "Thermal fluctuations destroy phase coherence.",
        cascadeFailures: ["Loss of Quantum State"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: 0, z: 5 }
    });

    const description = "A Bose-Einstein Condensate (BEC) is a state of matter formed at temperatures very close to absolute zero. At these nanokelvin temperatures, a large fraction of bosons occupy the lowest quantum state, resulting in macroscopic quantum phenomena where wavefunctions overlap into a single coherent wave.";

    const quizQuestions = [
        {
            question: "What is the primary method used to initially cool atoms before magnetic trapping in a BEC experiment?",
            options: [
                "Evaporative cooling",
                "Laser cooling (Optical molasses)",
                "Liquid helium immersion",
                "Magnetic refrigeration"
            ],
            correct: 1,
            explanation: "Laser cooling, specifically optical molasses, slows down atoms using the momentum of photons, dropping the temperature from room temperature down to the microkelvin range.",
            difficulty: "Medium"
        },
        {
            question: "Why are Bosons required to form a Bose-Einstein Condensate, rather than Fermions?",
            options: [
                "Bosons are heavier than Fermions.",
                "Fermions have a neutral charge.",
                "Bosons do not obey the Pauli exclusion principle and can occupy the same quantum state.",
                "Bosons naturally repel each other."
            ],
            correct: 2,
            explanation: "Unlike Fermions, Bosons have integer spin and do not obey the Pauli exclusion principle. Therefore, at extremely low temperatures, an unlimited number of them can condense into the exact same lowest-energy quantum state.",
            difficulty: "Hard"
        },
        {
            question: "What is 'evaporative cooling' in the context of BEC creation?",
            options: [
                "Blowing cold air over the vacuum chamber.",
                "Lowering the magnetic trap depth to allow the hottest atoms to escape, leaving the rest colder.",
                "Using liquid nitrogen to evaporate the atoms.",
                "Shining highly intense lasers to burn away impurities."
            ],
            correct: 1,
            explanation: "Evaporative cooling lowers the edges of the magnetic or optical trap. The most energetic (hottest) atoms escape, carrying away more than their fair share of energy, and the remaining atoms re-thermalize at a lower temperature.",
            difficulty: "Medium"
        }
    ];

    const animate = (time, speed, meshes) => {
        // Pulse the lasers
        meshes.lasers.forEach((laser, idx) => {
            laser.scale.set(1 + Math.sin(time * speed * 5 + idx) * 0.1, 1, 1 + Math.sin(time * speed * 5 + idx) * 0.1);
            laser.material.emissiveIntensity = 1.5 + Math.sin(time * speed * 10) * 0.5;
        });

        // Rotate the atom cloud slowly to simulate thermal motion
        meshes.atomCloud.rotation.y = time * speed;
        meshes.atomCloud.rotation.x = time * speed * 0.5;
        // Shrink the atom cloud as 'cooling' progresses
        const cloudScale = Math.max(0.2, 1.0 - (time * speed * 0.1) % 1.0);
        meshes.atomCloud.scale.set(cloudScale, cloudScale, cloudScale);

        // Grow the BEC core as the cloud shrinks
        const becScale = Math.min(1.0, ((time * speed * 0.1) % 1.0) * 2.0);
        meshes.bec.scale.set(becScale, becScale, becScale);
        
        // Update the shader time uniform for the quantum wave
        meshes.bec.material.uniforms.time.value = time * speed * 2;

        // Coil magnetic field pulses
        meshes.topCoil.material.emissive = new THREE.Color(0x550000);
        meshes.topCoil.material.emissiveIntensity = 0.5 + Math.sin(time * speed * 8) * 0.5;
        meshes.bottomCoil.material.emissive = new THREE.Color(0x550000);
        meshes.bottomCoil.material.emissiveIntensity = 0.5 + Math.sin(time * speed * 8) * 0.5;
    };

    return { group, parts, description, quizQuestions, animate };
}

// Auto-generated missing stub
export function createBoseEinsteinCondensate() {
    const group = new THREE.Group();
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({color: 0xff0000}));
    group.add(mesh);
    return group;
}
