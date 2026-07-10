import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];
    
    // Custom Materials
    const jdGreen = new THREE.MeshStandardMaterial({ color: 0x367C2B, metalness: 0.5, roughness: 0.3 });
    const jdYellow = new THREE.MeshStandardMaterial({ color: 0xFFDE00, metalness: 0.3, roughness: 0.5 });
    const castIron = new THREE.MeshStandardMaterial({ color: 0x1a1a1a, roughness: 0.8, metalness: 0.7 });
    
    // Internal Physics State Engine
    group.userData.state = {
        throttle: 0.0,       // 0.0 (idle) to 1.0 (full power)
        rpm: 800,            // Engine RPM
        electricity: 1.0,    // Battery voltage pulse
        heat: 0.0            // Combustion visual intensity
    };

    // 1. The Chassis (Base Model)
    const chassisGeo = new THREE.BoxGeometry(2, 0.5, 4);
    const chassis = new THREE.Mesh(chassisGeo, castIron);
    chassis.position.set(0, 1.5, 0);
    chassis.castShadow = true;
    group.add(chassis);
    parts.push({ mesh: chassis, name: "Main Chassis Frame", description: "Heavy cast-iron chassis providing structural integrity.", function: "Supports all major components including engine, transmission, and axles." });

    // 2. The Engine Block (Translucent to show internal combustion)
    const engineGeo = new THREE.BoxGeometry(1.5, 1.2, 2);
    const translucentSteel = new THREE.MeshPhysicalMaterial({ color: 0x888888, metalness: 0.8, roughness: 0.1, transmission: 0.8, thickness: 0.5, transparent: true, opacity: 0.5 });
    const engine = new THREE.Mesh(engineGeo, translucentSteel);
    engine.position.set(0, 2.5, 1);
    group.add(engine);
    parts.push({ mesh: engine, name: "V8 Diesel Engine Block", description: "High-displacement diesel engine block. Translucent to visualize internal combustion.", function: "Converts chemical energy from diesel into mechanical power." });

    // 3. The Combustion Physics Engine (Particle System)
    const particleCount = 2000;
    const particleGeo = new THREE.BufferGeometry();
    const particlePos = new Float32Array(particleCount * 3);
    const particleVel = []; // Velocities
    const particleLife = new Float32Array(particleCount); // Life
    
    for (let i = 0; i < particleCount; i++) {
        particlePos[i*3] = (Math.random() - 0.5) * 1.2;
        particlePos[i*3+1] = (Math.random() - 0.5) * 0.8 + 2.5; // Inside engine
        particlePos[i*3+2] = (Math.random() - 0.5) * 1.8 + 1.0;
        
        particleVel.push({
            x: (Math.random() - 0.5) * 0.02,
            y: Math.random() * 0.05,
            z: (Math.random() - 0.5) * 0.02
        });
        particleLife[i] = Math.random();
    }
    
    particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePos, 3));
    particleGeo.setAttribute('life', new THREE.BufferAttribute(particleLife, 1));
    
    // Custom Shader for Fire Particles
    const fireShader = new THREE.ShaderMaterial({
        uniforms: {
            time: { value: 0 },
            intensity: { value: 0.0 }
        },
        vertexShader: `
            attribute float life;
            varying float vLife;
            void main() {
                vLife = life;
                vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
                gl_PointSize = (10.0 * life) * (10.0 / -mvPosition.z);
                gl_Position = projectionMatrix * mvPosition;
            }
        `,
        fragmentShader: `
            uniform float intensity;
            varying float vLife;
            void main() {
                // Fire color gradient based on life and throttle intensity
                vec3 baseColor = vec3(1.0, 0.3, 0.0); // Orange
                vec3 hotColor = vec3(1.0, 0.9, 0.2); // Yellow
                vec3 color = mix(baseColor, hotColor, vLife * intensity * 2.0);
                float alpha = (1.0 - vLife) * intensity;
                gl_FragColor = vec4(color, alpha);
            }
        `,
        transparent: true,
        blending: THREE.AdditiveBlending,
        depthWrite: false
    });
    
    const combustionParticles = new THREE.Points(particleGeo, fireShader);
    group.add(combustionParticles);

    // 4. The InstancedMesh System (100,000 Nuts and Bolts)
    // To prevent browser crash, we use an InstancedMesh to render 100,000 distinct geometries in a single draw call.
    const boltCount = 100000;
    const boltGeo = new THREE.CylinderGeometry(0.01, 0.01, 0.02, 6); // Hexagonal bolt head
    const instancedBolts = new THREE.InstancedMesh(boltGeo, steel, boltCount);
    
    const dummy = new THREE.Object3D();
    for (let i = 0; i < boltCount; i++) {
        // Distribute bolts evenly over the surface of the chassis and engine
        // We randomly place them along the X, Y, Z boundaries of the main blocks
        const target = Math.random() > 0.5 ? 'engine' : 'chassis';
        let bx, by, bz;
        if(target === 'engine') {
            bx = (Math.random() - 0.5) * 1.5;
            by = (Math.random() - 0.5) * 1.2 + 2.5;
            bz = (Math.random() - 0.5) * 2 + 1;
        } else {
            bx = (Math.random() - 0.5) * 2;
            by = (Math.random() - 0.5) * 0.5 + 1.5;
            bz = (Math.random() - 0.5) * 4;
        }
        
        // Randomly push to the exterior shell to look like surface bolts
        const axis = Math.floor(Math.random() * 3);
        if(target === 'engine') {
            if(axis===0) bx = bx > 0 ? 0.75 : -0.75;
            if(axis===1) by = by > 2.5 ? 3.1 : 1.9;
            if(axis===2) bz = bz > 1 ? 2.0 : 0.0;
        } else {
            if(axis===0) bx = bx > 0 ? 1.0 : -1.0;
            if(axis===1) by = by > 1.5 ? 1.75 : 1.25;
            if(axis===2) bz = bz > 0 ? 2.0 : -2.0;
        }
        
        dummy.position.set(bx, by, bz);
        
        // Orient bolt outwards
        if(axis===0) dummy.rotation.z = Math.PI/2;
        if(axis===2) dummy.rotation.x = Math.PI/2;
        
        dummy.updateMatrix();
        instancedBolts.setMatrixAt(i, dummy.matrix);
    }
    instancedBolts.instanceMatrix.needsUpdate = true;
    group.add(instancedBolts);
    parts.push({ mesh: instancedBolts, name: "100,000 Micro-Fasteners", description: "Procedural array of 100,000 individual hex bolts securing the tractor framework, rendered via InstancedMesh for extreme performance.", function: "Maintains mechanical integrity under extreme torsion." });

    // 5. Electrical Simulation (GLSL Flow Shaders)
    const batteryGeo = new THREE.BoxGeometry(0.5, 0.4, 0.4);
    const battery = new THREE.Mesh(batteryGeo, plastic);
    battery.position.set(-0.5, 2.2, -0.5);
    group.add(battery);
    
    // Wiring harness geometry (Curve)
    class WireCurve extends THREE.Curve {
        getPoint(t, optionalTarget = new THREE.Vector3()) {
            const tx = -0.5 + t * 0.5; // moves from battery to center
            const ty = 2.2 + Math.sin(t * Math.PI) * 0.2;
            const tz = -0.5 + t * 3.5; // moves from battery to front headlights
            return optionalTarget.set(tx, ty, tz);
        }
    }
    const wirePath = new WireCurve();
    const wireGeo = new THREE.TubeGeometry(wirePath, 64, 0.02, 8, false);
    
    // Electricity flow shader
    const electricalShader = new THREE.ShaderMaterial({
        uniforms: {
            time: { value: 0 },
            voltage: { value: 1.0 }
        },
        vertexShader: `
            varying vec2 vUv;
            void main() {
                vUv = uv;
                gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
            }
        `,
        fragmentShader: `
            uniform float time;
            uniform float voltage;
            varying vec2 vUv;
            void main() {
                // Moving sine wave pulse along the UV x-axis
                float pulse = sin((vUv.x * 20.0) - (time * 10.0)) * 0.5 + 0.5;
                // Sharpen the pulse
                pulse = pow(pulse, 5.0);
                vec3 neonBlue = vec3(0.0, 0.8, 1.0);
                vec3 wireColor = vec3(0.1, 0.1, 0.1);
                
                // Final color mixes wire base with neon blue pulses scaled by throttle/voltage
                vec3 finalColor = mix(wireColor, neonBlue, pulse * voltage);
                gl_FragColor = vec4(finalColor, 1.0);
            }
        `
    });
    
    const wire = new THREE.Mesh(wireGeo, electricalShader);
    group.add(wire);
    parts.push({ mesh: wire, name: "High-Voltage Wiring Harness", description: "Copper electrical lines with visible electron flow simulation.", function: "Transmits electrical energy from the 12V battery to lighting and control systems." });

    // 6. Tires (Standard meshes)
    const tireGeo = new THREE.TorusGeometry(0.8, 0.3, 16, 64);
    const rearRight = new THREE.Mesh(tireGeo, rubber);
    rearRight.position.set(1.5, 0.8, -1.0);
    const rearLeft = rearRight.clone();
    rearLeft.position.set(-1.5, 0.8, -1.0);
    
    const frontGeo = new THREE.TorusGeometry(0.5, 0.2, 16, 64);
    const frontRight = new THREE.Mesh(frontGeo, rubber);
    frontRight.position.set(1.2, 0.5, 2.5);
    const frontLeft = frontRight.clone();
    frontLeft.position.set(-1.2, 0.5, 2.5);
    
    group.add(rearRight, rearLeft, frontRight, frontLeft);

    // Dynamic Animation Loop
    group.userData.animate = function(time) {
        // Auto-pilot throttle for demo: Oscillates between 0 (idle) and 1 (full power) over 10 seconds
        const state = group.userData.state;
        state.throttle = (Math.sin(time * 0.0005) + 1.0) / 2.0; 
        
        state.rpm = 800 + (state.throttle * 2200); // 800 idle to 3000 max
        state.heat = 0.2 + (state.throttle * 0.8);
        state.electricity = 0.5 + (state.throttle * 1.5); // Lights brighten as RPM increases

        // 1. Update Electrical Flow Speed and Voltage
        electricalShader.uniforms.time.value = time * 0.001;
        electricalShader.uniforms.voltage.value = state.electricity;

        // 2. Update Combustion Particle Physics
        fireShader.uniforms.time.value = time * 0.001;
        fireShader.uniforms.intensity.value = state.heat;
        
        const pos = combustionParticles.geometry.attributes.position.array;
        const lifeAttr = combustionParticles.geometry.attributes.life;
        const lives = lifeAttr.array;
        
        for (let i = 0; i < particleCount; i++) {
            // Move particle up based on velocity and engine RPM
            const rpmFactor = state.rpm / 800; // Base speed multiplier
            pos[i*3+1] += particleVel[i].y * rpmFactor;
            
            // Age particle faster if engine is running hotter
            lives[i] += 0.02 * rpmFactor;
            
            // Reset particle if it dies
            if(lives[i] > 1.0) {
                lives[i] = 0.0;
                pos[i*3] = (Math.random() - 0.5) * 1.2;
                pos[i*3+1] = (Math.random() - 0.5) * 0.8 + 2.5; // Bottom of engine
                pos[i*3+2] = (Math.random() - 0.5) * 1.8 + 1.0;
            }
        }
        combustionParticles.geometry.attributes.position.needsUpdate = true;
        lifeAttr.needsUpdate = true;

        // 3. Rotate Tires based on RPM/Throttle
        const speed = state.throttle * 0.1;
        rearRight.rotation.x -= speed;
        rearLeft.rotation.x -= speed;
        frontRight.rotation.x -= speed;
        frontLeft.rotation.x -= speed;
    };

    group.userData.parts = parts;
    group.userData.quiz = [
        {
            question: "How are the 100,000 physical nuts and bolts rendered without crashing the simulation?",
            options: ["By merging geometries", "By using a single THREE.InstancedMesh", "By drawing them in 2D", "By streaming from a server"],
            correct: 1
        },
        {
            question: "How is the visual flow of electricity simulated in the wiring harness?",
            options: ["Moving 3D electron objects", "A GLSL ShaderMaterial with scrolling UVs", "Texture swapping", "CSS Animations"],
            correct: 1
        },
        {
            question: "What dictates the intensity of the combustion particle simulation?",
            options: ["The battery voltage", "The internal throttle state machine", "The outside air temperature", "The camera angle"],
            correct: 1
        }
    ];

    return group;
}
