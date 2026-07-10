import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];

    // Custom Materials
    const eventHorizonMaterial = new THREE.MeshBasicMaterial({ color: 0x000000 });
    
    // Shader material for the accretion disk
    const accretionDiskMaterial = new THREE.ShaderMaterial({
        uniforms: {
            time: { value: 0 },
            color1: { value: new THREE.Color(0xff4400) },
            color2: { value: new THREE.Color(0xffff00) }
        },
        vertexShader: `
            varying vec2 vUv;
            varying vec3 vPosition;
            void main() {
                vUv = uv;
                vPosition = position;
                gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
            }
        `,
        fragmentShader: `
            uniform float time;
            uniform vec3 color1;
            uniform vec3 color2;
            varying vec2 vUv;
            varying vec3 vPosition;

            // Simple noise
            float rand(vec2 n) { 
                return fract(sin(dot(n, vec2(12.9898, 4.1414))) * 43758.5453);
            }
            float noise(vec2 p){
                vec2 ip = floor(p);
                vec2 u = fract(p);
                u = u*u*(3.0-2.0*u);
                
                float res = mix(
                    mix(rand(ip),rand(ip+vec2(1.0,0.0)),u.x),
                    mix(rand(ip+vec2(0.0,1.0)),rand(ip+vec2(1.0,1.0)),u.x),u.y);
                return res*res;
            }

            void main() {
                float dist = length(vPosition.xy);
                float alpha = smoothstep(5.0, 1.5, dist) * smoothstep(1.0, 2.0, dist);
                
                float angle = atan(vPosition.y, vPosition.x);
                float swirl = noise(vec2(angle * 5.0 + time, dist * 3.0 - time * 2.0));
                
                vec3 finalColor = mix(color1, color2, swirl);
                
                gl_FragColor = vec4(finalColor * 1.5, alpha * 0.8 * swirl);
            }
        `,
        transparent: true,
        side: THREE.DoubleSide,
        blending: THREE.AdditiveBlending,
        depthWrite: false
    });

    // Jet material
    const jetMaterial = new THREE.ShaderMaterial({
        uniforms: {
            time: { value: 0 },
            color: { value: new THREE.Color(0x00aaff) }
        },
        vertexShader: `
            varying vec2 vUv;
            varying vec3 vPosition;
            void main() {
                vUv = uv;
                vPosition = position;
                gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
            }
        `,
        fragmentShader: `
            uniform float time;
            uniform vec3 color;
            varying vec2 vUv;
            varying vec3 vPosition;

            void main() {
                float alpha = smoothstep(1.0, 0.0, abs(vPosition.x)) * smoothstep(1.0, 0.0, abs(vPosition.z)) * smoothstep(10.0, 0.0, abs(vPosition.y));
                float pulse = sin(vPosition.y * 5.0 - time * 10.0) * 0.5 + 0.5;
                
                gl_FragColor = vec4(color * 2.0, alpha * pulse * 0.6);
            }
        `,
        transparent: true,
        side: THREE.DoubleSide,
        blending: THREE.AdditiveBlending,
        depthWrite: false
    });
    
    const photonSphereMaterial = new THREE.MeshBasicMaterial({
        color: 0xffaa00,
        transparent: true,
        opacity: 0.15,
        side: THREE.BackSide,
        blending: THREE.AdditiveBlending
    });


    // 1. Event Horizon
    const eventHorizonGeom = new THREE.SphereGeometry(1, 64, 64);
    const eventHorizonMesh = new THREE.Mesh(eventHorizonGeom, eventHorizonMaterial);
    eventHorizonMesh.userData.id = 'event_horizon';
    group.add(eventHorizonMesh);
    
    parts.push({
        name: 'Event Horizon',
        description: 'The boundary of a black hole beyond which nothing, not even light, can escape.',
        material: 'Singularity Void',
        function: 'Traps matter and energy, defining the "surface" of the black hole.',
        assemblyOrder: 1,
        connections: ['Accretion Disk', 'Photon Sphere'],
        failureEffect: 'Spacetime geometry collapse.',
        cascadeFailures: ['Complete structural annihilation'],
        originalPosition: {x: 0, y: 0, z: 0},
        explodedPosition: {x: 0, y: 0, z: 0}
    });

    // 2. Photon Sphere
    const photonSphereGeom = new THREE.SphereGeometry(1.5, 64, 64);
    const photonSphereMesh = new THREE.Mesh(photonSphereGeom, photonSphereMaterial);
    photonSphereMesh.userData.id = 'photon_sphere';
    group.add(photonSphereMesh);

    parts.push({
        name: 'Photon Sphere',
        description: 'A region where gravity is so strong that photons are forced to travel in orbits.',
        material: 'Trapped Light',
        function: 'Bends and orbits light rays around the black hole.',
        assemblyOrder: 2,
        connections: ['Event Horizon'],
        failureEffect: 'Light escapes in random trajectories.',
        cascadeFailures: ['Visual distortion disruption'],
        originalPosition: {x: 0, y: 0, z: 0},
        explodedPosition: {x: 5, y: 5, z: 5}
    });

    // 3. Accretion Disk
    const accretionDiskGeom = new THREE.RingGeometry(1.5, 5, 128);
    // Orient it horizontally
    accretionDiskGeom.rotateX(-Math.PI / 2);
    const accretionDiskMesh = new THREE.Mesh(accretionDiskGeom, accretionDiskMaterial);
    accretionDiskMesh.userData.id = 'accretion_disk';
    group.add(accretionDiskMesh);

    parts.push({
        name: 'Accretion Disk',
        description: 'A massive, superheated disk of matter spiraling into the black hole.',
        material: 'Superheated Plasma',
        function: 'Funnels matter into the black hole, generating immense heat and X-rays through friction.',
        assemblyOrder: 3,
        connections: ['Event Horizon', 'Relativistic Jets'],
        failureEffect: 'Matter ceases to accrete, starves the black hole.',
        cascadeFailures: ['Jet shut down', 'Radiation cessation'],
        originalPosition: {x: 0, y: 0, z: 0},
        explodedPosition: {x: 0, y: 2, z: 0}
    });
    
    // 4. Inner Accretion Flow (Hotter, inner ring)
    const innerDiskGeom = new THREE.RingGeometry(1.1, 2.5, 128);
    innerDiskGeom.rotateX(-Math.PI / 2);
    const innerDiskMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.7, side: THREE.DoubleSide });
    const innerDiskMesh = new THREE.Mesh(innerDiskGeom, innerDiskMaterial);
    innerDiskMesh.position.y = 0.01; // Avoid Z-fighting
    innerDiskMesh.userData.id = 'inner_disk';
    group.add(innerDiskMesh);

    parts.push({
        name: 'Inner Accretion Flow',
        description: 'The hottest, fastest moving innermost stable circular orbit (ISCO) of matter.',
        material: 'Extreme Plasma',
        function: 'Final frontier of matter before crossing the event horizon.',
        assemblyOrder: 4,
        connections: ['Accretion Disk', 'Event Horizon'],
        failureEffect: 'Instabilities in matter consumption.',
        cascadeFailures: ['Jet sputtering'],
        originalPosition: {x: 0, y: 0.01, z: 0},
        explodedPosition: {x: 0, y: 4, z: 0}
    });

    // 5. Relativistic Jet (Top)
    const jetTopGeom = new THREE.CylinderGeometry(0.1, 1.5, 10, 32, 1, true);
    jetTopGeom.translate(0, 5, 0); // Move center
    const jetTopMesh = new THREE.Mesh(jetTopGeom, jetMaterial);
    jetTopMesh.userData.id = 'jet_top';
    group.add(jetTopMesh);

    parts.push({
        name: 'North Relativistic Jet',
        description: 'A powerful beam of ionized matter accelerated to near light speed along the rotational axis.',
        material: 'Accelerated Ionized Matter',
        function: 'Ejects angular momentum and energy from the system.',
        assemblyOrder: 5,
        connections: ['Accretion Disk', 'Magnetic Field Lines'],
        failureEffect: 'Energy backs up, potentially blowing apart the accretion disk.',
        cascadeFailures: ['Accretion stall', 'Massive explosion'],
        originalPosition: {x: 0, y: 0, z: 0},
        explodedPosition: {x: 0, y: 8, z: 0}
    });

    // 6. Relativistic Jet (Bottom)
    const jetBottomGeom = new THREE.CylinderGeometry(0.1, 1.5, 10, 32, 1, true);
    jetBottomGeom.translate(0, -5, 0);
    const jetBottomMesh = new THREE.Mesh(jetBottomGeom, jetMaterial);
    jetBottomMesh.userData.id = 'jet_bottom';
    group.add(jetBottomMesh);

    parts.push({
        name: 'South Relativistic Jet',
        description: 'The opposing polar jet of ultra-fast particles.',
        material: 'Accelerated Ionized Matter',
        function: 'Balances the ejection of energy and angular momentum.',
        assemblyOrder: 6,
        connections: ['Accretion Disk', 'Magnetic Field Lines'],
        failureEffect: 'Asymmetric energy release, causing erratic black hole movement.',
        cascadeFailures: ['Systemic instability'],
        originalPosition: {x: 0, y: 0, z: 0},
        explodedPosition: {x: 0, y: -8, z: 0}
    });
    
    // 7. Magnetic Field Lines (Stylized torus knot or lines)
    const magneticGeom = new THREE.TorusKnotGeometry(1.5, 0.05, 100, 16, 2, 3);
    magneticGeom.rotateX(Math.PI / 2);
    const magneticMat = new THREE.MeshBasicMaterial({ color: 0x8800ff, wireframe: true, transparent: true, opacity: 0.2 });
    const magneticMesh = new THREE.Mesh(magneticGeom, magneticMat);
    magneticMesh.userData.id = 'magnetic_field';
    group.add(magneticMesh);

    parts.push({
        name: 'Magnetic Dynamo',
        description: 'Twisted magnetic field lines generated by the rotating plasma.',
        material: 'Electromagnetic Force',
        function: 'Powers the relativistic jets by collimating and accelerating particles.',
        assemblyOrder: 7,
        connections: ['Accretion Disk', 'North Relativistic Jet', 'South Relativistic Jet'],
        failureEffect: 'Jets diffuse and cease to function.',
        cascadeFailures: ['Loss of energy regulation'],
        originalPosition: {x: 0, y: 0, z: 0},
        explodedPosition: {x: 0, y: 0, z: 5}
    });

    // Collect meshes for animation
    const meshes = {
        eventHorizon: eventHorizonMesh,
        photonSphere: photonSphereMesh,
        accretionDisk: accretionDiskMesh,
        innerDisk: innerDiskMesh,
        jetTop: jetTopMesh,
        jetBottom: jetBottomMesh,
        magneticField: magneticMesh
    };

    const description = "A highly detailed model of a Supermassive Black Hole, featuring a rotating accretion disk, photon sphere, and powerful relativistic jets. These cosmic behemoths warp spacetime and devour surrounding matter.";

    const quizQuestions = [
        {
            question: "What is the boundary called from which nothing, not even light, can escape?",
            options: ["Photon Sphere", "Accretion Disk", "Event Horizon", "Relativistic Jet"],
            correct: 2,
            explanation: "The Event Horizon is the theoretical boundary around a black hole beyond which no light or other radiation can escape.",
            difficulty: "easy"
        },
        {
            question: "What primarily powers the relativistic jets?",
            options: ["Nuclear fusion in the event horizon", "Twisted magnetic fields and the black hole's rotation", "Dark matter collisions", "Photons escaping the photon sphere"],
            correct: 1,
            explanation: "Relativistic jets are thought to be powered by the interaction of the black hole's spin and the strong, twisted magnetic fields generated by the accretion disk.",
            difficulty: "hard"
        },
        {
            question: "Why does the accretion disk emit X-rays?",
            options: ["The black hole reflects them", "Friction between particles superheats the plasma", "Quantum tunneling", "Radioactive decay of dark energy"],
            correct: 1,
            explanation: "As matter spirals inwards, it speeds up and collides, creating intense friction that superheats the plasma, causing it to glow brightly in X-ray wavelengths.",
            difficulty: "medium"
        }
    ];

    function animate(time, speed, activeMeshes) {
        // Rotate accretion disk
        if (activeMeshes.accretionDisk) {
            activeMeshes.accretionDisk.rotation.z -= 0.5 * speed * 0.01;
            activeMeshes.accretionDisk.material.uniforms.time.value = time * speed;
        }
        
        if (activeMeshes.innerDisk) {
            activeMeshes.innerDisk.rotation.z -= 1.0 * speed * 0.01; // Spins faster
            activeMeshes.innerDisk.material.opacity = 0.5 + 0.2 * Math.sin(time * speed * 5);
        }

        // Pulse and rotate photon sphere
        if (activeMeshes.photonSphere) {
            activeMeshes.photonSphere.rotation.y += 0.2 * speed * 0.01;
            activeMeshes.photonSphere.material.opacity = 0.1 + 0.05 * Math.sin(time * speed * 2);
        }

        // Animate jets
        if (activeMeshes.jetTop) {
            activeMeshes.jetTop.material.uniforms.time.value = time * speed;
        }
        if (activeMeshes.jetBottom) {
            activeMeshes.jetBottom.material.uniforms.time.value = time * speed;
        }

        // Rotate magnetic field
        if (activeMeshes.magneticField) {
            activeMeshes.magneticField.rotation.z += 0.1 * speed * 0.01;
            activeMeshes.magneticField.scale.setScalar(1 + 0.02 * Math.sin(time * speed * 3));
        }
    }

    return { group, parts, description, quizQuestions, animate: (t, s) => animate(t, s, meshes) };
}

// Auto-generated missing stub
export function createBlackHoleAccretion() {
    const group = new THREE.Group();
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({color: 0xff0000}));
    group.add(mesh);
    return group;
}
