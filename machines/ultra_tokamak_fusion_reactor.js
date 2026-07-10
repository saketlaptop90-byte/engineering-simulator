import * as THREE from 'three';

export function createMachine() {
    const group = new THREE.Group();

    // --- 1. Plasma Core (The glowing fusion material) ---
    const plasmaGeometry = new THREE.TorusGeometry(5, 1.5, 64, 100);
    
    // Custom Shader for Plasma
    const plasmaMaterial = new THREE.ShaderMaterial({
        uniforms: {
            time: { value: 0.0 },
            color1: { value: new THREE.Color(0x00ffff) },
            color2: { value: new THREE.Color(0xff00ff) }
        },
        vertexShader: `
            varying vec2 vUv;
            varying vec3 vNormal;
            void main() {
                vUv = uv;
                vNormal = normalize(normalMatrix * normal);
                gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
            }
        `,
        fragmentShader: `
            uniform float time;
            uniform vec3 color1;
            uniform vec3 color2;
            varying vec2 vUv;
            varying vec3 vNormal;
            
            void main() {
                // Intense glowing pulse effect based on time and UV coordinates
                float pulse = sin(vUv.x * 20.0 + time * 5.0) * 0.5 + 0.5;
                float glow = pow(1.0 - abs(dot(vNormal, vec3(0.0, 0.0, 1.0))), 2.0);
                
                vec3 finalColor = mix(color1, color2, pulse) * (glow + 0.5);
                gl_FragColor = vec4(finalColor, 0.9);
            }
        `,
        transparent: true,
        blending: THREE.AdditiveBlending,
        side: THREE.DoubleSide
    });

    const plasma = new THREE.Mesh(plasmaGeometry, plasmaMaterial);
    plasma.userData = { id: 'plasma_core', name: 'Superheated Plasma Core', description: 'Reaches temperatures of 150 million degrees Celsius to fuse hydrogen isotopes.' };
    group.add(plasma);

    // --- 2. Magnetic Confinement Coils (Superconductors) ---
    const coilMaterial = new THREE.MeshStandardMaterial({
        color: 0x222222,
        metalness: 0.9,
        roughness: 0.2,
        emissive: 0x001133
    });

    const numCoils = 24;
    const coilGroup = new THREE.Group();
    const coilGeo = new THREE.TorusGeometry(1.8, 0.3, 16, 32);

    for (let i = 0; i < numCoils; i++) {
        const coil = new THREE.Mesh(coilGeo, coilMaterial);
        const angle = (i / numCoils) * Math.PI * 2;
        
        coil.position.x = Math.cos(angle) * 5;
        coil.position.z = Math.sin(angle) * 5;
        coil.rotation.y = -angle;
        
        coil.userData = { id: `coil_${i}`, name: 'Superconducting Magnetic Coil', description: 'Generates intense toroidal magnetic fields to confine the plasma.' };
        coilGroup.add(coil);
    }
    group.add(coilGroup);

    // --- 3. Inner Poloidal Field Rings ---
    const pfRingGeo = new THREE.TorusGeometry(5, 0.2, 16, 100);
    const pfMaterial = new THREE.MeshStandardMaterial({ color: 0xaaaaaa, metalness: 0.8, roughness: 0.4 });
    
    const pfRingTop = new THREE.Mesh(pfRingGeo, pfMaterial);
    pfRingTop.position.y = 2;
    pfRingTop.rotation.x = Math.PI / 2;
    pfRingTop.userData = { id: 'pf_ring_top', name: 'Poloidal Field Ring (Top)', description: 'Shapes the plasma and stabilizes it vertically.' };
    
    const pfRingBottom = new THREE.Mesh(pfRingGeo, pfMaterial);
    pfRingBottom.position.y = -2;
    pfRingBottom.rotation.x = Math.PI / 2;
    pfRingBottom.userData = { id: 'pf_ring_bottom', name: 'Poloidal Field Ring (Bottom)', description: 'Shapes the plasma and stabilizes it vertically.' };

    group.add(pfRingTop);
    group.add(pfRingBottom);

    // --- 4. Central Solenoid ---
    const solenoidGeo = new THREE.CylinderGeometry(1.5, 1.5, 6, 32);
    const solenoidMat = new THREE.MeshStandardMaterial({
        color: 0x111111,
        metalness: 1.0,
        roughness: 0.3,
        wireframe: true // Looks like extreme complex wiring
    });
    const solenoid = new THREE.Mesh(solenoidGeo, solenoidMat);
    solenoid.userData = { id: 'central_solenoid', name: 'Central Solenoid', description: 'Acts as a huge transformer to induce current in the plasma.' };
    group.add(solenoid);

    // Provide an animation function for the main loop to call
    let time = 0;
    group.userData.animate = function(delta) {
        time += delta;
        plasmaMaterial.uniforms.time.value = time;
        plasma.rotation.y += delta * 0.5; // Plasma spinning
        
        // Slight pulsing of the coils
        const scale = 1.0 + Math.sin(time * 3) * 0.02;
        coilGroup.scale.set(scale, scale, scale);
    };

    return group;
}
